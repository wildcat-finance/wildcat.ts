import { expect } from "chai";
import { CloseMarketStatus } from "../../src/account";
import { makeMarket, makeMarketAccount } from "../helpers/review-fixtures";

const makeBorrower = (decimals = 6) => {
  const market = makeMarket({}, decimals);
  market.totalSupply = market.marketToken.parseAmount("315360");
  market.scaledTotalSupply = market.totalSupply.raw;
  market.totalAssets = market.underlyingToken.parseAmount("100000");
  const minimumAllowance = market.underlyingToken.parseAmount("215360.6");
  return makeMarketAccount(market, {
    underlyingBalance: minimumAllowance,
    underlyingApproval: minimumAllowance.raw
  });
};

describe("close-market amount identity", () => {
  for (const decimals of [6, 18]) {
    it(`quotes both interest cushions in the underlying token with ${decimals} decimals`, () => {
      const account = makeBorrower(decimals);
      const { underlyingToken, totalSupply } = account.market;
      expect(totalSupply.token.address).not.to.equal(underlyingToken.address);

      const approval = account.getApprovalAmountForCloseMarket();
      const minimum = account.getApprovalAmountForCloseMarket(true);
      expect(approval.token).to.equal(underlyingToken);
      expect(approval.raw).to.equal(underlyingToken.parseAmount("215367.2").raw);
      expect(minimum.token).to.equal(underlyingToken);
      expect(minimum.raw).to.equal(underlyingToken.parseAmount("215360.6").raw);
    });

    it(`previews closure at the balance and allowance thresholds with ${decimals} decimals`, () => {
      const account = makeBorrower(decimals);
      const { underlyingToken } = account.market;
      const minimum = account.underlyingBalance;
      const outstanding = underlyingToken.parseAmount("215367.2");

      expect(account.previewCloseMarket()).to.deep.equal({ status: CloseMarketStatus.Ready });
      account.underlyingBalance = minimum.sub(1n);
      expect(account.previewCloseMarket()).to.deep.equal({
        status: CloseMarketStatus.InsufficientBalance,
        outstanding
      });
      account.underlyingBalance = minimum;
      account.underlyingApproval = minimum.raw - 1n;
      expect(account.previewCloseMarket()).to.deep.equal({
        status: CloseMarketStatus.InsufficientAllowance,
        outstanding
      });
    });
  }

  for (const zero of ["supply", "apr"] as const) {
    it(`previews closure with zero ${zero} without mixing token identities`, () => {
      const account = makeBorrower();
      const { market } = account;
      if (zero === "supply") {
        market.totalSupply = market.marketToken.getAmount(0n);
        market.scaledTotalSupply = 0n;
        market.totalAssets = market.underlyingToken.getAmount(0n);
      } else {
        market.annualInterestBips = 0;
      }
      account.underlyingBalance = market.outstandingDebt;
      account.underlyingApproval = market.outstandingDebt.raw;

      for (const forAllowanceCheck of [false, true]) {
        const amount = account.getApprovalAmountForCloseMarket(forAllowanceCheck);
        expect(amount.token).to.equal(market.underlyingToken);
        expect(amount.raw).to.equal(market.outstandingDebt.raw);
      }
      expect(account.previewCloseMarket()).to.deep.equal({ status: CloseMarketStatus.Ready });
    });
  }
});
