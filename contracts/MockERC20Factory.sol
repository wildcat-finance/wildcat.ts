// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface MockERC20Factory {
  event NewTokenDeployed(address indexed token, string name, string symbol, uint8 decimals);

  function mockERC20InitCodeStorage() external view returns (address);

  function mockERC20InitCodeHash() external view returns (uint256);

  function deployerNonce(address deployer) external view returns (uint256);

  function getDeployParameters() external view returns (string memory name, string memory symbol);

  function getNextTokenAddress(address deployer) external view returns (address tokenAddress);

  function deployMockERC20(string calldata name, string calldata symbol) external returns (address);
}
