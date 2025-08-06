struct Depositor {
  uint224 shares;
  uint32 lastFullLiquidationIndex;
}

interface SimpleMarketCollateral {
  function fullLiquidationIndex() external view returns (uint32);

  function sharesOf(address account) external view returns (uint256);

  function getDepositor(address account) external view returns (Depositor memory depositor);

  function totalShares() external view returns (uint224);

  function availableCollateral() external view returns (uint256);

  function factory() external view returns (address);

  function collateralAsset() external view returns (address);

  function market() external view returns (address);

  function marketBorrower() external view returns (address);

  function underlyingAsset() external view returns (address);

  function bebopSettlementContract() external view returns (address);

  function liquidationCooldown() external view returns (uint32);

  function maxRepaymentBips() external view returns (uint16);

  function nextLiquidationTrigger() external view returns (uint32);

  function name() external view returns (string memory);

  function deposit(uint256 amount) external returns (bool);

  function rescueTokens(address token) external;

  function getMarketDelinquencyStatus()
    external
    view
    returns (bool marketInPenalty, uint256 delinquentDebt);

  function liquidateCollateral(
    bytes calldata quoteCalldata,
    uint lengthWithdrawalQueue,
    uint maxCollateralToLiquidate,
    uint minUnderlyingOut
  ) external returns (uint underlyingAmountReceived);

  function reclaimCollateral() external;

  function getReclaimableAmount(address account) external view returns (uint256);
}
