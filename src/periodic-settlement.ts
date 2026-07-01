import { MarketAccount } from "./account";
import { Market } from "./market";
import { HooksKind, MarketVersion, PartialTransaction, PeriodicTermHooksConfig } from "./types";
import { TokenAmount } from "./token";
import { prepareTransaction, SECONDS_IN_365_DAYS, toNumber } from "./utils";
import { iPeriodicTermHooksAbi, wildcatMarketV2Abi } from "./abi";
import { getViemPublicClientFromEthers } from "./internal/ethers-viem";
import { readViemContract } from "./internal/viem-read";

/**
 * Helpers for the periodic APR reduction settlement flow.
 *
 * Executing a proposed periodic APR reduction requires, at transaction time:
 *  1. the response window has elapsed;
 *  2. `scaledPendingWithdrawals == 0` (PeriodicTermHooks reverts UnpaidWithdrawalsExist);
 *  3. the market is not delinquent (`liquidityRequired() <= totalAssets()`), because the
 *     hook keeps the reserve ratio unchanged so the market-level check reverts
 *     InsufficientReservesForOldLiquidityRatio.
 *
 * Both 2 and 3 are satisfied by a single `repayAndProcessUnpaidWithdrawalBatches`
 * call sized as `coverageLiquidity - totalAssets`: `liquidityRequired` already counts
 * 100% of pending/unpaid withdrawals and is invariant under batch processing, and
 * exact coverage always fully burns the queue (no rounding buffer is needed —
 * `scaleAmount` rounds half-up and `scaleFactor >= RAY`; see
 * v2-protocol/test/exploration/PeriodicAprReductionSettlementDust.t.sol). The only
 * buffer applied covers interest accruing between quote and transaction inclusion.
 *
 * Quotes are computed from LIVE state (lens + hook reads), never subgraph state:
 * the APR transaction itself processes an expired-but-coverable pending batch via
 * `_getUpdatedState`, so stale subgraph reads can report blockers that no longer
 * exist on chain.
 */

/** Upper bound on unpaid batches processed in one settlement transaction. */
export const MAX_UNPAID_BATCHES_PER_SETTLEMENT_TX = 10;

/** Interest drift allowance added to a nonzero settlement amount (~10 minutes). */
const SETTLEMENT_BUFFER_SECONDS = 600;
/** Interest drift allowance used for the suggested token approval (~2 hours). */
const APPROVAL_BUFFER_SECONDS = 7_200;

type PendingAprChangeValue =
  | {
      annualInterestBips: bigint | number | string;
      proposalTimestamp: bigint | number | string;
    }
  | readonly [bigint | number | string, bigint | number | string];

type PendingAprChangeResult =
  | {
      pendingAprChange: PendingAprChangeValue;
      responseWindowStart: bigint | number | string;
      responseWindowEnd: bigint | number | string;
    }
  | readonly [PendingAprChangeValue, bigint | number | string, bigint | number | string];

const getPendingAprChangeField = (
  pendingAprChange: PendingAprChangeValue,
  index: 0 | 1,
  key: "annualInterestBips" | "proposalTimestamp"
): number => {
  if (Array.isArray(pendingAprChange)) {
    return toNumber(pendingAprChange[index]);
  }
  return toNumber(
    (
      pendingAprChange as {
        annualInterestBips: bigint | number | string;
        proposalTimestamp: bigint | number | string;
      }
    )[key]
  );
};

const normalizePendingAprChangeResult = (result: PendingAprChangeResult) => {
  const objectResult = result as {
    pendingAprChange: PendingAprChangeValue;
    responseWindowEnd: bigint | number | string;
  };
  const pendingAprChange = Array.isArray(result) ? result[0] : objectResult.pendingAprChange;
  const responseWindowEnd = Array.isArray(result) ? result[2] : objectResult.responseWindowEnd;
  return {
    pendingAprChange: {
      annualInterestBips: getPendingAprChangeField(pendingAprChange, 0, "annualInterestBips"),
      proposalTimestamp: getPendingAprChangeField(pendingAprChange, 1, "proposalTimestamp")
    },
    responseWindowEnd: toNumber(responseWindowEnd)
  };
};

