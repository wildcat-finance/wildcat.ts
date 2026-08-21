import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { print } from "graphql";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { wildcat4626WrapperFactoryAbi, wildcatMarketV2Abi } from "../../src/abi";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { Market } from "../../src/market";
import { Token } from "../../src/token";
import {
  GetTokenWrapperForMarketDocument,
  SubgraphTokenWrapperData,
  TokenWrapper,
  WrapperFactory
} from "../../src/wrapper";

const provider = new providers.JsonRpcProvider();

type FakeRpcCall = {
  to?: string;
  data?: `0x${string}`;
};

class FakeViemProvider {
  calls: FakeRpcCall[] = [];
  private readonly getResponse: (call: FakeRpcCall) => string;

  constructor(getResponse: (call: FakeRpcCall) => string) {
    this.getResponse = getResponse;
  }

  async send(method: string, params: unknown[] = []): Promise<unknown> {
    if (method === "eth_chainId") return "0xaa36a7";
    if (method !== "eth_call") throw new Error(`Unexpected RPC method: ${method}`);
    const call = params[0] as FakeRpcCall;
    this.calls.push(call);
    return this.getResponse(call);
  }
}

const token = (address: string, name: string, symbol: string) => ({
  __typename: "Token" as const,
  id: address.toLowerCase(),
  address,
  name,
  symbol,
  decimals: 18,
  isMock: false
});

