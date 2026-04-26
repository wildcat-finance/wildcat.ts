import {
  MarketDataBaseV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2_5StructOutput,
  MarketDataV2StructOutput,
  MarketLiveDataV2_5StructOutput
} from "./lens-types";
import { SupportedChainId, getMarketTypeForHooksFactory, hasDeploymentAddress } from "./constants";
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
  getV2MarketData
} from "./internal/market-lens";
import { TokenAmount, Token, toRawAmount } from "./token";
import {
  SignerOrProvider,
  ContractWrapper,
  PartialTransaction,
  MarketVersion,
  MarketType,
  HooksKind,
  HooksConfig,
  OpenTermHooksConfig,
  FixedTermHooksConfig,
  TransactionHash
} from "./types";
import { MarketAccount } from "./account";
import { LenderWithdrawalStatus } from "./withdrawal-status";

import {
  SubgraphBorrowDataFragment,
  SubgraphDepositDataFragment,
  SubgraphFeesCollectedDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketDeployedEventFragment,
  SubgraphMarketListDataFragment,
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
import { wildcatMarketAbi } from "./abi";
import { submitPreparedTransaction } from "./internal/viem-write";
import { getEthersSignerAddress } from "./internal/ethers-signer";

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
  marketType?: MarketType;
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

type SubgraphMarketHydrationData =
  | MakeOptional<
      SubgraphMarketDataWithEventsFragment,
      "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
    >
  | SubgraphMarketListDataFragment;

const hasSubgraphMarketTotals = (
  data: SubgraphMarketHydrationData
): data is MakeOptional<
  SubgraphMarketDataWithEventsFragment,
  "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
> => "totalBorrowed" in data;

const hasSubgraphMarketRecords = (
  data: SubgraphMarketHydrationData
): data is SubgraphMarketDataWithEventsFragment => "depositRecords" in data;

export type MarketArgs = {
  provider: SignerOrProvider;
  chainId: SupportedChainId;
  version: MarketVersion;
  marketToken: Token;
  underlyingToken: Token;
  hooksFactory?: string;
  marketType?: MarketType;
  hooksConfig?: HooksConfig;
  borrower: string;
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
  commitmentFeeBips?: number;
  drawnAmount?: TokenAmount;
  deployedEvent?: SubgraphMarketDeployedEventFragment;
  eventIndex?: number;
  signerAddress?: string;
  depositRecords?: SubgraphDepositDataFragment[];
  repaymentRecords?: SubgraphRepaymentDataFragment[];
  borrowRecords?: SubgraphBorrowDataFragment[];
  feeCollectionRecords?: SubgraphFeesCollectedDataFragment[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Market
  extends Omit<
    MarketArgs,
    "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords" | "provider"
  > {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export class Market extends ContractWrapper {
  public depositRecords: DepositRecord[];
  public repaymentRecords: RepaymentRecord[];
  public borrowRecords: BorrowRecord[];
  public feeCollectionRecords: FeeCollectionRecord[];

  constructor({ provider, ...args }: MarketArgs & { hooksConfig?: HooksConfig }) {
    super(provider);
    const { address, name, symbol, decimals } = args.marketToken;
    Object.assign(this, {
      address,
      name,
      symbol,
      decimals
    });
    Object.assign(this, args);
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
        marketType: this.marketType,
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
      marketType: this.marketType,
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
    return this.outstandingTotalSupply.bipMul(this.reserveRatioBips);
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
  get effectiveBorrowerAPR(): bigint {
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
  get effectiveLenderAPR(): bigint {
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
        const relativeDiff = Number(
          (10_000n * BigInt(originalAnnualInterestBips - annualInterestBips)) /
            BigInt(originalAnnualInterestBips)
        );
        if (relativeDiff <= 2_500) {
          // In v2, if the relative diff is 25% or less, the reserve ratio is not changed
          return originalReserveRatioBips;
        }
        doubleRelativeDiff = 2 * relativeDiff;
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
    const scaledRequiredReserves =
      bipMulBigint(this.scaledTotalSupply - this.scaledPendingWithdrawals, reserveRatio) +
      this.scaledPendingWithdrawals;
    return this.underlyingToken.getAmount(
      rayMulBigint(scaledRequiredReserves, this.scaleFactor) +
        this.lastAccruedProtocolFees.raw +
        this.normalizedUnclaimedWithdrawals.raw
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
      this.marketType = getMarketTypeForHooksFactory(this.chainId, baseData.hooksFactory);
    }
    if ("hooksConfig" in baseData) {
      assert(this.version === MarketVersion.V2, `Can not push V2 lens data to V1 market!`);
      const config = this.hooksConfig;
      assert(config !== undefined, `V2 market has no hooksConfig!`);
      config.minimumDeposit = this.underlyingToken.getAmount(baseData.hooksConfig.minimumDeposit);
      if (config.kind === HooksKind.FixedTerm) {
        config.fixedTermEndTime = toNumber(baseData.hooksConfig.fixedTermEndTime);
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
    } else {
      this.commitmentFeeBips = undefined;
      this.drawnAmount = undefined;
    }
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
    const underlyingToken = Token.fromSubgraphToken(chainId, data._asset, provider);
    const marketToken = new Token(
      chainId,
      data.id,
      data.name,
      data.symbol,
      data.decimals,
      false,
      provider
    );
    const hasTotals = hasSubgraphMarketTotals(data);
    const hasRecords = hasSubgraphMarketRecords(data);
    const scaledTotalSupply = toRawAmount(data.scaledTotalSupply);
    const scaleFactor = toRawAmount(data.scaleFactor);
    const scaledWithdrawals = toRawAmount(data.scaledPendingWithdrawals);
    const scaledRequiredReserves =
      bipMulBigint(scaledTotalSupply - scaledWithdrawals, data.reserveRatioBips) +
      scaledWithdrawals;
    const coverageLiquidity =
      rayMulBigint(scaledRequiredReserves, scaleFactor) +
      toRawAmount(data.pendingProtocolFees) +
      toRawAmount(data.normalizedUnclaimedWithdrawals);

    let hooksConfig: HooksConfig | undefined;
    let hooksFactory: string | undefined;
    if (data.version === MarketVersion.V2) {
      assert(!!data.hooks, `V2 markets require hooks`);
      assert(!!data.hooksConfig, `V2 markets require hooksConfig`);
      const {
        minimumDeposit: _minimumDeposit,
        depositRequiresAccess,
        transferRequiresAccess,
        queueWithdrawalRequiresAccess,
        allowClosureBeforeTerm,
        allowTermReduction,
        fixedTermEndTime,
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
        data.hooks.factoryHooksTemplate
      );
      hooksFactory = template.hooksFactory;
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
          allowForceBuyBacks: false,
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
          allowForceBuyBacks: false,
          allowTermReduction,
          fixedTermEndTime,
          transfersDisabled
        };
      }
    }
    return new Market({
      chainId,
      provider,
      version: data.version,
      hooksFactory,
      marketType: hooksFactory ? getMarketTypeForHooksFactory(chainId, hooksFactory) : undefined,
      hooksConfig,
      marketToken,
      underlyingToken,
      borrower: data.borrower,
      controller: data.controller?.id,
      feeRecipient: data.feeRecipient,
      protocolFeeBips: data.protocolFeeBips,
      delinquencyFeeBips: data.delinquencyFeeBips,
      delinquencyGracePeriod: data.delinquencyGracePeriod,
      withdrawalBatchDuration: data.withdrawalBatchDuration,
      reserveRatioBips: data.reserveRatioBips,
      annualInterestBips: data.annualInterestBips,
      temporaryReserveRatio: data.temporaryReserveRatioActive,
      originalAnnualInterestBips: data.originalAnnualInterestBips,
      originalReserveRatioBips: data.originalReserveRatioBips,
      temporaryReserveRatioExpiry: data.temporaryReserveRatioExpiry,
      isClosed: data.isClosed,
      scaleFactor,
      totalSupply: marketToken.getAmount(rayMulBigint(scaledTotalSupply, scaleFactor)),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(0), // @todo maybe update subgraph to query this per update?
      lastAccruedProtocolFees: underlyingToken.getAmount(data.pendingProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: scaledWithdrawals,
      pendingWithdrawalExpiry: +data.pendingWithdrawalExpiry,
      isDelinquent: data.isDelinquent,
      timeDelinquent: data.timeDelinquent,
      lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp,
      unpaidWithdrawalBatchExpiries: [] /* data.unpaidWithdrawalBatchExpiries */,
      coverageLiquidity: underlyingToken.getAmount(coverageLiquidity),
      commitmentFeeBips:
        data.commitmentFeeBips != null ? Number(data.commitmentFeeBips) : undefined,
      drawnAmount:
        data.drawnAmount != null ? underlyingToken.getAmount(data.drawnAmount) : undefined,
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
      depositRecords: hasRecords ? data.depositRecords : undefined,
      repaymentRecords: hasRecords ? data.repaymentRecords : undefined,
      borrowRecords: hasRecords ? data.borrowRecords : undefined,
      feeCollectionRecords: hasRecords ? data.feeCollectionRecords : undefined,
      deployedEvent: data.deployedEvent,
      eventIndex: data.eventIndex,
      numCollateralContracts: data.numCollateralContracts,
      signerAddress
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
      chainId: chainId,
      marketToken: marketToken,
      underlyingToken: underlyingToken,
      borrower: data.borrower,
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
    } else {
      throw Error(`Unknown hooks kind: ${hooks.hooksTemplate.name}, version #${hooksKind}`);
    }
    return new Market({
      provider,
      hooksFactory: data.hooksFactory,
      marketType: getMarketTypeForHooksFactory(chainId, data.hooksFactory),
      hooksConfig,
      version: MarketVersion.V2,
      chainId: chainId,
      marketToken: marketToken,
      underlyingToken: underlyingToken,
      borrower: data.borrower,
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
    { market, commitmentFeeBips, drawnAmount }: MarketDataV2_5StructOutput,
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
    } else {
      throw Error(`Unknown hooks kind: ${hooks.hooksTemplate.name}, version #${hooksKind}`);
    }
    return new Market({
      provider,
      hooksFactory: data.hooksFactory,
      marketType: getMarketTypeForHooksFactory(chainId, data.hooksFactory),
      hooksConfig,
      version: MarketVersion.V2,
      chainId,
      marketToken,
      underlyingToken,
      borrower: data.borrower,
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
    const marketData = toUnifiedMarketDataV2(data);
    return Market.fromMarketDataV2_5(chainId, provider, marketData, false, signerAddress);
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
    return Promise.all(
      markets.map(async (market) => {
        const data = await getV2MarketData(chainId, provider, market);
        return Market.fromMarketDataV2(chainId, provider, data, signerAddress);
      })
    );
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
