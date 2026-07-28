import { HooksKind, IndexedAt, parseHooksKind, parseProtocolMarketVersion } from "../domain";
import {
  SubgraphAnalyticsMarketReferenceDataFragment,
  SubgraphAnalyticsMarketAggregateDataFragment,
  SubgraphAnalyticsMarketBorrowDataFragment,
  SubgraphAnalyticsMarketDebtRepaymentDataFragment,
  SubgraphAnalyticsMaxTotalSupplyUpdateDataFragment,
  SubgraphAnalyticsTokenDataFragment,
  SubgraphAnnualInterestBipsUpdateDataFragment,
  SubgraphBorrowerAnalyticsIdentityDataFragment,
  SubgraphBorrowerAnalyticsStatsDataFragment,
  SubgraphBorrowerDailyStatsDataFragment,
  SubgraphBorrowerWithdrawalReliabilityDataFragment,
  SubgraphDelinquencyStatusChangeDataFragment,
  SubgraphLenderAnalyticsStatsDataFragment,
  SubgraphLenderDailyStatsDataFragment,
  SubgraphLenderDepositDataFragment,
  SubgraphLenderPositionDataFragment,
  SubgraphLenderTransferDataFragment,
  SubgraphLenderWithdrawalExecutionDataFragment,
  SubgraphLenderWithdrawalRequestDataFragment,
  SubgraphLenderWithdrawalStatusDataFragment,
  SubgraphMarketDailyStatsDataFragment,
  SubgraphMarketInterestAccrualDataFragment,
  SubgraphProtocolAnalyticsStatsDataFragment,
  SubgraphProtocolDailyStatsDataFragment,
  SubgraphTokenPriceObservationDataFragment,
  SubgraphIndexedQueryMetadataDataFragment
} from "../gql/graphql";
import {
  normalizeSubgraphLenderAccountSnapshot,
  normalizeSubgraphMarketSnapshot
} from "../gql/normalizers";
import { assert } from "../utils";
import {
  AnnualInterestBipsUpdate,
  BorrowerAggregateStats,
  BorrowerDailyStats,
  BorrowerIdentity,
  BorrowerWithdrawalReliability,
  DelinquencyStatusChange,
  IndexedAnalyticsMarket,
  IndexedAnalyticsToken,
  IndexedMarketAggregate,
  IndexedQueryMetadata,
  LenderAggregateStats,
  LenderDailyStats,
  LenderDeposit,
  LenderPosition,
  LenderTransfer,
  LenderWithdrawalExecution,
  LenderWithdrawalRequest,
  IndexedLenderWithdrawalStatus,
  IndexedMarketDailyStats,
  MarketBorrow,
  MarketDebtRepayment,
  MarketInterestAccrual,
  MaxTotalSupplyUpdate,
  PriceSource,
  ProtocolAggregateStats,
  ProtocolDailyStats,
  TokenPriceObservation,
  UsdValue
} from "./types";

const usd = (value: string): UsdValue => value;

export const normalizeIndexedQueryMetadata = (
  data: SubgraphIndexedQueryMetadataDataFragment | null | undefined
): IndexedQueryMetadata => {
  assert(data !== null && data !== undefined, "Subgraph query metadata is missing");
  return {
    deployment: data.deployment,
    blockNumber: BigInt(data.block.number),
    ...(data.block.timestamp !== null && data.block.timestamp !== undefined
      ? { blockTimestamp: BigInt(data.block.timestamp) }
      : {}),
    ...(data.block.hash ? { blockHash: data.block.hash } : {}),
    hasIndexingErrors: data.hasIndexingErrors
  };
};

export const parsePriceSource = (value: string | null | undefined): PriceSource => {
  switch (value?.replaceAll(/[_-]/g, "").toLowerCase()) {
    case "usdpeg":
      return "usd-peg";
    case "chainlinkdirect":
      return "chainlink-direct";
    case "chainlinktwohop":
      return "chainlink-two-hop";
    case "synthetictestnet":
      return "synthetic-testnet";
    default:
      return "unknown";
  }
};

