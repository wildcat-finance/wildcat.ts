import type {
  StandardDeployMarketAndHooksArgs,
  StandardDeployMarketArgs,
  RevolvingDeployMarketAndHooksArgs,
  RevolvingDeployMarketArgs
} from "../lens-types";

export enum DeployMarketStatus {
  Ready = "Ready",
  InsufficientBalance = "InsufficientBalance",
  InsufficientAllowance = "InsufficientAllowance",
  NotRegisteredBorrower = "NotRegisteredBorrower",
  CreateProviderInputsWithoutFactory = "CreateProviderInputsWithoutFactory",
  WrongHooksFactory = "WrongHooksFactory",
  InvalidAccessConfiguration = "InvalidAccessConfiguration",
  MinimumDepositTooHigh = "MinimumDepositTooHigh"
}

type StandardDeployMarketCallPreview =
  | {
      fn: "deployMarket";
      args: StandardDeployMarketArgs;
    }
  | {
      fn: "deployMarketAndHooks";
      args: StandardDeployMarketAndHooksArgs;
    };

type RevolvingDeployMarketCallPreview =
  | {
      fn: "deployMarket";
      args: RevolvingDeployMarketArgs;
    }
  | {
      fn: "deployMarketAndHooks";
      args: RevolvingDeployMarketAndHooksArgs;
    };

export type StandardReadyDeployMarketPreview = {
  status: DeployMarketStatus.Ready;
  marketKind: "standard";
} & StandardDeployMarketCallPreview;

export type RevolvingReadyDeployMarketPreview = {
  status: DeployMarketStatus.Ready;
  marketKind: "revolving";
} & RevolvingDeployMarketCallPreview;

type DeployMarketNotReadyPreview = {
  status: Exclude<DeployMarketStatus, DeployMarketStatus.Ready>;
};

export type ReadyDeployMarketPreview =
  | StandardReadyDeployMarketPreview
  | RevolvingReadyDeployMarketPreview;

export type StandardDeployMarketPreview =
  | StandardReadyDeployMarketPreview
  | {
      status: Exclude<DeployMarketStatus, DeployMarketStatus.Ready>;
    };

export type RevolvingDeployMarketPreview =
  | RevolvingReadyDeployMarketPreview
  | DeployMarketNotReadyPreview;

export type DeployMarketPreview = ReadyDeployMarketPreview | DeployMarketNotReadyPreview;

export const readyStandardDeployMarketPreview = (
  preview: StandardDeployMarketCallPreview
): StandardReadyDeployMarketPreview => {
  return {
    status: DeployMarketStatus.Ready,
    marketKind: "standard",
    ...preview
  };
};

export const readyRevolvingDeployMarketPreview = (
  preview: RevolvingDeployMarketCallPreview
): RevolvingReadyDeployMarketPreview => {
  return {
    status: DeployMarketStatus.Ready,
    marketKind: "revolving",
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
