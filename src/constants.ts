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
  MarketLens: "0x5d14d290EEA69584106A381910eaa93c2b21c6b2",
  MockArchControllerOwner: "0x4e55E20cC4Ff6b69E6b28Ac29DcC55c0f8937cCb",
  MockChainalysis: "0x1EeBC079aE1e7dCDe31C74A7EF48fA8737673A6a",
  MockERC20Factory: "0xAE18c1988b7b947140b5FD2582ac63B8756bfd7E",
  WildcatArchController: "0x61C3F23157B6657847cBDdA7eD08F30BB247E943",
  WildcatMarketControllerFactory: "0x0d54Eb7eB8AB39E8A26535dAA970BaC6B61e741A",
  WildcatSanctionsSentinel: "0x4385E0888DAEa92E13A42BB74fC1D179C5E67fF3"
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

export const SubgraphUrl = "https://api.studio.thegraph.com/query/56451/wildcat-finance/v0.0.16";

export const SubgraphClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: SubgraphUrl
});
