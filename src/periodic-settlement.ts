import { MarketAccount } from "./account";
import { APR_REDUCTION_PROPOSAL_VALIDITY_PERIODS } from "./constants";
import { Market } from "./market";
import { HooksKind, MarketVersion, PartialTransaction, Signer } from "./types";
import { TokenAmount } from "./token";
import { SECONDS_IN_365_DAYS } from "./utils";
import { IPeriodicTermHooks__factory, WildcatMarketV2__factory } from "./typechain";

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
   * Only `executeApr` must be sent by the borrower (`onlyBorrower`). `approve`
   * and `settle` may come from any wallet, but must share a sender with each
   * other when a repayment amount is being transferred.
   */
  requiresBorrower: boolean;
  description: string;
}

export interface PeriodicAprReductionPlan {
  quote: PeriodicAprSettlementQuote;
  transactions: PlannedPeriodicAprTransaction[];
  /**
   * True when the transactions may be batched atomically by a contract-wallet
   * borrower (e.g. a Safe). Both market calls see `msg.sender == borrower` in
   * that case. A generic helper-contract multicall does NOT work: the market
   * would see the helper as `msg.sender` for the borrower-only APR call.
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
  const hooks = IPeriodicTermHooks__factory.connect(config.hooksAddress, market.provider);
  const provider = Signer.isSigner(market.provider) ? market.provider.provider : market.provider;
  const [, { pendingAprChange, responseWindowEnd }, now] = await Promise.all([
    market.update(),
    hooks.getPendingAprChange(market.address),
    timestampSec ??
      (provider
        ? provider.getBlock("latest").then((block) => block.timestamp)
        : Math.floor(Date.now() / 1_000))
  ]);

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
  if (
    now >=
    responseWindowEnd + config.periodDuration * APR_REDUCTION_PROPOSAL_VALIDITY_PERIODS
  ) {
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
 * APR reduction: [approve?, settle?, executeApr]. For EOA borrowers these are
 * sequential transactions and market state should be refreshed between settle
 * and execute; for contract-wallet borrowers they may be batched atomically.
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
    existingQuote ??
    (await getPeriodicAprReductionSettlementQuote(marketAccount, proposedAprBips));
  const market = marketAccount.market;
  const transactions: PlannedPeriodicAprTransaction[] = [];

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
    tx: {
      to: market.address,
      data: WildcatMarketV2__factory.createInterface().encodeFunctionData(
        "setAnnualInterestAndReserveRatioBips",
        // The hook overwrites the reserve ratio with the current value on the
        // proposed-reduction path; pass the current ratio.
        [proposedAprBips, market.reserveRatioBips]
      ),
      value: "0"
    },
    kind: "executeApr",
    requiresBorrower: true,
    description: `Execute the proposed APR reduction to ${proposedAprBips / 100}%`
  });

  return { quote, transactions, safeBatchable: true };
}
