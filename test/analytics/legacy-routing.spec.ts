import { createServer, Server } from "http";
import { AddressInfo } from "net";
import { expect } from "chai";
import { getLenderTransferPage, getMarketDailyStatsPage } from "../../src/analytics";
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
