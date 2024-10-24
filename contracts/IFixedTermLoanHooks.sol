// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MarketStateV2 } from "./WildcatMarketV2.sol";
import { MarketParameterConstraints } from "./MarketLensStructs.sol";
import { DeployMarketInputsV2 } from "./HooksFactory.sol";
import "./CommonHooksStructs.sol";

type RoleProvider is uint256;

type HooksDeploymentConfig is uint256;

type HooksConfig is uint256;

struct FixedTermHookedMarket {
  bool isHooked;
  bool transferRequiresAccess;
  bool depositRequiresAccess;
  bool withdrawalRequiresAccess;
  uint128 minimumDeposit;
  uint32 fixedTermEndTime;
  bool transfersDisabled;
  bool allowClosureBeforeTerm;
  bool allowTermReduction;
}

interface IFixedTermLoanHooks {
  error AnnualInterestBipsOutOfBounds();

  error CallerNotBorrower();

  error CallerNotFactory();

  error ClosureDisabledBeforeTerm();

  error DelinquencyFeeBipsOutOfBounds();

  error DelinquencyGracePeriodOutOfBounds();

  error DepositBelowMinimum();

  error FixedTermNotProvided();

  error ForceBuyBacksDisabled();

  error GrantedCredentialExpired();

  error IncreaseFixedTerm();

  error InvalidArrayLength();

  error InvalidCredentialReturned();

  error InvalidFixedTerm();

  error NoReducingAprBeforeTermEnd();

  error NotApprovedLender();

  error NotHookedMarket();

  error ProviderCanNotReplaceCredential();

  error ProviderCanNotRevokeCredential();

  error ProviderNotFound();

  error ReserveRatioBipsOutOfBounds();

  error TermReductionDisabled();

  error TransfersDisabled();

  error WithdrawalBatchDurationOutOfBounds();

  error WithdrawBeforeTermEnd();

  event AccountAccessGranted(
    address indexed providerAddress,
    address indexed accountAddress,
    uint32 credentialTimestamp
  );

  event AccountAccessRevoked(address indexed accountAddress);

  event AccountBlockedFromDeposits(address indexed accountAddress);

  event AccountMadeFirstDeposit(address indexed market, address indexed accountAddress);

  event AccountUnblockedFromDeposits(address indexed accountAddress);

  event FixedTermUpdated(address market, uint32 fixedTermEndTime);

  event MinimumDepositUpdated(address market, uint128 newMinimumDeposit);

  event RoleProviderAdded(
    address indexed providerAddress,
    uint32 timeToLive,
    uint24 pullProviderIndex
  );

  event RoleProviderRemoved(address indexed providerAddress, uint24 pullProviderIndex);

  event RoleProviderUpdated(
    address indexed providerAddress,
    uint32 timeToLive,
    uint24 pullProviderIndex
  );

  event TemporaryExcessReserveRatioActivated(
    address indexed market,
    uint256 originalReserveRatioBips,
    uint256 temporaryReserveRatioBips,
    uint256 temporaryReserveRatioExpiry
  );

  event TemporaryExcessReserveRatioCanceled(address indexed market);

  event TemporaryExcessReserveRatioExpired(address indexed market);

  event TemporaryExcessReserveRatioUpdated(
    address indexed market,
    uint256 originalReserveRatioBips,
    uint256 temporaryReserveRatioBips,
    uint256 temporaryReserveRatioExpiry
  );

  function addRoleProvider(address providerAddress, uint32 timeToLive) external;

  function blockFromDeposits(address account) external;

  function config() external view returns (HooksDeploymentConfig param0);

  function getHookedMarket(
    address marketAddress
  ) external view returns (FixedTermHookedMarket memory param0);

  function getHookedMarkets(
    address[] calldata marketAddresses
  ) external view returns (FixedTermHookedMarket[] memory hookedMarkets);

  function getLenderStatus(
    address accountAddress
  ) external view returns (LenderStatus memory status);

  function getParameterConstraints()
    external
    pure
    returns (MarketParameterConstraints memory constraints);

  function getPreviousLenderStatus(
    address accountAddress
  ) external view returns (LenderStatus memory status);

  function getPullProviders() external view returns (RoleProvider[] memory param0);

  function getRoleProvider(address providerAddress) external view returns (RoleProvider param0);

  function grantRole(address account, uint32 roleGrantedTimestamp) external;

  function grantRoles(
    address[] calldata accounts,
    uint32[] calldata roleGrantedTimestamps
  ) external;

  function onBorrow(uint256 param0, MarketStateV2 calldata param1, bytes calldata param2) external;

  function onCloseMarket(MarketStateV2 calldata param0, bytes calldata param1) external;

  function onCreateMarket(
    address deployer,
    address marketAddress,
    DeployMarketInputsV2 calldata parameters,
    bytes calldata extraData
  ) external returns (HooksConfig param0);

  function onDeposit(
    address lender,
    uint256 scaledAmount,
    MarketStateV2 calldata state,
    bytes calldata hooksData
  ) external;

  function onExecuteWithdrawal(
    address lender,
    uint128 param1,
    MarketStateV2 calldata param2,
    bytes calldata hooksData
  ) external;

  function onForceBuyBack(
    address lender,
    uint256 scaledAmount,
    MarketStateV2 calldata intermediateState,
    bytes calldata extraData
  ) external;

  function onNukeFromOrbit(
    address param0,
    MarketStateV2 calldata param1,
    bytes calldata param2
  ) external;

  function onQueueWithdrawal(
    address lender,
    uint32 param1,
    uint256 param2,
    MarketStateV2 calldata param3,
    bytes calldata hooksData
  ) external;

  function onRepay(
    uint256 normalizedAmount,
    MarketStateV2 calldata state,
    bytes calldata hooksData
  ) external;

  function onSetAnnualInterestAndReserveRatioBips(
    uint16 annualInterestBips,
    uint16 reserveRatioBips,
    MarketStateV2 calldata intermediateState,
    bytes calldata extraData
  ) external returns (uint16 updatedAnnualInterestBips, uint16 updatedReserveRatioBips);

  function onSetMaxTotalSupply(
    uint256 param0,
    MarketStateV2 calldata param1,
    bytes calldata param2
  ) external;

  function onSetProtocolFeeBips(
    uint16 param0,
    MarketStateV2 calldata param1,
    bytes calldata param2
  ) external;

  function onTransfer(
    address param0,
    address param1,
    address to,
    uint256 param3,
    MarketStateV2 calldata param4,
    bytes calldata extraData
  ) external;

  function removeRoleProvider(address providerAddress) external;

  function revokeRole(address account) external;

  function setFixedTermEndTime(address market, uint32 newFixedTermEndTime) external;

  function setMinimumDeposit(address market, uint128 newMinimumDeposit) external;

  function unblockFromDeposits(address account) external;

  function version() external pure returns (string memory param0);
}
