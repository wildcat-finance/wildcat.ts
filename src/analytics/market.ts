import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { requireSubgraphFeature } from "../config";
import {
  GetAnnualInterestBipsUpdatePageDocument,
  GetDelinquencyStatusChangePageDocument,
  GetMarketAggregatePageDocument,
  GetMarketBorrowPageDocument,
  GetMarketDailyStatsPageDocument,
  GetMarketDebtRepaymentPageDocument,
  GetMarketInterestAccrualPageDocument,
  GetMaxTotalSupplyUpdatePageDocument,
  SubgraphAnnualInterestBipsUpdated_Filter,
  SubgraphBorrow_Filter,
  SubgraphDebtRepaid_Filter,
  SubgraphDelinquencyStatusChanged_Filter,
  SubgraphGetAnnualInterestBipsUpdatePageQuery,
  SubgraphGetAnnualInterestBipsUpdatePageQueryVariables,
  SubgraphGetDelinquencyStatusChangePageQuery,
  SubgraphGetDelinquencyStatusChangePageQueryVariables,
  SubgraphGetMarketAggregatePageQuery,
  SubgraphGetMarketAggregatePageQueryVariables,
  SubgraphGetMarketBorrowPageQuery,
  SubgraphGetMarketBorrowPageQueryVariables,
  SubgraphGetMarketDailyStatsPageQuery,
  SubgraphGetMarketDailyStatsPageQueryVariables,
  SubgraphGetMarketDebtRepaymentPageQuery,
  SubgraphGetMarketDebtRepaymentPageQueryVariables,
  SubgraphGetMarketInterestAccrualPageQuery,
  SubgraphGetMarketInterestAccrualPageQueryVariables,
  SubgraphGetMaxTotalSupplyUpdatePageQuery,
  SubgraphGetMaxTotalSupplyUpdatePageQueryVariables,
  SubgraphMarket_Filter,
  SubgraphMarketDailyStats_Filter,
  SubgraphMarketInterestAccrued_Filter,
  SubgraphMaxTotalSupplyUpdated_Filter
} from "../gql/graphql";
import {
  normalizeAnnualInterestBipsUpdate,
  normalizeDelinquencyStatusChange,
  normalizeIndexedMarketAggregate,
  normalizeIndexedQueryMetadata,
  normalizeMarketBorrow,
  normalizeMarketDailyStats,
  normalizeMarketDebtRepayment,
  normalizeMarketInterestAccrual,
  normalizeMaxTotalSupplyUpdate
} from "./normalizers";
import { normalizeIndexedPageRequest, toIndexedPage } from "./pagination";
import { IndexedReadOptions, MarketAnalyticsFilter, normalizeAddresses } from "./read-options";
import {
  AnnualInterestBipsUpdate,
  DelinquencyStatusChange,
  IndexedMarketAggregate,
  IndexedPage,
  IndexedMarketDailyStats,
  MarketBorrow,
  MarketDebtRepayment,
  MarketInterestAccrual,
  MaxTotalSupplyUpdate
} from "./types";

export type GetMarketAnalyticsPageOptions = IndexedReadOptions & MarketAnalyticsFilter;

const marketScope = (markets?: readonly string[], borrower?: string) => ({
  ...(markets ? { market_in: normalizeAddresses(markets) } : {}),
  ...(borrower ? { market_: { borrower: borrower.toLowerCase() } } : {})
});

const eventTimeRange = (fromTimestamp?: number, toTimestamp?: number) => ({
  ...(fromTimestamp !== undefined ? { blockTimestamp_gte: fromTimestamp } : {}),
  ...(toTimestamp !== undefined ? { blockTimestamp_lt: toTimestamp } : {})
});

