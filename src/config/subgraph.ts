import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable
} from "@apollo/client";
import { keccak256, stringToHex } from "viem";
import { IndexerDeploymentMetadata, PricingMode, parsePricingMode } from "../domain";
import { GetIndexerDeploymentDocument, SubgraphGetIndexerDeploymentQuery } from "../gql/graphql";
import {
  getConnectionHeaders,
  getEndpointLabel,
  redactConnectionMessage,
  resolveHttpTimeout
} from "../internal/http-connection";
import { SupportedChainId } from "./chains";
import { Deployments } from "./deployments";
import { GatewayConnectionOptions, GatewaySubgraphBaseUrl } from "./gateway";

export type SubgraphCompatibilityIssueCode =
  | "METADATA_QUERY_FAILED"
  | "METADATA_QUERY_TIMEOUT"
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
  readonly endpoint: string;
  readonly issues: readonly SubgraphCompatibilityIssue[];

  constructor(endpoint: string, issues: readonly SubgraphCompatibilityIssue[]) {
    super(
      `Subgraph endpoint ${getEndpointLabel(endpoint)} is incompatible: ${issues
        .map(({ code }) => code)
        .join(", ")}`
    );
    this.endpoint = getEndpointLabel(endpoint);
    this.issues = issues.map((issue) => ({
      ...issue,
      ...(issue.expected === undefined
        ? {}
        : { expected: redactConnectionMessage(issue.expected, endpoint) }),
      ...(issue.actual === undefined
        ? {}
        : { actual: redactConnectionMessage(issue.actual, endpoint) })
    }));
  }
}

export type SubgraphFeature = "analytics" | "collateral" | "wrappers" | "pricing";

export type SubgraphFeatureAvailability =
  | { feature: SubgraphFeature; available: true }
  | {
      feature: SubgraphFeature;
      available: false;
      reason:
        | "analytics-disabled"
        | "collateral-disabled"
        | "wrappers-disabled"
        | "pricing-disabled";
    };

export class SubgraphFeatureUnavailableError extends Error {
  readonly name = "SubgraphFeatureUnavailableError";

  constructor(
    readonly feature: SubgraphFeature,
    readonly reason: Exclude<SubgraphFeatureAvailability, { available: true }>["reason"]
  ) {
    super(`Subgraph feature ${feature} is unavailable: ${reason}`);
  }
}

export const getSubgraphFeatureAvailability = (
  metadata: IndexerDeploymentMetadata,
  feature: SubgraphFeature
): SubgraphFeatureAvailability => {
  if (feature === "analytics") {
    return metadata.analyticsEnabled
      ? { feature, available: true }
      : { feature, available: false, reason: "analytics-disabled" };
  }
  if (feature === "collateral") {
    return metadata.collateralEnabled
      ? { feature, available: true }
      : { feature, available: false, reason: "collateral-disabled" };
  }
  if (feature === "wrappers") {
    return metadata.wrappersEnabled
      ? { feature, available: true }
      : { feature, available: false, reason: "wrappers-disabled" };
  }
  if (!metadata.analyticsEnabled) {
    return { feature, available: false, reason: "analytics-disabled" };
  }
  return metadata.pricingMode !== "none" && metadata.pricingMode !== "unknown"
    ? { feature, available: true }
    : { feature, available: false, reason: "pricing-disabled" };
};

export const SubgraphUrls: Record<SupportedChainId, string> = {
  [SupportedChainId.Sepolia]: `${GatewaySubgraphBaseUrl}/sepolia/v2.5.12`,
  [SupportedChainId.Mainnet]: `${GatewaySubgraphBaseUrl}/mainnet/v2.0.30`,
  [SupportedChainId.PlasmaTestnet]: `${GatewaySubgraphBaseUrl}/plasma-testnet/v2.0.30`,
  [SupportedChainId.PlasmaMainnet]: `${GatewaySubgraphBaseUrl}/plasma-mainnet/v2.0.30`
};

