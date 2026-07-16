// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum BatchStatusV2_5 {
  Pending,
  Expired,
  Unpaid,
  Complete
}

enum HooksInstanceKindV2_5 {
  Unknown,
  OpenTerm,
  FixedTermLoan,
  PeriodicTerm
}

struct TokenMetadataV2_5 {
  address token;
  string name;
  string symbol;
  uint256 decimals;
  bool isMock;
}

struct MarketParameterConstraintsV2_5 {
  uint32 minimumDelinquencyGracePeriod;
  uint32 maximumDelinquencyGracePeriod;
  uint16 minimumReserveRatioBips;
  uint16 maximumReserveRatioBips;
  uint16 minimumDelinquencyFeeBips;
  uint16 maximumDelinquencyFeeBips;
  uint32 minimumWithdrawalBatchDuration;
  uint32 maximumWithdrawalBatchDuration;
  uint16 minimumAnnualInterestBips;
  uint16 maximumAnnualInterestBips;
}

struct FeeConfigurationV2_5 {
  address feeRecipient;
  uint16 protocolFeeBips;
  TokenMetadataV2_5 originationFeeToken;
  uint256 originationFeeAmount;
  uint256 borrowerOriginationFeeBalance;
  uint256 borrowerOriginationFeeApproval;
}

struct HooksConfigDataV2_5 {
  bool useOnDeposit;
  bool useOnQueueWithdrawal;
  bool useOnExecuteWithdrawal;
  bool useOnTransfer;
  bool useOnBorrow;
  bool useOnRepay;
  bool useOnCloseMarket;
  bool useOnNukeFromOrbit;
  bool useOnSetMaxTotalSupply;
  bool useOnSetAnnualInterestAndReserveRatioBips;
  bool useOnSetProtocolFeeBips;
  bool useOnExecutePendingAnnualInterestBipsReduction;
}

struct HooksDeploymentFlagsV2_5 {
  HooksConfigDataV2_5 optional;
  HooksConfigDataV2_5 required;
}

struct RoleProviderDataV2_5 {
  uint32 timeToLive;
  address providerAddress;
  uint24 pullProviderIndex;
  uint24 pushProviderIndex;
}

struct HooksTemplateDataV2_5 {
  address hooksTemplate;
  FeeConfigurationV2_5 fees;
  bool exists;
  bool enabled;
  uint24 index;
  string name;
  uint256 totalMarkets;
}

struct HooksInstanceDataV2_5 {
  address hooksAddress;
  address borrower;
  string name;
  HooksInstanceKindV2_5 kind;
  HooksTemplateDataV2_5 hooksTemplate;
  MarketParameterConstraintsV2_5 constraints;
  HooksDeploymentFlagsV2_5 deploymentFlags;
  RoleProviderDataV2_5[] pullProviders;
  RoleProviderDataV2_5[] pushProviders;
  uint256 totalMarkets;
}

struct HooksDataForBorrowerV2_5 {
  address borrower;
  bool isRegisteredBorrower;
  HooksTemplateDataV2_5[] hooksTemplates;
  HooksInstanceDataV2_5[] hooksInstances;
}

struct FactoryScopedHooksTemplateDataV2_5 {
  address hooksFactory;
  HooksTemplateDataV2_5 hooksTemplateData;
}

struct MarketHooksDataV2_5 {
  address hooksAddress;
  HooksConfigDataV2_5 flags;
  HooksInstanceKindV2_5 kind;
  bool transferRequiresAccess;
  bool depositRequiresAccess;
  uint128 minimumDeposit;
  bool transfersDisabled;
  bool withdrawalRequiresAccess;
  uint32 fixedTermEndTime;
  bool allowClosureBeforeTerm;
  bool allowTermReduction;
  uint32 firstWithdrawalWindowStart;
  uint32 periodDuration;
  uint32 withdrawalWindowDuration;
  bool periodicTermClosed;
}

struct LenderAccountDataV2_5 {
  address lender;
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
  bool isBlockedFromDeposits;
  RoleProviderDataV2_5 lastProvider;
  bool canRefresh;
  uint32 lastApprovalTimestamp;
  bool isKnownLender;
}

struct MarketDataBaseV2_5 {
  TokenMetadataV2_5 marketToken;
  TokenMetadataV2_5 underlyingToken;
  address hooksFactory;
  address borrower;
  MarketHooksDataV2_5 hooksConfig;
  uint256 withdrawalBatchDuration;
  address feeRecipient;
  uint256 delinquencyFeeBips;
  uint256 delinquencyGracePeriod;
  HooksInstanceDataV2_5 hooks;
  bool temporaryReserveRatio;
  uint256 originalAnnualInterestBips;
  uint256 originalReserveRatioBips;
  uint256 temporaryReserveRatioExpiry;
  bool isClosed;
  uint256 protocolFeeBips;
  uint256 reserveRatioBips;
  uint256 annualInterestBips;
  uint256 scaleFactor;
  uint256 totalSupply;
  uint256 maxTotalSupply;
  uint256 scaledTotalSupply;
  uint256 totalAssets;
  uint256 lastAccruedProtocolFees;
  uint256 normalizedUnclaimedWithdrawals;
  uint256 scaledPendingWithdrawals;
  uint256 pendingWithdrawalExpiry;
  bool isDelinquent;
  uint256 timeDelinquent;
  uint256 lastInterestAccruedTimestamp;
  uint32[] unpaidWithdrawalBatchExpiries;
  uint256 coverageLiquidity;
}

