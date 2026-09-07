import { createServer, Server } from "http";
import { AddressInfo } from "net";
import { expect } from "chai";
import {
  getLatestTokenUsdPrices,
  getLenderTransferPage,
  getMarketDailyStatsPage
} from "../../src/analytics";
import { createSubgraphClient, SupportedChainId } from "../../src/config";

const listen = (server: Server): Promise<string> =>
  new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolve(`http://127.0.0.1:${port}/graphql`);
    });
  });

const close = (server: Server): Promise<void> =>
  new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

describe("legacy analytics routing", () => {
  it("batches legacy prices while preserving pegs, missing observations and input order", async () => {
    const tokens = Array.from({ length: 20 }, (_, i) => ({
      id: `0x${(100 + i).toString(16).padStart(40, "0")}`,
      address: `0x${(100 + i).toString(16).padStart(40, "0")}`,
      name: "Asset",
      symbol: "AST",
      decimals: 6,
      isMock: false,
      isUsdStablecoin: i === 0,
      priceFeed0: i === 1 ? null : `0x${"f".repeat(40)}`,
      priceFeed1: null
    }));
    const requests: Array<{
      operationName: string;
      query: string;
      variables: Record<string, any>;
    }> = [];
    const server = createServer((request, response) => {
      let body = "";
      request.on("data", (chunk) => {
        body += String(chunk);
      });
      request.on("end", () => {
        const payload = JSON.parse(body);
        requests.push(payload);
        const data =
          payload.operationName === "legacyGetAnalyticsTokens"
            ? { tokens: tokens.slice(0, -1) }
            : Object.fromEntries(
                Object.entries(payload.variables)
                  .filter(([key]) => key.startsWith("filter"))
                  .map(([key, value]) => {
                    const token = tokens.find(
                      (token) => token.address === (value as { token: string }).token
                    )!;
                    return [
                      key.replace("filter", "price"),
                      token === tokens[2]
                        ? []
                        : [
                            {
                              id: `price-${token.address}`,
                              token,
                              timestamp: 456,
                              priceUSD: "2.25"
                            }
                          ]
                    ];
                  })
              );
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            data: {
              ...data,
              _meta: {
                deployment: "legacy",
                hasIndexingErrors: false,
                block: { number: 123, timestamp: 456, hash: null }
              }
            }
          })
        );
      });
    });
    const client = createSubgraphClient(SupportedChainId.Mainnet, await listen(server));
    try {
      const result = await getLatestTokenUsdPrices(client, {
        tokens: [...tokens.map((token) => token.address), tokens[0].address.toUpperCase()],
        fetchPolicy: "no-cache"
      });
      expect(result.prices.map((price) => price.address)).to.deep.equal(
        tokens.map((token) => token.address)
      );
      expect(result.prices[0]).to.include({
        status: "priced",
        priceUSD: "1",
        basis: "configured-peg"
      });
      expect(result.prices[1]).to.include({ status: "unpriced", reason: "no-price-source" });
      expect(result.prices[2]).to.include({ status: "unpriced", reason: "no-observation" });
      expect(result.prices[3]).to.include({
        status: "priced",
        priceUSD: "2.25",
        source: "chainlink-direct"
      });
      expect(result.prices[19]).to.include({ status: "unpriced", reason: "token-not-indexed" });
      expect(requests.map((request) => request.operationName)).to.deep.equal([
        "legacyGetAnalyticsTokens",
        "legacyGetLatestTokenPriceObservationBatch"
      ]);
      expect(requests[1].variables.block).to.deep.equal({ number: 123 });
      expect(requests[1].query).not.to.include("observedAtBlock");
      expect(requests[1].query).not.to.include("priceSource");
    } finally {
      client.stop();
      await close(server);
    }
  });

  it("uses compatible documents and does not query V2.5 deployment metadata", async () => {
    const requests: Array<{ operationName: string; variables: Record<string, unknown> }> = [];
    const server = createServer((request, response) => {
      let body = "";
      request.on("data", (chunk) => {
        body += String(chunk);
      });
      request.on("end", () => {
        const payload = JSON.parse(body) as {
          operationName: string;
          variables: Record<string, unknown>;
        };
        requests.push(payload);
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            data: {
              _meta: {
                deployment: "legacy-deployment",
                hasIndexingErrors: false,
                block: { number: 123, timestamp: 456, hash: null }
              },
              ...(payload.operationName === "legacyGetMarketDailyStatsPage"
                ? { marketDailyStats_collection: [] }
                : { transfers: [] })
            }
          })
        );
      });
    });
    const endpoint = await listen(server);
    const client = createSubgraphClient(SupportedChainId.Mainnet, endpoint);
    const lender = "0x0000000000000000000000000000000000000011";

    try {
      const dailyStats = await getMarketDailyStatsPage(client, {
        first: 1,
        fetchPolicy: "no-cache"
      });
      const transfers = await getLenderTransferPage(client, {
        lender,
        first: 1,
        fetchPolicy: "no-cache"
      });

      expect(dailyStats.items).to.deep.equal([]);
      expect(transfers.items).to.deep.equal([]);
      expect(requests.map(({ operationName }) => operationName)).to.deep.equal([
        "legacyGetMarketDailyStatsPage",
        "legacyGetLenderTransferPage"
      ]);
      const transferFilter = requests[1].variables.filter as {
        id_gt?: string;
        or: Array<Record<string, unknown>>;
      };
      expect(transferFilter.id_gt).to.equal(undefined);
      expect(transferFilter.or).to.have.lengthOf(2);
      expect(transferFilter.or.every((branch) => branch.id_gt === "")).to.equal(true);
    } finally {
      client.stop();
      await close(server);
    }
  });
});
