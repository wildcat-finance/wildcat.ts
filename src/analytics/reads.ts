import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAnalyticsTokenPricesDocument,
  GetBorrowerAnalyticsDailyPageDocument,
  GetBorrowerAnalyticsStatsDocument,
  GetBorrowerWithdrawalReliabilityPageDocument,
  GetLenderAnalyticsDailyPageDocument,
  GetLenderAnalyticsStatsDocument,
  GetMarketAnalyticsDailyPageDocument,
  GetMarketAnalyticsDocument,
  GetProtocolAnalyticsDailyPageDocument,
  GetProtocolAnalyticsStatsDocument,
  SubgraphBorrowerDailyStats_Filter,
  SubgraphGetAnalyticsTokenPricesQuery,
  SubgraphGetAnalyticsTokenPricesQueryVariables,
  SubgraphGetBorrowerAnalyticsDailyPageQuery,
  SubgraphGetBorrowerAnalyticsDailyPageQueryVariables,
  SubgraphGetBorrowerAnalyticsStatsQuery,
  SubgraphGetBorrowerAnalyticsStatsQueryVariables,
  SubgraphGetBorrowerWithdrawalReliabilityPageQuery,
  SubgraphGetBorrowerWithdrawalReliabilityPageQueryVariables,
  SubgraphGetLenderAnalyticsDailyPageQuery,
  SubgraphGetLenderAnalyticsDailyPageQueryVariables,
  SubgraphGetLenderAnalyticsStatsQuery,
  SubgraphGetLenderAnalyticsStatsQueryVariables,
  SubgraphGetMarketAnalyticsDailyPageQuery,
  SubgraphGetMarketAnalyticsDailyPageQueryVariables,
  SubgraphGetMarketAnalyticsQuery,
  SubgraphGetMarketAnalyticsQueryVariables,
  SubgraphGetProtocolAnalyticsDailyPageQuery,
  SubgraphGetProtocolAnalyticsDailyPageQueryVariables,
  SubgraphGetProtocolAnalyticsStatsQuery,
  SubgraphGetProtocolAnalyticsStatsQueryVariables,
  SubgraphLenderDailyStats_Filter,
  SubgraphMarketDailyStats_Filter,
  SubgraphProtocolDailyStats_Filter,
  SubgraphWithdrawalBatch_Filter
} from "../gql/graphql";
import { assert } from "../utils";
import {
  normalizeAnalyticsMetadata,
  normalizeAnalyticsPageRequest,
  toAnalyticsPage
} from "./pagination";
import {
  AnalyticsPage,
  AnalyticsPageRequest,
  AnalyticsSnapshot,
  AnalyticsTimeRange,
  AnalyticsTokenPriceSnapshot,
  BorrowerAnalyticsDailyStats,
  BorrowerAnalyticsStats,
  BorrowerWithdrawalReliability,
  LenderAnalyticsDailyStats,
  LenderAnalyticsStats,
  MarketAnalytics,
  MarketAnalyticsDailyStats,
  ProtocolAnalyticsDailyStats,
  ProtocolAnalyticsStats
} from "./types";

export type AnalyticsReadOptions = {
  block?: SubgraphGetProtocolAnalyticsStatsQueryVariables["block"];
  fetchPolicy?: FetchPolicy;
};

export type AnalyticsPageReadOptions = AnalyticsPageRequest & {
  fetchPolicy?: FetchPolicy;
};

export type AnalyticsPageOptions = AnalyticsPageReadOptions & AnalyticsTimeRange;

const MAX_CONCURRENT_PRICE_FALLBACKS = 20;

const rangeFilter = ({
  fromTimestamp,
  toTimestamp
}: AnalyticsTimeRange): { startTimestamp_gte?: number; startTimestamp_lt?: number } => ({
  ...(fromTimestamp !== undefined ? { startTimestamp_gte: fromTimestamp } : {}),
  ...(toTimestamp !== undefined ? { startTimestamp_lt: toTimestamp } : {})
});

const validateTimeRange = ({ fromTimestamp, toTimestamp }: AnalyticsTimeRange): void => {
  if (fromTimestamp !== undefined) {
    assert(Number.isSafeInteger(fromTimestamp) && fromTimestamp >= 0, "Invalid start timestamp");
  }
  if (toTimestamp !== undefined) {
    assert(Number.isSafeInteger(toTimestamp) && toTimestamp >= 0, "Invalid end timestamp");
  }
  if (fromTimestamp !== undefined && toTimestamp !== undefined) {
    assert(fromTimestamp < toTimestamp, "Invalid analytics time range");
  }
};

export const getProtocolAnalyticsStats = async (
  client: ApolloClient<NormalizedCacheObject>,
  { block, fetchPolicy = "cache-first" }: AnalyticsReadOptions = {}
): Promise<AnalyticsSnapshot<ProtocolAnalyticsStats>> => {
  const { data } = await client.query<
    SubgraphGetProtocolAnalyticsStatsQuery,
    SubgraphGetProtocolAnalyticsStatsQueryVariables
  >({ query: GetProtocolAnalyticsStatsDocument, variables: { block }, fetchPolicy });
  return {
    indexedAt: normalizeAnalyticsMetadata(data._meta),
    ...(data.protocolStats ? { value: data.protocolStats } : {})
  };
};

export const getProtocolAnalyticsDailyPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  { fromTimestamp, toTimestamp, fetchPolicy = "cache-first", ...request }: AnalyticsPageOptions = {}
): Promise<AnalyticsPage<ProtocolAnalyticsDailyStats>> => {
  validateTimeRange({ fromTimestamp, toTimestamp });
  const { first, afterId, block } = normalizeAnalyticsPageRequest(request);
  const filter: SubgraphProtocolDailyStats_Filter = {
    id_gt: afterId,
    ...rangeFilter({ fromTimestamp, toTimestamp })
  };
  const { data } = await client.query<
    SubgraphGetProtocolAnalyticsDailyPageQuery,
    SubgraphGetProtocolAnalyticsDailyPageQueryVariables
  >({
    query: GetProtocolAnalyticsDailyPageDocument,
    variables: { first, filter, block },
    fetchPolicy
  });
  return toAnalyticsPage(data.protocolDailyStats_collection, first, data._meta);
};

export const getBorrowerAnalyticsStats = async (
  client: ApolloClient<NormalizedCacheObject>,
  borrower: string,
  { block, fetchPolicy = "cache-first" }: AnalyticsReadOptions = {}
): Promise<AnalyticsSnapshot<BorrowerAnalyticsStats>> => {
  const { data } = await client.query<
    SubgraphGetBorrowerAnalyticsStatsQuery,
    SubgraphGetBorrowerAnalyticsStatsQueryVariables
  >({
    query: GetBorrowerAnalyticsStatsDocument,
    variables: { borrower: borrower.toLowerCase(), block },
    fetchPolicy
  });
  const value = data.borrowerStats_collection[0];
  return {
    indexedAt: normalizeAnalyticsMetadata(data._meta),
    ...(value ? { value } : {})
  };
};

export const getBorrowerAnalyticsDailyPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  borrower: string,
  { fromTimestamp, toTimestamp, fetchPolicy = "cache-first", ...request }: AnalyticsPageOptions = {}
): Promise<AnalyticsPage<BorrowerAnalyticsDailyStats>> => {
  validateTimeRange({ fromTimestamp, toTimestamp });
  const { first, afterId, block } = normalizeAnalyticsPageRequest(request);
  const filter: SubgraphBorrowerDailyStats_Filter = {
    borrower: borrower.toLowerCase(),
    id_gt: afterId,
    ...rangeFilter({ fromTimestamp, toTimestamp })
  };
  const { data } = await client.query<
    SubgraphGetBorrowerAnalyticsDailyPageQuery,
    SubgraphGetBorrowerAnalyticsDailyPageQueryVariables
  >({
    query: GetBorrowerAnalyticsDailyPageDocument,
    variables: { first, filter, block },
    fetchPolicy
  });
  return toAnalyticsPage(data.borrowerDailyStats_collection, first, data._meta);
};

export const getLenderAnalyticsStats = async (
  client: ApolloClient<NormalizedCacheObject>,
  lender: string,
  { block, fetchPolicy = "cache-first" }: AnalyticsReadOptions = {}
): Promise<AnalyticsSnapshot<LenderAnalyticsStats>> => {
  const { data } = await client.query<
    SubgraphGetLenderAnalyticsStatsQuery,
    SubgraphGetLenderAnalyticsStatsQueryVariables
  >({
    query: GetLenderAnalyticsStatsDocument,
    variables: { lender: lender.toLowerCase(), block },
    fetchPolicy
  });
  const value = data.lenderStats_collection[0];
  return {
    indexedAt: normalizeAnalyticsMetadata(data._meta),
    ...(value ? { value } : {})
  };
};

export const getLenderAnalyticsDailyPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  lender: string,
  { fromTimestamp, toTimestamp, fetchPolicy = "cache-first", ...request }: AnalyticsPageOptions = {}
): Promise<AnalyticsPage<LenderAnalyticsDailyStats>> => {
  validateTimeRange({ fromTimestamp, toTimestamp });
  const { first, afterId, block } = normalizeAnalyticsPageRequest(request);
  const filter: SubgraphLenderDailyStats_Filter = {
    lender: lender.toLowerCase(),
    id_gt: afterId,
    ...rangeFilter({ fromTimestamp, toTimestamp })
  };
  const { data } = await client.query<
    SubgraphGetLenderAnalyticsDailyPageQuery,
    SubgraphGetLenderAnalyticsDailyPageQueryVariables
  >({
    query: GetLenderAnalyticsDailyPageDocument,
    variables: { first, filter, block },
    fetchPolicy
  });
  return toAnalyticsPage(data.lenderDailyStats_collection, first, data._meta);
};

