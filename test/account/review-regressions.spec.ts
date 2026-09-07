import { expect } from "chai";
import { SetAprStatus, QueueWithdrawalStatus } from "../../src/account";
import { BasicLenderData } from "../../src/gql/getActiveLendersByMarket";
import { HooksKind, FixedTermHooksConfig, PeriodicTermHooksConfig } from "../../src/types";
import { RAY_BIGINT } from "../../src/utils";
import { decodeFunctionData, encodeFunctionResult } from "viem";
import { iPeriodicTermHooksAbi } from "../../src/abi";
import { makeMarket, makeMarketAccount, reviewTimestamp } from "../helpers/review-fixtures";

const periodicMarket = () => {
  const market = makeMarket();
  market.hooksConfig = {
    ...market.hooksConfig!,
    kind: HooksKind.PeriodicTerm,
    queueWithdrawalRequiresAccess: false,
    firstWithdrawalWindowStart: reviewTimestamp - 100,
    periodDuration: 1_000,
    withdrawalWindowDuration: 100,
    periodicTermClosed: false,
    pendingAprChangeAnnualInterestBips: 500,
    pendingAprChangeProposalTimestamp: reviewTimestamp - 200,
    pendingAprChangeResponseWindowStart: reviewTimestamp - 100,
    pendingAprChangeResponseWindowEnd: reviewTimestamp
  } as PeriodicTermHooksConfig;
  return market;
};

describe("term-aware account previews", () => {
  const originalNow = Date.now;
  beforeEach(() => {
    Date.now = () => reviewTimestamp * 1_000;
  });
  afterEach(() => {
    Date.now = originalNow;
  });

  it("refreshes authoritative proposal fields omitted by the lens", async () => {
    const market = periodicMarket();
    const config = market.periodicHooksConfig!;
    config.pendingAprChangeProposalTimestamp = 0;
    market.provider = {
      call: async () => {
        throw Error("Unexpected direct call");
      },
      send: async (method: string, params: unknown[] = []) => {
        expect(method).to.equal("eth_call");
        const call = params[0] as { to: string; data: `0x${string}` };
        expect(call.to).to.equal(config.hooksAddress);
        const decoded = decodeFunctionData({ abi: iPeriodicTermHooksAbi, data: call.data });
        expect(decoded.functionName).to.equal("getPendingAprChange");
        expect(decoded.args).to.deep.equal([market.address]);
        return encodeFunctionResult({
          abi: iPeriodicTermHooksAbi,
          functionName: "getPendingAprChange",
          result: [
            { annualInterestBips: 500, proposalTimestamp: reviewTimestamp - 200 },
            reviewTimestamp - 100,
            reviewTimestamp
          ]
        });
      }
    };
    await market.refreshPendingAprChange();
    expect(market.hooksConfig === config).to.equal(true);
    expect(config.pendingAprChangeProposalTimestamp).to.equal(reviewTimestamp - 200);
    expect(config.pendingAprChangeResponseWindowStart).to.equal(reviewTimestamp - 100);
    expect(config.pendingAprChangeResponseWindowEnd).to.equal(reviewTimestamp);
    expect(makeMarketAccount(market).previewSetAPR(500).status).to.equal(SetAprStatus.Ready);
  });

  it("blocks fixed-term APR reductions until the exact maturity second", () => {
    const market = makeMarket();
    const config = {
      ...market.hooksConfig!,
      kind: HooksKind.FixedTerm,
      fixedTermEndTime: reviewTimestamp + 1,
      allowClosureBeforeTerm: false,
      allowTermReduction: false,
      queueWithdrawalRequiresAccess: false
    } as FixedTermHooksConfig;
    market.hooksConfig = config;
    const account = makeMarketAccount(market);
    expect(account.previewSetAPR(900).status).to.equal(SetAprStatus.DecreaseDuringFixedTerm);
    expect(account.canChangeAPR(900)).to.equal(false);
    expect(account.previewSetAPR(1_100).status).to.equal(SetAprStatus.Ready);
    config.fixedTermEndTime = reviewTimestamp;
    expect(market.isInFixedTerm).to.equal(false);
    expect(account.previewSetAPR(900).status).to.equal(SetAprStatus.Ready);
  });

  it("checks proposal existence, matching APR, response end, expiry and unpaid shares", () => {
    const market = periodicMarket();
    const config = market.periodicHooksConfig!;
    const account = makeMarketAccount(market);
    config.pendingAprChangeProposalTimestamp = 0;
    expect(account.previewSetAPR(500).status).to.equal(SetAprStatus.AprReductionNotProposed);
    config.pendingAprChangeProposalTimestamp = reviewTimestamp - 200;
    expect(account.previewSetAPR(600).status).to.equal(SetAprStatus.AprChangeDoesNotMatchProposal);
    config.pendingAprChangeResponseWindowEnd = reviewTimestamp + 1;
    expect(account.previewSetAPR(500).status).to.equal(SetAprStatus.AprChangeNotReady);
    config.pendingAprChangeResponseWindowEnd = reviewTimestamp;
    Date.now = () => (reviewTimestamp + 900) * 1_000;
    expect(account.previewSetAPR(500).status).to.equal(SetAprStatus.AprChangeExpired);
    Date.now = () => reviewTimestamp * 1_000;
    market.scaledPendingWithdrawals = 1n;
    expect(account.previewSetAPR(500).status).to.equal(SetAprStatus.UnpaidWithdrawalsExist);
  });

  it("keeps periodic reserves unchanged but checks current liquidity coverage", () => {
    const market = periodicMarket();
    const account = makeMarketAccount(market);
    market.totalAssets = market.underlyingToken.getAmount(300_000n * 10n ** 18n);
    expect(account.previewSetAPR(500)).to.deep.equal({
      status: SetAprStatus.Ready,
      willChangeReserveRatio: false,
      willCancelPendingProposal: false
    });
    expect(account.canChangeAPR(500)).to.equal(true);
    market.totalAssets = market.underlyingToken.getAmount(199_999n * 10n ** 18n);
    const preview = account.previewSetAPR(500);
    expect(preview.status).to.equal(SetAprStatus.InsufficientReserves);
    if (preview.status === SetAprStatus.InsufficientReserves)
      expect(preview.newReserveRatio).to.equal(2_000);
  });

  it("retains the periodic cancellation warning on increases and rejects fractional APR", () => {
    const account = makeMarketAccount(periodicMarket());
    expect(account.previewSetAPR(1_100)).to.include({
      status: SetAprStatus.Ready,
      willCancelPendingProposal: true
    });
    expect(account.previewSetAPR(999.5).status).to.equal(SetAprStatus.InvalidApr);
  });

  it("agrees on periodic withdrawal windows for full and basic accounts", () => {
    const market = periodicMarket();
    const config = market.periodicHooksConfig!;
    const account = makeMarketAccount(market);
    const basic = new BasicLenderData({
      market,
      address: account.account,
      scaledBalance: 100n,
      addedTimestamp: 0,
      isKnownLender: true
    });
    const check = (open: boolean) => {
      expect(account.withdrawalAvailability).to.equal(
        open ? QueueWithdrawalStatus.Ready : QueueWithdrawalStatus.WithdrawalWindowClosed
      );
      expect(basic.canWithdraw).to.equal(open);
    };
    check(false);
    Date.now = () => (reviewTimestamp - 100) * 1_000;
    check(true);
    Date.now = () => reviewTimestamp * 1_000;
    config.periodicTermClosed = true;
    check(true);
    config.periodicTermClosed = false;
    market.isClosed = true;
    check(true);
    market.isClosed = false;
    config.flags.useOnQueueWithdrawal = false;
    check(true);
  });
});

