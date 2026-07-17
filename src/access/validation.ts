import type {
  StandardDeployMarketAndHooksArgs,
  StandardDeployMarketArgs,
  RevolvingDeployMarketAndHooksArgs,
  RevolvingDeployMarketArgs
} from "../lens-types";
import {
  getDeploymentAddress,
  getHooksFactoryAddress,
  hasHooksFactoryDeployment,
  SupportedChainId
} from "../config";
import { DeployableMarketKind, HooksKind, HooksTemplateRegistrationMetadata } from "../domain";

export enum DeployMarketStatus {
  Ready = "Ready",
  InsufficientBalance = "InsufficientBalance",
  InsufficientAllowance = "InsufficientAllowance",
  NotRegisteredBorrower = "NotRegisteredBorrower",
  CreateProviderInputsWithoutFactory = "CreateProviderInputsWithoutFactory",
  HooksTemplateDisabled = "HooksTemplateDisabled",
  HooksTemplateRegistrationUnavailable = "HooksTemplateRegistrationUnavailable",
  WrongHooksFactory = "WrongHooksFactory",
  HooksFactoryRegistrationUnknown = "HooksFactoryRegistrationUnknown",
  HooksFactoryNotRegistered = "HooksFactoryNotRegistered",
  HooksFactoryNotDeploymentTarget = "HooksFactoryNotDeploymentTarget",
  InvalidAccessConfiguration = "InvalidAccessConfiguration",
  MinimumDepositTooHigh = "MinimumDepositTooHigh"
}

export type HooksTemplateDeploymentAuthority = {
  chainId: SupportedChainId;
  hooksFactory: string;
  hooksTemplate: string;
  kind: HooksKind;
  enabled: boolean;
  isRegisteredHooksFactory?: boolean;
  registration?: HooksTemplateRegistrationMetadata;
};

/** Return the first static authority failure for a prospective market deployment. */
export const getHooksTemplateDeploymentStatus = (
  template: HooksTemplateDeploymentAuthority,
  marketKind: DeployableMarketKind
): Exclude<DeployMarketStatus, DeployMarketStatus.Ready> | undefined => {
  // `enabled` is the caller's freshest view. Registration metadata may lag the
  // lens/RPC overlay and must not independently veto a live-enabled template.
  if (!template.enabled) {
    return DeployMarketStatus.HooksTemplateDisabled;
  }
  if (!template.registration) {
    return DeployMarketStatus.HooksTemplateRegistrationUnavailable;
  }
  if (template.isRegisteredHooksFactory === undefined) {
    return DeployMarketStatus.HooksFactoryRegistrationUnknown;
  }
  if (!template.isRegisteredHooksFactory) {
    return DeployMarketStatus.HooksFactoryNotRegistered;
  }
  if (!hasHooksFactoryDeployment(template.chainId, marketKind)) {
    return DeployMarketStatus.WrongHooksFactory;
  }
  const expectedHooksFactory = getHooksFactoryAddress(template.chainId, marketKind);
  if (template.hooksFactory.toLowerCase() !== expectedHooksFactory.toLowerCase()) {
    return DeployMarketStatus.WrongHooksFactory;
  }

  const registration = template.registration;
  const factory = registration.hooksFactory;
  const registrationMatchesTemplate =
    registration.hooksTemplate.address.toLowerCase() === template.hooksTemplate.toLowerCase();
  const registrationMatchesKind = registration.hooksTemplate.kind === template.kind;
  const registrationMatchesFactory =
    factory.address.toLowerCase() === template.hooksFactory.toLowerCase();
  if (
    !registrationMatchesTemplate ||
    !registrationMatchesKind ||
    !registrationMatchesFactory ||
    !factory.indexed ||
    !factory.configured ||
    !factory.deploymentTarget ||
    factory.marketKind !== marketKind ||
    factory.archController.toLowerCase() !==
      getDeploymentAddress(template.chainId, "WildcatArchController").toLowerCase() ||
    factory.sentinel.toLowerCase() !==
      getDeploymentAddress(template.chainId, "WildcatSanctionsSentinel").toLowerCase() ||
    factory.lifecycle !== "active"
  ) {
    return DeployMarketStatus.HooksFactoryNotDeploymentTarget;
  }
  return undefined;
};

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
