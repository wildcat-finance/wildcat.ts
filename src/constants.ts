import {
  MarketLens,
  MarketLens__factory,
  WildcatMarketController,
  WildcatMarketController__factory,
  WildcatMarketControllerFactory,
  WildcatMarketControllerFactory__factory,
  MockERC20Factory,
  MockERC20Factory__factory,
  WildcatArchController,
  WildcatArchController__factory,
  MarketLensV2,
  MarketLensV2__factory,
  HooksFactory__factory,
  HooksFactory,
  WildcatCollateralFactory,
  WildcatCollateralFactory__factory,
  CollateralLens__factory,
  CollateralLens
} from "./typechain";
import { MarketParameterConstraints, SignerOrProvider } from "./types";
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { assert } from "./utils";

type NetworkDeployments = {
  HooksFactory: string;
  MarketLens?: string;
  MarketLensV2: string;
  MockArchControllerOwner?: string;
  MockChainalysis?: string;
  MockERC20Factory?: string;
  WildcatArchController: string;
  WildcatMarketControllerFactory?: string;
  WildcatSanctionsSentinel: string;
  Chainalysis: string;
  OpenAccessRoleProvider: string;
  WildcatCollateralFactory?: string;
  BebopSettlementContract?: string;
  CollateralLens?: string;
};

export enum SupportedChainId {
  Mainnet = 1,
  Sepolia = 11155111,
  PlasmaTestnet = 9746,
  PlasmaMainnet = 9745
}

export const SupportedChainIds = [
  SupportedChainId.Mainnet,
  SupportedChainId.Sepolia,
  SupportedChainId.PlasmaTestnet,
  SupportedChainId.PlasmaMainnet
];

export const isSupportedChainId = (chainId: number): chainId is SupportedChainId => {
  return SupportedChainIds.includes(chainId as SupportedChainId);
};

export const hasDeploymentAddress = (
  chainId: SupportedChainId,
  name: keyof NetworkDeployments
): boolean => {
  const deployments = Deployments[chainId];
  return deployments[name] !== undefined;
};

export const Deployments: Record<SupportedChainId, NetworkDeployments> = {
  [SupportedChainId.Mainnet]: {
    HooksFactory: "0xdd7dd3b5076cf89440d05585ff56d246386207be",
    MarketLens: "0xf1D516954f96c1363f8b0aE48D79c8ddE6237847",
    MarketLensV2: "0xfDA5C5B96bb198D2fca1A01d759620B64Ae5afE7",
    WildcatArchController: "0xfEB516d9D946dD487A9346F6fee11f40C6945eE4",
    WildcatMarketControllerFactory: "0xFd31007613C9F671df6A8D4234901324986Bfd13",
    WildcatSanctionsSentinel: "0x437e0551892C2C9b06d3fFd248fe60572e08CD1A",
    Chainalysis: "0x40C57923924B5c5c5455c48D93317139ADDaC8fb",
    OpenAccessRoleProvider: "0x5620553d8881335F74AD19259daaCD1d9B373101",
    BebopSettlementContract: "0xbbbbbBB520d69a9775E85b458C58c648259FAD5F",
    WildcatCollateralFactory: "0xBdf64bd7Ea91A534445d06736a0f0E2a33FfA47c",
    CollateralLens: "0x422489bA6bDdD5954C379C41B6C97Ab0E4494f90"
  },
  [SupportedChainId.Sepolia]: {
    HooksFactory: "0x10A64ABa0159720F8a23E1A552800CA4eb21576C",
    MarketLens: "0xb3925B31A8AeDCE8CFc885e0D5DAa057A1EA8A72",
    MarketLensV2: "0x5D8cEacEe19c06C3b4108b8Ae5B881eb0240B9c7",
    MockArchControllerOwner: "0xa476920af80B587f696734430227869795E2Ea78",
    MockChainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    MockERC20Factory: "0x54A3103904977DCb3C2fB782059F5431db90C96e",
    WildcatArchController: "0xC003f20F2642c76B81e5e1620c6D8cdEE826408f",
    WildcatMarketControllerFactory: "0xEb97C8E52d7Fdf978a64a538F28271Fd8499b864",
    WildcatSanctionsSentinel: "0xFBCE262eC835be5e6A458cE1722EeCe0E453316B",
    Chainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    OpenAccessRoleProvider: "0x9aCdE253F7A51456c48604185C0ceA4Fc9e58E3a",
    WildcatCollateralFactory: "0x58Ab4755221869cfcAe2A4F3EE31d591bA6AE1D0",
    BebopSettlementContract: "0x513826b6bb38fc159f152a4bf6e1ec3650a7ee46",
    CollateralLens: "0x5A49828b3E9Acbc614CDd703601406B1854aA578"
  },
  [SupportedChainId.PlasmaTestnet]: {
    HooksFactory: "0x5Ad00b665eA71E27628D75102B1497CC75E531FB",
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
    HooksFactory: "0xB46bae25AC6D23148531ed1853a8881FD842E517",
    MarketLensV2: "0x7e5d6d9f9a2091dD781118514F5397A8107c81c5",
    WildcatArchController: "0xdb2e0DE97d6d96aa56754635704a4273E0F348ae",
    Chainalysis: "0x38056F7fE6396417b191BF7Dc6a3aA04235f3f46",
    OpenAccessRoleProvider: "0x792F1368f8B8f450c14875eb6FF0028dFc2629b4",
    WildcatSanctionsSentinel: "0x37064895ba2C1e269EAF7FF32564818d08903f5B"
  }
};

