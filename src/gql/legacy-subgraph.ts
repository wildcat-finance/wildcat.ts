import { gql } from "@apollo/client";
import { SupportedChainId } from "../config/chains";
import { Deployments, getHooksFactoryAddress } from "../config/deployments";
import { parseHooksKind } from "../domain";
import {
  SubgraphFactoryLifecycle,
  SubgraphAccountDataForLenderViewFragment,
  SubgraphHookedMarketAbi,
  SubgraphHooksFactoryDataFragment,
  SubgraphHooksInstanceDataFragment,
  SubgraphHooksTemplateRegistrationDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarket_Filter,
  SubgraphMarketKind,
  SubgraphMarket_OrderBy,
  SubgraphMarketOriginKind,
  SubgraphMarketVersion,
  AnnualInterestBipsUpdatedDataFragmentDoc,
  BorrowDataFragmentDoc,
  DelinquencyStatusChangedDataFragmentDoc,
  DisabledForceBuyBacksDataFragmentDoc,
  FeesCollectedDataFragmentDoc,
  FixedTermUpdatedDataFragmentDoc,
  ForceBuyBackDataFragmentDoc,
  LenderWithdrawalPropertiesFragmentDoc,
  LenderWithdrawalPropertiesWithEventsFragmentDoc,
  MarketClosedDataFragmentDoc,
  MaxTotalSupplyUpdatedDataFragmentDoc,
  MinimumDepositUpdatedDataFragmentDoc,
  ProtocolFeeBipsUpdatedDataFragmentDoc,
  RepaymentDataFragmentDoc,
  WithdrawalBatchPaymentPropertiesFragmentDoc,
  WithdrawalBatchPropertiesFragmentDoc,
  WithdrawalExecutionPropertiesFragmentDoc,
  WithdrawalRequestPropertiesFragmentDoc
} from "./graphql";

export type LegacyTokenData = {
  __typename?: "Token";
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isMock: boolean;
};

export type LegacyRoleProviderData = {
  __typename?: "RoleProvider";
  id: string;
  providerAddress: string;
  timeToLive: string;
  isPullProvider: boolean;
  pullProviderIndex: number;
  isPushProvider: boolean;
  pushProviderIndex: number;
  isApproved: boolean;
};

export type LegacyHooksFactoryData = {
  __typename?: "HooksFactory";
  id: string;
  archController?: { __typename?: "ArchController"; id: string } | null;
  sentinel?: string | null;
  isRegistered?: boolean | null;
};

export type LegacyHooksTemplateData = {
  __typename?: "HooksTemplate";
  id: string;
  name: string;
  feeRecipient: string;
  protocolFeeBips: number;
  originationFeeAsset?: LegacyTokenData | null;
  originationFeeAmount: string;
  disabled: boolean;
  hooksFactory?: LegacyHooksFactoryData | null;
};

export type LegacyHooksInstanceData = {
  __typename?: "HooksInstance";
  id: string;
  borrower: string;
  name: string;
  kind: string;
  numMarkets: number;
  hooksFactory?: LegacyHooksFactoryData | null;
  hooksTemplate: LegacyHooksTemplateData;
  providers: LegacyRoleProviderData[];
  eventIndex: number;
};

export type LegacyHooksConfigData = {
  __typename?: "HooksConfig";
  id: string;
  useOnDeposit: boolean;
  useOnQueueWithdrawal: boolean;
  useOnExecuteWithdrawal: boolean;
  useOnTransfer: boolean;
  useOnBorrow: boolean;
  useOnRepay: boolean;
  useOnCloseMarket: boolean;
  useOnNukeFromOrbit: boolean;
  useOnSetMaxTotalSupply: boolean;
  useOnSetAnnualInterestAndReserveRatioBips: boolean;
  useOnSetProtocolFeeBips: boolean;
  depositRequiresAccess: boolean;
  transferRequiresAccess: boolean;
  transfersDisabled: boolean;
  minimumDeposit?: string | null;
  allowForceBuyBacks: boolean;
  queueWithdrawalRequiresAccess: boolean;
  fixedTermEndTime: number;
  allowClosureBeforeTerm: boolean;
  allowTermReduction: boolean;
};

