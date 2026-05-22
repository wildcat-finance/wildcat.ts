// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MarketParameterConstraints } from "./MarketLensStructs.sol";
import "./CommonHooksStructs.sol";

type RoleProvider is uint256;

type HooksDeploymentConfig is uint256;

struct PeriodicTermHookedMarket {
  bool isHooked;
  bool transferRequiresAccess;
  bool depositRequiresAccess;
  bool withdrawalRequiresAccess;
  bool depositHookEnabled;
  uint128 minimumDeposit;
  uint32 firstWithdrawalWindowStart;
  uint32 periodDuration;
  uint32 withdrawalWindowDuration;
  bool transfersDisabled;
  bool isClosed;
}

struct PendingAprChange {
  uint16 annualInterestBips;
  uint32 proposalTimestamp;
}

interface IPeriodicTermHooks {
  event AccountAccessGranted(
    address indexed providerAddress,
    address indexed accountAddress,
    uint32 credentialTimestamp
  );

  event AccountAccessRevoked(address indexed accountAddress);

  event AccountBlockedFromDeposits(address indexed accountAddress);

  event AccountMadeFirstDeposit(address indexed market, address indexed accountAddress);

  event AccountUnblockedFromDeposits(address indexed accountAddress);

  event AnnualInterestBipsReductionProposed(
    address indexed market,
    uint16 annualInterestBips,
    uint32 proposalTimestamp,
    uint32 responseWindowStart,
    uint32 responseWindowEnd
  );

  event MinimumDepositUpdated(address market, uint128 newMinimumDeposit);

  event NameUpdated(string name);

  event PeriodicTermClosed(address market);

  event PeriodicTermUpdated(
    address market,
    uint32 firstWithdrawalWindowStart,
    uint32 periodDuration,
    uint32 withdrawalWindowDuration
  );

  event RoleProviderAdded(
    address indexed providerAddress,
    uint32 timeToLive,
    uint24 pullProviderIndex,
    uint24 pushProviderIndex
  );

  event RoleProviderRemoved(
    address indexed providerAddress,
    uint24 pullProviderIndex,
    uint24 pushProviderIndex
  );

  event RoleProviderUpdated(
    address indexed providerAddress,
    uint32 timeToLive,
    uint24 pullProviderIndex,
    uint24 pushProviderIndex
  );

  function addRoleProvider(address providerAddress, uint32 timeToLive) external;

  function blockFromDeposits(address account) external;

  function blockFromDeposits(address[] calldata accounts) external;

  function borrower() external view returns (address);

  function config() external view returns (HooksDeploymentConfig param0);

  function getHookedMarket(
    address marketAddress
  ) external view returns (PeriodicTermHookedMarket memory param0);

  function getHookedMarkets(
    address[] calldata marketAddresses
  ) external view returns (PeriodicTermHookedMarket[] memory hookedMarkets);

  function getLenderStatus(
    address accountAddress
  ) external view returns (LenderStatus memory status);

  function getParameterConstraints()
    external
    pure
    returns (MarketParameterConstraints memory constraints);

  function getPendingAprChange(
    address marketAddress
  )
    external
    view
    returns (
      PendingAprChange memory pendingAprChange,
      uint32 responseWindowStart,
      uint32 responseWindowEnd
    );

  function getPreviousLenderStatus(
    address accountAddress
  ) external view returns (LenderStatus memory status);

  function getPullProviders() external view returns (RoleProvider[] memory param0);

  function getPushProviders() external view returns (RoleProvider[] memory param0);

  function getRoleProvider(address providerAddress) external view returns (RoleProvider param0);

  function grantRole(address account, uint32 roleGrantedTimestamp) external;

  function grantRoles(
    address[] calldata accounts,
    uint32[] calldata roleGrantedTimestamps
  ) external;

  function isKnownLenderOnMarket(address key0, address key1) external view returns (bool);

  function isWithdrawalWindowOpen(address marketAddress) external view returns (bool);

  function name() external view returns (string memory);

  function pendingAprChanges(
    address market
  ) external view returns (uint16 annualInterestBips, uint32 proposalTimestamp);

  function proposeAnnualInterestBips(address market, uint16 annualInterestBips) external;

  function removeRoleProvider(address providerAddress) external;

  function revokeRole(address account) external;

  function setMinimumDeposit(address market, uint128 newMinimumDeposit) external;

  function setName(string calldata _name) external;

  function unblockFromDeposits(address account) external;

  function version() external pure returns (string memory param0);
}
