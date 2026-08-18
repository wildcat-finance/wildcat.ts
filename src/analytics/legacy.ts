import { gql } from "@apollo/client";
import { IndexedQueryMetadataDataFragmentDoc } from "../gql/graphql";

const LegacyAnalyticsTokenDataFragment = gql`
  fragment LegacyAnalyticsTokenData on Token {
    id
    address
    name
    symbol
    decimals
    isMock
    isUsdStablecoin
    priceFeed0
    priceFeed1
  }
`;

const LegacyAnalyticsMarketReferenceDataFragment = gql`
  fragment LegacyAnalyticsMarketReferenceData on Market {
    id
    address: id
    version
    name
    borrower
    createdAtTimestamp: createdAt
    isClosed
    annualInterestBips
    originalAnnualInterestBips
    delinquencyGracePeriod
    maxTotalSupply
    scaledTotalSupply
    scaleFactor
    isDelinquent
    isIncurringPenalties
    totalDebtUSD
    hooks {
      kind
    }
    hooksConfig {
      fixedTermEndTime
    }
    asset {
      ...LegacyAnalyticsTokenData
    }
  }
  ${LegacyAnalyticsTokenDataFragment}
`;

const LegacyBorrowerAnalyticsStatsDataFragment = gql`
  fragment LegacyBorrowerAnalyticsStatsData on BorrowerStats {
    id
    borrower
    totalDepositedUSD
    totalBorrowedUSD
    totalRepaidUSD
    totalWithdrawalsRequestedUSD
    totalWithdrawalsExecutedUSD
    totalBaseInterestAccruedUSD
    totalDelinquencyFeesAccruedUSD
    totalProtocolFeesAccruedUSD
    numMarkets
    numActiveMarkets
    numDelinquentMarkets
    numClosedMarkets
    numBatchesExpired
    numBatchesExpiredUnpaid
    numBatchesPaidLate
  }
`;

