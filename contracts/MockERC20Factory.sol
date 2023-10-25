// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface MockERC20Factory {
  event NewTokenDeployed (address token ,string name,string symbol,uint8 decimals);

  function deploy (string calldata name, string calldata symbol) external returns (address);
}