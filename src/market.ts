import { BigNumber, ContractTransaction } from "ethers";
import { Signer } from "@ethersproject/abstract-signer";
import {
  IFixedTermHooks__factory,
  IOpenTermHooks__factory,
  MarketDataBaseV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2_5StructOutput,
  MarketDataV2StructOutput,
  MarketDataV21StructOutput,
  WildcatMarket,
  WildcatMarket__factory
} from "./typechain";
import {
  SupportedChainId,
  getArchControllerContract,
  getLensV2_5Contract,
  getLensContract,
  getLensV2Contract,
  getMarketTypeForHooksFactory,
  hasDeploymentAddress
} from "./constants";
import { TokenAmount, Token, toBn } from "./token";
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
  PeriodicTermHooksConfig
} from "./types";
import { formatUnits } from "ethers/lib/utils";
import { MarketAccount } from "./account";
import { LenderWithdrawalStatus } from "./withdrawal-status";

import {
  SubgraphBorrowDataFragment,
  SubgraphDepositDataFragment,
  SubgraphFeesCollectedDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketDeployedEventFragment,
  SubgraphRepaymentDataFragment
} from "./gql/graphql";
import {
  BorrowRecord,
  DepositRecord,
  FeeCollectionRecord,
  MakeOptional,
  RepaymentRecord,
  parseMarketRecord,
  bipMul,
  mulDiv,
  rayDiv,
  rayMul,
  RAY,
  bipToRay,
  BIP,
  SECONDS_IN_365_DAYS,
  assert
} from "./utils";
import { hooksTemplateFromSubgraph } from "./access";

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
      value: BigNumber.from(0)
    },
    drawnAmount: {
      isPresent: false,
      value: BigNumber.from(0)
    }
  };
};

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
  scaleFactor: BigNumber;
  // Total amount of market tokens in existence
  totalSupply: TokenAmount;
  // Maximum amount of market tokens that can be minted
  maxTotalSupply: TokenAmount;
  scaledTotalSupply: BigNumber;
  // Total amount of underlying assets held in the market
  totalAssets: TokenAmount;
  lastAccruedProtocolFees: TokenAmount;
  normalizedUnclaimedWithdrawals: TokenAmount;
  scaledPendingWithdrawals: BigNumber;
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

export class Market extends ContractWrapper<WildcatMarket> {
  public depositRecords: DepositRecord[];
  public repaymentRecords: RepaymentRecord[];
  public borrowRecords: BorrowRecord[];
  public feeCollectionRecords: FeeCollectionRecord[];

  protected get _contractAddress(): string {
    return this.address;
  }

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

  readonly contractFactory = WildcatMarket__factory;

  /* -------------------------------------------------------------------------- */
  /*                              Property Getters                              */
  /* -------------------------------------------------------------------------- */

  get hooksKind(): HooksKind | undefined {
    return this.hooksConfig?.kind;
  }

  get isInFixedTerm(): boolean {
    if (this.version !== MarketVersion.V2) return false;
    const config = this.hooksConfig;
    return config?.kind === HooksKind.FixedTerm && config.fixedTermEndTime >= Date.now() / 1_000;
  }

  get periodicHooksConfig(): PeriodicTermHooksConfig | undefined {
    const config = this.hooksConfig;
    return config?.kind === HooksKind.PeriodicTerm ? config : undefined;
  }

  get isPeriodicTermClosed(): boolean {
    return !!this.periodicHooksConfig?.periodicTermClosed;
  }

  get isPeriodicWithdrawalWindowOpen(): boolean {
    const config = this.periodicHooksConfig;
    if (!config) return false;
    if (this.isClosed || config.periodicTermClosed) return true;
    if (config.periodDuration === 0) return false;

    const now = Math.floor(Date.now() / 1_000);
    if (now < config.firstWithdrawalWindowStart) return false;

    const timeInPeriod = (now - config.firstWithdrawalWindowStart) % config.periodDuration;
    return timeInPeriod < config.withdrawalWindowDuration;
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
    return timeInPeriod < config.withdrawalWindowDuration
      ? currentWindowStart
      : currentWindowStart + config.periodDuration;
  }

