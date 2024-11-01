// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { BatchStatus, MarketParameterConstraints, TokenMetadata, WithdrawalBatchData, WithdrawalBatchLenderStatus } from "./MarketLensStructs.sol";

enum HooksInstanceKind {
  Unknown,
  AccessControl,
  FixedTermLoan
}

struct FeeConfigurationV2 {
  address feeRecipient;
  uint16 protocolFeeBips;
  TokenMetadata originationFeeToken;
  uint256 originationFeeAmount;
  uint256 borrowerOriginationFeeBalance;
  uint256 borrowerOriginationFeeApproval;
}

struct MarketDataV2 {
  TokenMetadata marketToken;
  TokenMetadata underlyingToken;
  address hooksFactory;
  address borrower;
  MarketHooksData hooksConfig;
  uint256 withdrawalBatchDuration;
  address feeRecipient;
  uint256 delinquencyFeeBips;
  uint256 delinquencyGracePeriod;
  HooksInstanceData hooks;
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

struct MarketHooksData {
  address hooksAddress;
  HooksConfigData flags;
  HooksInstanceKind kind;
  bool transferRequiresAccess;
  bool depositRequiresAccess;
  uint128 minimumDeposit;
  bool transfersDisabled;
  bool allowForceBuyBacks;
  bool withdrawalRequiresAccess;
  uint32 fixedTermEndTime;
  bool allowClosureBeforeTerm;
  bool allowTermReduction;
}

struct HooksConfigData {
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

struct HooksDataForBorrower {
  address borrower;
  bool isRegisteredBorrower;
  HooksTemplateData[] hooksTemplates;
  HooksInstanceData[] hooksInstances;
}

struct HooksInstanceData {
  address hooksAddress;
  address borrower;
  HooksInstanceKind kind;
  address hooksTemplate;
  string hooksTemplateName;
  MarketParameterConstraints constraints;
  HooksDeploymentFlags deploymentFlags;
  RoleProviderData[] pullProviders;
  RoleProviderData[] pushProviders;
  uint256 totalMarkets;
}

struct HooksTemplateData {
  address hooksTemplate;
  FeeConfigurationV2 fees;
  bool exists;
  bool enabled;
  uint24 index;
  string name;
  uint256 totalMarkets;
}

struct HooksDeploymentFlags {
  HooksConfigData optional;
  HooksConfigData required;
}

struct RoleProviderData {
  uint32 timeToLive;
  address providerAddress;
  uint24 pullProviderIndex;
  uint24 pushProviderIndex;
}

struct LenderAccountData {
  address lender;
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
  bool isBlockedFromDeposits;
  RoleProviderData lastProvider;
  bool canRefresh;
  uint32 lastApprovalTimestamp;
  bool isKnownLender;
}

struct MarketDataWithLenderStatusV2 {
  MarketDataV2 market;
  LenderAccountData lenderStatus;
}

struct WithdrawalBatchDataWithLenderStatus {
  WithdrawalBatchData batch;
  WithdrawalBatchLenderStatus lenderStatus;
}

struct LenderAccountQuery {
  address lender;
  address market;
  uint32[] withdrawalBatchExpiries;
}

struct LenderAccountQueryResult {
  MarketDataV2 market;
  LenderAccountData lenderStatus;
  WithdrawalBatchDataWithLenderStatus[] withdrawalBatches;
}

interface MarketLensV2 {
  error NotV2Market();

  function archController() external view returns (address);

  function getAllHooksTemplatesForBorrower(
    address borrower
  ) external view returns (HooksTemplateData[] memory data);

  function getAllMarketsDataForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataV2[] memory data);

  function getHooksDataForBorrower(
    address borrower
  ) external view returns (HooksDataForBorrower memory data);

  function getHooksInstancesForBorrower(
    address borrower
  ) external view returns (HooksInstanceData[] memory arr);

  function getHooksTemplateForBorrower(
    address borrower,
    address hooksTemplate
  ) external view returns (HooksTemplateData memory data);

  function getHooksTemplatesForBorrower(
    address borrower,
    address[] calldata hooksTemplates
  ) external view returns (HooksTemplateData[] memory data);

  function getLenderAccountData(
    address lender,
    address market
  ) external view returns (LenderAccountData memory data);

  function getLenderAccountData(
    address lender,
    address[] calldata markets
  ) external view returns (LenderAccountData[] memory arr);

  function getMarketData(address market) external view returns (MarketDataV2 memory data);

  function getMarketDataWithLenderStatus(
    address lender,
    address market
  ) external view returns (MarketDataWithLenderStatusV2 memory data);

  function getMarketsData(
    address[] calldata markets
  ) external view returns (MarketDataV2[] memory data);

  function getMarketsDataWithLenderStatus(
    address lender,
    address[] calldata markets
  ) external view returns (MarketDataWithLenderStatusV2[] memory data);

  function getMarketsForHooksTemplateCount(address hooksTemplate) external view returns (uint256);

  function getPaginatedMarketsDataForHooksTemplate(
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataV2[] memory data);

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
  ) external view returns (WithdrawalBatchDataWithLenderStatus memory status);

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
  ) external view returns (WithdrawalBatchDataWithLenderStatus[] memory statuses);

  function hooksFactory() external view returns (address);

  function queryLenderAccount(
    LenderAccountQuery calldata query
  ) external view returns (LenderAccountQueryResult memory result);

  function queryLenderAccounts(
    LenderAccountQuery[] calldata queries
  ) external view returns (LenderAccountQueryResult[] memory result);
}
