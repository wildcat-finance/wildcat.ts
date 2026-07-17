import { IndexedAt, IndexedLenderAccountSnapshot, IndexedMarketSnapshot } from "../domain";

/** Lossless decimal value denominated in USD. */
export type UsdValue = string;

export type IndexedPageCursor = {
  entityId: string;
  /** Graph block pinned by the first page in this traversal. */
  blockNumber: bigint;
};

export type IndexedPageRequest = {
  /** Maximum number of records to return. Defaults to 100 and is capped at 1,000. */
  first?: number;
  /** Exclusive cursor returned by the preceding page. */
  after?: IndexedPageCursor;
};

export type IndexedQueryMetadata = {
  deployment: string;
  blockNumber: bigint;
  blockTimestamp?: bigint;
  blockHash?: string;
  hasIndexingErrors: boolean;
};

export type IndexedPage<T> = {
  items: T[];
  indexedAt: IndexedQueryMetadata;
  pageInfo: {
    /** A full page may produce one final empty request before exhaustion is known. */
    hasNextPage: boolean;
    nextCursor?: IndexedPageCursor;
  };
};

export type PriceSource =
  | "usd-peg"
  | "chainlink-direct"
  | "chainlink-two-hop"
  | "synthetic-testnet"
  | "unknown";

export type IndexedAnalyticsToken = {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isMock: boolean;
  isUsdStablecoin: boolean;
  priceSource: PriceSource;
  priceFeed0?: string;
  priceFeed1?: string;
};

export type IndexedAnalyticsMarket = {
  address: string;
  name: string;
  borrower: string;
  createdAtTimestamp: bigint;
  isClosed: boolean;
  annualInterestBips: number;
  originalAnnualInterestBips: number;
  delinquencyGracePeriod: number;
  maxTotalSupply: bigint;
  scaledTotalSupply: bigint;
  scaleFactor: bigint;
  isDelinquent: boolean;
  isIncurringPenalties: boolean;
  totalDebtUSD: UsdValue;
  snapshot?: IndexedMarketSnapshot;
  asset: IndexedAnalyticsToken;
};

export type BorrowerRegistration = {
  archController: string;
  isRegistered: boolean;
};

export type BorrowerIdentity = {
  address: string;
  firstSeen: IndexedAt;
  lastSeen: IndexedAt;
  registrations: BorrowerRegistration[];
};

export type CumulativeProtocolUsdStats = {
  totalDepositedUSD: UsdValue;
  totalBorrowedUSD: UsdValue;
  totalRepaidUSD: UsdValue;
  totalWithdrawalsRequestedUSD: UsdValue;
  totalWithdrawalsExecutedUSD: UsdValue;
  totalBaseInterestAccruedUSD: UsdValue;
  totalDelinquencyFeesAccruedUSD: UsdValue;
  totalProtocolFeesAccruedUSD: UsdValue;
};

export type ProtocolMarketCounts = {
  numMarkets: number;
  numActiveMarkets: number;
  numDelinquentMarkets: number;
  numClosedMarkets: number;
};

export type BorrowerAggregateStats = CumulativeProtocolUsdStats &
  ProtocolMarketCounts & {
    borrower: string;
    numBatchesExpired: number;
    numBatchesExpiredUnpaid: number;
    numBatchesPaidLate: number;
  };

export type BorrowerAnalyticsProfile = {
  indexedAt: IndexedQueryMetadata;
  identity?: BorrowerIdentity;
  stats?: BorrowerAggregateStats;
};

export type DailyProtocolUsdFlows = {
  dayDepositedUSD: UsdValue;
  dayBorrowedUSD: UsdValue;
  dayRepaidUSD: UsdValue;
  dayWithdrawalsRequestedUSD: UsdValue;
  dayWithdrawalsExecutedUSD: UsdValue;
  dayBaseInterestAccruedUSD: UsdValue;
  dayDelinquencyFeesAccruedUSD: UsdValue;
  dayProtocolFeesAccruedUSD: UsdValue;
};

export type BorrowerDailyStats = CumulativeProtocolUsdStats &
  DailyProtocolUsdFlows &
  ProtocolMarketCounts & {
    id: string;
    borrower: string;
    startTimestamp: number;
    endTimestamp: number;
  };

export type LenderAggregateStats = {
  lender: string;
  firstSeenTimestamp: number;
  totalDepositedUSD: UsdValue;
  totalWithdrawalsRequestedUSD: UsdValue;
  totalWithdrawalsExecutedUSD: UsdValue;
  totalInterestEarnedUSD: UsdValue;
  numMarkets: number;
  numActiveMarkets: number;
};

export type LenderAnalyticsProfile = {
  indexedAt: IndexedQueryMetadata;
  stats?: LenderAggregateStats;
};

export type LenderDailyStats = Omit<LenderAggregateStats, "firstSeenTimestamp"> & {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  dayDepositedUSD: UsdValue;
  dayWithdrawalsRequestedUSD: UsdValue;
  dayWithdrawalsExecutedUSD: UsdValue;
  dayInterestEarnedUSD: UsdValue;
};

