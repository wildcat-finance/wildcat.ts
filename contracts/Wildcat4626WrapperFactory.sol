// SPDX-License-Identifier: Apache-2.0 WITH LicenseRef-Commons-Clause-1.0
pragma solidity ^0.8.20;

interface Wildcat4626WrapperFactory {
  error WrapperAlreadyExists(address market);
  error ZeroAddress();
  error NotRegisteredMarket(address market);

  event WrapperDeployed(address indexed market, address indexed wrapper);

  function archController() external view returns (address);

  function wrapperForMarket(address market) external view returns (address);

  function createWrapper(address market) external returns (address wrapper);
}
