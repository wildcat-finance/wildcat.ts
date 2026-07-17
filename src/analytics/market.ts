import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { requireSubgraphFeature } from "../config";
import {
  GetAnnualInterestBipsUpdatePageDocument,
  GetDelinquencyStatusChangePageDocument,
  GetMarketDailyStatsPageDocument,
  GetMarketInterestAccrualPageDocument,
  SubgraphAnnualInterestBipsUpdated_Filter,
  SubgraphDelinquencyStatusChanged_Filter,
  SubgraphGetAnnualInterestBipsUpdatePageQuery,
  SubgraphGetAnnualInterestBipsUpdatePageQueryVariables,
  SubgraphGetDelinquencyStatusChangePageQuery,
  SubgraphGetDelinquencyStatusChangePageQueryVariables,
  SubgraphGetMarketDailyStatsPageQuery,
  SubgraphGetMarketDailyStatsPageQueryVariables,
  SubgraphGetMarketInterestAccrualPageQuery,
  SubgraphGetMarketInterestAccrualPageQueryVariables,
  SubgraphMarketDailyStats_Filter,
  SubgraphMarketInterestAccrued_Filter
} from "../gql/graphql";
import {
  normalizeAnnualInterestBipsUpdate,
  normalizeDelinquencyStatusChange,
  normalizeIndexedQueryMetadata,
  normalizeMarketDailyStats,
  normalizeMarketInterestAccrual
} from "./normalizers";
import { normalizeIndexedPageRequest, toIndexedPage } from "./pagination";
import { IndexedReadOptions, MarketAnalyticsFilter, normalizeAddresses } from "./read-options";
import {
  AnnualInterestBipsUpdate,
  DelinquencyStatusChange,
  IndexedPage,
  IndexedMarketDailyStats,
  MarketInterestAccrual
} from "./types";

export type GetMarketAnalyticsPageOptions = IndexedReadOptions & MarketAnalyticsFilter;

const marketScope = (markets?: readonly string[], borrower?: string) => ({
  ...(markets ? { market_in: normalizeAddresses(markets) } : {}),
  ...(borrower ? { market_: { borrower: borrower.toLowerCase() } } : {})
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
