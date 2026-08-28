import {
  DeployableMarketKind,
  DeployableMarketKinds,
  HooksFactoryMetadata,
  MarketKind
} from "../domain";
import { assert } from "../utils/assert";
import { SupportedChainId } from "./chains";

export type NetworkDeployments = {
  HooksFactoryStandard: string;
  HooksFactoryRevolving?: string;
  MarketLens?: string;
  MarketLensV2: string;
  MarketLensV2_5?: string;
  MockArchControllerOwner?: string;
  MockChainalysis?: string;
  MockERC20Factory?: string;
  AccessListRoleProviderFactory?: string;
  WildcatBorrowerIdentityRegistry?: string;
  WildcatArchController: string;
  WildcatMarketControllerFactory?: string;
  WildcatSanctionsSentinel: string;
  Chainalysis: string;
  OpenAccessRoleProvider: string;
  WildcatCollateralFactory?: string;
  Wildcat4626WrapperFactory?: string;
  BebopSettlementContract?: string;
  CollateralLens?: string;
};

export type HooksFactoryDeploymentName = "HooksFactoryStandard" | "HooksFactoryRevolving";
export type LatestLensDeploymentName = "MarketLensV2" | "MarketLensV2_5";

export type HooksFactoryDeploymentTarget = {
  address: string;
  marketKind: DeployableMarketKind;
  deploymentName: HooksFactoryDeploymentName;
};

export type HooksFactoryDeploymentTargetIssueCode =
  | "MISSING_INDEXED_FACTORY"
  | "FACTORY_NOT_INDEXED"
  | "FACTORY_NOT_CONFIGURED"
  | "FACTORY_NOT_DEPLOYMENT_TARGET"
  | "FACTORY_MARKET_KIND_MISMATCH"
  | "FACTORY_ARCH_CONTROLLER_MISMATCH"
  | "FACTORY_SENTINEL_MISMATCH"
  | "FACTORY_NOT_ACTIVE";

export type HooksFactoryDeploymentTargetIssue = {
  code: HooksFactoryDeploymentTargetIssueCode;
  target: HooksFactoryDeploymentTarget;
  factory?: HooksFactoryMetadata;
};

const HooksFactoryDeploymentNamesByMarketKind: Record<
  DeployableMarketKind,
  HooksFactoryDeploymentName
> = {
  standard: "HooksFactoryStandard",
  revolving: "HooksFactoryRevolving"
};

