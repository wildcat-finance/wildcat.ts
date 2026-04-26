import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "../../src/abi";
import {
  getDeploymentAddress,
  getMarketTypeForHooksFactory,
  SupportedChainId
} from "../../src/constants";
import { Market } from "../../src/market";
import { Token, toRawAmount } from "../../src/token";
import { MarketVersion } from "../../src/types";
import {
  SubgraphHooksKind,
  SubgraphMarketType,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketListDataFragment,
  SubgraphMarketVersion
} from "../../src/gql/graphql";
import {
  MarketDataBaseV2_5StructOutput,
  MarketDataV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2StructOutput,
  MarketLiveDataV2_5StructOutput
} from "../../src/lens-types";
import {
  BIP_BIGINT,
  SECONDS_IN_365_DAYS,
  bipMulBigint,
  bipToRayBigint,
  toNumber
} from "../../src/utils";

const provider = new providers.JsonRpcProvider();
const historicalSepoliaRevolvingFactory = "0xF4564015E524cf5629828E61F45ed339D998D85f";

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

const makeMarketLiveDataV2 = (
  data: MarketDataV2_5StructOutput
): MarketLiveDataV2_5StructOutput => ({
  market: data.market.marketToken.token,
  isClosed: data.market.isClosed,
  protocolFeeBips: data.market.protocolFeeBips,
  reserveRatioBips: data.market.reserveRatioBips,
  annualInterestBips: data.market.annualInterestBips,
  scaleFactor: data.market.scaleFactor,
  totalSupply: data.market.totalSupply,
  maxTotalSupply: data.market.maxTotalSupply,
  scaledTotalSupply: data.market.scaledTotalSupply,
  totalAssets: data.market.totalAssets,
  lastAccruedProtocolFees: data.market.lastAccruedProtocolFees,
  normalizedUnclaimedWithdrawals: data.market.normalizedUnclaimedWithdrawals,
  scaledPendingWithdrawals: data.market.scaledPendingWithdrawals,
  pendingWithdrawalExpiry: data.market.pendingWithdrawalExpiry,
  isDelinquent: data.market.isDelinquent,
  timeDelinquent: data.market.timeDelinquent,
  lastInterestAccruedTimestamp: data.market.lastInterestAccruedTimestamp,
  coverageLiquidity: data.market.coverageLiquidity,
  commitmentFeeBips: data.commitmentFeeBips,
  drawnAmount: data.drawnAmount
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
    factoryHooksTemplate: {
      __typename: "FactoryHooksTemplate",
      id: `${getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving")}-${makeAddress(
        77
      )}`,
      templateAddress: makeAddress(77),
      name: "OpenTermHooks",
      feeRecipient: makeAddress(73),
      protocolFeeBips: 25,
      originationFeeAmount: "0",
      disabled: false,
      originationFeeAsset: null,
      hooksFactory: {
        __typename: "HooksFactory",
        id: getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving"),
        marketType: SubgraphMarketType.Revolving,
        isRegistered: true
      }
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

const makeSubgraphMarketListData = (): SubgraphMarketListDataFragment => {
  const market = { ...makeSubgraphMarketData() };
  const { hooks } = market;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).sentinel;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).totalBorrowed;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).totalRepaid;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).totalBaseInterestAccrued;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).totalDelinquencyFeesAccrued;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).totalProtocolFeesAccrued;
  delete (market as Partial<SubgraphMarketDataWithEventsFragment>).totalDeposited;

  return {
    ...market,
    hooks: hooks
      ? {
          __typename: "HooksInstance",
          id: hooks.id,
          factoryHooksTemplate: hooks.factoryHooksTemplate
        }
      : null
  };
};

