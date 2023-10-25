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
  error AnnualInterestBipsOutOfBounds ();

  error AprChangeNotPending ();

  error CallerNotBorrower ();

  error CallerNotBorrowerOrControllerFactory ();

  error DelinquencyFeeBipsOutOfBounds ();

  error DelinquencyGracePeriodOutOfBounds ();

  error EmptyString ();

  error ExcessReserveRatioStillActive ();

  error MarketAlreadyDeployed ();

  error NotControlledMarket ();

  error NotRegisteredBorrower ();

  error ReserveRatioBipsOutOfBounds ();

  error WithdrawalBatchDurationOutOfBounds ();

  event LenderAuthorized (address lender);

  event LenderDeauthorized (address lender);

  event MarketDeployed (address market);

  function archController () external view returns (address);

  function authorizeLenders (address[] calldata lenders) external;

  function borrower () external view returns (address);

  function computeMarketAddress (address asset, string calldata namePrefix, string calldata symbolPrefix) external view returns (address);

  function controllerFactory () external view returns (address);

  function deauthorizeLenders (address[] calldata lenders) external;

  function deployMarket (address asset, string calldata namePrefix, string calldata symbolPrefix, uint128 maxTotalSupply, uint16 annualInterestBips, uint16 delinquencyFeeBips, uint32 withdrawalBatchDuration, uint16 reserveRatioBips, uint32 delinquencyGracePeriod) external returns (address market);

  function getAuthorizedLenders () external view returns (address[] memory);

  function getAuthorizedLenders (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getAuthorizedLendersCount () external view returns (uint256);

  function getControlledMarkets (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getControlledMarkets () external view returns (address[] memory);

  function getControlledMarketsCount () external view returns (uint256);

  function getMarketParameters () external view returns (MarketParameters memory parameters);

  function getParameterConstraints () external view returns (MarketParameterConstraints memory constraints);

  function isAuthorizedLender (address lender) external view returns (bool);

  function isControlledMarket (address market) external view returns (bool);

  function marketInitCodeHash () external view returns (uint256);

  function marketInitCodeStorage () external view returns (address);

  function resetReserveRatio (address market) external;

  function sentinel () external view returns (address);

  function setAnnualInterestBips (address market, uint16 annualInterestBips) external;

  function temporaryExcessReserveRatio (address) external view returns (uint128 reserveRatioBips, uint128 expiry);

  function updateLenderAuthorization (address lender, address[] calldata markets) external;
}