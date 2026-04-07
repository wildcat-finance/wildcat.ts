import "./ISafe.sol";
bytes4 constant MAGIC_VALUE = 0x1626ba7e;
bytes4 constant MAGIC_VALUE_BYTES = 0x20c13b0b;

enum SignatureKind {
  INVALID,
  ECDSA,
  ECDSA_PERSONAL_SIGNATURE,
  EIP1271_BYTES,
  EIP1271_HASH,
  EIP1271_PERSONAL_SIGNATURE,
  ON_CHAIN_GNOSIS_SIGNATURE
}

struct SignatureData {
  SignatureKind kind;
  address signer;
  // If the signature is an off-chain signature from a Safe, this will be the list of signatures
  // from the safe owners that signed the message.
  SubSignature[] subSignatures;
  AccountDescription account;
}

enum SubSignatureKind {
  ECDSA,
  ECDSA_PERSONAL_SIGNATURE,
  EIP1271_BYTES,
  PRE_APPROVED_HASH
}

struct SubSignature {
  SubSignatureKind kind;
  address signer;
  bytes signature;
}

library SoladyECDSA {
  /// @dev Recovers the signer's address from a message digest `hash`,
  /// and the `signature`.
  /// NOTE: Modified from the original Solady implementation to return 0 on failure rather than reverting
  ///       and to fallback to the `recovery(bytes32 hash, bytes32 r, bytes32 vs)` function for EIP-2098 short form signatures.
  function recover(bytes32 hash, bytes memory signature) internal view returns (address result) {
    if (signature.length == 64) {
      bytes32 r;
      bytes32 vs;
      assembly {
        r := mload(add(signature, 0x20))
        vs := mload(add(signature, 0x40))
      }
      return recover(hash, r, vs);
    }
    /// @solidity memory-safe-assembly
    assembly {
      let m := mload(0x40) // Cache the free memory pointer.
      let signatureLength := mload(signature)
      mstore(0x00, hash)
      mstore(0x20, byte(0, mload(add(signature, 0x60)))) // `v`.
      mstore(0x40, mload(add(signature, 0x20))) // `r`.
      mstore(0x60, mload(add(signature, 0x40))) // `s`.
      result := mload(
        staticcall(
          gas(), // Amount of gas left for the transaction.
          eq(signatureLength, 65), // Address of `ecrecover`.
          0x00, // Start of input.
          0x80, // Size of input.
          0x01, // Start of output.
          0x20 // Size of output.
        )
      )
      // `returndatasize()` will be `0x20` upon success, and `0x00` otherwise.
      if iszero(returndatasize()) {
        result := 0
      }
      mstore(0x60, 0) // Restore the zero slot.
      mstore(0x40, m) // Restore the free memory pointer.
    }
  }

  /// @dev Recovers the signer's address from a message digest `hash`,
  /// and the EIP-2098 short form signature defined by `r` and `vs`.
  /// NOTE: Modified from the original Solady implementation to return 0 on failure rather than reverting.
  ///
  /// This function only accepts EIP-2098 short form signatures.
  /// See: https://eips.ethereum.org/EIPS/eip-2098
  function recover(bytes32 hash, bytes32 r, bytes32 vs) internal view returns (address result) {
    /// @solidity memory-safe-assembly
    assembly {
      let m := mload(0x40) // Cache the free memory pointer.
      mstore(0x00, hash)
      mstore(0x20, add(shr(255, vs), 27)) // `v`.
      mstore(0x40, r)
      mstore(0x60, shr(1, shl(1, vs))) // `s`.
      result := mload(
        staticcall(
          gas(), // Amount of gas left for the transaction.
          1, // Address of `ecrecover`.
          0x00, // Start of input.
          0x80, // Size of input.
          0x01, // Start of output.
          0x20 // Size of output.
        )
      )
      // `returndatasize()` will be `0x20` upon success, and `0x00` otherwise.
      if iszero(returndatasize()) {
        result := 0
      }
      mstore(0x60, 0) // Restore the zero slot.
      mstore(0x40, m) // Restore the free memory pointer.
    }
  }
}

