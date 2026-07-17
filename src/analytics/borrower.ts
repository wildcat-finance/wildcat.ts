import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { requireSubgraphFeature } from "../config";
import {
  GetBorrowerAnalyticsProfileDocument,
  GetBorrowerDailyStatsPageDocument,
  GetBorrowerWithdrawalReliabilityPageDocument,
  SubgraphBorrowerDailyStats_Filter,
  SubgraphGetBorrowerAnalyticsProfileQuery,
  SubgraphGetBorrowerAnalyticsProfileQueryVariables,
  SubgraphGetBorrowerDailyStatsPageQuery,
  SubgraphGetBorrowerDailyStatsPageQueryVariables,
  SubgraphGetBorrowerWithdrawalReliabilityPageQuery,
  SubgraphGetBorrowerWithdrawalReliabilityPageQueryVariables,
  SubgraphWithdrawalBatch_Filter
} from "../gql/graphql";
import { assert } from "../utils";
import {
  normalizeBorrowerAggregateStats,
  normalizeBorrowerDailyStats,
  normalizeBorrowerIdentity,
  normalizeBorrowerWithdrawalReliability,
  normalizeIndexedQueryMetadata
} from "./normalizers";
import { IndexedReadOptions, IndexedTimeRange, normalizeAddresses } from "./read-options";
import {
  BorrowerAnalyticsProfile,
  BorrowerDailyStats,
  BorrowerWithdrawalReliability,
  IndexedPage
} from "./types";
import { normalizeIndexedPageRequest, toIndexedPage } from "./pagination";

export type GetBorrowerAnalyticsProfileOptions = {
  borrower: string;
  fetchPolicy?: FetchPolicy;
};

/** Canonical indexed borrower identity plus its all-time analytics aggregate. */
export const getBorrowerAnalyticsProfile = async (
  client: ApolloClient<NormalizedCacheObject>,
  { borrower, fetchPolicy = "cache-first" }: GetBorrowerAnalyticsProfileOptions
): Promise<BorrowerAnalyticsProfile> => {
  await requireSubgraphFeature(client, "analytics");
  const normalizedBorrower = borrower.toLowerCase();
  const { data } = await client.query<
    SubgraphGetBorrowerAnalyticsProfileQuery,
    SubgraphGetBorrowerAnalyticsProfileQueryVariables
  >({
    query: GetBorrowerAnalyticsProfileDocument,
    variables: { borrowerId: normalizedBorrower, borrower: normalizedBorrower },
    fetchPolicy
  });
  const stats = data.borrowerStats_collection[0];
  return {
    indexedAt: normalizeIndexedQueryMetadata(data._meta),
    ...(data.borrower ? { identity: normalizeBorrowerIdentity(data.borrower) } : {}),
    ...(stats ? { stats: normalizeBorrowerAggregateStats(stats) } : {})
  };
};

export type GetBorrowerDailyStatsPageOptions = IndexedReadOptions &
  IndexedTimeRange & {
    borrower: string;
  };

export const getBorrowerDailyStatsPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetBorrowerDailyStatsPageOptions
): Promise<IndexedPage<BorrowerDailyStats>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphBorrowerDailyStats_Filter = {
    borrower: borrower.toLowerCase(),
    id_gt: afterId,
    ...(fromTimestamp !== undefined ? { startTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { startTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetBorrowerDailyStatsPageQuery,
    SubgraphGetBorrowerDailyStatsPageQueryVariables
  >({
    query: GetBorrowerDailyStatsPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.borrowerDailyStats_collection.map(normalizeBorrowerDailyStats),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetBorrowerWithdrawalReliabilityPageOptions = IndexedReadOptions & {
  borrower?: string;
  markets?: readonly string[];
};

/** Withdrawal-batch outcomes used to derive borrower payment reliability. */
export const getBorrowerWithdrawalReliabilityPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    borrower,
    markets,
    fetchPolicy = "cache-first",
    ...request
  }: GetBorrowerWithdrawalReliabilityPageOptions
): Promise<IndexedPage<BorrowerWithdrawalReliability>> => {
  assert(borrower !== undefined || markets !== undefined, "Missing borrower reliability scope");
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphWithdrawalBatch_Filter = {
    id_gt: afterId,
    ...(markets ? { market_in: normalizeAddresses(markets) } : {}),
    ...(borrower ? { market_: { borrower: borrower.toLowerCase() } } : {})
  };
  const { data } = await client.query<
    SubgraphGetBorrowerWithdrawalReliabilityPageQuery,
    SubgraphGetBorrowerWithdrawalReliabilityPageQueryVariables
  >({
    query: GetBorrowerWithdrawalReliabilityPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.withdrawalBatches.map(normalizeBorrowerWithdrawalReliability),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};
