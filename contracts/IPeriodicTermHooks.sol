// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MarketParameterConstraints } from "./MarketLensStructs.sol";
import { DeployMarketInputsV2 } from "./HooksFactory.sol";
import "./CommonHooksStructs.sol";

type HooksDeploymentConfig is uint256;
type RoleProvider is uint256;
type HooksConfig is uint256;

struct PeriodicTermHookedMarket {
  bool isHooked;
  bool transferRequiresAccess;
  bool depositRequiresAccess;
  bool withdrawalRequiresAccess;
  bool depositHookEnabled;
  uint96 minimumDeposit;
  uint32 firstWithdrawalWindowStart;
  uint32 periodDuration;
  uint32 withdrawalWindowDuration;
  bool transfersDisabled;
  bool isClosed;
}

struct PeriodicPendingAprChange {
  uint16 annualInterestBips;
  uint32 proposalTimestamp;
}

struct MarketState {
  bool isClosed;
  uint128 maxTotalSupply;
  uint128 accruedProtocolFees;
  uint128 normalizedUnclaimedWithdrawals;
  uint104 scaledTotalSupply;
  uint104 scaledPendingWithdrawals;
  uint32 pendingWithdrawalExpiry;
  bool isDelinquent;
  uint32 timeDelinquent;
  uint16 protocolFeeBips;
  uint16 annualInterestBips;
  uint16 reserveRatioBips;
  uint112 scaleFactor;
  uint32 lastInterestAccruedTimestamp;
}

interface IPeriodicTermHooks {
  error CallerNotBorrower();

  error CallerNotAdministrator();

  error InvalidAdministratorTransferTarget();

  error AdministratorNotRegistered();

  error NoPendingAdministratorTransfer();

  error NotPendingAdministrator();
  error NotHookedMarket();
  error DepositBelowMinimum();
  error TransfersDisabled();
  error PeriodicWindowNotProvided();
  error InitialWithdrawalWindowTooFarInFuture();
  error PeriodDurationOutOfBounds();
  error WithdrawalWindowDurationOutOfBounds();
  error DepositHookNotEnabled();
  error WithdrawOutsideWindow();
  error AprReductionProposalDuringWithdrawalWindow();
  error AprReductionProposalNotReduction();
  error NoPendingAprChange();
  error AprChangeDoesNotMatchProposal();
  error AprChangeNotReady();
  error UnpaidWithdrawalsExist();
  error InvalidAccessConfiguration();
  error AprReductionProposalExpired();
  error AprReductionProposalOnClosedMarket();
  error CallerNotFactory();
  error CreateRoleProviderFailed();
  error RoleProviderFactoryRequired();
  error GrantedCredentialExpired();
  error InvalidArrayLength();
  error InvalidCredentialReturned();
  error InvalidCredentialTimestamp();
  error NotApprovedLender();
  error ProviderCanNotReplaceCredential();
  error ProviderCanNotRevokeCredential();
  error ProviderNotFound();

  event AccountAccessGranted(
    address indexed providerAddress,
    address indexed accountAddress,
    uint32 credentialTimestamp
  );

  event AccountAccessGranted(
    address indexed providerAddress,
    address indexed accountAddress,
    address indexed caller,
    uint32 credentialTimestamp
  );

  event AccountAccessRevoked(address indexed accountAddress);

  event AccountAccessRevoked(
    address indexed providerAddress,
    address indexed accountAddress,
    address indexed caller
  );

  event AccountBlockedFromDeposits(address indexed accountAddress);

  event AccountBlockedFromDeposits(
    address indexed administrator,
    address indexed accountAddress
  );

  event AccountMadeFirstDeposit(address indexed market, address indexed accountAddress);

  event AccountUnblockedFromDeposits(address indexed accountAddress);

  event AccountUnblockedFromDeposits(
    address indexed administrator,
    address indexed accountAddress
  );

  event MinimumDepositUpdated(address market, uint128 newMinimumDeposit);

  event MinimumDepositUpdated(
    address indexed market,
    address indexed caller,
    uint128 previousMinimumDeposit,
    uint128 newMinimumDeposit
  );

  event NameUpdated(string name);

  event NameUpdated(address indexed administrator, string previousName, string newName);

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

  event PeriodicTermClosed(address indexed market);

  event PeriodicTermUpdated(
    address market,
    uint32 firstWithdrawalWindowStart,
    uint32 periodDuration,
    uint32 withdrawalWindowDuration
  );

  event PeriodicTermUpdated(
    address indexed market,
    address indexed administrator,
    uint32 firstWithdrawalWindowStart,
    uint32 periodDuration,
    uint32 withdrawalWindowDuration
  );

  event RoleProviderAdded(
    address indexed administrator,
    address indexed providerAddress,
    uint32 timeToLive,
    uint24 pullProviderIndex,
    uint24 pushProviderIndex
  );

  event RoleProviderRemoved(
    address indexed administrator,
    address indexed providerAddress,
    uint32 timeToLive,
    uint24 pullProviderIndex,
    uint24 pushProviderIndex
  );

