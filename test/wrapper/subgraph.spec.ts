import { expect } from "chai";
import { providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { wildcat4626WrapperFactoryAbi, wildcatMarketV2Abi } from "../../src/abi";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { SubgraphTokenWrapperData, TokenWrapper, WrapperFactory } from "../../src/wrapper";

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
