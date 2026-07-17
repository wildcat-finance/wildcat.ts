import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable
} from "@apollo/client";
import { IndexerDeploymentMetadata, PricingMode, parsePricingMode } from "../domain";
import { GetIndexerDeploymentDocument, SubgraphGetIndexerDeploymentQuery } from "../gql/graphql";
import { SupportedChainId } from "./chains";
import { Deployments } from "./deployments";

export type SubgraphCompatibilityIssueCode =
  | "METADATA_QUERY_FAILED"
  | "MISSING_DEPLOYMENT_METADATA"
  | "INVALID_DEPLOYMENT_METADATA"
  | "CHAIN_ID_MISMATCH"
  | "NETWORK_MISMATCH"
  | "GRAPH_NETWORK_MISMATCH"
  | "SCHEMA_RELEASE_MISMATCH"
  | "MISSING_CONFIG_DIGEST"
  | "INVALID_CONFIG_DIGEST"
  | "ARCH_CONTROLLER_MISMATCH"
  | "SANCTIONS_SENTINEL_MISMATCH"
  | "ANALYTICS_FEATURE_MISMATCH"
  | "COLLATERAL_FEATURE_MISMATCH"
  | "WRAPPERS_FEATURE_MISMATCH"
  | "PRICING_MODE_MISMATCH";

export type SubgraphCompatibilityIssue = {
  code: SubgraphCompatibilityIssueCode;
  expected?: string;
  actual?: string;
};

export class SubgraphCompatibilityError extends Error {
  readonly name = "SubgraphCompatibilityError";

  constructor(readonly endpoint: string, readonly issues: readonly SubgraphCompatibilityIssue[]) {
    super(
      `Subgraph endpoint ${endpoint} is incompatible: ${issues.map(({ code }) => code).join(", ")}`
    );
  }
}

