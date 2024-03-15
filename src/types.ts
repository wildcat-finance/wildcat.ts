import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BaseContract } from "ethers";
import { Token, TokenAmount } from "./token";

export type SignerOrProvider = Signer | Provider;

export { Provider, Signer };

export abstract class ContractWrapper<Contract extends BaseContract> {
  constructor(protected _provider: SignerOrProvider) {}

  protected _contract?: Contract;

  abstract readonly contractFactory: {
    connect(address: string, signerOrProvider: Signer | Provider): Contract;
  };

  abstract get address(): string;

  get signer(): Signer {
    if (this._provider instanceof Signer) {
      return this._provider;
    }
    throw new Error("Provider is not a signer");
  }

  get provider(): SignerOrProvider {
    return this._provider;
  }

  set provider(provider: SignerOrProvider) {
    this._provider = provider;
    if (this._contract) {
      this._contract = this.contractFactory.connect(this.address, this.provider);
    }
    for (const property of Object.values(this)) {
      if (property instanceof ContractWrapper) {
        property.provider = provider;
      }
    }
  }

  get contract(): Contract {
    if (!this._contract) {
      this._contract = this.contractFactory.connect(this.address, this.provider);
    }
    return this._contract;
  }
}

// Use class to give build error if `removeUnusedTxFields` is not called,
// so that we don't accidentally fill fields we want to be derived at the
// time of execution.
export type PartialTransaction = {
  to: string;
  data: string;
  value: string;
};

export type FeeConfiguration = {
  feeRecipient: string;
  protocolFeeBips: number;
  originationFeeToken: Token | undefined;
  originationFeeAmount: TokenAmount | undefined;
};

export type MarketParameterConstraints = {
  minimumDelinquencyGracePeriod: number;
  maximumDelinquencyGracePeriod: number;
  minimumReserveRatioBips: number;
  maximumReserveRatioBips: number;
  minimumDelinquencyFeeBips: number;
  maximumDelinquencyFeeBips: number;
  minimumWithdrawalBatchDuration: number;
  maximumWithdrawalBatchDuration: number;
  minimumAnnualInterestBips: number;
  maximumAnnualInterestBips: number;
};
