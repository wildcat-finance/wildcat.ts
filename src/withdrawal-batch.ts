import { BigNumber } from "ethers";
import { Market } from "./market";
import { TokenAmount, minTokenAmount } from "./token";
import { WithdrawalBatchDataStructOutput } from "./typechain";
import { getLensContract } from "./constants";
import { LenderWithdrawalStatus } from "./withdrawal-status";
import {
  MakeOptional,
  SubgraphLenderWithdrawalPropertiesFragment,
  SubgraphWithdrawalBatchPaymentPropertiesFragment,
  SubgraphWithdrawalBatchPropertiesWithEventsFragment,
  SubgraphWithdrawalExecutionPropertiesFragment,
  SubgraphWithdrawalRequestPropertiesFragment
} from "./gql/graphql";
import {
  WithdrawalExecutionRecord,
  WithdrawalPaymentRecord,
  WithdrawalRequestRecord,
  parseWithdrawalRecord,
  rayMul
} from "./utils";

export enum BatchStatus {
  Pending = 0,
  Expired = 1,
  Unpaid = 2,
  Complete = 3
}

export class WithdrawalBatch {
  public withdrawals: LenderWithdrawalStatus[] = [];
  public payments: WithdrawalPaymentRecord[] = [];
  public executions: WithdrawalExecutionRecord[] = [];
  public requests: WithdrawalRequestRecord[] = [];

  constructor(
    public market: Market,
    public expiry: number,
    public status: BatchStatus,
    public scaledTotalAmount: BigNumber,
    public scaledAmountBurned: BigNumber,
    public normalizedAmountPaid: TokenAmount,
    public normalizedTotalAmount: TokenAmount,
    public lastScaleFactor?: BigNumber,
    public paymentsCount?: number,
    public lastUpdatedTimestamp?: number,
    public totalInterestEarned?: TokenAmount,
    payments: SubgraphWithdrawalBatchPaymentPropertiesFragment[] = [],
    withdrawals: SubgraphLenderWithdrawalPropertiesFragment[] = [],
    executions: SubgraphWithdrawalExecutionPropertiesFragment[] = [],
    requests: SubgraphWithdrawalRequestPropertiesFragment[] = []
  ) {
    this.withdrawals = withdrawals.map((w) =>
      LenderWithdrawalStatus.fromSubgraphLenderWithdrawalStatus(market, this, w, w.account.address)
    );
    this.payments = payments.map((w) => parseWithdrawalRecord(this, w));
    this.executions = executions.map((w) => parseWithdrawalRecord(this, w));
    this.requests = requests.map((w) => parseWithdrawalRecord(this, w));
  }

  private calculateBatchInterestEarned(): BigNumber {
    if (!this.lastScaleFactor) return BigNumber.from(0);
    const scaledAmountOwed = this.scaledTotalAmount.sub(this.scaledAmountBurned);
    if (scaledAmountOwed.eq(0) || this.lastScaleFactor?.eq(this.market.scaleFactor)) {
      return BigNumber.from(0);
    }
    const lastBalance = rayMul(scaledAmountOwed, this.lastScaleFactor);
    const currentBalance = rayMul(scaledAmountOwed, this.market.scaleFactor);
    return currentBalance.sub(lastBalance);
  }

  processWithdrawalBatchInterestAccrued(): void {
    if (!this.lastScaleFactor || !this.totalInterestEarned) return;
    if (!this.lastScaleFactor.eq(this.market.scaleFactor)) {
      const interestEarned = this.calculateBatchInterestEarned();
      this.lastScaleFactor = this.market.scaleFactor;
      this.totalInterestEarned = this.totalInterestEarned.add(interestEarned);
    }
    if (this.lastUpdatedTimestamp != this.market.lastInterestAccruedTimestamp) {
      this.lastUpdatedTimestamp = this.market.lastInterestAccruedTimestamp;
    }
  }

  get isClosed(): boolean {
    return this.scaledAmountBurned.eq(this.scaledTotalAmount);
  }

  get isExpired(): boolean {
    return this.status === BatchStatus.Pending && this.expiry < Math.floor(Date.now() / 1000);
  }

  get normalizedAmountOwed(): TokenAmount {
    return this.normalizedTotalAmount.sub(this.normalizedAmountPaid);
  }

  get scaledAmountOwed(): BigNumber {
    return this.scaledTotalAmount.sub(this.scaledAmountBurned);
  }

