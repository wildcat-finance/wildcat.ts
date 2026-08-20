import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "../../src/abi";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { Market } from "../../src/market";
import { MarketAccount } from "../../src/account";
import { Token, toRawAmount } from "../../src/token";
import { HooksKind, MarketOnboardingMode, MarketVersion } from "../../src/types";
import {
  SubgraphFactoryLifecycle,
  SubgraphHookedMarketAbi,
  SubgraphHooksFactoryDataFragment,
  SubgraphHooksKind,
  SubgraphAccountDataForLenderListViewFragment,
  SubgraphLenderStatus,
  SubgraphGetMarketListQuery,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketKind,
  SubgraphMarketOriginKind,
  SubgraphMarketSnapshotDataFragment,
  SubgraphSnapshotSource,
  SubgraphMarketVersion,
  SubgraphRoleProviderKind
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
const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

const makeSubgraphHooksFactory = (
  address = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving")
): SubgraphHooksFactoryDataFragment => ({
  __typename: "HooksFactory",
  id: address,
  address,
  label: "revolving-v2.5",
  sentinel: makeAddress(72),
  marketKind: SubgraphMarketKind.REVOLVING,
  generation: "v2.5",
  abiFamily: "hooks-shared-current",
  hookedMarketAbi: SubgraphHookedMarketAbi.BASE,
  configuredStartBlock: "1",
  indexed: true,
  deploymentTarget: true,
  lifecycle: SubgraphFactoryLifecycle.ACTIVE,
  configured: true,
  isRegistered: true,
  registrationUpdatedAtBlock: "1",
  registrationUpdatedAtTimestamp: "1700000000",
  archController: {
    __typename: "ArchController",
    id: getDeploymentAddress(SupportedChainId.Sepolia, "WildcatArchController")
  }
});

type FakeRpcCall = {
  to?: string;
  data?: string;
};

class FakeViemProvider {
  calls: FakeRpcCall[] = [];
  private readonly getResponse: (call: FakeRpcCall) => string;

  constructor(getResponse: (call: FakeRpcCall) => string) {
    this.getResponse = getResponse;
  }

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
  useOnSetProtocolFeeBips: false,
  useOnExecutePendingAnnualInterestBipsReduction: false
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
      allowTermReduction: false,
      firstWithdrawalWindowStart: 0,
      periodDuration: 0,
      withdrawalWindowDuration: 0,
      periodicTermClosed: false
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
  return {
    ...data,
    hooksConfig: {
      ...data.hooksConfig,
      flags: {
        ...data.hooksConfig.flags,
        useOnExecutePendingAnnualInterestBipsReduction: false
      }
    },
    hooks: {
      ...data.hooks,
      administrator: data.hooks.borrower,
      pendingAdministrator: makeAddress(0),
      deploymentFlags: {
        optional: {
          ...data.hooks.deploymentFlags.optional,
          useOnExecutePendingAnnualInterestBipsReduction: false
        },
        required: {
          ...data.hooks.deploymentFlags.required,
          useOnExecutePendingAnnualInterestBipsReduction: false
        }
      },
      pullProviders: [],
      pushProviders: []
    }
  };
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
  borrowerPrincipal: makeAddress(9),
  pendingBorrower: makeAddress(0),
  pendingBorrowerPrincipal: makeAddress(0),
  borrowerIdentityRegistry: makeAddress(92),
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

const makeSubgraphMarketSnapshot = (): SubgraphMarketSnapshotDataFragment => ({
  __typename: "MarketSnapshot",
  source: SubgraphSnapshotSource.EVENT_PROJECTION,
  isClosed: false,
  maxTotalSupply: "10000",
  protocolFeeBips: 25,
  pendingProtocolFees: "10",
  normalizedUnclaimedWithdrawals: "0",
  scaledTotalSupply: "1000",
  scaledPendingWithdrawals: "0",
  pendingWithdrawalExpiry: "0",
  isDelinquent: false,
  isIncurringPenalties: false,
  timeDelinquent: 0,
  annualInterestBips: 1200,
  commitmentFeeBips: "175",
  reserveRatioBips: 1000,
  drawnAmount: "250",
  scaleFactor: BigNumber.from(10).pow(27).toString(),
  lastInterestAccruedTimestamp: 1_700_000_000,
  lastInterestAccruedBlockNumber: 123,
  originalAnnualInterestBips: 1200,
  originalReserveRatioBips: 1000,
  temporaryReserveRatioExpiry: 0,
  temporaryReserveRatioActive: false,
  updatedAtBlock: "123",
  updatedAtTimestamp: "1700000123",
  updatedAtTransaction: makeAddress(79),
  updatedAtLogIndex: "4"
});

const makeSubgraphMarketData = (): Omit<
  SubgraphMarketDataWithEventsFragment,
  "depositRecords" | "repaymentRecords" | "borrowRecords" | "feeCollectionRecords"
> => ({
  __typename: "Market",
  id: makeAddress(70),
  address: makeAddress(70),
  version: SubgraphMarketVersion.V2,
  marketKind: SubgraphMarketKind.REVOLVING,
  originKind: SubgraphMarketOriginKind.HOOKS,
  generation: "v2.5",
  abiFamily: "market-v2.5",
  archController: {
    __typename: "ArchController",
    id: getDeploymentAddress(SupportedChainId.Sepolia, "WildcatArchController")
  },
  hooksFactory: makeSubgraphHooksFactory(),
  isRegistered: true,
  isClosed: false,
  borrower: makeAddress(71),
  borrowerPrincipal: makeAddress(71),
  pendingBorrower: null,
  pendingBorrowerPrincipal: null,
  borrowerIdentityRegistryAddress: makeAddress(92),
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
  createdAtBlock: "1",
  createdAtTimestamp: "1700000000",
  createdAtTransaction: makeAddress(78),
  createdAtLogIndex: "0",
  snapshot: makeSubgraphMarketSnapshot(),
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
    allowTermReduction: false,
    firstWithdrawalWindowStart: 0,
    periodDuration: 0,
    withdrawalWindowDuration: 0,
    periodicTermClosed: false,
    pendingAprChangeAnnualInterestBips: 0,
    pendingAprChangeProposalTimestamp: 0,
    pendingAprChangeResponseWindowStart: 0,
    pendingAprChangeResponseWindowEnd: 0
  },
  hooks: {
    __typename: "HooksInstance",
    id: makeAddress(76),
    address: makeAddress(76),
    borrower: makeAddress(71),
    administrator: makeAddress(71),
    pendingAdministrator: null,
    name: "OpenTermHooksInstance",
    kind: SubgraphHooksKind.OpenTerm,
    marketKind: SubgraphMarketKind.REVOLVING,
    generation: "v2.5",
    abiFamily: "hooks-shared-current",
    numMarkets: 1,
    eventIndex: 1,
    hooksTemplate: {
      __typename: "HooksTemplate",
      id: makeAddress(77),
      address: makeAddress(77),
      kind: SubgraphHooksKind.OpenTerm,
      version: "v2.5",
      abiFamily: "hooks-shared-current"
    },
    templateRegistration: {
      __typename: "HooksTemplateRegistration",
      id: `${getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving")}-${makeAddress(
        77
      )}`,
      templateAddress: makeAddress(77),
      name: "OpenTermHooks",
      feeRecipient: makeAddress(73),
      protocolFeeBips: 25,
      originationFeeAmount: "0",
      isEnabled: true,
      originationFeeAsset: null,
      createdAtBlock: "1",
      createdAtTimestamp: "1700000000",
      createdAtTransaction: makeAddress(78),
      createdAtLogIndex: "0",
      updatedAtBlock: "1",
      updatedAtTimestamp: "1700000000",
      updatedAtTransaction: makeAddress(78),
      updatedAtLogIndex: "0",
      hooksTemplate: {
        __typename: "HooksTemplate",
        id: makeAddress(77),
        address: makeAddress(77),
        kind: SubgraphHooksKind.OpenTerm,
        version: "v2.5",
        abiFamily: "hooks-shared-current"
      },
      hooksFactory: makeSubgraphHooksFactory()
    },
    hooksFactory: makeSubgraphHooksFactory(),
    providers: []
  },
  deployedEvent: {
    __typename: "MarketDeployed",
    blockNumber: 1,
    blockTimestamp: 1_700_000_000,
    transactionHash: makeAddress(78)
  },
  periodicTermUpdatedRecords: [],
  periodicTermClosedRecord: null,
  annualInterestBipsReductionProposalRecords: []
});

const makeSubgraphMarketListData = (): SubgraphGetMarketListQuery["markets"][number] => {
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
    latestDeposit: [
      {
        __typename: "Deposit",
        blockTimestamp: 1_750_000_000
      }
    ],
    hooks: hooks
      ? {
          __typename: "HooksInstance",
          id: hooks.id,
          templateRegistration: hooks.templateRegistration
        }
      : null
  };
};

