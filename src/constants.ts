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
  MarketLens: "0x1D2485f3763d316e114d0fBf641220E1B31Bd845",
  MockArchControllerOwner: "0x43f1dB4e70CCb43ccD5D4A7BC033245254cC3909",
  MockChainalysis: "0x8B64E9ae41718D3B030D012c273668b4341b7812",
  MockERC20Factory: "0xFC1ef4095BD39C747CACe66BC9983cafD2134658",
  WildcatArchController: "0x5EA44A0244F35951d0994E0D5ce63baF822C44eE",
  WildcatMarketControllerFactory: "0x664780e218B0C4BDB81FbCD29D7Caf76cdD878de",
  WildcatSanctionsSentinel: "0x377d91d15E0e0De955dFADaDeDf4E16c8E0E5a4D"
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

export const SubgraphUrl = "https://api.studio.thegraph.com/query/56451/wildcat-finance/v0.0.20";

export const SubgraphClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: SubgraphUrl
});
