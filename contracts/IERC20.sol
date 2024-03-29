// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
  event Approval(address, address, uint256);

  event Transfer(address, address, uint256);

  function allowance(address owner, address spender) external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);

  function balanceOf(address account) external view returns (uint256);

  function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);

  function increaseAllowance(address spender, uint256 addedValue) external returns (bool);

  function totalSupply() external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  function faucet() external;

  function mint(address to, uint256 value) external;

  function name() external view returns (string memory);

  function symbol() external view returns (string memory);

  function decimals() external view returns (uint8);
}