export type LegacyMarketData = {
  __typename?: "Market";
  id: string;
  version: SubgraphMarketVersion | `${SubgraphMarketVersion}`;
  isRegistered: boolean;
  isClosed: boolean;
  controller?: { __typename?: "Controller"; id: string } | null;
  borrower: string;
  sentinel: string;
  feeRecipient: string;
  name: string;
  symbol: string;
  decimals: number;
  protocolFeeBips: number;
  delinquencyGracePeriod: number;
  delinquencyFeeBips: number;
  withdrawalBatchDuration: number;
  numCollateralContracts: number;
  _asset: LegacyTokenData;
  hooksFactory?: LegacyHooksFactoryData | null;
  archController?: { __typename?: "ArchController"; id: string } | null;
  hooksConfig?: LegacyHooksConfigData | null;
  hooks?: LegacyHooksInstanceData | null;
  maxTotalSupply: string;
  totalAssets: string;
  pendingProtocolFees: string;
  normalizedUnclaimedWithdrawals: string;
  scaledTotalSupply: string;
  scaledPendingWithdrawals: string;
  pendingWithdrawalExpiry: string;
  isDelinquent: boolean;
  timeDelinquent: number;
  annualInterestBips: number;
  reserveRatioBips: number;
  scaleFactor: string;
  lastInterestAccruedTimestamp: number;
  originalAnnualInterestBips: number;
  originalReserveRatioBips: number;
  temporaryReserveRatioExpiry: number;
  temporaryReserveRatioActive: boolean;
  totalBorrowed: string;
  totalRepaid: string;
  totalBaseInterestAccrued: string;
  totalDelinquencyFeesAccrued: string;
  totalProtocolFeesAccrued: string;
  totalDeposited: string;
  eventIndex: number;
  deployedEvent?: {
    __typename?: "MarketDeployed";
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  } | null;
};

export type LegacyLenderHooksAccessData = {
  __typename?: "LenderHooksAccess";
  id: string;
  lender: string;
  isBlockedFromDeposits: boolean;
  lastProvider?: LegacyRoleProviderData | null;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
  addedTimestamp: number;
};

export type LegacyLenderAccountData = {
  __typename?: "LenderAccount";
  id: string;
  address: string;
  scaledBalance: string;
  role: string;
  totalDeposited: string;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  numPendingWithdrawalBatches: number;
  controllerAuthorization?: { authorized: boolean } | null;
  hooksAccess?: LegacyLenderHooksAccessData | null;
  knownLenderStatus?: { id: string } | null;
  deposits?: Array<{
    __typename?: "Deposit";
    id: string;
    eventIndex: number;
    account: { address: string };
    assetAmount: string;
    scaledAmount: string;
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  }>;
};

export type LegacyLenderHooksAccessWithKnownMarkets = LegacyLenderHooksAccessData & {
  hooks: { id: string };
  knownLenderStatuses: Array<{ market: { id: string } }>;
};

export type LegacyLenderMarketData = LegacyMarketData & {
  lenders: LegacyLenderAccountData[];
};

export type LegacyLenderMarketsQueryData = {
  markets: LegacyLenderMarketData[];
  controllerAuthorizations: Array<{
    lender: string;
    authorized: boolean;
    controller?: { markets: Array<{ id: string }> } | null;
  }>;
  lenderHooksAccesses: LegacyLenderHooksAccessWithKnownMarkets[];
};

const LegacyTokenDataFragment = gql`
  fragment LegacyTokenData on Token {
    id
    address
    name
    symbol
    decimals
    isMock
  }
`;

const LegacyRoleProviderDataFragment = gql`
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

const LegacyLenderHooksAccessDataFragment = gql`
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
  ${LegacyRoleProviderDataFragment}
`;

const LegacyDepositDataFragment = gql`
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

const LegacyAccountDataForLenderViewFragment = gql`
  fragment LegacyAccountDataForLenderView on LenderAccount {
    id
    address
    scaledBalance
    role
    totalDeposited
    lastScaleFactor
    lastUpdatedTimestamp
    totalInterestEarned
    numPendingWithdrawalBatches
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
  ${LegacyLenderHooksAccessDataFragment}
  ${LegacyDepositDataFragment}
`;

