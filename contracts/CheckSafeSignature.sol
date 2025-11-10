import "./ISafe.sol";
bytes4 constant MAGIC_VALUE = 0x1626ba7e;
bytes4 constant MAGIC_VALUE_BYTES = 0x20c13b0b;

contract CheckSafeSignature {
  constructor(address safeAddress, bytes memory message, bytes memory signature) {
    ISafe safe = ISafe(safeAddress);

    bytes memory call1 = abi.encodeWithSelector(MAGIC_VALUE_BYTES, message, signature);
    (bool success1, bytes memory returnData1) = address(safe).staticcall(call1);
    bool isValid = success1 && (abi.decode(returnData1, (bytes4)) == MAGIC_VALUE_BYTES);
    if (!isValid) {
      bytes memory call2 = abi.encodeWithSelector(
        MAGIC_VALUE,
        toEthSignedMessageHash(message),
        signature
      );
      (bool success2, bytes memory returnData2) = address(safe).staticcall(call2);
      isValid = success2 && (abi.decode(returnData2, (bytes4)) == MAGIC_VALUE);
    }
    assembly {
      mstore(0, isValid)
      return(0, 32)
    }
  }

  /// @dev Returns an Ethereum Signed Message, created from `s`.
  /// This produces a hash corresponding to the one signed with the
  /// [`eth_sign`](https://eth.wiki/json-rpc/API#eth_sign)
  /// JSON-RPC method as part of EIP-191.
  /// Note: Supports lengths of `s` up to 999999 bytes.
  function toEthSignedMessageHash(bytes memory s) internal pure returns (bytes32 result) {
    /// @solidity memory-safe-assembly
    assembly {
      let sLength := mload(s)
      let o := 0x20
      mstore(o, "\x19Ethereum Signed Message:\n") // 26 bytes, zero-right-padded.
      mstore(0x00, 0x00)
      // Convert the `s.length` to ASCII decimal representation: `base10(s.length)`.
      for {
        let temp := sLength
      } 1 {

      } {
        o := sub(o, 1)
        mstore8(o, add(48, mod(temp, 10)))
        temp := div(temp, 10)
        if iszero(temp) {
          break
        }
      }
      let n := sub(0x3a, o) // Header length: `26 + 32 - o`.
      // Throw an out-of-offset error (consumes all gas) if the header exceeds 32 bytes.
      returndatacopy(returndatasize(), returndatasize(), gt(n, 0x20))
      mstore(s, or(mload(0x00), mload(n))) // Temporarily store the header.
      result := keccak256(add(s, sub(0x20, n)), add(n, sLength))
      mstore(s, sLength) // Restore the length.
    }
  }
}
