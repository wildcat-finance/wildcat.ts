import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { requireSubgraphFeature } from "../config";
import {
  GetProtocolAnalyticsStatsDocument,
  GetProtocolDailyStatsPageDocument,
  SubgraphGetProtocolAnalyticsStatsQuery,
  SubgraphGetProtocolDailyStatsPageQuery,
  SubgraphGetProtocolDailyStatsPageQueryVariables,
  SubgraphProtocolDailyStats_Filter
} from "../gql/graphql";
import {
  normalizeIndexedQueryMetadata,
  normalizeProtocolAggregateStats,
  normalizeProtocolDailyStats
} from "./normalizers";
import { normalizeIndexedPageRequest, toIndexedPage } from "./pagination";
import { IndexedReadOptions, IndexedTimeRange } from "./read-options";
import { IndexedPage, ProtocolAnalyticsSnapshot, ProtocolDailyStats } from "./types";

export const getProtocolAnalyticsStats = async (
  client: ApolloClient<NormalizedCacheObject>,
  fetchPolicy: FetchPolicy = "cache-first"
): Promise<ProtocolAnalyticsSnapshot> => {
  await requireSubgraphFeature(client, "analytics");
  const { data } = await client.query<SubgraphGetProtocolAnalyticsStatsQuery>({
    query: GetProtocolAnalyticsStatsDocument,
    fetchPolicy
  });
  return {
    indexedAt: normalizeIndexedQueryMetadata(data._meta),
    ...(data.protocolStats ? { stats: normalizeProtocolAggregateStats(data.protocolStats) } : {})
  };
};

export type GetProtocolDailyStatsPageOptions = IndexedReadOptions & IndexedTimeRange;

export const getProtocolDailyStatsPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetProtocolDailyStatsPageOptions = {}
): Promise<IndexedPage<ProtocolDailyStats>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphProtocolDailyStats_Filter = {
    id_gt: afterId,
    ...(fromTimestamp !== undefined ? { startTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { startTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetProtocolDailyStatsPageQuery,
    SubgraphGetProtocolDailyStatsPageQueryVariables
  >({
    query: GetProtocolDailyStatsPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.protocolDailyStats_collection.map(normalizeProtocolDailyStats),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};
