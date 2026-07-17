import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { requireSubgraphFeature } from "../config";
import {
  GetLenderAnalyticsProfileDocument,
  GetLenderDailyStatsPageDocument,
  GetLenderDepositPageDocument,
  GetLenderPositionPageDocument,
  GetLenderTransferPageDocument,
  GetLenderWithdrawalExecutionPageDocument,
  GetLenderWithdrawalRequestPageDocument,
  GetLenderWithdrawalStatusPageDocument,
  SubgraphDeposit_Filter,
  SubgraphGetLenderAnalyticsProfileQuery,
  SubgraphGetLenderAnalyticsProfileQueryVariables,
  SubgraphGetLenderDailyStatsPageQuery,
  SubgraphGetLenderDailyStatsPageQueryVariables,
  SubgraphGetLenderDepositPageQuery,
  SubgraphGetLenderDepositPageQueryVariables,
  SubgraphGetLenderPositionPageQuery,
  SubgraphGetLenderPositionPageQueryVariables,
  SubgraphGetLenderTransferPageQuery,
  SubgraphGetLenderTransferPageQueryVariables,
  SubgraphGetLenderWithdrawalExecutionPageQuery,
  SubgraphGetLenderWithdrawalExecutionPageQueryVariables,
  SubgraphGetLenderWithdrawalRequestPageQuery,
  SubgraphGetLenderWithdrawalRequestPageQueryVariables,
  SubgraphGetLenderWithdrawalStatusPageQuery,
  SubgraphGetLenderWithdrawalStatusPageQueryVariables,
  SubgraphLenderAccount_Filter,
  SubgraphLenderDailyStats_Filter,
  SubgraphLenderWithdrawalStatus_Filter,
  SubgraphTransfer_Filter,
  SubgraphWithdrawalExecution_Filter,
  SubgraphWithdrawalRequest_Filter
} from "../gql/graphql";
import {
  normalizeLenderAggregateStats,
  normalizeLenderDailyStats,
  normalizeLenderDeposit,
  normalizeIndexedQueryMetadata,
  normalizeLenderPosition,
  normalizeLenderTransfer,
  normalizeLenderWithdrawalExecution,
  normalizeLenderWithdrawalRequest,
  normalizeLenderWithdrawalStatus
} from "./normalizers";
import { normalizeIndexedPageRequest, toIndexedPage } from "./pagination";
import { IndexedReadOptions, IndexedTimeRange, normalizeAddresses } from "./read-options";
import {
  IndexedLenderWithdrawalStatus,
  IndexedPage,
  LenderAnalyticsProfile,
  LenderDailyStats,
  LenderDeposit,
  LenderPosition,
  LenderTransfer,
  LenderWithdrawalExecution,
  LenderWithdrawalRequest
} from "./types";

export const getLenderAccountId = (market: string, lender: string): string =>
  `LENDER-${market.toLowerCase()}-${lender.toLowerCase()}`;

export type GetLenderAnalyticsProfileOptions = {
  lender: string;
  fetchPolicy?: FetchPolicy;
};

/** All-time lender identity and aggregate at an explicit indexed block. */
export const getLenderAnalyticsProfile = async (
  client: ApolloClient<NormalizedCacheObject>,
  { lender, fetchPolicy = "cache-first" }: GetLenderAnalyticsProfileOptions
): Promise<LenderAnalyticsProfile> => {
  await requireSubgraphFeature(client, "analytics");
  const { data } = await client.query<
    SubgraphGetLenderAnalyticsProfileQuery,
    SubgraphGetLenderAnalyticsProfileQueryVariables
  >({
    query: GetLenderAnalyticsProfileDocument,
    variables: { lender: lender.toLowerCase() },
    fetchPolicy
  });
  const stats = data.lenderStats_collection[0];
  return {
    indexedAt: normalizeIndexedQueryMetadata(data._meta),
    ...(stats ? { stats: normalizeLenderAggregateStats(stats) } : {})
  };
};

export type GetLenderPositionPageOptions = IndexedReadOptions & {
  lender?: string;
  markets?: readonly string[];
  activeOnly?: boolean;
};

