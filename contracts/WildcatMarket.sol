// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum AuthRole {
  Null,
  Blocked,
  WithdrawOnly,
  DepositAndWithdraw
}

struct MarketState {
  bool isClosed;
  uint128 maxTotalSupply;
  uint128 accruedProtocolFees;
  uint128 normalizedUnclaimedWithdrawals;
  uint104 scaledTotalSupply;
  uint104 scaledPendingWithdrawals;
  uint32 pendingWithdrawalExpiry;
  bool isDelinquent;
  uint32 timeDelinquent;
  uint16 annualInterestBips;
  uint16 reserveRatioBips;
  uint112 scaleFactor;
  uint32 lastInterestAccruedTimestamp;
}

struct AccountWithdrawalStatus {
  uint104 scaledAmount;
  uint128 normalizedAmountWithdrawn;
}

struct WithdrawalBatch {
  uint104 scaledTotalAmount;
  uint104 scaledAmountBurned;
  uint128 normalizedAmountPaid;
}

interface WildcatMarket {
  /// @notice Error thrown when deposit exceeds maxTotalSupply
  error MaxSupplyExceeded();

  /// @notice Error thrown when non-borrower tries accessing borrower-only actions
  error NotApprovedBorrower();

  /// @notice Error thrown when non-approved lender tries lending to the market
  error NotApprovedLender();

  /// @notice Error thrown when non-controller tries accessing controller-only actions
  error NotController();

  /// @notice Error thrown when non-sentinel tries to use nukeFromOrbit
  error BadLaunchCode();

  /// @notice Error thrown when new maxTotalSupply lower than totalSupply
  error NewMaxSupplyTooLow();

  /// @notice Error thrown when reserve ratio set higher than 100%
  error ReserveRatioBipsTooHigh();

  /// @notice Error thrown when interest rate set higher than 100%
  error InterestRateTooHigh();

  /// @notice Error thrown when interest fee set higher than 100%
  error InterestFeeTooHigh();

  /// @notice Error thrown when penalty fee set higher than 100%
  error PenaltyFeeTooHigh();

  /// @notice Error thrown when transfer target is blacklisted
  error AccountBlacklisted();

  error AccountNotBlocked();

  error NotReversedOrStunning();

  error UnknownNameQueryError();

  error UnknownSymbolQueryError();

  error BorrowAmountTooHigh();

  error FeeSetWithoutRecipient();

  error InsufficientReservesForFeeWithdrawal();

  error WithdrawalBatchNotExpired();

  error NullMintAmount();

  error NullBurnAmount();

  error NullFeeAmount();

  error NullTransferAmount();

  error NullWithdrawalAmount();

  error NullRepayAmount();

  error RepayToClosedMarket();

  error DepositToClosedMarket();

  error BorrowFromClosedMarket();

  error CloseMarketWithUnpaidWithdrawals();

  error CloseMarketInPenalizedDelinquency();

  /// @notice Error thrown when reserve ratio set to value
  ///         the market currently would not meet.
  error InsufficientReservesForNewLiquidityRatio();

  error InsufficientReservesForOldLiquidityRatio();

  event Transfer(address indexed from, address indexed to, uint256 value);

  event Approval(address indexed owner, address indexed spender, uint256 value);

  event MaxTotalSupplyUpdated(uint256 assets);

  event AnnualInterestBipsUpdated(uint256 annualInterestBipsUpdated);

  event ReserveRatioBipsUpdated(uint256 reserveRatioBipsUpdated);

  event SanctionedAccountAssetsSentToEscrow(
    address indexed account,
    address escrow,
    uint256 amount
  );

  event Deposit(address indexed account, uint256 assetAmount, uint256 scaledAmount);

  event Borrow(uint256 assetAmount);

  event DebtRepaid(address indexed from, uint256 assetAmount);

  event MarketClosed(uint256 timestamp);

  event FeesCollected(uint256 assets);

  event StateUpdated(uint256 scaleFactor, bool isDelinquent);

  event ScaleFactorUpdated(
    uint256 scaleFactor,
    uint256 baseInterestRay,
    uint256 delinquencyFeeRay,
    uint256 protocolFee
  );

  event AuthorizationStatusUpdated(address indexed account, AuthRole role);

  // =====================================================================//
  //                          Withdrawl Events                            //
  // =====================================================================//

  event WithdrawalBatchExpired(
    uint256 indexed expiry,
    uint256 scaledTotalAmount,
    uint256 scaledAmountBurned,
    uint256 normalizedAmountPaid
  );

