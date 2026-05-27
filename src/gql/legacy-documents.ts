import { gql } from "@apollo/client";

const LegacyTokenDataFragmentDoc = gql`
  fragment LegacyTokenData on Token {
    id
    address
    name
    symbol
    decimals
    isMock
  }
`;

const LegacyRoleProviderDataFragmentDoc = gql`
  fragment LegacyRoleProviderData on RoleProvider {
    id
    providerAddress
    timeToLive
    isPullProvider
    pullProviderIndex
    isPushProvider
    pushProviderIndex
    isApproved
  }
`;

const LegacyLenderHooksAccessDataFragmentDoc = gql`
  fragment LegacyLenderHooksAccessData on LenderHooksAccess {
    id
    lender
    isBlockedFromDeposits
    lastProvider {
      ...LegacyRoleProviderData
    }
    canRefresh
    lastApprovalTimestamp
    addedTimestamp
  }
  ${LegacyRoleProviderDataFragmentDoc}
`;

const LegacyLenderPropertiesFragmentDoc = gql`
  fragment LegacyLenderProperties on LenderAccount {
    id
    address
    scaledBalance
    role
    totalDeposited
    lastScaleFactor
    lastUpdatedTimestamp
    totalInterestEarned
    numPendingWithdrawalBatches
  }
`;

const LegacyDepositDataFragmentDoc = gql`
  fragment LegacyDepositData on Deposit {
    id
    eventIndex
    account {
      address
    }
    assetAmount
    scaledAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyAccountDataForLenderViewFragmentDoc = gql`
  fragment LegacyAccountDataForLenderView on LenderAccount {
    ...LegacyLenderProperties
    controllerAuthorization {
      authorized
    }
    hooksAccess {
      ...LegacyLenderHooksAccessData
    }
    knownLenderStatus {
      id
    }
    deposits(
      first: $numDeposits
      skip: $skipDeposits
      orderBy: $orderDeposits
      orderDirection: $directionDeposits
    ) {
      ...LegacyDepositData
    }
  }
  ${LegacyLenderPropertiesFragmentDoc}
  ${LegacyLenderHooksAccessDataFragmentDoc}
  ${LegacyDepositDataFragmentDoc}
`;

const LegacyBasicLenderDataFragmentDoc = gql`
  fragment LegacyBasicLenderData on LenderAccount {
    id
    address
    scaledBalance
    addedTimestamp
    role
    controllerAuthorization {
      authorized
      addedTimestamp
    }
    hooksAccess {
      ...LegacyLenderHooksAccessData
    }
    knownLenderStatus {
      id
    }
  }
  ${LegacyLenderHooksAccessDataFragmentDoc}
`;

const LegacyParameterConstraintsDataFragmentDoc = gql`
  fragment LegacyParameterConstraintsData on ParameterConstraints {
    minimumDelinquencyGracePeriod
    maximumDelinquencyGracePeriod
    minimumReserveRatioBips
    maximumReserveRatioBips
    minimumDelinquencyFeeBips
    maximumDelinquencyFeeBips
    minimumWithdrawalBatchDuration
    maximumWithdrawalBatchDuration
    minimumAnnualInterestBips
    maximumAnnualInterestBips
  }
`;

const LegacyMinimalControllerDataFragmentDoc = gql`
  fragment LegacyMinimalControllerData on Controller {
    id
    borrower
    numMarkets
    controllerFactory {
      id
      constraints {
        ...LegacyParameterConstraintsData
      }
      feeRecipient
      protocolFeeBips
      originationFeeAsset {
        ...LegacyTokenData
      }
      originationFeeAmount
    }
    archController {
      id
    }
    isRegistered
  }
  ${LegacyParameterConstraintsDataFragmentDoc}
  ${LegacyTokenDataFragmentDoc}
`;

const LegacyHooksTemplateDataFragmentDoc = gql`
  fragment LegacyHooksTemplateData on HooksTemplate {
    id
    name
    feeRecipient
    protocolFeeBips
    originationFeeAsset {
      ...LegacyTokenData
    }
    originationFeeAmount
    disabled
  }
  ${LegacyTokenDataFragmentDoc}
