import { expect } from "chai";
import { MarketAccount } from "../../src/account";
import { SetAprStatus } from "../../src/account/validation";
import { HooksKind } from "../../src/domain";

describe("APR preview compatibility", () => {
  const preview = (apr: number, pendingAprChangeProposalTimestamp: number) =>
    MarketAccount.prototype.previewSetAPR.call(
      {
        isBorrower: true,
        market: {
          annualInterestBips: 1_000,
          hooksConfig: {
            kind: HooksKind.PeriodicTerm,
            pendingAprChangeProposalTimestamp
          },
          originalReserveRatioAndAnnualInterestBips: [1_000, 1_000],
          reserveRatioBips: 1_000,
          temporaryReserveRatio: false,
          getReserveRatioForNewAPR: () => 1_000
        }
      } as unknown as MarketAccount,
      apr
    );

  it("warns when an APR increase will cancel a pending periodic proposal", () => {
    const result = preview(1_100, 1);

    expect(result.status).to.equal(SetAprStatus.Ready);
    if (result.status !== SetAprStatus.Ready) return;
    expect(result.willCancelPendingProposal).to.equal(true);
  });

  it("does not warn when there is no pending proposal", () => {
    const result = preview(1_100, 0);

    expect(result.status).to.equal(SetAprStatus.Ready);
    if (result.status !== SetAprStatus.Ready) return;
    expect(result.willCancelPendingProposal).to.equal(false);
  });
});