const LegacyLenderAccountSummaryFragment = gql`
  fragment LegacyLenderAccountSummary on LenderAccount {
    id
    address
    scaledBalance
    role
    totalDeposited
    lastScaleFactor
    lastUpdatedTimestamp
    totalInterestEarned
    numPendingWithdrawalBatches
    controllerAuthorization {
      authorized
    }
    hooksAccess {
      ...LegacyLenderHooksAccessData
    }
    knownLenderStatus {
      id
    }
  }
  ${LegacyLenderHooksAccessDataFragment}
`;

const LegacyHooksFactoryDataFragment = gql`
  fragment LegacyHooksFactoryData on HooksFactory {
    id
    archController {
      id
    }
    sentinel
    isRegistered
  }
`;

const LegacyHooksTemplateDataFragment = gql`
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
    hooksFactory {
      ...LegacyHooksFactoryData
    }
  }
  ${LegacyTokenDataFragment}
  ${LegacyHooksFactoryDataFragment}
`;

const LegacyHooksInstanceDataFragment = gql`
  fragment LegacyHooksInstanceData on HooksInstance {
    id
    borrower
    name
    kind
    numMarkets
    hooksFactory {
      ...LegacyHooksFactoryData
    }
    hooksTemplate {
      ...LegacyHooksTemplateData
    }
    providers(where: { isApproved: true }) {
      ...LegacyRoleProviderData
    }
    eventIndex
  }
  ${LegacyHooksTemplateDataFragment}
  ${LegacyHooksFactoryDataFragment}
  ${LegacyRoleProviderDataFragment}
`;

const LegacyParameterConstraintsDataFragment = gql`
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

const LegacyMinimalControllerDataFragment = gql`
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
  ${LegacyParameterConstraintsDataFragment}
  ${LegacyTokenDataFragment}
`;

const LegacyV1LenderWithActiveMarketsFragment = gql`
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

const LegacyV2LenderWithActiveMarketsFragment = gql`
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
  ${LegacyLenderHooksAccessDataFragment}
`;

const LegacyControllerAuthorizedLendersWithActiveMarketsFragment = gql`
  fragment LegacyControllerAuthorizedLendersWithActiveMarkets on Controller {
    authorizedLenders(first: $numLenders, skip: $skipLenders, where: $lenderAuthorizationFilter) {
      ...LegacyV1LenderWithActiveMarkets
    }
  }
  ${LegacyV1LenderWithActiveMarketsFragment}
`;

const LegacyHooksInstanceLendersWithActiveMarketsFragment = gql`
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
  ${LegacyV2LenderWithActiveMarketsFragment}
`;

const LegacyHooksConfigDataFragment = gql`
  fragment LegacyHooksConfigData on HooksConfig {
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

const LegacyMarketDataFragment = gql`
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
    hooksFactory {
      ...LegacyHooksFactoryData
    }
    archController {
      id
    }
    hooksConfig {
      ...LegacyHooksConfigData
    }
    hooks {
      ...LegacyHooksInstanceData
    }
    maxTotalSupply
    totalAssets
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
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
  ${LegacyTokenDataFragment}
  ${LegacyHooksFactoryDataFragment}
  ${LegacyHooksConfigDataFragment}
  ${LegacyHooksInstanceDataFragment}
`;

export const LegacyGetHooksFactoriesDocument = gql`
  query legacyGetHooksFactories($first: Int!, $skip: Int!) {
    hooksFactories(first: $first, skip: $skip, orderBy: id, orderDirection: asc) {
      ...LegacyHooksFactoryData
    }
  }
  ${LegacyHooksFactoryDataFragment}
`;

export const LegacyGetHooksTemplateRegistrationsDocument = gql`
  query legacyGetHooksTemplateRegistrations($first: Int!, $skip: Int!) {
    hooksTemplates(first: $first, skip: $skip, orderBy: id, orderDirection: asc) {
      ...LegacyHooksTemplateData
    }
  }
  ${LegacyHooksTemplateDataFragment}