`;

const LegacyHooksInstanceDataFragmentDoc = gql`
  fragment LegacyHooksInstanceData on HooksInstance {
    id
    borrower
    name
    kind
    numMarkets
    hooksTemplate {
      ...LegacyHooksTemplateData
    }
    providers {
      ...LegacyRoleProviderData
    }
    eventIndex
  }
  ${LegacyHooksTemplateDataFragmentDoc}
  ${LegacyRoleProviderDataFragmentDoc}
`;

const LegacyHooksConfigDataForMarketFragmentDoc = gql`
  fragment LegacyHooksConfigDataForMarket on HooksConfig {
    id
    useOnDeposit
    useOnQueueWithdrawal
    useOnExecuteWithdrawal
    useOnTransfer
    useOnBorrow
    useOnRepay
    useOnCloseMarket
    useOnNukeFromOrbit
    useOnSetMaxTotalSupply
    useOnSetAnnualInterestAndReserveRatioBips
    useOnSetProtocolFeeBips
    depositRequiresAccess
    transferRequiresAccess
    transfersDisabled
    minimumDeposit
    allowForceBuyBacks
    queueWithdrawalRequiresAccess
    fixedTermEndTime
    allowClosureBeforeTerm
    allowTermReduction
  }
`;

const LegacyMarketDeployedEventFragmentDoc = gql`
  fragment LegacyMarketDeployedEvent on MarketDeployed {
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyMarketDataFragmentDoc = gql`
  fragment LegacyMarketData on Market {
    id
    version
    isRegistered
    isClosed
    controller {
      id
    }
    borrower
    sentinel
    feeRecipient
    name
    symbol
    decimals
    protocolFeeBips
    delinquencyGracePeriod
    delinquencyFeeBips
    withdrawalBatchDuration
    numCollateralContracts
    _asset: asset {
      ...LegacyTokenData
    }
    hooksConfig {
      ...LegacyHooksConfigDataForMarket
    }
    hooks {
      ...LegacyHooksInstanceData
    }
    maxTotalSupply
    pendingProtocolFees
    normalizedUnclaimedWithdrawals
    scaledTotalSupply
    scaledPendingWithdrawals
    pendingWithdrawalExpiry
    isDelinquent
    timeDelinquent
    annualInterestBips
    reserveRatioBips
    scaleFactor
    lastInterestAccruedTimestamp
    originalAnnualInterestBips
    originalReserveRatioBips
    temporaryReserveRatioExpiry
    temporaryReserveRatioActive
    totalBorrowed
    totalRepaid
    totalBaseInterestAccrued
    totalDelinquencyFeesAccrued
    totalProtocolFeesAccrued
    totalDeposited
    eventIndex
    deployedEvent {
      ...LegacyMarketDeployedEvent
    }
  }
  ${LegacyTokenDataFragmentDoc}
  ${LegacyHooksConfigDataForMarketFragmentDoc}
  ${LegacyHooksInstanceDataFragmentDoc}
  ${LegacyMarketDeployedEventFragmentDoc}
`;

const LegacyBorrowDataFragmentDoc = gql`
  fragment LegacyBorrowData on Borrow {
    eventIndex
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyRepaymentDataFragmentDoc = gql`
  fragment LegacyRepaymentData on DebtRepaid {
    eventIndex
    from
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyFeesCollectedDataFragmentDoc = gql`
  fragment LegacyFeesCollectedData on FeesCollected {
    eventIndex
    feesCollected
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyMarketRecordsFragmentDoc = gql`
  fragment LegacyMarketRecords on Market {
    depositRecords(
      first: $numDeposits
      skip: $skipDeposits
      orderBy: $orderDeposits
      orderDirection: $directionDeposits
    ) {
      ...LegacyDepositData
    }
    borrowRecords(
      first: $numBorrows
      skip: $skipBorrows
      orderBy: $orderBorrows
      orderDirection: $directionBorrows
    ) {
      ...LegacyBorrowData
    }
    feeCollectionRecords(
      first: $numFeeCollections
      skip: $skipFeeCollections
      orderBy: $orderFeeCollections
      orderDirection: $directionFeeCollections
    ) {
      ...LegacyFeesCollectedData
    }
    repaymentRecords(
      first: $numRepayments
      skip: $skipRepayments
      orderBy: $orderRepayments
      orderDirection: $directionRepayments
    ) {
      ...LegacyRepaymentData
    }
  }
  ${LegacyDepositDataFragmentDoc}
  ${LegacyBorrowDataFragmentDoc}
  ${LegacyFeesCollectedDataFragmentDoc}
  ${LegacyRepaymentDataFragmentDoc}
`;

const LegacyMarketDataWithEventsFragmentDoc = gql`
  fragment LegacyMarketDataWithEvents on Market {
    ...LegacyMarketData
    ...LegacyMarketRecords @skip(if: $shouldSkipRecords)
  }
  ${LegacyMarketDataFragmentDoc}
  ${LegacyMarketRecordsFragmentDoc}
`;

const LegacyDelinquencyStatusChangedDataFragmentDoc = gql`
  fragment LegacyDelinquencyStatusChangedData on DelinquencyStatusChanged {
    id
    eventIndex
    isDelinquent
    liquidityCoverageRequired
    totalAssets
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyAnnualInterestBipsUpdatedDataFragmentDoc = gql`
  fragment LegacyAnnualInterestBipsUpdatedData on AnnualInterestBipsUpdated {
    eventIndex
    oldAnnualInterestBips
    newAnnualInterestBips
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyMaxTotalSupplyUpdatedDataFragmentDoc = gql`
  fragment LegacyMaxTotalSupplyUpdatedData on MaxTotalSupplyUpdated {
    eventIndex
    oldMaxTotalSupply
    newMaxTotalSupply
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyWithdrawalRequestPropertiesFragmentDoc = gql`
  fragment LegacyWithdrawalRequestProperties on WithdrawalRequest {
    id
    eventIndex
    requestIndex
    account {
      address
    }
    scaledAmount
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyForceBuyBackDataFragmentDoc = gql`
  fragment LegacyForceBuyBackData on ForceBuyBack {
    id
    account {
      address
    }
    eventIndex
    withdrawalExpiry
    scaledAmount
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyMinimumDepositUpdatedDataFragmentDoc = gql`
  fragment LegacyMinimumDepositUpdatedData on MinimumDepositUpdated {
    id
    eventIndex
    oldMinimumDeposit
    newMinimumDeposit
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyProtocolFeeBipsUpdatedDataFragmentDoc = gql`
  fragment LegacyProtocolFeeBipsUpdatedData on ProtocolFeeBipsUpdated {
    id
    protocolFeeBipsUpdatedIndex
    eventIndex
    oldProtocolFeeBips
    newProtocolFeeBips
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyDisabledForceBuyBacksDataFragmentDoc = gql`
  fragment LegacyDisabledForceBuyBacksData on DisabledForceBuyBacks {
    id
    blockNumber
    blockTimestamp
    transactionHash
    eventIndex
  }
`;

const LegacyFixedTermUpdatedDataFragmentDoc = gql`
  fragment LegacyFixedTermUpdatedData on FixedTermUpdated {
    id
    oldFixedTermEndTime
    newFixedTermEndTime
    blockNumber
    blockTimestamp
    transactionHash
    eventIndex
    fixedTermUpdatedIndex
  }
`;

const LegacyMarketClosedDataFragmentDoc = gql`
  fragment LegacyMarketClosedData on MarketClosed {
    eventIndex
    blockNumber
    blockTimestamp
    transactionHash
  }
`;

const LegacyV1LenderWithActiveMarketsFragmentDoc = gql`
  fragment LegacyV1LenderWithActiveMarkets on LenderAuthorization {
    lender
    authorized
    addedTimestamp
    marketAccounts(first: $numMarketAccountsPerLender, skip: $skipMarketAccountsPerLender) {
      role
      market {
        id
        name
      }
    }
  }
`;

const LegacyV2LenderWithActiveMarketsFragmentDoc = gql`
  fragment LegacyV2LenderWithActiveMarkets on LenderHooksAccess {
    ...LegacyLenderHooksAccessData
    addedTimestamp
    marketAccounts(first: $numMarketAccountsPerLender, skip: $skipMarketAccountsPerLender) {
      knownLenderStatus {
        id
      }
      market {
        id
        name
      }
    }
  }
  ${LegacyLenderHooksAccessDataFragmentDoc}
`;

const LegacyControllerAuthorizedLendersWithActiveMarketsFragmentDoc = gql`
  fragment LegacyControllerAuthorizedLendersWithActiveMarkets on Controller {
    authorizedLenders(first: $numLenders, skip: $skipLenders, where: $lenderAuthorizationFilter) {
      ...LegacyV1LenderWithActiveMarkets
    }
  }
  ${LegacyV1LenderWithActiveMarketsFragmentDoc}
`;

const LegacyHooksInstanceLendersWithActiveMarketsFragmentDoc = gql`
  fragment LegacyHooksInstanceLendersWithActiveMarkets on HooksInstance {
    lenders(
      first: $numLenders
      skip: $skipLenders
      orderBy: $orderLenderHooksAccess
      orderDirection: $directionLenders
      where: $lenderHooksAccessFilter
    ) {
      ...LegacyV2LenderWithActiveMarkets
    }
  }
  ${LegacyV2LenderWithActiveMarketsFragmentDoc}
`;

export const LegacyGetMarketsWithEventsDocument = gql`
  query legacyGetMarketsWithEvents(
    $marketFilter: Market_filter = { id_not: null }
    $shouldSkipRecords: Boolean = false
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numFeeCollections: Int = 10
    $skipFeeCollections: Int = 0
    $orderFeeCollections: FeesCollected_orderBy = blockTimestamp
    $directionFeeCollections: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    markets(
      where: $marketFilter
      orderBy: $orderMarkets
      orderDirection: $directionMarkets
      first: $numMarkets
      skip: $skipMarkets
    ) {
      ...LegacyMarketDataWithEvents
    }
  }
  ${LegacyMarketDataWithEventsFragmentDoc}
`;

export const LegacyGetMarketDocument = gql`
  query legacyGetMarket(
    $market: ID!
    $shouldSkipRecords: Boolean = false
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numFeeCollections: Int = 10
    $skipFeeCollections: Int = 0
    $orderFeeCollections: FeesCollected_orderBy = blockTimestamp
    $directionFeeCollections: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    market(id: $market) {
      ...LegacyMarketDataWithEvents
    }
  }
  ${LegacyMarketDataWithEventsFragmentDoc}
`;

export const LegacyGetMarketEventsDocument = gql`
  query legacyGetMarketEvents(
    $market: ID!
    $startEventIndex: Int = 0
    $endEventIndex: Int = 100000000
    $limit: Int = 10
    $delinquencyRecordsFilter: DelinquencyStatusChanged_filter = { id_not: null }
    $borrowRecordsFilter: Borrow_filter = { id_not: null }
    $depositRecordsFilter: Deposit_filter = { id_not: null }
    $feeCollectionRecordsFilter: FeesCollected_filter = { id_not: null }
    $repaymentRecordsFilter: DebtRepaid_filter = { id_not: null }
    $annualInterestBipsUpdatedRecordsFilter: AnnualInterestBipsUpdated_filter = { id_not: null }
    $maxTotalSupplyUpdatedRecordsFilter: MaxTotalSupplyUpdated_filter = { id_not: null }
    $withdrawalRequestRecordsFilter: WithdrawalRequest_filter = { id_not: null }
    $forceBuyBackRecordsFilter: ForceBuyBack_filter = { id_not: null }
    $minimumDepositUpdateRecordsFilter: MinimumDepositUpdated_filter = { id_not: null }
    $protocolFeeBipsUpdatedRecordsFilter: ProtocolFeeBipsUpdated_filter = { id_not: null }
    $fixedTermUpdatedRecordsFilter: FixedTermUpdated_filter = { id_not: null }
  ) {
    market(id: $market) {
      marketClosedEvent {
        ...LegacyMarketClosedData
      }
      forceBuyBackDisabledRecord {
        ...LegacyDisabledForceBuyBacksData
      }
      delinquencyRecords(
        where: {
          and: [
            $delinquencyRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyDelinquencyStatusChangedData
      }
      borrowRecords(
        where: {
          and: [
            $borrowRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyBorrowData
      }
      depositRecords(
        where: {
          and: [
            $depositRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyDepositData
      }
      feeCollectionRecords(
        where: {
          and: [
            $feeCollectionRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyFeesCollectedData
      }
      repaymentRecords(
        where: {
          and: [
            $repaymentRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyRepaymentData
      }
      annualInterestBipsUpdatedRecords(
        where: {
          and: [
            $annualInterestBipsUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyAnnualInterestBipsUpdatedData
      }
      maxTotalSupplyUpdatedRecords(
        where: {
          and: [
            $maxTotalSupplyUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyMaxTotalSupplyUpdatedData
      }
      withdrawalRequestRecords(
        where: {
          and: [
            $withdrawalRequestRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyWithdrawalRequestProperties
      }
      forceBuyBackRecords(
        where: {
          and: [
            $forceBuyBackRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyForceBuyBackData
      }
      minimumDepositUpdateRecords(
        where: {
          and: [
            $minimumDepositUpdateRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyMinimumDepositUpdatedData
      }
      protocolFeeBipsUpdatedRecords(
        where: {
          and: [
            $protocolFeeBipsUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyProtocolFeeBipsUpdatedData
      }
      fixedTermUpdatedRecords(
        where: {
          and: [
            $fixedTermUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...LegacyFixedTermUpdatedData
      }
    }
  }
  ${LegacyMarketClosedDataFragmentDoc}
  ${LegacyDisabledForceBuyBacksDataFragmentDoc}
  ${LegacyDelinquencyStatusChangedDataFragmentDoc}
  ${LegacyBorrowDataFragmentDoc}
  ${LegacyDepositDataFragmentDoc}
  ${LegacyFeesCollectedDataFragmentDoc}
  ${LegacyRepaymentDataFragmentDoc}
  ${LegacyAnnualInterestBipsUpdatedDataFragmentDoc}
  ${LegacyMaxTotalSupplyUpdatedDataFragmentDoc}
  ${LegacyWithdrawalRequestPropertiesFragmentDoc}
  ${LegacyForceBuyBackDataFragmentDoc}
  ${LegacyMinimumDepositUpdatedDataFragmentDoc}
  ${LegacyProtocolFeeBipsUpdatedDataFragmentDoc}
  ${LegacyFixedTermUpdatedDataFragmentDoc}
`;

export const LegacyGetAllMarketsForLenderViewDocument = gql`
  query legacyGetAllMarketsForLenderView(
    $lender: Bytes
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    markets(
      where: $marketFilter
      orderBy: $orderMarkets
      orderDirection: $directionMarkets
      first: $numMarkets
      skip: $skipMarkets
    ) {
      ...LegacyMarketData
      borrowRecords(
        first: $numBorrows
        skip: $skipBorrows
        orderBy: $orderBorrows
        orderDirection: $directionBorrows
      ) {
        ...LegacyBorrowData
      }
      repaymentRecords(
        first: $numRepayments
        skip: $skipRepayments
        orderBy: $orderRepayments
        orderDirection: $directionRepayments
      ) {
        ...LegacyRepaymentData
      }
      lenders(where: { address: $lender }, first: 1) {
        ...LegacyAccountDataForLenderView
      }
    }
    controllerAuthorizations: lenderAuthorizations(
      where: { and: [{ lender: $lender }, { authorized: true }] }
    ) {
      lender
      authorized
      controller {
        markets {
          id
        }
      }
    }
  }
  ${LegacyMarketDataFragmentDoc}
  ${LegacyBorrowDataFragmentDoc}
  ${LegacyRepaymentDataFragmentDoc}
  ${LegacyAccountDataForLenderViewFragmentDoc}
`;

export const LegacyGetMarketsAndLendersByHooksInstanceOrControllerDocument = gql`
  query legacyGetMarketsAndLendersByHooksInstanceOrController(
    $contractAddress: ID!
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $lenderHooksAccessFilter: LenderHooksAccess_filter = { id_not: null }
    $lenderAuthorizationFilter: LenderAuthorization_filter = { id_not: null }
    $numMarketAccountsPerLender: Int = 100
    $skipMarketAccountsPerLender: Int = 0
    $numLenders: Int = 1000
    $skipLenders: Int = 0
    $orderLenderHooksAccess: LenderHooksAccess_orderBy = lastApprovalTimestamp
    $directionLenders: OrderDirection = desc
  ) {
    hooksInstance(id: $contractAddress) {
      ...LegacyHooksInstanceData
      markets(
        where: $marketFilter
        first: $numMarkets
        skip: $skipMarkets
        orderBy: $orderMarkets
        orderDirection: $directionMarkets
      ) {
        ...LegacyMarketData
      }
      ...LegacyHooksInstanceLendersWithActiveMarkets
    }
    controller(id: $contractAddress) {
      ...LegacyMinimalControllerData
      markets(
        where: $marketFilter
        first: $numMarkets
        skip: $skipMarkets
        orderBy: $orderMarkets
        orderDirection: $directionMarkets
      ) {
        ...LegacyMarketData
      }
      ...LegacyControllerAuthorizedLendersWithActiveMarkets
    }
  }
  ${LegacyHooksInstanceDataFragmentDoc}
  ${LegacyMarketDataFragmentDoc}
  ${LegacyHooksInstanceLendersWithActiveMarketsFragmentDoc}
  ${LegacyMinimalControllerDataFragmentDoc}
  ${LegacyControllerAuthorizedLendersWithActiveMarketsFragmentDoc}
`;

export const LegacyGetAllMarketsDocument = gql`
  query legacyGetAllMarkets {
    markets {
      ...LegacyMarketData
    }
  }
  ${LegacyMarketDataFragmentDoc}
`;

export const LegacyGetLenderAccountWithMarketDocument = gql`
  query legacyGetLenderAccountWithMarket(
    $market: ID!
    $lender: Bytes!
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    market(id: $market) {
      lenders(where: { address: $lender }) {
        ...LegacyAccountDataForLenderView
      }
      ...LegacyMarketData
      borrowRecords(
        first: $numBorrows
        skip: $skipBorrows
        orderBy: $orderBorrows
        orderDirection: $directionBorrows
      ) {
        ...LegacyBorrowData
      }
      repaymentRecords(
        first: $numRepayments
        skip: $skipRepayments
        orderBy: $orderRepayments
        orderDirection: $directionRepayments
      ) {
        ...LegacyRepaymentData
      }
    }
  }
  ${LegacyAccountDataForLenderViewFragmentDoc}
  ${LegacyMarketDataFragmentDoc}
  ${LegacyBorrowDataFragmentDoc}
  ${LegacyRepaymentDataFragmentDoc}
`;

export const LegacyGetAccountsWhereLenderAuthorizedOrActiveDocument = gql`
  query legacyGetAccountsWhereLenderAuthorizedOrActive(
    $lender: Bytes!
    $accountFilter: LenderAccount_filter = { address_not: null }
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    lenderAccounts(
      where: {
        and: [
          $accountFilter
          { address: $lender }
          {
            or: [
              { role_in: [DepositAndWithdraw, WithdrawOnly] }
              { scaledBalance_gt: 0 }
              { controllerAuthorization_: { authorized: true } }
              { knownLenderStatus_: { id_not: null } }
              { hooksAccess_: { lastApprovalTimestamp_gt: 0 } }
              { totalDeposited_gt: 0 }
            ]
          }
        ]
      }
    ) {
      ...LegacyAccountDataForLenderView
      market {
        ...LegacyMarketData
        borrowRecords(
          first: $numBorrows
          skip: $skipBorrows
          orderBy: $orderBorrows
          orderDirection: $directionBorrows
        ) {
          ...LegacyBorrowData
        }
        repaymentRecords(
          first: $numRepayments
          skip: $skipRepayments
          orderBy: $orderRepayments
          orderDirection: $directionRepayments
        ) {
          ...LegacyRepaymentData
        }
      }
    }
    controllerAuthorizations: lenderAuthorizations(
      where: { and: [{ lender: $lender }, { authorized: true }] }
    ) {
      lender
      authorized
      controller {
        markets {
          ...LegacyMarketData
          borrowRecords(
            first: $numBorrows
            skip: $skipBorrows
            orderBy: $orderBorrows
            orderDirection: $directionBorrows
          ) {
            ...LegacyBorrowData
          }
          repaymentRecords(
            first: $numRepayments
            skip: $skipRepayments
            orderBy: $orderRepayments
            orderDirection: $directionRepayments
          ) {
            ...LegacyRepaymentData
          }
        }
      }
    }
  }
  ${LegacyAccountDataForLenderViewFragmentDoc}
  ${LegacyMarketDataFragmentDoc}
  ${LegacyBorrowDataFragmentDoc}
  ${LegacyRepaymentDataFragmentDoc}
`;

export { LegacyMarketDataFragmentDoc, LegacyMarketDataWithEventsFragmentDoc };
