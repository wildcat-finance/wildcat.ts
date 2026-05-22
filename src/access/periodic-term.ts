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
  IPeriodicTermHooks,
  IPeriodicTermHooks__factory
} from "../typechain";
import {
  AddLenderInput,
  ContractWrapper,
  DepositAccess,
  FeeConfigurationV2,
  HooksKind,
  MarketHooksInstanceInputs,
  MarketParameterConstraints,
  PartialTransaction,
  RoleProvider,
  SignerOrProvider,
  TransferAccess,
  WithdrawalAccess
} from "../types";
import { assert, encodeHooksConfig, parseFeeConfigurationV2 } from "../utils";
import { BigNumber, constants, ContractTransaction } from "ethers";
import {
  ChangeLenderRolePreview,
  ChangeLenderRoleStatus,
  DeployMarketPreview,
  DeployMarketStatus
} from "./validation";
import { encodeMarketHooksInstanceInputs } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PeriodicTermHooks
  extends Omit<PeriodicTermHooksArgs, "roleProviders" | "constraints"> {}
const NullProviderIndex = BigNumber.from(2).pow(24).sub(1).toNumber();

export class PeriodicTermHooks extends ContractWrapper<IPeriodicTermHooks> {
  readonly kind: HooksKind.PeriodicTerm = HooksKind.PeriodicTerm;
  readonly contractFactory = IPeriodicTermHooks__factory;
  public roleProviders: RoleProvider[];
  public constraints: MarketParameterConstraints;

  protected get _contractAddress(): string {
    return this.address;
  }

  constructor({
    provider,
    roleProviders = [],
    constraints = DefaultV2ParameterConstraints,
    ...args
  }: PeriodicTermHooksArgs) {
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

  /* ========================================================================== */
  /*                                 addLenders                                 */
  /* ========================================================================== */

  previewAddLenders(_: AddLenderInput[]): ChangeLenderRolePreview {
    if (this.signerAddress?.toLowerCase() !== this.borrower.toLowerCase()) {
      return { status: ChangeLenderRoleStatus.NotBorrower };
    }
    return {
      status: ChangeLenderRoleStatus.Ready
    };
  }

  populateAddLenders(inputs: AddLenderInput[]): PartialTransaction {
    const lenders = inputs.map((input) => input.lender);
    const credentialTimestamps = inputs.map(
      (input) => input.credentialTimestamp ?? Math.floor(Date.now() / 1000)
    );
    return {
      to: this.address,
      data:
        inputs.length === 1
          ? this.contract.interface.encodeFunctionData("grantRole", [
              lenders[0],
              credentialTimestamps[0]
            ])
          : this.contract.interface.encodeFunctionData("grantRoles", [
              lenders,
              credentialTimestamps
            ]),
      value: "0"
    };
  }

  addLenders(inputs: AddLenderInput[]): Promise<ContractTransaction> {
    const result = this.previewAddLenders(inputs);
    assert(result.status === ChangeLenderRoleStatus.Ready, `Can not add lenders: ${result.status}`);

    const lenders = inputs.map((input) => input.lender);
    const credentialTimestamps = inputs.map(
      (input) => input.credentialTimestamp ?? Math.floor(Date.now() / 1000)
    );
    return lenders.length === 1
      ? this.contract.grantRole(lenders[0], credentialTimestamps[0])
      : this.contract.grantRoles(lenders, credentialTimestamps);
  }

  /* ========================================================================== */
  /*                                blockLenders                                */
  /* ========================================================================== */

  previewBlockLenders(_: string[]): ChangeLenderRolePreview {
    if (this.signerAddress?.toLowerCase() !== this.borrower.toLowerCase()) {
      return { status: ChangeLenderRoleStatus.NotBorrower };
    }
    return {
      status: ChangeLenderRoleStatus.Ready
    };
  }

  populateBlockLenders(lenders: string[]): PartialTransaction {
    return {
      to: this.address,
      data:
        lenders.length === 1
          ? this.contract.interface.encodeFunctionData("blockFromDeposits(address)", [lenders[0]])
          : this.contract.interface.encodeFunctionData("blockFromDeposits(address[])", [lenders]),
      value: "0"
    };
  }

  previewUnblockLender(): ChangeLenderRolePreview {
    if (this.signerAddress?.toLowerCase() !== this.borrower.toLowerCase()) {
      return { status: ChangeLenderRoleStatus.NotBorrower };
    }
    return {
      status: ChangeLenderRoleStatus.Ready
    };
  }

  blockLenders(lenders: string[]): Promise<ContractTransaction> {
    const result = this.previewBlockLenders(lenders);
    assert(
      result.status === ChangeLenderRoleStatus.Ready,
      `Can not block lenders: ${result.status}`
    );
    return lenders.length === 1
      ? this.contract["blockFromDeposits(address)"](lenders[0])
      : this.contract["blockFromDeposits(address[])"](lenders);
  }

  populateUnblockLender(lender: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("unblockFromDeposits", [lender]),
      value: "0"
    };
  }