contract DescribeSignature {
  constructor(address signer, bytes memory message, bytes memory signature) {
    SignatureData memory description = describeSignature(signer, message, signature);
    bytes memory data = abi.encode(description);
    assembly {
      return(add(data, 32), mload(data))
    }
  }

  function describeSignature(
    address signer,
    bytes memory message,
    bytes memory signature
  ) public view returns (SignatureData memory data) {
    data.account = AccountsLib.describeAccount(signer);
    bytes32 messageHash = keccak256(message);
    if (data.account.kind == AccountKind.EOA) {
      address recovered = SoladyECDSA.recover(messageHash, signature);
      // If no signer was provided and a valid signature was recovered, set signer to the recovered address
      // If a signer was provided, only set the kind and signer if they match.
      if (recovered != address(0) && (signer == address(0) || signer == recovered)) {
        data.kind = SignatureKind.ECDSA;
        data.signer = recovered;
      } else if (
        (recovered = SoladyECDSA.recover(toEthSignedMessageHash(message), signature)) !=
        address(0) &&
        (signer == address(0) || signer == recovered)
      ) {
        data.kind = SignatureKind.ECDSA_PERSONAL_SIGNATURE;
        data.signer = recovered;
      } else {
        data.kind = SignatureKind.INVALID;
      }

      // If ECDSA fails for 7702 delegated EOAs, see if the smart wallet supports 1271
      if (!(data.kind == SignatureKind.INVALID && data.account.has7702Delegation)) {
        return data;
      }
    }
    if (data.account.kind == AccountKind.Safe) {
      messageHash = getMessageHashForSafe(
        ISafe(signer),
        abi.encodePacked(toEthSignedMessageHash(message))
      );
      if (check1271WithBytes(signer, message, signature)) {
        data.kind = SignatureKind.EIP1271_BYTES;
      } else if (checkOnChainGnosisSignature(signer, message)) {
        data.kind = SignatureKind.ON_CHAIN_GNOSIS_SIGNATURE;
        // messageHash = toEthSignedMessageHash(message);
      } else if (check1271WithMessageHash(signer, keccak256(message), signature)) {
        data.kind = SignatureKind.EIP1271_HASH;
      } else if (check1271WithMessageHash(signer, toEthSignedMessageHash(message), signature)) {
        data.kind = SignatureKind.EIP1271_PERSONAL_SIGNATURE;
      } else if (check1271WithBytes(signer, abi.encodePacked(messageHash), signature)) {
        data.kind = SignatureKind.EIP1271_HASH;
      } // else if (check1271WithBytes(signer, abi.encodePacked(toEthSignedMessageHash(message)), signature)) {
      // data.kind = SignatureKind.EIP1271_PERSONAL_SIGNATURE;
      //}
      // Check if the signature data is a compact array of signatures by the owners
      if (signature.length >= data.account.threshold * 65) {
        uint numSignatures = data.account.threshold;
        address lastOwner = address(0);
        address currentOwner;
        bool signersOk = true;
        data.subSignatures = new SubSignature[](numSignatures);

        for (uint i = 0; i < numSignatures; i++) {
          (uint8 v, bytes32 r, bytes32 s) = SignatureSplitter.signatureSplit(signature, i);
          if (v == 0) {
            // If v is 0 then it is a contract signature
            // When handling contract signatures the address of the contract is encoded into r
            currentOwner = address(uint160(uint256(r)));

            // Check that signature data pointer (s) is not pointing inside the static part of the signatures bytes
            // This check is not completely accurate, since it is possible that more signatures than the threshold are send.
            // Here we only check that the pointer is not pointing inside the part that is being processed
            if (uint256(s) < numSignatures * 65) {
              signersOk = false;
              break;
            }

            // Check that signature data pointer (s) is in bounds (points to the length of data -> 32 bytes)
            if (uint256(s) + 32 > signature.length) {
              signersOk = false;
              break;
            }

            // Check if the contract signature is in bounds: start of data is s + 32 and end is start + signature length
            uint256 contractSignatureLen;
            assembly {
              contractSignatureLen := mload(add(add(signature, s), 0x20))
            }
            if (uint256(s) + 32 + contractSignatureLen > signature.length) {
              signersOk = false;
              break;
            }

            // Check signature
            bytes memory contractSignature;
            assembly {
              // The signature data for contract signatures is appended to the concatenated signatures and the offset is stored in s
              contractSignature := add(add(signature, s), 0x20)
            }
            if (!check1271WithBytes(currentOwner, message, contractSignature)) {
              signersOk = false;
              break;
            }
            data.subSignatures[i] = SubSignature({
              kind: SubSignatureKind.EIP1271_BYTES,
              signer: currentOwner,
              signature: contractSignature
            });
          } else if (v == 1) {
            // If v is 1 then it is an approved hash
            // When handling approved hashes the address of the approver is encoded into r
            currentOwner = address(uint160(uint256(r)));
            // Hashes are automatically approved by the sender of the message or when they have been pre-approved via a separate transaction
            if (ISafe(signer).approvedHashes(currentOwner, messageHash) == 0) {
              signersOk = false;
              break;
            }
            data.subSignatures[i] = SubSignature({
              kind: SubSignatureKind.PRE_APPROVED_HASH,
              signer: currentOwner,
              signature: abi.encodePacked(r, s, v)
            });
          } else if (v > 30) {
            // If v > 30 then default va (27,28) has been adjusted for eth_sign flow
            // To support eth_sign and similar we adjust v and hash the messageHash with the Ethereum message prefix before applying ecrecover
            currentOwner = ecrecover(
              keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)),
              v - 4,
              r,
              s
            );
            data.subSignatures[i] = SubSignature({
              kind: SubSignatureKind.ECDSA_PERSONAL_SIGNATURE,
              signer: currentOwner,
              signature: abi.encodePacked(r, s, v - 4)
            });
          } else {
            // Default is the ecrecover flow with the provided data hash
            // Use ecrecover with the messageHash for EOA signatures
            currentOwner = ecrecover(messageHash, v, r, s);
            data.subSignatures[i] = SubSignature({
              kind: SubSignatureKind.ECDSA,
              signer: currentOwner,
              signature: abi.encodePacked(r, s, v)
            });
          }

          if (currentOwner <= lastOwner || !ISafe(signer).isOwner(currentOwner)) {
            signersOk = false;
            break;
          }
          lastOwner = currentOwner;
        }
        if (!signersOk) {
          data.subSignatures = new SubSignature[](0);
        }
      }
      data.signer = signer;
      return data;
    }
    // Check with personal signature message & no signature
    if (checkOnChainGnosisSignature(signer, message)) {
      data.kind = SignatureKind.ON_CHAIN_GNOSIS_SIGNATURE;
      data.signer = signer;
      return data;
    }
    // Check with full bytes (deprecated 1271 fn)
    if (check1271WithBytes(signer, message, signature)) {
      data.kind = SignatureKind.EIP1271_BYTES;
      data.signer = signer;
      return data;
    }
    // Check with message hash (the official 1271 fn)
    if (check1271WithMessageHash(signer, keccak256(message), signature)) {
      data.kind = SignatureKind.EIP1271_HASH;
      data.signer = signer;
      return data;
    }
    // Check with personal signature message hash
    if (check1271WithMessageHash(signer, toEthSignedMessageHash(message), signature)) {
      data.kind = SignatureKind.EIP1271_PERSONAL_SIGNATURE;
      data.signer = signer;
      return data;
    }
    data.kind = SignatureKind.INVALID;
    return data;
  }

  /**
   * @dev Checks if a message was marked as signed by the Gnosis Safe.
   *      Does not provide a signature message as if the message hash was verified on-chain,
   *      the signed message is saved in a mapping.
   */
  function checkOnChainGnosisSignature(
    address safeAddress,
    bytes memory message
  ) internal view returns (bool) {
    return check1271WithMessageHash(safeAddress, toEthSignedMessageHash(message), hex"");
  }

  /**
   * @dev Checks a 1271 signature with a message hash using the `isValidSignature(bytes32,bytes)` function.
   *      Gnosis Safes use this function to verify messages signed on-chain by the contract by looking up the message hash
   *      in the contract storage, with the signature data being ignored.
   */
  function check1271WithMessageHash(
    address safeAddress,
    bytes32 messageHash,
    bytes memory signature
  ) internal view returns (bool) {
    (bool success, bytes memory returnData) = safeAddress.staticcall(
      abi.encodeWithSelector(MAGIC_VALUE, messageHash, signature)
    );
    return success && (abi.decode(returnData, (bytes4)) == MAGIC_VALUE);
  }

  /**
   * @dev Checks a 1271 signature with a message using the `isValidSignature(bytes,bytes)` function.
   *      This is a deprecated function according to EIP-1271, but seems to still be used in some contracts.
   */
  function check1271WithBytes(
    address safeAddress,
    bytes memory message,
    bytes memory signature
  ) internal view returns (bool) {
    bytes memory data = abi.encodeWithSelector(MAGIC_VALUE_BYTES, message, signature);
    (bool success, bytes memory returnData) = safeAddress.staticcall(data);
    return success && (abi.decode(returnData, (bytes4)) == MAGIC_VALUE_BYTES);
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

  bytes32 internal constant SAFE_MSG_TYPEHASH =
    0x60b3cbf8b4a223d68d641b3b6ddf9a298e7f33710cf3d3a9d1146b5a6150fbca;

  /**
   * @dev Returns the pre-image of the message hash (see getMessageHashForSafe).
   * @param safe Safe to which the message is targeted.
   * @param message Message that should be encoded.
   * @return Encoded message.
   */
  function encodeMessageDataForSafe(
    ISafe safe,
    bytes memory message
  ) public view returns (bytes memory) {
    bytes32 safeMessageHash = keccak256(abi.encode(SAFE_MSG_TYPEHASH, keccak256(message)));
    return abi.encodePacked(bytes1(0x19), bytes1(0x01), safe.domainSeparator(), safeMessageHash);
  }

  /**
   * @dev Returns the hash of a message that can be signed by owners.
   * @param safe Safe to which the message is targeted.
   * @param message Message that should be hashed.
   * @return Message hash.
   */
  function getMessageHashForSafe(ISafe safe, bytes memory message) public view returns (bytes32) {
    return keccak256(encodeMessageDataForSafe(safe, message));
  }
}

