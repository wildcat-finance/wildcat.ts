import { VaultAccount } from "./account";
import { getFactoryContract, getLensContract } from "./constants";
import { Provider, Signer, SignerOrProvider } from "./types";
import { Vault } from "./vault";
export * from "./vault";
export { Signer, Provider, SignerOrProvider } from "./types";
export * from "./account";
export * from "./controller";
export * from "./token";

export async function getAllVaults(provider: SignerOrProvider): Promise<Vault[]> {
  // const controller = getControllerContract(provider);
  const factory = getFactoryContract(provider);
  const currentBlock = await (provider instanceof Provider
    ? provider
    : provider.provider!
  ).getBlockNumber();
  const vaults: string[] = [];
  for (let block = 3399789; block < currentBlock; block += 5000) {
    const from = block;
    const to = Math.min(block + 5000, currentBlock);
    const newVaults = (await factory.queryFilter(factory.filters.VaultDeployed(), from, to)).map(
      ({ args: { vault } }) => vault
    );

    vaults.push(...newVaults);
  }
  const metadatas = await getLensContract(provider).getVaultsMetadata(vaults);
  return metadatas.map((x) => Vault.fromVaultMetadataStruct(x, provider));
}

export async function getAllVaultAccountsForUser(provider: Signer): Promise<VaultAccount[]> {
  const account = await provider.getAddress();
  const vaults = await getAllVaults(provider);
  const accounts = (await Promise.all(vaults.map((vault) => vault.getAccountInfo(account)))).filter(
    (acct) => {
      return acct.userHasBalance || acct.userHasUnderlyingBalance || acct.isBorrower;
    }
  );
  return accounts;
}