const indexedAt = (
  blockNumber: string | number,
  blockTimestamp: string | number,
  transactionHash: string,
  logIndex: string | number
): IndexedAt => ({
  blockNumber: BigInt(blockNumber),
  blockTimestamp: BigInt(blockTimestamp),
  transactionHash,
  logIndex: BigInt(logIndex)
});

export const normalizeAnalyticsToken = (
  data: SubgraphAnalyticsTokenDataFragment
): IndexedAnalyticsToken => ({
  id: data.id,
  address: data.address,
  name: data.name,
  symbol: data.symbol,
  decimals: data.decimals,
  isMock: data.isMock,
  isUsdStablecoin: data.isUsdStablecoin,
  priceSource: parsePriceSource(data.priceSource),
  ...(data.priceFeed0 ? { priceFeed0: data.priceFeed0 } : {}),
  ...(data.priceFeed1 ? { priceFeed1: data.priceFeed1 } : {})
});

export const normalizeAnalyticsMarket = (
  data: SubgraphAnalyticsMarketReferenceDataFragment
): IndexedAnalyticsMarket => {
  const kind =
    parseProtocolMarketVersion(data.version) === "v1"
      ? HooksKind.OpenTerm
      : parseHooksKind(data.hooks?.kind);
  return {
    address: data.address,
    name: data.name,
    borrower: data.borrower,
    createdAtTimestamp: BigInt(data.createdAtTimestamp),
    isClosed: data.isClosed,
    annualInterestBips: data.annualInterestBips,
    originalAnnualInterestBips: data.originalAnnualInterestBips,
    delinquencyGracePeriod: data.delinquencyGracePeriod,
    maxTotalSupply: BigInt(data.maxTotalSupply),
    scaledTotalSupply: BigInt(data.scaledTotalSupply),
    scaleFactor: BigInt(data.scaleFactor),
    isDelinquent: data.isDelinquent,
    isIncurringPenalties: data.isIncurringPenalties,
    totalDebtUSD: usd(data.totalDebtUSD),
    term: {
      kind,
      ...(kind === HooksKind.FixedTerm && data.hooksConfig
        ? { fixedTermEndTime: data.hooksConfig.fixedTermEndTime }
        : {}),
      ...(kind === HooksKind.PeriodicTerm && data.hooksConfig
        ? {
            firstWithdrawalWindowStart: data.hooksConfig.firstWithdrawalWindowStart,
            periodDuration: data.hooksConfig.periodDuration,
            withdrawalWindowDuration: data.hooksConfig.withdrawalWindowDuration,
            periodicTermClosed: data.hooksConfig.periodicTermClosed
          }
        : {})
    },
    ...(data.snapshot ? { snapshot: normalizeSubgraphMarketSnapshot(data.snapshot) } : {}),
    asset: normalizeAnalyticsToken(data.asset)
  };
};

export const normalizeBorrowerIdentity = (
  data: SubgraphBorrowerAnalyticsIdentityDataFragment
): BorrowerIdentity => ({
  address: data.address,
  firstSeen: indexedAt(
    data.firstSeenBlock,
    data.firstSeenTimestamp,
    data.firstSeenTransaction,
    data.firstSeenLogIndex
  ),
  lastSeen: indexedAt(
    data.lastSeenBlock,
    data.lastSeenTimestamp,
    data.lastSeenTransaction,
    data.lastSeenLogIndex
  ),
  registrations: data.registrations.map(({ archController, isRegistered }) => ({
    archController: archController.id,
    isRegistered
  }))
});