export const getMarketDailyStatsPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<IndexedMarketDailyStats>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphMarketDailyStats_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...(fromTimestamp !== undefined ? { startTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { startTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetMarketDailyStatsPageQuery,
    SubgraphGetMarketDailyStatsPageQueryVariables
  >({
    query: GetMarketDailyStatsPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.marketDailyStats_collection.map(normalizeMarketDailyStats),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getDelinquencyStatusChangePage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<DelinquencyStatusChange>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphDelinquencyStatusChanged_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...(fromTimestamp !== undefined ? { blockTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { blockTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetDelinquencyStatusChangePageQuery,
    SubgraphGetDelinquencyStatusChangePageQueryVariables
  >({
    query: GetDelinquencyStatusChangePageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.delinquencyStatusChangeds.map(normalizeDelinquencyStatusChange),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getMarketInterestAccrualPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<MarketInterestAccrual>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphMarketInterestAccrued_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...(fromTimestamp !== undefined ? { fromTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { fromTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetMarketInterestAccrualPageQuery,
    SubgraphGetMarketInterestAccrualPageQueryVariables
  >({
    query: GetMarketInterestAccrualPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.marketInterestAccrueds.map(normalizeMarketInterestAccrual),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getAnnualInterestBipsUpdatePage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<AnnualInterestBipsUpdate>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphAnnualInterestBipsUpdated_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...(fromTimestamp !== undefined ? { blockTimestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { blockTimestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetAnnualInterestBipsUpdatePageQuery,
    SubgraphGetAnnualInterestBipsUpdatePageQueryVariables
  >({
    query: GetAnnualInterestBipsUpdatePageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.annualInterestBipsUpdateds.map(normalizeAnnualInterestBipsUpdate),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getMarketBorrowPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<MarketBorrow>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphBorrow_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...eventTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetMarketBorrowPageQuery,
    SubgraphGetMarketBorrowPageQueryVariables
  >({
    query: GetMarketBorrowPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.borrows.map(normalizeMarketBorrow),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getMarketDebtRepaymentPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<MarketDebtRepayment>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphDebtRepaid_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...eventTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetMarketDebtRepaymentPageQuery,
    SubgraphGetMarketDebtRepaymentPageQueryVariables
  >({
    query: GetMarketDebtRepaymentPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.debtRepaids.map(normalizeMarketDebtRepayment),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export const getMaxTotalSupplyUpdatePage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    markets,
    borrower,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetMarketAnalyticsPageOptions = {}
): Promise<IndexedPage<MaxTotalSupplyUpdate>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphMaxTotalSupplyUpdated_Filter = {
    id_gt: afterId,
    ...marketScope(markets, borrower),
    ...eventTimeRange(fromTimestamp, toTimestamp)
  };
  const { data } = await client.query<
    SubgraphGetMaxTotalSupplyUpdatePageQuery,
    SubgraphGetMaxTotalSupplyUpdatePageQueryVariables
  >({
    query: GetMaxTotalSupplyUpdatePageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.maxTotalSupplyUpdateds.map(normalizeMaxTotalSupplyUpdate),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetMarketAggregatePageOptions = IndexedReadOptions & {
  markets?: readonly string[];
  borrower?: string;
};

/** Cumulative native-token market totals at one pinned indexed block. */
export const getMarketAggregatePage = async (
  client: ApolloClient<NormalizedCacheObject>,
  { markets, borrower, fetchPolicy = "cache-first", ...request }: GetMarketAggregatePageOptions = {}
): Promise<IndexedPage<IndexedMarketAggregate>> => {
  await requireSubgraphFeature(client, "analytics");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphMarket_Filter = {
    id_gt: afterId,
    ...(markets ? { address_in: normalizeAddresses(markets) } : {}),
    ...(borrower ? { borrower: borrower.toLowerCase() } : {})
  };
  const { data } = await client.query<
    SubgraphGetMarketAggregatePageQuery,
    SubgraphGetMarketAggregatePageQueryVariables
  >({
    query: GetMarketAggregatePageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.markets.map(normalizeIndexedMarketAggregate),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};
