import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { getSubgraphClientSchemaFamily, requireSubgraphFeature } from "../config";
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
  normalizeLenderWithdrawalStatus,
  normalizeAnalyticsMarket
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
import {
  LegacyGetLenderDepositPageDocument,
  LegacyGetLenderPositionPageDocument,
  LegacyGetLenderTransferPageDocument,
  LegacyGetLenderWithdrawalExecutionPageDocument,
  LegacyGetLenderWithdrawalRequestPageDocument,
  LegacyGetLenderWithdrawalStatusPageDocument,
  LegacyIndexedAtData,
  LegacyLenderWithdrawalStatusData
} from "./legacy";

const usesLegacyAnalyticsSchema = (client: ApolloClient<NormalizedCacheObject>): boolean =>
  getSubgraphClientSchemaFamily(client) === "legacy-v2";

const indexedAtFromLegacy = (data: LegacyIndexedAtData) => ({
  blockNumber: BigInt(data.blockNumber),
  blockTimestamp: BigInt(data.blockTimestamp),
  transactionHash: data.transactionHash,
  logIndex: BigInt(data.blockLogIndex)
});

const normalizeLegacyLenderWithdrawalStatus = (
  data: LegacyLenderWithdrawalStatusData
): IndexedLenderWithdrawalStatus => {
  const updateEvents = [data.batch.creation, ...data.requests, ...data.executions];
  const updatedAt = updateEvents.reduce((latest, event) =>
    event.blockTimestamp >= latest.blockTimestamp ? event : latest
  );
  return {
    id: data.id,
    accountId: data.account.id,
    lender: data.account.address,
    market: normalizeAnalyticsMarket(
      data.account.market as Parameters<typeof normalizeAnalyticsMarket>[0]
    ),
    batch: {
      id: data.batch.id,
      expiry: BigInt(data.batch.expiry),
      isClosed: data.batch.isClosed,
      isExpired: data.batch.isExpired,
      isCompleted: data.batch.isCompleted,
      createdAt: indexedAtFromLegacy(data.batch.creation)
    },
    scaledAmount: BigInt(data.scaledAmount),
    normalizedAmountWithdrawn: BigInt(data.normalizedAmountWithdrawn),
    totalNormalizedRequests: BigInt(data.totalNormalizedRequests),
    isCompleted: data.isCompleted,
    updatedAt: indexedAtFromLegacy(updatedAt)
  };
};

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
  const legacySchema = usesLegacyAnalyticsSchema(client);
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
    query: legacySchema ? LegacyGetLenderPositionPageDocument : GetLenderPositionPageDocument,
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
  const legacySchema = usesLegacyAnalyticsSchema(client);
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
    query: legacySchema ? LegacyGetLenderDepositPageDocument : GetLenderDepositPageDocument,
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
  const legacySchema = usesLegacyAnalyticsSchema(client);
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
    query: legacySchema
      ? LegacyGetLenderWithdrawalRequestPageDocument
      : GetLenderWithdrawalRequestPageDocument,
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
  const legacySchema = usesLegacyAnalyticsSchema(client);
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
    query: legacySchema
      ? LegacyGetLenderWithdrawalExecutionPageDocument
      : GetLenderWithdrawalExecutionPageDocument,
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
  const legacySchema = usesLegacyAnalyticsSchema(client);
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const accountFilter = lenderAccountFilter(lender, markets);
  const commonFilter: SubgraphTransfer_Filter = {
    id_gt: afterId,
    ...(markets ? { market_in: normalizeAddresses(markets) } : {}),
    ...blockTimeRange(fromTimestamp, toTimestamp)
  };
  const filter: SubgraphTransfer_Filter =
    direction === "in"
      ? { ...commonFilter, to_: accountFilter }
      : direction === "out"
      ? { ...commonFilter, from_: accountFilter }
      : {
          or: [
            { ...commonFilter, from_: accountFilter },
            { ...commonFilter, to_: accountFilter }
          ]
        };
  const { data } = await client.query<
    SubgraphGetLenderTransferPageQuery,
    SubgraphGetLenderTransferPageQueryVariables
  >({
    query: legacySchema ? LegacyGetLenderTransferPageDocument : GetLenderTransferPageDocument,
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
  const legacySchema = usesLegacyAnalyticsSchema(client);
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphLenderWithdrawalStatus_Filter = {
    id_gt: afterId,
    account_: lenderAccountFilter(lender, markets)
  };
  const { data } = await client.query<
    SubgraphGetLenderWithdrawalStatusPageQuery,
    SubgraphGetLenderWithdrawalStatusPageQueryVariables
  >({
    query: legacySchema
      ? LegacyGetLenderWithdrawalStatusPageDocument
      : GetLenderWithdrawalStatusPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    legacySchema
      ? (data.lenderWithdrawalStatuses as unknown as LegacyLenderWithdrawalStatusData[]).map(
          normalizeLegacyLenderWithdrawalStatus
        )
      : data.lenderWithdrawalStatuses.map(normalizeLenderWithdrawalStatus),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};
