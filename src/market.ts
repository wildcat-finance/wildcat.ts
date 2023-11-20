import { BigNumber, ContractTransaction } from "ethers";
import { Signer } from "@ethersproject/abstract-signer";
import { WildcatMarket, WildcatMarket__factory } from "./typechain";
import { MarketDataStructOutput } from "./typechain";
import { getLensContract } from "./constants";
import { TokenAmount, Token, toBn } from "./token";
import { SignerOrProvider, ContractWrapper } from "./types";
import { formatUnits } from "ethers/lib/utils";
import { MarketAccount } from "./account";
import { RAY } from "./constants";
import { LenderWithdrawalStatus } from "./withdrawal-status";
import { bipMul, mulDiv, rayDiv, rayMul } from "./utils/math";
import {
  SubgraphBorrowDataFragment,
  SubgraphDepositDataFragment,
  SubgraphFeesCollectedDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphRepaymentDataFragment
} from "./gql/graphql";
import { MakeOptional } from "./utils";

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

export type DepositRecord = {
  amount: TokenAmount;
} & Omit<SubgraphDepositDataFragment, "assetAmount">;

export type RepaymentRecord = {
  amount: TokenAmount;
} & Omit<SubgraphRepaymentDataFragment, "assetAmount">;

export type BorrowRecord = {
  amount: TokenAmount;
} & Omit<SubgraphBorrowDataFragment, "assetAmount">;

export type FeeCollectionRecord = {
  amount: TokenAmount;
} & Omit<SubgraphFeesCollectedDataFragment, "feesCollected">;

function parseRecord(token: Token, log: SubgraphDepositDataFragment): DepositRecord;
function parseRecord(token: Token, log: SubgraphRepaymentDataFragment): RepaymentRecord;
function parseRecord(token: Token, log: SubgraphBorrowDataFragment): BorrowRecord;
function parseRecord(
  token: Token,
  log: SubgraphDepositDataFragment | SubgraphRepaymentDataFragment | SubgraphBorrowDataFragment
): DepositRecord | RepaymentRecord | BorrowRecord {
  const { assetAmount, ...rest } = log;
  return {
    ...rest,
    amount: token.getAmount(assetAmount)
  };
}

// @todo pull min/max apr from contract and subgraph

export class Market extends ContractWrapper<WildcatMarket> {
  static readonly UpdatableKeys: Array<keyof Market> = [
    "marketToken",
    "underlyingToken",
    "borrower",
    "controller",
    "feeRecipient",
    "protocolFeeBips",
    "delinquencyFeeBips",
    "delinquencyGracePeriod",
    "annualInterestBips",
    "reserveRatioBips",
    "temporaryReserveRatio",
    "originalReserveRatioBips",
    "temporaryReserveRatioExpiry",
    "borrowableAssets",
    "maxTotalSupply",
    "scaledTotalSupply",
    "totalSupply",
    "totalAssets",
    "coverageLiquidity",
    "scaleFactor",
    "lastAccruedProtocolFees",
    "isDelinquent",
    "timeDelinquent",
    "lastInterestAccruedTimestamp"
  ];
  public depositRecords: DepositRecord[];
  public repaymentRecords: RepaymentRecord[];
  public borrowRecords: BorrowRecord[];
  public feeCollectionRecords: FeeCollectionRecord[];