  /* ========================================================================== */
  /*                               static builders                              */
  /* ========================================================================== */

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksInstanceDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean
  ): PeriodicTermHooks {
    return new PeriodicTermHooks({
      chainId,
      provider,
      address: data.hooksAddress,
      name: data.name,
      signerAddress,
      hooksTemplate: PeriodicTermHooksTemplate.fromLensData(
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
  ): PeriodicTermHooks {
    return new PeriodicTermHooks({
      chainId,
      provider,
      address: data.id,
      borrower: data.borrower,
      signerAddress,
      hooksTemplate: PeriodicTermHooksTemplate.fromSubgraphData(
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

export type PeriodicTermHooksArgs = {
  chainId: SupportedChainId;
  provider: SignerOrProvider;
  address: string;
  hooksTemplate: PeriodicTermHooksTemplate;
  constraints?: MarketParameterConstraints;
  borrower: string;
  roleProviders?: RoleProvider[];
  name: string;
  numMarkets?: number;
  signerAddress?: string;
};

export type PeriodicTermHooksTemplateArgs = {
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
export interface PeriodicTermHooksTemplate extends PeriodicTermHooksTemplateArgs {}

export class PeriodicTermHooksTemplate extends ContractWrapper<HooksFactory> {
  readonly kind: HooksKind.PeriodicTerm = HooksKind.PeriodicTerm;
  readonly contractFactory = HooksFactory__factory;
  protected _contractAddress: string;

  constructor(
    public chainId: SupportedChainId,
    provider: SignerOrProvider,
    args: PeriodicTermHooksTemplateArgs
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
  ): PeriodicTermHooksTemplate {
    return new PeriodicTermHooksTemplate(chainId, provider, {
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
  ): PeriodicTermHooksTemplate {
    const originationFeeToken = originationFeeAsset
      ? Token.fromSubgraphToken(chainId, originationFeeAsset, provider)
      : undefined;
    return new PeriodicTermHooksTemplate(chainId, provider, {
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
    firstWithdrawalWindowStart,
    periodDuration,
    withdrawalWindowDuration,
    ...otherParameters
  }: PeriodicTermMarketDeploymentArgs): DeployMarketPreview {
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
      ["uint32", "uint32", "uint32", "uint128", "bool"],
      [
        firstWithdrawalWindowStart,
        periodDuration,
        withdrawalWindowDuration,
        minimumDeposit?.raw ?? 0,
        transferAccess === TransferAccess.Disabled
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
  }: PeriodicTermMarketDeploymentArgs): Promise<ContractTransaction> {
    const result = this.previewDeployMarket(otherParameters);
    assert(result.status === DeployMarketStatus.Ready, `Can not deploy market: ${result.status}`);
    if (result.fn === "deployMarket") {
      return this.contract.deployMarket(...result.args);
    } else {
      return this.contract.deployMarketAndHooks(...result.args);
    }
  }
}

export type PeriodicTermMarketDeploymentArgs = MarketParameters & {
  /** Create2 salt to use for the market deployment */
  salt: string;

  /** Start time for the first withdrawal window */
  firstWithdrawalWindowStart: number;
  /** Seconds between the start of each withdrawal window */
  periodDuration: number;
  /** Seconds each withdrawal window remains open */
  withdrawalWindowDuration: number;
  /** Minimum deposit lenders can make */
  minimumDeposit?: TokenAmount;
  /** Level of access required for accounts to receive a transfer */
  transferAccess: TransferAccess;
  /** Level of access required for a lender to make a deposit */
  depositAccess: DepositAccess;
  /** Level of access required for a lender to make a withdrawal request */
  withdrawalAccess: WithdrawalAccess;
} & MarketHooksInstanceInputs;
