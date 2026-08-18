import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { getSubgraphClientSchemaFamily, requireSubgraphFeature } from "../config";
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
  normalizeAnalyticsMarket,
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
import {
  LegacyBorrowerWithdrawalReliabilityData,
  LegacyGetBorrowerAnalyticsProfileDocument,
  LegacyGetBorrowerWithdrawalReliabilityPageDocument,
  LegacyIndexedAtData
} from "./legacy";

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
  const legacySchema = getSubgraphClientSchemaFamily(client) === "legacy-v2";
  const normalizedBorrower = borrower.toLowerCase();
  const { data } = await client.query<
    SubgraphGetBorrowerAnalyticsProfileQuery,
    SubgraphGetBorrowerAnalyticsProfileQueryVariables
  >({
    query: legacySchema
      ? LegacyGetBorrowerAnalyticsProfileDocument
      : GetBorrowerAnalyticsProfileDocument,
    variables: legacySchema
      ? ({ borrower: normalizedBorrower } as SubgraphGetBorrowerAnalyticsProfileQueryVariables)
      : { borrowerId: normalizedBorrower, borrower: normalizedBorrower },
    fetchPolicy
  });
  const stats = data.borrowerStats_collection[0];
  return {
    indexedAt: normalizeIndexedQueryMetadata(data._meta),
    ...(!legacySchema && data.borrower
      ? { identity: normalizeBorrowerIdentity(data.borrower) }
      : {}),
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

const indexedAtFromLegacy = (data: LegacyIndexedAtData) => ({
  blockNumber: BigInt(data.blockNumber),
  blockTimestamp: BigInt(data.blockTimestamp),
  transactionHash: data.transactionHash,
  logIndex: BigInt(data.blockLogIndex)
});

const normalizeLegacyBorrowerWithdrawalReliability = (
  data: LegacyBorrowerWithdrawalReliabilityData
): BorrowerWithdrawalReliability => {
  const updateEvents = [
    data.creation,
    ...(data.expiration ? [data.expiration] : []),
    ...data.requests,
    ...data.payments
  ];
  const updatedAt = updateEvents.reduce((latest, event) =>
    event.blockTimestamp >= latest.blockTimestamp ? event : latest
  );
  return {
    id: data.id,
    market: normalizeAnalyticsMarket(data.market as Parameters<typeof normalizeAnalyticsMarket>[0]),
    expiry: BigInt(data.expiry),
    totalNormalizedRequests: BigInt(data.totalNormalizedRequests),
    isExpired: data.isExpired,
    isClosed: data.isClosed,
    isCompleted: data.isCompleted,
    updatedAt: indexedAtFromLegacy(updatedAt),
    ...(data.expiration
      ? {
          expiration: {
            normalizedAmountPaid: BigInt(data.expiration.normalizedAmountPaid),
            normalizedAmountOwed: BigInt(data.expiration.normalizedAmountOwed),
            observedAt: indexedAtFromLegacy(data.expiration)
          }
        }
      : {})
  };
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
  const legacySchema = getSubgraphClientSchemaFamily(client) === "legacy-v2";
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
    query: legacySchema
      ? LegacyGetBorrowerWithdrawalReliabilityPageDocument
      : GetBorrowerWithdrawalReliabilityPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    legacySchema
      ? (data.withdrawalBatches as unknown as LegacyBorrowerWithdrawalReliabilityData[]).map(
          normalizeLegacyBorrowerWithdrawalReliability
        )
      : data.withdrawalBatches.map(normalizeBorrowerWithdrawalReliability),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};
