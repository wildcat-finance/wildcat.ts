import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { print } from "graphql";
import { SupportedChainId } from "../../src/constants";
import {
  getActiveLendersByMarket,
  getIncompleteLenderWithdrawalsForMarket,
  getIncompleteWithdrawalsForMarket,
  getLenderWithdrawalsForMarket
} from "../../src/gql";
import { Market } from "../../src/market";
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

const market = {
  address: marketAddress,
  underlyingToken,
  scaleFactor: 10n ** 27n
} as unknown as Market;

const request = {
  __typename: "WithdrawalRequest" as const,
  id: "request-1",
  eventIndex: 1,
  requestIndex: 1,
  account: { __typename: "LenderAccount" as const, address: lender },
  scaledAmount: "100",
  normalizedAmount: "100",
  blockNumber: 10,
  blockTimestamp: 20,
  transactionHash: makeAddress(4)
};

const execution = {
  __typename: "WithdrawalExecution" as const,
  id: "execution-1",
  account: { __typename: "LenderAccount" as const, address: lender },
  normalizedAmount: "25",
  blockNumber: 11,
  blockTimestamp: 21,
  transactionHash: makeAddress(5)
};

const withdrawal = {
  __typename: "LenderWithdrawalStatus" as const,
  id: "withdrawal-1",
  account: { __typename: "LenderAccount" as const, address: lender },
  requestsCount: 1,
  executionsCount: 1,
  scaledAmount: "100",
  normalizedAmountWithdrawn: "25",
  totalNormalizedRequests: "100",
  isCompleted: false
};

const batch = {
  __typename: "WithdrawalBatch" as const,
  id: "batch-1",
  expiry: "1",
  scaledTotalAmount: "100",
  scaledAmountBurned: "100",
  normalizedAmountPaid: "100",
  normalizedAmountClaimed: "25",
  totalNormalizedRequests: "100",
  isExpired: true,
  isClosed: true,
  isCompleted: false,
  paymentsCount: 0,
  lastScaleFactor: (10n ** 27n).toString(),
  lastUpdatedTimestamp: 21,
  totalInterestEarned: "0",
  creation: {
    __typename: "WithdrawalBatchCreated" as const,
    blockNumber: 9,
    blockTimestamp: 19,
    transactionHash: makeAddress(6)
  },
  payments: []
};

type QueryCall = {
  query: DocumentNode;
  variables?: Record<string, unknown>;
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

describe("withdrawal subgraph reads", () => {
  it("returns paid-but-unclaimed batches and reconnects their lender events", async () => {
    const { client, calls } = createClient({
      market: {
        __typename: "Market",
        withdrawalBatches: [
          {
            ...batch,
            withdrawals: [withdrawal],
            requests: [request],
            executions: [execution]
          }
        ]
      }
    });

    const batches = await getIncompleteWithdrawalsForMarket(client, {
      market,
      first: 25,
      skip: 5,
      fetchPolicy: "no-cache"
    });

    expect(calls[0].variables).to.deep.equal({
      market: marketAddress,
      numWithdrawalBatches: 25,
      skipWithdrawalBatches: 5,
      orderWithdrawalBatches: "expiry",
      directionWithdrawalBatches: "desc"
    });
    expect(print(calls[0].query)).to.include("where: {isCompleted: false}");
    expect(batches).to.have.length(1);
    expect(batches[0].isClosed).to.equal(true);
    expect(batches[0].isCompleted).to.equal(false);
    expect(batches[0].withdrawals[0].requests.map(({ id }) => id)).to.deep.equal([request.id]);
    expect(batches[0].withdrawals[0].executions.map(({ id }) => id)).to.deep.equal([execution.id]);
  });

  it("hydrates complete and incomplete lender withdrawal history", async () => {
    const { client, calls } = createClient({
      market: {
        __typename: "Market",
        lenders: [
          {
            __typename: "LenderAccount",
            incompleteWithdrawals: [
              { ...withdrawal, batch, requests: [request], executions: [execution] }
            ],
            completeWithdrawals: []
          }
        ]
      }
    });

    const history = await getLenderWithdrawalsForMarket(client, {
      market,
      lender: lender.toUpperCase(),
      first: 50,
      skip: 10,
      fetchPolicy: "network-only"
    });

    expect(calls[0].variables).to.deep.equal({
      market: marketAddress,
      lender,
      numWithdrawals: 50,
      skipWithdrawals: 10,
      orderWithdrawals: "batchExpiry",
      directionWithdrawals: "desc"
    });
    expect(history.completeWithdrawals).to.deep.equal([]);
    expect(history.incompleteWithdrawals).to.have.length(1);
    expect(history.incompleteWithdrawals[0].lender).to.equal(lender);
    expect(history.incompleteWithdrawals[0].requests.map(({ id }) => id)).to.deep.equal([
      request.id
    ]);
    expect(history.incompleteWithdrawals[0].executions.map(({ id }) => id)).to.deep.equal([
      execution.id
    ]);
  });

  it("hydrates only incomplete lender withdrawals for the action path", async () => {
    const { client, calls } = createClient({
      market: {
        __typename: "Market",
        lenders: [
          {
            __typename: "LenderAccount",
            incompleteWithdrawals: [
              { ...withdrawal, batch, requests: [request], executions: [execution] }
            ]
          }
        ]
      }
    });

    const withdrawals = await getIncompleteLenderWithdrawalsForMarket(client, {
      market,
      lender: lender.toUpperCase(),
      first: 25,
      skip: 5,
      fetchPolicy: "network-only"
    });

    expect(calls[0].variables).to.deep.equal({
      market: marketAddress,
      lender,
      numWithdrawals: 25,
      skipWithdrawals: 5,
      orderWithdrawals: "batchExpiry",
      directionWithdrawals: "desc"
    });
    expect(print(calls[0].query)).to.include("where: {isCompleted: false}");
    expect(print(calls[0].query)).not.to.match(/\bcompleteWithdrawals:/);
    expect(withdrawals).to.have.length(1);
    expect(withdrawals[0].lender).to.equal(lender);
    expect(withdrawals[0].requests.map(({ id }) => id)).to.deep.equal([request.id]);
    expect(withdrawals[0].executions.map(({ id }) => id)).to.deep.equal([execution.id]);
  });

  it("accepts a Market in the active-lender options without a cast", async () => {
    const { client, calls } = createClient({
      market: { __typename: "Market", lenders: [] }
    });

    const lenders = await getActiveLendersByMarket(client, {
      market,
      numAccounts: 25,
      fetchPolicy: "no-cache"
    });

    expect(lenders).to.deep.equal([]);
    expect(calls[0].variables).to.deep.include({ market: marketAddress, numAccounts: 25 });
  });
});
