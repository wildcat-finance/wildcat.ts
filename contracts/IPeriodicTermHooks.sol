// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MarketParameterConstraints } from "./MarketLensStructs.sol";

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

  event AccountAccessGranted(
    address indexed providerAddress,
    address indexed accountAddress,
    uint32 credentialTimestamp
  );

  event AccountAccessRevoked(address indexed accountAddress);

  event AccountBlockedFromDeposits(address indexed accountAddress);

  event AccountMadeFirstDeposit(address indexed market, address indexed accountAddress);

  event AccountUnblockedFromDeposits(address indexed accountAddress);

  event MinimumDepositUpdated(address market, uint128 newMinimumDeposit);

  event NameUpdated(string name);

  event PeriodicTermClosed(address market);

  event PeriodicTermUpdated(
    address market,
    uint32 firstWithdrawalWindowStart,
    uint32 periodDuration,
    uint32 withdrawalWindowDuration
  );

  event AnnualInterestBipsReductionProposed(
    address indexed market,
    uint16 annualInterestBips,
    uint32 proposalTimestamp,
    uint32 responseWindowStart,
    uint32 responseWindowEnd
  );

  function blockFromDeposits(address account) external;

  function blockFromDeposits(address[] calldata accounts) external;

  function borrower() external view returns (address);

  function config() external view returns (HooksDeploymentConfig);

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

  function grantRole(address account, uint32 roleGrantedTimestamp) external;

  function grantRoles(
    address[] calldata accounts,
    uint32[] calldata roleGrantedTimestamps
  ) external;

  function isKnownLenderOnMarket(address lender, address market) external view returns (bool);

  function isWithdrawalWindowOpen(address marketAddress) external view returns (bool);

  function name() external view returns (string memory);

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

  function setMinimumDeposit(address market, uint128 newMinimumDeposit) external;

  function setName(string calldata name) external;

  function unblockFromDeposits(address account) external;

  function version() external pure returns (string memory);
}