struct OptionalUintDataV2_5 {
  bool isPresent;
  uint256 value;
}

struct MarketDataV2_5 {
  MarketDataBaseV2_5 market;
  OptionalUintDataV2_5 commitmentFeeBips;
  OptionalUintDataV2_5 drawnAmount;
}

struct MarketDataWithLenderStatusV2_5 {
  MarketDataBaseV2_5 market;
  LenderAccountDataV2_5 lenderStatus;
}

struct MarketLiveDataV2_5 {
  address market;
  bool isClosed;
  uint256 protocolFeeBips;
  uint256 reserveRatioBips;
  uint256 annualInterestBips;
  uint256 scaleFactor;
  uint256 totalSupply;
  uint256 maxTotalSupply;
  uint256 scaledTotalSupply;
  uint256 totalAssets;
  uint256 lastAccruedProtocolFees;
  uint256 normalizedUnclaimedWithdrawals;
  uint256 scaledPendingWithdrawals;
  uint256 pendingWithdrawalExpiry;
  bool isDelinquent;
  uint256 timeDelinquent;
  uint256 lastInterestAccruedTimestamp;
  uint256 coverageLiquidity;
  OptionalUintDataV2_5 commitmentFeeBips;
  OptionalUintDataV2_5 drawnAmount;
}

struct MarketLiveDataWithLenderStatusV2_5 {
  MarketLiveDataV2_5 market;
  LenderAccountDataV2_5 lenderStatus;
}

struct WithdrawalBatchDataV2_5 {
  uint32 expiry;
  BatchStatusV2_5 status;
  uint256 scaledTotalAmount;
  uint256 scaledAmountBurned;
  uint256 normalizedAmountPaid;
  uint256 normalizedTotalAmount;
}

struct WithdrawalBatchLenderStatusV2_5 {
  address lender;
  uint256 scaledAmount;
  uint256 normalizedAmountWithdrawn;
  uint256 normalizedAmountOwed;
  uint256 availableWithdrawalAmount;
}

struct WithdrawalBatchDataWithLenderStatusV2_5 {
  WithdrawalBatchDataV2_5 batch;
  WithdrawalBatchLenderStatusV2_5 lenderStatus;
}

struct LenderAccountQueryV2_5 {
  address lender;
  address market;
  uint32[] withdrawalBatchExpiries;
}

struct LenderAccountQueryResultV2_5 {
  MarketDataBaseV2_5 market;
  LenderAccountDataV2_5 lenderStatus;
  WithdrawalBatchDataWithLenderStatusV2_5[] withdrawalBatches;
}

interface MarketLensV2_5 {
  function archController() external view returns (address);

  function hooksFactory() external view returns (address);

  function coreHelper() external view returns (address);

  function aggregationHelper() external view returns (address);

  function liveHelper() external view returns (address);

  function getHooksDataForBorrower(
    address borrower
  ) external view returns (HooksDataForBorrowerV2_5 memory data);

  function getHooksDataForBorrower(
    address hooksFactoryAddress,
    address borrower
  ) external view returns (HooksDataForBorrowerV2_5 memory data);

  function getAggregatedHooksDataForBorrower(
    address borrower
  ) external view returns (HooksDataForBorrowerV2_5 memory data);

  function getHooksInstancesForBorrower(
    address borrower
  ) external view returns (HooksInstanceDataV2_5[] memory arr);

  function getHooksInstancesForBorrower(
    address hooksFactoryAddress,
    address borrower
  ) external view returns (HooksInstanceDataV2_5[] memory arr);

  function getAggregatedHooksInstancesForBorrower(
    address borrower
  ) external view returns (HooksInstanceDataV2_5[] memory arr);

  function getHooksTemplateForBorrower(
    address borrower,
    address hooksTemplate
  ) external view returns (HooksTemplateDataV2_5 memory data);

  function getHooksTemplateForBorrower(
    address hooksFactoryAddress,
    address borrower,
    address hooksTemplate
  ) external view returns (HooksTemplateDataV2_5 memory data);

  function getHooksTemplatesForBorrower(
    address borrower,
    address[] calldata hooksTemplates
  ) external view returns (HooksTemplateDataV2_5[] memory data);

  function getHooksTemplatesForBorrower(
    address hooksFactoryAddress,
    address borrower,
    address[] calldata hooksTemplates
  ) external view returns (HooksTemplateDataV2_5[] memory data);

  function getAllHooksTemplatesForBorrower(
    address borrower
  ) external view returns (HooksTemplateDataV2_5[] memory data);