const LegacyMarketDailyStatsDataFragment = gql`
  fragment LegacyMarketDailyStatsData on MarketDailyStats {
    id
    startTimestamp
    endTimestamp
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    dayDeposited
    dayWithdrawalsRequested
    dayWithdrawalsExecuted
    dayBorrowed
    dayRepaid
    dayBaseInterestAccrued
    dayDelinquencyFeesAccrued
    dayProtocolFeesAccrued
    totalBorrowed: cumulativeBorrowed
    totalRepaid: cumulativeRepaid
    totalBaseInterestAccrued: cumulativeBaseInterestAccrued
    totalDelinquencyFeesAccrued: cumulativeDelinquencyFeesAccrued
    totalProtocolFeesAccrued: cumulativeProtocolFeesAccrued
    totalDeposited: cumulativeDeposited
    totalWithdrawalsRequested: cumulativeWithdrawalsRequested
    totalWithdrawalsExecuted: cumulativeWithdrawalsExecuted
    totalBorrowedUSD: cumulativeBorrowedUSD
    totalRepaidUSD: cumulativeRepaidUSD
    totalBaseInterestAccruedUSD: cumulativeBaseInterestAccruedUSD
    totalDelinquencyFeesAccruedUSD: cumulativeDelinquencyFeesAccruedUSD
    totalProtocolFeesAccruedUSD: cumulativeProtocolFeesAccruedUSD
    totalDepositedUSD: cumulativeDepositedUSD
    totalWithdrawalsRequestedUSD: cumulativeWithdrawalsRequestedUSD
    totalWithdrawalsExecutedUSD: cumulativeWithdrawalsExecutedUSD
    scaledTotalSupply
    scaleFactor
    usdPrice
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyDelinquencyStatusChangeDataFragment = gql`
  fragment LegacyDelinquencyStatusChangeData on DelinquencyStatusChanged {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    isDelinquent
    liquidityCoverageRequired
    totalAssets
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyMarketInterestAccrualDataFragment = gql`
  fragment LegacyMarketInterestAccrualData on MarketInterestAccrued {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    fromTimestamp
    toTimestamp
    timeWithPenalties
    baseInterestRay
    delinquencyFeeRay
    baseInterestAccrued
    delinquencyFeesAccrued
    protocolFeesAccrued
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyAnnualInterestBipsUpdateDataFragment = gql`
  fragment LegacyAnnualInterestBipsUpdateData on AnnualInterestBipsUpdated {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    oldAnnualInterestBips
    newAnnualInterestBips
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyMarketBorrowDataFragment = gql`
  fragment LegacyMarketBorrowData on Borrow {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyMarketDebtRepaymentDataFragment = gql`
  fragment LegacyMarketDebtRepaymentData on DebtRepaid {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    from
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyMaxTotalSupplyUpdateDataFragment = gql`
  fragment LegacyMaxTotalSupplyUpdateData on MaxTotalSupplyUpdated {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    oldMaxTotalSupply
    newMaxTotalSupply
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyMarketAggregateDataFragment = gql`
  fragment LegacyMarketAggregateData on Market {
    id
    ...LegacyAnalyticsMarketReferenceData
    totalBorrowed
    totalRepaid
    totalBaseInterestAccrued
    totalDelinquencyFeesAccrued
    totalProtocolFeesAccrued
    totalDeposited
    totalWithdrawalsRequested
    totalWithdrawalsExecuted
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyBorrowerWithdrawalReliabilityDataFragment = gql`
  fragment LegacyBorrowerWithdrawalReliabilityData on WithdrawalBatch {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    expiry
    totalNormalizedRequests
    isExpired
    isClosed
    isCompleted
    lastUpdatedTimestamp
    creation {
      blockNumber
      blockTimestamp
      transactionHash
      blockLogIndex
    }
    expiration {
      normalizedAmountPaid
      normalizedAmountOwed
      blockNumber
      blockTimestamp
      transactionHash
      blockLogIndex
    }
    requests(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
      blockNumber
      blockTimestamp
      transactionHash
      blockLogIndex
    }
    payments(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
      blockNumber
      blockTimestamp
      transactionHash
      blockLogIndex
    }
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyLenderPositionDataFragment = gql`
  fragment LegacyLenderPositionData on LenderAccount {
    id
    address
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    scaledBalance
    totalDeposited
    totalInterestEarned
    lastScaleFactor
    addedTimestamp
    lastUpdatedTimestamp
    numPendingWithdrawalBatches
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyLenderDepositDataFragment = gql`
  fragment LegacyLenderDepositData on Deposit {
    id
    account {
      id
      address
    }
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    assetAmount
    scaledAmount
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyLenderWithdrawalRequestDataFragment = gql`
  fragment LegacyLenderWithdrawalRequestData on WithdrawalRequest {
    id
    account {
      id
      address
    }
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    batch {
      id
      expiry
    }
    scaledAmount
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyLenderWithdrawalExecutionDataFragment = gql`
  fragment LegacyLenderWithdrawalExecutionData on WithdrawalExecution {
    id
    account {
      id
      address
    }
    batch {
      id
      expiry
      market {
        ...LegacyAnalyticsMarketReferenceData
      }
    }
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyLenderTransferDataFragment = gql`
  fragment LegacyLenderTransferData on Transfer {
    id
    market {
      ...LegacyAnalyticsMarketReferenceData
    }
    from {
      id
      address
    }
    to {
      id
      address
    }
    amount
    scaledAmount
    blockNumber
    blockTimestamp
    transactionHash
    blockLogIndex
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyLenderWithdrawalStatusDataFragment = gql`
  fragment LegacyLenderWithdrawalStatusData on LenderWithdrawalStatus {
    id
    account {
      id
      address
      market {
        ...LegacyAnalyticsMarketReferenceData
      }
    }
    batch {
      id
      expiry
      isClosed
      isExpired
      isCompleted
      creation {
        blockNumber
        blockTimestamp
        transactionHash
        blockLogIndex
      }
    }
    scaledAmount
    normalizedAmountWithdrawn
    totalNormalizedRequests
    isCompleted
    requests(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
      blockNumber
      blockTimestamp
      transactionHash
      blockLogIndex
    }
    executions(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
      blockNumber
      blockTimestamp
      transactionHash
      blockLogIndex
    }
  }
  ${LegacyAnalyticsMarketReferenceDataFragment}
`;

const LegacyTokenPriceObservationDataFragment = gql`
  fragment LegacyTokenPriceObservationData on TokenDailyPrice {
    id
    token {
      ...LegacyAnalyticsTokenData
    }
    timestamp
    priceUSD
  }
  ${LegacyAnalyticsTokenDataFragment}
`;

export const LegacyGetBorrowerAnalyticsProfileDocument = gql`
  query legacyGetBorrowerAnalyticsProfile($borrower: Bytes!) {
    _meta {
      ...IndexedQueryMetadataData
    }
    borrowerStats_collection(first: 1, where: { borrower: $borrower }) {
      ...LegacyBorrowerAnalyticsStatsData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyBorrowerAnalyticsStatsDataFragment}
`;

export const LegacyGetMarketDailyStatsPageDocument = gql`
  query legacyGetMarketDailyStatsPage(
    $filter: MarketDailyStats_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    marketDailyStats_collection(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyMarketDailyStatsData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyMarketDailyStatsDataFragment}
`;

export const LegacyGetDelinquencyStatusChangePageDocument = gql`
  query legacyGetDelinquencyStatusChangePage(
    $filter: DelinquencyStatusChanged_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    delinquencyStatusChangeds(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyDelinquencyStatusChangeData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyDelinquencyStatusChangeDataFragment}
`;

export const LegacyGetMarketInterestAccrualPageDocument = gql`
  query legacyGetMarketInterestAccrualPage(
    $filter: MarketInterestAccrued_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    marketInterestAccrueds(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyMarketInterestAccrualData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyMarketInterestAccrualDataFragment}
`;

export const LegacyGetAnnualInterestBipsUpdatePageDocument = gql`
  query legacyGetAnnualInterestBipsUpdatePage(
    $filter: AnnualInterestBipsUpdated_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    annualInterestBipsUpdateds(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyAnnualInterestBipsUpdateData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyAnnualInterestBipsUpdateDataFragment}
`;

export const LegacyGetMarketBorrowPageDocument = gql`
  query legacyGetMarketBorrowPage($filter: Borrow_filter!, $first: Int!, $block: Block_height) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    borrows(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyMarketBorrowData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyMarketBorrowDataFragment}
`;

export const LegacyGetMarketDebtRepaymentPageDocument = gql`
  query legacyGetMarketDebtRepaymentPage(
    $filter: DebtRepaid_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    debtRepaids(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyMarketDebtRepaymentData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyMarketDebtRepaymentDataFragment}
`;

export const LegacyGetMaxTotalSupplyUpdatePageDocument = gql`
  query legacyGetMaxTotalSupplyUpdatePage(
    $filter: MaxTotalSupplyUpdated_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    maxTotalSupplyUpdateds(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyMaxTotalSupplyUpdateData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyMaxTotalSupplyUpdateDataFragment}
`;

export const LegacyGetMarketAggregatePageDocument = gql`
  query legacyGetMarketAggregatePage($filter: Market_filter!, $first: Int!, $block: Block_height) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    markets(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyMarketAggregateData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyMarketAggregateDataFragment}
`;

export const LegacyGetBorrowerWithdrawalReliabilityPageDocument = gql`
  query legacyGetBorrowerWithdrawalReliabilityPage(
    $filter: WithdrawalBatch_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    withdrawalBatches(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyBorrowerWithdrawalReliabilityData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyBorrowerWithdrawalReliabilityDataFragment}
`;

export const LegacyGetLenderPositionPageDocument = gql`
  query legacyGetLenderPositionPage(
    $filter: LenderAccount_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    lenderAccounts(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyLenderPositionData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyLenderPositionDataFragment}
`;

export const LegacyGetLenderDepositPageDocument = gql`
  query legacyGetLenderDepositPage($filter: Deposit_filter!, $first: Int!, $block: Block_height) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    deposits(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyLenderDepositData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyLenderDepositDataFragment}
`;

export const LegacyGetLenderWithdrawalRequestPageDocument = gql`
  query legacyGetLenderWithdrawalRequestPage(
    $filter: WithdrawalRequest_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    withdrawalRequests(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyLenderWithdrawalRequestData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyLenderWithdrawalRequestDataFragment}
`;

export const LegacyGetLenderWithdrawalExecutionPageDocument = gql`
  query legacyGetLenderWithdrawalExecutionPage(
    $filter: WithdrawalExecution_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    withdrawalExecutions(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyLenderWithdrawalExecutionData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyLenderWithdrawalExecutionDataFragment}
`;

export const LegacyGetLenderTransferPageDocument = gql`
  query legacyGetLenderTransferPage($filter: Transfer_filter!, $first: Int!, $block: Block_height) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    transfers(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyLenderTransferData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyLenderTransferDataFragment}
`;

export const LegacyGetLenderWithdrawalStatusPageDocument = gql`
  query legacyGetLenderWithdrawalStatusPage(
    $filter: LenderWithdrawalStatus_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    lenderWithdrawalStatuses(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyLenderWithdrawalStatusData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyLenderWithdrawalStatusDataFragment}
`;

export const LegacyGetAnalyticsTokensDocument = gql`
  query legacyGetAnalyticsTokens($filter: Token_filter!, $first: Int!, $block: Block_height) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    tokens(block: $block, where: $filter, orderBy: id, orderDirection: asc, first: $first) {
      ...LegacyAnalyticsTokenData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyAnalyticsTokenDataFragment}
`;

export const LegacyGetTokenPriceObservationPageDocument = gql`
  query legacyGetTokenPriceObservationPage(
    $filter: TokenDailyPrice_filter!
    $first: Int!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    tokenDailyPrices(
      block: $block
      where: $filter
      orderBy: id
      orderDirection: asc
      first: $first
    ) {
      ...LegacyTokenPriceObservationData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyTokenPriceObservationDataFragment}
`;

export const LegacyGetLatestTokenPriceObservationDocument = gql`
  query legacyGetLatestTokenPriceObservation(
    $filter: TokenDailyPrice_filter!
    $block: Block_height
  ) {
    _meta(block: $block) {
      ...IndexedQueryMetadataData
    }
    tokenDailyPrices(
      block: $block
      where: $filter
      orderBy: timestamp
      orderDirection: desc
      first: 1
    ) {
      ...LegacyTokenPriceObservationData
    }
  }
  ${IndexedQueryMetadataDataFragmentDoc}
  ${LegacyTokenPriceObservationDataFragment}
`;

export type LegacyIndexedAtData = {
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  blockLogIndex: number;
};

export type LegacyBorrowerWithdrawalReliabilityData = {
  id: string;
  market: unknown;
  expiry: string;
  totalNormalizedRequests: string;
  isExpired: boolean;
  isClosed: boolean;
  isCompleted: boolean;
  lastUpdatedTimestamp: number;
  creation: LegacyIndexedAtData;
  expiration?:
    | (LegacyIndexedAtData & {
        normalizedAmountPaid: string;
        normalizedAmountOwed: string;
      })
    | null;
  requests: LegacyIndexedAtData[];
  payments: LegacyIndexedAtData[];
};

export type LegacyLenderWithdrawalStatusData = {
  id: string;
  account: {
    id: string;
    address: string;
    market: unknown;
  };
  batch: {
    id: string;
    expiry: string;
    isClosed: boolean;
    isExpired: boolean;
    isCompleted: boolean;
    creation: LegacyIndexedAtData;
  };
  scaledAmount: string;
  normalizedAmountWithdrawn: string;
  totalNormalizedRequests: string;
  isCompleted: boolean;
  requests: LegacyIndexedAtData[];
  executions: LegacyIndexedAtData[];
};

export type LegacyTokenPriceObservationData = {
  id: string;
  token: unknown;
  timestamp: number;
  priceUSD: string;
};