export type IndexedMarketDailyStats = {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  market: IndexedAnalyticsMarket;
  dayDeposited: bigint;
  dayWithdrawalsRequested: bigint;
  dayWithdrawalsExecuted: bigint;
  dayBorrowed: bigint;
  dayRepaid: bigint;
  dayBaseInterestAccrued: bigint;
  dayDelinquencyFeesAccrued: bigint;
  dayProtocolFeesAccrued: bigint;
  totalBorrowed: bigint;
  totalRepaid: bigint;
  totalBaseInterestAccrued: bigint;
  totalDelinquencyFeesAccrued: bigint;
  totalProtocolFeesAccrued: bigint;
  totalDeposited: bigint;
  totalWithdrawalsRequested: bigint;
  totalWithdrawalsExecuted: bigint;
  totalBorrowedUSD: UsdValue;
  totalRepaidUSD: UsdValue;
  totalBaseInterestAccruedUSD: UsdValue;
  totalDelinquencyFeesAccruedUSD: UsdValue;
  totalProtocolFeesAccruedUSD: UsdValue;
  totalDepositedUSD: UsdValue;
  totalWithdrawalsRequestedUSD: UsdValue;
  totalWithdrawalsExecutedUSD: UsdValue;
  scaledTotalSupply: bigint;
  scaleFactor: bigint;
  usdPrice?: UsdValue;
};

export type IndexedMarketAnalyticsEvent = IndexedAt & {
  id: string;
  market: IndexedAnalyticsMarket;
};

export type DelinquencyStatusChange = IndexedMarketAnalyticsEvent & {
  isDelinquent: boolean;
  liquidityCoverageRequired: bigint;
  totalAssets: bigint;
};

export type MarketInterestAccrual = IndexedMarketAnalyticsEvent & {
  fromTimestamp: number;
  toTimestamp: number;
  timeWithPenalties: number;
  baseInterestRay: bigint;
  delinquencyFeeRay: bigint;
  baseInterestAccrued: bigint;
  delinquencyFeesAccrued: bigint;
  protocolFeesAccrued: bigint;
};

export type AnnualInterestBipsUpdate = IndexedMarketAnalyticsEvent & {
  oldAnnualInterestBips: number;
  newAnnualInterestBips: number;
};

export type BorrowerWithdrawalReliability = {
  id: string;
  market: IndexedAnalyticsMarket;
  expiry: bigint;
  totalNormalizedRequests: bigint;
  isExpired: boolean;
  isClosed: boolean;
  isCompleted: boolean;
  updatedAt: IndexedAt;
  expiration?: {
    normalizedAmountPaid: bigint;
    normalizedAmountOwed: bigint;
    observedAt: IndexedAt;
  };
};

export type LenderPosition = {
  id: string;
  lender: string;
  market: IndexedAnalyticsMarket;
  scaledBalance: bigint;
  totalDeposited: bigint;
  totalInterestEarned: bigint;
  lastScaleFactor: bigint;
  addedTimestamp: number;
  lastUpdatedTimestamp: number;
  numPendingWithdrawalBatches: number;
  snapshot?: IndexedLenderAccountSnapshot;
};

export type IndexedLenderActivity = IndexedAt & {
  id: string;
  accountId: string;
  lender: string;
  market: IndexedAnalyticsMarket;
};

export type LenderDeposit = IndexedLenderActivity & {
  kind: "deposit";
  assetAmount: bigint;
  scaledAmount: bigint;
};

export type LenderWithdrawalRequest = IndexedLenderActivity & {
  kind: "withdrawal-request";
  batchId: string;
  batchExpiry: bigint;
  scaledAmount: bigint;
  normalizedAmount: bigint;
};

export type LenderWithdrawalExecution = IndexedLenderActivity & {
  kind: "withdrawal-execution";
  batchId: string;
  batchExpiry: bigint;
  normalizedAmount: bigint;
};

export type LenderTransfer = IndexedAt & {
  id: string;
  kind: "transfer";
  market: IndexedAnalyticsMarket;
  fromAccountId: string;
  from: string;
  toAccountId: string;
  to: string;
  amount: bigint;
  scaledAmount: bigint;
};

export type IndexedLenderWithdrawalStatus = {
  id: string;
  accountId: string;
  lender: string;
  market: IndexedAnalyticsMarket;
  batch: {
    id: string;
    expiry: bigint;
    isClosed: boolean;
    isExpired: boolean;
    isCompleted: boolean;
  };
  scaledAmount: bigint;
  normalizedAmountWithdrawn: bigint;
  totalNormalizedRequests: bigint;
  isCompleted: boolean;
  updatedAt: IndexedAt;
};

export type ProtocolAggregateStats = CumulativeProtocolUsdStats &
  ProtocolMarketCounts & {
    numActiveBorrowers: number;
    numActiveLenders: number;
    numActiveLenderAccounts: number;
  };

export type ProtocolAnalyticsSnapshot = {
  indexedAt: IndexedQueryMetadata;
  stats?: ProtocolAggregateStats;
};

export type ProtocolDailyStats = ProtocolAggregateStats &
  DailyProtocolUsdFlows & {
    id: string;
    startTimestamp: number;
    endTimestamp: number;
  };

export type TokenPriceObservation = {
  id: string;
  token: IndexedAnalyticsToken;
  timestamp: number;
  priceUSD: UsdValue;
  source: PriceSource;
  observedAt: IndexedAt;
};

export type IndexedTokenUsdPrice =
  | {
      status: "priced";
      address: string;
      token: IndexedAnalyticsToken;
      priceUSD: UsdValue;
      source: PriceSource;
      basis: "observation" | "configured-peg";
      observation?: TokenPriceObservation;
    }
  | {
      status: "unpriced";
      address: string;
      token?: IndexedAnalyticsToken;
      reason:
        | "token-not-indexed"
        | "analytics-disabled"
        | "pricing-disabled"
        | "no-price-source"
        | "no-observation";
    };

export type IndexedTokenUsdPrices = {
  indexedAt: IndexedQueryMetadata;
  prices: IndexedTokenUsdPrice[];
};
