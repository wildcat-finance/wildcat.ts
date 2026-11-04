// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ABI for the v2.1.0 lens deployed on Ink, before the force-buyback flag.

import { BatchStatus, MarketParameterConstraints, TokenMetadata, WithdrawalBatchData, WithdrawalBatchLenderStatus } from "./MarketLensStructs.sol";

enum HooksInstanceKindLegacy {
  Unknown,
  AccessControl,
  FixedTermLoan
}

struct FeeConfigurationLegacy {
  address feeRecipient;
  uint16 protocolFeeBips;
  TokenMetadata originationFeeToken;
  uint256 originationFeeAmount;
  uint256 borrowerOriginationFeeBalance;
  uint256 borrowerOriginationFeeApproval;
}

struct MarketDataLegacy {
  TokenMetadata marketToken;
  TokenMetadata underlyingToken;
  address hooksFactory;
  address borrower;
  MarketHooksDataLegacy hooksConfig;
  uint256 withdrawalBatchDuration;
  address feeRecipient;
  uint256 delinquencyFeeBips;
  uint256 delinquencyGracePeriod;
  HooksInstanceDataLegacy hooks;
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

struct MarketHooksDataLegacy {
  address hooksAddress;
  HooksConfigDataLegacy flags;
  HooksInstanceKindLegacy kind;
  bool transferRequiresAccess;
  bool depositRequiresAccess;
  uint128 minimumDeposit;
  bool transfersDisabled;
  bool withdrawalRequiresAccess;
  uint32 fixedTermEndTime;
  bool allowClosureBeforeTerm;
  bool allowTermReduction;
}

struct HooksConfigDataLegacy {
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

struct HooksDataForBorrowerLegacy {
  address borrower;
  bool isRegisteredBorrower;
  HooksTemplateDataLegacy[] hooksTemplates;
  HooksInstanceDataLegacy[] hooksInstances;
}

struct HooksInstanceDataLegacy {
  address hooksAddress;
  address borrower;
  string name;
  HooksInstanceKindLegacy kind;
  HooksTemplateDataLegacy hooksTemplate;
  MarketParameterConstraints constraints;
  HooksDeploymentFlagsLegacy deploymentFlags;
  RoleProviderDataLegacy[] pullProviders;
  RoleProviderDataLegacy[] pushProviders;
  uint256 totalMarkets;
}

struct HooksTemplateDataLegacy {
  address hooksTemplate;
  FeeConfigurationLegacy fees;
  bool exists;
  bool enabled;
  uint24 index;
  string name;
  uint256 totalMarkets;
}

struct HooksDeploymentFlagsLegacy {
  HooksConfigDataLegacy optional;
  HooksConfigDataLegacy required;
}

struct RoleProviderDataLegacy {
  uint32 timeToLive;
  address providerAddress;
  uint24 pullProviderIndex;
  uint24 pushProviderIndex;
}

struct LenderAccountDataLegacy {
  address lender;
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
  bool isBlockedFromDeposits;
  RoleProviderDataLegacy lastProvider;
  bool canRefresh;
  uint32 lastApprovalTimestamp;
  bool isKnownLender;
}

struct MarketDataWithLenderStatusLegacy {
  MarketDataLegacy market;
  LenderAccountDataLegacy lenderStatus;
}

struct WithdrawalBatchDataWithLenderStatusLegacy {
  WithdrawalBatchData batch;
  WithdrawalBatchLenderStatus lenderStatus;
}

struct LenderAccountQueryLegacy {
  address lender;
  address market;
  uint32[] withdrawalBatchExpiries;
}

struct LenderAccountQueryResultLegacy {
  MarketDataLegacy market;
  LenderAccountDataLegacy lenderStatus;
  WithdrawalBatchDataWithLenderStatusLegacy[] withdrawalBatches;
}

interface MarketLensLegacy {
  error NotV2Market();

  function archController() external view returns (address);

  function getAllHooksTemplatesForBorrower(
    address borrower
  ) external view returns (HooksTemplateDataLegacy[] memory data);

  function getAllMarketsDataForHooksTemplate(
    address hooksTemplate
  ) external view returns (MarketDataLegacy[] memory data);

  function getHooksDataForBorrower(
    address borrower
  ) external view returns (HooksDataForBorrowerLegacy memory data);

  function getHooksInstancesForBorrower(
    address borrower
  ) external view returns (HooksInstanceDataLegacy[] memory arr);

  function getHooksTemplateForBorrower(
    address borrower,
    address hooksTemplate
  ) external view returns (HooksTemplateDataLegacy memory data);

  function getHooksTemplatesForBorrower(
    address borrower,
    address[] calldata hooksTemplates
  ) external view returns (HooksTemplateDataLegacy[] memory data);

  function getLenderAccountData(
    address lender,
    address market
  ) external view returns (LenderAccountDataLegacy memory data);

  function getLenderAccountData(
    address lender,
    address[] calldata markets
  ) external view returns (LenderAccountDataLegacy[] memory arr);

  function getMarketData(address market) external view returns (MarketDataLegacy memory data);

  function getMarketDataWithLenderStatus(
    address lender,
    address market
  ) external view returns (MarketDataWithLenderStatusLegacy memory data);

  function getMarketsData(
    address[] calldata markets
  ) external view returns (MarketDataLegacy[] memory data);

  function getMarketsDataWithLenderStatus(
    address lender,
    address[] calldata markets
  ) external view returns (MarketDataWithLenderStatusLegacy[] memory data);

  function getMarketsForHooksTemplateCount(address hooksTemplate) external view returns (uint256);

  function getPaginatedMarketsDataForHooksTemplate(
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataLegacy[] memory data);

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
  ) external view returns (WithdrawalBatchDataWithLenderStatusLegacy memory status);

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
  ) external view returns (WithdrawalBatchDataWithLenderStatusLegacy[] memory statuses);

  function getLenderAccountsData(
    address marketAddress,
    address[] calldata lenders
  ) external view returns (LenderAccountDataLegacy[] memory data);

  function hooksFactory() external view returns (address);

  function queryLenderAccount(
    LenderAccountQueryLegacy calldata query
  ) external view returns (LenderAccountQueryResultLegacy memory result);

  function queryLenderAccounts(
    LenderAccountQueryLegacy[] calldata queries
  ) external view returns (LenderAccountQueryResultLegacy[] memory result);
}
