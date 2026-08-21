import { expect } from "chai";
import { HooksKind } from "../../src/domain";
import { Market } from "../../src/market";

describe("Periodic withdrawal window timing", () => {
  it("returns the next future window start while the current window is open", () => {
    const originalDateNow = Date.now;
    const market = Object.create(Market.prototype) as Market;
    Object.assign(market, {
      isClosed: false,
      hooksConfig: {
        kind: HooksKind.PeriodicTerm,
        firstWithdrawalWindowStart: 1_000,
        periodDuration: 300,
        withdrawalWindowDuration: 60,
        periodicTermClosed: false
      }
    });

    try {
      Date.now = () => 1_020_000;
      expect(market.isPeriodicWithdrawalWindowOpen).to.equal(true);
      expect(market.nextPeriodicWithdrawalWindowStart).to.equal(1_300);
    } finally {
      Date.now = originalDateNow;
    }
  });
});
