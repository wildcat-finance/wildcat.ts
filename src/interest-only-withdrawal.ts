import { IndexedAt, ReadStateSource } from "./domain";
import { Token, TokenAmount, minTokenAmount } from "./token";
import { assert, rayMulBigint } from "./utils";

export type InterestOnlyWithdrawalPosition =
  | { kind: "market"; address: string }
  | { kind: "wrapper"; address: string };

/**
 * A time-of-quote convenience derived from indexed principal basis and the
 * latest balance state supplied to the SDK. It is not a protocol entitlement.
 */
export type InterestOnlyWithdrawalQuote = {
  status: "ready" | "position-changed";
  account: string;
  market: string;
  position: InterestOnlyWithdrawalPosition;
  /** Underlying asset used for every amount in this quote. */
  asset: Token;
  /** Balance represented by the indexed position at the supplied scale factor. */
  indexedPositionBalance: TokenAmount;
  /** Latest known balance, used as a hard upper bound on the quote. */
  currentBalance: TokenAmount;
  principalBasis: TokenAmount;
  /** Full-precision amount suitable for ordinary queueWithdrawal(amount). */
  availableInterest: TokenAmount;
  /** Exact subgraph event projection that supplied the position and basis. */
  basisIndexedAt: IndexedAt;
  balanceStateSource: ReadStateSource;
  quotedAtTimestamp: number;
};

export type CreateInterestOnlyWithdrawalQuoteArgs = {
  account: string;
  market: string;
  position: InterestOnlyWithdrawalPosition;
  assetToken: Token;
  indexedScaledBalance: bigint;
  currentScaledBalance: bigint;
  currentBalance: TokenAmount;
  principalBasis: TokenAmount;
  currentScaleFactor: bigint;
  basisIndexedAt: IndexedAt;
  balanceStateSource: ReadStateSource;
  quotedAtTimestamp?: number;
};

/**
 * Calculate an interest-only amount without counting unindexed incoming
 * principal. Outgoing activity that reaches the live balance first is handled
 * conservatively by capping the result at that current balance.
 */
export const createInterestOnlyWithdrawalQuote = ({
  account,
  market,
  position,
  assetToken,
  indexedScaledBalance,
  currentScaledBalance,
  currentBalance,
  principalBasis,
  currentScaleFactor,
  basisIndexedAt,
  balanceStateSource,
  quotedAtTimestamp = Math.floor(Date.now() / 1_000)
}: CreateInterestOnlyWithdrawalQuoteArgs): InterestOnlyWithdrawalQuote => {
  assert(
    currentBalance.token.address.toLowerCase() === assetToken.address.toLowerCase(),
    "Current balance token does not match quote asset"
  );
  assert(
    principalBasis.token.address.toLowerCase() === assetToken.address.toLowerCase(),
    "Principal basis token does not match quote asset"
  );

  const indexedPositionBalance = assetToken.getAmount(
    rayMulBigint(indexedScaledBalance, currentScaleFactor)
  );
  const positionChanged = indexedScaledBalance !== currentScaledBalance;
  const availableInterest = positionChanged
    ? assetToken.getAmount(0)
    : minTokenAmount(indexedPositionBalance.satsub(principalBasis), currentBalance);

  return {
    status: positionChanged ? "position-changed" : "ready",
    account,
    market,
    position,
    asset: assetToken,
    indexedPositionBalance,
    currentBalance,
    principalBasis,
    availableInterest,
    basisIndexedAt,
    balanceStateSource,
    quotedAtTimestamp
  };
};
