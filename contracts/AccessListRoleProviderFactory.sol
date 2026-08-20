// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct AccessListRoleProviderFactoryInputs {
  address administrator;
  address[] initialMembers;
  bytes32 salt;
}
interface AccessListRoleProviderFactory {
  event AccessListRoleProviderDeployed(
    address indexed provider,
    address indexed administrator,
    address indexed deployer,
    bytes32 salt,
    address[] initialMembers
  );

  function createRoleProvider(bytes calldata data) external returns (address provider);

  function createAccessListRoleProvider(
    AccessListRoleProviderFactoryInputs calldata inputs
  ) external returns (address provider);

  function computeRoleProviderAddress(
    address deployer,
    AccessListRoleProviderFactoryInputs calldata inputs
  ) external view returns (address provider);
}