describe("Market direct read routing", () => {
  it("hydrates v2.5 market reads through viem and preserves revolving fields", async () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const marketAddress = makeAddress(101);
    const data = makeUnifiedMarketDataV2(hooksFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
      drawnAmount: { isPresent: true, value: BigNumber.from(250) }
    });
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketDataV2");
      expect((decoded.args?.[0] as string).toLowerCase()).to.equal(marketAddress);
      return encodeLensResult(marketLensV2_5Abi as Abi, "getMarketDataV2", data);
    });

    const market = await Market.getMarketV2(
      SupportedChainId.Sepolia,
      marketAddress,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([lensAddress]);
    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
    expect(market.hooksConfig?.allowForceBuyBacks).to.equal(false);
  });

  it("hydrates v2.5 batch market reads through viem", async () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const markets = [makeAddress(102), makeAddress(103)];
    const data = [
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(250) }
      }),
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(200) },
        drawnAmount: { isPresent: true, value: BigNumber.from(300) }
      })
    ];
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketsDataV2");
      expect((decoded.args?.[0] as string[]).map((address) => address.toLowerCase())).to.deep.equal(
        markets
      );
      return encodeLensResult(marketLensV2_5Abi as Abi, "getMarketsDataV2", data);
    });

    const hydratedMarkets = await Market.getMarkets(
      SupportedChainId.Sepolia,
      markets,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([lensAddress]);
    expect(hydratedMarkets.map((market) => market.commitmentFeeBips)).to.deep.equal([175, 200]);
    expect(hydratedMarkets.map((market) => market.drawnAmount?.raw.toString())).to.deep.equal([
      "250",
      "300"
    ]);
  });

  it("falls back from unified reads to the legacy lens through viem", async () => {
    const marketAddress = makeAddress(104);
    const data = makeLegacyMarketData();
    const unifiedLensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const legacyLensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLens");
    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === unifiedLensAddress) {
        throw new Error("NotV2Market");
      }

      const decoded = decodeLensCall(marketLensAbi as Abi, call);
      expect(call.to).to.equal(legacyLensAddress);
      expect(decoded.functionName).to.equal("getMarketData");
      expect((decoded.args?.[0] as string).toLowerCase()).to.equal(marketAddress);
      return encodeLensResult(marketLensAbi as Abi, "getMarketData", data);
    });

    const market = await Market.getMarket(
      SupportedChainId.Sepolia,
      marketAddress,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([
      unifiedLensAddress,
      legacyLensAddress
    ]);
    expect(market.version).to.equal(MarketVersion.V1);
    expect(market.hooksFactory).to.equal(undefined);
  });

  it("falls back from unified reads to the V2 lens through viem", async () => {
    const marketAddress = makeAddress(105);
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactory");
    const data = makeFactoryBackedMarketData(hooksFactory);
    const unifiedLensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const v2LensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2");
    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === unifiedLensAddress) {
        throw new Error("NotV2Market");
      }

      const decoded = decodeLensCall(marketLensV2Abi as Abi, call);
      expect(call.to).to.equal(v2LensAddress);
      expect(decoded.functionName).to.equal("getMarketData");
      expect((decoded.args?.[0] as string).toLowerCase()).to.equal(marketAddress);
      return encodeLensResult(marketLensV2Abi as Abi, "getMarketData", data);
    });

    const market = await Market.getMarketV2(
      SupportedChainId.Sepolia,
      marketAddress,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([
      unifiedLensAddress,
      v2LensAddress
    ]);
    expect(market.version).to.equal(MarketVersion.V2);
    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("legacy");
  });

  it("updates v2.5 market data through viem", async () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const initialData = makeUnifiedMarketDataV2(hooksFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
      drawnAmount: { isPresent: true, value: BigNumber.from(250) }
    });
    const updatedData = makeUnifiedMarketDataV2(hooksFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(200) },
      drawnAmount: { isPresent: true, value: BigNumber.from(300) }
    });
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketDataV2");
      return encodeLensResult(marketLensV2_5Abi as Abi, "getMarketDataV2", updatedData);
    });
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      initialData,
      true
    );

    await market.update();

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([lensAddress]);
    expect(market.commitmentFeeBips).to.equal(200);
    expect(market.drawnAmount?.raw).to.equal(300n);
  });

  it("refreshes existing v2.5 markets through the live list endpoint", async () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const initialData = makeUnifiedMarketDataV2(hooksFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
      drawnAmount: { isPresent: true, value: BigNumber.from(250) }
    });
    const updatedData = makeUnifiedMarketDataV2(hooksFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(200) },
      drawnAmount: { isPresent: true, value: BigNumber.from(300) }
    });
    const marketAddress = initialData.market.marketToken.token.toLowerCase();
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketsLiveDataV2");
      expect((decoded.args?.[0] as string[]).map((address) => address.toLowerCase())).to.deep.equal(
        [marketAddress]
      );
      return encodeLensResult(marketLensV2_5Abi as Abi, "getMarketsLiveDataV2", [
        makeMarketLiveDataV2(updatedData)
      ]);
    });
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      initialData,
      true
    );

    const result = await Market.refreshMarketsV2LiveData(
      SupportedChainId.Sepolia,
      [market],
      viemProvider as unknown as providers.Provider
    );

    expect(result[0]).to.equal(market);
    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([lensAddress]);
    expect(market.commitmentFeeBips).to.equal(200);
    expect(market.drawnAmount?.raw).to.equal(300n);
  });
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

  it("derives marketType from an indexed non-canonical hooks factory address", () => {
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(historicalSepoliaRevolvingFactory)
    );

    expect(
      getMarketTypeForHooksFactory(SupportedChainId.Sepolia, historicalSepoliaRevolvingFactory)
    ).to.equal("revolving");
    expect(market.hooksFactory).to.equal(historicalSepoliaRevolvingFactory);
    expect(market.marketType).to.equal("revolving");
  });

  it("drops stale force-buyback compatibility for legacy factory market data", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactory");
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("legacy");
    expect(market.hooksConfig?.allowForceBuyBacks).to.equal(false);
  });

  it("drops stale force-buyback compatibility for unsupported factories", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const data = makeFactoryBackedMarketData(hooksFactory);
    data.hooksConfig.allowForceBuyBacks = true;

    const market = Market.fromMarketDataV2(SupportedChainId.Sepolia, provider, data);

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketType).to.equal("revolving");
    expect(market.hooksConfig?.allowForceBuyBacks).to.equal(false);
  });

  it("hydrates unified v2.5 revolving optional fields when present", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
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
    expect(market.drawnAmount?.raw).to.equal(250n);
    expect(market.hooksConfig?.allowForceBuyBacks).to.equal(false);
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
      protocolFeeBips: toNumber(data.protocolFeeBips),
      delinquencyFeeBips: toNumber(data.delinquencyFeeBips),
      delinquencyGracePeriod: toNumber(data.delinquencyGracePeriod),
      withdrawalBatchDuration: toNumber(data.withdrawalBatchDuration),
      reserveRatioBips: toNumber(data.reserveRatioBips),
      annualInterestBips: toNumber(data.annualInterestBips),
      temporaryReserveRatio: data.temporaryReserveRatio,
      originalAnnualInterestBips: toNumber(data.originalAnnualInterestBips),
      originalReserveRatioBips: toNumber(data.originalReserveRatioBips),
      temporaryReserveRatioExpiry: toNumber(data.temporaryReserveRatioExpiry),
      isClosed: data.isClosed,
      scaleFactor: toRawAmount(data.scaleFactor),
      totalSupply: marketToken.getAmount(data.totalSupply),
      maxTotalSupply: marketToken.getAmount(data.maxTotalSupply),
      scaledTotalSupply: toRawAmount(data.scaledTotalSupply),
      totalAssets: underlyingToken.getAmount(data.totalAssets),
      lastAccruedProtocolFees: underlyingToken.getAmount(data.lastAccruedProtocolFees),
      normalizedUnclaimedWithdrawals: underlyingToken.getAmount(
        data.normalizedUnclaimedWithdrawals
      ),
      scaledPendingWithdrawals: toRawAmount(data.scaledPendingWithdrawals),
      pendingWithdrawalExpiry: toNumber(data.pendingWithdrawalExpiry),
      isDelinquent: data.isDelinquent,
      timeDelinquent: toNumber(data.timeDelinquent),
      lastInterestAccruedTimestamp: toNumber(data.lastInterestAccruedTimestamp),
      unpaidWithdrawalBatchExpiries: data.unpaidWithdrawalBatchExpiries.map(toNumber),
      coverageLiquidity: underlyingToken.getAmount(data.coverageLiquidity),
      commitmentFeeBips: 175,
      drawnAmount
    });

    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.eq(drawnAmount)).to.equal(true);
  });

  it("updates unified v2.5 revolving optional fields when present", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
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
    expect(market.drawnAmount?.raw).to.equal(300n);
  });

  it("hydrates subgraph-backed markets with raw revolving fields when present", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      provider,
      makeSubgraphMarketData()
    );

    expect(market.marketType).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
  });

  it("hydrates subgraph list markets without record and aggregate payloads", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      provider,
      makeSubgraphMarketListData()
    );

    expect(market.marketType).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
    expect(market.totalBorrowed?.raw).to.equal(0n);
    expect(market.depositRecords).to.deep.equal([]);
  });
});

