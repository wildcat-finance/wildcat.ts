import type { Account, Address, PublicClient, WalletClient } from "viem";

export type WildcatReadClient = {
  publicClient: PublicClient;
};

export type WildcatClient = WildcatReadClient & {
  walletClient?: WalletClient;
  account?: Address;
};

export type WildcatWriteClient = WildcatReadClient & {
  walletClient: WalletClient;
  account: Address;
};

export class WildcatClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WildcatClientError";
  }
}

export const getAccountAddress = (account?: Account | Address): Address | undefined => {
  if (!account) {
    return undefined;
  }
  return typeof account === "string" ? account : account.address;
};

export const getWalletClientAccountAddress = (walletClient?: WalletClient): Address | undefined => {
  return getAccountAddress(walletClient?.account);
};

export const getWildcatClientAccount = (client: WildcatClient): Address | undefined => {
  return client.account ?? getWalletClientAccountAddress(client.walletClient);
};

export const normalizeWildcatClient = (client: WildcatClient): WildcatClient => ({
  ...client,
  account: getWildcatClientAccount(client)
});

export const asWildcatWriteClient = (client: WildcatClient): WildcatWriteClient | undefined => {
  const account = getWildcatClientAccount(client);
  if (!client.walletClient || !account) {
    return undefined;
  }
  return {
    publicClient: client.publicClient,
    walletClient: client.walletClient,
    account
  };
};

export const requireWildcatWriteClient = (client: WildcatClient): WildcatWriteClient => {
  const writeClient = asWildcatWriteClient(client);
  if (!writeClient) {
    throw new WildcatClientError("Wildcat write operations require a wallet client and account");
  }
  return writeClient;
};
