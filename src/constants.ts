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

export const LensAddress = "0x078BE578bFB8f359399d3FAecb7e8a5583Af9fa2";
export const MockERC20FactoryAddress = "0x7d1d45890c937b260b7345B91d6B457e470B13e4";

export const FactoryAddress = "0xA7F3b0D71E0e526c9fb352725D7121583f18B2FE";
export const ControllerAddress = "0xE05EF4571Dd4b5B94a7104E33283A42FD238Ef6a";

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
