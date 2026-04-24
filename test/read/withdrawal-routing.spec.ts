import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { marketLensV2_5Abi } from "../../src/abi";
import * as constantsModule from "../../src/constants";
import { Market } from "../../src/market";
import { WithdrawalBatch, BatchStatus } from "../../src/withdrawal-batch";
import { LenderWithdrawalStatus } from "../../src/withdrawal-status";
import { MarketDataV2StructOutput } from "../../src/typechain";

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

type FakeRpcCall = {
  to?: string;
  data?: string;
};

class FakeViemProvider {
  calls: FakeRpcCall[] = [];

  constructor(private readonly getResponse: (call: FakeRpcCall) => string) {}

  async send(method: string, params: unknown[] = []): Promise<unknown> {
    if (method === "eth_chainId") {
      return "0xaa36a7";
    }
    if (method !== "eth_call") {
      throw new Error(`Unexpected RPC method: ${method}`);
    }

    const call = params[0] as FakeRpcCall;
    this.calls.push(call);
    return this.getResponse(call);
  }
}

const toViemResult = (value: unknown): unknown => {
  if (BigNumber.isBigNumber(value)) {
    return BigInt(value.toString());
  }
  if (Array.isArray(value)) {
    return value.map(toViemResult);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toViemResult(entry)])
    );
  }
  return value;
};

const encodeLensResult = (abi: Abi, functionName: string, result: unknown): `0x${string}` => {
  return encodeFunctionResult({
    abi,
    functionName,
    result: toViemResult(result)
  });
};

const decodeLensCall = (abi: Abi, call: FakeRpcCall) => {
  return decodeFunctionData({
    abi,
    data: call.data as `0x${string}`
  });
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

const makeFactoryBackedMarketData = (hooksFactory: string): MarketDataV2StructOutput => {
  const originationFeeToken = makeTokenMetadata(6, "Origination Token", "ORIG");
  const marketToken = makeTokenMetadata(7, "Hooks Market", "HMKT");
  const underlyingToken = makeTokenMetadata(8, "Mock USD", "mUSD");
  const hooksFlags = makeHooksFlags();

  return {
    marketToken,
    underlyingToken,
    hooksFactory,
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
          originationFeeToken,
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
    isClosed: false,
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

const makeWithdrawalBatchData = () => ({
  expiry: 1_700_000_123,
  status: BatchStatus.Unpaid,
  scaledTotalAmount: BigNumber.from(100),
  scaledAmountBurned: BigNumber.from(60),
  normalizedAmountPaid: BigNumber.from(40),
  normalizedTotalAmount: BigNumber.from(70)
});

const makeWithdrawalBatchLenderStatus = (lender: string) => ({
  lender,
  scaledAmount: BigNumber.from(25),
  normalizedAmountWithdrawn: BigNumber.from(10),
  normalizedAmountOwed: BigNumber.from(15),
  availableWithdrawalAmount: BigNumber.from(5)
});

describe("Withdrawal read routing", () => {
  it("uses the latest lens for V2 withdrawal batch reads", async () => {
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactory"
    );
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const marketData = makeFactoryBackedMarketData(hooksFactory);
    const marketAddress = marketData.marketToken.token;
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getWithdrawalBatchData");
      expect((decoded.args as [string, number])[0].toLowerCase()).to.equal(marketAddress);
      expect((decoded.args as [string, number])[1]).to.equal(1_700_000_123);

      return encodeLensResult(
        marketLensV2_5Abi as Abi,
        "getWithdrawalBatchData",
        makeWithdrawalBatchData()
      );
    });

    const market = Market.fromMarketDataV2(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      marketData
    );

    const batch = await WithdrawalBatch.getWithdrawalBatch(market, 1_700_000_123);

    expect(batch.market).to.equal(market);
    expect(batch.expiry).to.equal(1_700_000_123);
    expect(batch.status).to.equal(BatchStatus.Unpaid);
  });

  it("uses the latest lens for V2 lender withdrawal reads", async () => {
    const lender = makeAddress(30);
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactory"
    );
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const marketData = makeFactoryBackedMarketData(hooksFactory);
    const marketAddress = marketData.marketToken.token;
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getWithdrawalBatchDataWithLenderStatus");
      expect((decoded.args as [string, number, string])[0].toLowerCase()).to.equal(marketAddress);
      expect((decoded.args as [string, number, string])[1]).to.equal(1_700_000_123);
      expect((decoded.args as [string, number, string])[2].toLowerCase()).to.equal(lender);

      return encodeLensResult(marketLensV2_5Abi as Abi, "getWithdrawalBatchDataWithLenderStatus", {
        batch: makeWithdrawalBatchData(),
        lenderStatus: makeWithdrawalBatchLenderStatus(lender)
      });
    });

    const market = Market.fromMarketDataV2(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      marketData
    );

    const withdrawal = await LenderWithdrawalStatus.getWithdrawalForLender(
      market,
      1_700_000_123,
      lender
    );

    expect(withdrawal.market).to.equal(market);
    expect(withdrawal.lender).to.equal(lender);
    expect(withdrawal.normalizedAmountOwed.raw.toString()).to.equal("15");
  });
});
