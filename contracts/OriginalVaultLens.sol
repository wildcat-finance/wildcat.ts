// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

struct AccountVaultInfo {
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
}

struct ControlStatus {
  bool temporaryLiquidityCoverage;
  uint256 originalLiquidityCoverageRatio;
  uint256 temporaryLiquidityCoverageExpiry;
}

struct OriginalTokenMetadata {
  address token;
  string name;
  string symbol;
  uint256 decimals;
}

struct OriginalVaultData {
  OriginalTokenMetadata vaultToken;
  OriginalTokenMetadata underlyingToken;
  address borrower;
  address controller;
  address feeRecipient;
  uint256 interestFeeBips;
  uint256 penaltyFeeBips;
  uint256 gracePeriod;
  uint256 annualInterestBips;
  uint256 liquidityCoverageRatio;
  bool temporaryLiquidityCoverage;
  uint256 originalLiquidityCoverageRatio;
  uint256 temporaryLiquidityCoverageExpiry;
  uint256 borrowableAssets;
  uint256 maxTotalSupply;
  uint256 scaledTotalSupply;
  uint256 totalSupply;
  uint256 totalAssets;
  uint256 coverageLiquidity;
  uint256 scaleFactor;
  uint256 lastAccruedProtocolFees;
  bool isDelinquent;
  uint256 timeDelinquent;
  uint256 lastInterestAccruedTimestamp;
}

interface OriginalVaultLens {
  function getAccountVaultInfo (address vault, address account) external view returns (AccountVaultInfo memory info);

  function getControlStatus (address vault) external view returns (ControlStatus memory status);

  function getTokenInfo (address token) external view returns (OriginalTokenMetadata memory info);

  function getVaultData (address vault) external view returns (OriginalVaultData memory data);

  function getVaultsMetadata (address[] calldata vaults) external view returns (OriginalVaultData[] memory data);
}