const getAprReductionExpiryTimestamp = (
  config: PeriodicTermHooksConfig,
  responseWindowEnd: number
): number => {
  if (config.periodDuration <= 0) return responseWindowEnd;
  if (responseWindowEnd < config.firstWithdrawalWindowStart) {
    return config.firstWithdrawalWindowStart;
  }
  const periodsElapsed = Math.floor(
    (responseWindowEnd - config.firstWithdrawalWindowStart) / config.periodDuration
  );
  const currentWindowStart =
    config.firstWithdrawalWindowStart + periodsElapsed * config.periodDuration;
  return currentWindowStart <= responseWindowEnd
    ? currentWindowStart + config.periodDuration
    : currentWindowStart;
};

export enum PeriodicAprSettlementStatus {
  /** The APR reduction can be executed now; no settlement transaction is needed. */
  Ready = "Ready",
  /** A settlement transaction must precede the APR execution. */
  NeedsSettlement = "NeedsSettlement",
  ResponseWindowNotElapsed = "ResponseWindowNotElapsed",
  /**
   * Past the proposal validity window (template v2+ enforces this on-chain);
   * the borrower must re-propose.
   */
  ProposalExpired = "ProposalExpired",
  NotProposed = "NotProposed",
  ProposalDoesNotMatch = "ProposalDoesNotMatch",
  MarketClosed = "MarketClosed",
  NotPeriodicMarket = "NotPeriodicMarket"
}

export interface PeriodicAprSettlementQuote {
  status: PeriodicAprSettlementStatus;
  /** Assets to send with the settlement tx. Zero when only batch processing is needed. */
  amountToSettle: TokenAmount;
  /** Approval to request when `amountToSettle` is nonzero (sized with extra drift room). */
  suggestedApprovalAmount: TokenAmount;
  /** True when the market is delinquent and assets must be added. */
  needsRepayment: boolean;
  /** True when stale unpaid withdrawal batches must be processed. */
  needsBatchProcessing: boolean;
  unpaidBatchCount: number;
  /**
   * maxBatches argument for repayAndProcessUnpaidWithdrawalBatches. Always the
   * per-transaction cap rather than the snapshot batch count: extra headroom is
   * a no-op on-chain (the loop stops at the actual queue length), and sizing to
   * a snapshot would make the plan fragile against a batch expiring between
   * quote and execution.
   */
  maxBatches: number;
  /**
   * Unpaid batches that will still be queued after one settlement transaction
   * (`max(0, unpaidBatchCount - maxBatches)`). When nonzero the plan omits the
   * APR execution step — it would revert (atomically, for a Safe batch) — and
   * the caller must settle again after refetching the quote until this reaches
   * zero. Repayment rides the first pass, so subsequent passes are zero-repay
   * and permissionless.
   */
  remainingBatchesAfterThisPass: number;
  /** True when the settlement tx moves no assets, so any wallet may send it. */
  settlementIsPermissionless: boolean;
  /**
   * True while a periodic withdrawal window is open: a lender may queue a
   * not-instantly-coverable withdrawal between settlement and execution and
   * re-block the APR change. Prefer executing between windows.
   */
  isWithdrawalWindowOpen: boolean;
  /** Authoritative response window end, computed by the hook contract. */
  responseWindowEnd: number;
  /** The proposed APR currently pending on the hook contract (bips). */
  proposedAprBips: number;
}

export interface PlannedPeriodicAprTransaction {
  tx: PartialTransaction;
  kind: "approve" | "settle" | "executeApr";
  /**
   * `approve` and `settle` may come from any wallet, but must share a sender
   * with each other when a repayment amount is being transferred. `executeApr`
   * is permissionless once the proposal is executable.
   */
  requiresBorrower: boolean;
  description: string;
}

export interface PeriodicAprReductionPlan {
  quote: PeriodicAprSettlementQuote;
  transactions: PlannedPeriodicAprTransaction[];
  /**
   * True when the transactions may be batched atomically. When repayment is
   * included, the approval and settlement steps must still share a sender.
   */
  safeBatchable: boolean;
}

function interestBuffer(market: Market, seconds: number): TokenAmount {
  return market.underlyingToken.getAmount(
    market.totalSupply.rayMul(market.effectiveBorrowerAPR).mulDiv(seconds, SECONDS_IN_365_DAYS)
  );
}

