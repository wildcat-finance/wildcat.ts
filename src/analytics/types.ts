import {
  SubgraphAnalyticsBorrowerDailyStatsDataFragment,
  SubgraphAnalyticsBorrowerStatsDataFragment,
  SubgraphAnalyticsLenderDailyStatsDataFragment,
  SubgraphAnalyticsLenderStatsDataFragment,
  SubgraphAnalyticsMarketDailyStatsDataFragment,
  SubgraphAnalyticsMarketDataFragment,
  SubgraphAnalyticsProtocolDailyStatsDataFragment,
  SubgraphAnalyticsProtocolStatsDataFragment,
  SubgraphAnalyticsQueryMetadataFragment,
  SubgraphAnalyticsTokenDailyPriceDataFragment,
  SubgraphAnalyticsTokenDataFragment,
  SubgraphAnalyticsWithdrawalBatchDataFragment,
  SubgraphBlock_Height
} from "../gql/graphql";

export type AnalyticsQueryMetadata = {
  deployment: string;
  hasIndexingErrors: boolean;
  blockNumber: number;
  blockTimestamp?: number;
  blockHash?: string;
};

export type AnalyticsSnapshot<T> = {
  indexedAt: AnalyticsQueryMetadata;
  value?: T;
};

export type AnalyticsPageCursor = {
  entityId: string;
  blockNumber: number;
};

export type AnalyticsPageRequest = {
  first?: number;
  after?: AnalyticsPageCursor;
  block?: SubgraphBlock_Height;
};

export type AnalyticsPage<T> = {
  items: T[];
  indexedAt: AnalyticsQueryMetadata;
  pageInfo: {
    hasNextPage: boolean;
    nextCursor?: AnalyticsPageCursor;
  };
};

export type AnalyticsTimeRange = {
  /** Inclusive Unix timestamp. */
  fromTimestamp?: number;
  /** Exclusive Unix timestamp. */
  toTimestamp?: number;
};

export type ProtocolAnalyticsStats = SubgraphAnalyticsProtocolStatsDataFragment;
export type ProtocolAnalyticsDailyStats = SubgraphAnalyticsProtocolDailyStatsDataFragment;
export type BorrowerAnalyticsStats = SubgraphAnalyticsBorrowerStatsDataFragment;
export type BorrowerAnalyticsDailyStats = SubgraphAnalyticsBorrowerDailyStatsDataFragment;
export type LenderAnalyticsStats = SubgraphAnalyticsLenderStatsDataFragment;
export type LenderAnalyticsDailyStats = SubgraphAnalyticsLenderDailyStatsDataFragment;
export type MarketAnalytics = SubgraphAnalyticsMarketDataFragment;
export type MarketAnalyticsDailyStats = SubgraphAnalyticsMarketDailyStatsDataFragment;
export type AnalyticsToken = SubgraphAnalyticsTokenDataFragment;
export type AnalyticsTokenDailyPrice = SubgraphAnalyticsTokenDailyPriceDataFragment;
export type BorrowerWithdrawalReliability = SubgraphAnalyticsWithdrawalBatchDataFragment;

export type AnalyticsTokenPriceSnapshot = {
  indexedAt: AnalyticsQueryMetadata;
  tokens: AnalyticsToken[];
  /** Observations used to derive `latestPriceByToken`; this is not a full price history. */
  observations: AnalyticsTokenDailyPrice[];
  /** Latest available USD value by lower-cased token address. */
  latestPriceByToken: Record<string, string>;
};

export type RawAnalyticsQueryMetadata = SubgraphAnalyticsQueryMetadataFragment;
