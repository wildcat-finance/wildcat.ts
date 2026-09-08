import { createServer, Server } from "http";
import { AddressInfo } from "net";
import {
  ApolloClient,
  ApolloError,
  ApolloLink,
  gql,
  InMemoryCache,
  Observable,
  Operation
} from "@apollo/client";
import { expect } from "chai";
import {
  DefaultSubgraphMetadataTimeoutMs,
  SubgraphCompatibilityError,
  SubgraphDeploymentRequirementsByChain,
  SubgraphSchemaFamilies,
  SubgraphUrls,
  SupportedChainId,
  createSubgraphClient,
  fetchIndexerDeploymentMetadata,
  getSubgraphClientDeploymentMetadata,
  getSubgraphClient,
  getSubgraphCompatibilityIssues,
  validateSubgraphEndpoint
} from "../../src/config";
import { IndexerDeploymentMetadata, PricingMode } from "../../src/domain";
import { GetIndexerDeploymentDocument } from "../../src/gql/graphql";

const metadataFor = (chainId: SupportedChainId): IndexerDeploymentMetadata => {
  const expected = SubgraphDeploymentRequirementsByChain[chainId];
  return {
    ...expected,
    configDigest: "a".repeat(64),
    firstObserved: {
      blockNumber: 123n,
      blockTimestamp: 456n,
      transactionHash: `0x${"b".repeat(64)}`,
      logIndex: 7n
    }
  };
};

const graphPricingMode = (pricingMode: PricingMode): string => {
  switch (pricingMode) {
    case "chainlink":
      return "CHAINLINK";
    case "synthetic-testnet":
      return "SYNTHETIC_TESTNET";
    case "none":
      return "NONE";
    case "unknown":
      return "UNKNOWN";
  }
};

const graphResponseFor = (metadata: IndexerDeploymentMetadata): unknown => ({
  data: {
    indexerDeployments: [
      {
        __typename: "IndexerDeployment",
        id: "deployment",
        chainId: String(metadata.chainId),
        network: metadata.network,
        graphNetwork: metadata.graphNetwork,
        schemaRelease: metadata.schemaRelease,
        configDigest: metadata.configDigest,
        archController: metadata.archController,
        sanctionsSentinel: metadata.sanctionsSentinel,
        analyticsEnabled: metadata.analyticsEnabled,
        collateralEnabled: metadata.collateralEnabled,
        wrappersEnabled: metadata.wrappersEnabled,
        pricingMode: graphPricingMode(metadata.pricingMode),
        firstObservedBlock: String(metadata.firstObserved.blockNumber),
        firstObservedTimestamp: String(metadata.firstObserved.blockTimestamp),
        firstObservedTransaction: metadata.firstObserved.transactionHash,
        firstObservedLogIndex: String(metadata.firstObserved.logIndex)
      }
    ]
  }
});

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

