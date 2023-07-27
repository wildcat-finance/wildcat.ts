// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

struct AccountVaultInfo {
  uint256 scaledBalance;
  uint256 normalizedBalance;
  uint256 underlyingBalance;
  uint256 underlyingApproval;
}

struct VaultData {
  TokenMetadata vaultToken;
  TokenMetadata underlyingToken;
  address borrower;
  address controller;
  address feeRecipient;
  uint256 interestFeeBips;
  uint256 penaltyFeeBips;
  uint256 gracePeriod;
  uint256 liquidityCoverageRatio;
  bool temporaryLiquidityCoverage;
  uint256 originalLiquidityCoverageRatio;
  uint256 temporaryLiquidityCoverageExpiry;
  uint256 annualInterestBips;
  uint256 borrowableAssets;
  uint256 totalSupply;
  uint256 maxTotalSupply;
  uint256 scaledTotalSupply;
  uint256 totalAssets;
  uint256 coverageLiquidity;
  uint256 scaleFactor;
  uint256 lastAccruedProtocolFees;
  bool isDelinquent;
  uint256 timeDelinquent;
  uint256 lastInterestAccruedTimestamp;
}

struct TokenMetadata {
  address token;
  string name;
  string symbol;
  uint256 decimals;
  bool isMock;
}

struct VaultDataWithAccount {
  VaultData vault;
  AccountVaultInfo account;
}

struct ControlStatus {
  bool temporaryLiquidityCoverage;
  uint256 originalLiquidityCoverageRatio;
  uint256 temporaryLiquidityCoverageExpiry;
}

interface VaultLens {
  function factory () external view returns (address);

  function getAccountVaultInfo (address vault, address account) external view returns (AccountVaultInfo memory info);

  function getAccountVaultsInfo (address account, address[] calldata vaults) external view returns (AccountVaultInfo[] memory info);

  function getAllVaultsData () external view returns (VaultData[] memory data);

  function getAllVaultsDataWithAccount (address account) external view returns (VaultDataWithAccount[] memory data);

  function getControlStatus (address vault) external view returns (ControlStatus memory status);

  function getPaginatedVaultsData (uint256 start, uint256 length) external view returns (VaultData[] memory data);

  function getPaginatedVaultsDataWithAccount (address account, uint256 start, uint256 length) external view returns (VaultDataWithAccount[] memory data);

  function getTokenInfo (address token) external view returns (TokenMetadata memory info);

  function getTokensInfo (address[] calldata tokens) external view returns (TokenMetadata[] memory info);

  function getVaultData (address vault) external view returns (VaultData memory data);

  function getVaultDataWithAccount (address account, address vault) external view returns (VaultDataWithAccount memory data);

  function getVaultsCount () external view returns (uint256);

  function getVaultsData (address[] calldata vaults) external view returns (VaultData[] memory data);

  function getVaultsDataWithAccount (address account, address[] calldata vaults) external view returns (VaultDataWithAccount[] memory data);
}