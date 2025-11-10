import { HooksFactory } from "../typechain";

export enum DeployMarketStatus {
  Ready = "Ready",
  InsufficientBalance = "InsufficientBalance",
  InsufficientAllowance = "InsufficientAllowance",
  NotRegisteredBorrower = "NotRegisteredBorrower",
  CreateProviderInputsWithoutFactory = "CreateProviderInputsWithoutFactory"
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

export enum ChangeLenderRoleStatus {
  Ready = "Ready",
  NotBorrower = "NotBorrower"
}

export type ChangeLenderRolePreview = {
  status: ChangeLenderRoleStatus;
};
