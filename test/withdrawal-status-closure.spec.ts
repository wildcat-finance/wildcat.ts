import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { SupportedChainId } from "../src/constants";
import { Market } from "../src/market";
import { MarketDataV2StructOutput, WithdrawalBatchDataStructOutput } from "../src/typechain";
import { BatchStatus, WithdrawalBatch } from "../src/withdrawal-batch";
import { LenderWithdrawalStatus } from "../src/withdrawal-status";

const chainId = SupportedChainId.Sepolia;
const provider = new providers.StaticJsonRpcProvider(undefined, { chainId, name: "sepolia" });

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

const makeTokenMetadata = (suffix: number, name: string, symbol: string) => ({
  token: makeAddress(suffix),
  name,
  symbol,
  decimals: BigNumber.from(18),
  isMock: false
});

const makeHooksFlags = () => ({
  useOnDeposit: false,
  useOnQueueWithdrawal: false,
  useOnExecuteWithdrawal: false,
  useOnTransfer: false,
  useOnBorrow: false,
  useOnRepay: false,
  useOnCloseMarket: false,
  useOnNukeFromOrbit: false,
  useOnSetMaxTotalSupply: false,
  useOnSetAnnualInterestAndReserveRatioBips: false,
  useOnSetProtocolFeeBips: false
});

const makeMarketData = (isClosed: boolean): MarketDataV2StructOutput => {
  const hooksFlags = makeHooksFlags();
  return {
    marketToken: makeTokenMetadata(7, "Hooks Market", "HMKT"),
    underlyingToken: makeTokenMetadata(8, "Mock USD", "mUSD"),
    hooksFactory: makeAddress(5),
    borrower: makeAddress(9),
    hooksConfig: {
      hooksAddress: makeAddress(10),
      flags: hooksFlags,
      kind: 1,
      transferRequiresAccess: false,
      depositRequiresAccess: false,
      minimumDeposit: BigNumber.from(0),
      transfersDisabled: false,
      allowForceBuyBacks: false,
      withdrawalRequiresAccess: false,
      fixedTermEndTime: 0,
      allowClosureBeforeTerm: false,
      allowTermReduction: false
    },
    withdrawalBatchDuration: BigNumber.from(86_400),
    feeRecipient: makeAddress(11),
    delinquencyFeeBips: BigNumber.from(100),
    delinquencyGracePeriod: BigNumber.from(86_400),
    hooks: {
      hooksAddress: makeAddress(10),
      borrower: makeAddress(9),
      name: "OpenTermHooksInstance",
      kind: 1,
      hooksTemplate: {
        hooksTemplate: makeAddress(12),
        fees: {
          feeRecipient: makeAddress(11),
          protocolFeeBips: 25,
          originationFeeToken: makeTokenMetadata(6, "Origination Token", "ORIG"),
          originationFeeAmount: BigNumber.from(0),
          borrowerOriginationFeeBalance: BigNumber.from(0),
          borrowerOriginationFeeApproval: BigNumber.from(0)
        },
        exists: true,
        enabled: true,
        index: 0,
        name: "OpenTermHooks",
        totalMarkets: BigNumber.from(1)
      },
      constraints: {
        minimumDelinquencyGracePeriod: 0,
        maximumDelinquencyGracePeriod: 90 * 86_400,
        minimumReserveRatioBips: 0,
        maximumReserveRatioBips: 10_000,
        minimumDelinquencyFeeBips: 0,
        maximumDelinquencyFeeBips: 10_000,
        minimumWithdrawalBatchDuration: 0,
        maximumWithdrawalBatchDuration: 365 * 86_400,
        minimumAnnualInterestBips: 0,
        maximumAnnualInterestBips: 10_000
      },
      deploymentFlags: {
        optional: hooksFlags,
        required: hooksFlags
      },
      pullProviders: [],
      pushProviders: [],
      totalMarkets: BigNumber.from(1)
    },
    temporaryReserveRatio: false,
    originalAnnualInterestBips: BigNumber.from(1_200),
    originalReserveRatioBips: BigNumber.from(1_000),
    temporaryReserveRatioExpiry: BigNumber.from(0),
    isClosed,
    protocolFeeBips: BigNumber.from(25),
    reserveRatioBips: BigNumber.from(1_000),
    annualInterestBips: BigNumber.from(1_200),
    scaleFactor: BigNumber.from(10).pow(27),
    totalSupply: BigNumber.from(1_000),
    maxTotalSupply: BigNumber.from(10_000),
    scaledTotalSupply: BigNumber.from(1_000),
    totalAssets: BigNumber.from(1_100),
    lastAccruedProtocolFees: BigNumber.from(10),
    normalizedUnclaimedWithdrawals: BigNumber.from(0),
    scaledPendingWithdrawals: BigNumber.from(0),
    pendingWithdrawalExpiry: BigNumber.from(0),
    isDelinquent: false,
    timeDelinquent: BigNumber.from(0),
    lastInterestAccruedTimestamp: BigNumber.from(1_700_000_000),
    unpaidWithdrawalBatchExpiries: [],
    coverageLiquidity: BigNumber.from(100)
  };
};