const expectAllowForceBuyBacks = (market: Market, expected: boolean): void => {
  if (!market.hooksConfig || market.hooksConfig.kind === HooksKind.PeriodicTerm) {
    throw new Error("Expected force-buyback-capable hooks config");
  }
  expect(market.hooksConfig.allowForceBuyBacks).to.equal(expected);
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
    expect(market.marketKind).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
    expectAllowForceBuyBacks(market, false);
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
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
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
    expect(market.marketKind).to.equal("standard");
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
    updatedData.market.hooksConfig.flags.useOnExecutePendingAnnualInterestBipsReduction = true;
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
    expect(market.hooksConfig?.flags.useOnExecutePendingAnnualInterestBipsReduction).to.equal(true);
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

  it("hydrates mixed indexed market generations through explicit live batch reads", async () => {
    const legacyData = makeLegacyMarketData();
    const legacyUpdate = { ...legacyData, annualInterestBips: BigNumber.from(1_350) };
    const revolvingFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const revolvingData = makeUnifiedMarketDataV2(revolvingFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
      drawnAmount: { isPresent: true, value: BigNumber.from(250) }
    });
    const revolvingUpdate = makeUnifiedMarketDataV2(revolvingFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(225) },
      drawnAmount: { isPresent: true, value: BigNumber.from(400) }
    });
    const legacyLensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLens");
    const unifiedLensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === legacyLensAddress) {
        const decoded = decodeLensCall(marketLensAbi as Abi, call);
        expect(decoded.functionName).to.equal("getMarketsData");
        return encodeLensResult(marketLensAbi as Abi, "getMarketsData", [legacyUpdate]);
      }
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(unifiedLensAddress);
      expect(decoded.functionName).to.equal("getMarketsLiveDataV2");
      return encodeLensResult(marketLensV2_5Abi as Abi, "getMarketsLiveDataV2", [
        makeMarketLiveDataV2(revolvingUpdate)
      ]);
    });
    const legacyMarket = Market.fromMarketData(
      SupportedChainId.Sepolia,
      legacyData,
      viemProvider as unknown as providers.Provider
    );
    const revolvingMarket = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      revolvingData,
      false
    );
    legacyMarket.stateSource = "indexed";
    revolvingMarket.stateSource = "indexed";
    const markets = [legacyMarket, revolvingMarket];

    const result = await Market.hydrateMarketsLive(
      SupportedChainId.Sepolia,
      markets,
      viemProvider as unknown as providers.Provider
    );

    expect(result).to.equal(markets);
    expect(markets.map(({ stateSource }) => stateSource)).to.deep.equal(["live", "live"]);
    expect(legacyMarket.annualInterestBips).to.equal(1_350);
    expect(revolvingMarket.commitmentFeeBips).to.equal(225);
    expect(revolvingMarket.drawnAmount?.raw).to.equal(400n);
  });
});

