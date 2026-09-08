import { expect } from "chai";
import { providers } from "ethers";
import { createServer, Server } from "http";
import { AddressInfo } from "net";
import { createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import {
  createRpcTransport,
  DefaultRpcTimeoutMs,
  getRpcConnection,
  SupportedChainId
} from "../../src";

const listen = (server: Server): Promise<string> =>
  new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolve(`http://127.0.0.1:${port}/rpc`);
    });
  });

const close = (server: Server): Promise<void> =>
  new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

describe("gateway RPC connection helpers", () => {
  it("supplies public gateway defaults for every supported chain", () => {
    for (const chainId of [1, 11155111, 9745, 9746]) {
      expect(getRpcConnection(chainId)).to.deep.equal({
        url: `https://rpc.wildcat.finance/${chainId}`,
        headers: {},
        timeout: DefaultRpcTimeoutMs
      });
    }
  });

  it("accepts browser proxy endpoints and configured request timeouts", () => {
    const endpoint = "/api/gateway/rpc/11155111";
    const connection = getRpcConnection(SupportedChainId.Sepolia, {
      endpoint,
      timeoutMs: 45_000
    });
    expect(connection).to.deep.equal({ url: endpoint, headers: {}, timeout: 45_000 });
    const transport = createRpcTransport(SupportedChainId.Sepolia, { endpoint })({});
    expect(transport.value?.url).to.equal(endpoint);
    expect(transport.value?.fetchOptions?.headers).to.deep.equal({});
  });

  it("sends public RPC requests to the default gateway without authorization", async () => {
    const originalFetch = globalThis.fetch;
    const requests: Array<{ url: string; authorization: string | null }> = [];
    globalThis.fetch = async (input, options) => {
      const body = JSON.parse(String(options?.body));
      requests.push({
        url: String(input),
        authorization: new Headers(options?.headers).get("authorization")
      });
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: body.id, result: "0xaa36a7" }), {
        headers: { "content-type": "application/json" }
      });
    };
    try {
      const client = createPublicClient({
        chain: sepolia,
        transport: createRpcTransport(SupportedChainId.Sepolia)
      });
      expect(await client.getChainId()).to.equal(SupportedChainId.Sepolia);
      expect(requests).to.deep.equal([
        { url: "https://rpc.wildcat.finance/11155111", authorization: null }
      ]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("works with viem and ethers against a custom authenticated RPC endpoint", async () => {
    const requests: Array<{ url: string | undefined; authorization: string | undefined }> = [];
    const server = createServer((request, response) => {
      let body = "";
      request.on("data", (chunk) => (body += String(chunk)));
      request.on("end", () => {
        const { id, method } = JSON.parse(body);
        requests.push({ url: request.url, authorization: request.headers.authorization });
        response.writeHead(200, {
          "content-type": "application/json",
          connection: "close"
        });
        response.end(
          JSON.stringify({
            jsonrpc: "2.0",
            id,
            result: method === "eth_chainId" ? "0xaa36a7" : "0x2a"
          })
        );
      });
    });
    const endpoint = await listen(server);
    try {
      const options = { endpoint, bearerToken: "rpc-test-key" };
      const client = createPublicClient({
        chain: sepolia,
        transport: createRpcTransport(SupportedChainId.Sepolia, options)
      });
      const provider = new providers.StaticJsonRpcProvider(
        getRpcConnection(SupportedChainId.Sepolia, options),
        SupportedChainId.Sepolia
      );
      options.bearerToken = "changed-test-key";
      expect(await client.getBlockNumber()).to.equal(42n);
      expect(await provider.getBlockNumber()).to.equal(42);
      expect(requests.length).to.be.greaterThanOrEqual(2);
      expect(requests.every(({ url }) => url === "/rpc")).to.equal(true);
      expect(
        requests.every(({ authorization }) => authorization === "Bearer rpc-test-key")
      ).to.equal(true);
    } finally {
      await close(server);
    }
  });

  it("does not follow redirects with an authenticated viem transport", async () => {
    let requests = 0;
    const server = createServer((_request, response) => {
      requests += 1;
      response.writeHead(302, { location: "/other-rpc", connection: "close" });
      response.end();
    });
    const endpoint = await listen(server);
    try {
      const transport = createRpcTransport(SupportedChainId.Sepolia, {
        endpoint,
        bearerToken: "redirect-test-key"
      })({ retryCount: 0 });
      const failure = await transport.request({ method: "eth_chainId" }).catch((error) => error);
      expect(failure).to.be.instanceOf(Error);
      expect(`${(failure as Error).stack} ${JSON.stringify(failure)}`).not.to.include(
        "redirect-test-key"
      );
      expect(requests).to.equal(1);
    } finally {
      await close(server);
    }
  });

  it("rejects invalid connection configuration without silently selecting public access", () => {
    expect(() => getRpcConnection(0 as SupportedChainId)).to.throw("Unsupported chain ID");
    expect(() => getRpcConnection(SupportedChainId.Sepolia, { endpoint: "" })).to.throw(
      "RPC endpoint"
    );
    for (const bearerToken of ["", "Bearer test-key", "test\nkey"]) {
      expect(() => getRpcConnection(SupportedChainId.Sepolia, { bearerToken })).to.throw(
        "bearerToken"
      );
    }
    for (const timeoutMs of [0, -1, NaN, Infinity, 1.5, 2_147_483_648]) {
      expect(() => getRpcConnection(SupportedChainId.Sepolia, { timeoutMs })).to.throw(
        "HTTP timeout"
      );
    }
  });
});
