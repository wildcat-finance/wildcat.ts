import { MarketAccount } from "./account";
import { APR_REDUCTION_PROPOSAL_VALIDITY_PERIODS } from "./constants";
import { Market } from "./market";
import { HooksKind, MarketVersion, PartialTransaction, Signer } from "./types";
import { TokenAmount } from "./token";
import { SECONDS_IN_365_DAYS } from "./utils";
import { IPeriodicTermHooks__factory, WildcatMarketV2__factory } from "./typechain";

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
  /** The proposal is past the template-v2 execution window. */
  ProposalExpired = "ProposalExpired",
  NotProposed = "NotProposed",
  ProposalDoesNotMatch = "ProposalDoesNotMatch",
  MarketClosed = "MarketClosed",
  NotPeriodicMarket = "NotPeriodicMarket"
}

export interface PeriodicAprSettlementQuote {
  status: PeriodicAprSettlementStatus;
  /** Assets to send with the settlement transaction. */
  amountToSettle: TokenAmount;
  /** Approval to request when settlement moves assets, with extra drift room. */
  suggestedApprovalAmount: TokenAmount;
  /** True when the market is delinquent and assets must be added. */
  needsRepayment: boolean;
  /** True when stale unpaid withdrawal batches must be processed. */
  needsBatchProcessing: boolean;
  unpaidBatchCount: number;
  /** `maxBatches` argument for the next settlement transaction. */
  maxBatches: number;
  /** Known batches left after one bounded settlement pass. */
  remainingBatchesAfterThisPass: number;
  /** True when settlement moves no assets, so any wallet may send it. */
  settlementIsPermissionless: boolean;
  /** True while lenders can open a new withdrawal batch before APR execution. */
  isWithdrawalWindowOpen: boolean;
  /** Authoritative response-window end read from the hooks contract. */
  responseWindowEnd: number;
  /** Proposed APR currently pending on the hooks contract, in bips. */
  proposedAprBips: number;
}

export interface PlannedPeriodicAprTransaction {
  tx: PartialTransaction;
  kind: "approve" | "settle" | "executeApr";
  /** Only `executeApr` is restricted to the market borrower. */
  requiresBorrower: boolean;
  description: string;
}

export interface PeriodicAprReductionPlan {
  quote: PeriodicAprSettlementQuote;
  transactions: PlannedPeriodicAprTransaction[];
  /**
   * True when one account may atomically execute this plan. A complete plan
   * containing `executeApr` is batchable only when `marketAccount` represents
   * the borrower. A settle-only pass may be batched by its payer.
   */
  safeBatchable: boolean;
}

function interestBuffer(market: Market, seconds: number): TokenAmount {
  return market.underlyingToken.getAmount(
    market.totalSupply.rayMul(market.effectiveBorrowerAPR).mulDiv(seconds, SECONDS_IN_365_DAYS)
  );
}

/**
 * Compute the live settlement required before a pending periodic APR reduction.
 * The lens and hooks contract are read directly; indexed mutable state is not
 * trusted for transaction planning.
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
  if (now >= responseWindowEnd + config.periodDuration * APR_REDUCTION_PROPOSAL_VALIDITY_PERIODS) {
    return { ...base, status: PeriodicAprSettlementStatus.ProposalExpired };
  }

  // Exact coverage clears scaled withdrawal debt at a fixed timestamp. The
  // buffer below covers only interest accrued between quote and inclusion.
  const delinquentDebt = market.delinquentDebt;
  const needsRepayment = delinquentDebt.gt(0);
  const unpaidBatchCount = market.unpaidWithdrawalBatchExpiries.length;
  // Old lenses omitted the stored FIFO. Nonzero pending withdrawals with no
  // open batch still prove that processing is required, though not its count.
  const needsBatchProcessing =
    unpaidBatchCount > 0 ||
    (market.scaledPendingWithdrawals.gt(0) && market.pendingWithdrawalExpiry === 0);

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
 * Build `[approve?, settle?, executeApr]` for a periodic APR reduction.
 * Approval and positive settlement are populated for `marketAccount.account`
 * and must use the same sender. Refetch after every settle-only pass.
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
        } for settlement`
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
        : `Process up to ${quote.maxBatches} unpaid withdrawal batch(es)`
    });

    if (quote.remainingBatchesAfterThisPass > 0) {
      return { quote, transactions, safeBatchable: true };
    }
  }

  transactions.push({
    tx: {
      to: market.address,
      data: WildcatMarketV2__factory.createInterface().encodeFunctionData(
        "setAnnualInterestAndReserveRatioBips",
        [proposedAprBips, market.reserveRatioBips]
      ),
      value: "0"
    },
    kind: "executeApr",
    requiresBorrower: true,
    description: `Execute the proposed APR reduction to ${proposedAprBips / 100}%`
  });

  return { quote, transactions, safeBatchable: marketAccount.isBorrower };
}