/**
 * Compute what (if anything) must be settled before a pending periodic APR
 * reduction can execute. Refreshes the market from the lens and reads the
 * proposal from the hook contract, so the result reflects live chain state.
 *
 * @param timestampSec Optional clock override; defaults to the latest block
 *                     timestamp so window comparisons use chain time.
 */
export async function getPeriodicAprReductionSettlementQuote(
  marketAccount: MarketAccount,
  proposedAprBips: number,
  timestampSec?: number
): Promise<PeriodicAprSettlementQuote> {
  const market = marketAccount.market;
  const zero = market.underlyingToken.getAmount(0);
  const config = market.hooksConfig;

  const emptyQuote = (status: PeriodicAprSettlementStatus): PeriodicAprSettlementQuote => ({
    status,
    amountToSettle: zero,
    suggestedApprovalAmount: zero,
    needsRepayment: false,
    needsBatchProcessing: false,
    unpaidBatchCount: 0,
    maxBatches: 0,
    remainingBatchesAfterThisPass: 0,
    settlementIsPermissionless: true,
    isWithdrawalWindowOpen: false,
    responseWindowEnd: 0,
    proposedAprBips: 0
  });

  if (market.version !== MarketVersion.V2 || config?.kind !== HooksKind.PeriodicTerm) {
    return emptyQuote(PeriodicAprSettlementStatus.NotPeriodicMarket);
  }

  // Live reads: lens market data (view-updated state, including pending-batch
  // payment application) and the hook's authoritative proposal/window math.
  const publicClient = getViemPublicClientFromEthers(market.provider);
  const [, pendingAprChangeResult, now] = await Promise.all([
    market.update(),
    readViemContract<PendingAprChangeResult>(
      publicClient,
      config.hooksAddress,
      iPeriodicTermHooksAbi,
      "getPendingAprChange",
      [market.address]
    ),
    timestampSec ?? publicClient.getBlock().then((block) => toNumber(block.timestamp))
  ]);
  const { pendingAprChange, responseWindowEnd } =
    normalizePendingAprChangeResult(pendingAprChangeResult);

  if (market.isClosed) {
    // repayAndProcessUnpaidWithdrawalBatches reverts on closed markets even with
    // a zero amount, and APR changes on closed markets revert anyway.
    return emptyQuote(PeriodicAprSettlementStatus.MarketClosed);
  }
  if (pendingAprChange.proposalTimestamp === 0) {
    return emptyQuote(PeriodicAprSettlementStatus.NotProposed);
  }

  const base: PeriodicAprSettlementQuote = {
    ...emptyQuote(PeriodicAprSettlementStatus.Ready),
    isWithdrawalWindowOpen: market.isPeriodicWithdrawalWindowOpen,
    responseWindowEnd,
    proposedAprBips: pendingAprChange.annualInterestBips
  };

  if (pendingAprChange.annualInterestBips !== proposedAprBips) {
    return { ...base, status: PeriodicAprSettlementStatus.ProposalDoesNotMatch };
  }
  if (now < responseWindowEnd) {
    return { ...base, status: PeriodicAprSettlementStatus.ResponseWindowNotElapsed };
  }
  if (now >= getAprReductionExpiryTimestamp(config, responseWindowEnd)) {
    return { ...base, status: PeriodicAprSettlementStatus.ProposalExpired };
  }

  const delinquentDebt = market.delinquentDebt;
  const needsRepayment = delinquentDebt.gt(0);
  const unpaidBatchCount = market.unpaidWithdrawalBatchExpiries.length;
  const needsBatchProcessing = unpaidBatchCount > 0;

  if (!needsRepayment && !needsBatchProcessing) {
    return base;
  }

  return {
    ...base,
    status: PeriodicAprSettlementStatus.NeedsSettlement,
    amountToSettle: needsRepayment
      ? delinquentDebt.add(interestBuffer(market, SETTLEMENT_BUFFER_SECONDS))
      : zero,
    suggestedApprovalAmount: needsRepayment
      ? delinquentDebt.add(interestBuffer(market, APPROVAL_BUFFER_SECONDS))
      : zero,
    needsRepayment,
    needsBatchProcessing,
    unpaidBatchCount,
    maxBatches: MAX_UNPAID_BATCHES_PER_SETTLEMENT_TX,
    remainingBatchesAfterThisPass: Math.max(
      0,
      unpaidBatchCount - MAX_UNPAID_BATCHES_PER_SETTLEMENT_TX
    ),
    settlementIsPermissionless: !needsRepayment
  };
}