export const getAnalyticsTokenPrices = async (
  client: ApolloClient<NormalizedCacheObject>,
  tokenAddresses: readonly string[],
  { block, fetchPolicy = "cache-first" }: AnalyticsReadOptions = {}
): Promise<AnalyticsTokenPriceSnapshot> => {
  const tokens = Array.from(new Set(tokenAddresses.map((address) => address.toLowerCase())));
  assert(tokens.length <= 1_000, "Too many token addresses");
  const { data } = await client.query<
    SubgraphGetAnalyticsTokenPricesQuery,
    SubgraphGetAnalyticsTokenPricesQueryVariables
  >({
    query: GetAnalyticsTokenPricesDocument,
    variables: { tokens, first: 1000, block },
    fetchPolicy
  });
  const indexedAt = normalizeAnalyticsMetadata(data._meta);
  const observations = [...data.tokenDailyPrices];
  const representedTokens = new Set(
    observations.map((observation) => observation.token.address.toLowerCase())
  );
  const missingNonStableTokens = data.tokens.filter(
    (token) =>
      !token.isUsdStablecoin &&
      (token.priceFeed0 !== null || token.priceFeed1 !== null) &&
      !representedTokens.has(token.address.toLowerCase())
  );

  // The bulk query is globally capped at 1,000 observations. If a requested
  // token's latest price falls outside that window, fetch its latest value at
  // the same indexed block rather than silently reporting it as unavailable.
  for (
    let offset = 0;
    offset < missingNonStableTokens.length;
    offset += MAX_CONCURRENT_PRICE_FALLBACKS
  ) {
    const fallbackResults = await Promise.all(
      missingNonStableTokens.slice(offset, offset + MAX_CONCURRENT_PRICE_FALLBACKS).map((token) =>
        client.query<
          SubgraphGetAnalyticsTokenPricesQuery,
          SubgraphGetAnalyticsTokenPricesQueryVariables
        >({
          query: GetAnalyticsTokenPricesDocument,
          variables: {
            tokens: [token.address.toLowerCase()],
            first: 1,
            block: { number: indexedAt.blockNumber }
          },
          fetchPolicy
        })
      )
    );
    for (const result of fallbackResults) {
      observations.push(...result.data.tokenDailyPrices);
    }
  }

  const latestPriceByToken: Record<string, string> = {};
  for (const token of data.tokens) {
    if (token.isUsdStablecoin) latestPriceByToken[token.address.toLowerCase()] = "1";
  }
  for (const observation of observations) {
    const address = observation.token.address.toLowerCase();
    if (latestPriceByToken[address] === undefined) {
      latestPriceByToken[address] = observation.priceUSD;
    }
  }
  return {
    indexedAt,
    tokens: data.tokens,
    observations,
    latestPriceByToken
  };
};

export const getMarketAnalytics = async (
  client: ApolloClient<NormalizedCacheObject>,
  market: string,
  { block, fetchPolicy = "cache-first" }: AnalyticsReadOptions = {}
): Promise<AnalyticsSnapshot<MarketAnalytics>> => {
  const { data } = await client.query<
    SubgraphGetMarketAnalyticsQuery,
    SubgraphGetMarketAnalyticsQueryVariables
  >({
    query: GetMarketAnalyticsDocument,
    variables: { market: market.toLowerCase(), block },
    fetchPolicy
  });
  return {
    indexedAt: normalizeAnalyticsMetadata(data._meta),
    ...(data.market ? { value: data.market } : {})
  };
};

export const getMarketAnalyticsDailyPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  market: string,
  { fromTimestamp, toTimestamp, fetchPolicy = "cache-first", ...request }: AnalyticsPageOptions = {}
): Promise<AnalyticsPage<MarketAnalyticsDailyStats>> => {
  validateTimeRange({ fromTimestamp, toTimestamp });
  const { first, afterId, block } = normalizeAnalyticsPageRequest(request);
  const filter: SubgraphMarketDailyStats_Filter = {
    market: market.toLowerCase(),
    id_gt: afterId,
    ...rangeFilter({ fromTimestamp, toTimestamp })
  };
  const { data } = await client.query<
    SubgraphGetMarketAnalyticsDailyPageQuery,
    SubgraphGetMarketAnalyticsDailyPageQueryVariables
  >({
    query: GetMarketAnalyticsDailyPageDocument,
    variables: { first, filter, block },
    fetchPolicy
  });
  return toAnalyticsPage(data.marketDailyStats_collection, first, data._meta);
};

export const getBorrowerWithdrawalReliabilityPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  borrower: string,
  { fetchPolicy = "cache-first", ...request }: AnalyticsPageReadOptions = {}
): Promise<AnalyticsPage<BorrowerWithdrawalReliability>> => {
  const { first, afterId, block } = normalizeAnalyticsPageRequest(request);
  const filter: SubgraphWithdrawalBatch_Filter = {
    market_: { borrower: borrower.toLowerCase() },
    id_gt: afterId
  };
  const { data } = await client.query<
    SubgraphGetBorrowerWithdrawalReliabilityPageQuery,
    SubgraphGetBorrowerWithdrawalReliabilityPageQueryVariables
  >({
    query: GetBorrowerWithdrawalReliabilityPageDocument,
    variables: { first, filter, block },
    fetchPolicy
  });
  return toAnalyticsPage(data.withdrawalBatches, first, data._meta);
};
