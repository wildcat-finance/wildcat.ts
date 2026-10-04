import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { getMarketRepaymentHistory } from "../../src/gql";
import { GetMarketRepaymentHistoryDocument } from "../../src/gql/graphql";
import { makeAddress } from "../helpers/review-fixtures";

const market = makeAddress(0xab);
const provenance = {
  blockNumber: "12345678",
  blockTimestamp: "1700000200",
  blockLogIndex: "17",
  transactionHash: `0x${"ab".repeat(32)}`
};

describe("indexed repayment history", () => {
  it("separates effective times from recording provenance and pins the requested block", async () => {
    let request: Record<string, unknown> | undefined;
    const client = {
      query: async (args: Record<string, unknown>) => {
        request = args;
        return {
          data: {
            _meta: { block: { number: 12345679 } },
            market: {
              id: market,
              repaymentTerms: { ...provenance, repaymentDate: "1700000000", repaymentPeriod: "60" },
              repaymentDateReached: { ...provenance, effectiveTimestamp: "1700000000" },
              defaultRecord: { ...provenance, effectiveTimestamp: "1700000060" }
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;
    const history = await getMarketRepaymentHistory(client, {
      market: market.toUpperCase().replace("0X", "0x"),
      block: { number: 12345679 },
      fetchPolicy: "network-only"
    });
    expect(request).to.deep.equal({
      query: GetMarketRepaymentHistoryDocument,
      variables: { market, block: { number: 12345679 } },
      fetchPolicy: "network-only"
    });
    expect(history?.indexedBlock).to.equal(12345679);
    expect(history?.terms).to.deep.equal({
      repaymentDate: 1700000000,
      repaymentPeriod: 60,
      blockNumber: 12345678n,
      blockTimestamp: 1700000200n,
      logIndex: 17n,
      transactionHash: provenance.transactionHash
    });
    expect(history?.activation?.effectiveTimestamp).to.equal(1700000000);
    expect(history?.default?.effectiveTimestamp).to.equal(1700000060);
    expect(history?.default?.blockTimestamp).to.equal(1700000200n);
  });

  it("preserves an existing legacy market with no lifecycle records", async () => {
    const client = {
      query: async () => ({
        data: {
          market: {
            id: market,
            repaymentTerms: null,
            repaymentDateReached: null,
            defaultRecord: null
          }
        }
      })
    } as unknown as ApolloClient<NormalizedCacheObject>;
    const history = await getMarketRepaymentHistory(client, { market });
    expect(history?.market).to.equal(market);
    expect(history?.terms).to.equal(undefined);
    expect(history?.activation).to.equal(undefined);
    expect(history?.default).to.equal(undefined);
  });

  it("distinguishes an unindexed market and rejects substituted market identity", async () => {
    const client = {
      query: async () => ({ data: { market: null } })
    } as unknown as ApolloClient<NormalizedCacheObject>;
    expect(await getMarketRepaymentHistory(client, { market })).to.equal(undefined);
    const substituted = {
      query: async () => ({ data: { market: { id: makeAddress(2) } } })
    } as unknown as ApolloClient<NormalizedCacheObject>;
    let error: unknown;
    try {
      await getMarketRepaymentHistory(substituted, { market });
    } catch (cause) {
      error = cause;
    }
    expect(error).to.be.instanceOf(Error);
    expect((error as Error).message).to.contain("Indexed repayment history market");
  });
});