describe("Market model routing metadata", () => {
  it("normalizes fixed-block provenance for every supported market generation", () => {
    const v1 = makeSubgraphMarketData();
    v1.version = SubgraphMarketVersion.V1;
    v1.marketKind = SubgraphMarketKind.STANDARD;
    v1.originKind = SubgraphMarketOriginKind.CONTROLLER;
    v1.generation = "v1";
    v1.abiFamily = "market-v1";
    v1.controller = { __typename: "Controller", id: makeAddress(80) };
    v1.hooksFactory = null;
    v1.hooksConfig = null;
    v1.hooks = null;
    v1.commitmentFeeBips = null;
    v1.drawnAmount = null;
    v1.snapshot!.commitmentFeeBips = null;
    v1.snapshot!.drawnAmount = null;

    const historicalStandard = makeSubgraphMarketData();
    const historicalFactory = {
      ...makeSubgraphHooksFactory(makeAddress(81)),
      label: "standard-v2-historical",
      marketKind: SubgraphMarketKind.STANDARD,
      generation: "v2",
      deploymentTarget: false,
      lifecycle: SubgraphFactoryLifecycle.HISTORICAL,
      isRegistered: false
    };
    historicalStandard.marketKind = SubgraphMarketKind.STANDARD;
    historicalStandard.generation = "v2";
    historicalStandard.abiFamily = "market-v2";
    historicalStandard.commitmentFeeBips = null;
    historicalStandard.drawnAmount = null;
    historicalStandard.snapshot!.commitmentFeeBips = null;
    historicalStandard.snapshot!.drawnAmount = null;
    historicalStandard.hooksFactory = historicalFactory;
    historicalStandard.hooks!.hooksFactory = historicalFactory;
    historicalStandard.hooks!.templateRegistration.hooksFactory = historicalFactory;

    const currentStandard = makeSubgraphMarketData();
    const standardFactory = {
      ...makeSubgraphHooksFactory(
        getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard")
      ),
      label: "standard-v2.5",
      marketKind: SubgraphMarketKind.STANDARD
    };
    currentStandard.marketKind = SubgraphMarketKind.STANDARD;
    currentStandard.commitmentFeeBips = null;
    currentStandard.drawnAmount = null;
    currentStandard.snapshot!.commitmentFeeBips = null;
    currentStandard.snapshot!.drawnAmount = null;
    currentStandard.hooksFactory = standardFactory;
    currentStandard.hooks!.hooksFactory = standardFactory;
    currentStandard.hooks!.templateRegistration.hooksFactory = standardFactory;

    const currentRevolving = makeSubgraphMarketData();
    const fixtures = [
      {
        data: v1,
        version: "v1",
        marketKind: "standard",
        originKind: "controller",
        factoryLifecycle: undefined
      },
      {
        data: historicalStandard,
        version: "v2",
        marketKind: "standard",
        originKind: "hooks",
        factoryLifecycle: "historical"
      },
      {
        data: currentStandard,
        version: "v2",
        marketKind: "standard",
        originKind: "hooks",
        factoryLifecycle: "active"
      },
      {
        data: currentRevolving,
        version: "v2",
        marketKind: "revolving",
        originKind: "hooks",
        factoryLifecycle: "active"
      }
    ] as const;

    fixtures.forEach(({ data, version, marketKind, originKind, factoryLifecycle }) => {
      const market = Market.fromSubgraphMarketData(SupportedChainId.Sepolia, provider, data);
      expect(market.stateSource).to.equal("indexed");
      expect(market.provenance).to.deep.include({ version, marketKind, originKind });
      expect(market.provenance?.createdAt).to.deep.equal({
        blockNumber: 1n,
        blockTimestamp: 1_700_000_000n,
        transactionHash: makeAddress(78),
        logIndex: 0n
      });
      expect(market.provenance?.hooksFactory?.lifecycle).to.equal(factoryLifecycle);
      expect(market.indexedSnapshot).to.deep.include({
        source: "event-projection",
        blockNumber: 123n,
        blockTimestamp: 1_700_000_123n,
        transactionHash: makeAddress(79),
        logIndex: 4n
      });
    });
  });

  it("uses the freshness-stamped market snapshot instead of legacy root state", () => {
    const data = makeSubgraphMarketData();
    data.annualInterestBips = 1200;
    data.snapshot!.annualInterestBips = 1350;
    data.snapshot!.drawnAmount = "375";

    const market = Market.fromSubgraphMarketData(SupportedChainId.Sepolia, provider, data);

    expect(market.annualInterestBips).to.equal(1350);
    expect(market.drawnAmount?.raw).to.equal(375n);
    expect(market.indexedSnapshot?.annualInterestBips).to.equal(1350);
  });

  it("normalizes lender snapshots without presenting them as live state", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      provider,
      makeSubgraphMarketData()
    );
    const accountData: SubgraphAccountDataForLenderListViewFragment = {
      __typename: "LenderAccount",
      id: `${market.address}-${makeAddress(82)}`,
      address: makeAddress(82),
      scaledBalance: "1",
      role: SubgraphLenderStatus.Null,
      totalDeposited: "1",
      lastScaleFactor: market.scaleFactor.toString(),
      lastUpdatedTimestamp: 1_700_000_000,
      totalInterestEarned: "1",
      numPendingWithdrawalBatches: 0,
      controllerAuthorization: null,
      hooksAccess: null,
      knownLenderStatus: null,
      snapshot: {
        __typename: "LenderAccountSnapshot",
        source: SubgraphSnapshotSource.EVENT_PROJECTION,
        scaledBalance: "5",
        role: SubgraphLenderStatus.WithdrawOnly,
        totalDeposited: "50",
        lastScaleFactor: market.scaleFactor.toString(),
        lastUpdatedTimestamp: 1_700_000_123,
        lastUpdatedBlockNumber: 123,
        totalInterestEarned: "7",
        numPendingWithdrawalBatches: 2,
        updatedAtBlock: "123",
        updatedAtTimestamp: "1700000123",
        updatedAtTransaction: makeAddress(83),
        updatedAtLogIndex: "5"
      }
    };

    const account = MarketAccount.fromSubgraphAccountData(market, accountData);

    expect(account.stateSource).to.equal("indexed");
    expect(account.scaledMarketBalance).to.equal(5n);
    expect(account.role).to.equal(2);
    expect(account.totalDeposited?.raw).to.equal(50n);
    expect(account.indexedSnapshot).to.deep.include({
      source: "event-projection",
      role: "withdraw-only",
      blockNumber: 123n,
      logIndex: 5n
    });
  });

  it("classifies V1 markets as standard without factory routing metadata", () => {
    const market = Market.fromMarketData(
      SupportedChainId.Sepolia,
      makeLegacyMarketData(),
      provider
    );

    expect(market.hooksFactory).to.equal(undefined);
    expect(market.marketKind).to.equal("standard");
  });

  it("derives standard marketKind from the configured standard factory", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(hooksFactory)
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketKind).to.equal("standard");
  });

  it("preserves unknown hooksFactory addresses without defaulting their market kind", () => {
    const unknownHooksFactory = makeAddress(99);
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(unknownHooksFactory)
    );

    expect(market.hooksFactory).to.equal(unknownHooksFactory);
    expect(market.marketKind).to.equal("unknown");
  });

  it("drops stale force-buyback compatibility for standard factory market data", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory),
      true
    );

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketKind).to.equal("standard");
    expectAllowForceBuyBacks(market, false);
  });

  it("drops stale force-buyback compatibility for unsupported factories", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const data = makeFactoryBackedMarketData(hooksFactory);
    data.hooksConfig.allowForceBuyBacks = true;

    const market = Market.fromMarketDataV2(SupportedChainId.Sepolia, provider, data);

    expect(market.hooksFactory).to.equal(hooksFactory);
    expect(market.marketKind).to.equal("revolving");
    expectAllowForceBuyBacks(market, false);
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
    expect(market.marketKind).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
    expectAllowForceBuyBacks(market, false);
  });

  it("recognizes live revolving state without a factory address allowlist", () => {
    const historicalFactory = makeAddress(98);
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(historicalFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: true, value: BigNumber.from(250) }
      }),
      false
    );

    expect(market.hooksFactory).to.equal(historicalFactory);
    expect(market.marketKind).to.equal("revolving");
  });

  it("does not guess a kind from inconsistent V2.5 revolving fields", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const market = Market.fromMarketDataV2_5(
      SupportedChainId.Sepolia,
      provider,
      makeUnifiedMarketDataV2(hooksFactory, {
        commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
        drawnAmount: { isPresent: false, value: BigNumber.from(0) }
      }),
      true
    );

    expect(market.marketKind).to.equal("unknown");
  });

  it("refreshes hooksFactory and marketKind when v2 market data is updated", () => {
    const standardHooksFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryStandard"
    );
    const market = Market.fromMarketDataV2(
      SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(standardHooksFactory)
    );

    const unknownHooksFactory = makeAddress(100);
    market.updateWith(makeFactoryBackedMarketData(unknownHooksFactory));

    expect(market.hooksFactory).to.equal(unknownHooksFactory);
    expect(market.marketKind).to.equal("unknown");
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
      marketKind: "standard",
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

    expect(market.marketKind).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
  });

  it("preserves indexed role providers and derives stable onboarding policy", () => {
    const data = makeSubgraphMarketData();
    data.hooksConfig!.useOnDeposit = true;
    data.hooksConfig!.depositRequiresAccess = true;
    data.hooks!.providers = [
      {
        __typename: "RoleProvider",
        id: `${data.hooks!.id}-${makeAddress(90)}`,
        providerAddress: makeAddress(90),
        providerInstance: {
          __typename: "RoleProviderInstance",
          kind: SubgraphRoleProviderKind.ACCESS_LIST,
          administrator: null,
          pendingAdministrator: null
        },
        timeToLive: "4294967295",
        isPullProvider: true,
        pullProviderIndex: 0,
        isPushProvider: false,
        pushProviderIndex: 0xffffff,
        isApproved: true
      }
    ];

    const market = Market.fromSubgraphMarketData(SupportedChainId.Sepolia, provider, data);

    expect(market.roleProviders).to.deep.equal([
      {
        kind: "access-list",
        providerAddress: makeAddress(90),
        timeToLive: 4_294_967_295,
        isPullProvider: true,
        pullProviderIndex: 0,
        isPushProvider: false,
        pushProviderIndex: 0xffffff,
        isApproved: true
      }
    ]);
    expect(market.onboardingMode).to.equal(MarketOnboardingMode.SelfOnboard);

    data.hooks!.providers = [];
    const borrowerApprovalMarket = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      provider,
      data
    );
    expect(borrowerApprovalMarket.roleProviders).to.deep.equal([]);
    expect(borrowerApprovalMarket.onboardingMode).to.equal(MarketOnboardingMode.BorrowerApproval);
  });

  it("keeps onboarding policy unknown when a narrow projection omits providers", () => {
    const data = makeSubgraphMarketListData();
    data.hooksConfig!.useOnDeposit = true;
    data.hooksConfig!.depositRequiresAccess = true;

    const market = Market.fromSubgraphMarketData(SupportedChainId.Sepolia, provider, data);

    expect(market.roleProviders).to.equal(undefined);
    expect(market.onboardingMode).to.equal(undefined);
  });

  it("derives onboarding policy from direct lens provider data", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving");
    const data = makeUnifiedMarketDataV2(hooksFactory);
    data.market.hooksConfig.flags.useOnDeposit = true;
    data.market.hooksConfig.depositRequiresAccess = true;
    data.market.hooks.pullProviders = [
      {
        providerAddress: makeAddress(91),
        timeToLive: BigNumber.from(3600),
        pullProviderIndex: BigNumber.from(0),
        pushProviderIndex: BigNumber.from(0xffffff),
        isManaged: false,
        administrator: makeAddress(0),
        pendingAdministrator: makeAddress(0)
      }
    ];

    const market = Market.fromMarketDataV2_5(SupportedChainId.Sepolia, provider, data, false);

    expect(market.roleProviders?.[0]).to.deep.include({
      providerAddress: makeAddress(91),
      isPullProvider: true,
      isPushProvider: false,
      timeToLive: 3600
    });
    expect(market.onboardingMode).to.equal(MarketOnboardingMode.SelfOnboard);
  });

  it("uses indexed provenance for historical factories absent from SDK targets", () => {
    const data = makeSubgraphMarketData();
    const historicalFactory = "0xF4564015E524cf5629828E61F45ed339D998D85f";
    data.hooks!.templateRegistration.hooksFactory.id = historicalFactory;
    data.hooks!.templateRegistration.hooksFactory.address = historicalFactory;
    data.hooks!.hooksFactory.id = historicalFactory;
    data.hooks!.hooksFactory.address = historicalFactory;
    data.hooksFactory!.id = historicalFactory;
    data.hooksFactory!.address = historicalFactory;

    const market = Market.fromSubgraphMarketData(SupportedChainId.Sepolia, provider, data);

    expect(market.hooksFactory).to.equal(historicalFactory);
    expect(market.marketKind).to.equal("revolving");

    market.updateWith(makeFactoryBackedMarketData(historicalFactory));

    expect(market.stateSource).to.equal("live");
    expect(market.hooksFactory).to.equal(historicalFactory);
    expect(market.marketKind).to.equal("revolving");
  });

  it("hydrates subgraph list markets without record and aggregate payloads", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      provider,
      makeSubgraphMarketListData()
    );

    expect(market.marketKind).to.equal("revolving");
    expect(market.commitmentFeeBips).to.equal(175);
    expect(market.drawnAmount?.raw).to.equal(250n);
    expect(market.totalBorrowed?.raw).to.equal(0n);
    expect(market.depositRecords).to.deep.equal([]);
    expect(market.latestDepositTimestamp).to.equal(1_750_000_000);
  });

  it("dispatches subgraph hook templates by kind rather than display name", () => {
    const data = makeSubgraphMarketListData();
    data.hooks!.templateRegistration.name = "";

    const market = Market.fromSubgraphMarketData(SupportedChainId.Sepolia, provider, data);

    expect(market.marketKind).to.equal("revolving");
    expect(market.hooksConfig?.kind).to.equal(HooksKind.OpenTerm);
    expect(market.hooksConfig?.template?.name).to.equal("");
  });
});