export const getDeploymentAddress = (
  chainId: SupportedChainId,
  name: keyof NetworkDeployments
): string => {
  const deployments = Deployments[chainId];
  const address = deployments[name];
  assert(address !== undefined, `Deployment ${name} not found for chain ${chainId}`);
  return address;
};

export const getControllerContract = (
  provider: SignerOrProvider,
  address: string
): WildcatMarketController => {
  return WildcatMarketController__factory.connect(address, provider);
};

export const getControllerFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): WildcatMarketControllerFactory => {
  return WildcatMarketControllerFactory__factory.connect(
    getDeploymentAddress(chainId, "WildcatMarketControllerFactory"),
    provider
  );
};

export const getArchControllerContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): WildcatArchController => {
  return WildcatArchController__factory.connect(
    getDeploymentAddress(chainId, "WildcatArchController"),
    provider
  );
};

export const getLensContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): MarketLens => {
  return MarketLens__factory.connect(getDeploymentAddress(chainId, "MarketLens"), provider);
};

export const getCollateralLensContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): CollateralLens => {
  return CollateralLens__factory.connect(getDeploymentAddress(chainId, "CollateralLens"), provider);
};

export const getHooksFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): HooksFactory => {
  return HooksFactory__factory.connect(getDeploymentAddress(chainId, "HooksFactory"), provider);
};

export const getLensV2Contract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): MarketLensV2 => {
  return MarketLensV2__factory.connect(getDeploymentAddress(chainId, "MarketLensV2"), provider);
};

export const getMockERC20Factory = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): MockERC20Factory => {
  return MockERC20Factory__factory.connect(
    getDeploymentAddress(chainId, "MockERC20Factory"),
    provider
  );
};

export const getMockArchControllerOwnerContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): WildcatArchController => {
  return WildcatArchController__factory.connect(
    getDeploymentAddress(chainId, "MockArchControllerOwner"),
    provider
  );
};

export const getCollateralFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): WildcatCollateralFactory => {
  return WildcatCollateralFactory__factory.connect(
    getDeploymentAddress(chainId, "WildcatCollateralFactory"),
    provider
  );
};

export const SubgraphUrls = {
  [SupportedChainId.Sepolia]: `https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/sepolia/v2.0.23/gn`,
  [SupportedChainId.Mainnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/mainnet/v2.0.22/gn",
  [SupportedChainId.PlasmaTestnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-testnet/v2.0.22/gn",
  [SupportedChainId.PlasmaMainnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-mainnet/v2.0.22/gn"
};

export const getSubgraphClient = (chainId: SupportedChainId): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: SubgraphUrls[chainId]
  });

const day = 86_400;

export const DefaultV2ParameterConstraints: MarketParameterConstraints = {
  minimumDelinquencyGracePeriod: 0,
  maximumDelinquencyGracePeriod: 90 * day,
  minimumReserveRatioBips: 0,
  maximumReserveRatioBips: 10_000,
  minimumDelinquencyFeeBips: 0,
  maximumDelinquencyFeeBips: 10_000,
  minimumWithdrawalBatchDuration: 0,
  maximumWithdrawalBatchDuration: 365 * day,
  minimumAnnualInterestBips: 0,
  maximumAnnualInterestBips: 10_000
};
