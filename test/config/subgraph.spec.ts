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
  SubgraphCompatibilityError,
  SubgraphDeploymentRequirementsByChain,
  SubgraphSchemaFamilies,
  SubgraphUrls,
  SupportedChainId,
  createSubgraphClient,
  fetchIndexerDeploymentMetadata,
  getSubgraphClientDeploymentMetadata,
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
      "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/sepolia/v2.5.11/gn"
    );
  });

  it("pins production and Plasma to the 3.1.17-compatible V2.0.30 endpoints", () => {
    expect(SubgraphUrls[SupportedChainId.Mainnet]).to.include("/mainnet/v2.0.30/gn");
    expect(SubgraphUrls[SupportedChainId.PlasmaTestnet]).to.include("/plasma-testnet/v2.0.30/gn");
    expect(SubgraphUrls[SupportedChainId.PlasmaMainnet]).to.include("/plasma-mainnet/v2.0.30/gn");
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

    const expectTimeout = (reason: unknown): void => {
      const error = reason instanceof ApolloError ? reason.networkError : reason;
      expect(error).to.be.instanceOf(SubgraphCompatibilityError);
      expect((error as SubgraphCompatibilityError).issues).to.deep.equal([
        { code: "METADATA_QUERY_TIMEOUT", expected: "Response within 10000ms" }
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
        if (delay === 10_000) deadlines.set(timer, () => callback(...args));
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
