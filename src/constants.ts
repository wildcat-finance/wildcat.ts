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
  MarketLensV2__factory
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
    HooksFactory: "0x0000000000000000000000000000000000000000",
    MarketLens: "0xf1D516954f96c1363f8b0aE48D79c8ddE6237847",
    MarketLensV2: "0x0000000000000000000000000000000000000000",
    WildcatArchController: "0xfEB516d9D946dD487A9346F6fee11f40C6945eE4",
    WildcatMarketControllerFactory: "0xFd31007613C9F671df6A8D4234901324986Bfd13",
    WildcatSanctionsSentinel: "0x437e0551892C2C9b06d3fFd248fe60572e08CD1A"
  },
  [SupportedChainId.Sepolia]: {
    HooksFactory: "0xE3e4B7C9E0Ab4ccbC70e0583Dca7B4Db9B4CFD88",
    MarketLens: "0xb3925B31A8AeDCE8CFc885e0D5DAa057A1EA8A72",
    MarketLensV2: "0xa47237531fae13c82a4361D68aa1e53FC939d70f",
    MockArchControllerOwner: "0xa476920af80B587f696734430227869795E2Ea78",
    MockChainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    MockERC20Factory: "0x54A3103904977DCb3C2fB782059F5431db90C96e",
    WildcatArchController: "0xC003f20F2642c76B81e5e1620c6D8cdEE826408f",
    WildcatMarketControllerFactory: "0xEb97C8E52d7Fdf978a64a538F28271Fd8499b864",
    WildcatSanctionsSentinel: "0xFBCE262eC835be5e6A458cE1722EeCe0E453316B"
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

export const getHooksFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): MarketLensV2 => {
  return MarketLensV2__factory.connect(getDeploymentAddress(chainId, "HooksFactory"), provider);
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

export const SubgraphUrls = {
  [SupportedChainId.Sepolia]:
    "https://api.studio.thegraph.com/query/56451/wildcat-test-deployment/version/latest",
  [SupportedChainId.Mainnet]:
    "https://api.studio.thegraph.com/query/56451/wildcat-finance-mainnet/version/latest"
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
