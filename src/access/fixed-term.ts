import { defaultAbiCoder } from "ethers/lib/utils";
import {
  DefaultV2ParameterConstraints,
  getDeploymentAddress,
  SupportedChainId
} from "../constants";
import { MarketParameters } from "../controller";
import {
  SubgraphHooksInstanceDataFragment,
  SubgraphHooksTemplateDataFragment
} from "../gql/graphql";
import { Token, TokenAmount } from "../token";
import {
  DeployMarketInputsV2Struct,
  HooksFactory,
  HooksFactory__factory,
  HooksInstanceDataStructOutput,
  HooksTemplateDataStructOutput,
  IOpenTermHooks,
  IOpenTermHooks__factory
} from "../typechain";
import {
  ContractWrapper,
  DepositAccess,
  FeeConfigurationV2,
  HooksKind,
  MarketHooksInstanceInputs,
  MarketParameterConstraints,
  RoleProvider,
  SignerOrProvider,
  TransferAccess,
  WithdrawalAccess
} from "../types";
import { assert, encodeHooksConfig, parseFeeConfigurationV2 } from "../utils";
import { BigNumber, constants, ContractTransaction } from "ethers";
import { DeployMarketPreview, DeployMarketStatus } from "./validation";
import { encodeMarketHooksInstanceInputs } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FixedTermHooks extends Omit<FixedTermHooksArgs, "roleProviders" | "constraints"> {}

const NullProviderIndex = BigNumber.from(2).pow(24).sub(1).toNumber();

export class FixedTermHooks extends ContractWrapper<IOpenTermHooks> {
  readonly kind: HooksKind.FixedTerm = HooksKind.FixedTerm;
  readonly contractFactory = IOpenTermHooks__factory;
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

  updateWith(
    data: HooksInstanceDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): void {
    this.hooksTemplate.updateWith(data.hooksTemplate, signerAddress, isRegisteredBorrower);
    this.name = data.name;
    this.roleProviders = [...data.pullProviders, ...data.pushProviders].map((p) => ({
      isApproved: true,
      providerAddress: p.providerAddress,
      isPullProvider: p.pullProviderIndex !== NullProviderIndex,
      pullProviderIndex: p.pullProviderIndex,
      isPushProvider: p.pushProviderIndex !== NullProviderIndex,
      pushProviderIndex: p.pushProviderIndex,
      timeToLive: p.timeToLive
    }));
  }

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksInstanceDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): FixedTermHooks {
    return new FixedTermHooks({
      chainId,
      provider,
      address: data.hooksAddress,
      name: data.name,
      hooksTemplate: FixedTermHooksTemplate.fromLensData(
        chainId,
        provider,
        data.hooksTemplate,
        signerAddress,
        isRegisteredBorrower
      ),
      borrower: data.borrower,
      constraints: data.constraints,
      roleProviders: [...data.pullProviders, ...data.pushProviders].map((p) => ({
        isApproved: true,
        providerAddress: p.providerAddress,
        isPullProvider: p.pullProviderIndex !== NullProviderIndex,
        pullProviderIndex: p.pullProviderIndex,
        isPushProvider: p.pushProviderIndex !== NullProviderIndex,
        pushProviderIndex: p.pushProviderIndex,
        timeToLive: p.timeToLive
      }))
    });
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: SubgraphHooksInstanceDataFragment,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): FixedTermHooks {
    return new FixedTermHooks({
      chainId,
      provider,
      borrower: data.borrower,
      address: data.id,
      hooksTemplate: FixedTermHooksTemplate.fromSubgraphData(
        chainId,
        provider,
        data.hooksTemplate,
        signerAddress,
        isRegisteredBorrower
      ),
      name: data.name,
      roleProviders: data.providers.map((p) => ({
        isApproved: p.isApproved,
        providerAddress: p.providerAddress,
        isPullProvider: p.isPullProvider,
        pullProviderIndex: p.pullProviderIndex,
        isPushProvider: p.isPushProvider,
        pushProviderIndex: p.pushProviderIndex,
        timeToLive: p.timeToLive
      })),
      numMarkets: data.numMarkets
    });
  }
}

export type FixedTermHooksArgs = {
  chainId: SupportedChainId;
  provider: SignerOrProvider;
  address: string;
  hooksTemplate: FixedTermHooksTemplate;
  constraints?: MarketParameterConstraints;
  borrower: string;
  roleProviders?: RoleProvider[];
  name: string;
  numMarkets?: number;
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
  readonly kind: HooksKind.FixedTerm = HooksKind.FixedTerm;
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

  updateWith(
    data: HooksTemplateDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): void {
    this.fees = parseFeeConfigurationV2(this.chainId, this.provider, data.fees);
    this.enabled = data.enabled;
    this.index = data.index;
    this.name = data.name;
    this.totalMarkets = data.totalMarkets.toNumber();
    this.signerAddress = signerAddress;
    this.isRegisteredBorrower = isRegisteredBorrower;
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

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    {
      feeRecipient,
      protocolFeeBips,
      disabled,
      id,
      name,
      originationFeeAsset,
      originationFeeAmount
    }: SubgraphHooksTemplateDataFragment,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): FixedTermHooksTemplate {
    const originationFeeToken = originationFeeAsset
      ? Token.fromSubgraphToken(chainId, originationFeeAsset, provider)
      : undefined;

    return new FixedTermHooksTemplate(chainId, provider, {
      hooksTemplate: id,
      fees: {
        feeRecipient,
        protocolFeeBips,
        ...(originationFeeToken
          ? {
              originationFeeToken,
              originationFeeAmount: originationFeeToken!.getAmount(originationFeeAmount)
            }
          : {})
      } as FeeConfigurationV2,
      enabled: !disabled,
      index: 0, // @todo
      name,
      totalMarkets: 0, // @todo
      signerAddress,
      isRegisteredBorrower
    });
  }

  previewDeployMarket({
    hooksAddress,
    hooksInstanceName,
    existingProviders,
    newProviderInputs,
    roleProviderFactory,
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
    allowForceBuyBacks,
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
    if (!hooksAddress && !roleProviderFactory && newProviderInputs?.length) {
      return { status: DeployMarketStatus.CreateProviderInputsWithoutFactory };
    }

    const hooksConfig = encodeHooksConfig({
      hooksAddress: hooksAddress,
      useOnDeposit: depositAccess === DepositAccess.RequiresCredential,
      useOnQueueWithdrawal: withdrawalAccess === WithdrawalAccess.RequiresCredential,
      useOnTransfer: transferAccess === TransferAccess.RequiresCredential
    });
    const hooksData = defaultAbiCoder.encode(
      ["uint32", "uint128", "bool", "bool", "bool", "bool"],
      [
        fixedTermEndTime,
        minimumDeposit?.raw ?? 0,
        transferAccess === TransferAccess.Disabled,
        allowForceBuyBacks ?? false,
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
          encodeMarketHooksInstanceInputs({
            existingProviders,
            newProviderInputs,
            hooksInstanceName,
            roleProviderFactory
          }),
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
  /** Whether borrower can force buyback market tokens */
  allowForceBuyBacks?: boolean;
} & MarketHooksInstanceInputs;
