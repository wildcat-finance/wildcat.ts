import { BigNumber } from "ethers";
import {
  VaultLens,
  VaultLens__factory,
  WildcatVaultController,
  WildcatVaultController__factory,
  WildcatVaultFactory,
  WildcatVaultFactory__factory,
} from "./typechain";
import { SignerOrProvider } from "./types";

export const LensAddress = "0xDdcBBC4510156441F88D23A6ab4c64eed1775C16";
export const FactoryAddress = "0x2050084919527BDE33Ff2dc9ef3768B2E335AC71";
export const ControllerAddress = "0x41176b30395e1eea87dd6deb6d796c56097f6fa0";

export const getControllerContract = (
  provider: SignerOrProvider
): WildcatVaultController => {
  return WildcatVaultController__factory.connect(ControllerAddress, provider);
};

export const getFactoryContract = (provider: SignerOrProvider): WildcatVaultFactory => {
  return WildcatVaultFactory__factory.connect(FactoryAddress, provider);
};

export const getLensContract = (provider: SignerOrProvider): VaultLens => {
  return VaultLens__factory.connect(LensAddress, provider);
};

export const RAY = BigNumber.from(10).pow(27);
export const WAD = BigNumber.from(10).pow(18);