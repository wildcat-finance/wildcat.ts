import { encodeAbiParameters, zeroAddress } from "viem";
import {
  DefaultV2ParameterConstraints,
  getDeploymentAddress,
  getHooksFactoryAddressForMarketType,
  hasHooksFactoryDeployment,
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
  AddLenderInput,
  ContractWrapper,
  DepositAccess,
  MarketType,
  FeeConfigurationV2,
  HooksKind,
  MarketHooksInstanceInputs,
  MarketParameterConstraints,
  PartialTransaction,
  RoleProvider,
  SignerOrProvider,
  TransactionHash,
  TransferAccess,
  WithdrawalAccess
} from "../types";
import { assert, encodeHooksConfig, parseFeeConfigurationV2, prepareTransaction } from "../utils";
import {
  ChangeLenderRolePreview,
  ChangeLenderRoleStatus,
  DeployMarketPreview,
  DeployMarketStatus,
  readyLegacyDeployMarketPreview,
  readyRevolvingDeployMarketPreview
} from "./validation";
import { encodeRevolvingMarketData } from "./revolving";
import { encodeMarketHooksInstanceInputs } from "./utils";
import { hooksFactoryAbi, hooksFactoryRevolvingAbi, iOpenTermHooksAbi } from "../abi";
import { submitPreparedTransaction } from "../internal/viem-write";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpenTermHooks extends Omit<OpenTermHooksArgs, "roleProviders" | "constraints"> {}
const NullProviderIndex = 2 ** 24 - 1;

