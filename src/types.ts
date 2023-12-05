import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { AccessList } from "@ethersproject/transactions";
import { BaseContract, BigNumber, PopulatedTransaction } from "ethers";
import { assert } from "./utils";

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
