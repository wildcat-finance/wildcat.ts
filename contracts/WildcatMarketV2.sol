// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WithdrawalStructs.sol";

struct MarketStateV2 {
  bool isClosed;
  uint128 maxTotalSupply;
  uint128 accruedProtocolFees;
  uint128 normalizedUnclaimedWithdrawals;
  uint104 scaledTotalSupply;
  uint104 scaledPendingWithdrawals;
  uint32 pendingWithdrawalExpiry;
  bool isDelinquent;
  uint32 timeDelinquent;
  uint16 protocolFeeBips;
  uint16 annualInterestBips;
  uint16 reserveRatioBips;
  uint112 scaleFactor;
  uint32 lastInterestAccruedTimestamp;
}

interface WildcatMarketV2 {
  error AccountBlocked();

  error AnnualInterestBipsTooHigh();

  error AprChangeOnClosedMarket();

  error AprReductionNotReduction();

  error BadLaunchCode();

  error BadRescueAsset();

  error BorrowAmountTooHigh();

  error BorrowFromClosedMarket();

  error BorrowWhileSanctioned();

  error BuyBackOnClosedMarket();

  error BuyBackOnDelinquentMarket();

  error CapacityChangeOnClosedMarket();

  error CloseMarketWithUnpaidWithdrawals();

  error DepositToClosedMarket();

  error InsufficientReservesForFeeWithdrawal();

  error InsufficientReservesForNewLiquidityRatio();

  error InsufficientReservesForOldLiquidityRatio();

  error InvalidArrayLength();

  error MarketAlreadyClosed();

  error MaxSupplyExceeded();

  error NoReentrantCalls();

  error NotApprovedBorrower();

  error NotApprovedLender();

  error NotFactory();

  error NullBurnAmount();

  error NullBuyBackAmount();

  error NullFeeAmount();

  error NullMintAmount();

  error NullRepayAmount();

  error NullTransferAmount();

  error NullWithdrawalAmount();

  error ProtocolFeeChangeOnClosedMarket();

  error ProtocolFeeTooHigh();

  error RepayToClosedMarket();

  error ReserveRatioBipsTooHigh();

  error SphereXOperatorRequired();

  error WithdrawalBatchNotExpired();

  event AccountSanctioned(address indexed account);

  event AnnualInterestBipsUpdated(uint256 annualInterestBipsUpdated);

  event Approval(address indexed owner, address indexed spender, uint256 value);

  event Borrow(uint256 assetAmount);

  event ChangedSpherexEngineAddress(address oldEngineAddress, address newEngineAddress);

  event ChangedSpherexOperator(address oldSphereXAdmin, address newSphereXAdmin);

  event DebtRepaid(address indexed from, uint256 assetAmount);

  event Deposit(address indexed account, uint256 assetAmount, uint256 scaledAmount);

  event FeesCollected(uint256 assets);

  event ForceBuyBack(address indexed lender, uint256 scaledAmount, uint256 normalizedAmount);

  event InterestAndFeesAccrued(
    uint256 fromTimestamp,
    uint256 toTimestamp,
    uint256 scaleFactor,
    uint256 baseInterestRay,
    uint256 delinquencyFeeRay,
    uint256 protocolFees
  );

  event MarketClosed(uint256 timestamp);

  event MaxTotalSupplyUpdated(uint256 assets);

  event ProtocolFeeBipsUpdated(uint256 protocolFeeBips);

  event ReserveRatioBipsUpdated(uint256 reserveRatioBipsUpdated);

  event SanctionedAccountAssetsQueuedForWithdrawal(
    address indexed account,
    uint256 expiry,
    uint256 scaledAmount,
    uint256 normalizedAmount
  );

  event SanctionedAccountAssetsSentToEscrow(
    address indexed account,
    address escrow,
    uint256 amount
  );

  event SanctionedAccountWithdrawalSentToEscrow(
    address indexed account,
    address escrow,
    uint32 expiry,
    uint256 amount
  );

  event StateUpdated(uint256 scaleFactor, bool isDelinquent);

  event Transfer(address indexed from, address indexed to, uint256 value);

