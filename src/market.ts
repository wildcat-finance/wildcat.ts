import { encodeFunctionData, zeroAddress } from "viem";
import {
  MarketDataBaseV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2_5StructOutput,
  MarketDataV2StructOutput,
  MarketLiveDataV2_5StructOutput,
  RoleProviderDataStructOutput,
  RoleProviderDataV2_5StructOutput
} from "./lens-types";
import {
  SupportedChainId,
  getConfiguredMarketKindForHooksFactory,
  hasDeploymentAddress
} from "./constants";
import {
  getRegisteredMarkets,
  getRegisteredMarketsCount,
  getRegisteredMarketsPage
} from "./internal/arch-controller";
import {
  getLegacyMarketData,
  getLegacyMarketsData,
  getUnifiedMarketDataV2,
  getUnifiedMarketsDataV2,
  getUnifiedMarketsLiveDataV2,
  getV2MarketData,
  getV2MarketsData
} from "./internal/market-lens";
import { TokenAmount, Token, toRawAmount } from "./token";
import {
  SignerOrProvider,
  ContractWrapper,
  PartialTransaction,
  MarketVersion,
  MarketKind,
  ProtocolEventGeneration,
  MarketOnboardingMode,
  IndexedMarketSnapshot,
  MarketProvenance,
  ReadStateSource,
  HooksKind,
  HooksConfig,
  OpenTermHooksConfig,
  FixedTermHooksConfig,
  PeriodicTermHooksConfig,
  RoleProvider,
  TransactionHash
} from "./types";
import { MarketAccount } from "./account";
import { LenderWithdrawalStatus } from "./withdrawal-status";
import { parseRoleProviderKind } from "./domain";

import {
  SubgraphBorrowDataFragment,
  SubgraphDepositDataFragment,
  SubgraphFeesCollectedDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketDeployedEventFragment,
  SubgraphMarketListDataFragment,
  SubgraphRoleProviderDataFragment,
  SubgraphRepaymentDataFragment
} from "./gql/graphql";
import {
  BorrowRecord,
  DepositRecord,
  FeeCollectionRecord,
  MakeOptional,
  RepaymentRecord,
  parseMarketRecord,
  BIP_BIGINT,
  RAY_BIGINT,
  SECONDS_IN_365_DAYS,
  assert,
  bipMulBigint,
  bipToRayBigint,
  formatFixedBigint,
  prepareTransaction,
  rayDivBigint,
  rayMulBigint,
  toNumber
} from "./utils";
import { hooksTemplateFromSubgraph } from "./access";
import { roleProviderFromLensData } from "./access/utils";
import { wildcatMarketAbi } from "./abi";
import { submitPreparedTransaction } from "./internal/viem-write";
import { getEthersSignerAddress } from "./internal/ethers-signer";
import {
  normalizeSubgraphMarketProvenance,
  normalizeSubgraphMarketSnapshot
} from "./gql/normalizers";

export type CollateralizationInfo = {
  // Percentage of total assets that must be held in reserve
  targetRatio: number;
  // Percentage of total assets actually held in reserve
  actualRatio: number;
  // Indicates whether the ratio is temporarily increased due to reduction in APR
  isTemporary?: boolean;
  // Original target collateralization ratio (percentage) before any temporary changes
  originalTargetRatio?: number;
  // Expiry of temporary ratio
  temporaryExpiry?: number;
};

// @todo pull min/max apr from contract and subgraph

export type TotalDebtBreakdown =
  | {
      status: "delinquent";
      borrowed: TokenAmount;
      delinquentDebt: TokenAmount;
      reserves: TokenAmount;
      collateralObligation: TokenAmount;
      totalDebt: TokenAmount;
    }
  | {
      status: "healthy";
      borrowed: TokenAmount;
      borrowable: TokenAmount;
      collateralObligation: TokenAmount;
      totalDebt: TokenAmount;
    };

export type RevolvingCurrentAprMetrics = {
  commitmentFeeBips: number;
  drawnAmount: TokenAmount;
  utilizationBips: number;
  utilizationAprBips: number;
  blendedBaseAprBips: number;
  protocolAprBips: number;
  penaltyAprBips: number;
  effectiveLenderAprBips: number;
};

export type MarketAprDisplayBips = {
  isRevolving: boolean;
  marketKind: MarketKind;
  configuredAprKind: "annualInterest" | "utilization";
  configuredAprBips: number;
  configuredAnnualInterestBips: number;
  configuredUtilizationAprBips?: number;
  commitmentAprBips?: number;
  utilizationBips?: number;
  currentUtilizationAprBips?: number;
  currentBaseLenderAprBips: number;
  currentProtocolAprBips: number;
  currentPenaltyAprBips: number;
  currentEffectiveLenderAprBips: number;
};

const marketKindFromRevolvingFields = (
  hasCommitmentFeeBips: boolean,
  hasDrawnAmount: boolean
): MarketKind => {
  if (hasCommitmentFeeBips && hasDrawnAmount) return "revolving";
  if (!hasCommitmentFeeBips && !hasDrawnAmount) return "standard";
  return "unknown";
};

const hasUnifiedLatestLensForDirectReads = (chainId: SupportedChainId): boolean => {
  return hasDeploymentAddress(chainId, "MarketLensV2_5");
};

const toUnifiedMarketDataV2 = (
  data: MarketDataBaseV2_5StructOutput | MarketDataV2_5StructOutput
): MarketDataV2_5StructOutput => {
  if ("market" in data) {
    return data;
  }

  return {
    market: data,
    borrowerPrincipal: zeroAddress,
    pendingBorrower: zeroAddress,
    pendingBorrowerPrincipal: zeroAddress,
    borrowerIdentityRegistry: zeroAddress,
    commitmentFeeBips: {
      isPresent: false,
      value: 0n
    },
    drawnAmount: {
      isPresent: false,
      value: 0n
    }
  } as unknown as MarketDataV2_5StructOutput;
};

type SubgraphMarketHydrationData = (
  | MakeOptional<
      SubgraphMarketDataWithEventsFragment,
      "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
    >
  | SubgraphMarketListDataFragment
) & {
  latestDeposit?: Array<{ blockTimestamp: number }>;
};

const hasSubgraphMarketTotals = (
  data: SubgraphMarketHydrationData
): data is MakeOptional<
  SubgraphMarketDataWithEventsFragment,
  "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
> => "totalBorrowed" in data;

const hasSubgraphMarketRecords = (
  data: SubgraphMarketHydrationData
): data is SubgraphMarketDataWithEventsFragment => "depositRecords" in data;

const roleProviderFromSubgraph = (provider: SubgraphRoleProviderDataFragment): RoleProvider => ({
  kind: parseRoleProviderKind(provider.providerInstance.kind),
  providerAddress: provider.providerAddress,
  timeToLive: toNumber(provider.timeToLive),
  isPullProvider: provider.isPullProvider,
  pullProviderIndex: provider.pullProviderIndex,
  isPushProvider: provider.isPushProvider,
  pushProviderIndex: provider.pushProviderIndex,
  isApproved: provider.isApproved,
  ...(provider.providerInstance.administrator
    ? {
        isManaged: true,
        administrator: provider.providerInstance.administrator,
        ...(provider.providerInstance.pendingAdministrator
          ? { pendingAdministrator: provider.providerInstance.pendingAdministrator }
          : {})
      }
    : {})
});

const roleProvidersFromLens = ({
  pullProviders,
  pushProviders
}: {
  pullProviders: ReadonlyArray<RoleProviderDataStructOutput | RoleProviderDataV2_5StructOutput>;
  pushProviders: ReadonlyArray<RoleProviderDataStructOutput | RoleProviderDataV2_5StructOutput>;
}): RoleProvider[] => [...pullProviders, ...pushProviders].map(roleProviderFromLensData);

export type MarketArgs = {
  provider: SignerOrProvider;
  chainId: SupportedChainId;
  version: MarketVersion;
  eventGeneration?: ProtocolEventGeneration;
  marketToken: Token;
  underlyingToken: Token;
  hooksFactory?: string;
  marketKind: MarketKind;
  hooksConfig?: HooksConfig;
  /**
   * Active role providers for this market's hooks instance.
   *
   * `undefined` means the selected read projection did not include provider
   * metadata. An empty array means it did and no active providers exist.
   */
  roleProviders?: RoleProvider[];
  borrower: string;
  borrowerPrincipal?: string;
  pendingBorrower?: string;
  pendingBorrowerPrincipal?: string;
  borrowerIdentityRegistry?: string;
  controller?: string;
  feeRecipient: string;
  protocolFeeBips: number;
  delinquencyFeeBips: number;
  // Seconds delinquency is allowed before liquidation
  delinquencyGracePeriod: number;
  withdrawalBatchDuration: number;
  reserveRatioBips: number;
  annualInterestBips: number;
  temporaryReserveRatio: boolean;
  originalAnnualInterestBips: number;
  originalReserveRatioBips: number;
  temporaryReserveRatioExpiry: number;
  isClosed: boolean;
  scaleFactor: bigint;
  // Total amount of market tokens in existence
  totalSupply: TokenAmount;
  // Maximum amount of market tokens that can be minted
  maxTotalSupply: TokenAmount;
  scaledTotalSupply: bigint;
  // Total amount of underlying assets held in the market
  totalAssets: TokenAmount;
  lastAccruedProtocolFees: TokenAmount;
  normalizedUnclaimedWithdrawals: TokenAmount;
  scaledPendingWithdrawals: bigint;
  pendingWithdrawalExpiry: number;
  // Whether the market is delinquent
  isDelinquent: boolean;
  // Seconds the market has been delinquent
  timeDelinquent: number;
  // Timestamp of last interest accrual
  lastInterestAccruedTimestamp: number;
  // Expiries of unpaid withdrawal batches
  unpaidWithdrawalBatchExpiries: number[];
  // Amount of underlying assets that should be held in reserve for current supply
  coverageLiquidity: TokenAmount;
  numCollateralContracts?: number;
  totalBorrowed?: TokenAmount;
  totalRepaid?: TokenAmount;
  totalBaseInterestAccrued?: TokenAmount;
  totalDelinquencyFeesAccrued?: TokenAmount;
  totalProtocolFeesAccrued?: TokenAmount;
  totalDeposited?: TokenAmount;
  /** Timestamp of the most recent deposit indexed by the market-list query. */
  latestDepositTimestamp?: number;
  commitmentFeeBips?: number;
  drawnAmount?: TokenAmount;
  provenance?: MarketProvenance;
  indexedSnapshot?: IndexedMarketSnapshot;
  stateSource?: ReadStateSource;
  deployedEvent?: SubgraphMarketDeployedEventFragment;
  eventIndex?: number;
  signerAddress?: string;
  depositRecords?: SubgraphDepositDataFragment[];
  repaymentRecords?: SubgraphRepaymentDataFragment[];
  borrowRecords?: SubgraphBorrowDataFragment[];
  feeCollectionRecords?: SubgraphFeesCollectedDataFragment[];
};

