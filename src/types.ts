import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BaseContract } from "ethers";
import { Token, TokenAmount } from "./token";
import { SubgraphMarketVersion } from "./gql/graphql";
import { HooksTemplate } from "./access";

// `MarketVersion` remains the existing subgraph/protocol concept.
export { SubgraphMarketVersion as MarketVersion };

// `MarketType` is the SDK routing concept used to select the correct factory.
export const MarketTypes = ["legacy", "revolving"] as const;
export type MarketType = (typeof MarketTypes)[number];
export const DefaultMarketType: MarketType = "legacy";
export const isMarketType = (value: string): value is MarketType => {
  return MarketTypes.includes(value as MarketType);
};

export type SignerOrProvider = Signer | Provider;

export { Provider, Signer };

export abstract class ContractWrapper<Contract extends BaseContract> {
  constructor(protected _provider: SignerOrProvider) {}

  protected _contract?: Contract;

  abstract readonly contractFactory: {
    connect(address: string, signerOrProvider: Signer | Provider): Contract;
  };

  protected abstract _contractAddress: string;

  get signer(): Signer {
    if (Signer.isSigner(this._provider)) {
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
      this._contract = this.contractFactory.connect(this._contractAddress, this.provider);
    }
    for (const property of Object.values(this)) {
      if (property instanceof ContractWrapper) {
        property.provider = provider;
      }
    }
  }

  get contract(): Contract {
    if (!this._contract) {
      this._contract = this.contractFactory.connect(this._contractAddress, this.provider);
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

export type FeeConfigurationV2 = {
  feeRecipient: string;
  protocolFeeBips: number;
} & (
  | {
      originationFeeToken: Token;
      originationFeeAmount: TokenAmount;
      borrowerOriginationFeeBalance?: TokenAmount;
      borrowerOriginationFeeApproval?: TokenAmount;
    }
  | {
      originationFeeToken?: undefined;
      originationFeeAmount?: undefined;
      borrowerOriginationFeeBalance?: undefined;
      borrowerOriginationFeeApproval?: undefined;
    }
);

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

export type HooksFlags = {
  useOnDeposit: boolean;
  useOnQueueWithdrawal: boolean;
  useOnExecuteWithdrawal: boolean;
  useOnTransfer: boolean;
  useOnBorrow: boolean;
  useOnRepay: boolean;
  useOnCloseMarket: boolean;
  useOnNukeFromOrbit: boolean;
  useOnSetMaxTotalSupply: boolean;
  useOnSetAnnualInterestAndReserveRatioBips: boolean;
  useOnSetProtocolFeeBips: boolean;
};

export type MarketHooksInstanceInputs =
  | {
      /** Address of an existing hooks instance to use */
      hooksAddress: string;
      roleProviderFactory?: undefined;
      hooksInstanceName?: undefined;
      existingProviders?: undefined;
      newProviderInputs?: undefined;
    }
  | {
      hooksAddress?: undefined;
      roleProviderFactory?: string;
      hooksInstanceName?: string;
      existingProviders?: ExistingProviderInput[];
      newProviderInputs?: CreateProviderInput[];
    };

export type ExistingProviderInput = {
  providerAddress: string;
  timeToLive: number;
};

export type CreateProviderInput = {
  data: string;
  timeToLive: number;
};

export type OpenTermHooksConfig = {
  hooksAddress: string;
  kind: HooksKind.OpenTerm;
  flags: HooksFlags;
  transferRequiresAccess: boolean;
  depositRequiresAccess: boolean;
  minimumDeposit?: TokenAmount;
  transfersDisabled: boolean;
  allowForceBuyBacks: boolean;
  template?: HooksTemplate;
};

export type FixedTermHooksConfig = {
  hooksAddress: string;
  kind: HooksKind.FixedTerm;
  flags: HooksFlags;
  transferRequiresAccess: boolean;
  depositRequiresAccess: boolean;
  minimumDeposit?: TokenAmount;
  transfersDisabled: boolean;
  allowForceBuyBacks: boolean;
  queueWithdrawalRequiresAccess: boolean;
  fixedTermEndTime: number;
  allowClosureBeforeTerm: boolean;
  allowTermReduction: boolean;
  template?: HooksTemplate;
};

export type HooksConfig = OpenTermHooksConfig | FixedTermHooksConfig;

/* export type HooksConfig = {
  hooksAddress: string;
  hooksKind: HooksKind;
  flags: HooksFlags;
  transferRequiresAccess?: boolean;
  depositRequiresAccess?: boolean;
  minimumDeposit?: TokenAmount;
  transfersDisabled?: boolean;
  allowForceBuyBacks?: boolean;
  queueWithdrawalRequiresAccess?: boolean;
  fixedTermEndTime?: number;
  allowClosureBeforeTerm?: boolean;
  allowTermReduction?: boolean;
  template?: HooksTemplate;
}; */

export enum HooksKind {
  Unknown = "Unknown",
  OpenTerm = "OpenTerm",
  FixedTerm = "FixedTerm"
}

export type RoleProvider = {
  providerAddress: string;
  timeToLive: number;
  isPullProvider: boolean;
  isPushProvider: boolean;
  pushProviderIndex: number;
  pullProviderIndex: number;
  isApproved: boolean;
};

export type HooksCredential = {
  isBlockedFromDeposits: boolean;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
  lastProvider?: RoleProvider;
};

/** Level of access required for accounts to receive a transfer */
export enum TransferAccess {
  /**
   * No transfers allowed
   * `transfersDisabled` = true
   */
  Disabled,
  /**
   * Transfer recipient must have a credential or be a known lender
   * `transfersDisabled` = false, `useOnTransfer` = true (in deployment hooks config)
   */
  RequiresCredential,
  /**
   * Anyone can receive a transfer
   * `transfersDisabled` = false, `useOnTransfer` = false (in deployment hooks config)
   */
  Open
}

/** Level of access required for a lender to make a deposit */
export enum DepositAccess {
  /**
   * Depositors must have a credential
   * `useOnDeposit` = true (in deployment hooks config)
   */
  RequiresCredential,
  /**
   * Anyone can make a deposit
   * `useOnDeposit` = false (in deployment hooks config)
   */
  Open
}

/** Level of access required for a lender to make a withdrawal request */
export enum WithdrawalAccess {
  /**
   * Withdrawing account must have a credential or be a known lender
   * `useOnQueueWithdrawal` = true (in deployment hooks config)
   */
  RequiresCredential,
  /**
   * Anyone can make a withdrawal request
   * `useOnQueueWithdrawal` = false (in deployment hooks config)
   */
  Open
}

export type AddLenderInput = {
  lender: string;
  credentialTimestamp?: number;
};
