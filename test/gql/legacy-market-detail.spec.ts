import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { getOperationAST } from "graphql";
import {
  getIndexedLenderAccountSummaryForMarket,
  getIndexedMarket,
  getLenderAccountForMarket
} from "../../src/gql";
import { Market } from "../../src/market";
import { SupportedChainId } from "../../src/constants";
import { Token } from "../../src/token";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

type QueryCall = {
  query: DocumentNode;
  variables?: Record<string, unknown>;
  fetchPolicy?: string;
};

const createClient = (data: Record<string, unknown>) => {
  const calls: QueryCall[] = [];
  const client = {
    query: async (args: QueryCall) => {
      calls.push(args);
      return { data };
    }
  } as unknown as ApolloClient<NormalizedCacheObject>;
  return { client, calls };
};

describe("legacy market detail routing", () => {
  it("uses the V2.0 market document for legacy chains", async () => {
    const marketAddress = makeAddress(1);
    const { client, calls } = createClient({ market: null });

    const market = await getIndexedMarket(client, {
      chainId: SupportedChainId.Mainnet,
      signerOrProvider: new providers.JsonRpcProvider(),
      market: marketAddress.toUpperCase(),
      shouldSkipRecords: true,
      fetchPolicy: "network-only"
    });

    expect(market).to.equal(undefined);
    expect(getOperationAST(calls[0].query)?.name?.value).to.equal("legacyGetMarket");
    expect(calls[0].variables?.market).to.equal(marketAddress);
  });

  it("uses the V2.0 lender-account document for a legacy market", async () => {
    const provider = new providers.JsonRpcProvider();
    const marketAddress = makeAddress(2);
    const lender = makeAddress(3);
    const token = new Token(
      SupportedChainId.Mainnet,
      makeAddress(4),
      "USD Coin",
      "USDC",
      6,
      false,
      provider
    );
    const market = {
      address: marketAddress,
      chainId: SupportedChainId.Mainnet,
      marketToken: token,
      underlyingToken: token,
      scaleFactor: 10n ** 27n,
      lastInterestAccruedTimestamp: 0,
      stateSource: "indexed"
    } as unknown as Market;
    const { client, calls } = createClient({
      market: { __typename: "Market", id: marketAddress, lenders: [] }
    });

    const account = await getLenderAccountForMarket(client, {
      market,
      lender: lender.toUpperCase(),
      fetchPolicy: "network-only"
    });

    expect(account.account).to.equal(lender);
    expect(getOperationAST(calls[0].query)?.name?.value).to.equal(
      "legacyGetLenderAccountForMarket"
    );
    expect(calls[0].variables).to.deep.include({ market: marketAddress, lender });
  });

  it("uses the compact V2.0 lender-account document for a legacy market", async () => {
    const provider = new providers.JsonRpcProvider();
    const marketAddress = makeAddress(5);
    const lender = makeAddress(6);
    const token = new Token(
      SupportedChainId.Mainnet,
      makeAddress(7),
      "USD Coin",
      "USDC",
      6,
      false,
      provider
    );
    const market = {
      address: marketAddress,
      chainId: SupportedChainId.Mainnet,
      marketToken: token,
      underlyingToken: token,
      scaleFactor: 10n ** 27n,
      lastInterestAccruedTimestamp: 0,
      stateSource: "indexed"
    } as unknown as Market;
    const { client, calls } = createClient({
      market: { __typename: "Market", id: marketAddress, lenders: [] }
    });

    const account = await getIndexedLenderAccountSummaryForMarket(client, {
      market,
      lender: lender.toUpperCase(),
      fetchPolicy: "network-only"
    });

    expect(account.account).to.equal(lender);
    expect(getOperationAST(calls[0].query)?.name?.value).to.equal(
      "legacyGetIndexedLenderAccountSummaryForMarket"
    );
    expect(calls[0].variables).to.deep.equal({ market: marketAddress, lender });
  });
});
