import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { getMarketEventPage } from "../../src/gql";
import { SubgraphMarketEventKind } from "../../src/gql/graphql";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

describe("normalized market event pagination", () => {
  it("uses a stable sequence cursor while retaining event identity", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const market = makeAddress(1);
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            marketEvents: [
              {
                __typename: "MarketEvent",
                id: "event-10",
                sequence: 10,
                kind: SubgraphMarketEventKind.BORROW,
                blockNumber: "100",
                blockTimestamp: "1700000100",
                transactionHash: makeAddress(2),
                logIndex: "3",
                market: { __typename: "Market", address: market }
              },
              {
                __typename: "MarketEvent",
                id: "event-11",
                sequence: 11,
                kind: SubgraphMarketEventKind.DEBT_REPAID,
                blockNumber: "101",
                blockTimestamp: "1700000101",
                transactionHash: makeAddress(3),
                logIndex: "4",
                market: { __typename: "Market", address: market }
              }
            ]
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const page = await getMarketEventPage(client, {
      market: market.toUpperCase(),
      fromSequence: 10,
      first: 2,
      fetchPolicy: "no-cache"
    });

    expect(calls[0].variables).to.deep.equal({
      market,
      fromSequence: 10,
      first: 2
    });
    expect(page.events.map(({ sequence, kind }) => ({ sequence, kind }))).to.deep.equal([
      { sequence: 10, kind: "borrow" },
      { sequence: 11, kind: "debt-repaid" }
    ]);
    expect(page.events[0]).to.deep.include({
      market,
      blockNumber: 100n,
      blockTimestamp: 1_700_000_100n,
      logIndex: 3n
    });
    expect(page.nextSequence).to.equal(12);
  });
});
