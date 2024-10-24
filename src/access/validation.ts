import { HooksFactory } from "../typechain";

export enum DeployMarketStatus {
  Ready,
  InsufficientBalance,
  InsufficientAllowance,
  NotRegisteredBorrower
}

export type DeployMarketPreview =
  | ({
      status: DeployMarketStatus.Ready;
    } & (
      | {
          fn: "deployMarket";
          args: Parameters<HooksFactory["deployMarket"]>;
        }
      | {
          fn: "deployMarketAndHooks";
          args: Parameters<HooksFactory["deployMarketAndHooks"]>;
        }
    ))
  | {
      status: Exclude<DeployMarketStatus, DeployMarketStatus.Ready>;
    };
