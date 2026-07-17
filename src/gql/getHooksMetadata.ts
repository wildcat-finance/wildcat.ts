import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { HooksFactoryMetadata, HooksTemplateRegistrationMetadata } from "../domain";
import {
  normalizeSubgraphHooksFactoryData,
  normalizeSubgraphHooksTemplateRegistrationData
} from "../access/subgraph-template";
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
  const factories: HooksFactoryMetadata[] = [];
  for (let skip = 0; ; skip += HooksMetadataPageSize) {
    const { data } = await subgraphClient.query<
      SubgraphGetHooksFactoriesQuery,
      SubgraphGetHooksFactoriesQueryVariables
    >({
      query: GetHooksFactoriesDocument,
      fetchPolicy,
      variables: { first: HooksMetadataPageSize, skip }
    });
    factories.push(...data.hooksFactories.map(normalizeSubgraphHooksFactoryData));
    if (data.hooksFactories.length < HooksMetadataPageSize) return factories;
  }
};

/** One independent registration for every hooks-factory/template pair. */
export const getHooksTemplateRegistrations = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy = "cache-first" }: GetHooksMetadataOptions = {}
): Promise<HooksTemplateRegistrationMetadata[]> => {
  const registrations: HooksTemplateRegistrationMetadata[] = [];
  for (let skip = 0; ; skip += HooksMetadataPageSize) {
    const { data } = await subgraphClient.query<
      SubgraphGetHooksTemplateRegistrationsQuery,
      SubgraphGetHooksTemplateRegistrationsQueryVariables
    >({
      query: GetHooksTemplateRegistrationsDocument,
      fetchPolicy,
      variables: { first: HooksMetadataPageSize, skip }
    });
    registrations.push(
      ...data.hooksTemplateRegistrations.map(normalizeSubgraphHooksTemplateRegistrationData)
    );
    if (data.hooksTemplateRegistrations.length < HooksMetadataPageSize) return registrations;
  }
};
