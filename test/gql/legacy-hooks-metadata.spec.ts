import { createServer, Server } from "http";
import { AddressInfo } from "net";
import { expect } from "chai";
import { createSubgraphClient, SupportedChainId } from "../../src/config";
import { HooksKind } from "../../src/domain";
import { getHooksTemplateRegistrations } from "../../src/gql";

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

describe("legacy hooks metadata routing", () => {
  it("reads legacy templates as factory-scoped registration metadata", async () => {
    const operations: string[] = [];
    const template = "0x0000000000000000000000000000000000000011";
    const factory = "0x0000000000000000000000000000000000000022";
    const archController = "0x0000000000000000000000000000000000000033";
    const sentinel = "0x0000000000000000000000000000000000000044";
    const server = createServer((request, response) => {
      let body = "";
      request.on("data", (chunk) => {
        body += String(chunk);
      });
      request.on("end", () => {
        const operationName = JSON.parse(body).operationName as string;
        operations.push(operationName);
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            data: {
              hooksTemplates: [
                {
                  id: template,
                  name: "OpenTermHooks",
                  feeRecipient: sentinel,
                  protocolFeeBips: 25,
                  originationFeeAsset: null,
                  originationFeeAmount: "0",
                  disabled: false,
                  hooksFactory: {
                    id: factory,
                    archController: { id: archController },
                    sentinel,
                    isRegistered: true
                  }
                }
              ]
            }
          })
        );
      });
    });
    const endpoint = await listen(server);
    const client = createSubgraphClient(SupportedChainId.Mainnet, endpoint);

    try {
      const registrations = await getHooksTemplateRegistrations(client, {
        fetchPolicy: "no-cache"
      });

      expect(operations).to.deep.equal(["legacyGetHooksTemplateRegistrations"]);
      expect(registrations).to.have.lengthOf(1);
      expect(registrations[0].hooksTemplate).to.deep.include({
        address: template,
        kind: HooksKind.OpenTerm,
        version: "legacy-v2"
      });
      expect(registrations[0].hooksFactory).to.deep.include({
        address: factory,
        archController,
        sentinel,
        eventGeneration: "legacy",
        isRegistered: true
      });
    } finally {
      client.stop();
      await close(server);
    }
  });
});