export const SubgraphUrls: Record<SupportedChainId, string> = {
  [SupportedChainId.Sepolia]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/sepolia/v2.1.5/gn",
  [SupportedChainId.Mainnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/mainnet/v2.0.22/gn",
  [SupportedChainId.PlasmaTestnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-testnet/v2.0.22/gn",
  [SupportedChainId.PlasmaMainnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-mainnet/v2.0.22/gn"
};

export type SubgraphDeploymentRequirements = {
  chainId: SupportedChainId;
  network: string;
  graphNetwork: string;
  schemaRelease: "2.5";
  archController: string;
  sanctionsSentinel: string;
  analyticsEnabled: boolean;
  collateralEnabled: boolean;
  wrappersEnabled: boolean;
  pricingMode: Exclude<PricingMode, "unknown">;
};

const requirements = (
  chainId: SupportedChainId,
  network: string,
  features: Pick<
    SubgraphDeploymentRequirements,
    "analyticsEnabled" | "collateralEnabled" | "wrappersEnabled" | "pricingMode"
  >
): SubgraphDeploymentRequirements => ({
  chainId,
  network,
  graphNetwork: network,
  schemaRelease: "2.5",
  archController: Deployments[chainId].WildcatArchController,
  sanctionsSentinel: Deployments[chainId].WildcatSanctionsSentinel,
  ...features
});

/** Endpoint facts the SDK relies on before issuing any first-party V2.5 query. */
export const SubgraphDeploymentRequirementsByChain: Record<
  SupportedChainId,
  SubgraphDeploymentRequirements
> = {
  [SupportedChainId.Mainnet]: requirements(SupportedChainId.Mainnet, "mainnet", {
    analyticsEnabled: true,
    collateralEnabled: true,
    wrappersEnabled: true,
    pricingMode: "chainlink"
  }),
  [SupportedChainId.Sepolia]: requirements(SupportedChainId.Sepolia, "sepolia", {
    analyticsEnabled: true,
    collateralEnabled: true,
    wrappersEnabled: true,
    pricingMode: "synthetic-testnet"
  }),
  [SupportedChainId.PlasmaTestnet]: requirements(SupportedChainId.PlasmaTestnet, "plasma-testnet", {
    analyticsEnabled: true,
    collateralEnabled: false,
    wrappersEnabled: false,
    pricingMode: "none"
  }),
  [SupportedChainId.PlasmaMainnet]: requirements(SupportedChainId.PlasmaMainnet, "plasma-mainnet", {
    analyticsEnabled: true,
    collateralEnabled: false,
    wrappersEnabled: false,
    pricingMode: "none"
  })
};

type SubgraphIndexerDeployment = SubgraphGetIndexerDeploymentQuery["indexerDeployments"][number];

const normalizeIndexerDeployment = (
  deployment: SubgraphIndexerDeployment
): IndexerDeploymentMetadata => ({
  chainId: Number(deployment.chainId),
  network: deployment.network,
  graphNetwork: deployment.graphNetwork,
  schemaRelease: deployment.schemaRelease,
  configDigest: deployment.configDigest,
  archController: deployment.archController,
  sanctionsSentinel: deployment.sanctionsSentinel,
  analyticsEnabled: deployment.analyticsEnabled,
  collateralEnabled: deployment.collateralEnabled,
  wrappersEnabled: deployment.wrappersEnabled,
  pricingMode: parsePricingMode(deployment.pricingMode),
  firstObserved: {
    blockNumber: BigInt(deployment.firstObservedBlock),
    blockTimestamp: BigInt(deployment.firstObservedTimestamp),
    transactionHash: deployment.firstObservedTransaction,
    logIndex: BigInt(deployment.firstObservedLogIndex)
  }
});

const asIssueValue = (value: string | number | boolean): string => String(value);

const addressesEqual = (left: string, right: string): boolean =>
  left.toLowerCase() === right.toLowerCase();

export const getSubgraphCompatibilityIssues = (
  chainId: SupportedChainId,
  metadata: IndexerDeploymentMetadata
): SubgraphCompatibilityIssue[] => {
  const expected = SubgraphDeploymentRequirementsByChain[chainId];
  const issues: SubgraphCompatibilityIssue[] = [];
  const compare = (
    code: SubgraphCompatibilityIssueCode,
    expectedValue: string | number | boolean,
    actualValue: string | number | boolean
  ): void => {
    if (expectedValue !== actualValue) {
      issues.push({
        code,
        expected: asIssueValue(expectedValue),
        actual: asIssueValue(actualValue)
      });
    }
  };

  compare("CHAIN_ID_MISMATCH", expected.chainId, metadata.chainId);
  compare("NETWORK_MISMATCH", expected.network, metadata.network);
  compare("GRAPH_NETWORK_MISMATCH", expected.graphNetwork, metadata.graphNetwork);
  compare("SCHEMA_RELEASE_MISMATCH", expected.schemaRelease, metadata.schemaRelease);

  if (metadata.configDigest.length === 0) {
    issues.push({ code: "MISSING_CONFIG_DIGEST" });
  } else if (!/^[0-9a-f]{64}$/i.test(metadata.configDigest)) {
    issues.push({
      code: "INVALID_CONFIG_DIGEST",
      expected: "64 hexadecimal characters",
      actual: metadata.configDigest
    });
  }

  if (!addressesEqual(expected.archController, metadata.archController)) {
    issues.push({
      code: "ARCH_CONTROLLER_MISMATCH",
      expected: expected.archController,
      actual: metadata.archController
    });
  }
  if (!addressesEqual(expected.sanctionsSentinel, metadata.sanctionsSentinel)) {
    issues.push({
      code: "SANCTIONS_SENTINEL_MISMATCH",
      expected: expected.sanctionsSentinel,
      actual: metadata.sanctionsSentinel
    });
  }

  compare("ANALYTICS_FEATURE_MISMATCH", expected.analyticsEnabled, metadata.analyticsEnabled);
  compare("COLLATERAL_FEATURE_MISMATCH", expected.collateralEnabled, metadata.collateralEnabled);
  compare("WRAPPERS_FEATURE_MISMATCH", expected.wrappersEnabled, metadata.wrappersEnabled);
  compare("PRICING_MODE_MISMATCH", expected.pricingMode, metadata.pricingMode);

  return issues;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** Read and normalize the deployment declaration without trusting it as compatible. */
export const fetchIndexerDeploymentMetadata = async (
  endpoint: string
): Promise<IndexerDeploymentMetadata> => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: endpoint })
  });

  try {
    const { data } = await client.query<SubgraphGetIndexerDeploymentQuery>({
      query: GetIndexerDeploymentDocument,
      fetchPolicy: "no-cache"
    });
    const deployment = data.indexerDeployments[0];
    if (!deployment) {
      throw new SubgraphCompatibilityError(endpoint, [{ code: "MISSING_DEPLOYMENT_METADATA" }]);
    }

    try {
      return normalizeIndexerDeployment(deployment);
    } catch (error) {
      throw new SubgraphCompatibilityError(endpoint, [
        { code: "INVALID_DEPLOYMENT_METADATA", actual: errorMessage(error) }
      ]);
    }
  } catch (error) {
    if (error instanceof SubgraphCompatibilityError) throw error;
    throw new SubgraphCompatibilityError(endpoint, [
      { code: "METADATA_QUERY_FAILED", actual: errorMessage(error) }
    ]);
  } finally {
    client.stop();
  }
};

