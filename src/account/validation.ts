import { Market } from "../market";
import { TokenAmount } from "../token";

export enum DepositStatus {
  Ready = "Ready",
  InsufficientBalance = "InsufficientBalance",
  ExceedsMaximumDeposit = "ExceedsMaximumDeposit",
  BelowMinimumDeposit = "BelowMinimumDeposit",
  MarketClosed = "MarketClosed",
  InsufficientAllowance = "InsufficientAllowance",
  Blocked = "Blocked",
  // V1
  InsufficientRole = "InsufficientRole",
  // V2
  RequiresAccess = "RequiresAccess"
}

export type DepositPreview = { status: DepositStatus };

export enum RepayStatus {
  Ready = "Ready",
  MarketClosed = "MarketClosed",
  InsufficientBalance = "InsufficientBalance",
  ExceedsOutstandingDebt = "ExceedsOutstandingDebt",
  InsufficientAllowance = "InsufficientAllowance"
}

export type RepayPreview = { status: RepayStatus };

export enum CloseMarketStatus {
  InsufficientBalance = "InsufficientBalance",
  UnpaidWithdrawalBatches = "UnpaidWithdrawalBatches",
  Ready = "Ready",
  NotBorrower = "NotBorrower",
  InsufficientAllowance = "InsufficientAllowance",
  EarlyClosureNotAllowed = "EarlyClosureNotAllowed"
}

export type CloseMarketPreview = { status: CloseMarketStatus };

export enum SetMaxTotalSupplyStatus {
  NotBorrower = "NotBorrower",
  Ready = "Ready",
  BelowCurrentSupply = "BelowCurrentSupply"
}

export type SetMaxTotalSupplyPreview = {
  status: SetMaxTotalSupplyStatus;
};

export enum SetAprStatus {
  NotBorrower = "NotBorrower",
  InvalidApr = "InvalidApr",
  Ready = "Ready",
  InsufficientReserves = "InsufficientReserves",
  DecreaseDuringFixedTerm = "DecreaseDuringFixedTerm"
}

export type SetAprPreview =
  | {
      status: SetAprStatus.NotBorrower | SetAprStatus.InvalidApr;
    }
  | {
      status: SetAprStatus.Ready;
      willChangeReserveRatio: true;
      // The new liquidity coverage that will be required for the temporary reserve ratio.
      newCoverageLiquidity: TokenAmount;
      // The new reserve ratio that will be temporarily imposed.
      newReserveRatio: number;
      // Whether the change to the reserve ratio will be caused by an old temporary
      // reserve ratio resetting.
      changeCausedByReset: boolean;
    }
  | {
      // This status indicates the change will not affect the reserve ratio,
      // i.e. the relative reduction is <= 1/2 of the reserve ratio.
      status: SetAprStatus.Ready;
      willChangeReserveRatio: false;
    }
  | {
      // This status indicates the new reserve ratio required to set the new APR
      // would make the market delinquent.
      status: SetAprStatus.InsufficientReserves;
      newReserveRatio: number;
      newCoverageLiquidity: TokenAmount;
      missingReserves: TokenAmount;
      changeCausedByReset: boolean;
    };

export enum QueueWithdrawalStatus {
  Ready = "Ready",
  InsufficientBalance = "InsufficientBalance",
  InsufficientRole = "InsufficientRole",
  MarketInClosedTerm = "MarketInClosedTerm",
  RequiresAccess = "RequiresAccess"
}

export type QueueWithdrawalPreview = { status: QueueWithdrawalStatus };

type MarketFunctionName =
  | "Deposit"
  | "QueueWithdrawal"
  | "SetApr"
  | "Close"
  | "Repay"
  | "ForceBuyBack";

type AccountActionAvailability = {
  [key in MarketFunctionName]:
    | {
        available: true;
      }
    | {
        available: false;
        reason: string;
      };
};

export const isMarketInstanceArray = (markets: Market[] | string[]): markets is Market[] => {
  return typeof markets[0] !== "string";
};

export type FunctionAvailability =
  | {
      available: true;
    }
  | {
      available: false;
      reason: string;
    };
