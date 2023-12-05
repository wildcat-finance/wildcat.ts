import { BigNumber } from "ethers";
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
  WildcatArchController__factory
} from "./typechain";
import { SignerOrProvider } from "./types";
import { ApolloCache, ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { assert } from "./utils";

type NetworkDeployments = {
  MarketLens: string;
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
    MarketLens: "0xf1D516954f96c1363f8b0aE48D79c8ddE6237847",
    WildcatArchController: "0xfEB516d9D946dD487A9346F6fee11f40C6945eE4",
    WildcatMarketControllerFactory: "0xFd31007613C9F671df6A8D4234901324986Bfd13",
    WildcatSanctionsSentinel: "0x437e0551892C2C9b06d3fFd248fe60572e08CD1A"
  },
  [SupportedChainId.Sepolia]: {
    MarketLens: "0xb3925B31A8AeDCE8CFc885e0D5DAa057A1EA8A72",
    MockArchControllerOwner: "0xa476920af80B587f696734430227869795E2Ea78",
    MockChainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    MockERC20Factory: "0xa19681275008609015793cbfa7C9B7dea103d5F6",
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

export const RAY = BigNumber.from(10).pow(27);

export const WAD = BigNumber.from(10).pow(18);

export const SubgraphUrls = {
  [SupportedChainId.Sepolia]: "https://api.studio.thegraph.com/query/56451/wildcat-finance/v0.0.23",
  [SupportedChainId.Mainnet]:
    "https://api.studio.thegraph.com/query/56451/wildcat-finance-mainnet/v0.0.23"
};

export const getSubgraphClient = (chainId: SupportedChainId): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: SubgraphUrls[chainId]
  });