const cumulativeProtocolUsdStats = (
  data: SubgraphBorrowerAnalyticsStatsDataFragment | SubgraphProtocolAnalyticsStatsDataFragment
) => ({
  totalDepositedUSD: usd(data.totalDepositedUSD),
  totalBorrowedUSD: usd(data.totalBorrowedUSD),
  totalRepaidUSD: usd(data.totalRepaidUSD),
  totalWithdrawalsRequestedUSD: usd(data.totalWithdrawalsRequestedUSD),
  totalWithdrawalsExecutedUSD: usd(data.totalWithdrawalsExecutedUSD),
  totalBaseInterestAccruedUSD: usd(data.totalBaseInterestAccruedUSD),
  totalDelinquencyFeesAccruedUSD: usd(data.totalDelinquencyFeesAccruedUSD),
  totalProtocolFeesAccruedUSD: usd(data.totalProtocolFeesAccruedUSD)
});

const protocolMarketCounts = (
  data:
    | SubgraphBorrowerAnalyticsStatsDataFragment
    | SubgraphBorrowerDailyStatsDataFragment
    | SubgraphProtocolAnalyticsStatsDataFragment
    | SubgraphProtocolDailyStatsDataFragment
) => ({
  numMarkets: data.numMarkets,
  numActiveMarkets: data.numActiveMarkets,
  numDelinquentMarkets: data.numDelinquentMarkets,
  numClosedMarkets: data.numClosedMarkets
});

export const normalizeBorrowerAggregateStats = (
  data: SubgraphBorrowerAnalyticsStatsDataFragment
): BorrowerAggregateStats => ({
  borrower: data.borrower,
  ...cumulativeProtocolUsdStats(data),
  ...protocolMarketCounts(data),
  numBatchesExpired: data.numBatchesExpired,
  numBatchesExpiredUnpaid: data.numBatchesExpiredUnpaid,
  numBatchesPaidLate: data.numBatchesPaidLate
});

export const normalizeBorrowerDailyStats = (
  data: SubgraphBorrowerDailyStatsDataFragment
): BorrowerDailyStats => ({
  id: data.id,
  borrower: data.borrower,
  startTimestamp: data.startTimestamp,
  endTimestamp: data.endTimestamp,
  dayDepositedUSD: usd(data.dayDepositedUSD),
  dayBorrowedUSD: usd(data.dayBorrowedUSD),
  dayRepaidUSD: usd(data.dayRepaidUSD),
  dayWithdrawalsRequestedUSD: usd(data.dayWithdrawalsRequestedUSD),
  dayWithdrawalsExecutedUSD: usd(data.dayWithdrawalsExecutedUSD),
  dayBaseInterestAccruedUSD: usd(data.dayBaseInterestAccruedUSD),
  dayDelinquencyFeesAccruedUSD: usd(data.dayDelinquencyFeesAccruedUSD),
  dayProtocolFeesAccruedUSD: usd(data.dayProtocolFeesAccruedUSD),
  totalDepositedUSD: usd(data.totalDepositedUSD),
  totalBorrowedUSD: usd(data.totalBorrowedUSD),
  totalRepaidUSD: usd(data.totalRepaidUSD),
  totalWithdrawalsRequestedUSD: usd(data.totalWithdrawalsRequestedUSD),
  totalWithdrawalsExecutedUSD: usd(data.totalWithdrawalsExecutedUSD),
  totalBaseInterestAccruedUSD: usd(data.totalBaseInterestAccruedUSD),
  totalDelinquencyFeesAccruedUSD: usd(data.totalDelinquencyFeesAccruedUSD),
  totalProtocolFeesAccruedUSD: usd(data.totalProtocolFeesAccruedUSD),
  ...protocolMarketCounts(data)
});

export const normalizeLenderAggregateStats = (
  data: SubgraphLenderAnalyticsStatsDataFragment
): LenderAggregateStats => ({
  lender: data.lender,
  firstSeenTimestamp: data.firstSeenTimestamp,
  totalDepositedUSD: usd(data.totalDepositedUSD),
  totalWithdrawalsRequestedUSD: usd(data.totalWithdrawalsRequestedUSD),
  totalWithdrawalsExecutedUSD: usd(data.totalWithdrawalsExecutedUSD),
  totalInterestEarnedUSD: usd(data.totalInterestEarnedUSD),
  numMarkets: data.numMarkets,
  numActiveMarkets: data.numActiveMarkets
});

