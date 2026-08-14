import { encodeAbiParameters, zeroAddress } from "viem";
import { DefaultV2ParameterConstraints, SupportedChainId } from "../constants";
import { MarketParameters } from "../controller";
import { SubgraphHooksInstanceDataFragment } from "../gql/graphql";
import { Token, TokenAmount } from "../token";
import {
  AnyHooksInstanceDataStructOutput,
  DeployMarketInputsV2Struct,
  HooksTemplateDataStructOutput
} from "../lens-types";
import {
  ContractWrapper,
  DepositAccess,
  DeployableMarketKind,
  FeeConfigurationV2,
  HooksKind,
  HooksTemplateRegistrationMetadata,
  MarketHooksInstanceInputs,
  MarketParameterConstraints,
  PartialTransaction,
  RoleProvider,
  SignerOrProvider,
  TransactionHash,
  TransferAccess,
  WithdrawalAccess
} from "../types";
import {
  assert,
  encodeHooksConfig,
  parseFeeConfigurationV2,
  parseMarketParameterConstraints,
  prepareTransaction,
  toNumber
} from "../utils";
import {
  ChangeLenderRolePreview,
  ChangeLenderRoleStatus,
  DeployMarketPreview,
  DeployMarketStatus,
  getHooksTemplateDeploymentStatus,
  StandardDeployMarketPreview,
  readyStandardDeployMarketPreview,
  readyRevolvingDeployMarketPreview,
  RevolvingDeployMarketPreview
} from "./validation";
import { encodeRevolvingMarketData } from "./revolving";
import { HooksAccountContext, HooksLensReadContext } from "./context";
import { normalizeSubgraphHooksTemplateData, SubgraphHooksTemplateLike } from "./subgraph-template";
import { parseRoleProviderKind } from "../domain";
import {
  createHooksFactoryContractFacade,
  encodeMarketHooksInstanceInputs,
  getHooksAdministrator,
  getHooksPendingAdministrator,
  roleProviderFromLensData,
  HooksFactoryContractFacade
} from "./utils";
import { hooksFactoryAbi, hooksFactoryRevolvingAbi, iOpenTermHooksAbi } from "../abi";
import { submitPreparedTransaction } from "../internal/viem-write";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpenTermHooks extends Omit<OpenTermHooksArgs, "roleProviders" | "constraints"> {}

export class OpenTermHooks extends ContractWrapper {
  readonly kind: HooksKind.OpenTerm = HooksKind.OpenTerm;
  public roleProviders: RoleProvider[];
  public constraints: MarketParameterConstraints;

  constructor({
    provider,
    roleProviders = [],
    constraints = DefaultV2ParameterConstraints,
    ...args
  }: OpenTermHooksArgs) {
    super(provider);
    Object.assign(this, args);
    this.contract = { address: this.address };
    this.roleProviders = roleProviders;
    this.constraints = constraints;
  }

  updateWith(data: AnyHooksInstanceDataStructOutput, context: HooksLensReadContext): void {
    this.hooksTemplate.updateWith(data.hooksTemplate, context);
    this.name = data.name;
    this.administrator = getHooksAdministrator(data);
    this.pendingAdministrator = getHooksPendingAdministrator(data);
    this.borrower = this.administrator;
    this.roleProviders = [...data.pullProviders, ...data.pushProviders].map(
      roleProviderFromLensData
    );
  }

  get hooksFactory(): string {
    return this.hooksTemplate.hooksFactory;
  }

  /* ========================================================================== */
  /*                                blockLenders                                */
  /* ========================================================================== */