export const getLenderPositionPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    markets,
    activeOnly = false,
    fetchPolicy = "cache-first",
    ...request
  }: GetLenderPositionPageOptions
): Promise<IndexedPage<LenderPosition>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphLenderAccount_Filter = {
    id_gt: afterId,
    ...(lender ? { address: lender.toLowerCase() } : {}),
    ...(markets ? { market_in: normalizeAddresses(markets) } : {}),
    ...(activeOnly ? { scaledBalance_gt: 0 } : {})
  };
  const { data } = await client.query<
    SubgraphGetLenderPositionPageQuery,
    SubgraphGetLenderPositionPageQueryVariables
  >({
    query: GetLenderPositionPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.lenderAccounts.map(normalizeLenderPosition),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetLenderDailyStatsPageOptions = IndexedReadOptions &
  IndexedTimeRange & {
    lender: string;
  };

export const getLenderDailyStatsPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetLenderDailyStatsPageOptions
): Promise<IndexedPage<LenderDailyStats>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphLenderDailyStats_Filter = {
    id_gt: afterId,
    lender: lender.toLowerCase(),
    ...(fromTimestamp !== undefined ? { startTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { startTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetLenderDailyStatsPageQuery,
    SubgraphGetLenderDailyStatsPageQueryVariables
  >({
    query: GetLenderDailyStatsPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.lenderDailyStats_collection.map(normalizeLenderDailyStats),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetLenderActivityPageOptions = IndexedReadOptions &
  IndexedTimeRange & {
    lender: string;
    markets?: readonly string[];
  };

const lenderAccountFilter = (
  lender: string,
  markets?: readonly string[]
): SubgraphLenderAccount_Filter => ({
  address: lender.toLowerCase(),
  ...(markets ? { market_in: normalizeAddresses(markets) } : {})
});

const blockTimeRange = (fromTimestamp?: number, toTimestamp?: number) => ({
  ...(fromTimestamp !== undefined ? { blockTimestamp_gte: fromTimestamp } : {}),
  ...(toTimestamp !== undefined ? { blockTimestamp_lt: toTimestamp } : {})
});

export const getLenderDepositPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    markets,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetLenderActivityPageOptions
): Promise<IndexedPage<LenderDeposit>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphDeposit_Filter = {
    id_gt: afterId,
    account_: lenderAccountFilter(lender, markets),
    ...blockTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetLenderDepositPageQuery,
    SubgraphGetLenderDepositPageQueryVariables
  >({
    query: GetLenderDepositPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.deposits.map(normalizeLenderDeposit),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getLenderWithdrawalRequestPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    markets,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetLenderActivityPageOptions
): Promise<IndexedPage<LenderWithdrawalRequest>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphWithdrawalRequest_Filter = {
    id_gt: afterId,
    account_: lenderAccountFilter(lender, markets),
    ...blockTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetLenderWithdrawalRequestPageQuery,
    SubgraphGetLenderWithdrawalRequestPageQueryVariables
  >({
    query: GetLenderWithdrawalRequestPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.withdrawalRequests.map(normalizeLenderWithdrawalRequest),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getLenderWithdrawalExecutionPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    markets,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetLenderActivityPageOptions
): Promise<IndexedPage<LenderWithdrawalExecution>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphWithdrawalExecution_Filter = {
    id_gt: afterId,
    account_: lenderAccountFilter(lender, markets),
    ...blockTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetLenderWithdrawalExecutionPageQuery,
    SubgraphGetLenderWithdrawalExecutionPageQueryVariables
  >({
    query: GetLenderWithdrawalExecutionPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.withdrawalExecutions.map(normalizeLenderWithdrawalExecution),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetLenderTransferPageOptions = GetLenderActivityPageOptions & {
  direction?: "in" | "out" | "either";
};

export const getLenderTransferPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    markets,
    direction = "either",
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetLenderTransferPageOptions
): Promise<IndexedPage<LenderTransfer>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const accountFilter = lenderAccountFilter(lender, markets);
  const partyFilter: SubgraphTransfer_Filter =
    direction === "in"
      ? { to_: accountFilter }
      : direction === "out"
      ? { from_: accountFilter }
      : { or: [{ from_: accountFilter }, { to_: accountFilter }] };
  const filter: SubgraphTransfer_Filter = {
    id_gt: afterId,
    ...partyFilter,
    ...(markets ? { market_in: normalizeAddresses(markets) } : {}),
    ...blockTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetLenderTransferPageQuery,
    SubgraphGetLenderTransferPageQueryVariables
  >({
    query: GetLenderTransferPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.transfers.map(normalizeLenderTransfer),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getLenderWithdrawalStatusPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    markets,
    fetchPolicy = "cache-first",
    ...request
  }: Omit<GetLenderActivityPageOptions, keyof IndexedTimeRange>
): Promise<IndexedPage<IndexedLenderWithdrawalStatus>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphLenderWithdrawalStatus_Filter = {
    id_gt: afterId,
    account_: lenderAccountFilter(lender, markets)
  };
  const { data } = await client.query<
    SubgraphGetLenderWithdrawalStatusPageQuery,
    SubgraphGetLenderWithdrawalStatusPageQueryVariables
  >({
    query: GetLenderWithdrawalStatusPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.lenderWithdrawalStatuses.map(normalizeLenderWithdrawalStatus),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};
