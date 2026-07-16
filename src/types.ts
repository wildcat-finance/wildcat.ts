import type { Hash, TransactionReceipt } from "viem";
import { Token, TokenAmount } from "./token";
import { SubgraphMarketVersion } from "./gql/graphql";
import { HooksTemplate } from "./access";
import { isEthersSigner } from "./internal/ethers-signer";

// `MarketVersion` remains the existing subgraph/protocol concept.
export { SubgraphMarketVersion as MarketVersion };

// `MarketType` is the SDK routing concept used to select the correct factory.
export const MarketTypes = ["legacy", "revolving"] as const;
export type MarketType = (typeof MarketTypes)[number];
export const DefaultMarketType: MarketType = "legacy";
export const isMarketType = (value: string): value is MarketType => {
  return MarketTypes.includes(value as MarketType);
};

export type RpcRequestArgs = {
  method: string;
  params?: unknown;
};

export type Provider = {
  // Keep provider values structurally compatible with ethers-based downstream code
  // while the SDK runtime no longer imports ethers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  request?: (args: RpcRequestArgs) => Promise<unknown>;
  send?: (method: string, params: unknown[]) => Promise<unknown>;
  call: (transaction: { to?: string; data?: string }, blockNumber?: number) => Promise<string>;
  getCode?: (address: string) => Promise<string>;
  provider?: unknown;
};

export type Signer = {
  _isSigner?: boolean;
  provider?: Provider;
  chainId?: number;
  call: (transaction: { to?: string; data?: string }, blockNumber?: number) => Promise<string>;
  getCode?: (address: string) => Promise<string>;
  getAddress: () => Promise<string>;
  sendTransaction: (transaction: {
    to?: string;
    data?: string;
    value?: string;
  }) => Promise<{ hash: string; wait?: () => Promise<unknown> }>;
};

export type SignerOrProvider = Signer | Provider;

export const Signer = {
  isSigner: isEthersSigner
} as const;

export abstract class ContractWrapper {
  public contract: { address: string } = { address: "" };

  constructor(protected _provider: SignerOrProvider) {}

  get signer(): Signer {
    if (isEthersSigner(this._provider)) {
      return this._provider;
    }
    throw new Error("Provider is not a signer");
  }

  get provider(): SignerOrProvider {
    return this._provider;
  }

  set provider(provider: SignerOrProvider) {
    this._provider = provider;
    for (const property of Object.values(this)) {
      if (property instanceof ContractWrapper) {
        property.provider = provider;
      }
    }
  }
}

export type PreparedTransaction = {
  to: string;
  data: string;
  value: string;
};

export type SafeTransactionInput = {
  to: string;
  data: string;
  value: string;
};

export type PartialTransaction = PreparedTransaction;

export type SubmittedTransaction = {
  hash: Hash;
  wait: () => Promise<TransactionReceipt>;
};

export type TransactionHashLike =
  | string
  | {
      hash: string;
    };

export type TransactionHash = SubmittedTransaction & {
  toString: () => Hash;
  valueOf: () => Hash;
  [Symbol.toPrimitive]: () => Hash;
};

export const toTransactionHashString = (transaction: TransactionHashLike): Hash => {
  if (typeof transaction === "string") {
    return transaction as Hash;
  }
  return transaction.hash as Hash;
};

export type SubmittedTransactionResult<T> = {
  hash: Hash;
  receipt: TransactionReceipt;
  transaction: SubmittedTransaction;
  result: T;
};

export type SubmittedDeployment<T> = SubmittedTransactionResult<T>;

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
  /** Present on V2.5 lens data; older subgraphs and lenses do not expose this bit. */
  useOnExecutePendingAnnualInterestBipsReduction?: boolean;
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

export type PeriodicTermHooksConfig = {
  hooksAddress: string;
  kind: HooksKind.PeriodicTerm;
  flags: HooksFlags;
  transferRequiresAccess: boolean;
  depositRequiresAccess: boolean;
  minimumDeposit?: TokenAmount;
  transfersDisabled: boolean;
  queueWithdrawalRequiresAccess: boolean;
  firstWithdrawalWindowStart: number;
  periodDuration: number;
  withdrawalWindowDuration: number;
  periodicTermClosed: boolean;
  pendingAprChangeAnnualInterestBips: number;
  pendingAprChangeProposalTimestamp: number;
  pendingAprChangeResponseWindowStart: number;
  pendingAprChangeResponseWindowEnd: number;
  template?: HooksTemplate;
};

export type HooksConfig = OpenTermHooksConfig | FixedTermHooksConfig | PeriodicTermHooksConfig;

export enum HooksKind {
  Unknown = "Unknown",
  OpenTerm = "OpenTerm",
  FixedTerm = "FixedTerm",
  PeriodicTerm = "PeriodicTerm"
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
   * The hook contract may enable `useOnDeposit` after deployment to enforce a
   * positive initial minimum without making deposits credential-gated.
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