// A batch that was pending when the market closed early: its scheduled expiry is
// still in the future, but closeMarket paid it in full. The lens reports it as
// Pending because the lens status is purely timestamp-based.
const makeFutureFullyPaidBatchData = (): WithdrawalBatchDataStructOutput => ({
  expiry: Math.floor(Date.now() / 1000) + 3_600,
  status: BatchStatus.Pending,
  scaledTotalAmount: BigNumber.from(100),
  scaledAmountBurned: BigNumber.from(100),
  normalizedAmountPaid: BigNumber.from(100),
  normalizedTotalAmount: BigNumber.from(100)
});

const makeLenderStatus = (normalizedAmountWithdrawn: number) => ({
  lender: makeAddress(31),
  scaledAmount: BigNumber.from(25),
  normalizedAmountWithdrawn: BigNumber.from(normalizedAmountWithdrawn),
  normalizedAmountOwed: BigNumber.from(25 - normalizedAmountWithdrawn),
  availableWithdrawalAmount: BigNumber.from(25 - normalizedAmountWithdrawn)
});

describe("Lender withdrawal completion", () => {
  it("treats fully claimed future-expiry batches as completed after market closure", () => {
    const market = Market.fromMarketDataV2(chainId, provider, makeMarketData(true));
    const batchData = makeFutureFullyPaidBatchData();
    const batch = WithdrawalBatch.fromWithdrawalBatchData(market, batchData);
    const lenderStatus = makeLenderStatus(25);
    const withdrawal = LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      batch,
      lenderStatus
    );

    expect(batch.status).to.equal(BatchStatus.Pending);
    expect(batch.effectiveStatus).to.equal(BatchStatus.Complete);
    expect(withdrawal.isCompleted).to.equal(true);

    // Mirrors the app refresh from a stale incomplete flag: a lens update is applied
    // to the batch and the lender status, and the result must come out completed.
    withdrawal.isCompleted = false;
    batch.applyLensUpdate(batchData);
    withdrawal.updateWith(lenderStatus);

    expect(batch.status).to.equal(BatchStatus.Pending);
    expect(withdrawal.isCompleted).to.equal(true);
  });

  it("keeps a partially claimed withdrawal in a closed market incomplete", () => {
    const market = Market.fromMarketDataV2(chainId, provider, makeMarketData(true));
    const batch = WithdrawalBatch.fromWithdrawalBatchData(market, makeFutureFullyPaidBatchData());
    const lenderStatus = makeLenderStatus(10);
    const withdrawal = LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      batch,
      lenderStatus
    );

    expect(withdrawal.isCompleted).to.equal(false);
    withdrawal.updateWith(lenderStatus);
    expect(withdrawal.isCompleted).to.equal(false);
  });

  it("keeps a future-expiry batch in an open market incomplete", () => {
    const market = Market.fromMarketDataV2(chainId, provider, makeMarketData(false));
    const batch = WithdrawalBatch.fromWithdrawalBatchData(market, makeFutureFullyPaidBatchData());
    const lenderStatus = makeLenderStatus(0);
    const withdrawal = LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      batch,
      lenderStatus
    );

    expect(batch.effectiveStatus).to.equal(BatchStatus.Pending);
    expect(withdrawal.isCompleted).to.equal(false);
    withdrawal.updateWith(lenderStatus);
    expect(withdrawal.isCompleted).to.equal(false);
  });

  it("does not divide by zero for an empty concluded batch", () => {
    const market = Market.fromMarketDataV2(chainId, provider, makeMarketData(true));
    const batch = WithdrawalBatch.fromWithdrawalBatchData(market, {
      expiry: 1_700_000_123,
      status: BatchStatus.Complete,
      scaledTotalAmount: BigNumber.from(0),
      scaledAmountBurned: BigNumber.from(0),
      normalizedAmountPaid: BigNumber.from(0),
      normalizedTotalAmount: BigNumber.from(0)
    });
    const lenderStatus = {
      ...makeLenderStatus(0),
      scaledAmount: BigNumber.from(0),
      normalizedAmountOwed: BigNumber.from(0),
      availableWithdrawalAmount: BigNumber.from(0)
    };
    const withdrawal = LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      batch,
      lenderStatus
    );

    expect(withdrawal.isCompleted).to.equal(false);
    withdrawal.updateWith(lenderStatus);
    expect(withdrawal.isCompleted).to.equal(false);
  });
});