/**
 * Build the ordered transactions for settling and executing a pending periodic
 * APR reduction: [approve?, settle?, executeApr]. For EOAs these are
 * sequential transactions and market state should be refreshed between settle
 * and execute; contract wallets may batch them atomically when the same wallet
 * is sending the approval/settlement steps.
 *
 * When more unpaid batches are queued than one settlement transaction can
 * process (`quote.remainingBatchesAfterThisPass > 0`), the plan contains the
 * settlement step ONLY — appending the APR execution would revert and, in a
 * Safe batch, roll back the settlement with it. Refetch the quote after the
 * transaction confirms and request a new plan; repeat until the quote returns
 * `Ready`, whose plan is the bare APR execution.
 */
export async function populatePeriodicAprReductionPlan(
  marketAccount: MarketAccount,
  proposedAprBips: number,
  existingQuote?: PeriodicAprSettlementQuote
): Promise<PeriodicAprReductionPlan> {
  const quote =
    existingQuote ?? (await getPeriodicAprReductionSettlementQuote(marketAccount, proposedAprBips));
  const market = marketAccount.market;
  const transactions: PlannedPeriodicAprTransaction[] = [];

  if (
    (quote.status === PeriodicAprSettlementStatus.Ready ||
      quote.status === PeriodicAprSettlementStatus.NeedsSettlement) &&
    quote.proposedAprBips !== proposedAprBips
  ) {
    return {
      quote: { ...quote, status: PeriodicAprSettlementStatus.ProposalDoesNotMatch },
      transactions,
      safeBatchable: false
    };
  }

  if (
    quote.status !== PeriodicAprSettlementStatus.Ready &&
    quote.status !== PeriodicAprSettlementStatus.NeedsSettlement
  ) {
    return { quote, transactions, safeBatchable: false };
  }

  if (quote.status === PeriodicAprSettlementStatus.NeedsSettlement) {
    if (quote.amountToSettle.gt(0) && !marketAccount.isApprovedFor(quote.amountToSettle)) {
      transactions.push({
        tx: {
          to: market.underlyingToken.address,
          data: market.underlyingToken.contract.interface.encodeFunctionData("approve", [
            market.address,
            quote.suggestedApprovalAmount.raw
          ]),
          value: "0"
        },
        kind: "approve",
        requiresBorrower: false,
        description: `Approve ${quote.suggestedApprovalAmount.format()} ${
          market.underlyingToken.symbol
        } for settlement (must share a sender with the settlement transaction)`
      });
    }
    transactions.push({
      tx: market.populateRepayAndProcessUnpaidWithdrawalBatches(
        quote.amountToSettle,
        quote.maxBatches
      ),
      kind: "settle",
      requiresBorrower: false,
      description: quote.needsRepayment
        ? `Repay ${quote.amountToSettle.format()} ${
            market.underlyingToken.symbol
          } and process up to ${quote.maxBatches} unpaid withdrawal batch(es)`
        : `Process up to ${quote.maxBatches} unpaid withdrawal batch(es) (no repayment required; any wallet may send this)`
    });

    if (quote.remainingBatchesAfterThisPass > 0) {
      // More batches remain than one transaction processes; the APR execution
      // would revert with UnpaidWithdrawalsExist and, in a Safe batch, roll
      // back the settlement with it. Settle-only pass — refetch the quote and
      // plan again once this transaction confirms.
      return { quote, transactions, safeBatchable: true };
    }
  }

  transactions.push({
    tx: prepareTransaction({
      to: market.address,
      abi: wildcatMarketV2Abi,
      functionName: "executePendingAnnualInterestBipsReduction"
    }),
    kind: "executeApr",
    requiresBorrower: false,
    description: `Execute the proposed APR reduction to ${quote.proposedAprBips / 100}%`
  });

  return { quote, transactions, safeBatchable: true };
}
