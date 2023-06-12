import { WildcatVaultController, WildcatVaultController__factory } from "./typechain";
import {
  ControllerAddress,
  getControllerContract,
  getFactoryContract,
  getLensContract
} from "./constants";
import { ContractWrapper, SignerOrProvider } from "./types";
import { Vault } from "./vault";

export class VaultController extends ContractWrapper<WildcatVaultController> {
  readonly contractFactory = WildcatVaultController__factory;

  constructor(public address: string, provider: SignerOrProvider) {
    super(provider);
  }

  async isKnownVault(vault: string): Promise<boolean> {
    return await this.contract.vaults(vault);
  }

  // async getTemporaryExcessLiquidityCoverage(vault: string) {
  // const { expiry, liquidityCoverageRatio } = await this.contract.temporaryExcessLiquidityCoverage(
  // vault
  // );
  // }

  async getAllVaults(provider: SignerOrProvider): Promise<Vault[]> {
    const controller = getControllerContract(provider);
    const factory = getFactoryContract(provider);
    const vaults = (
      await this.contract.queryFilter(factory.filters.VaultDeployed(controller.address), 3399789)
    ).map(({ args: { vault } }) => vault);
    console.log("vaults", vaults);
    const metadatas = await getLensContract(provider).getVaultsMetadata(vaults);
    return metadatas.map((x) => Vault.fromVaultMetadataStruct(x, provider));
  }

  static async getController(provider: SignerOrProvider): Promise<VaultController> {
    return new VaultController(ControllerAddress, provider);
  }
}
