// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// Controlled account responses for local parser regression tests. Signature
// validity is independent of the optional owner-signature breakdown.
contract SafeInspectionFixture {
  uint256 public threshold;
  uint256 public validityMode;
  address[] private owners;

  function configure(uint256 threshold_, uint256 validityMode_, address[] calldata owners_) external {
    threshold = threshold_;
    validityMode = validityMode_;
    owners = owners_;
  }

  function masterCopy() external pure returns (address) {
    return 0x41675C099F32341bf84BFc5382aF534df5C7461a;
  }

  function domainSeparator() external pure returns (bytes32) {
    return bytes32(uint256(1));
  }

  function getThreshold() external view returns (uint256) {
    return threshold;
  }

  function getOwners() external view returns (address[] memory) {
    return owners;
  }

  function isOwner(address owner) external view returns (bool) {
    for (uint256 i = 0; i < owners.length; i++) {
      if (owners[i] == owner) return true;
    }
    return false;
  }

  function isValidSignature(bytes calldata, bytes calldata) external view returns (bytes4) {
    return validityMode == 1 ? bytes4(0x20c13b0b) : bytes4(0xffffffff);
  }

  function isValidSignature(bytes32, bytes calldata signature) external view returns (bytes4) {
    return validityMode == 2 && signature.length == 0 ? bytes4(0x1626ba7e) : bytes4(0xffffffff);
  }

  function approvedHashes(address, bytes32) external pure returns (uint256) {
    return 1;
  }
}

contract ContractSignerInspectionFixture {
  function isValidSignature(bytes calldata, bytes calldata signature) external pure returns (bytes4) {
    return signature.length == 0 || keccak256(signature) == keccak256(hex"1234")
      ? bytes4(0x20c13b0b)
      : bytes4(0xffffffff);
  }
}
