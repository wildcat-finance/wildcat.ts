// SPDX-License-Identifier: Apache-2.0 WITH LicenseRef-Commons-Clause-1.0
pragma solidity ^0.8.20;

interface Wildcat4626Wrapper {
  error ZeroAddress();
  error ZeroAssets();
  error ZeroShares();
  error CapExceeded();
  error SharesMismatch(uint256 expected, uint256 actual);
  error NotMarketOwner();
  error CannotSweepMarketAsset();
  error SanctionedAccount(address account);

  event Transfer(address indexed from, address indexed to, uint256 amount);
  event Approval(address indexed owner, address indexed spender, uint256 amount);
  event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
  event Withdraw(
    address indexed caller,
    address indexed receiver,
    address indexed owner,
    uint256 assets,
    uint256 shares
  );
  event TokensSwept(address indexed token, address indexed to, uint256 amount);

  function name() external view returns (string memory);

  function symbol() external view returns (string memory);

  function decimals() external view returns (uint8);

  function totalSupply() external view returns (uint256);

  function balanceOf(address account) external view returns (uint256);

  function allowance(address owner, address spender) external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  function market() external view returns (address);

  function asset() external view returns (address);

  function totalAssets() external view returns (uint256);

  function convertToShares(uint256 assets) external view returns (uint256);

  function convertToAssets(uint256 shares) external view returns (uint256);

  function maxDeposit(address receiver) external view returns (uint256);

  function previewDeposit(uint256 assets) external view returns (uint256);

  function maxMint(address receiver) external view returns (uint256);

  function previewMint(uint256 shares) external view returns (uint256);

  function maxWithdraw(address owner) external view returns (uint256);

  function previewWithdraw(uint256 assets) external view returns (uint256);

  function maxRedeem(address owner) external view returns (uint256);

  function previewRedeem(uint256 shares) external view returns (uint256);

  function assetsPerShareRay() external view returns (uint256);

  function sharesPerAssetRay() external view returns (uint256);

  function deposit(uint256 assets, address receiver) external returns (uint256 shares);

  function mint(uint256 shares, address receiver) external returns (uint256 assets);

  function withdraw(
    uint256 assets,
    address receiver,
    address owner
  ) external returns (uint256 shares);

  function redeem(
    uint256 shares,
    address receiver,
    address owner
  ) external returns (uint256 assets);

  function sweep(address token, address to) external returns (uint256 amount);
}