  constructor(
    _provider: SignerOrProvider,
    public marketToken: Token,
    public underlyingToken: Token,
    public borrower: string,
    public controller: string,
    public feeRecipient: string,
    public protocolFeeBips: number,
    public delinquencyFeeBips: number,
    // Seconds delinquency is allowed before liquidation
    public delinquencyGracePeriod: number,
    public withdrawalBatchDuration: number,
    public reserveRatioBips: number,
    public annualInterestBips: number,
    public temporaryReserveRatio: boolean,
    public originalAnnualInterestBips: number,
    public originalReserveRatioBips: number,
    public temporaryReserveRatioExpiry: number,
    public isClosed: boolean,
    public scaleFactor: BigNumber,
    // Total amount of market tokens in existence
    public totalSupply: TokenAmount,
    // Maximum amount of market tokens that can be minted
    public maxTotalSupply: TokenAmount,
    public scaledTotalSupply: BigNumber,
    // Total amount of underlying assets held in the market
    public totalAssets: TokenAmount,
    public lastAccruedProtocolFees: TokenAmount,
    public normalizedUnclaimedWithdrawals: TokenAmount,
    public scaledPendingWithdrawals: BigNumber,
    public pendingWithdrawalExpiry: number,
    // Whether the market is delinquent
    public isDelinquent: boolean,
    // Seconds the market has been delinquent
    public timeDelinquent: number,
    // Timestamp of last interest accrual
    public lastInterestAccruedTimestamp: number,
    // Expiries of unpaid withdrawal batches
    public unpaidWithdrawalBatchExpiries: number[],

    // Amount of underlying assets that should be held in reserve for current supply
    public coverageLiquidity: TokenAmount,
    public borrowableAssets: TokenAmount,
    public totalBorrowed?: TokenAmount,
    public totalRepaid?: TokenAmount,
    public totalBaseInterestAccrued?: TokenAmount,
    public totalDelinquencyFeesAccrued?: TokenAmount,
    public totalProtocolFeesAccrued?: TokenAmount,
    public totalDeposited?: TokenAmount,
    depositRecords: SubgraphDepositDataFragment[] = [],
    repaymentRecords: SubgraphRepaymentDataFragment[] = [],
    borrowRecords: SubgraphBorrowDataFragment[] = [],
    feeCollectionRecords: SubgraphFeesCollectedDataFragment[] = [],
    public signerAddress?: string
  ) {
    super(_provider);
    this.depositRecords = depositRecords.map((log) => parseRecord(this.underlyingToken, log));
    this.repaymentRecords = repaymentRecords.map((log) => parseRecord(this.underlyingToken, log));
    this.borrowRecords = borrowRecords.map((log) => parseRecord(this.underlyingToken, log));
    this.feeCollectionRecords = feeCollectionRecords.map(({ feesCollected, ...rest }) => ({
      ...rest,
      amount: this.underlyingToken.getAmount(feesCollected)
    }));
  }

  readonly contractFactory = WildcatMarket__factory;

  /* -------------------------------------------------------------------------- */
  /*                              Property Getters                              */
  /* -------------------------------------------------------------------------- */

  /** @returns Address of the market token */
  get address(): string {
    return this.marketToken.address;
  }

  get name(): string {
    return this.marketToken.name;
  }

  get symbol(): string {
    return this.marketToken.symbol;
  }

  get decimals(): number {
    return this.marketToken.decimals;
  }

  /** @returns Percentage growth of the market since it was created */
  get allTimeGrowth(): number {
    // 27 - 2 to convert to percentage
    return +formatUnits(this.scaleFactor, 25);
  }

  /** @returns Maximum amount of underlying token that can be deposited */
  get maximumDeposit(): TokenAmount {
    return this.underlyingToken.getAmount(this.maxTotalSupply.raw.sub(this.totalSupply.raw));
  }

