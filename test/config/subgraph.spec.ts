import { createServer, Server } from "http";
import { AddressInfo } from "net";
import { gql } from "@apollo/client";
import { expect } from "chai";
import {
  SubgraphCompatibilityError,
  SubgraphDeploymentRequirementsByChain,
  SupportedChainId,
  createSubgraphClient,
  getSubgraphCompatibilityIssues,
  validateSubgraphEndpoint
} from "../../src/config";
import { IndexerDeploymentMetadata, PricingMode } from "../../src/domain";

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
    const metadata = metadataFor(SupportedChainId.PlasmaMainnet);
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
    const client = createSubgraphClient(SupportedChainId.PlasmaMainnet, endpoint);

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
});
