import type { Market } from "../market";
import type { Token, TokenAmount } from "../token";

type TokenIdentity = Pick<Token, "chainId" | "address" | "decimals">;

export function assertMatchingToken(
  actual: TokenIdentity,
  expected: TokenIdentity,
  context = "Amount"
): void {
  if (actual.chainId !== expected.chainId) throw Error(`${context} token chain mismatch`);
  if (actual.address.toLowerCase() !== expected.address.toLowerCase()) {
    throw Error(`${context} token address mismatch`);
  }
  if (actual.decimals !== expected.decimals) throw Error(`${context} token decimals mismatch`);
}

/** Normalized market claims and their underlying asset have the same nominal units. */
export function assertNormalizedMarketAmount(
  amount: TokenAmount,
  market: Pick<Market, "marketToken" | "underlyingToken">,
  context: string
): void {
  const { underlyingToken, marketToken } = market;
  if (amount.token.address.toLowerCase() === underlyingToken.address.toLowerCase()) {
    assertMatchingToken(amount.token, underlyingToken, context);
    return;
  }
  assertMatchingToken(amount.token, marketToken, context);
  if (marketToken.chainId !== underlyingToken.chainId) {
    throw Error(`${context} token chain mismatch`);
  }
  if (marketToken.decimals !== underlyingToken.decimals) {
    throw Error(`${context} token decimals mismatch`);
  }
}