export const Deployments: Record<SupportedChainId, NetworkDeployments> = {
  [SupportedChainId.Mainnet]: {
    HooksFactoryStandard: "0xdd7dd3b5076cf89440d05585ff56d246386207be",
    MarketLens: "0xf1D516954f96c1363f8b0aE48D79c8ddE6237847",
    MarketLensV2: "0xfDA5C5B96bb198D2fca1A01d759620B64Ae5afE7",
    WildcatArchController: "0xfEB516d9D946dD487A9346F6fee11f40C6945eE4",
    WildcatMarketControllerFactory: "0xFd31007613C9F671df6A8D4234901324986Bfd13",
    WildcatSanctionsSentinel: "0x437e0551892C2C9b06d3fFd248fe60572e08CD1A",
    Chainalysis: "0x40C57923924B5c5c5455c48D93317139ADDaC8fb",
    OpenAccessRoleProvider: "0x5620553d8881335F74AD19259daaCD1d9B373101",
    BebopSettlementContract: "0xbbbbbBB520d69a9775E85b458C58c648259FAD5F",
    WildcatCollateralFactory: "0xBdf64bd7Ea91A534445d06736a0f0E2a33FfA47c",
    CollateralLens: "0x422489bA6bDdD5954C379C41B6C97Ab0E4494f90",
    Wildcat4626WrapperFactory: "0xEA6DE11f8F3F83c79bD9d8Db5517fCFDf2Bb148a"
  },
  [SupportedChainId.Sepolia]: {
    HooksFactoryStandard: "0x89797b782cA5b4BBFC975146B98ba3941Fe26C56",
    HooksFactoryRevolving: "0xb3FBD4FBeb1EE4BEE7afdbC4A75C7c4E97CF105C",
    MarketLens: "0xb3925B31A8AeDCE8CFc885e0D5DAa057A1EA8A72",
    MarketLensV2: "0x5D8cEacEe19c06C3b4108b8Ae5B881eb0240B9c7",
    MarketLensV2_5: "0x3e0A214d105463719F18DaA850246E770c9c7BDb",
    MockArchControllerOwner: "0x981f1Fb406bD7a8385f9373c08Ab4c832Ed0d508",
    MockChainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    MockERC20Factory: "0x54A3103904977DCb3C2fB782059F5431db90C96e",
    AccessListRoleProviderFactory: "0x92995EA2ba572E4Cb8bB41E30f813BeB77FD4974",
    WildcatBorrowerIdentityRegistry: "0xc2cF90781595203D1e75c28246b306C95d4b8b21",
    WildcatArchController: "0xC003f20F2642c76B81e5e1620c6D8cdEE826408f",
    WildcatMarketControllerFactory: "0xEb97C8E52d7Fdf978a64a538F28271Fd8499b864",
    WildcatSanctionsSentinel: "0xFBCE262eC835be5e6A458cE1722EeCe0E453316B",
    Chainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    OpenAccessRoleProvider: "0x9aCdE253F7A51456c48604185C0ceA4Fc9e58E3a",
    WildcatCollateralFactory: "0x58Ab4755221869cfcAe2A4F3EE31d591bA6AE1D0",
    BebopSettlementContract: "0x513826b6bb38fc159f152a4bf6e1ec3650a7ee46",
    CollateralLens: "0x5A49828b3E9Acbc614CDd703601406B1854aA578",
    Wildcat4626WrapperFactory: "0x31D8D5564Ce11f764E74beca5B4e8d363046949f"
  },
  [SupportedChainId.PlasmaTestnet]: {
    HooksFactoryStandard: "0x5Ad00b665eA71E27628D75102B1497CC75E531FB",
    MarketLensV2: "0xBA370992D7041b5C3B9AEBc61E0CC52C57138918",
    MockArchControllerOwner: "0x2BF8b4eA29259C01eB2Cc6BF6bd21A6F4D23fD8f",
    MockChainalysis: "0x0ac22d06121fc336B2F3DBeb284df65C97BcA547",
    MockERC20Factory: "0xF3fE96705d85A1592B31592B628667eA21fdd7C7",
    WildcatArchController: "0x1EeBC079aE1e7dCDe31C74A7EF48fA8737673A6a",
    WildcatSanctionsSentinel: "0x7cc91e3c64A0b5844650d586B87B291AC3A3aaD4",
    Chainalysis: "0x0ac22d06121fc336B2F3DBeb284df65C97BcA547",
    OpenAccessRoleProvider: "0xC9490f78A131c51829cda5C4455E88CAAc6246f0"
  },
  [SupportedChainId.PlasmaMainnet]: {
    HooksFactoryStandard: "0xB46bae25AC6D23148531ed1853a8881FD842E517",
    MarketLensV2: "0x7e5d6d9f9a2091dD781118514F5397A8107c81c5",
    WildcatArchController: "0xdb2e0DE97d6d96aa56754635704a4273E0F348ae",
    Chainalysis: "0x38056F7fE6396417b191BF7Dc6a3aA04235f3f46",
    OpenAccessRoleProvider: "0x792F1368f8B8f450c14875eb6FF0028dFc2629b4",
    WildcatSanctionsSentinel: "0x37064895ba2C1e269EAF7FF32564818d08903f5B"
  }
};

export const hasDeploymentAddress = (
  chainId: SupportedChainId,
  name: keyof NetworkDeployments
): boolean => Deployments[chainId][name] !== undefined;

export const getDeploymentAddress = (
  chainId: SupportedChainId,
  name: keyof NetworkDeployments
): string => {
  const address = Deployments[chainId][name];
  assert(address !== undefined, `Deployment ${name} not found for chain ${chainId}`);
  return address;
};