  /** @returns Whether the borrower is in penalized delinquency */
  get isIncurringPenalties(): boolean {
    return this.isDelinquent && this.timeDelinquent > this.delinquencyGracePeriod;
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

  normalizeAmount(amount: BigNumber): BigNumber {
    return rayMul(amount, this.scaleFactor);
  }

  scaleAmount(amount: BigNumber): BigNumber {
    return rayDiv(amount, this.scaleFactor);
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

  async processUnpaidWithdrawalBatch(): Promise<ContractTransaction> {
    return this.contract.processUnpaidWithdrawalBatch();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Set APR                                  */
  /* -------------------------------------------------------------------------- */

  getReserveRatioForNewAPR(annualInterestBips: number): number {
    const originalAnnualInterestBips = this.originalAnnualInterestBips ?? this.annualInterestBips;
    if (annualInterestBips < originalAnnualInterestBips) {
      const doubleRelativeDiff = mulDiv(
        toBn(20000),
        toBn(originalAnnualInterestBips - annualInterestBips),
        toBn(originalAnnualInterestBips)
      ).toNumber();
      const boundRelativeDiff = Math.min(10000, doubleRelativeDiff);
      return Math.max(boundRelativeDiff, this.originalReserveRatioBips);
    }
    if (this.temporaryReserveRatio) {
      return this.originalReserveRatioBips;
    }
    return this.reserveRatioBips;
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
    const originalAnnualInterestBips = this.originalAnnualInterestBips ?? this.annualInterestBips;
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
    return MarketAccount.getMarketAccount(this.provider, account, this);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Updates                                  */
  /* -------------------------------------------------------------------------- */

  async update(): Promise<void> {
    const market = await getLensContract(this.provider).getMarketData(this.address);
    this.updateWith(market);
  }

  updateWith(data: MarketDataStructOutput): void {
    this.feeRecipient = data.feeRecipient;
    this.protocolFeeBips = data.protocolFeeBips.toNumber();
    this.delinquencyFeeBips = data.delinquencyFeeBips.toNumber();
    this.delinquencyGracePeriod = data.delinquencyGracePeriod.toNumber();
    this.withdrawalBatchDuration = data.withdrawalBatchDuration.toNumber();
    this.reserveRatioBips = data.reserveRatioBips.toNumber();
    this.annualInterestBips = data.annualInterestBips.toNumber();
    this.temporaryReserveRatio = data.temporaryReserveRatio;
    this.originalAnnualInterestBips = data.originalAnnualInterestBips.toNumber();
    this.originalReserveRatioBips = data.originalReserveRatioBips.toNumber();
    this.temporaryReserveRatioExpiry = data.temporaryReserveRatioExpiry.toNumber();
    this.isClosed = data.isClosed;
    this.scaleFactor = data.scaleFactor;
    this.totalSupply = this.marketToken.getAmount(data.totalSupply);
    this.maxTotalSupply = this.marketToken.getAmount(data.maxTotalSupply);
    this.scaledTotalSupply = data.scaledTotalSupply;
    this.totalAssets = this.underlyingToken.getAmount(data.totalAssets);
    this.lastAccruedProtocolFees = this.underlyingToken.getAmount(data.lastAccruedProtocolFees);
    this.normalizedUnclaimedWithdrawals = this.underlyingToken.getAmount(
      data.normalizedUnclaimedWithdrawals
    );
    this.scaledPendingWithdrawals = data.scaledPendingWithdrawals;
    this.pendingWithdrawalExpiry = data.pendingWithdrawalExpiry.toNumber();
    this.isDelinquent = data.isDelinquent;
    this.timeDelinquent = data.timeDelinquent.toNumber();
    this.lastInterestAccruedTimestamp = data.lastInterestAccruedTimestamp.toNumber();
    this.unpaidWithdrawalBatchExpiries = data.unpaidWithdrawalBatchExpiries;
    this.coverageLiquidity = this.underlyingToken.getAmount(data.coverageLiquidity);
    this.borrowableAssets = this.underlyingToken.getAmount(data.borrowableAssets);
  }

  /* -------------------------------------------------------------------------- */
  /*                            Class Builder Methods                           */
  /* -------------------------------------------------------------------------- */

  static fromSubgraphMarketData(
    provider: SignerOrProvider,
    data: MakeOptional<
      SubgraphMarketDataWithEventsFragment,
      "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
    >,
    signerAddress?: string
  ): Market {
    const underlyingToken = Token.fromSubgraphToken(data._asset, provider);
    const marketToken = Token.fromSubgraphMarketData(data, provider);
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
    return new Market(
      provider,
      marketToken,
      underlyingToken,
      data.borrower,
      data.controller.id,
      data.feeRecipient,
      data.protocolFeeBips,
      data.delinquencyFeeBips,
      data.delinquencyGracePeriod,
      data.withdrawalBatchDuration,
      data.reserveRatioBips,
      data.annualInterestBips,
      data.temporaryReserveRatioActive,
      data.originalAnnualInterestBips,
      data.originalReserveRatioBips,
      data.temporaryReserveRatioExpiry,
      data.isClosed,
      BigNumber.from(data.scaleFactor),
      marketToken.getAmount(rayMul(scaledTotalSupply, scaleFactor)),
      marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply,
      underlyingToken.getAmount(0), // @todo maybe update subgraph to query this per update?
      underlyingToken.getAmount(data.pendingProtocolFees),
      underlyingToken.getAmount(data.normalizedUnclaimedWithdrawals),
      BigNumber.from(data.scaledPendingWithdrawals),
      +data.pendingWithdrawalExpiry,
      data.isDelinquent,
      data.timeDelinquent,
      data.lastInterestAccruedTimestamp,
      [] /* data.unpaidWithdrawalBatchExpiries */,
      underlyingToken.getAmount(coverageLiquidity),
      underlyingToken.getAmount(0) /* borrowable assets */,
      underlyingToken.getAmount(data.totalBorrowed),
      underlyingToken.getAmount(data.totalRepaid),
      underlyingToken.getAmount(data.totalBaseInterestAccrued),
      underlyingToken.getAmount(data.totalDelinquencyFeesAccrued),
      underlyingToken.getAmount(data.totalProtocolFeesAccrued),
      underlyingToken.getAmount(data.totalDeposited),
      data.depositRecords,
      data.repaymentRecords,
      data.borrowRecords,
      data.feeCollectionRecords,
      signerAddress
    );
  }

  static fromMarketData(
    data: MarketDataStructOutput,
    provider: SignerOrProvider,
    signerAddress?: string
  ): Market {
    const marketToken = Token.fromTokenMetadata(data.marketToken, provider);
    const underlyingToken = Token.fromTokenMetadata(data.underlyingToken, provider);
    return new Market(
      provider,
      marketToken,
      underlyingToken,
      data.borrower,
      data.controller,
      data.feeRecipient,
      data.protocolFeeBips.toNumber(),
      data.delinquencyFeeBips.toNumber(),
      data.delinquencyGracePeriod.toNumber(),
      data.withdrawalBatchDuration.toNumber(), // @todo add withdrawalBatchDuration to lens output
      data.reserveRatioBips.toNumber(),
      data.annualInterestBips.toNumber(),
      data.temporaryReserveRatio,
      data.originalAnnualInterestBips.toNumber(),
      data.originalReserveRatioBips.toNumber(),
      data.temporaryReserveRatioExpiry.toNumber(),
      data.isClosed,
      data.scaleFactor,
      marketToken.getAmount(data.totalSupply),
      marketToken.getAmount(data.maxTotalSupply),
      data.scaledTotalSupply,
      underlyingToken.getAmount(data.totalAssets),
      underlyingToken.getAmount(data.lastAccruedProtocolFees),
      underlyingToken.getAmount(data.normalizedUnclaimedWithdrawals),
      data.scaledPendingWithdrawals,
      data.pendingWithdrawalExpiry.toNumber(),
      data.isDelinquent,
      data.timeDelinquent.toNumber(),
      data.lastInterestAccruedTimestamp.toNumber(),
      data.unpaidWithdrawalBatchExpiries,
      underlyingToken.getAmount(data.coverageLiquidity),
      underlyingToken.getAmount(data.borrowableAssets),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      signerAddress
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                               Static Queries                               */
  /* -------------------------------------------------------------------------- */

  /**
   * @returns `Market` instance for `market`
   */
  static async getMarket(market: string, provider: SignerOrProvider): Promise<Market> {
    const lens = getLensContract(provider);
    const data = await lens.getMarketData(market);
    return Market.fromMarketData(
      data,
      provider,
      provider instanceof Signer ? await provider.getAddress() : undefined
    );
  }

  /**
   * @returns `Market` instances for `markets`
   */
  static async getMarkets(markets: string[], provider: SignerOrProvider): Promise<Market[]> {
    const lens = getLensContract(provider);
    const data = await lens.getMarketsData(markets);
    const signerAddress = provider instanceof Signer ? await provider.getAddress() : undefined;
    return data.map((market) => Market.fromMarketData(market, provider, signerAddress));
  }

  /**
   * @return All deployed markets
   */
  static async getAllMarkets(provider: SignerOrProvider): Promise<Market[]> {
    const lens = getLensContract(provider);
    const signerAddress = provider instanceof Signer ? await provider.getAddress() : undefined;
    return lens
      .getAllMarketsData()
      .then((data) => data.map((market) => Market.fromMarketData(market, provider, signerAddress)));
  }

  /**
   * @dev Get a paginated list of deployed markets.
   */
  static async getPaginatedMarkets(
    provider: SignerOrProvider,
    start = 0,
    count: number
  ): Promise<Market[]> {
    const signerAddress = provider instanceof Signer ? await provider.getAddress() : undefined;
    const lens = getLensContract(provider);
    return lens
      .getPaginatedMarketsData(start, count)
      .then((data) => data.map((market) => Market.fromMarketData(market, provider, signerAddress)));
  }

  /**
   * @return Total number of deployed markets.
   */
  static async getMarketsCount(provider: SignerOrProvider): Promise<number> {
    const lens = getLensContract(provider);
    return lens.getMarketsCount().then((count) => count.toNumber());
  }
}
