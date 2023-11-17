// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum AuthRole {
  Null,
  Blocked,
  WithdrawOnly,
  DepositAndWithdraw
}

enum BatchStatus {
  Pending,
  Unpaid,
  Complete
}

struct ControllerData {
  address borrower;
  address controller;
  address controllerFactory;
  bool isRegisteredBorrower;
  bool hasDeployedController;
  FeeConfiguration fees;
  MarketParameterConstraints constraints;
  MarketData[] markets;
  uint256 borrowerOriginationFeeBalance;
  uint256 borrowerOriginationFeeApproval;
}

struct FeeConfiguration {
  address feeRecipient;
  uint16 protocolFeeBips;
  TokenMetadata originationFeeToken;
  uint256 originationFeeAmount;
}

struct TokenMetadata {
  address token;
  string name;
  string symbol;
  uint256 decimals;
  bool isMock;
}

struct MarketParameterConstraints {
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

struct MarketData {
  TokenMetadata marketToken;
  TokenMetadata underlyingToken;
  address borrower;
  address controller;
  address feeRecipient;
  uint256 protocolFeeBips;
  uint256 delinquencyFeeBips;
  uint256 delinquencyGracePeriod;
  uint256 withdrawalBatchDuration;
  uint256 reserveRatioBips;
  uint256 annualInterestBips;
  bool temporaryReserveRatio;
  uint256 originalReserveRatioBips;
  uint256 temporaryReserveRatioExpiry;
  bool isClosed;
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
  uint256 borrowableAssets;
  uint256 delinquentDebt;
}

struct MarketDataWithLenderStatus {
  MarketData market;
  MarketLenderStatus lenderStatus;
}

struct MarketLenderStatus {
  address lender;
  bool isAuthorizedOnController;
  AuthRole role;
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
}

struct ArchControllerData {
  address archController;
  uint256 borrowersCount;
  address[] borrowers;
  uint256 controllerFactoriesCount;
  address[] controllerFactories;
  uint256 controllersCount;
  address[] controllers;
  uint256 marketsCount;
  address[] markets;
}

struct SliceParameters {
  uint256 start;
  uint256 end;
}

struct WithdrawalBatchData {
  uint32 expiry;
  BatchStatus status;
  uint256 scaledTotalAmount;
  uint256 scaledAmountBurned;
  uint256 normalizedAmountPaid;
  uint256 normalizedTotalAmount;
}

struct WithdrawalBatchDataWithLenderStatus {
  WithdrawalBatchData batch;
  WithdrawalBatchLenderStatus lenderStatus;
}

struct WithdrawalBatchLenderStatus {
  address lender;
  uint256 scaledAmount;
  uint256 normalizedAmountWithdrawn;
  uint256 normalizedAmountOwed;
  uint256 availableWithdrawalAmount;
}