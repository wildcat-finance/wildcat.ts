import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { Market } from "../../src/market";
import { Token } from "../../src/token";
import { MarketVersion } from "../../src/types";
import {
  SubgraphHooksKind,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketVersion
} from "../../src/gql/graphql";
import {
  MarketDataBaseV2_5StructOutput,
  MarketDataV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2StructOutput
} from "../../src/typechain";
import { bipMul, bipToRay, BIP, SECONDS_IN_365_DAYS } from "../../src/utils";

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

const makeUnifiedMarketDataV2 = (
  hooksFactory: string,
  {
    commitmentFeeBips = { isPresent: false, value: BigNumber.from(0) },
    drawnAmount = { isPresent: false, value: BigNumber.from(0) }
  }: {
    commitmentFeeBips?: { isPresent: boolean; value: BigNumber };
    drawnAmount?: { isPresent: boolean; value: BigNumber };
  } = {}
): MarketDataV2_5StructOutput => ({
  market: makeUnifiedMarketData(hooksFactory),
  commitmentFeeBips,
  drawnAmount
});

const makeSubgraphMarketData = (): Omit<
  SubgraphMarketDataWithEventsFragment,
  "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
> => ({
  __typename: "Market",
  id: makeAddress(70),
  version: SubgraphMarketVersion.V2,
  isRegistered: true,
  isClosed: false,
  borrower: makeAddress(71),
  sentinel: makeAddress(72),
  feeRecipient: makeAddress(73),
  name: "Subgraph Market",
  symbol: "SGM",
  decimals: 18,
  protocolFeeBips: 25,
  delinquencyGracePeriod: 86_400,
  delinquencyFeeBips: 100,
  withdrawalBatchDuration: 86_400,
  numCollateralContracts: 0,
  maxTotalSupply: "10000",
  pendingProtocolFees: "10",
  normalizedUnclaimedWithdrawals: "0",
  scaledTotalSupply: "1000",
  scaledPendingWithdrawals: "0",
  pendingWithdrawalExpiry: "0",
  isDelinquent: false,
  timeDelinquent: 0,
  annualInterestBips: 1200,
  commitmentFeeBips: "175",
  reserveRatioBips: 1000,
  drawnAmount: "250",
  scaleFactor: BigNumber.from(10).pow(27).toString(),
  lastInterestAccruedTimestamp: 1_700_000_000,
  originalAnnualInterestBips: 1200,
  originalReserveRatioBips: 1000,
  temporaryReserveRatioExpiry: 0,
  temporaryReserveRatioActive: false,
  totalBorrowed: "500",
  totalRepaid: "100",
  totalBaseInterestAccrued: "25",
  totalDelinquencyFeesAccrued: "0",
  totalProtocolFeesAccrued: "5",
  totalDeposited: "1000",
  eventIndex: 1,
  controller: null,
  _asset: {
    __typename: "Token",
    id: makeAddress(74),
    address: makeAddress(74),
    name: "Mock USD",
    symbol: "mUSD",
    decimals: 18,
    isMock: false
  },
  hooksConfig: {
    __typename: "HooksConfig",
    id: makeAddress(75),
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
    useOnSetProtocolFeeBips: false,
    depositRequiresAccess: false,
    transferRequiresAccess: false,
    transfersDisabled: false,
    minimumDeposit: "0",
    allowForceBuyBacks: false,
    queueWithdrawalRequiresAccess: false,
    fixedTermEndTime: 0,
    allowClosureBeforeTerm: false,
    allowTermReduction: false
  },
  hooks: {
    __typename: "HooksInstance",
    id: makeAddress(76),
    borrower: makeAddress(71),
    name: "OpenTermHooksInstance",
    kind: SubgraphHooksKind.OpenTerm,
    numMarkets: 1,
    eventIndex: 1,
    hooksTemplate: {
      __typename: "HooksTemplate",
      id: makeAddress(77),
      name: "OpenTermHooks",
      feeRecipient: makeAddress(73),
      protocolFeeBips: 25,
      originationFeeAmount: "0",
      disabled: false,
      originationFeeAsset: null
    },
    providers: []
  },
  deployedEvent: {
    __typename: "MarketDeployed",
    blockNumber: 1,
    blockTimestamp: 1_700_000_000,
    transactionHash: makeAddress(78)
  }
});

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
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("legacy");
    expect(market.hooksConfig?.allowForceBuyBacks).to.equal(true);
  });

  it("hydrates unified v2.5 revolving optional fields when present", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(250) }
      }),
      true
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw.eq(250)).to.equal(true);
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

  it("accepts optional revolving raw fields on the market model", () => {
    const data = makeLegacyMarketData();
    const marketToken = Token.fromTokenMetadata(
      SupportedChainId.Sepolia,
      data.marketToken,
      provider
    );
    const underlyingToken = Token.fromTokenMetadata(
      SupportedChainId.Sepolia,
      data.underlyingToken,
      provider
    );
    const drawnAmount = underlyingToken.getAmount(250);

    const market = new Market({
      provider,
      chainId: SupportedChainId.Sepolia,
      version: MarketVersion.V1,
      marketToken,
      underlyingToken,
      borrower: data.borrower,
      controller: data.controller,
      feeRecipient: data.feeRecipient,
      protocolFeeBips: data.protocolFeeBips.toNumber(),
      delinquencyFeeBips: data.delinquencyFeeBips.toNumber(),
      delinquencyGracePeriod: data.delinquencyGracePeriod.toNumber(),
      withdrawalBatchDuration: data.withdrawalBatchDuration.toNumber(),
      reserveRatioBips: data.reserveRatioBips.toNumber(),
      annualInterestBips: data.annualInterestBips.toNumber(),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: data.originalAnnualInterestBips.toNumber(),
      originalReserveRatioBips: data.originalReserveRatioBips.toNumber(),
      temporaryReserveRatioExpiry: data.temporaryReserveRatioExpiry.toNumber(),
      isClosed: data.isClosed,
      scaleFactor: data.scaleFactor,
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: data.scaledTotalSupply,
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: data.scaledPendingWithdrawals,
      pendingWithdrawalExpiry: data.pendingWithdrawalExpiry.toNumber(),
      isDelinquent: data.isDelinquent,
      timeDelinquent: data.timeDelinquent.toNumber(),
      lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp.toNumber(),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries,
      coverageLiquidity: underlyingToken.getAmount(data.coverageLiquidity),
      commitmentFeeBips: 175,
      drawnAmount
    });

    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.eq(drawnAmount)).to.equal(true);
  });

  it("updates unified v2.5 revolving optional fields when present", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    market.updateWith(
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(200) },
        drawnAmount: { isPresent: true, value: BigNumber.from(300) }
      })
    );

    expect(market.commitmentFeeBips).to.equal(200);
    expect(market.drawnAmount?.raw.eq(300)).to.equal(true);
  });

  it("hydrates subgraph-backed markets with raw revolving fields when present", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      provider,
      makeSubgraphMarketData()
    );

    expect(market.marketType).to.equal(undefined);
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw.eq(250)).to.equal(true);
  });
});