describe("Market reserve ratio previews", () => {
  it("returns minimum reserves in the underlying asset without changing reserve math", () => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
    const data = makeUnifiedMarketDataV2(hooksFactory);
    data.market.totalSupply = BigNumber.from(1_000);
    data.market.scaledTotalSupply = BigNumber.from(1_000);
    data.market.scaledPendingWithdrawals = BigNumber.from(200);
    data.market.normalizedUnclaimedWithdrawals = BigNumber.from(20);
    data.market.totalAssets = BigNumber.from(500);
    const market = Market.fromMarketDataV2_5(SupportedChainId.Sepolia, provider, data, false);

    const minimumReserves = market.minimumReserves;
    expect(minimumReserves.raw).to.equal(80n);
    expect(minimumReserves.token).to.equal(market.underlyingToken);
    expect(minimumReserves.token).not.to.equal(market.marketToken);
    expect(minimumReserves.token.address).to.equal(data.market.underlyingToken.token);
    expect(minimumReserves.name).to.equal("Mock USD");
    expect(minimumReserves.symbol).to.equal("mUSD");

    const breakdown = market.getTotalDebtBreakdown();
    expect(breakdown.status).to.equal("healthy");
    if (breakdown.status !== "healthy") throw Error("Expected healthy debt breakdown");
    expect(breakdown.collateralObligation.raw).to.equal(310n);
    expect(breakdown.borrowable.raw).to.equal(190n);
    expect(breakdown.borrowed.raw).to.equal(530n);
    expect(breakdown.totalDebt.raw).to.equal(1_030n);
    expect(market.delinquentDebt.raw).to.equal(0n);
  });

  const makeV2Market = (annualInterestBips: number): Market => {
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
    const data = makeUnifiedMarketDataV2(hooksFactory);
    data.market.annualInterestBips = BigNumber.from(annualInterestBips);
    data.market.originalAnnualInterestBips = BigNumber.from(annualInterestBips);
    data.market.reserveRatioBips = BigNumber.from(1_000);
    data.market.originalReserveRatioBips = BigNumber.from(1_000);
    return Market.fromMarketDataV2_5(SupportedChainId.Sepolia, provider, data, false);
  };

  it("compares the exact v2 APR reduction before rounding to bips", () => {
    expect(makeV2Market(10_000).getReserveRatioForNewAPR(7_500)).to.equal(1_000);
    expect(makeV2Market(9_999).getReserveRatioForNewAPR(7_499)).to.equal(5_000);
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
    const standardSemanticsMarket = Market.fromMarketDataV2_5(
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

    standardSemanticsMarket.totalSupply =
      standardSemanticsMarket.marketToken.getAmount(scaledSupply);
    standardSemanticsMarket.scaledTotalSupply = scaledSupply;
    standardSemanticsMarket.totalAssets =
      standardSemanticsMarket.underlyingToken.getAmount(stressedAssets);

    expect(revolvingMarket.secondsBeforeDelinquency).to.be.lessThan(
      standardSemanticsMarket.secondsBeforeDelinquency
    );
    expect(
      revolvingMarket.getSecondsBeforeDelinquencyForBorrowedAmount(
        revolvingMarket.underlyingToken.getAmount(100)
      )
    ).to.be.lessThan(
      standardSemanticsMarket.getSecondsBeforeDelinquencyForBorrowedAmount(
        standardSemanticsMarket.underlyingToken.getAmount(100)
      )
    );
    expect(
      revolvingMarket.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw >
        standardSemanticsMarket.repayRequiredForDuration(SECONDS_IN_365_DAYS).raw
    ).to.equal(true);
  });
});