  event WithdrawalBatchClosed(uint256 indexed expiry);

  event WithdrawalBatchCreated(uint256 indexed expiry);

  event WithdrawalBatchExpired(
    uint256 indexed expiry,
    uint256 scaledTotalAmount,
    uint256 scaledAmountBurned,
    uint256 normalizedAmountPaid
  );

  event WithdrawalBatchPayment(
    uint256 indexed expiry,
    uint256 scaledAmountBurned,
    uint256 normalizedAmountPaid
  );

  event WithdrawalExecuted(
    uint256 indexed expiry,
    address indexed account,
    uint256 normalizedAmount
  );

  event WithdrawalQueued(
    uint256 indexed expiry,
    address indexed account,
    uint256 scaledAmount,
    uint256 normalizedAmount
  );

  function accruedProtocolFees() external view returns (uint256 param0);

  function annualInterestBips() external view returns (uint256 param0);

  function approve(address spender, uint256 amount) external returns (bool param0);

  function archController() external view returns (address param0);

  function balanceOf(address account) external view returns (uint256 param0);

  function borrow(uint256 amount) external;

  function borrowableAssets() external view returns (uint256 param0);

  function changeSphereXEngine(address newSphereXEngine) external;

  function closeMarket() external;

  function collectFees() external;

  function coverageLiquidity() external view returns (uint256 param0);

  function currentState() external view returns (MarketStateV2 memory state);

  function deposit(uint256 amount) external;

  function depositUpTo(uint256 amount) external returns (uint256 param0);

  function executePendingAnnualInterestBipsReduction() external;

  function executeWithdrawal(
    address accountAddress,
    uint32 expiry
  ) external returns (uint256 param0);

  function executeWithdrawals(
    address[] calldata accountAddresses,
    uint32[] calldata expiries
  ) external returns (uint256[] memory amounts);

  function forceBuyBack(address lender, uint256 normalizedAmount) external;

  function getAccountWithdrawalStatus(
    address accountAddress,
    uint32 expiry
  ) external view returns (AccountWithdrawalStatus memory status);

  function getAvailableWithdrawalAmount(
    address accountAddress,
    uint32 expiry
  ) external view returns (uint256 param0);

  function getUnpaidBatchExpiries() external view returns (uint32[] memory param0);

  function getWithdrawalBatch(uint32 expiry) external view returns (WithdrawalBatch memory batch);

  function isClosed() external view returns (bool param0);

  function maximumDeposit() external view returns (uint256 param0);

  function maxTotalSupply() external view returns (uint256 param0);

  function name() external view returns (string memory param0);

  function nukeFromOrbit(address accountAddress) external;

  function previousState() external view returns (MarketStateV2 memory param0);

  function queueFullWithdrawal() external returns (uint32 expiry);

  function queueWithdrawal(uint256 amount) external returns (uint32 expiry);

  function repay(uint256 amount) external;

  function repayAndProcessUnpaidWithdrawalBatches(uint256 repayAmount, uint256 maxBatches) external;

  function rescueTokens(address token) external;

  function reserveRatioBips() external view returns (uint256 param0);

  function scaledBalanceOf(address account) external view returns (uint256 param0);

  function scaledTotalSupply() external view returns (uint256 param0);

  function scaleFactor() external view returns (uint256 param0);

  function setAnnualInterestAndReserveRatioBips(
    uint16 _annualInterestBips,
    uint16 _reserveRatioBips
  ) external;

  function setMaxTotalSupply(uint256 _maxTotalSupply) external;

  function setProtocolFeeBips(uint16 _protocolFeeBips) external;

  function sphereXEngine() external view returns (address param0);

  function sphereXOperator() external view returns (address param0);

  function symbol() external view returns (string memory param0);

  function totalAssets() external view returns (uint256 param0);

  function totalDebts() external view returns (uint256 param0);

  function totalSupply() external view returns (uint256 param0);

  function transfer(address to, uint256 amount) external returns (bool param0);

  function transferFrom(address from, address to, uint256 amount) external returns (bool param0);

  function updateState() external;

  function version() external pure returns (string memory param0);

  function withdrawableProtocolFees() external view returns (uint128 param0);
}
