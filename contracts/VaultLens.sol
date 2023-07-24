// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./OriginalVaultLens.sol";

struct TokenMetadata {
  address token;
  string name;
  string symbol;
  uint256 decimals;
  bool isMock;
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

contract VaultLens {
  OriginalVaultLens internal constant lens =
    OriginalVaultLens(0xDdcBBC4510156441F88D23A6ab4c64eed1775C16);

  function getAccountVaultInfo(
    address vault,
    address account
  ) external view returns (AccountVaultInfo memory info) {
    return lens.getAccountVaultInfo(vault, account);
  }

  function getControlStatus(address vault) external view returns (ControlStatus memory status) {
    return lens.getControlStatus(vault);
  }

  function checkIsMock(address token) internal view returns (bool isMock) {
    assembly {
      mstore(0, 0x28ccaa29)
      let success := staticcall(gas(), token, 0x1c, 4, 0, 32)
      isMock := and(success, eq(mload(0), 1))
    }
  }

  function getTokenInfo(address token) external view returns (TokenMetadata memory info) {
    OriginalTokenMetadata memory originalInfo = lens.getTokenInfo(token);

    return convert(originalInfo);
  }

  function convert(
    OriginalTokenMetadata memory originalInfo
  ) internal view returns (TokenMetadata memory info) {
    info.token = originalInfo.token;
    info.name = originalInfo.name;
    info.symbol = originalInfo.symbol;
    info.decimals = originalInfo.decimals;
    info.isMock = checkIsMock(originalInfo.token);
  }

  function convert(
    OriginalVaultData memory originalInfo
  ) internal view returns (VaultData memory info) {
    return
      VaultData({
        vaultToken: convert(originalInfo.vaultToken),
        underlyingToken: convert(originalInfo.underlyingToken),
        borrower: originalInfo.borrower,
        controller: originalInfo.controller,
        feeRecipient: originalInfo.feeRecipient,
        interestFeeBips: originalInfo.interestFeeBips,
        penaltyFeeBips: originalInfo.penaltyFeeBips,
        gracePeriod: originalInfo.gracePeriod,
        annualInterestBips: originalInfo.annualInterestBips,
        liquidityCoverageRatio: originalInfo.liquidityCoverageRatio,
        temporaryLiquidityCoverage: originalInfo.temporaryLiquidityCoverage,
        originalLiquidityCoverageRatio: originalInfo.originalLiquidityCoverageRatio,
        temporaryLiquidityCoverageExpiry: originalInfo.temporaryLiquidityCoverageExpiry,
        borrowableAssets: originalInfo.borrowableAssets,
        maxTotalSupply: originalInfo.maxTotalSupply,
        scaledTotalSupply: originalInfo.scaledTotalSupply,
        totalSupply: originalInfo.totalSupply,
        totalAssets: originalInfo.totalAssets,
        coverageLiquidity: originalInfo.coverageLiquidity,
        scaleFactor: originalInfo.scaleFactor,
        lastAccruedProtocolFees: originalInfo.lastAccruedProtocolFees,
        isDelinquent: originalInfo.isDelinquent,
        timeDelinquent: originalInfo.timeDelinquent,
        lastInterestAccruedTimestamp: originalInfo.lastInterestAccruedTimestamp
      });
  }

  function getVaultData(address vault) external view returns (VaultData memory data) {
    OriginalVaultData memory originalInfo = lens.getVaultData(vault);
    return convert(originalInfo);
  }

  function getVaultsMetadata(
    address[] calldata vaults
  ) external view returns (VaultData[] memory data) {
    OriginalVaultData[] memory originalData = lens.getVaultsMetadata(vaults);
    data = new VaultData[](originalData.length);
    for (uint256 i = 0; i < originalData.length; i++) {
      data[i] = convert(originalData[i]);
    }
  }
}