export const normalizeLenderDailyStats = (
  data: SubgraphLenderDailyStatsDataFragment
): LenderDailyStats => ({
  id: data.id,
  lender: data.lender,
  startTimestamp: data.startTimestamp,
  endTimestamp: data.endTimestamp,
  dayDepositedUSD: usd(data.dayDepositedUSD),
  dayWithdrawalsRequestedUSD: usd(data.dayWithdrawalsRequestedUSD),
  dayWithdrawalsExecutedUSD: usd(data.dayWithdrawalsExecutedUSD),
  dayInterestEarnedUSD: usd(data.dayInterestEarnedUSD),
  totalDepositedUSD: usd(data.totalDepositedUSD),
  totalWithdrawalsRequestedUSD: usd(data.totalWithdrawalsRequestedUSD),
  totalWithdrawalsExecutedUSD: usd(data.totalWithdrawalsExecutedUSD),
  totalInterestEarnedUSD: usd(data.totalInterestEarnedUSD),
  numMarkets: data.numMarkets,
  numActiveMarkets: data.numActiveMarkets
});

export const normalizeMarketDailyStats = (
  data: SubgraphMarketDailyStatsDataFragment
): IndexedMarketDailyStats => ({
  id: data.id,
  startTimestamp: data.startTimestamp,
  endTimestamp: data.endTimestamp,
  market: normalizeAnalyticsMarket(data.market),
  dayDeposited: BigInt(data.dayDeposited),
  dayWithdrawalsRequested: BigInt(data.dayWithdrawalsRequested),
  dayWithdrawalsExecuted: BigInt(data.dayWithdrawalsExecuted),
  dayBorrowed: BigInt(data.dayBorrowed),
  dayRepaid: BigInt(data.dayRepaid),
  dayBaseInterestAccrued: BigInt(data.dayBaseInterestAccrued),
  dayDelinquencyFeesAccrued: BigInt(data.dayDelinquencyFeesAccrued),
  dayProtocolFeesAccrued: BigInt(data.dayProtocolFeesAccrued),
  totalBorrowed: BigInt(data.totalBorrowed),
  totalRepaid: BigInt(data.totalRepaid),
  totalBaseInterestAccrued: BigInt(data.totalBaseInterestAccrued),
  totalDelinquencyFeesAccrued: BigInt(data.totalDelinquencyFeesAccrued),
  totalProtocolFeesAccrued: BigInt(data.totalProtocolFeesAccrued),
  totalDeposited: BigInt(data.totalDeposited),
  totalWithdrawalsRequested: BigInt(data.totalWithdrawalsRequested),
  totalWithdrawalsExecuted: BigInt(data.totalWithdrawalsExecuted),
  totalBorrowedUSD: usd(data.totalBorrowedUSD),
  totalRepaidUSD: usd(data.totalRepaidUSD),
  totalBaseInterestAccruedUSD: usd(data.totalBaseInterestAccruedUSD),
  totalDelinquencyFeesAccruedUSD: usd(data.totalDelinquencyFeesAccruedUSD),
  totalProtocolFeesAccruedUSD: usd(data.totalProtocolFeesAccruedUSD),
  totalDepositedUSD: usd(data.totalDepositedUSD),
  totalWithdrawalsRequestedUSD: usd(data.totalWithdrawalsRequestedUSD),
  totalWithdrawalsExecutedUSD: usd(data.totalWithdrawalsExecutedUSD),
  scaledTotalSupply: BigInt(data.scaledTotalSupply),
  scaleFactor: BigInt(data.scaleFactor),
  ...(data.usdPrice !== null && data.usdPrice !== undefined ? { usdPrice: usd(data.usdPrice) } : {})
});