export type SubgraphClientOptions = GatewayConnectionOptions & {
  /** Deadline for metadata validation, including gateway failover and proxy overhead. */
  metadataTimeoutMs?: number;
};

export const DefaultSubgraphMetadataTimeoutMs = 15_000;

type SubgraphConnection = {
  endpoint: string;
  bearerToken?: string;
  metadataTimeoutMs: number;
};

const resolveSubgraphConnection = (
  defaultEndpoint: string,
  options: string | SubgraphClientOptions
): SubgraphConnection => {
  const config = typeof options === "string" ? { endpoint: options } : options;
  const endpoint = config.endpoint ?? defaultEndpoint;
  if (!endpoint.trim()) throw new Error("Subgraph endpoint must not be empty");
  getConnectionHeaders(config.bearerToken);
  return {
    endpoint,
    bearerToken: config.bearerToken,
    metadataTimeoutMs: resolveHttpTimeout(
      config.metadataTimeoutMs,
      DefaultSubgraphMetadataTimeoutMs
    )
  };
};

const createSubgraphHttpLink = ({ endpoint, bearerToken }: SubgraphConnection): HttpLink =>
  new HttpLink({
    uri: endpoint,
    headers: getConnectionHeaders(bearerToken),
    fetchOptions: bearerToken === undefined ? {} : { redirect: "error" }
  });

export type SubgraphSchemaFamily = "legacy-v2" | "v2.5";

export const SubgraphSchemaFamilies: Record<SupportedChainId, SubgraphSchemaFamily> = {
  [SupportedChainId.Mainnet]: "legacy-v2",
  [SupportedChainId.Sepolia]: "v2.5",
  [SupportedChainId.PlasmaTestnet]: "legacy-v2",
  [SupportedChainId.PlasmaMainnet]: "legacy-v2"
};

export const getSubgraphSchemaFamily = (chainId: SupportedChainId): SubgraphSchemaFamily =>
  SubgraphSchemaFamilies[chainId];

export const usesLegacySubgraphSchema = (chainId: SupportedChainId): boolean =>
  getSubgraphSchemaFamily(chainId) === "legacy-v2";

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

/** Endpoint facts used by V2.5 validation and by consumers for feature gating. */
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

const fetchClientIndexerDeploymentMetadata = async (
  client: ApolloClient<NormalizedCacheObject>,
  endpoint = "Apollo client",
  metadataTimeoutMs = DefaultSubgraphMetadataTimeoutMs,
  bearerToken?: string
): Promise<IndexerDeploymentMetadata> => {
  const controller = new AbortController();
  const queryDefaults = client.defaultOptions.query;
  const callerSignal = queryDefaults?.context?.fetchOptions?.signal as AbortSignal | undefined;
  let onCallerAbort: (() => void) | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let subscription: { unsubscribe: () => void } | undefined;

  try {
    const data = await new Promise<SubgraphGetIndexerDeploymentQuery>((resolve, reject) => {
      onCallerAbort = () => {
        reject(new Error("Metadata query cancelled"));
        controller.abort();
      };
      if (callerSignal?.aborted) {
        onCallerAbort();
        return;
      }
      callerSignal?.addEventListener("abort", onCallerAbort, { once: true });
      timeout = setTimeout(() => {
        // Reject independently of the transport: a custom link may ignore the abort signal.
        reject(
          new SubgraphCompatibilityError(endpoint, [
            {
              code: "METADATA_QUERY_TIMEOUT",
              expected: `Response within ${metadataTimeoutMs}ms`
            }
          ])
        );
        controller.abort();
      }, metadataTimeoutMs);
      subscription = client
        .watchQuery<SubgraphGetIndexerDeploymentQuery>({
          ...queryDefaults,
          query: GetIndexerDeploymentDocument,
          fetchPolicy: "no-cache",
          errorPolicy: queryDefaults?.errorPolicy ?? "none",
          pollInterval: 0,
          context: {
            ...queryDefaults?.context,
            fetchOptions: {
              ...queryDefaults?.context?.fetchOptions,
              signal: controller.signal
            },
            // SDK caches already share metadata reads. Keep cancellation separate from
            // matching queries started by other users of a custom Apollo client.
            queryDeduplication: false
          }
        })
        .subscribe({
          next: ({ data, loading }) => {
            if (!loading) resolve(data);
          },
          error: reject
        });
    });
    const deployment = data.indexerDeployments[0];
    if (!deployment) {
      throw new SubgraphCompatibilityError(endpoint, [{ code: "MISSING_DEPLOYMENT_METADATA" }]);
    }

    try {
      return normalizeIndexerDeployment(deployment);
    } catch (error) {
      throw new SubgraphCompatibilityError(endpoint, [
        {
          code: "INVALID_DEPLOYMENT_METADATA",
          actual: redactConnectionMessage(errorMessage(error), endpoint, bearerToken)
        }
      ]);
    }
  } catch (error) {
    if (error instanceof SubgraphCompatibilityError) throw error;
    throw new SubgraphCompatibilityError(endpoint, [
      {
        code: "METADATA_QUERY_FAILED",
        actual: redactConnectionMessage(errorMessage(error), endpoint, bearerToken)
      }
    ]);
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
    if (onCallerAbort) callerSignal?.removeEventListener("abort", onCallerAbort);
    subscription?.unsubscribe();
  }
};