  previewBlockLenders(_: string[]): ChangeLenderRolePreview {
    if (this.signerAddress?.toLowerCase() !== this.administrator.toLowerCase()) {
      return { status: ChangeLenderRoleStatus.NotAdministrator };
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
    if (this.signerAddress?.toLowerCase() !== this.administrator.toLowerCase()) {
      return { status: ChangeLenderRoleStatus.NotAdministrator };
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
    data: AnyHooksInstanceDataStructOutput,
    context: HooksLensReadContext
  ): OpenTermHooks {
    const administrator = getHooksAdministrator(data);
    return new OpenTermHooks({
      chainId,
      provider,
      address: data.hooksAddress,
      name: data.name,
      signerAddress: context.signerAddress,
      hooksTemplate: OpenTermHooksTemplate.fromLensData(
        chainId,
        provider,
        data.hooksTemplate,
        context
      ),
      borrower: administrator,
      administrator,
      pendingAdministrator: getHooksPendingAdministrator(data),
      constraints: parseMarketParameterConstraints(data.constraints),
      roleProviders: [...data.pullProviders, ...data.pushProviders].map(roleProviderFromLensData)
    });
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: SubgraphHooksInstanceDataFragment,
    context: HooksAccountContext = {}
  ): OpenTermHooks {
    return new OpenTermHooks({
      chainId,
      provider,
      address: data.id,
      borrower: data.administrator,
      administrator: data.administrator,
      pendingAdministrator: data.pendingAdministrator ?? undefined,
      signerAddress: context.signerAddress,
      hooksTemplate: OpenTermHooksTemplate.fromSubgraphData(
        chainId,
        provider,
        data.templateRegistration,
        context
      ),
      name: data.name,
      roleProviders: data.providers.map((p) => ({
        kind: parseRoleProviderKind(p.providerInstance.kind),
        isApproved: p.isApproved,
        providerAddress: p.providerAddress,
        isPullProvider: p.isPullProvider,
        pullProviderIndex: p.pullProviderIndex,
        isPushProvider: p.isPushProvider,
        pushProviderIndex: p.pushProviderIndex,
        timeToLive: toNumber(p.timeToLive),
        ...(p.providerInstance.administrator
          ? {
              isManaged: true,
              administrator: p.providerInstance.administrator,
              ...(p.providerInstance.pendingAdministrator
                ? { pendingAdministrator: p.providerInstance.pendingAdministrator }
                : {})
            }
          : {})
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
  administrator: string;
  pendingAdministrator?: string;
  roleProviders?: RoleProvider[];
  name: string;
  numMarkets?: number;
  signerAddress?: string;
};

export type OpenTermHooksTemplateArgs = {
  hooksFactory: string;
  signerAddress?: string;
  isRegisteredBorrower?: boolean;
  isRegisteredHooksFactory?: boolean;
  hooksTemplate: string;
  fees: FeeConfigurationV2;
  enabled: boolean;
  index: number;
  name: string;
  totalMarkets: number;
  registration?: HooksTemplateRegistrationMetadata;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpenTermHooksTemplate extends OpenTermHooksTemplateArgs {
  hooksFactory: string;
  contract: HooksFactoryContractFacade;
}

export class OpenTermHooksTemplate extends ContractWrapper {
  readonly kind: HooksKind.OpenTerm = HooksKind.OpenTerm;

  constructor(
    public chainId: SupportedChainId,
    provider: SignerOrProvider,
    args: OpenTermHooksTemplateArgs
  ) {
    super(provider);
    Object.assign(this, {
      ...args,
      contract: createHooksFactoryContractFacade(args.hooksFactory)
    });
  }

  updateWith(data: HooksTemplateDataStructOutput, context: HooksLensReadContext): void {
    this.fees = parseFeeConfigurationV2(this.chainId, this.provider, data.fees);
    this.enabled = data.enabled;
    this.index = toNumber(data.index);
    this.name = data.name;
    this.totalMarkets = toNumber(data.totalMarkets);
    this.signerAddress = context.signerAddress;
    this.isRegisteredBorrower = context.isRegisteredBorrower;
    this.isRegisteredHooksFactory = context.isRegisteredHooksFactory;
    this.registration = context.registration;
    this.hooksFactory = context.hooksFactory;
    this.contract = createHooksFactoryContractFacade(context.hooksFactory);
  }

  static fromLensData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: HooksTemplateDataStructOutput,
    context: HooksLensReadContext
  ): OpenTermHooksTemplate {
    return new OpenTermHooksTemplate(chainId, provider, {
      enabled: data.enabled,
      fees: parseFeeConfigurationV2(chainId, provider, data.fees),
      hooksTemplate: data.hooksTemplate,
      hooksFactory: context.hooksFactory,
      index: toNumber(data.index),
      name: data.name,
      totalMarkets: toNumber(data.totalMarkets),
      signerAddress: context.signerAddress,
      isRegisteredBorrower: context.isRegisteredBorrower,
      isRegisteredHooksFactory: context.isRegisteredHooksFactory,
      registration: context.registration
    });
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: SubgraphHooksTemplateLike,
    context: HooksAccountContext = {}
  ): OpenTermHooksTemplate {
    const normalizedTemplate = normalizeSubgraphHooksTemplateData(data);
    const {
      feeRecipient,
      protocolFeeBips,
      enabled,
      hooksTemplate,
      name,
      originationFeeAsset,
      originationFeeAmount,
      registration
    } = normalizedTemplate;
    const originationFeeToken = originationFeeAsset
      ? Token.fromSubgraphToken(chainId, originationFeeAsset, provider)
      : undefined;
    return new OpenTermHooksTemplate(chainId, provider, {
      hooksTemplate,
      hooksFactory: normalizedTemplate.hooksFactory,
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
      enabled,
      index: 0, // @todo
      name,
      totalMarkets: 0, // @todo
      signerAddress: context.signerAddress,
      isRegisteredBorrower: context.isRegisteredBorrower,
      registration
    });
  }

  previewDeployMarket(
    args: StandardOpenTermMarketDeploymentArgs & MarketHooksInstanceInputs
  ): StandardDeployMarketPreview;
  previewDeployMarket(
    args: RevolvingOpenTermMarketDeploymentArgs & MarketHooksInstanceInputs
  ): RevolvingDeployMarketPreview;
  previewDeployMarket(args: OpenTermMarketDeploymentArgs): DeployMarketPreview;
  previewDeployMarket({
    marketKind,
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
    ...otherParameters
  }: OpenTermMarketDeploymentArgs): DeployMarketPreview {
    const targetMarketKind = marketKind ?? "standard";
    const deploymentStatus = getHooksTemplateDeploymentStatus(this, targetMarketKind);
    if (deploymentStatus) return { status: deploymentStatus };
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
    if (
      withdrawalAccess === WithdrawalAccess.RequiresCredential &&
      (depositAccess !== DepositAccess.RequiresCredential || transferAccess === TransferAccess.Open)
    ) {
      return { status: DeployMarketStatus.InvalidAccessConfiguration };
    }
    const hooksConfig = encodeHooksConfig({
      hooksAddress: hooksAddress,
      useOnDeposit: depositAccess === DepositAccess.RequiresCredential,
      useOnQueueWithdrawal: withdrawalAccess === WithdrawalAccess.RequiresCredential,
      useOnTransfer: transferAccess === TransferAccess.RequiresCredential
    });
    const hooksData = encodeAbiParameters(
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
    if (marketKind === "revolving") {
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
      return readyStandardDeployMarketPreview({
        fn: "deployMarket",
        args: [parameters, hooksData, salt, originationFeeToken, originationFeeAmount]
      });
    } else {
      return readyStandardDeployMarketPreview({
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
        abi: result.marketKind === "standard" ? hooksFactoryAbi : hooksFactoryRevolvingAbi,
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

export type StandardOpenTermMarketDeploymentArgs = OpenTermCommonMarketDeploymentArgs & {
  marketKind?: Extract<DeployableMarketKind, "standard">;
  commitmentFeeBips?: undefined;
};

export type RevolvingOpenTermMarketDeploymentArgs = OpenTermCommonMarketDeploymentArgs & {
  marketKind: Extract<DeployableMarketKind, "revolving">;
  commitmentFeeBips: number;
};

export type OpenTermMarketDeploymentArgs =
  | (StandardOpenTermMarketDeploymentArgs & MarketHooksInstanceInputs)
  | (RevolvingOpenTermMarketDeploymentArgs & MarketHooksInstanceInputs);