  event RoleProviderUpdated(
    address indexed administrator,
    address indexed providerAddress,
    uint32 previousTimeToLive,
    uint32 newTimeToLive,
    uint24 previousPullProviderIndex,
    uint24 newPullProviderIndex,
    uint24 previousPushProviderIndex,
    uint24 newPushProviderIndex
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

  event AnnualInterestBipsReductionProposed(
    address indexed market,
    uint16 annualInterestBips,
    uint32 proposalTimestamp,
    uint32 responseWindowStart,
    uint32 responseWindowEnd
  );

  event AnnualInterestBipsReductionProposalCancelled(address indexed market);

  event AnnualInterestBipsReductionExecuted(address indexed market, uint16 annualInterestBips);

  function addRoleProvider(address providerAddress, uint32 timeToLive) external;

  function AprReductionProposalValidityPeriods() external view returns (uint32);

  function MaximumInitialWithdrawalWindowDelay() external view returns (uint32);

  function MaximumPeriodDuration() external view returns (uint32);

  function MinimumPeriodDuration() external view returns (uint32);

  function MinimumWithdrawalWindowDuration() external view returns (uint32);

  function blockFromDeposits(address account) external;

  function blockFromDeposits(address[] calldata accounts) external;

  function borrower() external view returns (address);

  function administrator() external view returns (address);

  function pendingAdministrator() external view returns (address);

  function requestAdministratorTransfer(address newAdministrator) external;

  function cancelAdministratorTransfer() external;

  function acceptAdministratorTransfer() external;

  function config() external view returns (HooksDeploymentConfig);

  function createRoleProvider(
    address providerFactory,
    uint32 timeToLive,
    bytes calldata data
  ) external;

  function factory() external view returns (address);

  function getHookedMarket(
    address marketAddress
  ) external view returns (PeriodicTermHookedMarket memory);

  function getHookedMarkets(
    address[] calldata marketAddresses
  ) external view returns (PeriodicTermHookedMarket[] memory hookedMarkets);

  function getParameterConstraints()
    external
    pure
    returns (MarketParameterConstraints memory constraints);

  function getLenderStatus(
    address accountAddress
  ) external view returns (LenderStatus memory status);

  function getPreviousLenderStatus(
    address accountAddress
  ) external view returns (LenderStatus memory status);

  function getPullProviders() external view returns (RoleProvider[] memory);

  function getPushProviders() external view returns (RoleProvider[] memory);

  function getRoleProvider(address providerAddress) external view returns (RoleProvider);

  function grantRole(address account, uint32 roleGrantedTimestamp) external;

  function grantRoles(
    address[] calldata accounts,
    uint32[] calldata roleGrantedTimestamps
  ) external;

  function isKnownLenderOnMarket(address lender, address market) external view returns (bool);

  function isMarketTransferDisabled(address marketAddress) external view returns (bool);

  function isMarketTransferRecipientAllowed(
    address marketAddress,
    address recipient
  ) external view returns (bool);

  function isWithdrawalWindowOpen(address marketAddress) external view returns (bool);

  function name() external view returns (string memory);

  function onBorrow(uint256 amount, MarketState calldata state, bytes calldata hooksData) external;

  function onCloseMarket(MarketState calldata state, bytes calldata hooksData) external;

  function onCreateMarket(
    address administrator,
    address marketAddress,
    DeployMarketInputsV2 calldata parameters,
    bytes calldata extraData
  ) external returns (HooksConfig);

  function onDeposit(
    address lender,
    uint256 scaledAmount,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onExecuteWithdrawal(
    address lender,
    uint32 expiry,
    uint128 normalizedAmountWithdrawn,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onNukeFromOrbit(
    address account,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onQueueWithdrawal(
    address lender,
    uint32 expiry,
    uint256 scaledAmount,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onRepay(
    uint256 normalizedAmount,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onSetAnnualInterestAndReserveRatioBips(
    uint16 annualInterestBips,
    uint16 reserveRatioBips,
    MarketState calldata intermediateState,
    bytes calldata hooksData
  ) external returns (uint16 updatedAnnualInterestBips, uint16 updatedReserveRatioBips);

  function onSetMaxTotalSupply(
    uint256 maxTotalSupply,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onSetProtocolFeeBips(
    uint16 protocolFeeBips,
    MarketState calldata state,
    bytes calldata hooksData
  ) external;

  function onTransfer(
    address caller,
    address from,
    address to,
    uint256 scaledAmount,
    MarketState calldata state,
    bytes calldata extraData
  ) external;

  function pendingAprChanges(
    address market
  ) external view returns (uint16 annualInterestBips, uint32 proposalTimestamp);

  function getPendingAprChange(
    address market
  )
    external
    view
    returns (
      PeriodicPendingAprChange memory pendingAprChange,
      uint32 responseWindowStart,
      uint32 responseWindowEnd
    );

  function executePendingAnnualInterestBipsReduction(
    MarketState calldata intermediateState
  ) external returns (uint16 annualInterestBips);

  function proposeAnnualInterestBips(address market, uint16 annualInterestBips) external;

  function removeRoleProvider(address providerAddress) external;

  function revokeRole(address account) external;

  function revokeRoles(address[] calldata accounts) external;

  function setMinimumDeposit(address market, uint128 newMinimumDeposit) external;

  function setName(string calldata name) external;

  function temporaryExcessReserveRatio(
    address market
  )
    external
    view
    returns (uint16 originalAnnualInterestBips, uint16 originalReserveRatioBips, uint32 expiry);

  function unblockFromDeposits(address account) external;

  function version() external pure returns (string memory);

  function templateVersion() external pure returns (uint256);
}
