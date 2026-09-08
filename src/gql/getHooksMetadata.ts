import { IndexedTraversalOptions } from "../indexed-pagination";
import { IndexedPageProgress, withIndexedTraversal } from "../internal/indexed-traversal";
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

export type GetHooksMetadataOptions = IndexedTraversalOptions & {
  fetchPolicy?: FetchPolicy;
};

const HooksMetadataPageSize = 1_000;

/** All factories known to the indexer, including historical and deregistered factories. */
export const getHooksFactories = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy = "cache-first", ...options }: GetHooksMetadataOptions = {}
): Promise<HooksFactoryMetadata[]> =>
  withIndexedTraversal(options, async (traversal) => {
    const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
    const chainId = getSubgraphClientChainId(subgraphClient);
    if (legacySchema && chainId === undefined) {
      throw new Error("Legacy subgraph client is missing its chain ID");
    }
    const factories: HooksFactoryMetadata[] = [];
    const progress = new IndexedPageProgress();
    for (let skip = 0; ; skip += HooksMetadataPageSize) {
      const { data } = await traversal.query<
        SubgraphGetHooksFactoriesQuery | { hooksFactories: LegacyHooksFactoryData[] },
        SubgraphGetHooksFactoriesQueryVariables
      >(subgraphClient, {
        query: legacySchema ? LegacyGetHooksFactoriesDocument : GetHooksFactoriesDocument,
        fetchPolicy,
        variables: { first: HooksMetadataPageSize, skip }
      });
      traversal.accept(
        legacySchema
          ? (data as { hooksFactories: LegacyHooksFactoryData[] }).hooksFactories
          : (data as SubgraphGetHooksFactoriesQuery).hooksFactories,
        HooksMetadataPageSize,
        progress
      );
      const page = legacySchema
        ? (data as { hooksFactories: LegacyHooksFactoryData[] }).hooksFactories.map((factory) =>
            normalizeLegacyHooksFactoryData(chainId!, factory)
          )
        : (data as SubgraphGetHooksFactoriesQuery).hooksFactories;
      factories.push(...page.map(normalizeSubgraphHooksFactoryData));
      if (page.length < HooksMetadataPageSize) return factories;
    }
  });

/** One independent registration for every hooks-factory/template pair. */
export const getHooksTemplateRegistrations = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy = "cache-first", ...options }: GetHooksMetadataOptions = {}
): Promise<HooksTemplateRegistrationMetadata[]> =>
  withIndexedTraversal(options, async (traversal) => {
    const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
    const chainId = getSubgraphClientChainId(subgraphClient);
    if (legacySchema && chainId === undefined) {
      throw new Error("Legacy subgraph client is missing its chain ID");
    }
    const registrations: HooksTemplateRegistrationMetadata[] = [];
    const progress = new IndexedPageProgress();
    for (let skip = 0; ; skip += HooksMetadataPageSize) {
      const { data } = await traversal.query<
        SubgraphGetHooksTemplateRegistrationsQuery | { hooksTemplates: LegacyHooksTemplateData[] },
        SubgraphGetHooksTemplateRegistrationsQueryVariables
      >(subgraphClient, {
        query: legacySchema
          ? LegacyGetHooksTemplateRegistrationsDocument
          : GetHooksTemplateRegistrationsDocument,
        fetchPolicy,
        variables: { first: HooksMetadataPageSize, skip }
      });
      traversal.accept(
        legacySchema
          ? (data as { hooksTemplates: LegacyHooksTemplateData[] }).hooksTemplates
          : (data as SubgraphGetHooksTemplateRegistrationsQuery).hooksTemplateRegistrations,
        HooksMetadataPageSize,
        progress
      );
      const page = legacySchema
        ? (data as { hooksTemplates: LegacyHooksTemplateData[] }).hooksTemplates.map((template) =>
            normalizeLegacyHooksTemplateRegistrationData(chainId!, template)
          )
        : (data as SubgraphGetHooksTemplateRegistrationsQuery).hooksTemplateRegistrations;
      registrations.push(...page.map(normalizeSubgraphHooksTemplateRegistrationData));
      if (page.length < HooksMetadataPageSize) return registrations;
    }
  });
