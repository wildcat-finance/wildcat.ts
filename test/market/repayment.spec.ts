import { expect } from "chai";
import { decodeFunctionData, encodeFunctionData } from "viem";
import { print } from "graphql";
import {
  BatchStatus,
  DepositStatus,
  QueueWithdrawalStatus,
  RecoverUnderlyingStatus,
  SupportedChainId,
  DeployMarketStatus,
  getRepaymentTermsStatus,
  getHooksFactoryDeploymentAbi,
  wildcatMarketV2_5Abi,
  WithdrawalBatch,
  HooksKind
} from "../../src";
import { withFactoryRepaymentTerms } from "../../src/access/repayment";
import { normalizeIndexedLifecycle } from "../../src/gql/normalizers";
import { legacyWithdrawalDocument } from "../../src/gql/legacy-withdrawal-document";
import {
  GetAllPendingWithdrawalBatchesForMarketDocument,
  SubgraphWithdrawalBatchPropertiesWithEventsFragment
} from "../../src/gql/graphql";
import { makeMarket, makeMarketAccount, makeAddress } from "../helpers/review-fixtures";
import { RAY_BIGINT as RAY } from "../../src/utils";
import { MarketLiveDataV2_5StructOutput } from "../../src/lens-types";
import fixture from "../fixtures/v2.5.5-historical-sepolia-periodic-market.json";

describe("V2.5.5 repayment accounting", () => {
  it("preserves unsupported, unscheduled and recorded lifecycle values", () => {
    expect(normalizeIndexedLifecycle({ repaymentDate: null }).repaymentDate).to.equal(undefined);
    expect(normalizeIndexedLifecycle({ repaymentDate: "0", defaultedAt: "0" })).to.include({
      repaymentDate: 0,
      defaultedAt: 0
    });
    const market = makeMarket();
    expect(market.hasRecordedDefault).to.equal(undefined);
    market.defaultedAt = 123;
    market.isClosed = true;
    expect(market.hasRecordedDefault).to.equal(true);
    expect(market.isInRepayment).to.equal(false);
  });

  it("includes aggregate carry above one ray in debt without inflating ERC20 supply", () => {
    const market = makeMarket({
      scaleFactor: (RAY * 14n) / 10n,
      scaledTotalSupply: 1n,
      withdrawalRemainder: (RAY * 24n) / 10n
    });
    market.totalSupply = market.marketToken.getAmount(1);
    expect(market.totalDebts.raw).to.equal(4n);
    expect(market.totalSupply.raw).to.equal(1n);
  });

  it("enters repayment at the read timestamp, blocks deposits/draws and ignores penalty grace", () => {
    const market = makeMarket({
      repaymentDate: 100,
      repaymentPeriod: 60,
      repaymentDeadline: 160,
      lastInterestAccruedTimestamp: 100,
      timeDelinquent: 0,
      delinquencyGracePeriod: 86400
    });
    market.totalAssets = market.underlyingToken.getAmount(0);
    expect(market.isInRepayment).to.equal(true);
    expect(market.maximumDeposit.raw).to.equal(0n);
    expect(market.borrowableAssets.raw).to.equal(0n);
    expect(market.isIncurringPenalties).to.equal(true);
    const account = makeMarketAccount(market);
    expect(account.depositAvailability).to.equal(DepositStatus.MarketInRepayment);
    market.hooksConfig!.depositRequiresAccess = true;
    market.hooksConfig!.flags.useOnQueueWithdrawal = true;
    account.isKnownLender = false;
    account.credential = undefined;
    expect(account.withdrawalAvailability).to.equal(QueueWithdrawalStatus.Ready);
    market.lastInterestAccruedTimestamp = 99;
    expect(market.isInRepayment).to.equal(false);
    expect(market.isIncurringPenalties).to.equal(false);
    expect(account.withdrawalAvailability).to.equal(QueueWithdrawalStatus.RequiresAccess);
  });

  it("uses exact lens liquidity and closes periodic state during compact hydration", () => {
    const market = makeMarket({ repaymentDate: 100, defaultedAt: 160, withdrawalRemainder: RAY });
    market.hooksConfig = {
      ...market.hooksConfig!,
      kind: HooksKind.PeriodicTerm,
      queueWithdrawalRequiresAccess: true,
      firstWithdrawalWindowStart: 200,
      periodDuration: 100,
      withdrawalWindowDuration: 30,
      periodicTermClosed: false,
      pendingAprChangeAnnualInterestBips: 500,
      pendingAprChangeProposalTimestamp: 50,
      pendingAprChangeResponseWindowStart: 200,
      pendingAprChangeResponseWindowEnd: 230
    };
    const live: MarketLiveDataV2_5StructOutput = {
      ...fixture.live,
      market: market.address,
      isClosed: true,
      totalAssets: 1100,
      totalSupply: 999,
      annualInterestBips: 0,
      reserveRatioBips: 10000,
      coverageLiquidity: 1001,
      lastInterestAccruedTimestamp: 170,
      lifecycle: {
        isPresent: true,
        repaymentDate: 100,
        repaymentPeriod: 60,
        repaymentDeadline: 160,
        defaultedAt: 160,
        isInRepayment: false
      },
      liquidity: {
        maximumDeposit: 0,
        borrowableAssets: 0,
        totalDebts: 1001,
        recoverableUnderlying: 99
      }
    };
    market.updateWithLiveData(live);
    expect(market.totalDebts.raw).to.equal(1001n);
    expect(market.recoverableUnderlying.raw).to.equal(99n);
    expect(market.hasRecordedDefault).to.equal(true);
    expect(market.withdrawalRemainder).to.equal(undefined);
    expect(market.periodicHooksConfig).to.include({
      periodicTermClosed: true,
      pendingAprChangeProposalTimestamp: 0
    });
    expect(market.isIncurringPenalties).to.equal(false);
    expect(market.borrowableAssets.raw).to.equal(0n);
    const breakdown = market.getTotalDebtBreakdown();
    expect(breakdown.status).to.equal("healthy");
    if (breakdown.status === "healthy") {
      expect(breakdown.borrowable.raw).to.equal(0n);
      expect(breakdown.borrowed.raw).to.equal(0n);
    }
    const account = makeMarketAccount(market);
    expect(account.previewRecoverUnderlying().status).to.equal(RecoverUnderlyingStatus.Ready);
    const tx = account.populateRecoverUnderlying();
    const decoded = decodeFunctionData({
      abi: wildcatMarketV2_5Abi,
      data: tx.data as `0x${string}`
    });
    expect(decoded.functionName).to.equal("rescueTokens");
    expect(decoded.args).to.deep.equal([market.asset]);
    market.stateSource = "indexed";
    expect(account.previewRecoverUnderlying().status).to.equal(
      RecoverUnderlyingStatus.LiveDataRequired
    );
  });

  it("values remaining batch shares with carry, but does not pay a completed batch's fraction", () => {
    const market = makeMarket({ scaleFactor: (RAY * 14n) / 10n });
    const batch = {
      expiry: "1",
      scaledTotalAmount: "3",
      scaledAmountBurned: "2",
      normalizedAmountPaid: "3",
      paymentRemainder: ((RAY * 4n) / 10n).toString(),
      lastScaleFactor: RAY.toString(),
      totalInterestEarned: "0",
      paymentsCount: 0,
      lastUpdatedTimestamp: 1,
      isCompleted: false
    } as SubgraphWithdrawalBatchPropertiesWithEventsFragment;
    const pending = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, batch);
    expect(pending.normalizedTotalAmount.raw).to.equal(5n);
    const paid = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, {
      ...batch,
      scaledAmountBurned: "3"
    });
    expect(paid.normalizedTotalAmount.raw).to.equal(3n);
    expect(paid.status).to.equal(BatchStatus.Complete);
  });

  it("keeps carry constant when calculating batch interest", () => {
    const market = makeMarket({ scaleFactor: (RAY * 12n) / 10n });
    const batch = new WithdrawalBatch(
      market,
      1,
      BatchStatus.Unpaid,
      1n,
      0n,
      market.underlyingToken.getAmount(0),
      market.underlyingToken.getAmount(2),
      RAY,
      0,
      1,
      market.underlyingToken.getAmount(0),
      false,
      [],
      [],
      [],
      [],
      (RAY * 4n) / 10n
    );
    batch.processWithdrawalBatchInterestAccrued();
    expect(batch.totalInterestEarned!.raw).to.equal(1n);
    expect(batch.paymentRemainder).to.equal((RAY * 4n) / 10n);
  });

  it("omits carry from legacy queries while selecting it for V2.5", () => {
    expect(print(GetAllPendingWithdrawalBatchesForMarketDocument)).to.contain("paymentRemainder");
    expect(
      print(legacyWithdrawalDocument(GetAllPendingWithdrawalBatchesForMarketDocument))
    ).not.to.contain("paymentRemainder");
  });
});

