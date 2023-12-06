// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ISafe.sol";

enum AccountKind {
  EOA,
  Safe,
  UnknownContract
}

struct AccountDescription {
  AccountKind kind;
  address[] owners;
  uint256 threshold;
}

uint256 constant OnlyFullWordMask = 0xffffffe0;

contract AccountQuery {
  constructor(address account) {
    AccountDescription memory description = _describeAccount(account);
    bytes memory data = abi.encode(description);
    assembly {
      return(add(data, 32), mload(data))
    }
  }

  function describeAccount(address account) external view returns (AccountDescription memory) {
    return _describeAccount(account);
  }

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

  function _describeAccount(
    address account
  ) internal view returns (AccountDescription memory description) {
    if (account.code.length == 0) {
      description.kind = AccountKind.EOA;
      return description;
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