  get availableLiquidityToProcess(): TokenAmount {
    if (this.isClosed) return this.market.underlyingToken.getAmount(0);
    if (this.expiry === this.market.pendingWithdrawalExpiry) {
      const priorScaledAmountPending = this.market.scaledPendingWithdrawals.sub(
        this.scaledAmountOwed
      );
      const unavailableAssets = this.market.normalizedUnclaimedWithdrawals
        .add(this.market.normalizeAmount(priorScaledAmountPending))
        .add(this.market.lastAccruedProtocolFees);
      return minTokenAmount(
        this.market.totalAssets.sub(unavailableAssets),
        this.normalizedAmountOwed
      );
    } else if (this.expiry === this.market.unpaidWithdrawalBatchExpiries[0]) {
      const unavailableAssets = this.market.normalizedUnclaimedWithdrawals.add(
        this.market.lastAccruedProtocolFees
      );
      return minTokenAmount(
        this.market.totalAssets.sub(unavailableAssets),
        this.normalizedAmountOwed
      );
    } else {
      return this.market.underlyingToken.getAmount(0);
    }
  }

  applyLensUpdate(data: WithdrawalBatchDataStructOutput): void {
    this.scaledTotalAmount = data.scaledTotalAmount;
    this.scaledAmountBurned = data.scaledAmountBurned;
    this.normalizedAmountPaid = this.market.underlyingToken.getAmount(data.normalizedAmountPaid);
    this.normalizedTotalAmount = this.market.underlyingToken.getAmount(data.normalizedTotalAmount);
    this.status =
      this.expiry > Math.floor(Date.now() / 1000)
        ? BatchStatus.Pending
        : this.scaledAmountBurned.eq(this.scaledTotalAmount)
        ? BatchStatus.Complete
        : BatchStatus.Unpaid;
    this.processWithdrawalBatchInterestAccrued();
  }

  /* -------------------------------------------------------------------------- */
  /*                             Builders / Getters                             */
  /* -------------------------------------------------------------------------- */

  static fromWithdrawalBatchData(
    market: Market,
    data: WithdrawalBatchDataStructOutput
  ): WithdrawalBatch {
    return new WithdrawalBatch(
      market,
      data.expiry,
      data.status,
      data.scaledTotalAmount,
      data.scaledAmountBurned,
      market.underlyingToken.getAmount(data.normalizedAmountPaid),
      market.underlyingToken.getAmount(data.normalizedTotalAmount)
    );
  }

  static fromSubgraphWithdrawalBatch(
    market: Market,
    batch: MakeOptional<
      SubgraphWithdrawalBatchPropertiesWithEventsFragment,
      "requests" | "executions" | "withdrawals"
    >
  ): WithdrawalBatch {
    const scaledTotalAmount = BigNumber.from(batch.scaledTotalAmount);
    const scaledAmountBurned = BigNumber.from(batch.scaledAmountBurned);
    const normalizedAmountPaid = market.underlyingToken.getAmount(batch.normalizedAmountPaid);
    const expiry = +batch.expiry;
    const status =
      expiry > Math.floor(Date.now() / 1000)
        ? BatchStatus.Pending
        : scaledAmountBurned.eq(scaledTotalAmount)
        ? BatchStatus.Complete
        : BatchStatus.Unpaid;
    let scaledAmountOwed: BigNumber;
    let normalizedAmountOwed: TokenAmount;
    let normalizedTotalAmount: TokenAmount;
    if (!scaledAmountBurned.eq(scaledTotalAmount)) {
      scaledAmountOwed = scaledTotalAmount.sub(scaledAmountBurned);
      normalizedAmountOwed = market.underlyingToken.getAmount(
        rayMul(scaledAmountOwed, market.scaleFactor)
      );
      normalizedTotalAmount = normalizedAmountPaid.add(normalizedAmountOwed);
    } else {
      scaledAmountOwed = BigNumber.from(0);
      normalizedAmountOwed = market.underlyingToken.getAmount(0);
      normalizedTotalAmount = normalizedAmountPaid;
    }
    return new WithdrawalBatch(
      market,
      expiry,
      status,
      scaledTotalAmount,
      scaledAmountBurned,
      normalizedAmountPaid,
      normalizedTotalAmount,
      BigNumber.from(batch.lastScaleFactor),
      batch.paymentsCount,
      batch.lastUpdatedTimestamp,
      market.underlyingToken.getAmount(batch.totalInterestEarned),
      batch.payments || undefined,
      batch.withdrawals || undefined,
      batch.executions || undefined,
      batch.requests || undefined
    );
  }

  static async getWithdrawalBatch(market: Market, expiry: number): Promise<WithdrawalBatch> {
    const lens = getLensContract(market.chainId, market.provider);
    const data = await lens.getWithdrawalBatchData(market.address, expiry);
    return WithdrawalBatch.fromWithdrawalBatchData(market, data);
  }
}
