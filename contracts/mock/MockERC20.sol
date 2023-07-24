// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.13;

import { ERC20 } from "./ERC20.sol";

contract MockERC20 is ERC20 {
  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol, 18) {}

  bool public constant isMock = true;

  function mint(address to, uint256 value) public virtual {
    _mint(to, value);
  }

  function faucet() external {
    mint(msg.sender, 100e18);
  }
}