describe("V2.5 subgraph endpoint compatibility", () => {
  it("pins the replacement Sepolia V2.5 endpoint", () => {
    expect(SubgraphUrls[SupportedChainId.Sepolia]).to.equal(
      "https://graph.wildcat.finance/sepolia/v2.5.12"
    );
  });

  it("pins production and Plasma to the 3.1.17-compatible V2.0.30 endpoints", () => {
    expect(SubgraphUrls[SupportedChainId.Mainnet]).to.equal(
      "https://graph.wildcat.finance/mainnet/v2.0.30"
    );
    expect(SubgraphUrls[SupportedChainId.PlasmaTestnet]).to.equal(
      "https://graph.wildcat.finance/plasma-testnet/v2.0.30"
    );
    expect(SubgraphUrls[SupportedChainId.PlasmaMainnet]).to.equal(
      "https://graph.wildcat.finance/plasma-mainnet/v2.0.30"
    );
  });

  it("routes only Sepolia through the native V2.5 schema", () => {
    expect(SubgraphSchemaFamilies).to.deep.equal({
      [SupportedChainId.Mainnet]: "legacy-v2",
      [SupportedChainId.Sepolia]: "v2.5",
      [SupportedChainId.PlasmaTestnet]: "legacy-v2",
      [SupportedChainId.PlasmaMainnet]: "legacy-v2"
    });
  });

  it("accepts metadata matching the configured chain contract", () => {
    expect(
      getSubgraphCompatibilityIssues(
        SupportedChainId.Sepolia,
        metadataFor(SupportedChainId.Sepolia)
      )
    ).to.deep.equal([]);
  });

  it("reports endpoint identity and feature mismatches independently", () => {
    const metadata = metadataFor(SupportedChainId.Sepolia);
    const issues = getSubgraphCompatibilityIssues(SupportedChainId.Sepolia, {
      ...metadata,
      chainId: SupportedChainId.Mainnet,
      network: "wrong-network",
      graphNetwork: "wrong-graph-network",
      schemaRelease: "2.4",
      archController: "0x0000000000000000000000000000000000000001",
      sanctionsSentinel: "0x0000000000000000000000000000000000000002",
      analyticsEnabled: false,
      collateralEnabled: false,
      wrappersEnabled: false,
      pricingMode: "none"
    });

    expect(issues.map(({ code }) => code)).to.deep.equal([
      "CHAIN_ID_MISMATCH",
      "NETWORK_MISMATCH",
      "GRAPH_NETWORK_MISMATCH",
      "SCHEMA_RELEASE_MISMATCH",
      "ARCH_CONTROLLER_MISMATCH",
      "SANCTIONS_SENTINEL_MISMATCH",
      "ANALYTICS_FEATURE_MISMATCH",
      "COLLATERAL_FEATURE_MISMATCH",
      "WRAPPERS_FEATURE_MISMATCH",
      "PRICING_MODE_MISMATCH"
    ]);
  });

  it("distinguishes absent and malformed configuration digests", () => {
    const metadata = metadataFor(SupportedChainId.Mainnet);

    expect(
      getSubgraphCompatibilityIssues(SupportedChainId.Mainnet, {
        ...metadata,
        configDigest: ""
      })
    ).to.deep.equal([{ code: "MISSING_CONFIG_DIGEST" }]);
    expect(
      getSubgraphCompatibilityIssues(SupportedChainId.Mainnet, {
        ...metadata,
        configDigest: "not-a-digest"
      })
    ).to.deep.equal([
      {
        code: "INVALID_CONFIG_DIGEST",
        expected: "64 hexadecimal characters",
        actual: "not-a-digest"
      }
    ]);
  });

  it("queries and caches successful validation per chain and endpoint", async () => {
    const metadata = metadataFor(SupportedChainId.Sepolia);
    let requests = 0;
    const server = createServer((_request, response) => {
      requests += 1;
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(graphResponseFor(metadata)));
    });
    const endpoint = await listen(server);

    try {
      const first = validateSubgraphEndpoint(SupportedChainId.Sepolia, endpoint);
      const second = validateSubgraphEndpoint(SupportedChainId.Sepolia, endpoint);

      expect(second).to.equal(first);
      expect(await first).to.deep.equal(metadata);
      expect(await validateSubgraphEndpoint(SupportedChainId.Sepolia, endpoint)).to.deep.equal(
        metadata
      );
      expect(requests).to.equal(1);
    } finally {
      await close(server);
    }
  });

  it("evicts failed validation so a corrected endpoint can be retried", async () => {
    const validMetadata = metadataFor(SupportedChainId.Sepolia);
    let requests = 0;
    const server = createServer((_request, response) => {
      requests += 1;
      const metadata =
        requests === 1 ? { ...validMetadata, chainId: SupportedChainId.Mainnet } : validMetadata;
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(graphResponseFor(metadata)));
    });
    const endpoint = await listen(server);

    try {
      let failure: unknown;
      try {
        await validateSubgraphEndpoint(SupportedChainId.Sepolia, endpoint);
      } catch (error) {
        failure = error;
      }

      expect(failure).to.be.instanceOf(SubgraphCompatibilityError);
      expect((failure as SubgraphCompatibilityError).issues).to.deep.include({
        code: "CHAIN_ID_MISMATCH",
        expected: String(SupportedChainId.Sepolia),
        actual: String(SupportedChainId.Mainnet)
      });
      expect(await validateSubgraphEndpoint(SupportedChainId.Sepolia, endpoint)).to.deep.equal(
        validMetadata
      );
      expect(requests).to.equal(2);
    } finally {
      await close(server);
    }
  });

  it("does not forward a client operation until metadata validation succeeds", async () => {
    const metadata = metadataFor(SupportedChainId.Sepolia);
    const operations: string[] = [];
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
          JSON.stringify(
            operationName === "getIndexerDeployment"
              ? graphResponseFor(metadata)
              : { data: { __typename: "Query" } }
          )
        );
      });
    });
    const endpoint = await listen(server);
    const client = createSubgraphClient(SupportedChainId.Sepolia, endpoint);

    try {
      const { data } = await client.query<{ __typename: string }>({
        query: gql`
          query testEndpointGate {
            __typename
          }
        `,
        fetchPolicy: "no-cache"
      });

      expect(data.__typename).to.equal("Query");
      expect(operations).to.deep.equal(["getIndexerDeployment", "testEndpointGate"]);
    } finally {
      client.stop();
      await close(server);
    }
  });

  it("does not issue V2.5 metadata queries to legacy-schema clients", async () => {
    const operations: string[] = [];
    const server = createServer((request, response) => {
      let body = "";
      request.on("data", (chunk) => {
        body += String(chunk);
      });
      request.on("end", () => {
        operations.push(JSON.parse(body).operationName as string);
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify({ data: { __typename: "Query" } }));
      });
    });
    const endpoint = await listen(server);
    const client = createSubgraphClient(SupportedChainId.Mainnet, endpoint);

    try {
      await client.query<{ __typename: string }>({
        query: gql`
          query testLegacyEndpoint {
            __typename
          }
        `,
        fetchPolicy: "no-cache"
      });

      expect(operations).to.deep.equal(["testLegacyEndpoint"]);
    } finally {
      client.stop();
      await close(server);
    }
  });

  describe("gateway connection options", () => {
    const originalFetch = globalThis.fetch;
    const query = gql`
      query gatewayClientRead {
        __typename
      }
    `;
    let endpointId = 0;
    let requests: Array<{
      endpoint: string;
      authorization: string | null;
      operationName: string;
      redirect: RequestRedirect | undefined;
    }>;
    let clients: Array<ApolloClient<unknown>>;

    const endpoint = (): string => `https://gateway.example.invalid/${++endpointId}`;
    const read = (client: ApolloClient<unknown>) =>
      client.query({ query, fetchPolicy: "no-cache" });

    beforeEach(() => {
      requests = [];
      clients = [];
      globalThis.fetch = async (input, options) => {
        const authorization = new Headers(options?.headers).get("authorization");
        const operationName = JSON.parse(String(options?.body)).operationName as string;
        requests.push({
          endpoint: String(input),
          authorization,
          operationName,
          redirect: options?.redirect
        });
        const unauthorized = authorization === "Bearer rejected-test-key";
        const body = unauthorized
          ? { errors: [{ message: "Unauthorized" }] }
          : operationName === "getIndexerDeployment"
          ? graphResponseFor(metadataFor(SupportedChainId.Sepolia))
          : { data: { __typename: "Query" } };
        return new Response(JSON.stringify(body), {
          status: unauthorized ? 401 : 200,
          headers: { "content-type": "application/json" }
        });
      };
    });

    afterEach(() => {
      clients.forEach((client) => client.stop());
      globalThis.fetch = originalFetch;
    });

    it("uses the public gateway and the pinned Sepolia release without credentials", async () => {
      const client = createSubgraphClient(SupportedChainId.Sepolia);
      clients.push(client);
      await read(client);
      expect(requests.map(({ endpoint }) => endpoint)).to.deep.equal([
        "https://graph.wildcat.finance/sepolia/v2.5.12",
        "https://graph.wildcat.finance/sepolia/v2.5.12"
      ]);
      expect(requests.every(({ authorization }) => authorization === null)).to.equal(true);
    });

    it("authenticates metadata and ordinary queries and shares metadata with feature reads", async () => {
      const options = { endpoint: endpoint(), bearerToken: "server-test-key" };
      const client = getSubgraphClient(SupportedChainId.Sepolia, options);
      clients.push(client);
      expect(getSubgraphClient(SupportedChainId.Sepolia, { ...options })).to.equal(client);
      await read(client);
      expect(await getSubgraphClientDeploymentMetadata(client)).to.deep.equal(
        metadataFor(SupportedChainId.Sepolia)
      );
      expect(requests.map(({ operationName }) => operationName)).to.deep.equal([
        "getIndexerDeployment",
        "gatewayClientRead"
      ]);
      expect(
        requests.every(({ authorization }) => authorization === "Bearer server-test-key")
      ).to.equal(true);
      expect(requests.every(({ redirect }) => redirect === "error")).to.equal(true);
    });

    it("supports standalone metadata requests with bearer configuration", async () => {
      const url = endpoint();
      const options = {
        endpoint: "https://unused.example.invalid",
        bearerToken: "metadata-test-key"
      };
      expect(await fetchIndexerDeploymentMetadata(url, options)).to.deep.equal(
        metadataFor(SupportedChainId.Sepolia)
      );
      expect(requests[0].endpoint).to.equal(url);
      expect(requests[0].authorization).to.equal("Bearer metadata-test-key");
    });

    it("supports relative browser proxy routes for both metadata and normal queries", async () => {
      const proxy = `/api/gateway/graph/sepolia/v2.5.12?test=${++endpointId}`;
      const client = createSubgraphClient(SupportedChainId.Sepolia, { endpoint: proxy });
      clients.push(client);
      await read(client);
      expect(requests.map(({ endpoint }) => endpoint)).to.deep.equal([proxy, proxy]);
      expect(requests.every(({ authorization }) => authorization === null)).to.equal(true);
    });

    it("authenticates legacy clients without sending V2.5 metadata queries", async () => {
      const client = createSubgraphClient(SupportedChainId.Mainnet, {
        endpoint: endpoint(),
        bearerToken: "legacy-test-key"
      });
      clients.push(client);
      await read(client);
      expect(requests).to.have.length(1);
      expect(requests[0].operationName).to.equal("gatewayClientRead");
      expect(requests[0].authorization).to.equal("Bearer legacy-test-key");
    });

    it("isolates public access, token rotation and later changes to the options object", async () => {
      const url = endpoint();
      const publicClient = getSubgraphClient(SupportedChainId.Sepolia, url);
      expect(getSubgraphClient(SupportedChainId.Sepolia, { endpoint: url })).to.equal(publicClient);
      const options = { endpoint: url, bearerToken: "first-test-key" };
      const firstClient = getSubgraphClient(SupportedChainId.Sepolia, options);
      options.bearerToken = "second-test-key";
      const secondClient = getSubgraphClient(SupportedChainId.Sepolia, options);
      clients.push(publicClient, firstClient, secondClient);
      expect(new Set(clients).size).to.equal(3);
      await Promise.all(clients.map(read));
      for (const authorization of [null, "Bearer first-test-key", "Bearer second-test-key"]) {
        expect(
          requests.filter((request) => request.authorization === authorization)
        ).to.have.length(2);
      }
    });

    it("does not reuse public validation for a rejected bearer or forward its pending query", async () => {
      const url = endpoint();
      await validateSubgraphEndpoint(SupportedChainId.Sepolia, url);
      const client = getSubgraphClient(SupportedChainId.Sepolia, {
        endpoint: url,
        bearerToken: "rejected-test-key"
      });
      clients.push(client);
      for (let attempt = 0; attempt < 2; attempt++) {
        const failure = await read(client).catch((error) => error);
        expect(failure).to.be.instanceOf(ApolloError);
        expect(failure.networkError).to.be.instanceOf(SubgraphCompatibilityError);
      }
      expect(requests).to.have.length(3);
      expect(requests.map(({ authorization }) => authorization)).to.deep.equal([
        null,
        "Bearer rejected-test-key",
        "Bearer rejected-test-key"
      ]);
      expect(
        requests.every(({ operationName }) => operationName === "getIndexerDeployment")
      ).to.equal(true);
    });

    it("separates cached clients by metadata deadline and endpoint", () => {
      const url = endpoint();
      const first = getSubgraphClient(SupportedChainId.Sepolia, url);
      const second = getSubgraphClient(SupportedChainId.Sepolia, {
        endpoint: url,
        metadataTimeoutMs: 25_000
      });
      const third = getSubgraphClient(SupportedChainId.Sepolia, endpoint());
      clients.push(first, second, third);
      expect(new Set(clients).size).to.equal(3);
    });

    it("rejects empty credentials and invalid metadata timeouts before making requests", () => {
      expect(() => createSubgraphClient(SupportedChainId.Sepolia, { bearerToken: "" })).to.throw(
        "bearerToken"
      );
      for (const metadataTimeoutMs of [0, -1, NaN, Infinity, 1.5, 2_147_483_648]) {
        expect(() =>
          createSubgraphClient(SupportedChainId.Sepolia, { metadataTimeoutMs })
        ).to.throw("HTTP timeout");
      }
      expect(requests).to.have.length(0);
    });

    it("omits endpoint credentials and bearer values from metadata failure diagnostics", async () => {
      const url = "https://user:password@errors.example.invalid/private-path?key=private-query";
      const bearerToken = "diagnostics-test-key";
      globalThis.fetch = async () => {
        throw new Error(
          `Request failed for ${url}, bearer=${bearerToken}; normalized https://errors.example.invalid/private%2Dpath?key=private-query`
        );
      };
      const failure = await fetchIndexerDeploymentMetadata(url, { bearerToken }).catch(
        (error) => error
      );
      expect(failure).to.be.instanceOf(SubgraphCompatibilityError);
      expect(failure.endpoint).to.equal("https://errors.example.invalid");
      const diagnostic = `${failure.stack} ${JSON.stringify(failure)}`;
      for (const secret of ["password", "private-path", "private-query", bearerToken]) {
        expect(diagnostic).not.to.include(secret);
      }
    });
  });

  describe("metadata deadlines", () => {
    const originalFetch = globalThis.fetch;
    const originalSetTimeout = globalThis.setTimeout;
    const originalClearTimeout = globalThis.clearTimeout;
    const deadlines = new Map<ReturnType<typeof setTimeout>, () => void>();
    const metadata = metadataFor(SupportedChainId.Sepolia);
    let endpointId = 0;
    let requests: Array<{
      operationName: string;
      signal: AbortSignal;
      respond: (data: unknown) => void;
      fail: (error: Error) => void;
    }>;

    const endpoint = (): string => `https://metadata.example.invalid/${++endpointId}`;
    const nextTurn = (): Promise<void> => new Promise((resolve) => originalSetTimeout(resolve, 0));

    const waitForRequests = async (count: number): Promise<void> => {
      for (let i = 0; i < 10 && requests.length < count; i++) await nextTurn();
      expect(requests).to.have.length(count);
    };

    const waitForTeardown = async (request: { closed: boolean }): Promise<void> => {
      // Apollo tears down its nested Concast subscriptions over multiple timer turns.
      for (let i = 0; i < 10 && !request.closed; i++) await nextTurn();
      expect(request.closed).to.equal(true);
    };

    const expireMetadata = (): void => {
      expect(deadlines.size).to.be.greaterThan(0);
      for (const [timer, expire] of [...deadlines]) {
        originalClearTimeout(timer);
        deadlines.delete(timer);
        expire();
      }
    };

    const expectTimeout = (reason: unknown, timeoutMs = DefaultSubgraphMetadataTimeoutMs): void => {
      const error = reason instanceof ApolloError ? reason.networkError : reason;
      expect(error).to.be.instanceOf(SubgraphCompatibilityError);
      expect((error as SubgraphCompatibilityError).issues).to.deep.equal([
        { code: "METADATA_QUERY_TIMEOUT", expected: `Response within ${timeoutMs}ms` }
      ]);
    };

    const controlledClient = () => {
      const operations: Array<{
        operation: Operation;
        closed: boolean;
        respond: (data: Record<string, unknown>) => void;
      }> = [];
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new ApolloLink(
          (operation) =>
            new Observable((observer) => {
              const request = {
                operation,
                closed: false,
                respond: (data: Record<string, unknown>) => {
                  observer.next({ data });
                  observer.complete();
                }
              };
              operations.push(request);
              // Deliberately ignore AbortSignal to exercise subscription cleanup.
              return () => {
                request.closed = true;
              };
            })
        )
      });
      return { client, operations };
    };

    beforeEach(() => {
      requests = [];
      // Fire only the SDK's metadata deadline manually; Apollo's own timers stay real.
      globalThis.setTimeout = ((
        callback: (...args: unknown[]) => void,
        delay?: number,
        ...args: unknown[]
      ) => {
        const timer = originalSetTimeout(callback, delay, ...args);
        if (delay === DefaultSubgraphMetadataTimeoutMs || delay === 25_000) {
          deadlines.set(timer, () => callback(...args));
        }
        return timer;
      }) as typeof setTimeout;
      globalThis.clearTimeout = ((timer: Parameters<typeof clearTimeout>[0]) => {
        deadlines.delete(timer as ReturnType<typeof setTimeout>);
        originalClearTimeout(timer);
      }) as typeof clearTimeout;
      globalThis.fetch = (_input, options) => {
        const signal = options?.signal;
        if (!signal) throw new Error("Expected a cancellable HTTP request");
        return new Promise<Response>((resolve, reject) => {
          const onAbort = () => reject(new Error("Request aborted"));
          signal.addEventListener("abort", onAbort, { once: true });
          requests.push({
            operationName: JSON.parse(String(options?.body)).operationName,
            signal,
            respond: (data) => {
              signal.removeEventListener("abort", onAbort);
              resolve(
                new Response(JSON.stringify(data), {
                  headers: { "content-type": "application/json" }
                })
              );
            },
            fail: (error) => {
              signal.removeEventListener("abort", onAbort);
              reject(error);
            }
          });
        });
      };
    });

    afterEach(() => {
      for (const timer of deadlines.keys()) originalClearTimeout(timer);
      deadlines.clear();
      globalThis.fetch = originalFetch;
      globalThis.setTimeout = originalSetTimeout;
      globalThis.clearTimeout = originalClearTimeout;
    });

    it("aborts a direct metadata request and reports its timeout", async () => {
      const failure = fetchIndexerDeploymentMetadata(endpoint()).catch((error) => error);
      await waitForRequests(1);

      expect(deadlines.size).to.equal(1);
      expireMetadata();

      expectTimeout(await failure);
      expect(requests[0].signal.aborted).to.equal(true);
      expect(deadlines.size).to.equal(0);
    });

    it("allows a configured deadline and isolates it from validation using the default", async () => {
      const url = endpoint();
      const defaultValidation = validateSubgraphEndpoint(SupportedChainId.Sepolia, url);
      const longerValidation = validateSubgraphEndpoint(SupportedChainId.Sepolia, {
        endpoint: url,
        metadataTimeoutMs: 25_000
      });
      const failures = Promise.allSettled([defaultValidation, longerValidation]);
      await waitForRequests(2);
      expect(deadlines.size).to.equal(2);
      expireMetadata();
      const results = await failures;
      expect(results.map(({ status }) => status)).to.deep.equal(["rejected", "rejected"]);
      if (results[0].status === "rejected") expectTimeout(results[0].reason);
      if (results[1].status === "rejected") expectTimeout(results[1].reason, 25_000);
      expect(requests.every(({ signal }) => signal.aborted)).to.equal(true);
    });

    it("releases shared validation callers and retries with a fresh request", async () => {
      const url = endpoint();
      const first = validateSubgraphEndpoint(SupportedChainId.Sepolia, url);
      const second = validateSubgraphEndpoint(SupportedChainId.Sepolia, url);
      const failures = Promise.allSettled([first, second]);
      expect(second).to.equal(first);
      await waitForRequests(1);
      expireMetadata();

      for (const result of await failures) {
        expect(result.status).to.equal("rejected");
        if (result.status === "rejected") expectTimeout(result.reason);
      }
      const retry = validateSubgraphEndpoint(SupportedChainId.Sepolia, url);
      expect(retry).not.to.equal(first);
      await waitForRequests(2);
      expect(requests[1].signal.aborted).to.equal(false);
      requests[1].respond(graphResponseFor(metadata));
      expect(await retry).to.deep.equal(metadata);
      expect(await validateSubgraphEndpoint(SupportedChainId.Sepolia, url)).to.deep.equal(metadata);
      expect(requests).to.have.length(2);
      expect(deadlines.size).to.equal(0);
      expect(requests[1].signal.aborted).to.equal(false);
    });

    it("fails gated queries on timeout and validates again before forwarding a retry", async () => {
      const client = createSubgraphClient(SupportedChainId.Sepolia, endpoint());
      const query = gql`
        query firstWaitingQuery {
          __typename
        }
      `;
      try {
        const failures = Promise.allSettled([
          client.query({ query, fetchPolicy: "no-cache" }),
          client.query({
            query: gql`
              query secondWaitingQuery {
                __typename
              }
            `,
            fetchPolicy: "no-cache"
          }),
          getSubgraphClientDeploymentMetadata(client)
        ]);
        await waitForRequests(1);
        expireMetadata();
        for (const result of await failures) {
          expect(result.status).to.equal("rejected");
          if (result.status === "rejected") expectTimeout(result.reason);
        }
        expect(requests.map(({ operationName }) => operationName)).to.deep.equal([
          "getIndexerDeployment"
        ]);

        const retry = client.query({ query, fetchPolicy: "no-cache" });
        const featureRetry = getSubgraphClientDeploymentMetadata(client);
        await waitForRequests(2);
        expect(requests[1].operationName).to.equal("getIndexerDeployment");
        requests[1].respond(graphResponseFor(metadata));
        await waitForRequests(3);
        expect(requests[2].operationName).to.equal("firstWaitingQuery");
        requests[2].respond({ data: { __typename: "Query" } });
        expect((await retry).data).to.deep.equal({ __typename: "Query" });
        expect(await featureRetry).to.deep.equal(metadata);
        expect(deadlines.size).to.equal(0);
      } finally {
        client.stop();
      }
    });

    it("keeps shared validation alive when one waiting query unsubscribes", async () => {
      const client = createSubgraphClient(SupportedChainId.Sepolia, endpoint());
      let cancelledResults = 0;
      const subscription = ApolloLink.execute(client.link, {
        query: gql`
          query cancelledWaitingQuery {
            __typename
          }
        `
      }).subscribe({
        next: () => {
          cancelledResults += 1;
        }
      });
      try {
        const active = client.query({
          query: gql`
            query activeWaitingQuery {
              __typename
            }
          `,
          fetchPolicy: "no-cache"
        });
        await waitForRequests(1);
        subscription.unsubscribe();
        await nextTurn();
        expect(requests[0].signal.aborted).to.equal(false);
        requests[0].respond(graphResponseFor(metadata));
        await waitForRequests(2);
        expect(requests[1].operationName).to.equal("activeWaitingQuery");
        requests[1].respond({ data: { __typename: "Query" } });
        await active;
        expect(cancelledResults).to.equal(0);
        expect(deadlines.size).to.equal(0);
      } finally {
        subscription.unsubscribe();
        client.stop();
      }
    });

    it("releases a custom link that ignores abort without stopping unrelated queries", async () => {
      const { client, operations } = controlledClient();
      try {
        const unrelated = client.query({
          query: gql`
            query unrelatedRead {
              __typename
            }
          `,
          fetchPolicy: "no-cache"
        });
        const failure = getSubgraphClientDeploymentMetadata(client).catch((error) => error);
        await nextTurn();
        expect(operations).to.have.length(2);
        const metadataOperation = operations[1];
        expireMetadata();
        expectTimeout(await failure);
        await waitForTeardown(metadataOperation);
        expect(metadataOperation.operation.getContext().fetchOptions.signal.aborted).to.equal(true);
        expect(operations[0].closed).to.equal(false);
        operations[0].respond({ __typename: "Query" });
        await unrelated;

        const retry = getSubgraphClientDeploymentMetadata(client);
        await nextTurn();
        expect(operations).to.have.length(3);
        operations[2].respond(
          (graphResponseFor(metadata) as { data: Record<string, unknown> }).data
        );
        expect(await retry).to.deep.equal(metadata);
        expect(deadlines.size).to.equal(0);
      } finally {
        client.stop();
      }
    });

    it("does not share cancellation with an independently started identical metadata query", async () => {
      const { client, operations } = controlledClient();
      try {
        const independent = client.query({
          query: GetIndexerDeploymentDocument,
          fetchPolicy: "no-cache"
        });
        const failure = getSubgraphClientDeploymentMetadata(client).catch((error) => error);
        await nextTurn();
        expect(operations).to.have.length(2);
        expireMetadata();
        expectTimeout(await failure);
        await waitForTeardown(operations[1]);
        expect(operations[0].closed).to.equal(false);
        const data = (graphResponseFor(metadata) as { data: Record<string, unknown> }).data;
        operations[0].respond(data);
        expect((await independent).data).to.deep.equal(data);
      } finally {
        client.stop();
      }
    });

    it("preserves custom query defaults while cleaning up successful metadata reads", async () => {
      const { client, operations } = controlledClient();
      client.defaultOptions.query = {
        context: { headers: { "x-test": "metadata" }, fetchOptions: { credentials: "include" } }
      };
      try {
        const result = getSubgraphClientDeploymentMetadata(client);
        await nextTurn();
        const context = operations[0].operation.getContext();
        expect(context.headers).to.deep.equal({ "x-test": "metadata" });
        expect(context.fetchOptions.credentials).to.equal("include");
        operations[0].respond(
          (graphResponseFor(metadata) as { data: Record<string, unknown> }).data
        );
        expect(await result).to.deep.equal(metadata);
        await nextTurn();
        expect(operations[0].closed).to.equal(true);
        expect(context.fetchOptions.signal.aborted).to.equal(false);
        expect(deadlines.size).to.equal(0);
      } finally {
        client.stop();
      }
    });

    it("clears the deadline after an early transport failure and permits retry", async () => {
      const url = endpoint();
      const failure = validateSubgraphEndpoint(SupportedChainId.Sepolia, url).catch(
        (error) => error
      );
      await waitForRequests(1);
      requests[0].fail(new Error("Connection failed"));
      const error = await failure;
      expect(error).to.be.instanceOf(SubgraphCompatibilityError);
      expect(error.issues).to.deep.equal([
        { code: "METADATA_QUERY_FAILED", actual: "Connection failed" }
      ]);
      expect(deadlines.size).to.equal(0);
      const retry = validateSubgraphEndpoint(SupportedChainId.Sepolia, url);
      await waitForRequests(2);
      requests[1].respond(graphResponseFor(metadata));
      expect(await retry).to.deep.equal(metadata);
      expect(deadlines.size).to.equal(0);
    });

    it("honors an already cancelled custom query signal before starting metadata work", async () => {
      const { client, operations } = controlledClient();
      const caller = new AbortController();
      caller.abort();
      client.defaultOptions.query = { context: { fetchOptions: { signal: caller.signal } } };
      try {
        const failure = await getSubgraphClientDeploymentMetadata(client).catch((error) => error);
        expect(failure).to.be.instanceOf(SubgraphCompatibilityError);
        expect(failure.issues).to.deep.equal([
          { code: "METADATA_QUERY_FAILED", actual: "Metadata query cancelled" }
        ]);
        expect(operations).to.have.length(0);
        expect(deadlines.size).to.equal(0);
      } finally {
        client.stop();
      }
    });

    it("honors custom query cancellation and can retry with a fresh signal", async () => {
      const { client, operations } = controlledClient();
      const caller = new AbortController();
      client.defaultOptions.query = { context: { fetchOptions: { signal: caller.signal } } };
      try {
        const failure = getSubgraphClientDeploymentMetadata(client).catch((error) => error);
        await nextTurn();
        caller.abort();
        expect((await failure).issues).to.deep.equal([
          { code: "METADATA_QUERY_FAILED", actual: "Metadata query cancelled" }
        ]);
        await waitForTeardown(operations[0]);
        expect(operations[0].operation.getContext().fetchOptions.signal.aborted).to.equal(true);
        expect(deadlines.size).to.equal(0);

        client.defaultOptions.query = {
          context: { fetchOptions: { signal: new AbortController().signal } }
        };
        const retry = getSubgraphClientDeploymentMetadata(client);
        await nextTurn();
        expect(operations).to.have.length(2);
        operations[1].respond(
          (graphResponseFor(metadata) as { data: Record<string, unknown> }).data
        );
        expect(await retry).to.deep.equal(metadata);
        expect(deadlines.size).to.equal(0);
      } finally {
        client.stop();
      }
    });
  });
});
