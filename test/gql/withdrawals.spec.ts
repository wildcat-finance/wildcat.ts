import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { getOperationAST, print } from "graphql";
import { SupportedChainId } from "../../src/constants";
import {
  getActiveLendersByMarket,
  getIncompleteLenderWithdrawalsForMarket,
  getIncompleteWithdrawalsForMarket,
  getLenderWithdrawalsForMarket
} from "../../src/gql";
import { Market } from "../../src/market";
import { Token } from "../../src/token";
import { getAllPendingWithdrawalBatchesForMarket } from "../../src/gql/getAllPendingWithdrawalBatchesForMarket";
import { WithdrawalBatch, BatchStatus } from "../../src/withdrawal-batch";
import { MarketVersion } from "../../src/types";

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

describe("withdrawal subgraph reads", () => {
  it("associates 100 lenders and 200 records with 300 address normalizations", () => {
    const lenders = Array.from({ length: 100 }, (_, i) => makeAddress(200 + i));
    const lenderSet = new Set(lenders);
    const requests = lenders.map((address, i) => ({
      ...request,
      id: `r${i}`,
      account: { ...request.account, address }
    }));
    const executions = lenders.map((address, i) => ({
      ...execution,
      id: `e${i}`,
      account: { ...execution.account, address }
    }));
    const withdrawals = lenders.map((address, i) => ({
      ...withdrawal,
      id: `w${i}`,
      account: { ...withdrawal.account, address }
    }));
    const original = String.prototype.toLowerCase;
    let count = 0;
    let result: WithdrawalBatch;
    try {
      String.prototype.toLowerCase = function () {
        if (lenderSet.has(String(this))) count++;
        return original.call(this);
      };
      result = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, {
        ...batch,
        requests,
        executions,
        withdrawals
      });
    } finally {
      String.prototype.toLowerCase = original;
    }
    expect(count).to.equal(300);
    result.withdrawals.forEach((w, i) => {
      expect(w.requests.map((r) => r.id)).to.deep.equal([`r${i}`]);
      expect(w.executions.map((e) => e.id)).to.deep.equal([`e${i}`]);
    });
  });

  it("preserves case-insensitive record order and independent lender arrays", () => {
    const upper = {
      ...withdrawal,
      account: { ...withdrawal.account, address: lender.toUpperCase() }
    };
    const result = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, {
      ...batch,
      withdrawals: [withdrawal, upper],
      requests: [{ ...request, id: "second" }, request],
      executions: [execution]
    });
    expect(result.withdrawals[1].requests.map((r) => r.id)).to.deep.equal(["second", request.id]);
    result.withdrawals[0].requests.pop();
    result.withdrawals[0].executions.pop();
    expect(result.withdrawals[1].requests).to.have.length(2);
    expect(result.withdrawals[1].executions).to.have.length(1);
    expect(result.requests).to.have.length(2);
  });

  for (const helper of [
    "incomplete-batches",
    "pending-batches",
    "lender-history",
    "incomplete-lender"
  ] as const) {
    it(`paginates all nested withdrawal records for ${helper}`, async () => {
      const count = helper === "incomplete-batches" ? 1_051 : 151;
      const entries = Array.from({ length: count }, (_, i) => String(i).padStart(4, "0"));
      const payments = entries.map((id) => ({
        __typename: "WithdrawalBatchPayment",
        id: `p${id}`,
        scaledAmountBurned: "1",
        normalizedAmountPaid: "1",
        blockNumber: 10,
        blockTimestamp: 20,
        transactionHash: makeAddress(4)
      }));
      const withdrawals = entries.map((id) => ({ ...withdrawal, id: `w${id}` }));
      const requests = entries.map((id) => ({ ...request, id: `r${id}` }));
      const executions = entries.map((id) => ({ ...execution, id: `e${id}` }));
      const calls: QueryCall[] = [];
      const client = {
        query: async (args: QueryCall) => {
          calls.push(args);
          const name = getOperationAST(args.query)?.name?.value;
          const skip = Number(args.variables?.skip ?? 0);
          const page = (items: unknown[]) => items.slice(skip, skip + 100);
          if (name === "getWithdrawalBatchChildren") {
            expect(args.variables?.block).to.deep.equal({ number: 777 });
            expect(args.fetchPolicy).to.equal("no-cache");
            return {
              data: {
                withdrawalBatch: {
                  payments: page(payments),
                  withdrawals: page(withdrawals),
                  requests: page(requests),
                  executions: page(executions)
                }
              }
            };
          }
          if (name === "getLenderWithdrawalChildren") {
            expect(args.variables?.block).to.deep.equal({ number: 777 });
            expect(args.fetchPolicy).to.equal("no-cache");
            return {
              data: {
                lenderWithdrawalStatus: { requests: page(requests), executions: page(executions) }
              }
            };
          }
          const initialBatch = {
            ...batch,
            paymentsCount: count,
            payments: page(payments),
            withdrawals: page(withdrawals),
            requests: page(requests),
            executions: page(executions)
          };
          const initialWithdrawal = {
            ...withdrawal,
            batch: initialBatch,
            requests: page(requests),
            executions: page(executions)
          };
          return {
            data: {
              _meta: { block: { number: 777 } },
              market: {
                withdrawalBatches: [initialBatch],
                lenders: [{ incompleteWithdrawals: [initialWithdrawal], completeWithdrawals: [] }]
              }
            }
          };
        }
      } as unknown as ApolloClient<NormalizedCacheObject>;
      if (helper.endsWith("batches")) {
        const result =
          helper === "incomplete-batches"
            ? await getIncompleteWithdrawalsForMarket(client, { market })
            : await getAllPendingWithdrawalBatchesForMarket(client, market, "cache-first");
        expect(result[0].withdrawals).to.have.length(count);
        expect(result[0].payments).to.have.length(count);
        expect(result[0].requests.map((r) => r.id)).to.deep.equal(requests.map((r) => r.id));
        expect(result[0].executions.map((e) => e.id)).to.deep.equal(executions.map((e) => e.id));
      } else {
        const result =
          helper === "lender-history"
            ? (await getLenderWithdrawalsForMarket(client, { market, lender }))
                .incompleteWithdrawals
            : await getIncompleteLenderWithdrawalsForMarket(client, { market, lender });
        expect(result[0].requests).to.have.length(count);
        expect(result[0].executions).to.have.length(count);
        expect(result[0].batch.payments).to.have.length(count);
      }
      expect(calls.length).to.be.greaterThan(1);
    });
  }

  it("pages the full pending-batch list at one block", async () => {
    const all = Array.from({ length: 151 }, (_, i) => ({
      ...batch,
      id: `batch-${String(i).padStart(4, "0")}`,
      withdrawals: [],
      requests: [],
      executions: []
    }));
    const calls: QueryCall[] = [];
    const client = {
      query: async (args: QueryCall) => {
        calls.push(args);
        const skip = Number(args.variables?.skip ?? 0);
        return {
          data: {
            _meta: { block: { number: 777 } },
            market: { withdrawalBatches: all.slice(skip, skip + 100) }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;
    expect(
      await getAllPendingWithdrawalBatchesForMarket(client, market, "cache-first")
    ).to.have.length(151);
    expect(calls).to.have.length(2);
    expect(calls[1].variables).to.include({ skip: 100 });
    expect(calls[1].variables?.block).to.deep.equal({ number: 777 });
  });

  for (const fault of ["missing-block", "stalled-page"] as const) {
    it(`rejects ${fault} instead of returning an incomplete history`, async () => {
      const requests = Array.from({ length: 100 }, (_, i) => ({
        ...request,
        id: String(i).padStart(4, "0")
      }));
      const { client } = createClient({
        _meta: fault === "missing-block" ? null : { block: { number: 777 } },
        market: { withdrawalBatches: [{ ...batch, withdrawals: [], requests, executions: [] }] },
        withdrawalBatch: { payments: [], withdrawals: [], requests, executions: [] }
      });
      let error: unknown;
      try {
        await getIncompleteWithdrawalsForMarket(client, { market });
      } catch (caught) {
        error = caught;
      }
      expect(String(error)).to.include(
        fault === "missing-block" ? "indexed block number" : "did not advance"
      );
    });
  }

  it("recognizes an indexed early-closed batch while retaining an active pending batch", () => {
    const expiry = Math.floor(Date.now() / 1000) + 1_000;
    const closedMarket = {
      ...market,
      version: MarketVersion.V2,
      isClosed: true,
      pendingWithdrawalExpiry: 0
    } as Market;
    expect(
      WithdrawalBatch.fromSubgraphWithdrawalBatch(closedMarket, {
        ...batch,
        expiry: String(expiry)
      }).status
    ).to.equal(BatchStatus.Complete);
    closedMarket.pendingWithdrawalExpiry = expiry;
    expect(
      WithdrawalBatch.fromSubgraphWithdrawalBatch(closedMarket, {
        ...batch,
        isExpired: false,
        expiry: String(expiry)
      }).status
    ).to.equal(BatchStatus.Pending);
  });

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

  it("uses the V2.0 lender-withdrawal ordering on legacy chains", async () => {
    const legacyMarket = {
      ...market,
      chainId: SupportedChainId.Mainnet
    } as Market;
    const response = {
      market: {
        __typename: "Market",
        lenders: [
          {
            __typename: "LenderAccount",
            incompleteWithdrawals: [],
            completeWithdrawals: []
          }
        ]
      }
    };
    const historyClient = createClient(response);
    const incompleteClient = createClient(response);

    await getLenderWithdrawalsForMarket(historyClient.client, {
      market: legacyMarket,
      lender
    });
    await getIncompleteLenderWithdrawalsForMarket(incompleteClient.client, {
      market: legacyMarket,
      lender
    });

    expect(getOperationAST(historyClient.calls[0].query)?.name?.value).to.equal(
      "legacyGetLenderWithdrawalsForMarket"
    );
    expect(historyClient.calls[0].variables?.orderWithdrawals).to.equal("batch__expiry");
    expect(getOperationAST(incompleteClient.calls[0].query)?.name?.value).to.equal(
      "legacyGetIncompleteLenderWithdrawalsForMarket"
    );
    expect(incompleteClient.calls[0].variables?.orderWithdrawals).to.equal("batch__expiry");
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
