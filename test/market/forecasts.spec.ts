import { expect } from "chai";
import { SupportedChainId } from "../../src/constants";
import { SECONDS_IN_365_DAYS } from "../../src/utils";
import { makeMarket, reviewTimestamp } from "../helpers/review-fixtures";

describe("reserve-growth forecasts", () => {
  it("retains sub-unit-per-second interest for six-decimal assets", () => {
    const market = makeMarket({ protocolFeeBips: 1_000 }, 6);
    market.scaledTotalSupply = 100_000_000n;
    market.totalSupply = market.marketToken.getAmount(market.scaledTotalSupply);
    market.totalAssets = market.underlyingToken.getAmount(21_000_000n);
    market.coverageLiquidity = market.underlyingToken.getAmount(20_000_000n);
    expect(market.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw).to.equal(3_000_000n);
    expect(market.secondsBeforeDelinquency).to.equal(10_512_000);
    expect(market.repayRequiredForDuration(1).raw).to.equal(1n);
  });

  for (const eventGeneration of ["legacy", "v2.5"] as const) {
    it(`funds interest on expired unpaid batches at full coverage for ${eventGeneration}`, () => {
      const market = makeMarket({ eventGeneration });
      market.scaledPendingWithdrawals = market.scaledTotalSupply / 2n;
      market.unpaidWithdrawalBatchExpiries = [reviewTimestamp - 86_400];
      market.totalAssets = market.underlyingToken.getAmount(610_000n * 10n ** 18n);
      market.coverageLiquidity = market.underlyingToken.getAmount(600_000n * 10n ** 18n);
      expect(market.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw).to.equal(
        60_000n * 10n ** 18n
      );
      expect(market.secondsBeforeDelinquency).to.equal(5_256_000);
      market.protocolFeeBips = 1_000;
      expect(market.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw).to.equal(
        70_000n * 10n ** 18n
      );
    });
  }

  it("does not drop interest when all supply is queued or the reserve ratio is zero", () => {
    const market = makeMarket({ reserveRatioBips: 0 });
    market.scaledPendingWithdrawals = market.scaledTotalSupply;
    expect(market.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw).to.equal(
      100_000n * 10n ** 18n
    );
  });

  it("projects revolving utilization after the draw without mutating the market", () => {
    const market = makeMarket({
      chainId: SupportedChainId.Sepolia,
      eventGeneration: "v2.5",
      marketKind: "revolving",
      commitmentFeeBips: 0
    });
    market.drawnAmount = market.underlyingToken.getAmount(0);
    const borrow = market.underlyingToken.getAmount(790_000n * 10n ** 18n);
    const assets = market.totalAssets;
    const forecast = market.getSecondsBeforeDelinquencyForBorrowedAmount(borrow);
    expect(market.drawnAmount.raw).to.equal(0n);
    expect(market.totalAssets).to.equal(assets);
    market.drawnAmount = borrow;
    market.totalAssets = assets.sub(borrow);
    expect(forecast).to.equal(19_959_493);
    expect(forecast).to.equal(market.secondsBeforeDelinquency);
  });

  it("retains revolving interest below one blended basis point", () => {
    const market = makeMarket({ marketKind: "revolving", commitmentFeeBips: 0 }, 6);
    market.drawnAmount = market.underlyingToken.getAmount(1_000_000n);
    expect(market.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw).to.equal(20_000n);
  });

  it("distinguishes a zero growth rate from insufficient current coverage", () => {
    const market = makeMarket({ annualInterestBips: 0 });
    expect(market.secondsBeforeDelinquency).to.equal(Number.MAX_SAFE_INTEGER);
    expect(market.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw).to.equal(0n);
    const excessiveBorrow = market.underlyingToken.getAmount(900_000n * 10n ** 18n);
    expect(market.getSecondsBeforeDelinquencyForBorrowedAmount(excessiveBorrow)).to.equal(0);
  });

  it("returns zero for a zero horizon and rejects invalid horizons", () => {
    const market = makeMarket();
    expect(market.repayRequiredForDuration(0).raw).to.equal(0n);
    expect(() => market.repayRequiredForDuration(-1)).to.throw();
    expect(() => market.repayRequiredForDuration(0.5)).to.throw();
    expect(() => market.repayRequiredForDuration(Number.MAX_SAFE_INTEGER + 1)).to.throw();
  });
});