`;

export const LegacyGetAllHooksTemplatesDocument = gql`
  query legacyGetAllHooksTemplates($borrower: Bytes, $includeBorrower: Boolean!) {
    hooksTemplates(first: 1000) {
      ...LegacyHooksTemplateData
    }
    registeredBorrowers(where: { borrower: $borrower }, first: 1) @include(if: $includeBorrower) {
      isRegistered
    }
  }
  ${LegacyHooksTemplateDataFragment}
`;

export const LegacyGetAllHooksDataForBorrowerDocument = gql`
  query legacyGetAllHooksDataForBorrower($borrower: Bytes!) {
    hooksTemplates(first: 1000) {
      ...LegacyHooksTemplateData
    }
    hooksInstances(where: { borrower: $borrower }, first: 1000) {
      ...LegacyHooksInstanceData
    }
    registeredBorrowers(where: { borrower: $borrower }, first: 1) {
      isRegistered
    }
    controllers(where: { borrower: $borrower }, first: 1) {
      ...LegacyMinimalControllerData
    }
  }
  ${LegacyHooksTemplateDataFragment}
  ${LegacyHooksInstanceDataFragment}
  ${LegacyMinimalControllerDataFragment}
`;

export const LegacyGetMarketListDocument = gql`
  query legacyGetMarketList(
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
  ) {
    markets(
      where: $marketFilter
      orderBy: $orderMarkets
      orderDirection: $directionMarkets
      first: $numMarkets
      skip: $skipMarkets
    ) {
      ...LegacyMarketData
    }
  }
  ${LegacyMarketDataFragment}
`;

export const LegacyGetMarketDocument = gql`
  query legacyGetMarket($market: ID!) {
    market(id: $market) {
      ...LegacyMarketData
    }
  }
  ${LegacyMarketDataFragment}
`;

export const LegacyGetLenderAccountForMarketDocument = gql`
  query legacyGetLenderAccountForMarket(
    $market: ID!
    $lender: Bytes!
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
  ) {
    market(id: $market) {
      id
      lenders(where: { address: $lender }) {
        ...LegacyAccountDataForLenderView
      }
    }
  }
  ${LegacyAccountDataForLenderViewFragment}
`;

export const LegacyGetIndexedLenderAccountSummaryForMarketDocument = gql`
  query legacyGetIndexedLenderAccountSummaryForMarket($market: ID!, $lender: Bytes!) {
    market(id: $market) {
      id
      lenders(where: { address: $lender }, first: 1) {
        ...LegacyLenderAccountSummary
      }
    }
  }
  ${LegacyLenderAccountSummaryFragment}
