import { VaultAccount } from "./account";
import { VaultFactory } from "./factory";
import { Token } from "./token";
import { Vault } from "./vault";

export * from "./account";
export * from "./constants";
export * from "./controller";
export * from "./factory";
export * from "./mockerc20factory";
export * from "./token";
export * from "./types";
export * from "./vault";

export const {
  getVaultData,
  getVaultsData,
  getAllVaultsData,
  getVaultsCount,
  getPaginatedVaultsData
} = Vault;

export const { getFactory, deployVault } = VaultFactory;

export const { getVaultAccount, getVaultAccounts, getAllVaultAccounts, getPaginatedVaultAccounts } =
  VaultAccount;

export const { getTokenData, getTokensData } = Token;
