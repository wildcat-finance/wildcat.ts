import { defaultAbiCoder } from "ethers/lib/utils";
import {
  DefaultV2ParameterConstraints,
  getDeploymentAddress,
  SupportedChainId
} from "../constants";
import { MarketParameters } from "../controller";
import {
  SubgraphAccessControlHooksDataForMarketFragment,
  SubgraphHooksTemplateDataForMarketFragment
} from "../gql/graphql";
import { TokenAmount } from "../token";
import {
  DeployMarketInputsV2Struct,
  HooksFactory,
  HooksFactory__factory,
  HooksInstanceDataStructOutput,
  HooksTemplateDataStructOutput,
  IAccessControlHooks,
  IAccessControlHooks__factory
} from "../typechain";
import {
  ContractWrapper,
  DepositAccess,
  FeeConfigurationV2,
  HooksKind,
  MarketParameterConstraints,
  RoleProvider,
  SignerOrProvider,
  TransferAccess,
  WithdrawalAccess
} from "../types";
import { assert, encodeHooksConfig, parseFeeConfigurationV2 } from "../utils";
import { constants, ContractTransaction } from "ethers";
import { DeployMarketPreview, DeployMarketStatus } from "./validation";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FixedTermHooks extends Omit<FixedTermHooksArgs, "roleProviders" | "constraints"> {}

export class FixedTermHooks extends ContractWrapper<IAccessControlHooks> {
  readonly kind: HooksKind.FixedTerm = HooksKind.FixedTerm;
  readonly contractFactory = IAccessControlHooks__factory;
  public roleProviders: RoleProvider[];
  public constraints: MarketParameterConstraints;
  public _contractAddress = this.address;

  constructor({
    provider,
    roleProviders = [],
    constraints = DefaultV2ParameterConstraints,
    ...args
  }: FixedTermHooksArgs) {
    super(provider);
    Object.assign(this, args);
    this.roleProviders = roleProviders;
    this.constraints = constraints;
  }

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksInstanceDataStructOutput
  ): FixedTermHooks {
    return new FixedTermHooks({
      chainId,
      provider,
      address: data.hooksAddress,
      templateAddress: data.hooksTemplate,
      borrower: data.borrower,
      constraints: data.constraints,
      roleProviders: data.pullProviders.map((p) => ({
        isApproved: true,
        isPullProvider: true,
        providerAddress: p.providerAddress,
        pullProviderIndex: p.pullProviderIndex,
        timeToLive: p.timeToLive
      }))
    });
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: SubgraphAccessControlHooksDataForMarketFragment
  ): FixedTermHooks {
    return new FixedTermHooks({
      chainId,
      provider,
      address: data.id,
      borrower: data.borrower,
      templateAddress: data.hooksTemplate.id,
      roleProviders: data.providers.map((p) => ({
        isApproved: p.isApproved,
        isPullProvider: p.isPullProvider,
        providerAddress: p.providerAddress,
        pullProviderIndex: p.pullProviderIndex,
        timeToLive: p.timeToLive
      }))
    });
  }
}

export type FixedTermHooksArgs = {
  chainId: SupportedChainId;
  provider: SignerOrProvider;
  templateAddress: string;
  constraints?: MarketParameterConstraints;
  address: string;
  borrower: string;
  roleProviders?: RoleProvider[];
};

