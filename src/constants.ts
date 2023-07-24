import { BigNumber } from "ethers";
import {
  VaultLens,
  VaultLens__factory,
  WildcatVaultController,
  WildcatVaultController__factory,
  WildcatVaultFactory,
  WildcatVaultFactory__factory,
  MockERC20Factory,
  MockERC20Factory__factory
} from "./typechain";
import { SignerOrProvider } from "./types";

export const LensAddress = "0xD064d1981F721fe35cb45227B9c37b3bd46eAe8d";
export const MockERC20FactoryAddress = "0x7d1d45890c937b260b7345B91d6B457e470B13e4";

export const FactoryAddress = "0x2050084919527BDE33Ff2dc9ef3768B2E335AC71";
export const ControllerAddress = "0x41176b30395e1EeA87dd6deb6d796c56097F6fA0";

export const getControllerContract = (provider: SignerOrProvider): WildcatVaultController => {
  return WildcatVaultController__factory.connect(ControllerAddress, provider);
};

export const getFactoryContract = (provider: SignerOrProvider): WildcatVaultFactory => {
  return WildcatVaultFactory__factory.connect(FactoryAddress, provider);
};

export const getLensContract = (provider: SignerOrProvider): VaultLens => {
  return VaultLens__factory.connect(LensAddress, provider);
};

export const getMockERC20Factory = (provider: SignerOrProvider): MockERC20Factory => {
  return MockERC20Factory__factory.connect(MockERC20FactoryAddress, provider);
};

export const RAY = BigNumber.from(10).pow(27);

export const WAD = BigNumber.from(10).pow(18);