  /** @returns Percentage growth of the market since it was created */
  get allTimeGrowth(): number {
    // 27 - 2 to convert to percentage
    return +formatUnits(this.scaleFactor, 25);
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
    const drawnAmountRaw = drawnAmount.raw.gt(totalSupply) ? totalSupply : drawnAmount.raw;

    const utilizationBips = totalSupply.gt(0)
      ? drawnAmountRaw.mul(BIP).div(totalSupply).toNumber()
      : 0;

    const utilizationAprBips = totalSupply.gt(0)
      ? drawnAmountRaw.mul(this.annualInterestBips).div(totalSupply).toNumber()
      : 0;

    const blendedBaseAprBips = commitmentFeeBips + utilizationAprBips;
    const protocolAprBips = BigNumber.from(blendedBaseAprBips)
      .mul(this.protocolFeeBips)
      .div(BIP)
      .toNumber();
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

  private get currentBaseLenderAPR(): BigNumber {
    return bipToRay(this.currentBaseLenderAprBips);
  }

  private get currentPenaltyAPR(): BigNumber {
    return this.isIncurringPenalties ? bipToRay(this.delinquencyFeeBips) : BigNumber.from(0);
  }

  private get currentProtocolAPR(): BigNumber {
    return bipMul(this.currentBaseLenderAPR, BigNumber.from(this.protocolFeeBips));
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
      : +formatUnits(this.totalAssets.raw.mul(RAY).div(this.totalSupply.raw), 25);
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
    return this.underlyingToken.getAmount(rayMul(this.scaledPendingWithdrawals, this.scaleFactor));
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
      bipMul(this.outstandingTotalSupply.raw, BigNumber.from(this.reserveRatioBips))
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

  normalizeAmount(amount: BigNumber): BigNumber {
    return rayMul(amount, this.scaleFactor);
  }

  scaleAmount(amount: BigNumber): BigNumber {
    return rayDiv(amount, this.scaleFactor);
  }

  get secondsBeforeDelinquency(): number {
    if (this.willBeDelinquent || this.totalDebts.eq(0)) return 0;

    const scaledBase = this.scaledTotalSupply;
    const basePrincipal = this.underlyingToken.getAmount(rayMul(scaledBase, this.scaleFactor));

    const baseAPRRay = this.currentBaseLenderAPR;
    const protocolFeeAPRRay = this.currentProtocolAPR;
    const delinquencyFeeAPRRay = this.currentPenaltyAPR;

    // lender APR portion
    const lenderRequirementGrowthPerSecond = basePrincipal
      .rayMul(baseAPRRay.add(delinquencyFeeAPRRay))
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
    if (totalRequirementGrowthPerSecond.raw.isZero()) return Number.MAX_SAFE_INTEGER;

    const buffer = this.liquidReserves.sub(this.minimumReserves);
    if (buffer.raw.lte(0)) return 0; // we are delinquent
    return buffer.div(totalRequirementGrowthPerSecond, true).raw.toNumber(); // seconds until the party
  }

  getSecondsBeforeDelinquencyForBorrowedAmount(borrowAmount: TokenAmount): number {
    if (this.isDelinquent || this.totalDebts.eq(0)) return 0;
    const scaledBase = this.scaledTotalSupply;

    const basePrincipal = this.underlyingToken.getAmount(rayMul(scaledBase, this.scaleFactor));
    const baseAPRRay = this.currentBaseLenderAPR;
    const protocolFeeAPRRay = this.currentProtocolAPR;
    const delinquencyFeeAPRRay = this.currentPenaltyAPR;

    const lenderRequirementGrowthPerSecond = basePrincipal
      .rayMul(baseAPRRay.add(delinquencyFeeAPRRay))
      .div(SECONDS_IN_365_DAYS)
      .bipMul(this.reserveRatioBips);

    const protocolRequirementGrowthPerSecond = basePrincipal
      .rayMul(protocolFeeAPRRay)
      .div(SECONDS_IN_365_DAYS);

    const totalRequirementGrowthPerSecond = lenderRequirementGrowthPerSecond.add(
      protocolRequirementGrowthPerSecond.raw
    );
    if (totalRequirementGrowthPerSecond.raw.isZero()) return Number.MAX_SAFE_INTEGER;

    const postBorrowBuffer = this.liquidReserves.sub(this.minimumReserves).sub(borrowAmount);
    if (postBorrowBuffer.raw.lte(0)) return 0;
    return postBorrowBuffer.div(totalRequirementGrowthPerSecond, true).raw.toNumber();
  }
  /**
   * @dev Calculate token amount to be repayed by borrower for a given duration
   * to keep the market healthy.
   * @return token amount to be repayed
   **/
  repayRequiredForDuration(timeToPayInSeconds: number): TokenAmount {
    const scaledBase = this.scaledTotalSupply.sub(this.scaledPendingWithdrawals);
    if (scaledBase.lte(0)) return this.underlyingToken.getAmount(0);
    const basePrincipal = this.underlyingToken.getAmount(rayMul(scaledBase, this.scaleFactor));
    const baseAPRRay = this.currentBaseLenderAPR;
    const protocolFeeAPRRay = this.currentProtocolAPR;
    const delinquencyFeeAPRRay = this.currentPenaltyAPR;
    const lenderRequirementGrowthPerSecond = basePrincipal
      .rayMul(baseAPRRay.add(delinquencyFeeAPRRay))
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
  get effectiveBorrowerAPR(): BigNumber {
    let apr = bipMul(this.currentBaseLenderAPR, BIP.add(this.protocolFeeBips));
    apr = apr.add(this.currentPenaltyAPR);
    return apr;
  }

  /**
   * @dev Calculate effective interest rate currently earned by lenders.
   *     Lenders earn base APR and delinquency fee (if delinquent beyond grace period)
   *
   * @return apr earned by lender in ray
   */
  get effectiveLenderAPR(): BigNumber {
    return this.currentBaseLenderAPR.add(this.currentPenaltyAPR);
  }

  /* -------------------------------------------------------------------------- */
  /*                            Withdrawal Execution                            */
  /* -------------------------------------------------------------------------- */

  async executeWithdrawal({
    lender,
    expiry
  }: Pick<LenderWithdrawalStatus, "lender" | "expiry">): Promise<ContractTransaction> {
    return this.contract.executeWithdrawal(lender, expiry);
  }

  async executeWithdrawals(
    withdrawals: Array<Pick<LenderWithdrawalStatus, "lender" | "expiry">>
  ): Promise<ContractTransaction> {
    const lenders = withdrawals.map((w) => w.lender);
    const expiries = withdrawals.map((w) => w.expiry);
    return this.contract.executeWithdrawals(lenders, expiries);
  }

  populateRepayAndProcessUnpaidWithdrawalBatches(
    amount: TokenAmount,
    maxBatches = 10
  ): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("repayAndProcessUnpaidWithdrawalBatches", [
        amount.raw,
        maxBatches
      ]),
      value: "0"
    };
  }

  async repayAndProcessUnpaidWithdrawalBatches(
    amount: TokenAmount,
    maxBatches = 10
  ): Promise<ContractTransaction> {
    return this.contract.repayAndProcessUnpaidWithdrawalBatches(amount.raw, maxBatches);
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
        const relativeDiff = mulDiv(
          toBn(10_000),
          toBn(originalAnnualInterestBips - annualInterestBips),
          toBn(originalAnnualInterestBips)
        ).toNumber();
        if (relativeDiff <= 2_500) {
          // In v2, if the relative diff is 25% or less, the reserve ratio is not changed
          return originalReserveRatioBips;
        }
        doubleRelativeDiff = 2 * relativeDiff;
      } else {
        doubleRelativeDiff = mulDiv(
          toBn(20_000),
          toBn(originalAnnualInterestBips - annualInterestBips),
          toBn(originalAnnualInterestBips)
        ).toNumber();
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
    const scaledRequiredReserves = bipMul(
      this.scaledTotalSupply.sub(this.scaledPendingWithdrawals),
      toBn(reserveRatio)
    ).add(this.scaledPendingWithdrawals);
    return this.underlyingToken.getAmount(
      rayMul(scaledRequiredReserves, this.scaleFactor)
        .add(this.lastAccruedProtocolFees.raw)
        .add(this.normalizedUnclaimedWithdrawals.raw)
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
          const market = await getLensV2_5Contract(this.chainId, this.provider).getMarketDataV2(
            this.address
          );
          this.updateWith(market);
          return;
        } catch (_) {
          // Fall back to the pre-2.5 V2 lens until unified lens deployment is reliable.
        }
      }
      const market = await getLensV2Contract(this.chainId, this.provider).getMarketData(
        this.address
      );
      this.updateWith(market);
      return;
    }

