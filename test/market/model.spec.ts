import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { Market } from "../../src/market";
import {
  MarketDataBaseV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2StructOutput
} from "../../src/typechain";

const provider = new providers.JsonRpcProvider();

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

const makeTokenMetadata = (suffix: number, name: string, symbol: string) => {
  return {
    token: makeAddress(suffix),
    name,
    symbol,
    decimals: BigNumber.from(18),
    isMock: false
  };
};

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

const makeLegacyMarketData = (): MarketDataStructOutput => {
  const marketToken = makeTokenMetadata(1, "Legacy Market", "LMKT");
  const underlyingToken = makeTokenMetadata(2, "Mock USD", "mUSD");

  return {
    marketToken,
    underlyingToken,
    borrower: makeAddress(3),
    controller: makeAddress(4),
    feeRecipient: makeAddress(5),
    protocolFeeBips: BigNumber.from(25),
    delinquencyFeeBips: BigNumber.from(100),
    delinquencyGracePeriod: BigNumber.from(86_400),
    withdrawalBatchDuration: BigNumber.from(86_400),
    reserveRatioBips: BigNumber.from(1_000),
    annualInterestBips: BigNumber.from(1_200),
    temporaryReserveRatio: false,
    originalAnnualInterestBips: BigNumber.from(1_200),
    originalReserveRatioBips: BigNumber.from(1_000),
    temporaryReserveRatioExpiry: BigNumber.from(0),
    isClosed: false,
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
    coverageLiquidity: BigNumber.from(100),
    borrowableAssets: BigNumber.from(1_000),
    delinquentDebt: BigNumber.from(0)
  };
};

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

const makeUnifiedMarketData = (hooksFactory: string): MarketDataBaseV2_5StructOutput => {
  const data = makeFactoryBackedMarketData(hooksFactory);
  const hooksConfig = {
    hooksAddress: data.hooksConfig.hooksAddress,
    flags: data.hooksConfig.flags,
    kind: data.hooksConfig.kind,
    transferRequiresAccess: data.hooksConfig.transferRequiresAccess,
    depositRequiresAccess: data.hooksConfig.depositRequiresAccess,
    minimumDeposit: data.hooksConfig.minimumDeposit,
    transfersDisabled: data.hooksConfig.transfersDisabled,
    withdrawalRequiresAccess: data.hooksConfig.withdrawalRequiresAccess,
    fixedTermEndTime: data.hooksConfig.fixedTermEndTime,
    allowClosureBeforeTerm: data.hooksConfig.allowClosureBeforeTerm,
    allowTermReduction: data.hooksConfig.allowTermReduction
  };
  return {
    ...data,
    hooksConfig
  } as MarketDataBaseV2_5StructOutput;
};

describe("Market model routing metadata", () => {
  it("leaves legacy lens markets without factory routing metadata", () => {
    const market = Market.fromMarketData(
      SupportedChainId.Sepolia,
      makeLegacyMarketData(),
      provider
    );

    expect(market.hooksFactory).to.equal(undefined);
    expect(market.marketType).to.equal(undefined);
  });

  it("derives legacy marketType from a configured hooks factory address", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactory");
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(hooksFactory)
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("legacy");
  });

  it("preserves unknown hooksFactory addresses while leaving marketType unresolved", () => {
    const unknownHooksFactory = makeAddress(99);
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(unknownHooksFactory)
    );

    expect(market.hooksFactory).to.equal(unknownHooksFactory);
    expect(market.marketType).to.equal(undefined);
  });

  it("hydrates v2.5 market data with compatibility allowForceBuyBacks", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactory");
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketData(hooksFactory),
      true
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("legacy");
    expect(market.hooksConfig?.allowForceBuyBacks).to.equal(true);
  });

  it("refreshes hooksFactory and marketType when v2 market data is updated", () => {
    const legacyHooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactory");
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(legacyHooksFactory)
    );

    const unknownHooksFactory = makeAddress(100);
    market.updateWith(makeFactoryBackedMarketData(unknownHooksFactory));

    expect(market.hooksFactory).to.equal(unknownHooksFactory);
    expect(market.marketType).to.equal(undefined);
  });
});
