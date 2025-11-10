// SPDX-License-Identifier: Apache-2.0 WITH LicenseRef-Commons-Clause-1.0
pragma solidity >=0.8.20;

contract WildcatCollateralFactory {
  struct CollateralContract {
    address collateralContractAddress;
    address collateralToken;
    address associatedMarket;
  }

  address public collateralInitCodeStorage;
  uint256 public collateralInitCodeHash;

  address public archController;

  mapping(address => CollateralContract[]) public collateralContractList;

  mapping(address => bool) public isApprovedExecutor;

  function listCollateralMarkets(
    address _market,
    address _asset
  ) public view returns (address[] memory) {}

  function approveExecutor(address _executor) external {}

  function removeExecutor(address _executor) external {}

  function name() external pure returns (string memory) {}

  function deployCollateralContract(
    address _collateralToken,
    address _associatedMarket
  ) public returns (address collateralContract) {}
}