describe("TokenWrapper subgraph hydration", () => {
  it("hydrates static wrapper metadata without live contract reads", () => {
    const marketAddress = "0x4000000000000000000000000000000000000004";
    const wrapperAddress = "0x5000000000000000000000000000000000000005";
    const data: SubgraphTokenWrapperData = {
      id: wrapperAddress.toLowerCase(),
      address: wrapperAddress,
      marketAddress,
      marketToken: token(marketAddress, "Mock Market", "mMOCK"),
      token: token(wrapperAddress, "Wrapped Mock Market", "wmMOCK"),
      factory: {
        id: "0x2000000000000000000000000000000000000002",
        address: "0x2000000000000000000000000000000000000002"
      },
      deployedEvent: {
        blockNumber: 1,
        blockTimestamp: 2,
        transactionHash: "0x1234"
      }
    };

    const wrapper = TokenWrapper.fromSubgraphData(SupportedChainId.Sepolia, provider, data);

    expect(wrapper.address).to.equal(wrapperAddress);
    expect(wrapper.marketAddress).to.equal(marketAddress);
    expect(wrapper.marketToken.address).to.equal(marketAddress);
    expect(wrapper.marketToken.symbol).to.equal("mMOCK");
    expect(wrapper.shareToken.address).to.equal(wrapperAddress);
    expect(wrapper.shareToken.symbol).to.equal("wmMOCK");
    expect(wrapper.name).to.equal("Wrapped Mock Market");
    expect(wrapper.symbol).to.equal("wmMOCK");
    expect(print(GetTokenWrapperForMarketDocument)).not.to.include("principalBasis");
  });

  it("quotes indexed wrapper interest against the current share balance", async () => {
    const marketAddress = "0x4000000000000000000000000000000000000004";
    const wrapperAddress = "0x5000000000000000000000000000000000000005";
    const account = "0x6000000000000000000000000000000000000006";
    const marketToken = new Token(
      SupportedChainId.Sepolia,
      marketAddress,
      "Mock Market",
      "mMOCK",
      6,
      false,
      provider
    );
    const shareToken = new Token(
      SupportedChainId.Sepolia,
      wrapperAddress,
      "Wrapped Mock Market",
      "wmMOCK",
      6,
      false,
      provider
    );
    const underlyingToken = new Token(
      SupportedChainId.Sepolia,
      "0x7000000000000000000000000000000000000007",
      "USD Coin",
      "USDC",
      6,
      false,
      provider
    );
    const wrapper = new TokenWrapper({
      chainId: SupportedChainId.Sepolia,
      provider,
      address: wrapperAddress,
      marketAddress,
      marketToken,
      shareToken
    });
    wrapper.shareToken.balanceOf = async () => wrapper.shareToken.getAmount(100n);

    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            wildcat4626Wrapper: {
              id: wrapperAddress,
              accounts: [
                {
                  address: account,
                  shares: "100",
                  principalBasis: "100",
                  updatedAtBlock: "10",
                  updatedAtTimestamp: "20",
                  updatedAtTransaction: "0x1234",
                  updatedAtLogIndex: "2"
                }
              ]
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;
    const market = {
      address: marketAddress,
      underlyingToken,
      scaleFactor: (11n * 10n ** 27n) / 10n,
      stateSource: "live"
    } as Market;

    const quote = await wrapper.getInterestOnlyWithdrawalQuote(client, market, {
      account: account.toUpperCase(),
      fetchPolicy: "network-only",
      quotedAtTimestamp: 30
    });

    expect(calls[0].variables).to.deep.equal({
      wrapper: wrapperAddress,
      account
    });
    expect(quote?.status).to.equal("ready");
    expect(quote?.position).to.deep.equal({ kind: "wrapper", address: wrapperAddress });
    expect(quote?.principalBasis.raw).to.equal(100n);
    expect(quote?.availableInterest.raw).to.equal(10n);
    expect(quote?.basisIndexedAt).to.deep.equal({
      blockNumber: 10n,
      blockTimestamp: 20n,
      transactionHash: "0x1234",
      logIndex: 2n
    });
  });

  it("does not query principal basis from legacy production subgraphs", async () => {
    const marketAddress = "0x4000000000000000000000000000000000000004";
    const wrapperAddress = "0x5000000000000000000000000000000000000005";
    const marketToken = new Token(
      SupportedChainId.Mainnet,
      marketAddress,
      "Mock Market",
      "mMOCK",
      6,
      false,
      provider
    );
    const wrapper = new TokenWrapper({
      chainId: SupportedChainId.Mainnet,
      provider,
      address: wrapperAddress,
      marketAddress,
      marketToken,
      shareToken: new Token(
        SupportedChainId.Mainnet,
        wrapperAddress,
        "Wrapped Mock Market",
        "wmMOCK",
        6,
        false,
        provider
      )
    });
    const client = {
      query: async () => {
        throw new Error("legacy principal-basis query should not run");
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    expect(await wrapper.getIndexedAccount(client, { account: wrapperAddress })).to.equal(
      undefined
    );
  });
});

describe("WrapperFactory wrapper discovery", () => {
  it("prefers a wrapper registered directly on a V2.5 market", async () => {
    const market = "0x4000000000000000000000000000000000000004";
    const wrapper = "0x5000000000000000000000000000000000000005";
    const rpc = new FakeViemProvider((call) => {
      const decoded = decodeFunctionData({
        abi: wildcatMarketV2Abi as Abi,
        data: call.data!
      });
      expect(call.to).to.equal(market);
      expect(decoded.functionName).to.equal("registeredWrapper");
      return encodeFunctionResult({
        abi: wildcatMarketV2Abi as Abi,
        functionName: "registeredWrapper",
        result: wrapper
      });
    });

    expect(
      await WrapperFactory.getWrapperForMarket(
        SupportedChainId.Sepolia,
        rpc as unknown as providers.Provider,
        market
      )
    ).to.equal(wrapper);
    expect(rpc.calls).to.have.length(1);
  });

  it("falls back to the wrapper-factory facade for pre-V2.5 markets", async () => {
    const market = "0x4000000000000000000000000000000000000004";
    const wrapper = "0x5000000000000000000000000000000000000005";
    const factory = getDeploymentAddress(SupportedChainId.Sepolia, "Wildcat4626WrapperFactory");
    const rpc = new FakeViemProvider((call) => {
      if (call.to === market) throw new Error("registeredWrapper is unavailable");
      const decoded = decodeFunctionData({
        abi: wildcat4626WrapperFactoryAbi as Abi,
        data: call.data!
      });
      expect(call.to).to.equal(factory);
      expect(decoded.functionName).to.equal("wrapperForMarket");
      return encodeFunctionResult({
        abi: wildcat4626WrapperFactoryAbi as Abi,
        functionName: "wrapperForMarket",
        result: wrapper
      });
    });

    expect(
      await WrapperFactory.getWrapperForMarket(
        SupportedChainId.Sepolia,
        rpc as unknown as providers.Provider,
        market
      )
    ).to.equal(wrapper);
    expect(rpc.calls.map((call) => call.to)).to.deep.equal([market, factory]);
  });
});