/** Read and normalize the deployment declaration with a bounded, cancellable request. */
export const fetchIndexerDeploymentMetadata = async (
  endpoint: string,
  options: Omit<SubgraphClientOptions, "endpoint"> = {}
): Promise<IndexerDeploymentMetadata> => {
  const connection = resolveSubgraphConnection(endpoint, { ...options, endpoint });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createSubgraphHttpLink(connection)
  });
  try {
    return await fetchClientIndexerDeploymentMetadata(
      client,
      connection.endpoint,
      connection.metadataTimeoutMs,
      connection.bearerToken
    );
  } finally {
    client.stop();
  }
};

const endpointValidationPromises = new Map<string, Promise<IndexerDeploymentMetadata>>();

const validationCacheKey = (chainId: SupportedChainId, connection: SubgraphConnection): string =>
  JSON.stringify([
    chainId,
    connection.endpoint,
    // Keep credentials out of cache keys while distinguishing rotations and public access.
    connection.bearerToken === undefined ? null : keccak256(stringToHex(connection.bearerToken)),
    connection.metadataTimeoutMs
  ]);

/** Share validation for matching connection settings; evict failures so callers may retry. */
export const validateSubgraphEndpoint = (
  chainId: SupportedChainId,
  options: string | SubgraphClientOptions = {}
): Promise<IndexerDeploymentMetadata> => {
  const connection = resolveSubgraphConnection(SubgraphUrls[chainId], options);
  const cacheKey = validationCacheKey(chainId, connection);
  const cachedValidation = endpointValidationPromises.get(cacheKey);
  if (cachedValidation) return cachedValidation;

  const validation = fetchIndexerDeploymentMetadata(connection.endpoint, connection).then(
    (metadata) => {
      const issues = getSubgraphCompatibilityIssues(chainId, metadata);
      if (issues.length > 0) throw new SubgraphCompatibilityError(connection.endpoint, issues);
      return metadata;
    }
  );
  endpointValidationPromises.set(cacheKey, validation);
  void validation.catch(() => {
    if (endpointValidationPromises.get(cacheKey) === validation) {
      endpointValidationPromises.delete(cacheKey);
    }
  });
  return validation;
};

const subgraphClients = new Map<string, ApolloClient<NormalizedCacheObject>>();
const subgraphClientSchemaFamilies = new WeakMap<
  ApolloClient<NormalizedCacheObject>,
  SubgraphSchemaFamily
>();
const subgraphClientChainIds = new WeakMap<ApolloClient<NormalizedCacheObject>, SupportedChainId>();
const subgraphClientMetadataResolvers = new WeakMap<
  ApolloClient<NormalizedCacheObject>,
  () => Promise<IndexerDeploymentMetadata>
