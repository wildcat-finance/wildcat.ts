import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation
} from "@apollo/client";
import { expect } from "chai";
import {
  getAnalyticsTokenPrices,
  getBorrowerAnalyticsDailyPage,
  getProtocolAnalyticsStats,
  normalizeAnalyticsPageRequest
} from "../src/analytics";

type OperationHandler = (variables: Record<string, unknown>) => Record<string, unknown>;

const metadata = {
  deployment: "test-deployment",
  hasIndexingErrors: false,
  block: {
    number: 123,
    timestamp: 456,
    hash: `0x${"a".repeat(64)}`
  }
};

const createClient = (
  handlers: Record<string, OperationHandler>
): { client: ApolloClient<NormalizedCacheObject>; operations: Operation[] } => {
  const operations: Operation[] = [];
  const link = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        operations.push(operation);
        try {
          const handler = handlers[operation.operationName];
          if (!handler) throw new Error(`Unhandled operation ${operation.operationName}`);
          observer.next({ data: { _meta: metadata, ...handler(operation.variables) } });
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })
  );
  return {
    client: new ApolloClient({ cache: new InMemoryCache(), link }),
    operations
  };
};

describe("legacy-compatible analytics reads", () => {
  it("normalizes and validates fixed-block page cursors", () => {
    expect(normalizeAnalyticsPageRequest()).to.deep.equal({
      first: 100,
      afterId: "",
      block: undefined
    });
    expect(
      normalizeAnalyticsPageRequest({
        first: 17,
        after: { entityId: "cursor", blockNumber: 123 }
      })
    ).to.deep.equal({ first: 17, afterId: "cursor", block: { number: 123 } });
    expect(() => normalizeAnalyticsPageRequest({ first: 0 })).to.throw(
      "Invalid analytics page size"
    );
    expect(() =>
      normalizeAnalyticsPageRequest({
        after: { entityId: "cursor", blockNumber: 123 },
        block: { number: 124 }
      })
    ).to.throw("Analytics page cursor block does not match block");
  });

  it("returns protocol stats with explicit indexer metadata", async () => {
    const { client } = createClient({
      getProtocolAnalyticsStats: () => ({
        protocolStats: { id: "PROTOCOL_STATS", totalDepositedUSD: "123.456" }
      })
    });
    const result = await getProtocolAnalyticsStats(client, { fetchPolicy: "no-cache" });
    expect(result.indexedAt).to.deep.equal({
      deployment: "test-deployment",
      hasIndexingErrors: false,
      blockNumber: 123,
      blockTimestamp: 456,
      blockHash: metadata.block.hash
    });
    expect(result.value?.totalDepositedUSD).to.equal("123.456");
  });

  it("lower-cases borrower filters and pins continuations to the cursor block", async () => {
    const borrower = "0x00000000000000000000000000000000000000AB";
    const { client, operations } = createClient({
      getBorrowerAnalyticsDailyPage: () => ({ borrowerDailyStats_collection: [] })
    });
    await getBorrowerAnalyticsDailyPage(client, borrower, {
      first: 25,
      after: { entityId: "BORROWER-DAILY-cursor", blockNumber: 123 },
      fromTimestamp: 100,
      toTimestamp: 200,
      fetchPolicy: "no-cache"
    });
    expect(operations[0]?.variables).to.deep.equal({
      first: 25,
      filter: {
        borrower: borrower.toLowerCase(),
        id_gt: "BORROWER-DAILY-cursor",
        startTimestamp_gte: 100,
        startTimestamp_lt: 200
      },
      block: { number: 123 }
    });
  });

  it("returns stablecoin fallback prices without overwriting them with observations", async () => {
    const stable = "0x0000000000000000000000000000000000000001";
    const volatile = "0x0000000000000000000000000000000000000002";
    const token = (address: string, isUsdStablecoin: boolean) => ({
      id: address,
      address,
      name: "Token",
      symbol: "TKN",
      decimals: 18,
      isMock: false,
      isUsdStablecoin,
      priceFeed0: null,
      priceFeed1: null,
      lastPriceFeedSearchDay: 0
    });
    const stableToken = token(stable, true);
    const volatileToken = token(volatile, false);
    const { client, operations } = createClient({
      getAnalyticsTokenPrices: () => ({
        tokens: [stableToken, volatileToken],
        tokenDailyPrices: [
          { id: "stable-price", timestamp: 2, priceUSD: "0.999", token: stableToken },
          { id: "volatile-new", timestamp: 2, priceUSD: "65000.25", token: volatileToken },
          { id: "volatile-old", timestamp: 1, priceUSD: "64000", token: volatileToken }
        ]
      })
    });
    const result = await getAnalyticsTokenPrices(client, [stable.toUpperCase(), volatile], {
      fetchPolicy: "no-cache"
    });
    expect(operations[0]?.variables.tokens).to.deep.equal([stable, volatile]);
    expect(result.latestPriceByToken).to.deep.equal({
      [stable]: "1",
      [volatile]: "65000.25"
    });
  });

  it("recovers a latest token price omitted by the global observation window", async () => {
    const address = "0x0000000000000000000000000000000000000003";
    const token = {
      id: address,
      address,
      name: "Token",
      symbol: "TKN",
      decimals: 18,
      isMock: false,
      isUsdStablecoin: false,
      priceFeed0: "0x0000000000000000000000000000000000000004",
      priceFeed1: null,
      lastPriceFeedSearchDay: 0
    };
    const observation = { id: "price", timestamp: 1, priceUSD: "123.45", token };
    const { client, operations } = createClient({
      getAnalyticsTokenPrices: (variables) => ({
        tokens: [token],
        tokenDailyPrices: variables.block ? [observation] : []
      })
    });

    const result = await getAnalyticsTokenPrices(client, [address], {
      fetchPolicy: "no-cache"
    });

    expect(operations).to.have.length(2);
    expect(operations[1]?.variables).to.deep.equal({
      tokens: [address],
      first: 1,
      block: { number: 123 }
    });
    expect(result.observations).to.deep.equal([observation]);
    expect(result.latestPriceByToken).to.deep.equal({ [address]: "123.45" });
  });
});