export type FixedTermHooksTemplateArgs = {
  signerAddress?: string;
  isRegisteredBorrower?: boolean;
  hooksTemplate: string;
  fees: FeeConfigurationV2;
  enabled: boolean;
  index: number;
  name: string;
  totalMarkets: number;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FixedTermHooksTemplate extends FixedTermHooksTemplateArgs {}

export class FixedTermHooksTemplate extends ContractWrapper<HooksFactory> {
  readonly kind: HooksKind.AccessControl = HooksKind.AccessControl;
  readonly contractFactory = HooksFactory__factory;
  protected _contractAddress: string;

  constructor(
    public chainId: SupportedChainId,
    provider: SignerOrProvider,
    args: FixedTermHooksTemplateArgs
  ) {
    super(provider);
    Object.assign(this, args);
    this._contractAddress = getDeploymentAddress(chainId, "HooksFactory");
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    {
      feeRecipient,
      protocolFeeBips,
      disabled,
      id,
      name
    }: SubgraphHooksTemplateDataForMarketFragment,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): FixedTermHooksTemplate {
    return new FixedTermHooksTemplate(chainId, provider, {
      hooksTemplate: id,
      fees: {
        feeRecipient,
        protocolFeeBips
        // originationFeeAmount: rest.ori
      },
      enabled: !disabled,
      index: 0, // @todo
      name,
      totalMarkets: 0, // @todo
      signerAddress,
      isRegisteredBorrower
    });
  }

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksTemplateDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): FixedTermHooksTemplate {
    return new FixedTermHooksTemplate(chainId, provider, {
      enabled: data.enabled,
      fees: parseFeeConfigurationV2(chainId, provider, data.fees),
      hooksTemplate: data.hooksTemplate,
      index: data.index,
      name: data.name,
      totalMarkets: data.totalMarkets.toNumber(),
      signerAddress,
      isRegisteredBorrower
    });
  }

  previewDeployMarket({
    hooksAddress,
    minimumDeposit,
    transferAccess,
    depositAccess,
    withdrawalAccess,
    asset,
    maxTotalSupply,
    salt,
    fixedTermEndTime,
    allowClosureBeforeTerm,
    allowTermReduction,
    ...otherParameters
  }: FixedTermMarketDeploymentArgs): DeployMarketPreview {
    if (this.isRegisteredBorrower !== undefined && !this.isRegisteredBorrower) {
      return { status: DeployMarketStatus.NotRegisteredBorrower };
    }
    {
      const {
        originationFeeAmount,
        borrowerOriginationFeeBalance,
        borrowerOriginationFeeApproval
      } = this.fees;
      if (originationFeeAmount?.gt(0)) {
        if (!borrowerOriginationFeeBalance?.gte(originationFeeAmount)) {
          return { status: DeployMarketStatus.InsufficientBalance };
        }
        if (!borrowerOriginationFeeApproval?.gte(originationFeeAmount)) {
          return { status: DeployMarketStatus.InsufficientAllowance };
        }
      }
    }

    const hooksConfig = encodeHooksConfig({
      hooksAddress: hooksAddress,
      useOnDeposit: depositAccess === DepositAccess.RequiresCredential,
      useOnQueueWithdrawal: withdrawalAccess === WithdrawalAccess.RequiresCredential,
      useOnTransfer: transferAccess === TransferAccess.RequiresCredential
    });
    const hooksData = defaultAbiCoder.encode(
      ["uint32", "uint128", "bool", "bool", "bool"],
      [
        fixedTermEndTime,
        minimumDeposit?.raw ?? 0,
        transferAccess === TransferAccess.Disabled,
        allowClosureBeforeTerm ?? false,
        allowTermReduction ?? false
      ]
    );
    const parameters = {
      ...otherParameters,
      asset: asset.address,
      maxTotalSupply: maxTotalSupply.raw,
      hooks: hooksConfig
    } as DeployMarketInputsV2Struct;
    const originationFeeAmount = this.fees.originationFeeAmount?.raw ?? 0;
    const originationFeeToken = this.fees.originationFeeToken?.address ?? constants.AddressZero;
    if (hooksAddress) {
      return {
        status: DeployMarketStatus.Ready,
        fn: "deployMarket",
        args: [parameters, hooksData, salt, originationFeeToken, originationFeeAmount]
      };
    } else {
      return {
        status: DeployMarketStatus.Ready,
        fn: "deployMarketAndHooks",
        args: [
          this.hooksTemplate,
          "",
          parameters,
          hooksData,
          salt,
          originationFeeToken,
          originationFeeAmount
        ]
      };
    }
  }

  deployMarket({
    ...otherParameters
  }: FixedTermMarketDeploymentArgs): Promise<ContractTransaction> {
    const result = this.previewDeployMarket(otherParameters);
    assert(result.status === DeployMarketStatus.Ready, `Can not deploy market: ${result.status}`);
    if (result.fn === "deployMarket") {
      return this.contract.deployMarket(...result.args);
    } else {
      return this.contract.deployMarketAndHooks(...result.args);
    }
  }
}

export type FixedTermMarketDeploymentArgs = MarketParameters & {
  /** Create2 salt to use for the market deployment */
  salt: string;
  /** Address of an existing hooks instance to use */
  hooksAddress?: string;
  /** Time at which the market converts to open-term */
  fixedTermEndTime: number;
  /** Minimum deposit lenders can make */
  minimumDeposit?: TokenAmount;
  /** Level of access required for accounts to receive a transfer */
  transferAccess: TransferAccess;
  /** Level of access required for a lender to make a deposit */
  depositAccess: DepositAccess;
  /** Level of access required for a lender to make a withdrawal request */
  withdrawalAccess: WithdrawalAccess;
  /** Whether the borrower can close a loan before the term expires */
  allowClosureBeforeTerm?: boolean;
  /** Whether borrower can reduce the duration of the loan */
  allowTermReduction?: boolean;
};