`;

export const LegacyGetLenderWithdrawalsForMarketDocument = gql`
  query legacyGetLenderWithdrawalsForMarket(
    $market: ID!
    $lender: Bytes!
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
    $orderWithdrawals: LenderWithdrawalStatus_orderBy = batch__expiry
    $directionWithdrawals: OrderDirection = desc
  ) {
    market(id: $market) {
      id
      lenders(where: { address: $lender }) {
        incompleteWithdrawals: withdrawals(
          first: $numWithdrawals
          skip: $skipWithdrawals
          orderBy: $orderWithdrawals
          orderDirection: $directionWithdrawals
          where: { isCompleted: false }
        ) {
          ...LenderWithdrawalPropertiesWithEvents
        }
        completeWithdrawals: withdrawals(
          first: $numWithdrawals
          skip: $skipWithdrawals
          orderBy: $orderWithdrawals
          orderDirection: $directionWithdrawals
          where: { isCompleted: true }
        ) {
          ...LenderWithdrawalPropertiesWithEvents
        }
      }
    }
  }
  ${LenderWithdrawalPropertiesWithEventsFragmentDoc}
  ${LenderWithdrawalPropertiesFragmentDoc}
  ${WithdrawalBatchPropertiesFragmentDoc}
  ${WithdrawalBatchPaymentPropertiesFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${WithdrawalExecutionPropertiesFragmentDoc}
`;

export const LegacyGetIncompleteLenderWithdrawalsForMarketDocument = gql`
  query legacyGetIncompleteLenderWithdrawalsForMarket(
    $market: ID!
    $lender: Bytes!
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
    $orderWithdrawals: LenderWithdrawalStatus_orderBy = batch__expiry
    $directionWithdrawals: OrderDirection = desc
  ) {
    market(id: $market) {
      id
      lenders(where: { address: $lender }) {
        incompleteWithdrawals: withdrawals(
          first: $numWithdrawals
          skip: $skipWithdrawals
          orderBy: $orderWithdrawals
          orderDirection: $directionWithdrawals
          where: { isCompleted: false }
        ) {
          ...LenderWithdrawalPropertiesWithEvents
        }
      }
    }
  }
  ${LenderWithdrawalPropertiesWithEventsFragmentDoc}
  ${LenderWithdrawalPropertiesFragmentDoc}
  ${WithdrawalBatchPropertiesFragmentDoc}
  ${WithdrawalBatchPaymentPropertiesFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${WithdrawalExecutionPropertiesFragmentDoc}
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
        ...MarketClosedData
      }
      forceBuyBackDisabledRecord {
        ...DisabledForceBuyBacksData
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
        ...DelinquencyStatusChangedData
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
        ...BorrowData
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
        ...FeesCollectedData
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
        ...RepaymentData
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
        ...AnnualInterestBipsUpdatedData
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
        ...MaxTotalSupplyUpdatedData
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
        ...WithdrawalRequestProperties
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
        ...ForceBuyBackData
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
        ...MinimumDepositUpdatedData
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
        ...ProtocolFeeBipsUpdatedData
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
        ...FixedTermUpdatedData
      }
    }
  }
  ${MarketClosedDataFragmentDoc}
  ${DisabledForceBuyBacksDataFragmentDoc}
  ${DelinquencyStatusChangedDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${LegacyDepositDataFragment}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
  ${AnnualInterestBipsUpdatedDataFragmentDoc}
  ${MaxTotalSupplyUpdatedDataFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${ForceBuyBackDataFragmentDoc}
  ${MinimumDepositUpdatedDataFragmentDoc}
  ${ProtocolFeeBipsUpdatedDataFragmentDoc}
  ${FixedTermUpdatedDataFragmentDoc}
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
  ) {
    markets(
      where: $marketFilter
      orderBy: $orderMarkets
      orderDirection: $directionMarkets
      first: $numMarkets
      skip: $skipMarkets
    ) {
      ...LegacyMarketData
      lenders(where: { address: $lender }, first: 1) {
        ...LegacyAccountDataForLenderView
      }
    }
    controllerAuthorizations: lenderAuthorizations(
      where: { and: [{ lender: $lender }, { authorized: true }] }
      first: 1000
    ) {
      lender
      authorized
      controller {
        markets {
          id
        }
      }
    }
    lenderHooksAccesses(where: { lender: $lender }, first: 1000) {
      ...LegacyLenderHooksAccessData
      hooks {
        id
      }
      knownLenderStatuses(first: 1000) {
        market {
          id
        }
      }
    }
  }
  ${LegacyMarketDataFragment}
  ${LegacyAccountDataForLenderViewFragment}
  ${LegacyLenderHooksAccessDataFragment}
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
  ${LegacyHooksInstanceDataFragment}
  ${LegacyMarketDataFragment}
  ${LegacyHooksInstanceLendersWithActiveMarketsFragment}
  ${LegacyMinimalControllerDataFragment}
  ${LegacyControllerAuthorizedLendersWithActiveMarketsFragment}
`;

const ZERO_TRANSACTION_HASH = `0x${"0".repeat(64)}`;

export const normalizeLegacyHooksFactoryData = (
  chainId: SupportedChainId,
  factory: LegacyHooksFactoryData | null | undefined,
  fallback?: Pick<LegacyMarketData, "archController" | "sentinel">
): SubgraphHooksFactoryDataFragment => {
  const deployments = Deployments[chainId];
  const address = factory?.id ?? getHooksFactoryAddress(chainId, "standard");
  const isRegistered = factory?.isRegistered ?? true;
  const isDeploymentTarget =
    address.toLowerCase() === getHooksFactoryAddress(chainId, "standard").toLowerCase();
  return {
    __typename: "HooksFactory" as const,
    id: address,
    address,
    label: "Legacy V2 hooks factory",
    archController: {
      __typename: "ArchController" as const,
      id:
        factory?.archController?.id ??
        fallback?.archController?.id ??
        deployments.WildcatArchController
    },
    sentinel: factory?.sentinel ?? fallback?.sentinel ?? deployments.WildcatSanctionsSentinel,
    marketKind: SubgraphMarketKind.STANDARD,
    generation: "legacy-v2",
    abiFamily: "legacy-v2",
    hookedMarketAbi: SubgraphHookedMarketAbi.FORCE_BUYBACK,
    configuredStartBlock: "0",
    indexed: true,
    deploymentTarget: isDeploymentTarget,
    lifecycle:
      isDeploymentTarget && isRegistered
        ? SubgraphFactoryLifecycle.ACTIVE
        : SubgraphFactoryLifecycle.HISTORICAL,
    configured: true,
    isRegistered,
    registrationUpdatedAtBlock: null,
    registrationUpdatedAtTimestamp: null
  } as SubgraphHooksFactoryDataFragment;
};

export const normalizeLegacyHooksTemplateRegistrationData = (
  chainId: SupportedChainId,
  template: LegacyHooksTemplateData,
  instanceKind?: string
): SubgraphHooksTemplateRegistrationDataFragment => {
  const kind = parseHooksKind(instanceKind ?? template.name);
  const hooksFactory = normalizeLegacyHooksFactoryData(chainId, template.hooksFactory);
  const hooksTemplate = {
    __typename: "HooksTemplate" as const,
    id: template.id,
    address: template.id,
    kind,
    version: "legacy-v2",
    abiFamily: "legacy-v2"
  };
  return {
    __typename: "HooksTemplateRegistration",
    id: `${hooksFactory.address}-${template.id}`,
    templateAddress: template.id,
    name: template.name,
    feeRecipient: template.feeRecipient,
    protocolFeeBips: template.protocolFeeBips,
    originationFeeAsset: template.originationFeeAsset ?? null,
    originationFeeAmount: template.originationFeeAmount,
    isEnabled: !template.disabled,
    createdAtBlock: "0",
    createdAtTimestamp: "0",
    createdAtTransaction: ZERO_TRANSACTION_HASH,
    createdAtLogIndex: "0",
    updatedAtBlock: "0",
    updatedAtTimestamp: "0",
    updatedAtTransaction: ZERO_TRANSACTION_HASH,
    updatedAtLogIndex: "0",
    hooksTemplate,
    hooksFactory
  } as unknown as SubgraphHooksTemplateRegistrationDataFragment;
};

export const normalizeLegacyHooksInstanceData = (
  chainId: SupportedChainId,
  instance: LegacyHooksInstanceData
): SubgraphHooksInstanceDataFragment => {
  const template = {
    ...instance.hooksTemplate,
    hooksFactory: instance.hooksTemplate.hooksFactory ?? instance.hooksFactory
  };
  const registration = normalizeLegacyHooksTemplateRegistrationData(
    chainId,
    template,
    instance.kind
  );
  return {
    ...instance,
    __typename: "HooksInstance",
    address: instance.id,
    kind: parseHooksKind(instance.kind),
    marketKind: SubgraphMarketKind.STANDARD,
    generation: "legacy-v2",
    abiFamily: "legacy-v2",
    hooksTemplate: registration.hooksTemplate,
    templateRegistration: registration,
    hooksFactory: registration.hooksFactory
  } as unknown as SubgraphHooksInstanceDataFragment;
};

export const normalizeLegacyMarketData = (
  chainId: SupportedChainId,
  market: LegacyMarketData
): SubgraphMarketDataWithEventsFragment => {
  const deployedEvent = market.deployedEvent ?? {
    blockNumber: 0,
    blockTimestamp: 0,
    transactionHash: ZERO_TRANSACTION_HASH
  };
  const isV2 = market.version === SubgraphMarketVersion.V2;
  const hooksFactoryAddress = isV2
    ? market.hooksFactory?.id ?? getHooksFactoryAddress(chainId, "standard")
    : undefined;
  const hooksFactory = hooksFactoryAddress
    ? normalizeLegacyHooksFactoryData(
        chainId,
        market.hooksFactory ?? { id: hooksFactoryAddress },
        market
      )
    : null;
  const hooks = market.hooks
    ? normalizeLegacyHooksInstanceData(chainId, {
        ...market.hooks,
        hooksFactory: market.hooks.hooksFactory ?? market.hooksFactory,
        hooksTemplate: {
          ...market.hooks.hooksTemplate,
          hooksFactory: market.hooks.hooksTemplate.hooksFactory ?? market.hooksFactory
        }
      })
    : null;

  return {
    ...market,
    __typename: "Market",
    address: market.id,
    marketKind: SubgraphMarketKind.STANDARD,
    originKind: isV2 ? SubgraphMarketOriginKind.HOOKS : SubgraphMarketOriginKind.CONTROLLER,
    generation: "legacy-v2",
    abiFamily: "legacy-v2",
    archController: {
      __typename: "ArchController",
      id: market.archController?.id ?? Deployments[chainId].WildcatArchController
    },
    hooksFactory,
    hooksConfig: market.hooksConfig
      ? {
          ...market.hooksConfig,
          __typename: "HooksConfig",
          firstWithdrawalWindowStart: 0,
          periodDuration: 0,
          withdrawalWindowDuration: 0,
          periodicTermClosed: false,
          pendingAprChangeAnnualInterestBips: 0,
          pendingAprChangeProposalTimestamp: 0,
          pendingAprChangeResponseWindowStart: 0,
          pendingAprChangeResponseWindowEnd: 0
        }
      : null,
    hooks,
    commitmentFeeBips: null,
    drawnAmount: null,
    createdAtBlock: String(deployedEvent.blockNumber),
    createdAtTimestamp: String(deployedEvent.blockTimestamp),
    createdAtTransaction: deployedEvent.transactionHash,
    createdAtLogIndex: "0",
    snapshot: null,
    deployedEvent: {
      ...deployedEvent,
      __typename: "MarketDeployed"
    }
  } as unknown as SubgraphMarketDataWithEventsFragment;
};

export const normalizeLegacyLenderAccountData = (
  account: LegacyLenderAccountData
): SubgraphAccountDataForLenderViewFragment =>
  ({
    ...account,
    __typename: "LenderAccount",
    snapshot: null
  } as unknown as SubgraphAccountDataForLenderViewFragment);

export type LegacyMarketFilter = {
  id_in?: string[];
  id_not_in?: string[];
  borrower?: string;
  asset_?: { address: string };
  isClosed?: boolean;
  isRegistered?: boolean;
};

export const legacyMarketFilterCanMatch = (filter?: SubgraphMarket_Filter | null): boolean => {
  const marketKinds = filter?.marketKind_in?.filter(
    (kind): kind is SubgraphMarketKind => kind !== null && kind !== undefined
  );
  return !marketKinds || marketKinds.includes(SubgraphMarketKind.STANDARD);
};

export const toLegacyMarketFilter = (
  filter?: SubgraphMarket_Filter | null
): LegacyMarketFilter => ({
  ...(filter?.address_in
    ? {
        id_in: filter.address_in.filter(
          (address): address is string => address !== null && address !== undefined
        )
      }
    : {}),
  ...(filter?.address_not_in
    ? {
        id_not_in: filter.address_not_in.filter(
          (address): address is string => address !== null && address !== undefined
        )
      }
    : {}),
  ...(filter?.borrower ? { borrower: filter.borrower } : {}),
  ...(filter?.asset ? { asset_: { address: filter.asset } } : {}),
  ...(filter?.isClosed !== null && filter?.isClosed !== undefined
    ? { isClosed: filter.isClosed }
    : {}),
  ...(filter?.isRegistered !== null && filter?.isRegistered !== undefined
    ? { isRegistered: filter.isRegistered }
    : {})
});

export const toLegacyMarketOrder = (order?: SubgraphMarket_OrderBy | null): string | undefined => {
  if (order === SubgraphMarket_OrderBy.createdAtBlock) return "createdAt";
  if (order === SubgraphMarket_OrderBy.address) return "id";
  return order ?? undefined;
};