>();
const subgraphClientMetadataPromises = new WeakMap<
  ApolloClient<NormalizedCacheObject>,
  Promise<IndexerDeploymentMetadata>
>();

/** Resolve declared endpoint features for SDK-managed or custom Apollo clients. */
export const getSubgraphClientDeploymentMetadata = (
  client: ApolloClient<NormalizedCacheObject>
): Promise<IndexerDeploymentMetadata> => {
  const cached = subgraphClientMetadataPromises.get(client);
  if (cached) return cached;

  const resolver = subgraphClientMetadataResolvers.get(client);
  const promise = (resolver ? resolver() : fetchClientIndexerDeploymentMetadata(client)).catch(
    (error) => {
      if (subgraphClientMetadataPromises.get(client) === promise) {
        subgraphClientMetadataPromises.delete(client);
      }
      throw error;
    }
  );
  subgraphClientMetadataPromises.set(client, promise);
  return promise;
};

export const requireSubgraphFeature = async (
  client: ApolloClient<NormalizedCacheObject>,
  feature: SubgraphFeature
): Promise<IndexerDeploymentMetadata> => {
  const metadata = await getSubgraphClientDeploymentMetadata(client);
  const availability = getSubgraphFeatureAvailability(metadata, feature);
  if (!availability.available) {
    throw new SubgraphFeatureUnavailableError(feature, availability.reason);
  }
  return metadata;
};

export const getSubgraphClientSchemaFamily = (
  client: ApolloClient<NormalizedCacheObject>
): SubgraphSchemaFamily | undefined => subgraphClientSchemaFamilies.get(client);

export const getSubgraphClientChainId = (
  client: ApolloClient<NormalizedCacheObject>
): SupportedChainId | undefined => subgraphClientChainIds.get(client);

const getLegacySubgraphDeploymentMetadata = (
  chainId: SupportedChainId
): IndexerDeploymentMetadata => ({
  ...SubgraphDeploymentRequirementsByChain[chainId],
  schemaRelease: "legacy-v2",
  configDigest: "",
  firstObserved: {
    blockNumber: 0n,
    blockTimestamp: 0n,
    transactionHash: `0x${"0".repeat(64)}`,
    logIndex: 0n
  }
});

/** Construct a client for the chain's configured schema family. */
export const createSubgraphClient = (
  chainId: SupportedChainId,
  options: string | SubgraphClientOptions = {}
): ApolloClient<NormalizedCacheObject> => {
  const connection = resolveSubgraphConnection(SubgraphUrls[chainId], options);
  if (usesLegacySubgraphSchema(chainId)) {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: createSubgraphHttpLink(connection)
    });
    subgraphClientSchemaFamilies.set(client, "legacy-v2");
    subgraphClientChainIds.set(client, chainId);
    subgraphClientMetadataResolvers.set(client, async () =>
      getLegacySubgraphDeploymentMetadata(chainId)
    );
    return client;
  }

  const validationLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let cancelled = false;
        let operationSubscription: { unsubscribe: () => void } | undefined;

        void validateSubgraphEndpoint(chainId, connection)
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

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: validationLink.concat(createSubgraphHttpLink(connection))
  });
  subgraphClientSchemaFamilies.set(client, "v2.5");
  subgraphClientChainIds.set(client, chainId);
  subgraphClientMetadataResolvers.set(client, () => validateSubgraphEndpoint(chainId, connection));
  return client;
};

export const getSubgraphClient = (
  chainId: SupportedChainId,
  options: string | SubgraphClientOptions = {}
): ApolloClient<NormalizedCacheObject> => {
  const connection = resolveSubgraphConnection(SubgraphUrls[chainId], options);
  const cacheKey = validationCacheKey(chainId, connection);
  const cachedClient = subgraphClients.get(cacheKey);
  if (cachedClient) return cachedClient;

  const client = createSubgraphClient(chainId, connection);
  subgraphClients.set(cacheKey, client);
  return client;
};
