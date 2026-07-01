import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetMarketChartsDataDocument,
  SubgraphGetMarketChartsDataQuery,
  SubgraphGetMarketChartsDataQueryVariables,
  SubgraphMarketDailyStats_OrderBy,
  SubgraphOrderDirection,
  SubgraphWithdrawalBatch_OrderBy
} from "./graphql";
import { SupportedChainId } from "../constants";
import { Market } from "../market";
import { assert } from "../utils";

export type GetMarketChartsDataOptions = {
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  market: Market;

  numWithdrawalBatches?: number;
  skipWithdrawalBatches?: number;
  orderWithdrawalBatches?: SubgraphWithdrawalBatch_OrderBy;
  directionWithdrawalBatches?: SubgraphOrderDirection;
  numDailyStats?: number;
  skipDailyStats?: number;
  orderDailyStats?: SubgraphMarketDailyStats_OrderBy;
  directionDailyStats?: SubgraphOrderDirection;
};

export type MarketDailyStats = {
  timestamp: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBorrowed: number;
  totalRepaid: number;
};

export type MarketWithdrawalBatchExpirationStats = {
  timestamp: number;
  normalizedAmountPaid: number;
  normalizedAmountOwed: number;
};

export type MarketChartsData = {
  withdrawalBatches: MarketWithdrawalBatchExpirationStats[];
  dailyStats: MarketDailyStats[];
};

export async function getMarketChartsData(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    fetchPolicy,
    market,
    numWithdrawalBatches,
    skipWithdrawalBatches,
    orderWithdrawalBatches,
    directionWithdrawalBatches,
    numDailyStats,
    skipDailyStats,
    orderDailyStats,
    directionDailyStats
  }: GetMarketChartsDataOptions
): Promise<MarketChartsData> {
  const result = await subgraphClient.query<
    SubgraphGetMarketChartsDataQuery,
    SubgraphGetMarketChartsDataQueryVariables
  >({
    query: GetMarketChartsDataDocument,
    fetchPolicy,
    variables: {
      market: market.address.toLowerCase(),
      numWithdrawalBatches,
      skipWithdrawalBatches,
      orderWithdrawalBatches,
      directionWithdrawalBatches,
      numDailyStats,
      skipDailyStats,
      orderDailyStats,
      directionDailyStats
    }
  });

  const marketData = result.data.market;
  assert(!!marketData, "Market data not found in subgraph query");

  const token = market.underlyingToken;

  const withdrawalBatches = marketData.withdrawalBatches
    .map((batch) => {
      const { expiry, expiration } = batch;
      if (!expiration) {
        throw new Error("Expiration not found");
      }
      return {
        timestamp: +expiry,
        normalizedAmountPaid: +token.getAmount(expiration.normalizedAmountPaid).format(),
        normalizedAmountOwed: +token.getAmount(expiration.normalizedAmountOwed).format()
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
  const dailyStats = marketData.dailyStats
    .map((stat) => {
      const { timestamp, totalDeposited, totalWithdrawalsRequested, totalBorrowed, totalRepaid } =
        stat;
      return {
        timestamp: +timestamp,
        totalDeposited: +token.getAmount(totalDeposited).format(),
        totalWithdrawn: +token.getAmount(totalWithdrawalsRequested).format(),
        totalBorrowed: +token.getAmount(totalBorrowed).format(),
        totalRepaid: +token.getAmount(totalRepaid).format()
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  return {
    withdrawalBatches,
    dailyStats
  };
}