  function getAllHooksTemplatesForBorrower(
    address hooksFactoryAddress,
    address borrower
  ) external view returns (HooksTemplateDataV2_5[] memory data);

  function getAggregatedAllHooksTemplatesForBorrower(
    address borrower
  ) external view returns (HooksTemplateDataV2_5[] memory data);

  function getAggregatedHooksTemplatesForBorrowerWithFactory(
    address borrower
  ) external view returns (FactoryScopedHooksTemplateDataV2_5[] memory data);

  function getTokenInfo(address token) external view returns (TokenMetadataV2_5 memory info);

  function getTokensInfo(
    address[] calldata tokens
  ) external view returns (TokenMetadataV2_5[] memory info);

  function getMarketsForHooksTemplateCount(address hooksTemplate) external view returns (uint256);

  function getMarketsForHooksTemplateCount(
    address hooksFactoryAddress,
    address hooksTemplate
  ) external view returns (uint256);

  function getAggregatedMarketsForHooksTemplateCount(
    address hooksTemplate
  ) external view returns (uint256);

  function getMarketData(address market) external view returns (MarketDataBaseV2_5 memory data);

  function getMarketsData(
    address[] calldata markets
  ) external view returns (MarketDataBaseV2_5[] memory data);

  function getMarketDataV2(address market) external view returns (MarketDataV2_5 memory data);

  function getMarketsDataV2(
    address[] calldata markets
  ) external view returns (MarketDataV2_5[] memory data);

  function getPaginatedMarketsDataForHooksTemplate(
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataBaseV2_5[] memory data);

  function getPaginatedMarketsDataForHooksTemplate(
    address hooksFactoryAddress,
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataBaseV2_5[] memory data);

  function getPaginatedMarketsDataV2ForHooksTemplate(
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataV2_5[] memory data);

  function getPaginatedMarketsDataV2ForHooksTemplate(
    address hooksFactoryAddress,
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataV2_5[] memory data);

  function getAllMarketsDataForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataBaseV2_5[] memory data);

  function getAllMarketsDataForHooksTemplate(
    address hooksFactoryAddress,
    address hooksTemplate
  ) external view returns (MarketDataBaseV2_5[] memory data);

  function getAllMarketsDataV2ForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataV2_5[] memory data);

  function getAllMarketsDataV2ForHooksTemplate(
    address hooksFactoryAddress,
    address hooksTemplate
  ) external view returns (MarketDataV2_5[] memory data);

  function getAggregatedAllMarketsDataForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataBaseV2_5[] memory data);

  function getAggregatedAllMarketsDataV2ForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataV2_5[] memory data);

  function getMarketsLiveDataV2(
    address[] calldata markets
  ) external view returns (MarketLiveDataV2_5[] memory data);

  function getMarketsLiveDataWithLenderStatusV2(
    address lender,
    address[] calldata markets
  ) external view returns (MarketLiveDataWithLenderStatusV2_5[] memory data);

  function getMarketDataWithLenderStatus(
    address lender,
    address market
  ) external view returns (MarketDataWithLenderStatusV2_5 memory data);

  function getMarketsDataWithLenderStatus(
    address lender,
    address[] calldata markets
  ) external view returns (MarketDataWithLenderStatusV2_5[] memory data);

  function getLenderAccountData(
    address lender,
    address market
  ) external view returns (LenderAccountDataV2_5 memory data);

  function getLenderAccountData(
    address lender,
    address[] calldata markets
  ) external view returns (LenderAccountDataV2_5[] memory arr);

  function getLenderAccountsData(
    address marketAddress,
    address[] calldata lenders
  ) external view returns (LenderAccountDataV2_5[] memory data);

  function queryLenderAccount(
    LenderAccountQueryV2_5 calldata query
  ) external view returns (LenderAccountQueryResultV2_5 memory result);

  function queryLenderAccounts(
    LenderAccountQueryV2_5[] calldata queries
  ) external view returns (LenderAccountQueryResultV2_5[] memory result);

  function getWithdrawalBatchData(
    address market,
    uint32 expiry
  ) external view returns (WithdrawalBatchDataV2_5 memory data);

  function getWithdrawalBatchesData(
    address market,
    uint32[] calldata expiries
  ) external view returns (WithdrawalBatchDataV2_5[] memory data);

  function getWithdrawalBatchesDataWithLenderStatus(
    address market,
    uint32[] calldata expiries,
    address lender
  ) external view returns (WithdrawalBatchDataWithLenderStatusV2_5[] memory statuses);

  function getWithdrawalBatchDataWithLenderStatus(
    address market,
    uint32 expiry,
    address lender
  ) external view returns (WithdrawalBatchDataWithLenderStatusV2_5 memory status);

  function getWithdrawalBatchDataWithLendersStatus(
    address market,
    uint32 expiry,
    address[] calldata lenders
  ) external view returns (WithdrawalBatchDataV2_5 memory batch, WithdrawalBatchLenderStatusV2_5[] memory statuses);
}