describe("V2.5.5 deployment terms", () => {
  it("rejects inconsistent, past, overflowing and unsupported schedules", () => {
    for (const [date, period] of [
      [0, 1],
      [99, 0],
      [100, 0],
      [0xffff_ffff, 1],
      [101, -1],
      [101.5, 0]
    ]) {
      expect(getRepaymentTermsStatus(SupportedChainId.Sepolia, date, period, 100)).to.equal(
        DeployMarketStatus.InvalidRepaymentTerms
      );
    }
    expect(getRepaymentTermsStatus(SupportedChainId.Sepolia, 0, 0, 100)).to.equal(undefined);
    expect(getRepaymentTermsStatus(SupportedChainId.Sepolia, 101, 0, 100)).to.equal(undefined);
    expect(getRepaymentTermsStatus(SupportedChainId.Mainnet, 101, 0, 100)).to.equal(
      DeployMarketStatus.RepaymentTermsUnsupported
    );
  });

  for (const kind of ["standard", "revolving"] as const) {
    it(`encodes the new ${kind} tuple and defaults omitted terms to zero`, () => {
      const abi = getHooksFactoryDeploymentAbi(SupportedChainId.Sepolia, kind);
      const parameters = {
        asset: makeAddress(1),
        namePrefix: "",
        symbolPrefix: "",
        maxTotalSupply: 100n,
        annualInterestBips: 1000,
        delinquencyFeeBips: 200,
        withdrawalBatchDuration: 100,
        reserveRatioBips: 2000,
        delinquencyGracePeriod: 100,
        hooks: 0n
      };
      const args = [
        parameters,
        "0x",
        ...(kind === "revolving" ? ["0x"] : []),
        `0x${"00".repeat(32)}`,
        makeAddress(0),
        0n
      ];
      const data = encodeFunctionData({
        abi,
        functionName: "deployMarket",
        args: withFactoryRepaymentTerms(SupportedChainId.Sepolia, "deployMarket", args)
      });
      const decoded = decodeFunctionData({ abi, data });
      expect(decoded.args![0]).to.include({ repaymentDate: 0, repaymentPeriod: 0 });
    });
  }
});
