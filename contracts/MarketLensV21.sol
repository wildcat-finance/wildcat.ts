// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { BatchStatus, MarketParameterConstraints, TokenMetadata, WithdrawalBatchData, WithdrawalBatchLenderStatus } from "./MarketLensStructs.sol";

enum HooksInstanceKindV21 {
  Unknown,
  OpenTerm,
  FixedTermLoan,
  PeriodicTerm
}

struct FeeConfigurationV21 {
  address feeRecipient;
  uint16 protocolFeeBips;
  TokenMetadata originationFeeToken;
  uint256 originationFeeAmount;
  uint256 borrowerOriginationFeeBalance;
  uint256 borrowerOriginationFeeApproval;
}

struct MarketDataV21 {
  TokenMetadata marketToken;
  TokenMetadata underlyingToken;
  address hooksFactory;
  address borrower;
  MarketHooksDataV21 hooksConfig;
  uint256 withdrawalBatchDuration;
  address feeRecipient;
  uint256 delinquencyFeeBips;
  uint256 delinquencyGracePeriod;
  HooksInstanceDataV21 hooks;
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

struct MarketHooksDataV21 {
  address hooksAddress;
  HooksConfigDataV21 flags;
  HooksInstanceKindV21 kind;
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

struct HooksConfigDataV21 {
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
}

struct HooksDataForBorrowerV21 {
  address borrower;
  bool isRegisteredBorrower;
  HooksTemplateDataV21[] hooksTemplates;
  HooksInstanceDataV21[] hooksInstances;
}

struct HooksInstanceDataV21 {
  address hooksAddress;
  address borrower;
  string name;
  HooksInstanceKindV21 kind;
  HooksTemplateDataV21 hooksTemplate;
  MarketParameterConstraints constraints;
  HooksDeploymentFlagsV21 deploymentFlags;
  RoleProviderDataV21[] pullProviders;
  RoleProviderDataV21[] pushProviders;
  uint256 totalMarkets;
}

struct HooksTemplateDataV21 {
  address hooksTemplate;
  FeeConfigurationV21 fees;
  bool exists;
  bool enabled;
  uint24 index;
  string name;
  uint256 totalMarkets;
}

struct HooksDeploymentFlagsV21 {
  HooksConfigDataV21 optional;
  HooksConfigDataV21 required;
}

struct RoleProviderDataV21 {
  uint32 timeToLive;
  address providerAddress;
  uint24 pullProviderIndex;
  uint24 pushProviderIndex;
}

struct LenderAccountDataV21 {
  address lender;
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
  bool isBlockedFromDeposits;
  RoleProviderDataV21 lastProvider;
  bool canRefresh;
  uint32 lastApprovalTimestamp;
  bool isKnownLender;
}

struct MarketDataWithLenderStatusV21 {
  MarketDataV21 market;
  LenderAccountDataV21 lenderStatus;
}

struct WithdrawalBatchDataWithLenderStatusV21 {
  WithdrawalBatchData batch;
  WithdrawalBatchLenderStatus lenderStatus;
}

struct LenderAccountQueryV21 {
  address lender;
  address market;
  uint32[] withdrawalBatchExpiries;
}

struct LenderAccountQueryResultV21 {
  MarketDataV21 market;
  LenderAccountDataV21 lenderStatus;
  WithdrawalBatchDataWithLenderStatusV21[] withdrawalBatches;
}

interface MarketLensV21 {
  error NotV2Market();

  function archController() external view returns (address);

  function getAllHooksTemplatesForBorrower(
    address borrower
  ) external view returns (HooksTemplateDataV21[] memory data);

  function getAllMarketsDataForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataV21[] memory data);

  function getHooksDataForBorrower(
    address borrower
  ) external view returns (HooksDataForBorrowerV21 memory data);

  function getHooksInstancesForBorrower(
    address borrower
  ) external view returns (HooksInstanceDataV21[] memory arr);

  function getHooksTemplateForBorrower(
    address borrower,
    address hooksTemplate
  ) external view returns (HooksTemplateDataV21 memory data);

  function getHooksTemplatesForBorrower(
    address borrower,
    address[] calldata hooksTemplates
  ) external view returns (HooksTemplateDataV21[] memory data);

  function getLenderAccountData(
    address lender,
    address market
  ) external view returns (LenderAccountDataV21 memory data);

  function getLenderAccountData(
    address lender,
    address[] calldata markets
  ) external view returns (LenderAccountDataV21[] memory arr);

  function getLenderAccountsData(
    address market,
    address[] calldata lenders
  ) external view returns (LenderAccountDataV21[] memory data);

  function getMarketData(address market) external view returns (MarketDataV21 memory data);

  function getMarketDataWithLenderStatus(
    address lender,
    address market
  ) external view returns (MarketDataWithLenderStatusV21 memory data);

  function getMarketsData(
    address[] calldata markets
  ) external view returns (MarketDataV21[] memory data);

  function getMarketsDataWithLenderStatus(
    address lender,
    address[] calldata markets
  ) external view returns (MarketDataWithLenderStatusV21[] memory data);

  function getMarketsForHooksTemplateCount(address hooksTemplate) external view returns (uint256);

  function getPaginatedMarketsDataForHooksTemplate(
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataV21[] memory data);

  function getTokenInfo(address token) external view returns (TokenMetadata memory info);

  function getTokensInfo(
    address[] calldata tokens
  ) external view returns (TokenMetadata[] memory info);

  function getWithdrawalBatchData(
    address market,
    uint32 expiry
  ) external view returns (WithdrawalBatchData memory data);

  function getWithdrawalBatchDataWithLenderStatus(
    address market,
    uint32 expiry,
    address lender
  ) external view returns (WithdrawalBatchDataWithLenderStatusV21 memory status);

  function getWithdrawalBatchDataWithLendersStatus(
    address market,
    uint32 expiry,
    address[] calldata lenders
  )
    external
    view
    returns (WithdrawalBatchData memory batch, WithdrawalBatchLenderStatus[] memory statuses);

  function getWithdrawalBatchesData(
    address market,
    uint32[] calldata expiries
  ) external view returns (WithdrawalBatchData[] memory data);

  function getWithdrawalBatchesDataWithLenderStatus(
    address market,
    uint32[] calldata expiries,
    address lender
  ) external view returns (WithdrawalBatchDataWithLenderStatusV21[] memory statuses);

  function queryLenderAccount(
    LenderAccountQueryV21 calldata query
  ) external view returns (LenderAccountQueryResultV21 memory result);

  function queryLenderAccounts(
    LenderAccountQueryV21[] calldata queries
  ) external view returns (LenderAccountQueryResultV21[] memory result);
}
