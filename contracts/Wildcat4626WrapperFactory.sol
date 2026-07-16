// SPDX-License-Identifier: Apache-2.0 WITH LicenseRef-Commons-Clause-1.0
pragma solidity ^0.8.20;

import { WildcatArchController } from "./WildcatArchController.sol";

interface Wildcat4626WrapperFactory {
  error WrapperAlreadyExists(address market);
  error ZeroAddress();
  error NotRegisteredMarket(address market);
  error LegacyMarketsNotSupported(address market);
  error UnsupportedMarketRounding(address market, bytes32 rounding);
  error UnsupportedMarketTransferPolicy(address market, address hooks);
  error MarketTransfersDisabled(address market);
  error InvalidV1Factory(address v1Factory);

  event WrapperDeployed(address indexed market, address indexed wrapper);

  function archController() external view returns (WildcatArchController);

  function v1Factory() external view returns (address);

  function isFloorRoundingMarket(address market) external view returns (bool);

  function wrapperForMarket(address market) external view returns (address wrapper);

  function createWrapper(address market) external returns (address wrapper);
}
