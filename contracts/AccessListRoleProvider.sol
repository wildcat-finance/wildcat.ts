// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AccessListRoleProvider {
  event AdministratorTransferRequested(
    address indexed administrator,
    address indexed previousPendingAdministrator,
    address indexed pendingAdministrator
  );
  event AdministratorTransferCancelled(
    address indexed administrator,
    address indexed cancelledPendingAdministrator
  );
  event AdministratorTransferred(
    address indexed previousAdministrator,
    address indexed newAdministrator
  );
  event MemberAdded(address indexed administrator, address indexed account);
  event MemberRemoved(address indexed administrator, address indexed account);

  function administrator() external view returns (address);

  function pendingAdministrator() external view returns (address);

  function requestAdministratorTransfer(address newAdministrator) external;

  function cancelAdministratorTransfer() external;

  function acceptAdministratorTransfer() external;

  function isMember(address account) external view returns (bool);

  function addMember(address account) external;

  function addMembers(address[] calldata accounts) external;

  function removeMember(address account) external;

  function removeMembers(address[] calldata accounts) external;

  function getMembers() external view returns (address[] memory);

  function getMembers(uint256 start, uint256 end) external view returns (address[] memory);

  function getMembersCount() external view returns (uint256);

  function getCredential(address account) external view returns (uint32 credentialTimestamp);

  function validateCredential(
    address account,
    bytes calldata data
  ) external view returns (uint32 credentialTimestamp);
}