describe("lender interest refresh accounting", () => {
  for (const nextShares of [1_000n, 10n, 0n]) {
    it(`marks interest stale instead of applying the new ${nextShares} shares to old interest`, () => {
      const market = makeMarket();
      const account = makeMarketAccount(market, {
        scaledMarketBalance: 100n,
        lastScaleFactor: RAY_BIGINT,
        totalInterestEarned: market.underlyingToken.getAmount(7n)
      });
      market.scaleFactor = (RAY_BIGINT * 11n) / 10n;
      const update = {
        scaledBalance: nextShares,
        normalizedBalance: (nextShares * 11n) / 10n,
        underlyingBalance: 0n,
        underlyingApproval: 0n,
        canRefresh: false,
        isBlockedFromDeposits: false,
        lastApprovalTimestamp: 0,
        lastProvider: {
          providerAddress: "0x0000000000000000000000000000000000000000",
          timeToLive: 0,
          pullProviderIndex: 16_777_215,
          pushProviderIndex: 16_777_215
        },
        isKnownLender: true
      } as any;
      account.updateWith(update);
      expect(account.totalInterestEarned!.raw).to.equal(7n);
      expect((account as any).isInterestAccrualStale).to.equal(true);
      market.scaleFactor = (RAY_BIGINT * 12n) / 10n;
      account.updateWith(update);
      expect(account.totalInterestEarned!.raw).to.equal(7n);
      expect((account as any).isInterestAccrualStale).to.equal(true);
    });
  }

  it("accrues unchanged shares only once and does not subtract on a backwards snapshot", () => {
    const market = makeMarket();
    const account = makeMarketAccount(market, {
      scaledMarketBalance: 100n,
      lastScaleFactor: RAY_BIGINT,
      totalInterestEarned: market.underlyingToken.getAmount(7n)
    });
    market.scaleFactor = (RAY_BIGINT * 11n) / 10n;
    account.processInterestAccrued();
    account.processInterestAccrued();
    expect(account.totalInterestEarned!.raw).to.equal(17n);
    expect((account as any).isInterestAccrualStale).to.equal(false);
    market.scaleFactor = RAY_BIGINT;
    account.processInterestAccrued();
    expect(account.totalInterestEarned!.raw).to.equal(17n);
    expect((account as any).isInterestAccrualStale).to.equal(true);
  });
});
