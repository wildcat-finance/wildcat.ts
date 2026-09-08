// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @dev Read contract inspection responses without allowing ABI decoding failures
///      to abort the surrounding query. Each probe makes one staticcall.
library InspectionCalls {
  function readWord(
    address target,
    bytes memory callData
  ) internal view returns (bool success, uint256 value) {
    assembly {
      // Copy only the expected word, including when the target returns extra data.
      success := staticcall(gas(), target, add(callData, 32), mload(callData), 0, 32)
      success := and(success, iszero(lt(returndatasize(), 32)))
      value := mload(0)
    }
  }

  function matchesBytes4(
    address target,
    bytes memory callData,
    bytes4 expected
  ) internal view returns (bool) {
    (bool success, uint256 value) = readWord(target, callData);
    // Check the ABI padding as well as the four-byte value.
    return success && value == uint256(bytes32(expected));
  }

  function readAddressArray(
    address target,
    bytes memory callData
  ) internal view returns (bool, address[] memory) {
    bool success;
    uint256 returnSize;
    uint256 offset;
    assembly {
      success := staticcall(gas(), target, add(callData, 32), mload(callData), 0, 32)
      returnSize := returndatasize()
      offset := mload(0)
    }
    if (
      !success ||
      returnSize < 64 ||
      offset < 32 ||
      offset % 32 != 0 ||
      offset > returnSize - 32
    ) {
      return (false, new address[](0));
    }

    uint256 length;
    assembly {
      returndatacopy(0, offset, 32)
      length := mload(0)
    }
    // Bound allocation and copying by the actual response, before multiplying.
    if (length > (returnSize - offset - 32) / 32) {
      return (false, new address[](0));
    }
    address[] memory values = new address[](length);
    assembly {
      returndatacopy(add(values, 32), add(offset, 32), mul(length, 32))
    }
    for (uint256 i = 0; i < length; i++) {
      uint256 encodedAddress;
      assembly {
        encodedAddress := mload(add(add(values, 32), mul(i, 32)))
      }
      if (encodedAddress > type(uint160).max) {
        return (false, new address[](0));
      }
    }
    return (true, values);
  }
}
