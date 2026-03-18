import { HooksFactory, HooksFactoryRevolving } from "../typechain";

export enum DeployMarketStatus {
  Ready = "Ready",
  InsufficientBalance = "InsufficientBalance",
  InsufficientAllowance = "InsufficientAllowance",
  NotRegisteredBorrower = "NotRegisteredBorrower",
  CreateProviderInputsWithoutFactory = "CreateProviderInputsWithoutFactory"
}

type LegacyDeployMarketCallPreview =
  | {
      fn: "deployMarket";
      args: Parameters<HooksFactory["deployMarket"]>;
    }
  | {
      fn: "deployMarketAndHooks";
      args: Parameters<HooksFactory["deployMarketAndHooks"]>;
    };

type RevolvingDeployMarketCallPreview =
  | {
      fn: "deployMarket";
      args: Parameters<HooksFactoryRevolving["deployMarket"]>;
    }
  | {
      fn: "deployMarketAndHooks";
      args: Parameters<HooksFactoryRevolving["deployMarketAndHooks"]>;
    };

export type LegacyReadyDeployMarketPreview = {
  status: DeployMarketStatus.Ready;
  marketType: "legacy";
} & LegacyDeployMarketCallPreview;

export type RevolvingReadyDeployMarketPreview = {
  status: DeployMarketStatus.Ready;
  marketType: "revolving";
} & RevolvingDeployMarketCallPreview;

type DeployMarketNotReadyPreview = {
  status: Exclude<DeployMarketStatus, DeployMarketStatus.Ready>;
};

export type ReadyDeployMarketPreview =
  | LegacyReadyDeployMarketPreview
  | RevolvingReadyDeployMarketPreview;

export type LegacyDeployMarketPreview =
  | LegacyReadyDeployMarketPreview
  | {
      status: Exclude<DeployMarketStatus, DeployMarketStatus.Ready>;
    };

export type RevolvingDeployMarketPreview =
  | RevolvingReadyDeployMarketPreview
  | DeployMarketNotReadyPreview;

export type DeployMarketPreview = ReadyDeployMarketPreview | DeployMarketNotReadyPreview;

export const readyLegacyDeployMarketPreview = (
  preview: LegacyDeployMarketCallPreview
): LegacyReadyDeployMarketPreview => {
  return {
    status: DeployMarketStatus.Ready,
    marketType: "legacy",
    ...preview
  };
};

export const readyRevolvingDeployMarketPreview = (
  preview: RevolvingDeployMarketCallPreview
): RevolvingReadyDeployMarketPreview => {
  return {
    status: DeployMarketStatus.Ready,
    marketType: "revolving",
    ...preview
  };
};

export enum ChangeLenderRoleStatus {
  Ready = "Ready",
  NotBorrower = "NotBorrower"
}

export type ChangeLenderRolePreview = {
  status: ChangeLenderRoleStatus;
};
