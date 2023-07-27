// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

struct VaultState {
  uint128 maxTotalSupply;
  uint104 scaledTotalSupply;
  bool isDelinquent;
  uint16 annualInterestBips;
  uint16 liquidityCoverageRatio;
  uint32 timeDelinquent;
  uint112 scaleFactor;
  uint32 lastInterestAccruedTimestamp;
}

interface WildcatVaultToken {
  error BorrowAmountTooHigh();

  error FeeSetWithoutRecipient();

  error InsufficientCoverageForFeeWithdrawal();

  error InsufficientCoverageForNewLiquidityRatio();

  error InterestFeeTooHigh();

  error InterestRateTooHigh();

  error LiquidityCoverageRatioTooHigh();

  error MaxSupplyExceeded();

  error NewMaxSupplyTooLow();

  error NoReentrantCalls();

  error NotBorrower();

  error NotController();

  error NullRepayAmount();

  error PenaltyFeeTooHigh();

  error UnknownNameQueryError();

  error UnknownSymbolQueryError();

  event Approval(address, address, uint256);

  event Borrow(uint256);

  event DebtRepaid(uint256);

  event Deposit(address, uint256, uint256);

  event FeesCollected(uint256);

  event MaxSupplyUpdated(uint256);

  event Transfer(address, address, uint256);

  event VaultClosed(uint256);

  event Withdrawal(address, uint256, uint256);

  function accruedProtocolFees() external view returns (uint256 _accruedProtocolFees);

  function allowance(address, address) external view returns (uint256);

  function annualInterestBips() external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);

  function asset() external view returns (address);

  function balanceOf(address account) external view returns (uint256);

  function borrow(uint256 amount) external;

  function borrowableAssets() external view returns (uint256);

  function borrower() external view returns (address);

  function closeVault() external;

  function collectFees() external;

  function controller() external view returns (address);

  function coverageLiquidity() external view returns (uint256);

  function currentState() external view returns (VaultState memory);

  function decimals() external view returns (uint8);

  function delinquentDebt() external view returns (uint256);

  function deposit(uint256 amount, address to) external;

  function depositUpTo(uint256 amount, address to) external returns (uint256);

  function feeRecipient() external view returns (address);

  function gracePeriod() external view returns (uint256);

  function interestFeeBips() external view returns (uint256);

  function lastAccruedProtocolFees() external view returns (uint256);

  function liquidityCoverageRatio() external view returns (uint256);

  function maxTotalSupply() external view returns (uint256);

  function maximumDeposit() external view returns (uint256);

  function name() external view returns (string memory);

  function outstandingDebt() external view returns (uint256);

  function penaltyFeeBips() external view returns (uint256);

  function previousState() external view returns (VaultState memory);

  function repayDelinquentDebt() external;

  function repayOutstandingDebt() external;

  function repay(uint256) external;

  function scaleFactor() external view returns (uint256);

  function scaledBalanceOf(address) external view returns (uint256);

  function setAnnualInterestBips(uint256 _annualInterestBips) external;

  function setLiquidityCoverageRatio(uint256 _liquidityCoverageRatio) external;

  function setMaxTotalSupply(uint256 _maxTotalSupply) external;

  function symbol() external view returns (string memory);

  function totalAssets() external view returns (uint256);

  function totalDebt() external view returns (uint256);

  function totalSupply() external view returns (uint256);

  function transfer(address to, uint256 amount) external returns (bool);

  function transferFrom(address from, address to, uint256 amount) external returns (bool);

  function withdraw(uint256 amount, address to) external;
}