enum AccountKind {
  EOA,
  Safe,
  UnknownContract
}

struct AccountDescription {
  AccountKind kind;
  bool has7702Delegation;
  address[] owners;
  uint256 threshold;
}

uint256 constant OnlyFullWordMask = 0xffffffe0;

library AccountsLib {
  address internal constant Safe_v1_Mainnet = 0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A;
  address internal constant Safe_v1_1_1_Mainnet = 0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F;
  address internal constant Safe_v1_2_0_Mainnet = 0x6851D6fDFAfD08c0295C392436245E5bc78B0185;
  address internal constant Safe_v1_3_0_Mainnet = 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552;
  address internal constant Safe_v1_3_0_Sepolia = 0x69f4D1788e39c87893C980c06EdF4b7f686e2938;
  address internal constant SafeL2_v1_3_0_Mainnet = 0x3E5c63644E683549055b9Be8653de26E0B4CD36E;
  address internal constant SafeL2_v1_3_0_Sepolia = 0xfb1bffC9d739B8D520DaF37dF666da4C687191EA;
  address internal constant Safe_v1_4_1 = 0x41675C099F32341bf84BFc5382aF534df5C7461a;
  address internal constant SafeL2_v1_4_1 = 0x29fcB43b46531BcA003ddC8FCB67FFE91900C762;

  function _isSafe(address account) internal pure returns (bool) {
    return
      account == Safe_v1_Mainnet ||
      account == Safe_v1_1_1_Mainnet ||
      account == Safe_v1_2_0_Mainnet ||
      account == Safe_v1_3_0_Mainnet ||
      account == Safe_v1_3_0_Sepolia ||
      account == SafeL2_v1_3_0_Mainnet ||
      account == SafeL2_v1_3_0_Sepolia ||
      account == Safe_v1_4_1 ||
      account == SafeL2_v1_4_1;
  }

  function describeAccount(
    address account
  ) internal view returns (AccountDescription memory description) {
    uint codeLength = account.code.length;
    if (codeLength == 0) {
      description.kind = AccountKind.EOA;
      return description;
    }
    if (codeLength == 23) {
      bool has7702Delegation;
      assembly {
        mstore(0, 0)
        // Copy the first 3 bytes of the code to the last 3 bytes of the first word in memory
        extcodecopy(account, 0x1d, 0, 3)
        // EOAs with EIP-7702 delegations begin with 0xef0100
        has7702Delegation := eq(mload(0), 0xef0100)
      }
      if (has7702Delegation) {
        description.has7702Delegation = true;
        description.kind = AccountKind.EOA;
        return description;
      }
    }
    address proxyAddress;
    assembly {
      mstore(0, 0xa619486e)
      // Call `masterCopy()` on the account.
      if staticcall(gas(), account, 0x1c, 4, 0, 0) {
        if eq(returndatasize(), 32) {
          returndatacopy(0, 0, 32)
          proxyAddress := and(mload(0), 0xffffffffffffffffffffffffffffffffffffffff)
        }
      }
    }
    if (proxyAddress != address(0) && _isSafe(proxyAddress)) {
      description.kind = AccountKind.Safe;
      ISafe safe = ISafe(account);
      description.owners = safe.getOwners();
      description.threshold = safe.getThreshold();
    } else {
      description.kind = AccountKind.UnknownContract;
    }
  }
}

library SignatureSplitter {
  /// @dev divides bytes signature into `uint8 v, bytes32 r, bytes32 s`.
  /// @notice Make sure to peform a bounds check for @param pos, to avoid out of bounds access on @param signatures
  /// @param pos which signature to read. A prior bounds check of this parameter should be performed, to avoid out of bounds access
  /// @param signatures concatenated rsv signatures
  function signatureSplit(
    bytes memory signatures,
    uint256 pos
  ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    // The signature format is a compact form of:
    //   {bytes32 r}{bytes32 s}{uint8 v}
    // Compact means, uint8 is not padded to 32 bytes.
    assembly {
      let signaturePos := mul(0x41, pos)
      r := mload(add(signatures, add(signaturePos, 0x20)))
      s := mload(add(signatures, add(signaturePos, 0x40)))
      // Here we are loading the last 32 bytes, including 31 bytes
      // of 's'. There is no 'mload8' to do this.
      //
      // 'byte' is not working due to the Solidity parser, so lets
      // use the second best option, 'and'
      v := and(mload(add(signatures, add(signaturePos, 0x41))), 0xff)
    }
  }
}
