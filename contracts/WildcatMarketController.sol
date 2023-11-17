// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct MarketParameters {
  address asset;
  string namePrefix;
  string symbolPrefix;
  address borrower;
  address controller;
  address feeRecipient;
  address sentinel;
  uint128 maxTotalSupply;
  uint16 protocolFeeBips;
  uint16 annualInterestBips;
  uint16 delinquencyFeeBips;
  uint32 withdrawalBatchDuration;
  uint16 reserveRatioBips;
  uint32 delinquencyGracePeriod;
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

interface WildcatMarketController {
  /* -------------------------------------------------------------------------- */
  /*                                   Errors                                   */
  /* -------------------------------------------------------------------------- */

  error DelinquencyGracePeriodOutOfBounds();
  error ReserveRatioBipsOutOfBounds();
  error DelinquencyFeeBipsOutOfBounds();
  error WithdrawalBatchDurationOutOfBounds();
  error AnnualInterestBipsOutOfBounds();

  // Error thrown when a borrower-only method is called by another account.
  error CallerNotBorrower();

  // Error thrown when `deployMarket` called by an account other than `borrower` or
  // `controllerFactory`.
  error CallerNotBorrowerOrControllerFactory();

  // Error thrown if borrower calls `deployMarket` and is no longer
  // registered with the arch-controller.
  error NotRegisteredBorrower();

  error EmptyString();

  error NotControlledMarket();

  error MarketAlreadyDeployed();

  error ExcessReserveRatioStillActive();
  error AprChangeNotPending();

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  event LenderAuthorized(address);

  event LenderDeauthorized(address);

  event MarketDeployed(
    address indexed market,
    string name,
    string symbol,
    address asset,
    uint256 maxTotalSupply,
    uint256 annualInterestBips,
    uint256 delinquencyFeeBips,
    uint256 withdrawalBatchDuration,
    uint256 reserveRatioBips,
    uint256 delinquencyGracePeriod
  );

  event TemporaryExcessReserveRatioActivated(
    address indexed market,
    uint256 originalReserveRatioBips,
    uint256 temporaryReserveRatioBips,
    uint256 temporaryReserveRatioExpiry
  );

  event TemporaryExcessReserveRatioExpired(address indexed market);

  // Returns immutable arch-controller
  function archController() external view returns (address);

  // Returns immutable controller factory
  function controllerFactory() external view returns (address);

  // Returns immutable borrower address
  function borrower() external view returns (address);

  // Returns immutable sentinel address
  function sentinel() external view returns (address);

  function marketInitCodeStorage() external view returns (address);

  function marketInitCodeHash() external view returns (uint256);

  /**
   * @dev Returns immutable protocol fee configuration for new markets.
   *      Queried from the controller factory.
   *
   * @return feeRecipient         feeRecipient to use in new markets
   * @return originationFeeAsset  Asset used to pay fees for new market
   *                              deployments
   * @return originationFeeAmount Amount of originationFeeAsset paid
   *                              for new market deployments
   * @return protocolFeeBips      protocolFeeBips to use in new markets
   */
  function getProtocolFeeConfiguration()
    external
    view
    returns (
      address feeRecipient,
      address originationFeeAsset,
      uint80 originationFeeAmount,
      uint16 protocolFeeBips
    );

  /**
   * @dev Returns immutable constraints on market parameters that
   *      the controller will enforce.
   */
  function getParameterConstraints()
    external
    view
    returns (MarketParameterConstraints memory constraints);

  /* -------------------------------------------------------------------------- */
  /*                               Lender Registry                              */
  /* -------------------------------------------------------------------------- */

  function getAuthorizedLenders() external view returns (address[] memory);

  function getAuthorizedLenders(
    uint256 start,
    uint256 end
  ) external view returns (address[] memory);

  function getAuthorizedLendersCount() external view returns (uint256);

  function isAuthorizedLender(address lender) external view returns (bool);

  /**
   * @dev Grant authorization for a set of lenders.
   *
   *      Note: Only updates the internal set of approved lenders.
   *      Must call `updateLenderAuthorization` to apply changes
   *      to existing market accounts
   */
  function authorizeLenders(address[] memory lenders) external;

  /**
   * @dev Revoke authorization for a set of lenders.
   *
   *      Note: Only updates the internal set of approved lenders.
   *      Must call `updateLenderAuthorization` to apply changes
   *      to existing market accounts
   */
  function deauthorizeLenders(address[] memory lenders) external;

  /**
   * @dev Update lender authorization for a set of markets to the current
   *      status.
   */
  function updateLenderAuthorization(address lender, address[] memory markets) external;

  /* -------------------------------------------------------------------------- */
  /*                               Market Registry                              */
  /* -------------------------------------------------------------------------- */

  function isControlledMarket(address market) external view returns (bool);

  function getControlledMarkets() external view returns (address[] memory);

  function getControlledMarkets(
    uint256 start,
    uint256 end
  ) external view returns (address[] memory arr);

  function getControlledMarketsCount() external view returns (uint256);

  function computeMarketAddress(
    address asset,
    string memory namePrefix,
    string memory symbolPrefix
  ) external view returns (address);

  /* -------------------------------------------------------------------------- */
  /*                               Market Controls                              */
  /* -------------------------------------------------------------------------- */

  /**
   * @dev Close a market, setting interest rate to zero and returning all
   * outstanding debt.
   */
  function closeMarket(address market) external;

  /**
   * @dev Sets the maximum total supply (capacity) of a market - this only limits
   *      deposits and does not affect interest accrual.
   *
   *      Can not be set lower than the market's current total supply.
   */
  function setMaxTotalSupply(address market, uint256 maxTotalSupply) external;

  /**
   * @dev Modify the interest rate for a market.
   * If the new interest rate is lower than the current interest rate,
   * the reserve ratio is set to 90% for the next two weeks.
   */
  function setAnnualInterestBips(address market, uint16 annualInterestBips) external;

  /**
   * @dev Reset the reserve ratio to the value it had prior to
   *      a call to `setAnnualInterestBips`.
   */
  function resetReserveRatio(address market) external;

  function temporaryExcessReserveRatio(
    address
  ) external view returns (uint128 reserveRatioBips, uint128 expiry);

  /**
   * @dev Deploys a new instance of the market through the market factory
   *      and registers it with the arch-controller.
   *
   *      If `msg.sender` is not `borrower` or `controllerFactory`,
   *      reverts with `CallerNotBorrowerOrControllerFactory`.
   *
   *	    If `msg.sender == borrower && !archController.isRegisteredBorrower(msg.sender)`,
   *		  reverts with `NotRegisteredBorrower`.
   *
   *      If called by `controllerFactory`, skips borrower check.
   *
   *      If `originationFeeAmount` returned by controller factory is not zero,
   *      transfers `originationFeeAmount` of `originationFeeAsset` from
   *      `msg.sender` to `feeRecipient`.
   */
  function deployMarket(
    address asset,
    string memory namePrefix,
    string memory symbolPrefix,
    uint128 maxTotalSupply,
    uint16 annualInterestBips,
    uint16 delinquencyFeeBips,
    uint32 withdrawalBatchDuration,
    uint16 reserveRatioBips,
    uint32 delinquencyGracePeriod
  ) external returns (address);

  function getMarketParameters() external view returns (MarketParameters memory);
}
