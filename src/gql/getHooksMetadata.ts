import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { HooksFactoryMetadata, HooksTemplateRegistrationMetadata } from "../domain";
import { getSubgraphClientChainId, getSubgraphClientSchemaFamily } from "../config";
import {
  normalizeSubgraphHooksFactoryData,
  normalizeSubgraphHooksTemplateRegistrationData
} from "./normalizers";
import {
  LegacyGetHooksFactoriesDocument,
  LegacyGetHooksTemplateRegistrationsDocument,
  LegacyHooksFactoryData,
  LegacyHooksTemplateData,
  normalizeLegacyHooksFactoryData,
  normalizeLegacyHooksTemplateRegistrationData
} from "./legacy-subgraph";
import {
  GetHooksFactoriesDocument,
  GetHooksTemplateRegistrationsDocument,
  SubgraphGetHooksFactoriesQuery,
  SubgraphGetHooksFactoriesQueryVariables,
  SubgraphGetHooksTemplateRegistrationsQuery,
  SubgraphGetHooksTemplateRegistrationsQueryVariables
} from "./graphql";

export type GetHooksMetadataOptions = {
  fetchPolicy?: FetchPolicy;
};

const HooksMetadataPageSize = 1_000;

/** All factories known to the indexer, including historical and deregistered factories. */
export const getHooksFactories = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy = "cache-first" }: GetHooksMetadataOptions = {}
): Promise<HooksFactoryMetadata[]> => {
  const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
  const chainId = getSubgraphClientChainId(subgraphClient);
  if (legacySchema && chainId === undefined) {
    throw new Error("Legacy subgraph client is missing its chain ID");
  }
  const factories: HooksFactoryMetadata[] = [];
  for (let skip = 0; ; skip += HooksMetadataPageSize) {
    const { data } = await subgraphClient.query<
      SubgraphGetHooksFactoriesQuery | { hooksFactories: LegacyHooksFactoryData[] },
      SubgraphGetHooksFactoriesQueryVariables
    >({
      query: legacySchema ? LegacyGetHooksFactoriesDocument : GetHooksFactoriesDocument,
      fetchPolicy,
      variables: { first: HooksMetadataPageSize, skip }
    });
    const page = legacySchema
      ? (data as { hooksFactories: LegacyHooksFactoryData[] }).hooksFactories.map((factory) =>
          normalizeLegacyHooksFactoryData(chainId!, factory)
        )
      : (data as SubgraphGetHooksFactoriesQuery).hooksFactories;
    factories.push(...page.map(normalizeSubgraphHooksFactoryData));
    if (page.length < HooksMetadataPageSize) return factories;
  }
};

/** One independent registration for every hooks-factory/template pair. */
export const getHooksTemplateRegistrations = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy = "cache-first" }: GetHooksMetadataOptions = {}
): Promise<HooksTemplateRegistrationMetadata[]> => {
  const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
  const chainId = getSubgraphClientChainId(subgraphClient);
  if (legacySchema && chainId === undefined) {
    throw new Error("Legacy subgraph client is missing its chain ID");
  }
  const registrations: HooksTemplateRegistrationMetadata[] = [];
  for (let skip = 0; ; skip += HooksMetadataPageSize) {
    const { data } = await subgraphClient.query<
      SubgraphGetHooksTemplateRegistrationsQuery | { hooksTemplates: LegacyHooksTemplateData[] },
      SubgraphGetHooksTemplateRegistrationsQueryVariables
    >({
      query: legacySchema
        ? LegacyGetHooksTemplateRegistrationsDocument
        : GetHooksTemplateRegistrationsDocument,
      fetchPolicy,
      variables: { first: HooksMetadataPageSize, skip }
    });
    const page = legacySchema
      ? (data as { hooksTemplates: LegacyHooksTemplateData[] }).hooksTemplates.map((template) =>
          normalizeLegacyHooksTemplateRegistrationData(chainId!, template)
        )
      : (data as SubgraphGetHooksTemplateRegistrationsQuery).hooksTemplateRegistrations;
    registrations.push(...page.map(normalizeSubgraphHooksTemplateRegistrationData));
    if (page.length < HooksMetadataPageSize) return registrations;
  }
};
