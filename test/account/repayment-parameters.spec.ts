import assert from "assert/strict";
import { expect } from "chai";
import { MarketAccount } from "../../src/account";
import { supportsRepaymentParameterFreeze } from "../../src/access/repayment";
import { getHooksFactoryAddress, SupportedChainId } from "../../src/config";
import { HooksKind } from "../../src/types";
import { makeMarket, makeMarketAccount, reviewTimestamp } from "../helpers/review-fixtures";

const templates = [
  {
    kind: HooksKind.OpenTerm,
    address: "0xBcA425d384Da256040779DF532B6D2E8d3B3f1aD",
    predecessor: "0x4aC04D306F3D2352998Ce48E2e8D357213683415"
  },
  {
    kind: HooksKind.FixedTerm,
    address: "0xa3FE06137cc893E19C2E4764a4A7b001E988ba2B",
    predecessor: "0x510d7aBf9534CFf6D2f760f005c703bD6f0CB14a"
  },
  {
    kind: HooksKind.PeriodicTerm,
    address: "0x79DA352868305d37D0179f460Ded88886D4eE524",
    predecessor: "0x9C83C59fB30816EFafDec25147f9C214Bf80688b"
  }
];

const makeAccount = (
  template: (typeof templates)[number],
  marketKind: "standard" | "revolving"
): MarketAccount => {
  const market = makeMarket({
    chainId: SupportedChainId.Sepolia,
    marketKind,
    hooksFactory: getHooksFactoryAddress(SupportedChainId.Sepolia, marketKind),
    hooksTemplateAddress: template.address,
    repaymentDate: reviewTimestamp,
    lastInterestAccruedTimestamp: reviewTimestamp - 1
  });
  market.hooksConfig!.flags.useOnSetMaxTotalSupply = true;
  if (template.kind === HooksKind.FixedTerm) {
    market.hooksConfig = {
      ...market.hooksConfig!,
      kind: HooksKind.FixedTerm,
      fixedTermEndTime: reviewTimestamp,
      allowTermReduction: true,
      allowClosureBeforeTerm: false,
      queueWithdrawalRequiresAccess: false,
      allowForceBuyBacks: false
    };
  } else if (template.kind === HooksKind.PeriodicTerm) {
    market.hooksConfig = {
      ...market.hooksConfig!,
      kind: HooksKind.PeriodicTerm,
      queueWithdrawalRequiresAccess: false,
      firstWithdrawalWindowStart: reviewTimestamp + 1000,
      periodDuration: 300,
      withdrawalWindowDuration: 30,
      periodicTermClosed: false,
      periodicWithdrawalWindowOpen: false,
      pendingAprChangeAnnualInterestBips: 0,
      pendingAprChangeProposalTimestamp: 0,
      pendingAprChangeResponseWindowStart: 0,
      pendingAprChangeResponseWindowEnd: 0
    };
  }
  return makeMarketAccount(market);
};

const statuses = (account: MarketAccount): string[] => {
  const amount = account.market.underlyingToken.getAmount(1);
  const result: string[] = [
    account.previewSetMaxTotalSupply(amount).status,
    account.previewSetMinimumDeposit(amount).status,
    account.previewSetMinimumDeposit(amount.token.getAmount(0)).status
  ];
  if (account.market.hooksKind === HooksKind.FixedTerm)
    result.push(account.previewSetFixedTermEndTime(reviewTimestamp - 1).status);
  if (account.market.hooksKind === HooksKind.PeriodicTerm)
    result.push(account.previewProposeAnnualInterestBips(500).status);
  return result;
};

describe("V2.5.6 repayment parameter freeze", () => {
  for (const marketKind of ["standard", "revolving"] as const) {
    for (const template of templates) {
      it(`freezes ${marketKind}/${template.kind} at the observed repayment date and after closure`, async () => {
        const account = makeAccount(template, marketKind);
        const market = account.market;
        expect(statuses(account)).to.satisfy((values: string[]) =>
          values.every((v) => v === "Ready")
        );
        for (const timestamp of [reviewTimestamp, reviewTimestamp + 1]) {
          market.lastInterestAccruedTimestamp = timestamp;
          expect(market.hasFrozenHookParameters).to.equal(true);
          expect(statuses(account)).to.satisfy((values: string[]) =>
            values.every((v) => v === "MarketInRepayment")
          );
        }
        const amount = market.underlyingToken.getAmount(1);
        await assert.rejects(account.setMaxTotalSupply(amount), /MarketInRepayment/);
        await assert.rejects(account.populateSetMinimumDeposit(amount), /MarketInRepayment/);
        if (template.kind === HooksKind.FixedTerm)
          await assert.rejects(
            account.populateSetFixedTermEndTime(reviewTimestamp - 1),
            /MarketInRepayment/
          );
        if (template.kind === HooksKind.PeriodicTerm)
          expect(() => account.populateProposeAnnualInterestBips(500)).to.throw(
            "MarketInRepayment"
          );

        market.isClosed = true;
        expect(market.isInRepayment).to.equal(false);
        expect(market.hasFrozenHookParameters).to.equal(true);
        expect(statuses(account)).to.satisfy((values: string[]) =>
          values.every((v) => v === "MarketInRepayment")
        );
      });

      it(`preserves unscheduled and predecessor ${marketKind}/${template.kind} behavior`, () => {
        const account = makeAccount(template, marketKind);
        const market = account.market;
        market.lastInterestAccruedTimestamp = reviewTimestamp;
        for (const date of [undefined, 0]) {
          market.repaymentDate = date;
          expect(market.hasFrozenHookParameters).to.equal(false);
          expect(statuses(account)).to.satisfy((values: string[]) =>
            values.every((v) => v === "Ready")
          );
        }
        market.repaymentDate = reviewTimestamp;
        market.hooksTemplateAddress = template.predecessor;
        expect(market.hasFrozenHookParameters).to.equal(false);
        expect(statuses(account)).to.satisfy((values: string[]) =>
          values.every((v) => v === "Ready")
        );
      });
    }
  }

  it("scopes implementation identity to Sepolia and accepts address casing", () => {
    for (const template of templates) {
      expect(
        supportsRepaymentParameterFreeze(SupportedChainId.Sepolia, template.address.toUpperCase())
      ).to.equal(true);
      expect(supportsRepaymentParameterFreeze(SupportedChainId.Mainnet, template.address)).to.equal(
        false
      );
    }
    expect(supportsRepaymentParameterFreeze(SupportedChainId.Sepolia, undefined)).to.equal(false);
  });
});
