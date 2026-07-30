import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { print } from "graphql";
import { getIndexedLenderAccountSummaryForMarket } from "../../src/gql";
import { SubgraphLenderStatus } from "../../src/gql/graphql";
import { Market } from "../../src/market";
import { SupportedChainId } from "../../src/constants";
import { Token } from "../../src/token";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const provider = new providers.JsonRpcProvider();
const marketAddress = makeAddress(1);
const lender = makeAddress(2);
const underlyingToken = new Token(
  SupportedChainId.Sepolia,
  makeAddress(3),
  "USD Coin",
  "USDC",
  6,
  false,
  provider
);
const marketToken = new Token(
  SupportedChainId.Sepolia,
  marketAddress,
  "Wildcat USDC",
  "WUSDC",
  18,
  false,
  provider
);
const scaleFactor = 10n ** 27n;
const market = {
  address: marketAddress.toUpperCase(),
  chainId: SupportedChainId.Sepolia,
  marketToken,
  underlyingToken,
  scaleFactor,
  lastInterestAccruedTimestamp: 1_700_000_000,
  stateSource: "indexed"
} as unknown as Market;

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

describe("indexed lender-account summary", () => {
  it("hydrates current indexed state without requesting deposit history", async () => {
    const { client, calls } = createClient({
      market: {
        __typename: "Market",
        id: marketAddress,
        lenders: [
          {
            __typename: "LenderAccount",
            id: `${marketAddress}-${lender}`,
            address: lender,
            scaledBalance: "25",
            role: SubgraphLenderStatus.WithdrawOnly,
            totalDeposited: "100",
            lastScaleFactor: scaleFactor.toString(),
            lastUpdatedTimestamp: 1_700_000_000,
            totalInterestEarned: "5",
            numPendingWithdrawalBatches: 1,
            controllerAuthorization: null,
            hooksAccess: null,
            knownLenderStatus: null,
            snapshot: null
          }
        ]
      }
    });

    const account = await getIndexedLenderAccountSummaryForMarket(client, {
      market,
      lender: lender.toUpperCase(),
      fetchPolicy: "network-only"
    });

    expect(calls[0].variables).to.deep.equal({
      market: marketAddress,
      lender
    });
    expect(calls[0].fetchPolicy).to.equal("network-only");
    expect(print(calls[0].query)).not.to.match(/\bdeposits\s*\(/);
    expect(account.depositRecords).to.deep.equal([]);
    expect(account.totalDeposited?.raw).to.equal(100n);
    expect(account.totalInterestEarned?.raw).to.equal(5n);
    expect(account.hasEverInteracted).to.equal(true);
    expect(account.stateSource).to.equal("indexed");
  });

  it("returns an empty account when the market has no indexed lender entity", async () => {
    const { client } = createClient({
      market: {
        __typename: "Market",
        id: marketAddress,
        lenders: []
      }
    });

    const account = await getIndexedLenderAccountSummaryForMarket(client, {
      market,
      lender
    });

    expect(account.account).to.equal(lender);
    expect(account.depositRecords).to.deep.equal([]);
    expect(account.hasEverInteracted).to.equal(false);
  });
});