const endpointValidationPromises = new Map<string, Promise<IndexerDeploymentMetadata>>();

const validationCacheKey = (chainId: SupportedChainId, endpoint: string): string =>
  `${chainId}:${endpoint}`;

/** Validate once per chain/endpoint pair; failed attempts are evicted so callers may retry. */
export const validateSubgraphEndpoint = (
  chainId: SupportedChainId,
  endpoint: string = SubgraphUrls[chainId]
): Promise<IndexerDeploymentMetadata> => {
  const cacheKey = validationCacheKey(chainId, endpoint);
  const cachedValidation = endpointValidationPromises.get(cacheKey);
  if (cachedValidation) return cachedValidation;

  const validation = fetchIndexerDeploymentMetadata(endpoint).then((metadata) => {
    const issues = getSubgraphCompatibilityIssues(chainId, metadata);
    if (issues.length > 0) throw new SubgraphCompatibilityError(endpoint, issues);
    return metadata;
  });
  endpointValidationPromises.set(cacheKey, validation);
  void validation.catch(() => {
    if (endpointValidationPromises.get(cacheKey) === validation) {
      endpointValidationPromises.delete(cacheKey);
    }
  });
  return validation;
};

const subgraphClients = new Map<string, ApolloClient<NormalizedCacheObject>>();

/** Construct a V2.5 client whose operations wait for endpoint compatibility validation. */
export const createSubgraphClient = (
  chainId: SupportedChainId,
  endpoint: string = SubgraphUrls[chainId]
): ApolloClient<NormalizedCacheObject> => {
  const validationLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let cancelled = false;
        let operationSubscription: { unsubscribe: () => void } | undefined;

        void validateSubgraphEndpoint(chainId, endpoint)
          .then(() => {
            if (cancelled) return;
            operationSubscription = forward(operation).subscribe({
              next: (value) => observer.next(value),
              error: (error) => observer.error(error),
              complete: () => observer.complete()
            });
          })
          .catch((error) => {
            if (!cancelled) observer.error(error);
          });

        return () => {
          cancelled = true;
          operationSubscription?.unsubscribe();
        };
      })
  );

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: validationLink.concat(new HttpLink({ uri: endpoint }))
  });
};

export const getSubgraphClient = (
  chainId: SupportedChainId
): ApolloClient<NormalizedCacheObject> => {
  const endpoint = SubgraphUrls[chainId];
  const cacheKey = validationCacheKey(chainId, endpoint);
  const cachedClient = subgraphClients.get(cacheKey);
  if (cachedClient) return cachedClient;

  const client = createSubgraphClient(chainId, endpoint);
  subgraphClients.set(cacheKey, client);
  return client;
};
