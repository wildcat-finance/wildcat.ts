import { Market } from "./market";
import { TokenAmount, minTokenAmount, toRawAmount } from "./token";
import type {
  WithdrawalBatchDataStructOutput,
  WithdrawalBatchDataV2_5StructOutput
} from "./lens-types";
import { hasDeploymentAddress } from "./constants";
import { getLatestWithdrawalBatchData, getLegacyWithdrawalBatchData } from "./internal/market-lens";
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
  rayMulBigint,
  toNumber
} from "./utils";
import { MarketVersion } from "./types";

export enum BatchStatus {
  Pending = 0,
  Expired = 1,
  Unpaid = 2,
  Complete = 3
}

type WithdrawalBatchDataOutput =
  | WithdrawalBatchDataStructOutput
  | WithdrawalBatchDataV2_5StructOutput;

export class WithdrawalBatch {
  public withdrawals: LenderWithdrawalStatus[] = [];
  public payments: WithdrawalPaymentRecord[] = [];
  public executions: WithdrawalExecutionRecord[] = [];
  public requests: WithdrawalRequestRecord[] = [];

  constructor(
    public market: Market,
    public expiry: number,
    public status: BatchStatus,
    public scaledTotalAmount: bigint,
    public scaledAmountBurned: bigint,
    public normalizedAmountPaid: TokenAmount,
    public normalizedTotalAmount: TokenAmount,
    public lastScaleFactor?: bigint,
    public paymentsCount?: number,
    public lastUpdatedTimestamp?: number,
    public totalInterestEarned?: TokenAmount,
    public isCompleted?: boolean,
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

  private calculateBatchInterestEarned(): bigint {
    if (!this.lastScaleFactor) return 0n;
    const scaledAmountOwed = this.scaledTotalAmount - this.scaledAmountBurned;
    if (scaledAmountOwed === 0n || this.lastScaleFactor === this.market.scaleFactor) {
      return 0n;
    }
    const lastBalance = rayMulBigint(scaledAmountOwed, this.lastScaleFactor);
    const currentBalance = rayMulBigint(scaledAmountOwed, this.market.scaleFactor);
    return currentBalance - lastBalance;
  }

  processWithdrawalBatchInterestAccrued(): void {
    if (!this.lastScaleFactor || !this.totalInterestEarned) return;
    if (this.lastScaleFactor !== this.market.scaleFactor) {
      const interestEarned = this.calculateBatchInterestEarned();
      this.lastScaleFactor = this.market.scaleFactor;
      this.totalInterestEarned = this.totalInterestEarned.add(interestEarned);
    }
    if (this.lastUpdatedTimestamp != this.market.lastInterestAccruedTimestamp) {
      this.lastUpdatedTimestamp = this.market.lastInterestAccruedTimestamp;
    }
  }

  /**
   * @description Whether the batch is expired and all owed funds have been paid to it.
   * @note        Does not indicate the batch is "complete" in the way `isCompleted`
   *              indicates, which means all withdrawals have been claimed.
   */
  get isClosed(): boolean {
    return this.status === BatchStatus.Complete;
  }

  /**
   * @description Whether the batch is expired but the market has not yet been updated
   */
  get isPendingExpired(): boolean {
    return this.status === BatchStatus.Pending && this.expiry < Math.floor(Date.now() / 1000);
  }

  get isConcluded(): boolean {
    if (this.market.isClosed) return true;
    return this.expiry <= Math.floor(Date.now() / 1000);
  }

  // unlike `status` which is purely timestamp-based, this accounts for market
  // termination
  // a batch with future expiry in a closed market returns Unpaid/Complete
  // instead of Pending, since the cycle is effectively over
  get effectiveStatus(): BatchStatus {
    if (!this.isConcluded) {
      return BatchStatus.Pending;
    }
    return this.scaledAmountBurned === this.scaledTotalAmount
      ? BatchStatus.Complete
      : BatchStatus.Unpaid;
  }

  get normalizedAmountOwed(): TokenAmount {
    return this.normalizedTotalAmount.sub(this.normalizedAmountPaid);
  }

  get scaledAmountOwed(): bigint {
    return this.scaledTotalAmount - this.scaledAmountBurned;
  }

  get availableLiquidityToProcess(): TokenAmount {
    if (this.isClosed) return this.market.underlyingToken.getAmount(0);
    if (this.expiry === this.market.pendingWithdrawalExpiry) {
      const priorScaledAmountPending = this.market.scaledPendingWithdrawals - this.scaledAmountOwed;
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

  applyLensUpdate(data: WithdrawalBatchDataOutput): void {
    this.scaledTotalAmount = toRawAmount(data.scaledTotalAmount);
    this.scaledAmountBurned = toRawAmount(data.scaledAmountBurned);
    this.normalizedAmountPaid = this.market.underlyingToken.getAmount(data.normalizedAmountPaid);
    this.normalizedTotalAmount = this.market.underlyingToken.getAmount(data.normalizedTotalAmount);
    this.status =
      this.expiry > Math.floor(Date.now() / 1000)
        ? BatchStatus.Pending
        : this.scaledAmountBurned === this.scaledTotalAmount
        ? BatchStatus.Complete
        : BatchStatus.Unpaid;
    if (this.status === BatchStatus.Complete) {
      const scaledTotalFromRecords = this.withdrawals.reduce(
        (total, w) => total + w.scaledAmount,
        0n
      );
      if (
        scaledTotalFromRecords === this.scaledTotalAmount &&
        this.withdrawals.every((w) => w.isCompleted)
      ) {
        this.isCompleted = true;
      }
    }
    this.processWithdrawalBatchInterestAccrued();
  }

  /* -------------------------------------------------------------------------- */
  /*                             Builders / Getters                             */
  /* -------------------------------------------------------------------------- */

  static fromWithdrawalBatchData(market: Market, data: WithdrawalBatchDataOutput): WithdrawalBatch {
    return new WithdrawalBatch(
      market,
      toNumber(data.expiry),
      toNumber(data.status),
      toRawAmount(data.scaledTotalAmount),
      toRawAmount(data.scaledAmountBurned),
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
    const scaledTotalAmount = toRawAmount(batch.scaledTotalAmount);
    const scaledAmountBurned = toRawAmount(batch.scaledAmountBurned);
    const normalizedAmountPaid = market.underlyingToken.getAmount(batch.normalizedAmountPaid);
    const expiry = +batch.expiry;
    const status =
      expiry > Math.floor(Date.now() / 1000)
        ? BatchStatus.Pending
        : scaledAmountBurned === scaledTotalAmount
        ? BatchStatus.Complete
        : BatchStatus.Unpaid;
    let scaledAmountOwed: bigint;
    let normalizedAmountOwed: TokenAmount;
    let normalizedTotalAmount: TokenAmount;
    if (scaledAmountBurned !== scaledTotalAmount) {
      scaledAmountOwed = scaledTotalAmount - scaledAmountBurned;
      normalizedAmountOwed = market.underlyingToken.getAmount(
        rayMulBigint(scaledAmountOwed, market.scaleFactor)
      );
      normalizedTotalAmount = normalizedAmountPaid.add(normalizedAmountOwed);
    } else {
      scaledAmountOwed = 0n;
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
      toRawAmount(batch.lastScaleFactor),
      batch.paymentsCount,
      batch.lastUpdatedTimestamp,
      market.underlyingToken.getAmount(batch.totalInterestEarned),
      batch.isCompleted,
      batch.payments || undefined,
      batch.withdrawals || undefined,
      batch.executions || undefined,
      batch.requests || undefined
    );
  }

  static async getWithdrawalBatch(market: Market, expiry: number): Promise<WithdrawalBatch> {
    const useLatestLens =
      market.version === MarketVersion.V2 || !hasDeploymentAddress(market.chainId, "MarketLens");
    const data = useLatestLens
      ? await getLatestWithdrawalBatchData(market.chainId, market.provider, market.address, expiry)
      : await getLegacyWithdrawalBatchData(market.chainId, market.provider, market.address, expiry);
    return WithdrawalBatch.fromWithdrawalBatchData(market, data);
  }
}