export class OpenTermHooks extends ContractWrapper<IOpenTermHooks> {
  readonly kind: HooksKind.OpenTerm = HooksKind.OpenTerm;
  readonly contractFactory = IOpenTermHooks__factory;
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
  }: OpenTermHooksArgs) {
    super(provider);
    Object.assign(this, args);
    this.roleProviders = roleProviders;
    this.constraints = constraints;
  }

  updateWith(
    data: HooksInstanceDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean,
    hooksFactory?: string
  ): void {
    this.hooksTemplate.updateWith(
      data.hooksTemplate,
      signerAddress,
      isRegisteredBorrower,
      hooksFactory ?? this.hooksFactory
    );
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

  get hooksFactory(): string {
    return this.hooksTemplate.hooksFactory;
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
    return prepareTransaction({
      to: this.address,
      abi: iOpenTermHooksAbi,
      functionName: inputs.length === 1 ? "grantRole" : "grantRoles",
      args:
        inputs.length === 1
          ? [lenders[0], credentialTimestamps[0]]
          : [lenders, credentialTimestamps]
    });
  }

  addLenders(inputs: AddLenderInput[]): Promise<TransactionHash> {
    const result = this.previewAddLenders(inputs);
    assert(result.status === ChangeLenderRoleStatus.Ready, `Can not add lenders: ${result.status}`);
    return submitPreparedTransaction(this.signer, this.populateAddLenders(inputs));
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
    return prepareTransaction({
      to: this.address,
      abi: iOpenTermHooksAbi,
      functionName: "blockFromDeposits",
      args: lenders.length === 1 ? [lenders[0]] : [lenders]
    });
  }

  previewUnblockLender(): ChangeLenderRolePreview {
    if (this.signerAddress?.toLowerCase() !== this.borrower.toLowerCase()) {
      return { status: ChangeLenderRoleStatus.NotBorrower };
    }
    return {
      status: ChangeLenderRoleStatus.Ready
    };
  }

  blockLenders(lenders: string[]): Promise<TransactionHash> {
    const result = this.previewBlockLenders(lenders);
    assert(
      result.status === ChangeLenderRoleStatus.Ready,
      `Can not block lenders: ${result.status}`
    );
    return submitPreparedTransaction(this.signer, this.populateBlockLenders(lenders));
  }

  populateUnblockLender(lender: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: iOpenTermHooksAbi,
      functionName: "unblockFromDeposits",
      args: [lender]
    });
  }

  /* ========================================================================== */
  /*                               static builders                              */
  /* ========================================================================== */

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksInstanceDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean,
    hooksFactory?: string
  ): OpenTermHooks {
    return new OpenTermHooks({
      chainId,
      provider,
      address: data.hooksAddress,
      name: data.name,
      signerAddress,
      hooksTemplate: OpenTermHooksTemplate.fromLensData(
        chainId,
        provider,
        data.hooksTemplate,
        signerAddress,
        isRegisteredBorrower,
        hooksFactory
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
    isRegisteredBorrower?: boolean,
    hooksFactory?: string
  ): OpenTermHooks {
    return new OpenTermHooks({
      chainId,
      provider,
      address: data.id,
      borrower: data.borrower,
      signerAddress,
      hooksTemplate: OpenTermHooksTemplate.fromSubgraphData(
        chainId,
        provider,
        data.hooksTemplate,
        signerAddress,
        isRegisteredBorrower,
        hooksFactory
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

export type OpenTermHooksArgs = {
  chainId: SupportedChainId;
  provider: SignerOrProvider;
  address: string;
  hooksTemplate: OpenTermHooksTemplate;
  constraints?: MarketParameterConstraints;
  borrower: string;
  roleProviders?: RoleProvider[];
  name: string;
  numMarkets?: number;
  signerAddress?: string;
};

export type OpenTermHooksTemplateArgs = {
  hooksFactory?: string;
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
export interface OpenTermHooksTemplate extends OpenTermHooksTemplateArgs {
  hooksFactory: string;
}

export class OpenTermHooksTemplate extends ContractWrapper<HooksFactory> {
  readonly kind: HooksKind.OpenTerm = HooksKind.OpenTerm;
  readonly contractFactory = HooksFactory__factory;
  protected _contractAddress: string;

  constructor(
    public chainId: SupportedChainId,
    provider: SignerOrProvider,
    args: OpenTermHooksTemplateArgs
  ) {
    super(provider);
    const hooksFactory = args.hooksFactory ?? getDeploymentAddress(chainId, "HooksFactory");
    Object.assign(this, { ...args, hooksFactory });
    this._contractAddress = hooksFactory;
  }

  updateWith(
    data: HooksTemplateDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean,
    hooksFactory: string = this.hooksFactory
  ): void {
    this.fees = parseFeeConfigurationV2(this.chainId, this.provider, data.fees);
    this.enabled = data.enabled;
    this.index = data.index;
    this.name = data.name;
    this.totalMarkets = data.totalMarkets.toNumber();
    this.signerAddress = signerAddress;
    this.isRegisteredBorrower = isRegisteredBorrower;
    this.hooksFactory = hooksFactory;
    this._contractAddress = hooksFactory;
  }

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksTemplateDataStructOutput,
    signerAddress?: string,
    isRegisteredBorrower?: boolean,
    hooksFactory?: string
  ): OpenTermHooksTemplate {
    return new OpenTermHooksTemplate(chainId, provider, {
      enabled: data.enabled,
      fees: parseFeeConfigurationV2(chainId, provider, data.fees),
      hooksTemplate: data.hooksTemplate,
      hooksFactory,
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
    isRegisteredBorrower?: boolean,
    hooksFactory?: string
  ): OpenTermHooksTemplate {
    const originationFeeToken = originationFeeAsset
      ? Token.fromSubgraphToken(chainId, originationFeeAsset, provider)
      : undefined;
    return new OpenTermHooksTemplate(chainId, provider, {
      hooksTemplate: id,
      hooksFactory,
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
    marketType,
    commitmentFeeBips,
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
    allowForceBuyBacks,
    ...otherParameters
  }: OpenTermMarketDeploymentArgs): DeployMarketPreview {
    const targetMarketType = marketType ?? "legacy";
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
    if (!hasHooksFactoryDeployment(this.chainId, targetMarketType)) {
      return { status: DeployMarketStatus.WrongHooksFactory };
    }
    const expectedHooksFactory = getHooksFactoryAddressForMarketType(
      this.chainId,
      targetMarketType
    );
    if (this.hooksFactory.toLowerCase() !== expectedHooksFactory.toLowerCase()) {
      return { status: DeployMarketStatus.WrongHooksFactory };
    }
    const hooksConfig = encodeHooksConfig({
      hooksAddress: hooksAddress,
      useOnDeposit: depositAccess === DepositAccess.RequiresCredential,
      useOnQueueWithdrawal: withdrawalAccess === WithdrawalAccess.RequiresCredential,
      useOnTransfer: transferAccess === TransferAccess.RequiresCredential
    });
    const hooksData =
      this.chainId === SupportedChainId.Sepolia
        ? encodeAbiParameters(
            [{ type: "uint128" }, { type: "bool" }, { type: "bool" }],
            [
              minimumDeposit?.raw ?? 0n,
              transferAccess === TransferAccess.Disabled,
              allowForceBuyBacks ?? false
            ]
          )
        : encodeAbiParameters(
            [{ type: "uint128" }, { type: "bool" }],
            [minimumDeposit?.raw ?? 0n, transferAccess === TransferAccess.Disabled]
          );
    const parameters = {
      ...otherParameters,
      asset: asset.address,
      maxTotalSupply: maxTotalSupply.raw,
      hooks: hooksConfig
    } as DeployMarketInputsV2Struct;
    const originationFeeAmount = this.fees.originationFeeAmount?.raw ?? 0;
    const originationFeeToken = this.fees.originationFeeToken?.address ?? zeroAddress;
    if (marketType === "revolving") {
      const marketData = encodeRevolvingMarketData({ commitmentFeeBips });
      if (hooksAddress) {
        return readyRevolvingDeployMarketPreview({
          fn: "deployMarket",
          args: [parameters, hooksData, marketData, salt, originationFeeToken, originationFeeAmount]
        });
      } else {
        return readyRevolvingDeployMarketPreview({
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
            marketData,
            salt,
            originationFeeToken,
            originationFeeAmount
          ]
        });
      }
    }
    if (hooksAddress) {
      return readyLegacyDeployMarketPreview({
        fn: "deployMarket",
        args: [parameters, hooksData, salt, originationFeeToken, originationFeeAmount]
      });
    } else {
      return readyLegacyDeployMarketPreview({
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
      });
    }
  }

  deployMarket({ ...otherParameters }: OpenTermMarketDeploymentArgs): Promise<TransactionHash> {
    const result = this.previewDeployMarket(otherParameters);
    assert(result.status === DeployMarketStatus.Ready, `Can not deploy market: ${result.status}`);
    return submitPreparedTransaction(
      this.signer,
      prepareTransaction({
        to: this.hooksFactory,
        abi: result.marketType === "legacy" ? hooksFactoryAbi : hooksFactoryRevolvingAbi,
        functionName: result.fn,
        args: result.args
      })
    );
  }
}

type OpenTermCommonMarketDeploymentArgs = MarketParameters & {
  /** Create2 salt to use for the market deployment */
  salt: string;

  /** Minimum deposit lenders can make */
  minimumDeposit?: TokenAmount;
  /** Level of access required for accounts to receive a transfer */
  transferAccess: TransferAccess;
  /** Level of access required for a lender to make a deposit */
  depositAccess: DepositAccess;
  /** Level of access required for a lender to make a withdrawal request */
  withdrawalAccess: WithdrawalAccess;
  /** Whether borrower can force buyback market tokens */
  allowForceBuyBacks?: boolean;
};

export type LegacyOpenTermMarketDeploymentArgs = OpenTermCommonMarketDeploymentArgs & {
  marketType?: Extract<MarketType, "legacy">;
  commitmentFeeBips?: undefined;
};

export type RevolvingOpenTermMarketDeploymentArgs = OpenTermCommonMarketDeploymentArgs & {
  marketType: Extract<MarketType, "revolving">;
  commitmentFeeBips: number;
};

export type OpenTermMarketDeploymentArgs =
  | (LegacyOpenTermMarketDeploymentArgs & MarketHooksInstanceInputs)
  | (RevolvingOpenTermMarketDeploymentArgs & MarketHooksInstanceInputs);