describe("Market revolving APR helpers", () => {
  it("computes exact-current revolving APR metrics from raw SDK state", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(250) }
      }),
      true
    );

    expect(market.currentRevolvingAprMetrics).to.deep.include({
      commitmentFeeBips: 175,
      utilizationBips: 2500,
      utilizationAprBips: 300,
      blendedBaseAprBips: 475,
      protocolAprBips: 1,
      penaltyAprBips: 0,
      effectiveLenderAprBips: 475
    });
    expect(market.currentRevolvingAprMetrics?.drawnAmount.raw.eq(250)).to.equal(true);
  });

  it("clamps revolving utilization math to total supply and includes penalties", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(2_000) }
      }),
      true
    );

    market.timeDelinquent = market.delinquencyGracePeriod + 1;

    expect(market.currentRevolvingAprMetrics).to.deep.include({
      commitmentFeeBips: 175,
      utilizationBips: 10000,
      utilizationAprBips: 1200,
      blendedBaseAprBips: 1375,
      protocolAprBips: 3,
      penaltyAprBips: 100,
      effectiveLenderAprBips: 1475
    });
    expect(market.currentRevolvingAprMetrics?.drawnAmount.raw.eq(2_000)).to.equal(true);
  });

  it("returns no revolving APR metrics when raw revolving state is absent", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    expect(market.currentRevolvingAprMetrics).to.equal(undefined);
  });

  it("normalizes generic effective APR getters for revolving markets", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(250) }
      }),
      true
    );

    const blendedBaseAprRay = bipToRay(475);

    expect(market.effectiveLenderAPR.eq(blendedBaseAprRay)).to.equal(true);
    expect(
      market.effectiveBorrowerAPR.eq(
        bipMul(blendedBaseAprRay, BIP.add(market.protocolFeeBips))
      )
    ).to.equal(true);
  });

  it("normalizes delinquency timing helpers for revolving markets", () => {
    const hooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const revolvingMarket = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(5_000) },
        drawnAmount: { isPresent: true, value: BigNumber.from(1_000) }
      }),
      true
    );
    const legacySemanticsMarket = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    const rawScale = BigNumber.from(10).pow(18);
    const scaledSupply = rawScale.mul(1_000);
    const stressedAssets = rawScale.mul(150);

    revolvingMarket.totalSupply = revolvingMarket.marketToken.getAmount(scaledSupply);
    revolvingMarket.scaledTotalSupply = scaledSupply;
    revolvingMarket.drawnAmount = revolvingMarket.underlyingToken.getAmount(scaledSupply);
    revolvingMarket.totalAssets = revolvingMarket.underlyingToken.getAmount(stressedAssets);

    legacySemanticsMarket.totalSupply = legacySemanticsMarket.marketToken.getAmount(scaledSupply);
    legacySemanticsMarket.scaledTotalSupply = scaledSupply;
    legacySemanticsMarket.totalAssets =
      legacySemanticsMarket.underlyingToken.getAmount(stressedAssets);

    expect(revolvingMarket.secondsBeforeDelinquency).to.be.lessThan(
      legacySemanticsMarket.secondsBeforeDelinquency
    );
    expect(
      revolvingMarket.getSecondsBeforeDelinquencyForBorrowedAmount(
        revolvingMarket.underlyingToken.getAmount(100)
      )
    ).to.be.lessThan(
      legacySemanticsMarket.getSecondsBeforeDelinquencyForBorrowedAmount(
        legacySemanticsMarket.underlyingToken.getAmount(100)
      )
    );
    expect(
      revolvingMarket.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw.gt(
        legacySemanticsMarket.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw
      )
    ).to.equal(true);
  });
});
