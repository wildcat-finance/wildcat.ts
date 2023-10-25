// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface MockArchControllerOwner {
  function authorizeAccount (address account) external;

  function authorizedAccounts (address) external view returns (bool);

  function registerBorrower (address borrower) external;

  function registerBorrowers (address[] calldata borrowers) external;

  function returnOwnership () external;

  function setProtocolFeeConfiguration (address factory, address feeRecipient, address originationFeeAsset, uint80 originationFeeAmount, uint16 protocolFeeBips) external;
}