import { WildcatVaultController, WildcatVaultController__factory } from "./typechain";
import { ControllerAddress, getLensContract } from "./constants";
import { ContractWrapper, SignerOrProvider } from "./types";
import { Vault } from "./vault";
import { VaultFactory, VaultParameters } from "./factory";
import { MakeOptional } from "./misc";

export class VaultController extends ContractWrapper<WildcatVaultController> {
  readonly contractFactory = WildcatVaultController__factory;

  constructor(public address: string, provider: SignerOrProvider) {
    super(provider);
  }

  async isKnownVault(vault: string): Promise<boolean> {
    return await this.contract.vaults(vault);
  }

  async getAllVaults(provider: SignerOrProvider): Promise<Vault[]> {
    /* const factory = getFactoryContract(provider);
    const vaults = (
      await this.contract.queryFilter(factory.filters.VaultDeployed(ControllerAddress), 3399789)
    ).map(({ args: { vault } }) => vault);
    console.log("vaults", vaults); */
    const metadatas = (await getLensContract(provider).getAllVaultsData()).filter(
      (x) => x.controller === this.address
    );
    return metadatas.map((x) => Vault.fromVaultMetadataStruct(x, provider));
  }

  static async getController(provider: SignerOrProvider): Promise<VaultController> {
    return new VaultController(ControllerAddress, provider);
  }

  async deployVault(
    params: Omit<MakeOptional<VaultParameters, "feeRecipient" | "borrower">, "controller">
  ): Promise<Vault> {
    return VaultFactory.deployVault({ ...params, controller: this.address }, this.signer);
  }
}