    const market = await getLensContract(this.chainId, this.provider).getMarketData(this.address);
    this.updateWith(market);
  }

  updateWith(
    data:
      | MarketDataStructOutput
      | MarketDataV2StructOutput
      | MarketDataV21StructOutput
      | MarketDataBaseV2_5StructOutput
      | MarketDataV2_5StructOutput
  ): void {
    const baseData = "market" in data ? data.market : data;

    // Note: this adds all the interest accrued to the base interest accrued, since the lens
    // doesn't give us any way to distinguish between base interest and delinquency fees.
    if (
      this.scaledTotalSupply.eq(baseData.scaledTotalSupply) &&
      baseData.scaleFactor.gt(this.scaleFactor) &&
      this.totalBaseInterestAccrued
    ) {
      const lastTotalValue = rayMul(this.scaledTotalSupply, this.scaleFactor);
      const currentTotalValue = rayMul(this.scaledTotalSupply, baseData.scaleFactor);
      const baseInterestAccrued = currentTotalValue.sub(lastTotalValue);
      this.totalBaseInterestAccrued = this.totalBaseInterestAccrued.add(baseInterestAccrued);
    }

    if (
      baseData.lastAccruedProtocolFees.gt(this.lastAccruedProtocolFees.raw) &&
      this.totalProtocolFeesAccrued
    ) {
      this.totalProtocolFeesAccrued = this.totalProtocolFeesAccrued.add(
        baseData.lastAccruedProtocolFees.sub(this.lastAccruedProtocolFees.raw)
      );
    }
    this.feeRecipient = baseData.feeRecipient;
    this.protocolFeeBips = baseData.protocolFeeBips.toNumber();
    this.delinquencyFeeBips = baseData.delinquencyFeeBips.toNumber();
    this.delinquencyGracePeriod = baseData.delinquencyGracePeriod.toNumber();
    this.withdrawalBatchDuration = baseData.withdrawalBatchDuration.toNumber();
    this.reserveRatioBips = baseData.reserveRatioBips.toNumber();
    this.annualInterestBips = baseData.annualInterestBips.toNumber();
    this.temporaryReserveRatio = baseData.temporaryReserveRatio;
    this.originalAnnualInterestBips = baseData.originalAnnualInterestBips.toNumber();
    this.originalReserveRatioBips = baseData.originalReserveRatioBips.toNumber();
    this.temporaryReserveRatioExpiry = baseData.temporaryReserveRatioExpiry.toNumber();
    this.isClosed = baseData.isClosed;
    this.scaleFactor = baseData.scaleFactor;
    this.totalSupply = this.marketToken.getAmount(baseData.totalSupply);
    this.maxTotalSupply = this.marketToken.getAmount(baseData.maxTotalSupply);
    this.scaledTotalSupply = baseData.scaledTotalSupply;
    this.totalAssets = this.underlyingToken.getAmount(baseData.totalAssets);
    this.lastAccruedProtocolFees = this.underlyingToken.getAmount(baseData.lastAccruedProtocolFees);
    this.normalizedUnclaimedWithdrawals = this.underlyingToken.getAmount(
      baseData.normalizedUnclaimedWithdrawals
    );
    this.scaledPendingWithdrawals = baseData.scaledPendingWithdrawals;
    this.pendingWithdrawalExpiry = baseData.pendingWithdrawalExpiry.toNumber();
    this.isDelinquent = baseData.isDelinquent;
    this.timeDelinquent = baseData.timeDelinquent.toNumber();
    this.lastInterestAccruedTimestamp = baseData.lastInterestAccruedTimestamp.toNumber();
    this.unpaidWithdrawalBatchExpiries = baseData.unpaidWithdrawalBatchExpiries;
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
        config.fixedTermEndTime = baseData.hooksConfig.fixedTermEndTime;
      } else if (
        config.kind === HooksKind.PeriodicTerm &&
        "periodDuration" in baseData.hooksConfig
      ) {
        const periodicHooksConfigData = baseData.hooksConfig as unknown as {
          firstWithdrawalWindowStart: number;
          periodDuration: number;
          withdrawalWindowDuration: number;
          periodicTermClosed: boolean;
        };
        config.firstWithdrawalWindowStart = periodicHooksConfigData.firstWithdrawalWindowStart;
        config.periodDuration = periodicHooksConfigData.periodDuration;
        config.withdrawalWindowDuration = periodicHooksConfigData.withdrawalWindowDuration;
        config.periodicTermClosed = periodicHooksConfigData.periodicTermClosed;
      }
    } else {
      assert(this.version === MarketVersion.V1, `Can not push V1 lens data to V2 market!`);
    }
    if ("market" in data) {
      this.commitmentFeeBips = data.commitmentFeeBips.isPresent
        ? data.commitmentFeeBips.value.toNumber()
        : undefined;
      this.drawnAmount = data.drawnAmount.isPresent
        ? this.underlyingToken.getAmount(data.drawnAmount.value)
        : undefined;
    } else {
      this.commitmentFeeBips = undefined;
      this.drawnAmount = undefined;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            Class Builder Methods                           */
  /* -------------------------------------------------------------------------- */

  static fromSubgraphMarketData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: MakeOptional<
      SubgraphMarketDataWithEventsFragment,
      | "depositRecords"
      | "repaymentRecords"
      | "borrowRecords"
      | "feeCollectionRecords"
      | "periodicTermUpdatedRecords"
      | "periodicTermClosedRecord"
      | "annualInterestBipsReductionProposalRecords"
    >,
    signerAddress?: string
  ): Market {
    const underlyingToken = Token.fromSubgraphToken(chainId, data._asset, provider);
    const marketToken = Token.fromSubgraphMarketData(chainId, data, provider);
    const scaledTotalSupply = BigNumber.from(data.scaledTotalSupply);
    const scaleFactor = BigNumber.from(data.scaleFactor);
    const scaledWithdrawals = BigNumber.from(data.scaledPendingWithdrawals);
    const scaledRequiredReserves = bipMul(
      scaledTotalSupply.sub(scaledWithdrawals),
      BigNumber.from(data.reserveRatioBips)
    ).add(scaledWithdrawals);
    const coverageLiquidity = rayMul(scaledRequiredReserves, scaleFactor)
      .add(data.pendingProtocolFees)
      .add(data.normalizedUnclaimedWithdrawals);

    let hooksConfig: HooksConfig | undefined;
    if (data.version === MarketVersion.V2) {
      assert(!!data.hooks, `V2 markets require hooks`);
      assert(!!data.hooksConfig, `V2 markets require hooksConfig`);
      const {
        minimumDeposit: _minimumDeposit,
        depositRequiresAccess,
        transferRequiresAccess,
        queueWithdrawalRequiresAccess,
        allowClosureBeforeTerm,
        allowForceBuyBacks,
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
      const { id, hooksTemplate: hooksTemplateData } = data.hooks;
      const template = hooksTemplateFromSubgraph(chainId, provider, hooksTemplateData);
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
          allowForceBuyBacks,
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
          allowForceBuyBacks,
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
    return new Market({
      chainId,
      provider,
      version: data.version,
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
      scaleFactor: BigNumber.from(data.scaleFactor),
      totalSupply: marketToken.getAmount(rayMul(scaledTotalSupply, scaleFactor)),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(0), // @todo maybe update subgraph to query this per update?
      lastAccruedProtocolFees: underlyingToken.getAmount(data.pendingProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: BigNumber.from(data.scaledPendingWithdrawals),
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
      totalBorrowed: underlyingToken.getAmount(data.totalBorrowed),
      totalRepaid: underlyingToken.getAmount(data.totalRepaid),
      totalBaseInterestAccrued: underlyingToken.getAmount(data.totalBaseInterestAccrued),
      totalDelinquencyFeesAccrued: underlyingToken.getAmount(data.totalDelinquencyFeesAccrued),
      totalProtocolFeesAccrued: underlyingToken.getAmount(data.totalProtocolFeesAccrued),
      totalDeposited: underlyingToken.getAmount(data.totalDeposited),
      depositRecords: data.depositRecords,
      repaymentRecords: data.repaymentRecords,
      borrowRecords: data.borrowRecords,
      feeCollectionRecords: data.feeCollectionRecords,
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
      protocolFeeBips: data.protocolFeeBips.toNumber(),
      delinquencyFeeBips: data.delinquencyFeeBips.toNumber(),
      delinquencyGracePeriod: data.delinquencyGracePeriod.toNumber(),
      withdrawalBatchDuration: data.withdrawalBatchDuration.toNumber(), // @todo add withdrawalBatchDuration to lens output
      reserveRatioBips: data.reserveRatioBips.toNumber(),
      annualInterestBips: data.annualInterestBips.toNumber(),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: data.originalAnnualInterestBips.toNumber(),
      originalReserveRatioBips: data.originalReserveRatioBips.toNumber(),
      temporaryReserveRatioExpiry: data.temporaryReserveRatioExpiry.toNumber(),
      isClosed: data.isClosed,
      scaleFactor: data.scaleFactor,
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: data.scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: data.scaledPendingWithdrawals,
      pendingWithdrawalExpiry: data.pendingWithdrawalExpiry.toNumber(),
      isDelinquent: data.isDelinquent,
      timeDelinquent: data.timeDelinquent.toNumber(),
      lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp.toNumber(),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries,
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
    {
      hooks,
      hooksConfig: hooksConfigData,
      ...data
    }: MarketDataV2StructOutput | MarketDataV21StructOutput,
    signerAddress?: string
  ): Market {
    const marketToken = Token.fromTokenMetadata(chainId, data.marketToken, provider);
    const underlyingToken = Token.fromTokenMetadata(chainId, data.underlyingToken, provider);
    const { hooksAddress } = hooks;
    let hooksConfig: HooksConfig;
    const allowForceBuyBacks =
      "allowForceBuyBacks" in hooksConfigData ? hooksConfigData.allowForceBuyBacks : false;
    if (hooksConfigData.kind === 1) {
      hooksConfig = {
        kind: HooksKind.OpenTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        allowForceBuyBacks
      };
    } else if (hooksConfigData.kind === 2) {
      hooksConfig = {
        kind: HooksKind.FixedTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        fixedTermEndTime: hooksConfigData.fixedTermEndTime,
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        allowTermReduction: hooksConfigData.allowTermReduction,
        allowClosureBeforeTerm: hooksConfigData.allowClosureBeforeTerm,
        allowForceBuyBacks
      };
    } else if (hooksConfigData.kind === 3 && "periodDuration" in hooksConfigData) {
      hooksConfig = {
        kind: HooksKind.PeriodicTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        firstWithdrawalWindowStart: hooksConfigData.firstWithdrawalWindowStart,
        periodDuration: hooksConfigData.periodDuration,
        withdrawalWindowDuration: hooksConfigData.withdrawalWindowDuration,
        periodicTermClosed: hooksConfigData.periodicTermClosed,
        pendingAprChangeAnnualInterestBips: 0,
        pendingAprChangeProposalTimestamp: 0,
        pendingAprChangeResponseWindowStart: 0,
        pendingAprChangeResponseWindowEnd: 0
      };
    } else {
      throw Error(
        `Unknown hooks kind: ${hooks.hooksTemplate.name}, version #${hooksConfigData.kind}`
      );
    }
    const hooksFactory = "hooksFactory" in data ? data.hooksFactory : undefined;
    return new Market({
      provider,
      hooksFactory,
      marketType: hooksFactory ? getMarketTypeForHooksFactory(chainId, hooksFactory) : undefined,
      hooksConfig,
      version: MarketVersion.V2,
      chainId: chainId,
      marketToken: marketToken,
      underlyingToken: underlyingToken,
      borrower: data.borrower,
      feeRecipient: data.feeRecipient,
      protocolFeeBips: data.protocolFeeBips.toNumber(),
      delinquencyFeeBips: data.delinquencyFeeBips.toNumber(),
      delinquencyGracePeriod: data.delinquencyGracePeriod.toNumber(),
      withdrawalBatchDuration: data.withdrawalBatchDuration.toNumber(), // @todo add withdrawalBatchDuration to lens output
      reserveRatioBips: data.reserveRatioBips.toNumber(),
      annualInterestBips: data.annualInterestBips.toNumber(),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: data.originalAnnualInterestBips.toNumber(),
      originalReserveRatioBips: data.originalReserveRatioBips.toNumber(),
      temporaryReserveRatioExpiry: data.temporaryReserveRatioExpiry.toNumber(),
      isClosed: data.isClosed,
      scaleFactor: data.scaleFactor,
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: data.scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: data.scaledPendingWithdrawals,
      pendingWithdrawalExpiry: data.pendingWithdrawalExpiry.toNumber(),
      isDelinquent: data.isDelinquent,
      timeDelinquent: data.timeDelinquent.toNumber(),
      lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp.toNumber(),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries,
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
    const { hooks, hooksConfig: hooksConfigData, ...data } = market;
    const marketToken = Token.fromTokenMetadata(chainId, data.marketToken, provider);
    const underlyingToken = Token.fromTokenMetadata(chainId, data.underlyingToken, provider);
    const { hooksAddress } = hooks;
    let hooksConfig: HooksConfig;
    if (hooksConfigData.kind === 1) {
      hooksConfig = {
        kind: HooksKind.OpenTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        allowForceBuyBacks
      } as OpenTermHooksConfig;
    } else if (hooksConfigData.kind === 2) {
      hooksConfig = {
        kind: HooksKind.FixedTerm,
        hooksAddress,
        flags: { ...hooksConfigData.flags },
        depositRequiresAccess: hooksConfigData.depositRequiresAccess,
        transferRequiresAccess: hooksConfigData.transferRequiresAccess,
        transfersDisabled: hooksConfigData.transfersDisabled,
        minimumDeposit: underlyingToken.getAmount(hooksConfigData.minimumDeposit),
        fixedTermEndTime: hooksConfigData.fixedTermEndTime,
        queueWithdrawalRequiresAccess: hooksConfigData.withdrawalRequiresAccess,
        allowTermReduction: hooksConfigData.allowTermReduction,
        allowClosureBeforeTerm: hooksConfigData.allowClosureBeforeTerm,
        allowForceBuyBacks
      } as FixedTermHooksConfig;
    } else {
      throw Error(
        `Unknown hooks kind: ${hooks.hooksTemplate.name}, version #${hooksConfigData.kind}`
      );
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
      protocolFeeBips: data.protocolFeeBips.toNumber(),
      delinquencyFeeBips: data.delinquencyFeeBips.toNumber(),
      delinquencyGracePeriod: data.delinquencyGracePeriod.toNumber(),
      withdrawalBatchDuration: data.withdrawalBatchDuration.toNumber(),
      reserveRatioBips: data.reserveRatioBips.toNumber(),
      annualInterestBips: data.annualInterestBips.toNumber(),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: data.originalAnnualInterestBips.toNumber(),
      originalReserveRatioBips: data.originalReserveRatioBips.toNumber(),
      temporaryReserveRatioExpiry: data.temporaryReserveRatioExpiry.toNumber(),
      isClosed: data.isClosed,
      scaleFactor: data.scaleFactor,
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: data.scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: data.scaledPendingWithdrawals,
      pendingWithdrawalExpiry: data.pendingWithdrawalExpiry.toNumber(),
      isDelinquent: data.isDelinquent,
      timeDelinquent: data.timeDelinquent.toNumber(),
      lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp.toNumber(),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries,
      coverageLiquidity: underlyingToken.getAmount(data.coverageLiquidity),
      commitmentFeeBips: commitmentFeeBips.isPresent ? commitmentFeeBips.value.toNumber() : undefined,
      drawnAmount: drawnAmount.isPresent
        ? underlyingToken.getAmount(drawnAmount.value)
        : undefined,
      signerAddress
    });
  }

  static async resolveAllowForceBuyBacks(
    provider: SignerOrProvider,
    marketAddress: string,
    data: MarketDataBaseV2_5StructOutput | MarketDataV2_5StructOutput
  ): Promise<boolean> {
    const marketData = "market" in data ? data.market : data;

    if (marketData.hooksConfig.kind === 1) {
      const hookedMarket = await IOpenTermHooks__factory.connect(
        marketData.hooksConfig.hooksAddress,
        provider
      ).getHookedMarket(marketAddress);
      return hookedMarket.allowForceBuyBacks;
    }
    if (marketData.hooksConfig.kind === 2) {
      const hookedMarket = await IFixedTermHooks__factory.connect(
        marketData.hooksConfig.hooksAddress,
        provider
      ).getHookedMarket(marketAddress);
      return hookedMarket.allowForceBuyBacks;
    }
    return false;
  }

  static async fromUnifiedMarketData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: MarketDataBaseV2_5StructOutput | MarketDataV2_5StructOutput,
    signerAddress?: string
  ): Promise<Market> {
    const marketData = toUnifiedMarketDataV2(data);
    const allowForceBuyBacks = await Market.resolveAllowForceBuyBacks(
      provider,
      marketData.market.marketToken.token,
      marketData
    );
    return Market.fromMarketDataV2_5(
      chainId,
      provider,
      marketData,
      allowForceBuyBacks,
      signerAddress
    );
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
    const signerAddress = Signer.isSigner(provider) ? await provider.getAddress() : undefined;
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getLensV2_5Contract(chainId, provider).getMarketDataV2(market);
        return Market.fromUnifiedMarketData(chainId, provider, data, signerAddress);
      } catch (_) {
        // Fall back to the legacy lens for V1 markets and pre-unified deployments.
      }
    }
    const lens = getLensContract(chainId, provider);
    const data = await lens.getMarketData(market);
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
    const signerAddress = Signer.isSigner(provider) ? await provider.getAddress() : undefined;
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getLensV2_5Contract(chainId, provider).getMarketDataV2(market);
        return Market.fromUnifiedMarketData(chainId, provider, data, signerAddress);
      } catch (_) {
        // Fall back to the pre-2.5 V2 lens for chains that have not fully migrated.
      }
    }
    const lens = getLensV2Contract(chainId, provider);
    const data = await lens.getMarketData(market);
    return Market.fromMarketDataV2(chainId, provider, data, signerAddress);
  }

  /**
   * @returns `Market` instances for `markets`
   */
  static async getMarkets(
    chainId: SupportedChainId,
    markets: string[],
    provider: SignerOrProvider
  ): Promise<Market[]> {
    const signerAddress = Signer.isSigner(provider) ? await provider.getAddress() : undefined;
    if (hasUnifiedLatestLensForDirectReads(chainId)) {
      try {
        const data = await getLensV2_5Contract(chainId, provider).getMarketsDataV2(markets);
        return Promise.all(
          data.map((market) =>
            Market.fromUnifiedMarketData(chainId, provider, market, signerAddress)
          )
        );
      } catch (_) {
        return Promise.all(markets.map((market) => Market.getMarket(chainId, market, provider)));
      }
    }
    const lens = getLensContract(chainId, provider);
    const data = await lens.getMarketsData(markets);
    return data.map((market) => Market.fromMarketData(chainId, market, provider, signerAddress));
  }

  /**
   * @return All deployed markets
   */
  static async getAllMarkets(
    chainId: SupportedChainId,
    provider: SignerOrProvider
  ): Promise<Market[]> {
    const archController = getArchControllerContract(chainId, provider);
    const markets = await archController["getRegisteredMarkets()"]();
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
    const archController = getArchControllerContract(chainId, provider);
    const totalMarkets = (await archController.getRegisteredMarketsCount()).toNumber();
    if (start >= totalMarkets) {
      return [];
    }
    const end = Math.min(start + count, totalMarkets);
    const markets = await archController["getRegisteredMarkets(uint256,uint256)"](start, end);
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
    const archController = getArchControllerContract(chainId, provider);
    return archController.getRegisteredMarketsCount().then((count) => count.toNumber());
  }
}
