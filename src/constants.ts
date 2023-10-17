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

export const LensAddress = "0xB63CC0C9837E4Da8E2111B3e6383aA9a6fDEf342";
export const MockERC20FactoryAddress = "0x7d1d45890c937b260b7345B91d6B457e470B13e4";

export const FactoryAddress = "0x851150d7Ad0E846F1B511F1df86Ff8803EF81298";
export const ControllerAddress = "0xeAbeC7da18bB4Acc65deA76Ef6f2CE898854A6Cf";

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
