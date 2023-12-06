// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISafe {
  function VERSION() external view returns (string memory);

  function getThreshold() external view returns (uint256);

  /**
   * @notice Returns if `owner` is an owner of the Safe.
   * @return Boolean if owner is an owner of the Safe.
   */
  function isOwner(address owner) external view returns (bool);

  /**
   * @notice Returns a list of Safe owners.
   * @return Array of Safe owners.
   */
  function getOwners() external view returns (address[] memory);

  /**
   * @notice EIP1271 method to validate a signature.
   * @param _hash Hash of the data signed on the behalf of address(this).
   * @param _signature Signature byte array associated with _data.
   *
   * MUST return the bytes4 magic value 0x1626ba7e when function passes.
   * MUST NOT modify state (using STATICCALL for solc < 0.5, view modifier for solc > 0.5)
   * MUST allow external calls
   */
  function isValidSignature(bytes32 _hash, bytes memory _signature) external view returns (bytes4);

  /**
   * @dev Returns true if this contract implements the interface defined by `interfaceId`.
   * See the corresponding EIP section
   * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
   * to learn more about how these ids are created.
   *
   * This function call must use less than 30 000 gas.
   */
  function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