describe("Market revolving APR helpers", () => {
  it("computes exact-current revolving APR metrics from raw SDK state", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
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
    expect(market.currentRevolvingAprMetrics?.drawnAmount.raw).to.equal(250n);
    expect(market.currentAprDisplayBips).to.deep.include({
      isRevolving: true,
      configuredAprKind: "utilization",
      configuredAprBips: 1200,
      configuredAnnualInterestBips: 1200,
      configuredUtilizationAprBips: 1200,
      commitmentAprBips: 175,
      utilizationBips: 2500,
      currentUtilizationAprBips: 300,
      currentBaseLenderAprBips: 475,
      currentProtocolAprBips: 1,
      currentPenaltyAprBips: 0,
      currentEffectiveLenderAprBips: 475
    });
  });

  it("clamps revolving utilization math to total supply and includes penalties", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
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
    expect(market.currentRevolvingAprMetrics?.drawnAmount.raw).to.equal(2_000n);
  });

  it("returns no revolving APR metrics when raw revolving state is absent", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    expect(market.currentRevolvingAprMetrics).to.equal(undefined);
    expect(market.currentAprDisplayBips).to.deep.include({
      isRevolving: false,
      configuredAprKind: "annualInterest",
      configuredAprBips: 1200,
      configuredAnnualInterestBips: 1200,
      currentBaseLenderAprBips: 1200,
      currentProtocolAprBips: 3,
      currentPenaltyAprBips: 0,
      currentEffectiveLenderAprBips: 1200
    });
  });

  it("normalizes generic effective APR getters for revolving markets", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(250) }
      }),
      true
    );

    const blendedBaseAprRay = bipToRayBigint(475);

    expect(market.effectiveLenderAPR).to.equal(blendedBaseAprRay);
    expect(market.effectiveBorrowerAPR).to.equal(
      bipMulBigint(blendedBaseAprRay, BIP_BIGINT + BigInt(market.protocolFeeBips))
    );
  });

  it("normalizes delinquency timing helpers for revolving markets", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
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

    const rawScale = 10n ** 18n;
    const scaledSupply = rawScale * 1_000n;
    const stressedAssets = rawScale * 150n;

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
      revolvingMarket.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw >
        legacySemanticsMarket.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw
    ).to.equal(true);
  });
});
