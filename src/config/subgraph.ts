import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { SupportedChainId } from "./chains";

export type SubgraphCompatibilityIssueCode =
  | "CHAIN_ID_MISMATCH"
  | "SCHEMA_RELEASE_MISMATCH"
  | "MISSING_CONFIG_DIGEST"
  | "UNSUPPORTED_PRICING_MODE";

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

/** Transitional old-endpoint schema capabilities. Removed during the V2.5 schema cutover. */
export const SubgraphSchemaFeatures = {
  [SupportedChainId.Sepolia]: { periodicTerm: true },
  [SupportedChainId.Mainnet]: { periodicTerm: false },
  [SupportedChainId.PlasmaTestnet]: { periodicTerm: false },
  [SupportedChainId.PlasmaMainnet]: { periodicTerm: false }
} as const;

export const supportsPeriodicTermSchema = (chainId: SupportedChainId): boolean =>
  SubgraphSchemaFeatures[chainId].periodicTerm;

const subgraphClients = new Map<SupportedChainId, ApolloClient<NormalizedCacheObject>>();

export const getSubgraphClient = (
  chainId: SupportedChainId
): ApolloClient<NormalizedCacheObject> => {
  const cachedClient = subgraphClients.get(chainId);
  if (cachedClient) return cachedClient;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: SubgraphUrls[chainId]
  });
  subgraphClients.set(chainId, client);
  return client;
};
