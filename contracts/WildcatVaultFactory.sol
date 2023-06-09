// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

struct VaultParameters {
  address asset;
  string namePrefix;
  string symbolPrefix;
  address borrower;
  address controller;
  uint256 maxTotalSupply;
  uint256 annualInterestBips;
  uint256 penaltyFeeBips;
  uint256 gracePeriod;
  uint256 liquidityCoverageRatio;
  uint256 interestFeeBips;
  address feeRecipient;
}

interface WildcatVaultFactory {
  event VaultDeployed (address,address,address);

  function VaultInitCodeHash () external view returns (bytes32);

  function computeVaultAddress (address controller, address deployer, address asset) external view returns (address);

  function deployVault (VaultParameters calldata vaultParameters) external returns (address vault);

  function getVaultParameters () external view returns (VaultParameters memory);
}