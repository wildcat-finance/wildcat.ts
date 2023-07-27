/* eslint-disable prettier/prettier */
import { getAddress } from "ethers/lib/utils";
import { ControllerAddress, FactoryAddress } from "./constants";
import { Token, TokenAmount } from "./token";
import { WildcatVaultFactory, WildcatVaultFactory__factory } from "./typechain";
import { ContractWrapper, Signer, SignerOrProvider } from "./types";
import { Vault } from "./vault";
import { MakeOptional } from "./misc";

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


const DefaultFeeRecipient = getAddress(`0xf335`.padEnd(42, "0"));

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
    return Vault.getVaultData(address, this.provider);
  }

  static async deployVault(params: MakeOptional<VaultParameters, "feeRecipient" | "borrower" | "controller">, signer: Signer): Promise<Vault> {
    const factory = VaultFactory.getFactory(signer);
    return factory.deployVault({
      feeRecipient: DefaultFeeRecipient,
      controller: ControllerAddress,
      borrower: await signer.getAddress(),
      ...params
    });
  }
}
