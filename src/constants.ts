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
  MarketLens: string;
  MarketLensV2: string;
  MockArchControllerOwner?: string;
  MockChainalysis?: string;
  MockERC20Factory?: string;
  WildcatArchController: string;
  WildcatMarketControllerFactory: string;
  WildcatSanctionsSentinel: string;
  Chainalysis: string;
  OpenAccessRoleProvider: string;
  WildcatCollateralFactory?: string;
  BebopSettlementContract: string;
  CollateralLens?: string;
};

export enum SupportedChainId {
  Mainnet = 1,
  Sepolia = 11155111
}

export const SupportedChainIds = [SupportedChainId.Mainnet, SupportedChainId.Sepolia];

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
    MarketLensV2: "0xFfA74a0e4090200BE6895A5D349cA88AC32D1b5C",
    WildcatArchController: "0xfEB516d9D946dD487A9346F6fee11f40C6945eE4",
    WildcatMarketControllerFactory: "0xFd31007613C9F671df6A8D4234901324986Bfd13",
    WildcatSanctionsSentinel: "0x437e0551892C2C9b06d3fFd248fe60572e08CD1A",
    Chainalysis: "0x40C57923924B5c5c5455c48D93317139ADDaC8fb",
    OpenAccessRoleProvider: "0x5620553d8881335F74AD19259daaCD1d9B373101",
    BebopSettlementContract: "0xbbbbbBB520d69a9775E85b458C58c648259FAD5F"
  },
  [SupportedChainId.Sepolia]: {
    HooksFactory: "0x10A64ABa0159720F8a23E1A552800CA4eb21576C",
    MarketLens: "0xb3925B31A8AeDCE8CFc885e0D5DAa057A1EA8A72",
    MarketLensV2: "0x6381a0eCaa64Ec7A7F3c255d1A12Cc4863584014",
    MockArchControllerOwner: "0xa476920af80B587f696734430227869795E2Ea78",
    MockChainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    MockERC20Factory: "0x54A3103904977DCb3C2fB782059F5431db90C96e",
    WildcatArchController: "0xC003f20F2642c76B81e5e1620c6D8cdEE826408f",
    WildcatMarketControllerFactory: "0xEb97C8E52d7Fdf978a64a538F28271Fd8499b864",
    WildcatSanctionsSentinel: "0xFBCE262eC835be5e6A458cE1722EeCe0E453316B",
    Chainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    OpenAccessRoleProvider: "0x9aCdE253F7A51456c48604185C0ceA4Fc9e58E3a",
    WildcatCollateralFactory: "0x58D15313379cce02693bc50E75085f79386Bda41",
    BebopSettlementContract: "0x7815C2FEE9B582fD40512F13986951C832264eeE",
    CollateralLens: "0x5FCea9a52e325D68357C7E8e0b85Fc31E84EfF3a"
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
  [SupportedChainId.Sepolia]: `https://subgraph.satsuma-prod.com/db4945988e6f/dillons-team--345508/sepolia/version/v2.0.18/api`,
  [SupportedChainId.Mainnet]:
    "https://subgraph.satsuma-prod.com/db4945988e6f/dillons-team--345508/mainnet/api"
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