export const getHooksFactoryDeploymentName = (
  marketKind: DeployableMarketKind
): HooksFactoryDeploymentName => HooksFactoryDeploymentNamesByMarketKind[marketKind];

export const hasHooksFactoryDeployment = (
  chainId: SupportedChainId,
  marketKind: DeployableMarketKind
): boolean => hasDeploymentAddress(chainId, getHooksFactoryDeploymentName(marketKind));

export const getHooksFactoryAddress = (
  chainId: SupportedChainId,
  marketKind: DeployableMarketKind
): string => getDeploymentAddress(chainId, getHooksFactoryDeploymentName(marketKind));

export const getConfiguredHooksFactoryTargets = (
  chainId: SupportedChainId
): HooksFactoryDeploymentTarget[] =>
  DeployableMarketKinds.reduce<HooksFactoryDeploymentTarget[]>((targets, marketKind) => {
    if (hasHooksFactoryDeployment(chainId, marketKind)) {
      const deploymentName = getHooksFactoryDeploymentName(marketKind);
      targets.push({
        address: getDeploymentAddress(chainId, deploymentName),
        marketKind,
        deploymentName
      });
    }
    return targets;
  }, []);

/**
 * Cross-check static transaction authority against indexer configuration.
 * Historical or otherwise extra indexed factories are intentionally ignored.
 */
export const getHooksFactoryDeploymentTargetIssues = (
  chainId: SupportedChainId,
  factories: readonly HooksFactoryMetadata[]
): HooksFactoryDeploymentTargetIssue[] => {
  const factoriesByAddress = new Map(
    factories.map((factory) => [factory.address.toLowerCase(), factory])
  );
  return getConfiguredHooksFactoryTargets(chainId).flatMap((target) => {
    const factory = factoriesByAddress.get(target.address.toLowerCase());
    if (!factory) return [{ code: "MISSING_INDEXED_FACTORY", target }];

    const issues: HooksFactoryDeploymentTargetIssue[] = [];
    if (!factory.indexed) issues.push({ code: "FACTORY_NOT_INDEXED", target, factory });
    if (!factory.configured) issues.push({ code: "FACTORY_NOT_CONFIGURED", target, factory });
    if (!factory.deploymentTarget) {
      issues.push({ code: "FACTORY_NOT_DEPLOYMENT_TARGET", target, factory });
    }
    if (factory.marketKind !== target.marketKind) {
      issues.push({ code: "FACTORY_MARKET_KIND_MISMATCH", target, factory });
    }
    if (
      factory.archController.toLowerCase() !==
      getDeploymentAddress(chainId, "WildcatArchController").toLowerCase()
    ) {
      issues.push({ code: "FACTORY_ARCH_CONTROLLER_MISMATCH", target, factory });
    }
    if (
      factory.sentinel.toLowerCase() !==
      getDeploymentAddress(chainId, "WildcatSanctionsSentinel").toLowerCase()
    ) {
      issues.push({ code: "FACTORY_SENTINEL_MISMATCH", target, factory });
    }
    if (factory.lifecycle !== "active") {
      issues.push({ code: "FACTORY_NOT_ACTIVE", target, factory });
    }
    return issues;
  });
};

export const getConfiguredMarketKindForHooksFactory = (
  chainId: SupportedChainId,
  hooksFactoryAddress: string
): MarketKind => {
  const normalizedAddress = hooksFactoryAddress.toLowerCase();
  return (
    getConfiguredHooksFactoryTargets(chainId).find(
      ({ address }) => address.toLowerCase() === normalizedAddress
    )?.marketKind ?? "unknown"
  );
};

export const getLatestLensDeploymentName = (chainId: SupportedChainId): LatestLensDeploymentName =>
  hasDeploymentAddress(chainId, "MarketLensV2_5") ? "MarketLensV2_5" : "MarketLensV2";

export const getLatestLensAddress = (chainId: SupportedChainId): string =>
  getDeploymentAddress(chainId, getLatestLensDeploymentName(chainId));
