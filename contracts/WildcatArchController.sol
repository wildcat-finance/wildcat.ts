// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface WildcatArchController {
  error BorrowerAlreadyExists ();

  error BorrowerDoesNotExist ();

  error ControllerAlreadyExists ();

  error ControllerDoesNotExist ();

  error ControllerFactoryAlreadyExists ();

  error ControllerFactoryDoesNotExist ();

  error MarketAlreadyExists ();

  error MarketDoesNotExist ();

  error NewOwnerIsZeroAddress ();

  error NoHandoverRequest ();

  error NotController ();

  error NotControllerFactory ();

  error Unauthorized ();

  event BorrowerAdded (address);

  event BorrowerRemoved (address);

  event ControllerAdded (address,address);

  event ControllerFactoryAdded (address);

  event ControllerFactoryRemoved (address);

  event ControllerRemoved (address);

  event MarketAdded (address,address);

  event MarketRemoved (address);

  event OwnershipHandoverCanceled (address);

  event OwnershipHandoverRequested (address);

  event OwnershipTransferred (address,address);

  function cancelOwnershipHandover () external payable;

  function completeOwnershipHandover (address pendingOwner) external payable;

  function getRegisteredBorrowers () external view returns (address[] memory);

  function getRegisteredBorrowers (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getRegisteredBorrowersCount () external view returns (uint256);

  function getRegisteredControllerFactories (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getRegisteredControllerFactories () external view returns (address[] memory);

  function getRegisteredControllerFactoriesCount () external view returns (uint256);

  function getRegisteredControllers (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getRegisteredControllers () external view returns (address[] memory);

  function getRegisteredControllersCount () external view returns (uint256);

  function getRegisteredMarkets () external view returns (address[] memory);

  function getRegisteredMarkets (uint256 start, uint256 end) external view returns (address[] memory arr);

  function getRegisteredMarketsCount () external view returns (uint256);

  function isRegisteredBorrower (address borrower) external view returns (bool);

  function isRegisteredController (address controller) external view returns (bool);

  function isRegisteredControllerFactory (address factory) external view returns (bool);

  function isRegisteredMarket (address market) external view returns (bool);

  function owner () external view returns (address result);

  function ownershipHandoverExpiresAt (address pendingOwner) external view returns (uint256 result);

  function registerBorrower (address borrower) external;

  function registerController (address controller) external;

  function registerControllerFactory (address factory) external;

  function registerMarket (address market) external;

  function removeBorrower (address borrower) external;

  function removeController (address controller) external;

  function removeControllerFactory (address factory) external;

  function removeMarket (address market) external;

  function renounceOwnership () external payable;

  function requestOwnershipHandover () external payable;

  function transferOwnership (address newOwner) external payable;

  function updateSphereXEngineOnRegisteredContracts(
    address[] calldata controllerFactories,
    address[] calldata controllers,
    address[] calldata markets
  ) external;
}