const analyticsEventBase = (
  data:
    | SubgraphDelinquencyStatusChangeDataFragment
    | SubgraphMarketInterestAccrualDataFragment
    | SubgraphAnnualInterestBipsUpdateDataFragment
    | SubgraphAnalyticsMarketBorrowDataFragment
    | SubgraphAnalyticsMarketDebtRepaymentDataFragment
    | SubgraphAnalyticsMaxTotalSupplyUpdateDataFragment
) => ({
  id: data.id,
  market: normalizeAnalyticsMarket(data.market),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const normalizeDelinquencyStatusChange = (
  data: SubgraphDelinquencyStatusChangeDataFragment
): DelinquencyStatusChange => ({
  ...analyticsEventBase(data),
  isDelinquent: data.isDelinquent,
  liquidityCoverageRequired: BigInt(data.liquidityCoverageRequired),
  totalAssets: BigInt(data.totalAssets)
});

export const normalizeMarketInterestAccrual = (
  data: SubgraphMarketInterestAccrualDataFragment
): MarketInterestAccrual => ({
  ...analyticsEventBase(data),
  fromTimestamp: data.fromTimestamp,
  toTimestamp: data.toTimestamp,
  timeWithPenalties: data.timeWithPenalties,
  baseInterestRay: BigInt(data.baseInterestRay),
  delinquencyFeeRay: BigInt(data.delinquencyFeeRay),
  baseInterestAccrued: BigInt(data.baseInterestAccrued),
  delinquencyFeesAccrued: BigInt(data.delinquencyFeesAccrued),
  protocolFeesAccrued: BigInt(data.protocolFeesAccrued)
});

export const normalizeAnnualInterestBipsUpdate = (
  data: SubgraphAnnualInterestBipsUpdateDataFragment
): AnnualInterestBipsUpdate => ({
  ...analyticsEventBase(data),
  oldAnnualInterestBips: data.oldAnnualInterestBips,
  newAnnualInterestBips: data.newAnnualInterestBips
});

export const normalizeMarketBorrow = (
  data: SubgraphAnalyticsMarketBorrowDataFragment
): MarketBorrow => ({
  ...analyticsEventBase(data),
  assetAmount: BigInt(data.assetAmount)
});

export const normalizeMarketDebtRepayment = (
  data: SubgraphAnalyticsMarketDebtRepaymentDataFragment
): MarketDebtRepayment => ({
  ...analyticsEventBase(data),
  from: data.from,
  assetAmount: BigInt(data.assetAmount)
});

export const normalizeMaxTotalSupplyUpdate = (
  data: SubgraphAnalyticsMaxTotalSupplyUpdateDataFragment
): MaxTotalSupplyUpdate => ({
  ...analyticsEventBase(data),
  oldMaxTotalSupply: BigInt(data.oldMaxTotalSupply),
  newMaxTotalSupply: BigInt(data.newMaxTotalSupply)
});

export const normalizeIndexedMarketAggregate = (
  data: SubgraphAnalyticsMarketAggregateDataFragment
): IndexedMarketAggregate => ({
  id: data.id,
  market: normalizeAnalyticsMarket(data),
  totalBorrowed: BigInt(data.totalBorrowed),
  totalRepaid: BigInt(data.totalRepaid),
  totalBaseInterestAccrued: BigInt(data.totalBaseInterestAccrued),
  totalDelinquencyFeesAccrued: BigInt(data.totalDelinquencyFeesAccrued),
  totalProtocolFeesAccrued: BigInt(data.totalProtocolFeesAccrued),
  totalDeposited: BigInt(data.totalDeposited),
  totalWithdrawalsRequested: BigInt(data.totalWithdrawalsRequested),
  totalWithdrawalsExecuted: BigInt(data.totalWithdrawalsExecuted)
});

export const normalizeBorrowerWithdrawalReliability = (
  data: SubgraphBorrowerWithdrawalReliabilityDataFragment
): BorrowerWithdrawalReliability => ({
  id: data.id,
  market: normalizeAnalyticsMarket(data.market),
  expiry: BigInt(data.expiry),
  totalNormalizedRequests: BigInt(data.totalNormalizedRequests),
  isExpired: data.isExpired,
  isClosed: data.isClosed,
  isCompleted: data.isCompleted,
  updatedAt: indexedAt(
    data.updatedAtBlock,
    data.updatedAtTimestamp,
    data.updatedAtTransaction,
    data.updatedAtLogIndex
  ),
  ...(data.expiration
    ? {
        expiration: {
          normalizedAmountPaid: BigInt(data.expiration.normalizedAmountPaid),
          normalizedAmountOwed: BigInt(data.expiration.normalizedAmountOwed),
          observedAt: indexedAt(
            data.expiration.blockNumber,
            data.expiration.blockTimestamp,
            data.expiration.transactionHash,
            data.expiration.blockLogIndex
          )
        }
      }
    : {})
});

export const normalizeLenderPosition = (
  data: SubgraphLenderPositionDataFragment
): LenderPosition => ({
  id: data.id,
  lender: data.address,
  market: normalizeAnalyticsMarket(data.market),
  scaledBalance: BigInt(data.scaledBalance),
  totalDeposited: BigInt(data.totalDeposited),
  totalInterestEarned: BigInt(data.totalInterestEarned),
  lastScaleFactor: BigInt(data.lastScaleFactor),
  addedTimestamp: data.addedTimestamp,
  lastUpdatedTimestamp: data.lastUpdatedTimestamp,
  numPendingWithdrawalBatches: data.numPendingWithdrawalBatches,
  ...(data.snapshot ? { snapshot: normalizeSubgraphLenderAccountSnapshot(data.snapshot) } : {})
});

export const normalizeLenderDeposit = (data: SubgraphLenderDepositDataFragment): LenderDeposit => ({
  id: data.id,
  kind: "deposit",
  accountId: data.account.id,
  lender: data.account.address,
  market: normalizeAnalyticsMarket(data.market),
  assetAmount: BigInt(data.assetAmount),
  scaledAmount: BigInt(data.scaledAmount),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const normalizeLenderWithdrawalRequest = (
  data: SubgraphLenderWithdrawalRequestDataFragment
): LenderWithdrawalRequest => ({
  id: data.id,
  kind: "withdrawal-request",
  accountId: data.account.id,
  lender: data.account.address,
  market: normalizeAnalyticsMarket(data.market),
  batchId: data.batch.id,
  batchExpiry: BigInt(data.batch.expiry),
  scaledAmount: BigInt(data.scaledAmount),
  normalizedAmount: BigInt(data.normalizedAmount),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const normalizeLenderWithdrawalExecution = (
  data: SubgraphLenderWithdrawalExecutionDataFragment
): LenderWithdrawalExecution => ({
  id: data.id,
  kind: "withdrawal-execution",
  accountId: data.account.id,
  lender: data.account.address,
  market: normalizeAnalyticsMarket(data.batch.market),
  batchId: data.batch.id,
  batchExpiry: BigInt(data.batch.expiry),
  normalizedAmount: BigInt(data.normalizedAmount),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const normalizeLenderTransfer = (
  data: SubgraphLenderTransferDataFragment
): LenderTransfer => ({
  id: data.id,
  kind: "transfer",
  market: normalizeAnalyticsMarket(data.market),
  fromAccountId: data.from.id,
  from: data.from.address,
  toAccountId: data.to.id,
  to: data.to.address,
  amount: BigInt(data.amount),
  scaledAmount: BigInt(data.scaledAmount),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const normalizeLenderWithdrawalStatus = (
  data: SubgraphLenderWithdrawalStatusDataFragment
): IndexedLenderWithdrawalStatus => ({
  id: data.id,
  accountId: data.account.id,
  lender: data.account.address,
  market: normalizeAnalyticsMarket(data.account.market),
  batch: {
    id: data.batch.id,
    expiry: BigInt(data.batch.expiry),
    isClosed: data.batch.isClosed,
    isExpired: data.batch.isExpired,
    isCompleted: data.batch.isCompleted,
    createdAt: indexedAt(
      data.batch.creation.blockNumber,
      data.batch.creation.blockTimestamp,
      data.batch.creation.transactionHash,
      data.batch.creation.blockLogIndex
    )
  },
  scaledAmount: BigInt(data.scaledAmount),
  normalizedAmountWithdrawn: BigInt(data.normalizedAmountWithdrawn),
  totalNormalizedRequests: BigInt(data.totalNormalizedRequests),
  isCompleted: data.isCompleted,
  updatedAt: indexedAt(
    data.updatedAtBlock,
    data.updatedAtTimestamp,
    data.updatedAtTransaction,
    data.updatedAtLogIndex
  )
});

export const normalizeProtocolAggregateStats = (
  data: SubgraphProtocolAnalyticsStatsDataFragment
): ProtocolAggregateStats => ({
  ...cumulativeProtocolUsdStats(data),
  ...protocolMarketCounts(data),
  numActiveBorrowers: data.numActiveBorrowers,
  numActiveLenders: data.numActiveLenders,
  numActiveLenderAccounts: data.numActiveLenderAccounts
});

export const normalizeProtocolDailyStats = (
  data: SubgraphProtocolDailyStatsDataFragment
): ProtocolDailyStats => ({
  id: data.id,
  startTimestamp: data.startTimestamp,
  endTimestamp: data.endTimestamp,
  dayDepositedUSD: usd(data.dayDepositedUSD),
  dayBorrowedUSD: usd(data.dayBorrowedUSD),
  dayRepaidUSD: usd(data.dayRepaidUSD),
  dayWithdrawalsRequestedUSD: usd(data.dayWithdrawalsRequestedUSD),
  dayWithdrawalsExecutedUSD: usd(data.dayWithdrawalsExecutedUSD),
  dayBaseInterestAccruedUSD: usd(data.dayBaseInterestAccruedUSD),
  dayDelinquencyFeesAccruedUSD: usd(data.dayDelinquencyFeesAccruedUSD),
  dayProtocolFeesAccruedUSD: usd(data.dayProtocolFeesAccruedUSD),
  totalDepositedUSD: usd(data.totalDepositedUSD),
  totalBorrowedUSD: usd(data.totalBorrowedUSD),
  totalRepaidUSD: usd(data.totalRepaidUSD),
  totalWithdrawalsRequestedUSD: usd(data.totalWithdrawalsRequestedUSD),
  totalWithdrawalsExecutedUSD: usd(data.totalWithdrawalsExecutedUSD),
  totalBaseInterestAccruedUSD: usd(data.totalBaseInterestAccruedUSD),
  totalDelinquencyFeesAccruedUSD: usd(data.totalDelinquencyFeesAccruedUSD),
  totalProtocolFeesAccruedUSD: usd(data.totalProtocolFeesAccruedUSD),
  ...protocolMarketCounts(data),
  numActiveBorrowers: data.numActiveBorrowers,
  numActiveLenders: data.numActiveLenders,
  numActiveLenderAccounts: data.numActiveLenderAccounts
});

export const normalizeTokenPriceObservation = (
  data: SubgraphTokenPriceObservationDataFragment
): TokenPriceObservation => ({
  id: data.id,
  token: normalizeAnalyticsToken(data.token),
  timestamp: data.timestamp,
  priceUSD: usd(data.priceUSD),
  source: parsePriceSource(data.source),
  observedAt: indexedAt(
    data.observedAtBlock,
    data.observedAtTimestamp,
    data.observedAtTransaction,
    data.observedAtLogIndex
  )
});
