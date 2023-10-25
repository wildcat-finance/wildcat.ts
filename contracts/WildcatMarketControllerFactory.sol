// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct MarketControllerParameters {
  address archController;
  address borrower;
  address sentinel;
  address marketInitCodeStorage;
  uint256 marketInitCodeHash;
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

interface WildcatMarketControllerFactory {
  error CallerNotArchControllerOwner ();

  error ControllerAlreadyDeployed ();

  error InvalidConstraints ();

  error InvalidProtocolFeeConfiguration ();

  error NotRegisteredBorrower ();

  event NewController (address,address,string,string);

  event UpdateProtocolFeeConfiguration (address,uint16,address,uint256);

  function archController () external view returns (address);

  function computeControllerAddress (address borrower) external view returns (address);

  function controllerInitCodeHash () external view returns (uint256);

  function controllerInitCodeStorage () external view returns (address);

  function deployController () external returns (address controller);

  function deployControllerAndMarket (string calldata namePrefix, string calldata symbolPrefix, address asset, uint128 maxTotalSupply, uint16 annualInterestBips, uint16 delinquencyFeeBips, uint32 withdrawalBatchDuration, uint16 reserveRatioBips, uint32 delinquencyGracePeriod) external returns (address controller, address market);

  function getDeployedControllers (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getDeployedControllers () external view returns (address[] memory);

  function getDeployedControllersCount () external view returns (uint256);

  function getMarketControllerParameters () external view returns (MarketControllerParameters memory parameters);

  function getParameterConstraints () external view returns (MarketParameterConstraints memory constraints);

  function getProtocolFeeConfiguration () external view returns (address feeRecipient, address originationFeeAsset, uint80 originationFeeAmount, uint16 protocolFeeBips);

  function isDeployedController (address controller) external view returns (bool);

  function marketInitCodeHash () external view returns (uint256);

  function marketInitCodeStorage () external view returns (address);

  function sentinel () external view returns (address);

  function setProtocolFeeConfiguration (address feeRecipient, address originationFeeAsset, uint80 originationFeeAmount, uint16 protocolFeeBips) external;
}