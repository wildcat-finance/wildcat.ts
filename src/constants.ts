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
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const Deployments = {
  MarketLens: "0xF0c0ed88e596637b90ce4FBac838f4f57EDB7046",
  MockArchControllerOwner: "0x74275efE86068b8E25eeF58E66FB1FbbF814B78e",
  MockChainalysis: "0xBc3981a458b1ca607EF2A181a3b050fb0AE0D724",
  MockERC20Factory: "0x28eeB2Fe15518F3d51825fDdB30302901064a5BE",
  WildcatArchController: "0xe0b536e3b389b77B9Dc8d7e8E623cbeF69B4ED84",
  WildcatMarketControllerFactory: "0x49C5002EdeA9A79b7A0678D49b1eC1203A024800",
  WildcatSanctionsSentinel: "0xf98daD3014aDF635E070799966c2376e21658F56"
};

// export const LensAddress = "0xB63CC0C9837E4Da8E2111B3e6383aA9a6fDEf342";
// export const MockERC20FactoryAddress = "0x7d1d45890c937b260b7345B91d6B457e470B13e4";

// export const FactoryAddress = "0x851150d7Ad0E846F1B511F1df86Ff8803EF81298";
// export const ControllerAddress = "0xeAbeC7da18bB4Acc65deA76Ef6f2CE898854A6Cf";

export const getControllerContract = (
  provider: SignerOrProvider,
  address: string
): WildcatMarketController => {
  return WildcatMarketController__factory.connect(address, provider);
};

export const getControllerFactoryContract = (
  provider: SignerOrProvider
): WildcatMarketControllerFactory => {
  return WildcatMarketControllerFactory__factory.connect(
    Deployments.WildcatMarketControllerFactory,
    provider
  );
};

export const getArchControllerContract = (provider: SignerOrProvider): WildcatArchController => {
  return WildcatArchController__factory.connect(Deployments.WildcatArchController, provider);
};

export const getLensContract = (provider: SignerOrProvider): MarketLens => {
  return MarketLens__factory.connect(Deployments.MarketLens, provider);
};

export const getMockERC20Factory = (provider: SignerOrProvider): MockERC20Factory => {
  return MockERC20Factory__factory.connect(Deployments.MockERC20Factory, provider);
};

export const getMockArchControllerOwnerContract = (
  provider: SignerOrProvider
): WildcatArchController => {
  return WildcatArchController__factory.connect(Deployments.MockArchControllerOwner, provider);
};

export const RAY = BigNumber.from(10).pow(27);

export const WAD = BigNumber.from(10).pow(18);

export const DeploymentBlockNumber = 4518288;

export const SubgraphUrl = "https://api.studio.thegraph.com/query/56451/wildcat-finance/v0.0.19";

export const SubgraphClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: SubgraphUrl
});