export const getMarketOnboardingMode = ({
  version,
  hooksConfig,
  roleProviders
}: Pick<MarketArgs, "version" | "hooksConfig" | "roleProviders">):
  | MarketOnboardingMode
  | undefined => {
  if (version === MarketVersion.V1) {
    return MarketOnboardingMode.BorrowerApproval;
  }
  if (version !== MarketVersion.V2 || hooksConfig === undefined) {
    return undefined;
  }
  if (!hooksConfig.flags.useOnDeposit || !hooksConfig.depositRequiresAccess) {
    return MarketOnboardingMode.SelfOnboard;
  }
  if (roleProviders === undefined) {
    return undefined;
  }
  return roleProviders.some(({ isApproved, isPullProvider }) => isApproved && isPullProvider)
    ? MarketOnboardingMode.SelfOnboard
    : MarketOnboardingMode.BorrowerApproval;
};

const calculateLiquidityCoverage = ({
  eventGeneration,
  scaledTotalSupply,
  scaledPendingWithdrawals,
  reserveRatioBips,
  scaleFactor,
  accruedProtocolFees,
  normalizedUnclaimedWithdrawals
}: {
  eventGeneration: ProtocolEventGeneration;
  scaledTotalSupply: bigint;
  scaledPendingWithdrawals: bigint;
  reserveRatioBips: number;
  scaleFactor: bigint;
  accruedProtocolFees: bigint;
  normalizedUnclaimedWithdrawals: bigint;
}): bigint => {
  let normalizedSupplyRequired: bigint;
  if (eventGeneration === "v2.5") {
    const normalizedPendingWithdrawals = rayMulBigint(scaledPendingWithdrawals, scaleFactor);
    if (reserveRatioBips === 0) {
      normalizedSupplyRequired = normalizedPendingWithdrawals;
    } else if (reserveRatioBips === Number(BIP_BIGINT)) {
      normalizedSupplyRequired = rayMulBigint(scaledTotalSupply, scaleFactor);
    } else {
      const normalizedTotalSupply = rayMulBigint(scaledTotalSupply, scaleFactor);
      const normalizedOutstandingSupply = normalizedTotalSupply - normalizedPendingWithdrawals;
      normalizedSupplyRequired =
        normalizedPendingWithdrawals + bipMulBigint(normalizedOutstandingSupply, reserveRatioBips);
    }
  } else {
    // legacy markets apply the reserve ratio before normalization.
    const scaledRequiredReserves =
      bipMulBigint(scaledTotalSupply - scaledPendingWithdrawals, reserveRatioBips) +
      scaledPendingWithdrawals;
    normalizedSupplyRequired = rayMulBigint(scaledRequiredReserves, scaleFactor);
  }

  return normalizedSupplyRequired + accruedProtocolFees + normalizedUnclaimedWithdrawals;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Market
  extends Omit<
    MarketArgs,
    | "depositRecords"
    | "repaymentRecords"
    | "borrowRecords"
    | "feeCollectionRecords"
    | "eventGeneration"
    | "provider"
  > {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  eventGeneration: ProtocolEventGeneration;
  stateSource: ReadStateSource;
}

export class Market extends ContractWrapper {
  public contract!: {
    address: string;
    interface: {
      encodeFunctionData: (functionName: string, args?: readonly unknown[]) => string;
    };
  };

  public depositRecords: DepositRecord[];
  public repaymentRecords: RepaymentRecord[];
  public borrowRecords: BorrowRecord[];
  public feeCollectionRecords: FeeCollectionRecord[];

  get onboardingMode(): MarketOnboardingMode | undefined {
    return getMarketOnboardingMode(this);
  }

  constructor({
    provider,
    eventGeneration = "unknown",
    ...args
  }: MarketArgs & { hooksConfig?: HooksConfig }) {
    super(provider);
    const { address, name, symbol, decimals } = args.marketToken;
    Object.assign(this, {
      address,
      name,
      symbol,
      decimals,
      contract: {
        address,
        interface: {
          encodeFunctionData: (functionName: string, args: readonly unknown[] = []) =>
            encodeFunctionData({
              abi: wildcatMarketAbi,
              functionName,
              args
            } as Parameters<typeof encodeFunctionData>[0])
        }
      }
    });
    Object.assign(this, {
      ...args,
      eventGeneration,
      stateSource: args.stateSource ?? "live"
    });
    this.depositRecords = (args.depositRecords ?? []).map((log) =>
      parseMarketRecord(this.underlyingToken, log)
    );
    this.repaymentRecords = (args.repaymentRecords ?? []).map((log) =>
      parseMarketRecord(this.underlyingToken, log)
    );
    this.borrowRecords = (args.borrowRecords ?? []).map((log) =>
      parseMarketRecord(this.underlyingToken, log)
    );
    this.feeCollectionRecords = (args.feeCollectionRecords ?? []).map(
      ({ feesCollected, __typename, ...rest }) => ({
        ...rest,
        __typename: "FeesCollected",
        amount: this.underlyingToken.getAmount(feesCollected)
      })
    );
  }

  toJSON(): {
    type: "Market";
    chainId: SupportedChainId;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    version: MarketVersion;
    eventGeneration: ProtocolEventGeneration;
    marketKind: MarketKind;
    hooksFactory?: string;
    borrower: string;
    borrowerPrincipal?: string;
  } {
    return {
      type: "Market",
      chainId: this.chainId,
      address: this.address,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      version: this.version,
      eventGeneration: this.eventGeneration,
      marketKind: this.marketKind,
      hooksFactory: this.hooksFactory,
      borrower: this.borrower,
      borrowerPrincipal: this.borrowerPrincipal
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                              Property Getters                              */
  /* -------------------------------------------------------------------------- */

  get hooksKind(): HooksKind | undefined {
    return this.hooksConfig?.kind;
  }

  get isInFixedTerm(): boolean {
    if (this.version !== MarketVersion.V2) return false;
    const config = this.hooksConfig!;
    if (config.kind !== HooksKind.FixedTerm) return false;
    const fixedTermEndTime = config.fixedTermEndTime;
    return fixedTermEndTime >= Date.now() / 1_000;
  }

  get periodicHooksConfig(): PeriodicTermHooksConfig | undefined {
    const config = this.hooksConfig;
    return config?.kind === HooksKind.PeriodicTerm ? config : undefined;
  }

  get isPeriodicTermClosed(): boolean {
    return !!this.periodicHooksConfig?.periodicTermClosed;
  }

  isPeriodicWithdrawalWindowOpenAt(timestampSec: number): boolean {
    const config = this.periodicHooksConfig;
    if (!config) return false;
    if (this.isClosed || config.periodicTermClosed) return true;
    if (config.periodDuration === 0) return false;

    const timestamp = Math.floor(timestampSec);
    if (timestamp < config.firstWithdrawalWindowStart) return false;

    const timeInPeriod = (timestamp - config.firstWithdrawalWindowStart) % config.periodDuration;
    return timeInPeriod < config.withdrawalWindowDuration;
  }

  get isPeriodicWithdrawalWindowOpen(): boolean {
    return this.isPeriodicWithdrawalWindowOpenAt(Date.now() / 1_000);
  }

  get nextPeriodicWithdrawalWindowStart(): number | undefined {
    const config = this.periodicHooksConfig;
    if (!config || this.isClosed || config.periodicTermClosed || config.periodDuration === 0) {
      return undefined;
    }

    const now = Math.floor(Date.now() / 1_000);
    if (now < config.firstWithdrawalWindowStart) return config.firstWithdrawalWindowStart;

    const timeInPeriod = (now - config.firstWithdrawalWindowStart) % config.periodDuration;
    const currentWindowStart = now - timeInPeriod;
    return currentWindowStart + config.periodDuration;
  }

  /** @returns Percentage growth of the market since it was created */
  get allTimeGrowth(): number {
    // 27 - 2 to convert to percentage
    return +formatFixedBigint(this.scaleFactor, 25, 25);
  }

  /** @returns Maximum amount of underlying token that can be deposited */
  get maximumDeposit(): TokenAmount {
    return this.underlyingToken.getAmount(this.maxTotalSupply.satsub(this.totalSupply.raw));
  }

  get currentRevolvingAprMetrics(): RevolvingCurrentAprMetrics | undefined {
    const commitmentFeeBips = this.commitmentFeeBips;
    const drawnAmount = this.drawnAmount;
    if (commitmentFeeBips == null || drawnAmount == null) {
      return undefined;
    }

    const totalSupply = this.totalSupply.raw;
    const drawnAmountRaw = drawnAmount.raw > totalSupply ? totalSupply : drawnAmount.raw;

    const utilizationBips =
      totalSupply > 0n ? Number((drawnAmountRaw * BIP_BIGINT) / totalSupply) : 0;

    const utilizationAprBips =
      totalSupply > 0n
        ? Number((drawnAmountRaw * BigInt(this.annualInterestBips)) / totalSupply)
        : 0;

    const blendedBaseAprBips = commitmentFeeBips + utilizationAprBips;
    const protocolAprBips = Number(
      (BigInt(blendedBaseAprBips) * BigInt(this.protocolFeeBips)) / BIP_BIGINT
    );
    const penaltyAprBips = this.isIncurringPenalties ? this.delinquencyFeeBips : 0;

    return {
      commitmentFeeBips,
      drawnAmount,
      utilizationBips,
      utilizationAprBips,
      blendedBaseAprBips,
      protocolAprBips,
      penaltyAprBips,
      effectiveLenderAprBips: blendedBaseAprBips + penaltyAprBips
    };
  }

  private get currentBaseLenderAprBips(): number {
    return this.currentRevolvingAprMetrics?.blendedBaseAprBips ?? this.annualInterestBips;
  }

  get currentAprDisplayBips(): MarketAprDisplayBips {
    const revolvingMetrics = this.currentRevolvingAprMetrics;
    if (revolvingMetrics) {
      return {
        isRevolving: true,
        marketKind: this.marketKind,
        configuredAprKind: "utilization",
        configuredAprBips: this.annualInterestBips,
        configuredAnnualInterestBips: this.annualInterestBips,
        configuredUtilizationAprBips: this.annualInterestBips,
        commitmentAprBips: revolvingMetrics.commitmentFeeBips,
        utilizationBips: revolvingMetrics.utilizationBips,
        currentUtilizationAprBips: revolvingMetrics.utilizationAprBips,
        currentBaseLenderAprBips: revolvingMetrics.blendedBaseAprBips,
        currentProtocolAprBips: revolvingMetrics.protocolAprBips,
        currentPenaltyAprBips: revolvingMetrics.penaltyAprBips,
        currentEffectiveLenderAprBips: revolvingMetrics.effectiveLenderAprBips
      };
    }

    const currentProtocolAprBips = Number(
      (BigInt(this.annualInterestBips) * BigInt(this.protocolFeeBips)) / BIP_BIGINT
    );
    const currentPenaltyAprBips = this.isIncurringPenalties ? this.delinquencyFeeBips : 0;

    return {
      isRevolving: false,
      marketKind: this.marketKind,
      configuredAprKind: "annualInterest",
      configuredAprBips: this.annualInterestBips,
      configuredAnnualInterestBips: this.annualInterestBips,
      currentBaseLenderAprBips: this.annualInterestBips,
      currentProtocolAprBips,
      currentPenaltyAprBips,
      currentEffectiveLenderAprBips: this.annualInterestBips + currentPenaltyAprBips
    };
  }

  private get currentBaseLenderAPR(): bigint {
    return bipToRayBigint(this.currentBaseLenderAprBips);
  }

  private get currentPenaltyAPR(): bigint {
    return this.isIncurringPenalties ? bipToRayBigint(this.delinquencyFeeBips) : 0n;
  }

  private get currentProtocolAPR(): bigint {
    return bipMulBigint(this.currentBaseLenderAPR, this.protocolFeeBips);
  }

  /** @returns Whether the borrower is in penalized delinquency */
  get isIncurringPenalties(): boolean {
    return this.timeDelinquent > this.delinquencyGracePeriod;
  }

  /**
   * @returns Whether the market is currently flagged as delinquent or will be
   *          flagged upon the next state update.
   */
  get willBeDelinquent(): boolean {
    return this.getTotalDebtBreakdown().status === "delinquent";
  }

  /** @returns Total debts of the market without subtracting assets */
  get totalDebts(): TokenAmount {
    return this.normalizedUnclaimedWithdrawals
      .add(this.totalSupply.raw)
      .add(this.lastAccruedProtocolFees);
  }

  get outstandingDebt(): TokenAmount {
    return this.totalDebts.satsub(this.totalAssets);
  }

  /** @returns Amount of assets borrower must deposit to not be delinquent */
  get delinquentDebt(): TokenAmount {
    return this.coverageLiquidity.satsub(this.totalAssets);
  }

  get outstandingTotalSupply(): TokenAmount {
    return this.totalSupply.sub(this.normalizedPendingWithdrawals);
  }

  /** @returns Address of underlying token */
  get asset(): string {
    return this.underlyingToken.address;
  }

  /** @returns Percentage of the interest fee that goes to the protocol */
  get protocolFee(): number {
    return this.protocolFeeBips / 100;
  }

  /** @returns Percentage fee added to base interest rate when delinquency exceeds grace period */
  get penaltyFee(): number {
    return this.delinquencyFeeBips / 100;
  }

  /** @returns Percentage of total assets that must be held in reserve */
  get collateralization(): CollateralizationInfo {
    // @todo use total debts not supply
    const targetRatio = this.reserveRatioBips / 100;

    const actualRatio = this.totalSupply.eq(0)
      ? 100
      : +formatFixedBigint((this.totalAssets.raw * RAY_BIGINT) / this.totalSupply.raw, 25, 25);
    if (this.temporaryReserveRatio) {
      return {
        targetRatio,
        actualRatio,
        isTemporary: true,
        originalTargetRatio: this.originalReserveRatioBips / 100,
        temporaryExpiry: this.temporaryReserveRatioExpiry
      };
    }
    return { targetRatio, actualRatio };
  }

  get normalizedPendingWithdrawals(): TokenAmount {
    return this.underlyingToken.getAmount(
      rayMulBigint(this.scaledPendingWithdrawals, this.scaleFactor)
    );
  }

  /** @returns Whether the borrower can change the APR */
  get canReduceAPR(): boolean {
    return this.collateralization.actualRatio >= 90;
  }

  get liquidReserves(): TokenAmount {
    // Subtract normalized value of pending scaled withdrawals, processed
    // withdrawals and protocol fees.
    const normalizedPendingWithdrawals = this.normalizedPendingWithdrawals;
    const unavailableAssets = normalizedPendingWithdrawals
      .add(this.normalizedUnclaimedWithdrawals)
      .add(this.lastAccruedProtocolFees);
    return this.totalAssets.satsub(unavailableAssets);
  }

  get minimumReserves(): TokenAmount {
    return this.underlyingToken.getAmount(
      bipMulBigint(this.outstandingTotalSupply.raw, this.reserveRatioBips)
    );
  }

  get borrowableAssets(): TokenAmount {
    return this.totalAssets.satsub(this.coverageLiquidity);
  }

  getTotalDebtBreakdown(): TotalDebtBreakdown {
    const minimumReserves = this.minimumReserves;
    const reserves = this.totalAssets;
    const pendingWithdrawals = this.normalizedPendingWithdrawals;
    const collateralObligation = pendingWithdrawals
      .add(this.normalizedUnclaimedWithdrawals)
      .add(minimumReserves)
      .add(this.lastAccruedProtocolFees);
    const nonReservedSupply = this.outstandingTotalSupply.sub(minimumReserves);

    if (reserves.lt(collateralObligation)) {
      // const borrowablePortionOfSupply = totalDebts.sub(collateralObligation);
      const delinquentDebt = collateralObligation.sub(reserves);
      // const borrowed = borrowablePortionOfSupply.sub(reserves).sub(delinquentDebt);
      return {
        status: "delinquent",
        borrowed: nonReservedSupply,
        delinquentDebt,
        reserves,
        collateralObligation,
        totalDebt: this.totalDebts
      };
    }
    const borrowed = this.totalDebts.sub(reserves);
    const borrowable = reserves.sub(collateralObligation);

    return {
      status: "healthy",
      borrowable,
      borrowed,
      collateralObligation,
      totalDebt: this.totalDebts
    };
  }

  normalizeAmount(amount: bigint): bigint {
    return rayMulBigint(amount, this.scaleFactor);
  }

  scaleAmount(amount: bigint): bigint {
    return rayDivBigint(amount, this.scaleFactor);
  }

  get secondsBeforeDelinquency(): number {
    if (this.willBeDelinquent || this.totalDebts.eq(0)) return 0;

    const scaledBase = this.scaledTotalSupply;
    const basePrincipal = this.underlyingToken.getAmount(
      rayMulBigint(scaledBase, this.scaleFactor)
    );

    const baseAPRRay = this.currentBaseLenderAPR;
    const protocolFeeAPRRay = this.currentProtocolAPR;
    const delinquencyFeeAPRRay = this.currentPenaltyAPR;

    // lender APR portion
    const lenderRequirementGrowthPerSecond = basePrincipal
      .rayMul(baseAPRRay + delinquencyFeeAPRRay)
      .div(SECONDS_IN_365_DAYS)
      .bipMul(this.reserveRatioBips);

    // protocol fee portion
    const protocolRequirementGrowthPerSecond = basePrincipal
      .rayMul(protocolFeeAPRRay)
      .div(SECONDS_IN_365_DAYS);

    const totalRequirementGrowthPerSecond = lenderRequirementGrowthPerSecond.add(
      protocolRequirementGrowthPerSecond.raw
    );
    // essentially if  apr=0 and rr=0 then bips alone wont move us to delinquency
    if (totalRequirementGrowthPerSecond.raw === 0n) return Number.MAX_SAFE_INTEGER;

    const buffer = this.liquidReserves.sub(this.minimumReserves);
    if (buffer.raw <= 0n) return 0; // we are delinquent
    return Number(buffer.div(totalRequirementGrowthPerSecond, true).raw); // seconds until the party
  }

  getSecondsBeforeDelinquencyForBorrowedAmount(borrowAmount: TokenAmount): number {
    if (this.isDelinquent || this.totalDebts.eq(0)) return 0;
    const scaledBase = this.scaledTotalSupply;

    const basePrincipal = this.underlyingToken.getAmount(
      rayMulBigint(scaledBase, this.scaleFactor)
    );
    const baseAPRRay = this.currentBaseLenderAPR;
    const protocolFeeAPRRay = this.currentProtocolAPR;
    const delinquencyFeeAPRRay = this.currentPenaltyAPR;

    const lenderRequirementGrowthPerSecond = basePrincipal
      .rayMul(baseAPRRay + delinquencyFeeAPRRay)
      .div(SECONDS_IN_365_DAYS)
      .bipMul(this.reserveRatioBips);

    const protocolRequirementGrowthPerSecond = basePrincipal
      .rayMul(protocolFeeAPRRay)
      .div(SECONDS_IN_365_DAYS);

    const totalRequirementGrowthPerSecond = lenderRequirementGrowthPerSecond.add(
      protocolRequirementGrowthPerSecond.raw
    );
    if (totalRequirementGrowthPerSecond.raw === 0n) return Number.MAX_SAFE_INTEGER;

    const postBorrowBuffer = this.liquidReserves.sub(this.minimumReserves).sub(borrowAmount);
    if (postBorrowBuffer.raw <= 0n) return 0;
    return Number(postBorrowBuffer.div(totalRequirementGrowthPerSecond, true).raw);
  }
  /**
   * @dev Calculate token amount to be repayed by borrower for a given duration
   * to keep the market healthy.
   * @return token amount to be repayed
   **/
  repayRequiredForDuration(timeToPayInSeconds: number): TokenAmount {
    const scaledBase = this.scaledTotalSupply - this.scaledPendingWithdrawals;
    if (scaledBase <= 0n) return this.underlyingToken.getAmount(0);
    const basePrincipal = this.underlyingToken.getAmount(
      rayMulBigint(scaledBase, this.scaleFactor)
    );
    const baseAPRRay = this.currentBaseLenderAPR;
    const protocolFeeAPRRay = this.currentProtocolAPR;
    const delinquencyFeeAPRRay = this.currentPenaltyAPR;
    const lenderRequirementGrowthPerSecond = basePrincipal
      .rayMul(baseAPRRay + delinquencyFeeAPRRay)
      .div(SECONDS_IN_365_DAYS)
      .bipMul(this.reserveRatioBips);
    const protocolRequirementGrowthPerSecond = basePrincipal
      .rayMul(protocolFeeAPRRay)
      .div(SECONDS_IN_365_DAYS);
    const totalRequirementGrowthPerSecond = lenderRequirementGrowthPerSecond.add(
      protocolRequirementGrowthPerSecond.raw
    );
    return totalRequirementGrowthPerSecond.mul(timeToPayInSeconds);
  }

  /**
   * @dev Calculate effective interest rate currently paid by borrower.
   *      Borrower pays base APR, protocol fee (on base APR) and delinquency
   *      fee (if delinquent beyond grace period).
   *
   * @return apr paid by borrower in ray
   */
  // Preserve ethers-era consumers whose formatting helpers typed APR rays as BigNumber.
  // Runtime remains bigint, with BigInt compatibility methods installed by token.ts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get effectiveBorrowerAPR(): any {
    return (
      bipMulBigint(this.currentBaseLenderAPR, BIP_BIGINT + BigInt(this.protocolFeeBips)) +
      this.currentPenaltyAPR
    );
  }

  /**
   * @dev Calculate effective interest rate currently earned by lenders.
   *     Lenders earn base APR and delinquency fee (if delinquent beyond grace period)
   *
   * @return apr earned by lender in ray
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get effectiveLenderAPR(): any {
    return this.currentBaseLenderAPR + this.currentPenaltyAPR;
  }

  /* -------------------------------------------------------------------------- */
  /*                            Withdrawal Execution                            */
  /* -------------------------------------------------------------------------- */

  async executeWithdrawal({
    lender,
    expiry
  }: Pick<LenderWithdrawalStatus, "lender" | "expiry">): Promise<TransactionHash> {
    return submitPreparedTransaction(
      this.signer,
      prepareTransaction({
        to: this.address,
        abi: wildcatMarketAbi,
        functionName: "executeWithdrawal",
        args: [lender, expiry]
      })
    );
  }

  async executeWithdrawals(
    withdrawals: Array<Pick<LenderWithdrawalStatus, "lender" | "expiry">>
  ): Promise<TransactionHash> {
    const lenders = withdrawals.map((w) => w.lender);
    const expiries = withdrawals.map((w) => w.expiry);
    return submitPreparedTransaction(
      this.signer,
      prepareTransaction({
        to: this.address,
        abi: wildcatMarketAbi,
        functionName: "executeWithdrawals",
        args: [lenders, expiries]
      })
    );
  }

  populateRepayAndProcessUnpaidWithdrawalBatches(
    amount: TokenAmount,
    maxBatches = 10
  ): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcatMarketAbi,
      functionName: "repayAndProcessUnpaidWithdrawalBatches",
      args: [amount.raw, maxBatches]
    });
  }

  async repayAndProcessUnpaidWithdrawalBatches(
    amount: TokenAmount,
    maxBatches = 10
  ): Promise<TransactionHash> {
    return submitPreparedTransaction(
      this.signer,
      this.populateRepayAndProcessUnpaidWithdrawalBatches(amount, maxBatches)
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Set APR                                  */
  /* -------------------------------------------------------------------------- */

  get originalReserveRatioAndAnnualInterestBips(): [number, number] {
    return this.temporaryReserveRatio
      ? [this.originalReserveRatioBips, this.originalAnnualInterestBips]
      : [this.reserveRatioBips, this.annualInterestBips];
  }

  getReserveRatioForNewAPR(annualInterestBips: number): number {
    const [originalReserveRatioBips, originalAnnualInterestBips] =
      this.originalReserveRatioAndAnnualInterestBips;
    // If the new APR is lower, the new reserve ratio is double the relative reduction
    if (annualInterestBips < originalAnnualInterestBips) {
      let doubleRelativeDiff: number;
      if (this.version === MarketVersion.V2) {
        const reduction = BigInt(originalAnnualInterestBips - annualInterestBips);
        if (reduction * 10_000n <= BigInt(originalAnnualInterestBips) * 2_500n) {
          // v2 only raises the reserve ratio when the exact reduction exceeds 25%.
          return originalReserveRatioBips;
        }
        if (this.eventGeneration === "v2.5") {
          doubleRelativeDiff = Number((20_000n * reduction) / BigInt(originalAnnualInterestBips));
        } else {
          const relativeDiff = Number((10_000n * reduction) / BigInt(originalAnnualInterestBips));
          doubleRelativeDiff = 2 * relativeDiff;
        }
      } else {
        doubleRelativeDiff = Number(
          (20_000n * BigInt(originalAnnualInterestBips - annualInterestBips)) /
            BigInt(originalAnnualInterestBips)
        );
      }

      const boundRelativeDiff = Math.min(10000, doubleRelativeDiff);
      return Math.max(boundRelativeDiff, originalReserveRatioBips);
    } else if (this.temporaryReserveRatio) {
      return this.originalReserveRatioBips;
    }
    // If there is a previous change that has expired, the original reserve
    return originalReserveRatioBips;
  }

  calculateLiquidityCoverageForReserveRatio(reserveRatio: number): TokenAmount {
    return this.underlyingToken.getAmount(
      calculateLiquidityCoverage({
        eventGeneration: this.eventGeneration,
        scaledTotalSupply: this.scaledTotalSupply,
        scaledPendingWithdrawals: this.scaledPendingWithdrawals,
        reserveRatioBips: reserveRatio,
        scaleFactor: this.scaleFactor,
        accruedProtocolFees: this.lastAccruedProtocolFees.raw,
        normalizedUnclaimedWithdrawals: this.normalizedUnclaimedWithdrawals.raw
      })
    );
  }

  canChangeAPR(annualInterestBips: number): boolean {
    const originalAnnualInterestBips = this.temporaryReserveRatio
      ? this.originalAnnualInterestBips
      : this.annualInterestBips;
    if (annualInterestBips < originalAnnualInterestBips || this.temporaryReserveRatio) {
      const newReserveRatioBips = this.getReserveRatioForNewAPR(annualInterestBips);
      const newCoverageLiquidity =
        this.calculateLiquidityCoverageForReserveRatio(newReserveRatioBips);
      return this.totalAssets.gte(newCoverageLiquidity);
    }
    return true;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Instance Queries                              */
  /* -------------------------------------------------------------------------- */

  /**
   * @returns Balance of an account in both market and underlying tokens,
   *          as well as the amount of underlying tokens approved for the market.
   */
  async getAccount(account?: string): Promise<MarketAccount> {
    if (!account) {
      account = await this.signer.getAddress();
    }
    return MarketAccount.getMarketAccount(this.chainId, this.provider, account, this);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Updates                                  */
  /* -------------------------------------------------------------------------- */

  async update(): Promise<void> {
    if (this.version === MarketVersion.V2) {
      if (hasUnifiedLatestLensForDirectReads(this.chainId)) {
        try {
          const market = await getUnifiedMarketDataV2(this.chainId, this.provider, this.address);
          this.updateWith(market);
          return;
        } catch (_) {
          // Fall back to the pre-2.5 V2 lens until unified lens deployment is reliable.
        }
      }
      const market = await getV2MarketData(this.chainId, this.provider, this.address);
      this.updateWith(market);
      return;
    }

    const market = await getLegacyMarketData(this.chainId, this.provider, this.address);
    this.updateWith(market);
  }

  updateWith(
    data:
      | MarketDataStructOutput
      | MarketDataV2StructOutput
      | MarketDataBaseV2_5StructOutput
      | MarketDataV2_5StructOutput
  ): void {
    const baseData = "market" in data ? data.market : data;
    const nextScaleFactor = toRawAmount(baseData.scaleFactor);
    const nextScaledTotalSupply = toRawAmount(baseData.scaledTotalSupply);
    const nextScaledPendingWithdrawals = toRawAmount(baseData.scaledPendingWithdrawals);
    const nextLastAccruedProtocolFees = toRawAmount(baseData.lastAccruedProtocolFees);

    // Note: this adds all the interest accrued to the base interest accrued, since the lens
    // doesn't give us any way to distinguish between base interest and delinquency fees.
    if (
      this.scaledTotalSupply === nextScaledTotalSupply &&
      nextScaleFactor > this.scaleFactor &&
      this.totalBaseInterestAccrued
    ) {
      const lastTotalValue = rayMulBigint(this.scaledTotalSupply, this.scaleFactor);
      const currentTotalValue = rayMulBigint(this.scaledTotalSupply, nextScaleFactor);
      const baseInterestAccrued = currentTotalValue - lastTotalValue;
      this.totalBaseInterestAccrued = this.totalBaseInterestAccrued.add(baseInterestAccrued);
    }

    if (
      nextLastAccruedProtocolFees > this.lastAccruedProtocolFees.raw &&
      this.totalProtocolFeesAccrued
    ) {
      this.totalProtocolFeesAccrued = this.totalProtocolFeesAccrued.add(
        nextLastAccruedProtocolFees - this.lastAccruedProtocolFees.raw
      );
    }
    this.borrower = baseData.borrower;
    if ("market" in data) {
      this.borrowerPrincipal =
        data.borrowerPrincipal.toLowerCase() === zeroAddress ? undefined : data.borrowerPrincipal;
      this.pendingBorrower =
        data.pendingBorrower.toLowerCase() === zeroAddress ? undefined : data.pendingBorrower;
      this.pendingBorrowerPrincipal =
        data.pendingBorrowerPrincipal.toLowerCase() === zeroAddress
          ? undefined
          : data.pendingBorrowerPrincipal;
      this.borrowerIdentityRegistry =
        data.borrowerIdentityRegistry.toLowerCase() === zeroAddress
          ? undefined
          : data.borrowerIdentityRegistry;
      this.eventGeneration = this.borrowerIdentityRegistry ? "v2.5" : "legacy";
    }
    this.feeRecipient = baseData.feeRecipient;
    this.protocolFeeBips = toNumber(baseData.protocolFeeBips);
    this.delinquencyFeeBips = toNumber(baseData.delinquencyFeeBips);
    this.delinquencyGracePeriod = toNumber(baseData.delinquencyGracePeriod);
    this.withdrawalBatchDuration = toNumber(baseData.withdrawalBatchDuration);
    this.reserveRatioBips = toNumber(baseData.reserveRatioBips);
    this.annualInterestBips = toNumber(baseData.annualInterestBips);
    this.temporaryReserveRatio = baseData.temporaryReserveRatio;
    this.originalAnnualInterestBips = toNumber(baseData.originalAnnualInterestBips);
    this.originalReserveRatioBips = toNumber(baseData.originalReserveRatioBips);
    this.temporaryReserveRatioExpiry = toNumber(baseData.temporaryReserveRatioExpiry);
    this.isClosed = baseData.isClosed;
    this.scaleFactor = nextScaleFactor;
    this.totalSupply = this.marketToken.getAmount(baseData.totalSupply);
    this.maxTotalSupply = this.marketToken.getAmount(baseData.maxTotalSupply);
    this.scaledTotalSupply = nextScaledTotalSupply;
    this.totalAssets = this.underlyingToken.getAmount(baseData.totalAssets);
    this.lastAccruedProtocolFees = this.underlyingToken.getAmount(baseData.lastAccruedProtocolFees);
    this.normalizedUnclaimedWithdrawals = this.underlyingToken.getAmount(
      baseData.normalizedUnclaimedWithdrawals
    );
    this.scaledPendingWithdrawals = nextScaledPendingWithdrawals;
    this.pendingWithdrawalExpiry = toNumber(baseData.pendingWithdrawalExpiry);
    this.isDelinquent = baseData.isDelinquent;
    this.timeDelinquent = toNumber(baseData.timeDelinquent);
    this.lastInterestAccruedTimestamp = toNumber(baseData.lastInterestAccruedTimestamp);
    this.unpaidWithdrawalBatchExpiries = baseData.unpaidWithdrawalBatchExpiries.map(toNumber);
    this.coverageLiquidity = this.underlyingToken.getAmount(baseData.coverageLiquidity);
    if ("hooksFactory" in baseData) {
      this.hooksFactory = baseData.hooksFactory;
    }
    if ("hooksConfig" in baseData) {
      assert(this.version === MarketVersion.V2, `Can not push V2 lens data to V1 market!`);
      const config = this.hooksConfig;
      assert(config !== undefined, `V2 market has no hooksConfig!`);
      config.flags = { ...baseData.hooksConfig.flags };
      config.minimumDeposit = this.underlyingToken.getAmount(baseData.hooksConfig.minimumDeposit);
      if (config.kind === HooksKind.FixedTerm) {
        config.fixedTermEndTime = toNumber(baseData.hooksConfig.fixedTermEndTime);
      } else if (config.kind === HooksKind.PeriodicTerm) {
        config.firstWithdrawalWindowStart = toNumber(
          baseData.hooksConfig.firstWithdrawalWindowStart
        );
        config.periodDuration = toNumber(baseData.hooksConfig.periodDuration);
        config.withdrawalWindowDuration = toNumber(baseData.hooksConfig.withdrawalWindowDuration);
        config.periodicTermClosed = baseData.hooksConfig.periodicTermClosed;
      }
      if ("hooks" in baseData) {
        this.roleProviders = roleProvidersFromLens(baseData.hooks);
      }
    } else {
      assert(this.version === MarketVersion.V1, `Can not push V1 lens data to V2 market!`);
    }
    if ("market" in data) {
      this.commitmentFeeBips = data.commitmentFeeBips.isPresent
        ? toNumber(data.commitmentFeeBips.value)
        : undefined;
      this.drawnAmount = data.drawnAmount.isPresent
        ? this.underlyingToken.getAmount(data.drawnAmount.value)
        : undefined;
      this.marketKind = marketKindFromRevolvingFields(
        data.commitmentFeeBips.isPresent,
        data.drawnAmount.isPresent
      );
    } else {
      this.commitmentFeeBips = undefined;
      this.drawnAmount = undefined;
      const nextMarketKind =
        "hooksFactory" in baseData
          ? getConfiguredMarketKindForHooksFactory(this.chainId, baseData.hooksFactory)
          : "standard";
      this.marketKind =
        nextMarketKind === "unknown" && this.provenance
          ? this.provenance.marketKind
          : nextMarketKind;
    }
    this.stateSource = "live";
  }

  updateWithLiveData(data: MarketLiveDataV2_5StructOutput): void {
    assert(
      data.market.toLowerCase() === this.address.toLowerCase(),
      `Live market data address mismatch`
    );

    const nextScaleFactor = toRawAmount(data.scaleFactor);
    const nextScaledTotalSupply = toRawAmount(data.scaledTotalSupply);
    const nextScaledPendingWithdrawals = toRawAmount(data.scaledPendingWithdrawals);
    const nextLastAccruedProtocolFees = toRawAmount(data.lastAccruedProtocolFees);

    if (
      this.scaledTotalSupply === nextScaledTotalSupply &&
      nextScaleFactor > this.scaleFactor &&
      this.totalBaseInterestAccrued
    ) {
      const lastTotalValue = rayMulBigint(this.scaledTotalSupply, this.scaleFactor);
      const currentTotalValue = rayMulBigint(this.scaledTotalSupply, nextScaleFactor);
      this.totalBaseInterestAccrued = this.totalBaseInterestAccrued.add(
        currentTotalValue - lastTotalValue
      );
    }

    if (
      nextLastAccruedProtocolFees > this.lastAccruedProtocolFees.raw &&
      this.totalProtocolFeesAccrued
    ) {
      this.totalProtocolFeesAccrued = this.totalProtocolFeesAccrued.add(
        nextLastAccruedProtocolFees - this.lastAccruedProtocolFees.raw
      );
    }

    this.protocolFeeBips = toNumber(data.protocolFeeBips);
    this.reserveRatioBips = toNumber(data.reserveRatioBips);
    this.annualInterestBips = toNumber(data.annualInterestBips);
    this.isClosed = data.isClosed;
    this.scaleFactor = nextScaleFactor;
    this.totalSupply = this.marketToken.getAmount(data.totalSupply);
    this.maxTotalSupply = this.marketToken.getAmount(data.maxTotalSupply);
    this.scaledTotalSupply = nextScaledTotalSupply;
    this.totalAssets = this.underlyingToken.getAmount(data.totalAssets);
    this.lastAccruedProtocolFees = this.underlyingToken.getAmount(data.lastAccruedProtocolFees);
    this.normalizedUnclaimedWithdrawals = this.underlyingToken.getAmount(
      data.normalizedUnclaimedWithdrawals
    );
    this.scaledPendingWithdrawals = nextScaledPendingWithdrawals;
    this.pendingWithdrawalExpiry = toNumber(data.pendingWithdrawalExpiry);
    this.isDelinquent = data.isDelinquent;
    this.timeDelinquent = toNumber(data.timeDelinquent);
    this.lastInterestAccruedTimestamp = toNumber(data.lastInterestAccruedTimestamp);
    this.coverageLiquidity = this.underlyingToken.getAmount(data.coverageLiquidity);
    this.commitmentFeeBips = data.commitmentFeeBips.isPresent
      ? toNumber(data.commitmentFeeBips.value)
      : undefined;
    this.drawnAmount = data.drawnAmount.isPresent
      ? this.underlyingToken.getAmount(data.drawnAmount.value)
      : undefined;
    this.marketKind = marketKindFromRevolvingFields(
      data.commitmentFeeBips.isPresent,
      data.drawnAmount.isPresent
    );
    this.stateSource = "live";
  }

  /* -------------------------------------------------------------------------- */
  /*                            Class Builder Methods                           */
  /* -------------------------------------------------------------------------- */

  static fromSubgraphMarketData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: SubgraphMarketHydrationData,
    signerAddress?: string
  ): Market {
    const provenance = normalizeSubgraphMarketProvenance(data);
    const indexedSnapshot = normalizeSubgraphMarketSnapshot(data.snapshot);
    const indexedState = data.snapshot ?? data;
    const underlyingToken = Token.fromSubgraphToken(chainId, data._asset, provider);
    const marketToken = new Token(
      chainId,
      provenance.address,
      data.name,
      data.symbol,
      data.decimals,
      false,
      provider
    );
    const hasTotals = hasSubgraphMarketTotals(data);
    const hasRecords = hasSubgraphMarketRecords(data);
    const scaledTotalSupply = toRawAmount(indexedState.scaledTotalSupply);
    const scaleFactor = toRawAmount(indexedState.scaleFactor);
    const scaledWithdrawals = toRawAmount(indexedState.scaledPendingWithdrawals);
    const coverageLiquidity = calculateLiquidityCoverage({
      eventGeneration: provenance.eventGeneration,
      scaledTotalSupply,
      scaledPendingWithdrawals: scaledWithdrawals,
      reserveRatioBips: indexedState.reserveRatioBips,
      scaleFactor,
      accruedProtocolFees: toRawAmount(indexedState.pendingProtocolFees),
      normalizedUnclaimedWithdrawals: toRawAmount(indexedState.normalizedUnclaimedWithdrawals)
    });

    let hooksConfig: HooksConfig | undefined;
    let hooksFactory: string | undefined;
    let roleProviders: RoleProvider[] | undefined;
    if (data.version === MarketVersion.V2) {
      assert(!!data.hooks, `V2 markets require hooks`);
      assert(!!data.hooksConfig, `V2 markets require hooksConfig`);
      roleProviders =
        "providers" in data.hooks ? data.hooks.providers.map(roleProviderFromSubgraph) : undefined;
      const {
        minimumDeposit: _minimumDeposit,
        depositRequiresAccess,
        transferRequiresAccess,
        queueWithdrawalRequiresAccess,
        allowClosureBeforeTerm,
        allowTermReduction,
        fixedTermEndTime,
        firstWithdrawalWindowStart,
        periodDuration,
        withdrawalWindowDuration,
        periodicTermClosed,
        pendingAprChangeAnnualInterestBips,
        pendingAprChangeProposalTimestamp,
        pendingAprChangeResponseWindowStart,
        pendingAprChangeResponseWindowEnd,
        transfersDisabled
      } = data.hooksConfig;
      const flags = {
        useOnDeposit: data.hooksConfig.useOnDeposit,
        useOnQueueWithdrawal: data.hooksConfig.useOnQueueWithdrawal,
        useOnExecuteWithdrawal: data.hooksConfig.useOnExecuteWithdrawal,
        useOnTransfer: data.hooksConfig.useOnTransfer,
        useOnBorrow: data.hooksConfig.useOnBorrow,
        useOnRepay: data.hooksConfig.useOnRepay,
        useOnCloseMarket: data.hooksConfig.useOnCloseMarket,
        useOnNukeFromOrbit: data.hooksConfig.useOnNukeFromOrbit,
        useOnSetMaxTotalSupply: data.hooksConfig.useOnSetMaxTotalSupply,
        useOnSetAnnualInterestAndReserveRatioBips:
          data.hooksConfig.useOnSetAnnualInterestAndReserveRatioBips,
        useOnSetProtocolFeeBips: data.hooksConfig.useOnSetProtocolFeeBips
      };
      const { id } = data.hooks;
      const template = hooksTemplateFromSubgraph(
        chainId,
        provider,
        data.hooks.templateRegistration
      );
      hooksFactory = template.hooksFactory;
      assert(
        provenance.hooksFactory?.address.toLowerCase() === hooksFactory.toLowerCase(),
        `Market hooks factory does not match its template registration`
      );
      const minimumDeposit = _minimumDeposit
        ? underlyingToken.getAmount(_minimumDeposit)
        : undefined;
      if (template.kind === HooksKind.OpenTerm) {
        hooksConfig = {
          kind: HooksKind.OpenTerm,
          hooksAddress: id,
          template,
          flags,
          minimumDeposit,
          transferRequiresAccess,
          depositRequiresAccess,
          allowForceBuyBacks: data.hooksConfig.allowForceBuyBacks,
          transfersDisabled
        };
      } else if (template.kind === HooksKind.FixedTerm) {
        hooksConfig = {
          kind: HooksKind.FixedTerm,
          hooksAddress: id,
          template,
          flags,
          minimumDeposit,
          transferRequiresAccess,
          depositRequiresAccess,
          queueWithdrawalRequiresAccess,
          allowClosureBeforeTerm,
          allowForceBuyBacks: data.hooksConfig.allowForceBuyBacks,
          allowTermReduction,
          fixedTermEndTime,
          transfersDisabled
        };
      } else if (template.kind === HooksKind.PeriodicTerm) {
        hooksConfig = {
          kind: HooksKind.PeriodicTerm,
          hooksAddress: id,
          template,
          flags,
          minimumDeposit,
          transferRequiresAccess,
          depositRequiresAccess,
          queueWithdrawalRequiresAccess,
          firstWithdrawalWindowStart,
          periodDuration,
          withdrawalWindowDuration,
          periodicTermClosed,
          pendingAprChangeAnnualInterestBips,
          pendingAprChangeProposalTimestamp,
          pendingAprChangeResponseWindowStart,
          pendingAprChangeResponseWindowEnd,
          transfersDisabled
        };
      }
    }
    const marketKind: MarketKind = provenance.marketKind;
    return new Market({
      chainId,
      provider,
      version: data.version,
      eventGeneration: provenance.eventGeneration,
      hooksFactory,
      marketKind,
      hooksConfig,
      roleProviders,
      marketToken,
      underlyingToken,
      borrower: data.borrower,
      borrowerPrincipal: data.borrowerPrincipal,
      ...(data.pendingBorrower ? { pendingBorrower: data.pendingBorrower } : {}),
      ...(data.pendingBorrowerPrincipal
        ? { pendingBorrowerPrincipal: data.pendingBorrowerPrincipal }
        : {}),
      ...(data.borrowerIdentityRegistryAddress
        ? { borrowerIdentityRegistry: data.borrowerIdentityRegistryAddress }
        : {}),
      controller: data.controller?.id,
      feeRecipient: data.feeRecipient,
      protocolFeeBips: indexedState.protocolFeeBips,
      delinquencyFeeBips: data.delinquencyFeeBips,
      delinquencyGracePeriod: data.delinquencyGracePeriod,
      withdrawalBatchDuration: data.withdrawalBatchDuration,
      reserveRatioBips: indexedState.reserveRatioBips,
      annualInterestBips: indexedState.annualInterestBips,
      temporaryReserveRatio: indexedState.temporaryReserveRatioActive,
      originalAnnualInterestBips: indexedState.originalAnnualInterestBips,
      originalReserveRatioBips: indexedState.originalReserveRatioBips,
      temporaryReserveRatioExpiry: indexedState.temporaryReserveRatioExpiry,
      isClosed: indexedState.isClosed,
      scaleFactor,
      totalSupply: marketToken.getAmount(rayMulBigint(scaledTotalSupply, scaleFactor)),
      maxTotalSupply: marketToken.getAmount(indexedState.maxTotalSupply),
      scaledTotalSupply: scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(0), // @todo maybe update subgraph to query this per update?
      lastAccruedProtocolFees: underlyingToken.getAmount(indexedState.pendingProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        indexedState.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: scaledWithdrawals,
      pendingWithdrawalExpiry: +indexedState.pendingWithdrawalExpiry,
      isDelinquent: indexedState.isDelinquent,
      timeDelinquent: indexedState.timeDelinquent,
      lastInterestAccruedTimestamp: indexedState.lastInterestAccruedTimestamp,
      unpaidWithdrawalBatchExpiries: [] /* data.unpaidWithdrawalBatchExpiries */,
      coverageLiquidity: underlyingToken.getAmount(coverageLiquidity),
      commitmentFeeBips:
        indexedState.commitmentFeeBips != null ? Number(indexedState.commitmentFeeBips) : undefined,
      drawnAmount:
        indexedState.drawnAmount != null
          ? underlyingToken.getAmount(indexedState.drawnAmount)
          : undefined,
      totalBorrowed: underlyingToken.getAmount(hasTotals ? data.totalBorrowed : 0),
      totalRepaid: underlyingToken.getAmount(hasTotals ? data.totalRepaid : 0),
      totalBaseInterestAccrued: underlyingToken.getAmount(
        hasTotals ? data.totalBaseInterestAccrued : 0
      ),
      totalDelinquencyFeesAccrued: underlyingToken.getAmount(
        hasTotals ? data.totalDelinquencyFeesAccrued : 0
      ),
      totalProtocolFeesAccrued: underlyingToken.getAmount(
        hasTotals ? data.totalProtocolFeesAccrued : 0
      ),
      totalDeposited: underlyingToken.getAmount(hasTotals ? data.totalDeposited : 0),
      latestDepositTimestamp: data.latestDeposit?.[0]?.blockTimestamp,
      depositRecords: hasRecords ? data.depositRecords : undefined,
      repaymentRecords: hasRecords ? data.repaymentRecords : undefined,
      borrowRecords: hasRecords ? data.borrowRecords : undefined,
      feeCollectionRecords: hasRecords ? data.feeCollectionRecords : undefined,
      deployedEvent: data.deployedEvent,
      eventIndex: data.eventIndex,
      numCollateralContracts: data.numCollateralContracts,
      signerAddress,
      provenance,
      indexedSnapshot,
      stateSource: "indexed"
    });
  }

  static fromMarketData(
    chainId: SupportedChainId,
    data: MarketDataStructOutput,
    provider: SignerOrProvider,
    signerAddress?: string
  ): Market {
    const marketToken = Token.fromTokenMetadata(chainId, data.marketToken, provider);
    const underlyingToken = Token.fromTokenMetadata(chainId, data.underlyingToken, provider);
    return new Market({
      provider,
      version: MarketVersion.V1,
      eventGeneration: "legacy",
      marketKind: "standard",
      chainId: chainId,
      marketToken: marketToken,
      underlyingToken: underlyingToken,
      borrower: data.borrower,
      borrowerPrincipal: data.borrower,
      controller: data.controller,
      feeRecipient: data.feeRecipient,
      protocolFeeBips: toNumber(data.protocolFeeBips),
      delinquencyFeeBips: toNumber(data.delinquencyFeeBips),
      delinquencyGracePeriod: toNumber(data.delinquencyGracePeriod),
      withdrawalBatchDuration: toNumber(data.withdrawalBatchDuration), // @todo add withdrawalBatchDuration to lens output
      reserveRatioBips: toNumber(data.reserveRatioBips),
      annualInterestBips: toNumber(data.annualInterestBips),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: toNumber(data.originalAnnualInterestBips),
      originalReserveRatioBips: toNumber(data.originalReserveRatioBips),
      temporaryReserveRatioExpiry: toNumber(data.temporaryReserveRatioExpiry),
      isClosed: data.isClosed,
      scaleFactor: toRawAmount(data.scaleFactor),
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: toRawAmount(data.scaledTotalSupply),
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: toRawAmount(data.scaledPendingWithdrawals),
      pendingWithdrawalExpiry: toNumber(data.pendingWithdrawalExpiry),
      isDelinquent: data.isDelinquent,
      timeDelinquent: toNumber(data.timeDelinquent),
      lastInterestAccruedTimestamp: toNumber(data.lastInterestAccruedTimestamp),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries.map(toNumber),
      coverageLiquidity: underlyingToken.getAmount(data.coverageLiquidity),
      totalBorrowed: undefined,
      totalRepaid: undefined,
      totalBaseInterestAccrued: undefined,
      totalDelinquencyFeesAccrued: undefined,
      totalProtocolFeesAccrued: undefined,
      totalDeposited: undefined,
      depositRecords: undefined,
      repaymentRecords: undefined,
      borrowRecords: undefined,
      feeCollectionRecords: undefined,
      deployedEvent: undefined,
      eventIndex: undefined,
      signerAddress: signerAddress
    });
  }

  static fromMarketDataV2(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    { hooks, hooksConfig: hooksConfigData, ...data }: MarketDataV2StructOutput,
    signerAddress?: string
  ): Market {
    const marketToken = Token.fromTokenMetadata(chainId, data.marketToken, provider);
    const underlyingToken = Token.fromTokenMetadata(chainId, data.underlyingToken, provider);
    const { hooksAddress } = hooks;
    let hooksConfig: HooksConfig;
    const hooksKind = toNumber(hooksConfigData.kind);
    if (hooksKind === 1) {
      hooksConfig = {
        kind: HooksKind.OpenTerm,
        hooksAddress: hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        allowForceBuyBacks: false
      } as OpenTermHooksConfig;
    } else if (hooksKind === 2) {
      hooksConfig = {
        kind: HooksKind.FixedTerm,
        hooksAddress: hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        fixedTermEndTime: toNumber(hooksConfigData.fixedTermEndTime),
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        allowTermReduction: hooksConfigData.allowTermReduction,
        allowClosureBeforeTerm: hooksConfigData.allowClosureBeforeTerm,
        allowForceBuyBacks: false
      } as FixedTermHooksConfig;
    } else if (hooksKind === 3) {
      hooksConfig = {
        kind: HooksKind.PeriodicTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        firstWithdrawalWindowStart: toNumber(hooksConfigData.firstWithdrawalWindowStart),
        periodDuration: toNumber(hooksConfigData.periodDuration),
        withdrawalWindowDuration: toNumber(hooksConfigData.withdrawalWindowDuration),
        periodicTermClosed: hooksConfigData.periodicTermClosed,
        pendingAprChangeAnnualInterestBips: 0,
        pendingAprChangeProposalTimestamp: 0,
        pendingAprChangeResponseWindowStart: 0,
        pendingAprChangeResponseWindowEnd: 0
      } as PeriodicTermHooksConfig;
    } else {
      throw Error(`Unknown hooks kind: ${hooks.hooksTemplate.name}, version #${hooksKind}`);
    }
    return new Market({
      provider,
      hooksFactory: data.hooksFactory,
      marketKind: getConfiguredMarketKindForHooksFactory(chainId, data.hooksFactory),
      hooksConfig,
      roleProviders: roleProvidersFromLens(hooks),
      version: MarketVersion.V2,
      eventGeneration: "legacy",
      chainId: chainId,
      marketToken: marketToken,
      underlyingToken: underlyingToken,
      borrower: data.borrower,
      borrowerPrincipal: data.borrower,
      feeRecipient: data.feeRecipient,
      protocolFeeBips: toNumber(data.protocolFeeBips),
      delinquencyFeeBips: toNumber(data.delinquencyFeeBips),
      delinquencyGracePeriod: toNumber(data.delinquencyGracePeriod),
      withdrawalBatchDuration: toNumber(data.withdrawalBatchDuration), // @todo add withdrawalBatchDuration to lens output
      reserveRatioBips: toNumber(data.reserveRatioBips),
      annualInterestBips: toNumber(data.annualInterestBips),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: toNumber(data.originalAnnualInterestBips),
      originalReserveRatioBips: toNumber(data.originalReserveRatioBips),
      temporaryReserveRatioExpiry: toNumber(data.temporaryReserveRatioExpiry),
      isClosed: data.isClosed,
      scaleFactor: toRawAmount(data.scaleFactor),
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: toRawAmount(data.scaledTotalSupply),
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: toRawAmount(data.scaledPendingWithdrawals),
      pendingWithdrawalExpiry: toNumber(data.pendingWithdrawalExpiry),
      isDelinquent: data.isDelinquent,
      timeDelinquent: toNumber(data.timeDelinquent),
      lastInterestAccruedTimestamp: toNumber(data.lastInterestAccruedTimestamp),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries.map(toNumber),
      coverageLiquidity: underlyingToken.getAmount(data.coverageLiquidity),
      signerAddress
      // borrowableAssets: underlyingToken.getAmount(data.borrowableAssets)
    });
  }

  static fromMarketDataV2_5(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    {
      market,
      borrowerPrincipal,
      pendingBorrower,
      pendingBorrowerPrincipal,
      borrowerIdentityRegistry,
      commitmentFeeBips,
      drawnAmount
    }: MarketDataV2_5StructOutput,
    allowForceBuyBacks: boolean,
    signerAddress?: string
  ): Market {
    void allowForceBuyBacks;
    const { hooks, hooksConfig: hooksConfigData, ...data } = market;
    const marketToken = Token.fromTokenMetadata(chainId, data.marketToken, provider);
    const underlyingToken = Token.fromTokenMetadata(chainId, data.underlyingToken, provider);
    const { hooksAddress } = hooks;
    let hooksConfig: HooksConfig;
    const hooksKind = toNumber(hooksConfigData.kind);
    if (hooksKind === 1) {
      hooksConfig = {
        kind: HooksKind.OpenTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        allowForceBuyBacks: false
      } as OpenTermHooksConfig;
    } else if (hooksKind === 2) {
      hooksConfig = {
        kind: HooksKind.FixedTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        fixedTermEndTime: toNumber(hooksConfigData.fixedTermEndTime),
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        allowTermReduction: hooksConfigData.allowTermReduction,
        allowClosureBeforeTerm: hooksConfigData.allowClosureBeforeTerm,
        allowForceBuyBacks: false
      } as FixedTermHooksConfig;
    } else if (hooksKind === 3) {
      hooksConfig = {
        kind: HooksKind.PeriodicTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        firstWithdrawalWindowStart: toNumber(hooksConfigData.firstWithdrawalWindowStart),
        periodDuration: toNumber(hooksConfigData.periodDuration),
        withdrawalWindowDuration: toNumber(hooksConfigData.withdrawalWindowDuration),
        periodicTermClosed: hooksConfigData.periodicTermClosed,
        pendingAprChangeAnnualInterestBips: 0,
        pendingAprChangeProposalTimestamp: 0,
        pendingAprChangeResponseWindowStart: 0,
        pendingAprChangeResponseWindowEnd: 0
      } as PeriodicTermHooksConfig;
    } else {
      throw Error(`Unknown hooks kind: ${hooks.hooksTemplate.name}, version #${hooksKind}`);
    }
    return new Market({
      provider,
      hooksFactory: data.hooksFactory,
      marketKind: marketKindFromRevolvingFields(commitmentFeeBips.isPresent, drawnAmount.isPresent),
      hooksConfig,
      roleProviders: roleProvidersFromLens(hooks),
      version: MarketVersion.V2,
      eventGeneration: borrowerIdentityRegistry.toLowerCase() === zeroAddress ? "legacy" : "v2.5",
      chainId,
      marketToken,
      underlyingToken,
      borrower: data.borrower,
      ...(borrowerPrincipal.toLowerCase() !== zeroAddress ? { borrowerPrincipal } : {}),
      ...(pendingBorrower.toLowerCase() !== zeroAddress ? { pendingBorrower } : {}),
      ...(pendingBorrowerPrincipal.toLowerCase() !== zeroAddress
        ? { pendingBorrowerPrincipal }
        : {}),
      ...(borrowerIdentityRegistry.toLowerCase() !== zeroAddress
        ? { borrowerIdentityRegistry }
        : {}),
      feeRecipient: data.feeRecipient,
      protocolFeeBips: toNumber(data.protocolFeeBips),
      delinquencyFeeBips: toNumber(data.delinquencyFeeBips),
      delinquencyGracePeriod: toNumber(data.delinquencyGracePeriod),
      withdrawalBatchDuration: toNumber(data.withdrawalBatchDuration),
      reserveRatioBips: toNumber(data.reserveRatioBips),
      annualInterestBips: toNumber(data.annualInterestBips),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: toNumber(data.originalAnnualInterestBips),
      originalReserveRatioBips: toNumber(data.originalReserveRatioBips),
      temporaryReserveRatioExpiry: toNumber(data.temporaryReserveRatioExpiry),
      isClosed: data.isClosed,
      scaleFactor: toRawAmount(data.scaleFactor),
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: toRawAmount(data.scaledTotalSupply),
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: toRawAmount(data.scaledPendingWithdrawals),
      pendingWithdrawalExpiry: toNumber(data.pendingWithdrawalExpiry),
      isDelinquent: data.isDelinquent,
      timeDelinquent: toNumber(data.timeDelinquent),
      lastInterestAccruedTimestamp: toNumber(data.lastInterestAccruedTimestamp),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries.map(toNumber),
      coverageLiquidity: underlyingToken.getAmount(data.coverageLiquidity),
      commitmentFeeBips: commitmentFeeBips.isPresent
        ? toNumber(commitmentFeeBips.value)
        : undefined,
      drawnAmount: drawnAmount.isPresent ? underlyingToken.getAmount(drawnAmount.value) : undefined,
      signerAddress
    });
  }

  static async fromUnifiedMarketData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: MarketDataBaseV2_5StructOutput | MarketDataV2_5StructOutput,
    signerAddress?: string
  ): Promise<Market> {
    const hasGenerationMetadata = "market" in data;
    const marketData = toUnifiedMarketDataV2(data);
    const market = Market.fromMarketDataV2_5(chainId, provider, marketData, false, signerAddress);
    if (!hasGenerationMetadata) market.eventGeneration = "unknown";
    return market;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Static Queries                               */
  /* -------------------------------------------------------------------------- */

  /**
   * @returns `Market` instance for `market`
   */
  static async getMarket(
    chainId: SupportedChainId,
    market: string,
    provider: SignerOrProvider
  ): Promise<Market> {
    const signerAddress = await getEthersSignerAddress(provider);
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getUnifiedMarketDataV2(chainId, provider, market);
        return Market.fromUnifiedMarketData(chainId, provider, data, signerAddress);
      } catch (_) {
        // Fall back to the legacy lens for V1 markets and pre-unified deployments.
      }
    }
    const data = await getLegacyMarketData(chainId, provider, market);
    return Market.fromMarketData(chainId, data, provider, signerAddress);
  }
  /**
   * @returns `Market` instance for `market`
   */
  static async getMarketV2(
    chainId: SupportedChainId,
    market: string,
    provider: SignerOrProvider
  ): Promise<Market> {
    const signerAddress = await getEthersSignerAddress(provider);
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getUnifiedMarketDataV2(chainId, provider, market);
        return Market.fromUnifiedMarketData(chainId, provider, data, signerAddress);
      } catch (_) {
        // Fall back to the pre-2.5 V2 lens for chains that have not fully migrated.
      }
    }
    const data = await getV2MarketData(chainId, provider, market);
    return Market.fromMarketDataV2(chainId, provider, data, signerAddress);
  }

  /**
   * @returns V2 `Market` instances for `markets`, preserving V2.5/RCF fields
   *          when the current lens exposes them.
   */
  static async getMarketsV2(
    chainId: SupportedChainId,
    markets: string[],
    provider: SignerOrProvider
  ): Promise<Market[]> {
    const signerAddress = await getEthersSignerAddress(provider);
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getUnifiedMarketsDataV2(chainId, provider, markets);
        return Promise.all(
          data.map((market) =>
            Market.fromUnifiedMarketData(chainId, provider, market, signerAddress)
          )
        );
      } catch (_) {
        // Fall back to the pre-2.5 V2 lens for chains that have not fully migrated.
      }
    }
    const data = await getV2MarketsData(chainId, provider, markets);
    return data.map((market) => Market.fromMarketDataV2(chainId, provider, market, signerAddress));
  }

  /**
   * Refresh existing V2 market instances with the focused live lens surface when available.
   * Falls back to broad V2 market reads so callers can use this as a route-intent API.
   */
  static async refreshMarketsV2LiveData(
    chainId: SupportedChainId,
    markets: Market[],
    provider: SignerOrProvider
  ): Promise<Market[]> {
    if (markets.length === 0) {
      return markets;
    }

    const marketAddresses = markets.map((market) => market.address);
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const updates = await getUnifiedMarketsLiveDataV2(chainId, provider, marketAddresses);
        updates.forEach((update, i) => {
          markets[i].updateWithLiveData(update);
        });
        return markets;
      } catch (_) {
        // Fall back to broad reads for older unified lens deployments.
      }
    }

    const refreshedMarkets = await Market.getMarketsV2(chainId, marketAddresses, provider);
    refreshedMarkets.forEach((market, i) => {
      Object.assign(markets[i], market);
    });
    return markets;
  }

  /**
   * Mutate an indexed or previously hydrated market list with current lens/RPC state.
   * Historical V1 markets use the legacy batch lens; V2 markets use the focused
   * V2.5 live surface when available.
   */
  static async hydrateMarketsLive(
    chainId: SupportedChainId,
    markets: Market[],
    provider: SignerOrProvider
  ): Promise<Market[]> {
    const v1Markets = markets.filter(({ version }) => version === MarketVersion.V1);
    const v2Markets = markets.filter(({ version }) => version === MarketVersion.V2);

    await Promise.all([
      v1Markets.length > 0
        ? getLegacyMarketsData(
            chainId,
            provider,
            v1Markets.map(({ address }) => address)
          ).then((updates) =>
            updates.forEach((update, index) => v1Markets[index].updateWith(update))
          )
        : Promise.resolve(),
      v2Markets.length > 0
        ? Market.refreshMarketsV2LiveData(chainId, v2Markets, provider)
        : Promise.resolve()
    ]);

    return markets;
  }

  /**
   * @returns `Market` instances for `markets`
   */
  static async getMarkets(
    chainId: SupportedChainId,
    markets: string[],
    provider: SignerOrProvider
  ): Promise<Market[]> {
    const signerAddress = await getEthersSignerAddress(provider);
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getUnifiedMarketsDataV2(chainId, provider, markets);
        return Promise.all(
          data.map((market) =>
            Market.fromUnifiedMarketData(chainId, provider, market, signerAddress)
          )
        );
      } catch (_) {
        return Promise.all(markets.map((market) => Market.getMarket(chainId, market, provider)));
      }
    }
    const data = await getLegacyMarketsData(chainId, provider, markets);
    return data.map((market) => Market.fromMarketData(chainId, market, provider, signerAddress));
  }

  /**
   * @return All deployed markets
   */
  static async getAllMarkets(
    chainId: SupportedChainId,
    provider: SignerOrProvider
  ): Promise<Market[]> {
    const markets = await getRegisteredMarkets(chainId, provider);
    if (!markets.length) {
      return [];
    }
    return Market.getMarkets(chainId, markets, provider);
  }

  /**
   * @dev Get a paginated list of deployed markets.
   */
  static async getPaginatedMarkets(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    start = 0,
    count: number
  ): Promise<Market[]> {
    if (count <= 0) {
      return [];
    }
    const totalMarkets = await getRegisteredMarketsCount(chainId, provider);
    if (start >= totalMarkets) {
      return [];
    }
    const end = Math.min(start + count, totalMarkets);
    const markets = await getRegisteredMarketsPage(chainId, provider, start, end);
    if (!markets.length) {
      return [];
    }
    return Market.getMarkets(chainId, markets, provider);
  }

  /**
   * @return Total number of deployed markets.
   */
  static async getMarketsCount(
    chainId: SupportedChainId,
    provider: SignerOrProvider
  ): Promise<number> {
    return getRegisteredMarketsCount(chainId, provider);
  }
}