  /**
   * @dev Emitted when a new withdrawal batch is created.
   */
  event WithdrawalBatchCreated(uint256 indexed expiry);

  /**
   * @dev Emitted when a withdrawal batch is paid off.
   */
  event WithdrawalBatchClosed(uint256 indexed expiry);

  event WithdrawalBatchPayment(
    uint256 indexed expiry,
    uint256 scaledAmountBurned,
    uint256 normalizedAmountPaid
  );

  event WithdrawalQueued(
    uint256 indexed expiry,
    address indexed account,
    uint256 scaledAmount,
    uint256 normalizedAmount
  );

  event WithdrawalExecuted(
    uint256 indexed expiry,
    address indexed account,
    uint256 normalizedAmount
  );

  event Withdrawal(address indexed account, uint256 assetAmount, uint256 scaledAmount);

  event SanctionedAccountWithdrawalSentToEscrow(
    address indexed account,
    address escrow,
    uint32 expiry,
    uint256 amount
  );

  function accruedProtocolFees() external view returns (uint256);

  function allowance(address, address) external view returns (uint256);

  function annualInterestBips() external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);

  function asset() external view returns (address);

  function balanceOf(address account) external view returns (uint256);

  function borrow(uint256 amount) external;

  function borrowableAssets() external view returns (uint256);

  function borrower() external view returns (address);

  function closeMarket() external;

  function collectFees() external;

  function controller() external view returns (address);

  function coverageLiquidity() external view returns (uint256);

  function currentState() external view returns (MarketState memory state);

  function decimals() external view returns (uint8);

  function delinquencyFeeBips() external view returns (uint256);

  function delinquencyGracePeriod() external view returns (uint256);

  function deposit(uint256 amount) external;

  function depositUpTo(uint256 amount) external returns (uint256);

  function effectiveBorrowerAPR() external view returns (uint256);

  function effectiveLenderAPR() external view returns (uint256);

  function executeWithdrawal(address accountAddress, uint32 expiry) external returns (uint256);

  function executeWithdrawals(
    address[] calldata accountAddresses,
    uint32[] calldata expiries
  ) external returns (uint256[] memory);

  function feeRecipient() external view returns (address);

  function getAccountRole(address account) external view returns (AuthRole);

  function getAccountWithdrawalStatus(
    address accountAddress,
    uint32 expiry
  ) external view returns (AccountWithdrawalStatus memory);

  function getAvailableWithdrawalAmount(
    address accountAddress,
    uint32 expiry
  ) external view returns (uint256);

  function getUnpaidBatchExpiries() external view returns (uint32[] memory);

  function getWithdrawalBatch(uint32 expiry) external view returns (WithdrawalBatch memory);

  function maxTotalSupply() external view returns (uint256);

  function maximumDeposit() external view returns (uint256);

  function name() external view returns (string memory);

  function nukeFromOrbit(address accountAddress) external;

  function previousState() external view returns (MarketState memory);

  function repayAndProcessUnpaidWithdrawalBatches(uint256 repayAmount, uint256 maxBatches) external;

  function protocolFeeBips() external view returns (uint256);

  function queueWithdrawal(uint256 amount) external;

  function reserveRatioBips() external view returns (uint256);

  function scaleFactor() external view returns (uint256);

  function scaledBalanceOf(address account) external view returns (uint256);

  function scaledTotalSupply() external view returns (uint256);

  function sentinel() external view returns (address);

  function setAnnualInterestBips(uint16 _annualInterestBips) external;

  function setMaxTotalSupply(uint256 _maxTotalSupply) external;

  function setReserveRatioBips(uint16 _reserveRatioBips) external;

  function stunningReversal(address accountAddress) external;

  function symbol() external view returns (string memory);

  function totalAssets() external view returns (uint256);

  function totalSupply() external view returns (uint256);

  function transfer(address to, uint256 amount) external returns (bool);

  function transferFrom(address from, address to, uint256 amount) external returns (bool);

  function updateAccountAuthorizations(address[] memory accounts, bool authorize) external;

  function updateState() external;

  function version() external view returns (string memory);

  function withdrawableProtocolFees() external view returns (uint128);

  function withdrawalBatchDuration() external view returns (uint256);

  function totalDebts() external view returns (uint256);

  function outstandingDebt() external view returns (uint256);

  function delinquentDebt() external view returns (uint256);

  function repayOutstandingDebt() external;

  function repayDelinquentDebt() external;

  function repay(uint256 amount) external;
}
