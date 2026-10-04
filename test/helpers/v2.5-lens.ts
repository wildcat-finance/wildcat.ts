import { MarketDataStructOutput, MarketLiquidityDataStructOutput } from "../../src/lens-types";
import { toRawAmount } from "../../src/token";

export const unsupportedLifecycle = {
  isPresent: false,
  repaymentDate: 0,
  repaymentPeriod: 0,
  repaymentDeadline: 0,
  defaultedAt: 0,
  isInRepayment: false
};
export const unsupportedTemplateHash = { isPresent: false, value: `0x${"00".repeat(32)}` };
export const unsupportedAprProposal = {
  isPresent: false,
  annualInterestBips: 0,
  proposalTimestamp: 0,
  responseWindowStart: 0,
  responseWindowEnd: 0
};
export const legacyRepaymentBounds = { maximumRepaymentPeriod: 0, maximumRepaymentDateDelay: 0 };

/** These routing fixtures predate repayment/carry; the new lens supplies legacy accounting. */
export const legacyLiquidity = (
  data: Pick<
    MarketDataStructOutput,
    | "totalSupply"
    | "normalizedUnclaimedWithdrawals"
    | "lastAccruedProtocolFees"
    | "totalAssets"
    | "coverageLiquidity"
    | "maxTotalSupply"
    | "isClosed"
  >
): MarketLiquidityDataStructOutput => {
  const supply = toRawAmount(data.totalSupply);
  const assets = toRawAmount(data.totalAssets);
  const debts =
    supply +
    toRawAmount(data.normalizedUnclaimedWithdrawals) +
    toRawAmount(data.lastAccruedProtocolFees);
  const maximum = toRawAmount(data.maxTotalSupply) - supply;
  const borrowable = assets - toRawAmount(data.coverageLiquidity);
  return {
    maximumDeposit: data.isClosed || maximum < 0n ? 0n : maximum,
    borrowableAssets: data.isClosed || borrowable < 0n ? 0n : borrowable,
    totalDebts: debts,
    recoverableUnderlying: data.isClosed && assets > debts ? assets - debts : 0n
  };
};
