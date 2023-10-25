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

export const Deployments = {
  MarketLens: "0x20B06D164D7815405fbeDfF2372CD15F418685F8",
  MockArchControllerOwner: "0x6873916D94D1E85b8301d7CAbee17ACe6Ac42993",
  MockChainalysis: "0x1EeBC079aE1e7dCDe31C74A7EF48fA8737673A6a",
  MockERC20Factory: "0xaD28a117e272800AbEC3CE8F02584927E4dA5d3B",
  WildcatArchController: "0x337E38b3b90ca0B208Cda586C843B33d43fad5c4",
  WildcatMarketControllerFactory: "0x7f7799aC66d19fe2FEa5137cD32d7088E07F5cFB",
  WildcatSanctionsSentinel: "0xEF0601C4dF089F3020F373589FfCD8Dea0B4FD76"
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
