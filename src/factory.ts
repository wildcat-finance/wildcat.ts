import { FactoryAddress } from "./constants";
import { Token, TokenAmount } from "./token";
import { WildcatVaultFactory, WildcatVaultFactory__factory } from "./typechain";
import { ContractWrapper, SignerOrProvider } from "./types";
import { Vault } from "./vault";

export type VaultParameters = {
  asset: Token;
  namePrefix: string;
  symbolPrefix: string;
  borrower: string;
  controller: string;
  maxTotalSupply: TokenAmount;
  annualInterestBips: number;
  penaltyFeeBips: number;
  gracePeriod: number;
  liquidityCoverageRatio: number;
  interestFeeBips: number;
  feeRecipient: string;
};

export class VaultFactory extends ContractWrapper<WildcatVaultFactory> {
  readonly contractFactory = WildcatVaultFactory__factory;

  constructor(public address: string, provider: SignerOrProvider) {
    super(provider);
  }

  static getFactory(provider: SignerOrProvider): VaultFactory {
    return new VaultFactory(FactoryAddress, provider);
  }

  async deployVault(params: VaultParameters): Promise<Vault> {
    const tx = await this.contract.deployVault({
      asset: params.asset.address,
      namePrefix: params.namePrefix,
      symbolPrefix: params.symbolPrefix,
      borrower: params.borrower,
      controller: params.controller,
      maxTotalSupply: params.maxTotalSupply.raw.toString(),
      annualInterestBips: params.annualInterestBips,
      penaltyFeeBips: params.penaltyFeeBips,
      gracePeriod: params.gracePeriod,
      liquidityCoverageRatio: params.liquidityCoverageRatio,
      interestFeeBips: params.interestFeeBips,
      feeRecipient: params.feeRecipient
    });

    await tx.wait();
    const address = await this.contract.computeVaultAddress(
      params.controller,
      await this.signer.getAddress(),
      params.asset.address
    );
    return Vault.getVault(address, this.provider);
  }

  static async deployVault(params: VaultParameters, provider: SignerOrProvider): Promise<Vault> {
    const factory = VaultFactory.getFactory(provider);
    return factory.deployVault(params);
  }
}
