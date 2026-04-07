import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import * as constantsModule from "../../src/constants";
import { Market } from "../../src/market";
import { MarketAccount } from "../../src/account";
import { Token } from "../../src/token";
import { MarketDataV2StructOutput } from "../../src/typechain";

const provider = new providers.JsonRpcProvider();
const NullProviderIndex = BigNumber.from(2).pow(24).sub(1).toNumber();

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

const makeLenderAccountData = (lender: string) => ({
  lender,
  scaledBalance: BigNumber.from(25),
  normalizedBalance: BigNumber.from(50),
  underlyingBalance: BigNumber.from(75),
  underlyingApproval: BigNumber.from(100),
  isBlockedFromDeposits: false,
  lastProvider: {
    providerAddress: makeAddress(20),
    pullProviderIndex: 0,
    pushProviderIndex: NullProviderIndex,
    timeToLive: 3_600
  },
  canRefresh: true,
  lastApprovalTimestamp: 1_700_000_000,
  isKnownLender: true
});

describe("Account and token read routing", () => {
  const originalHasDeploymentAddress = constantsModule.hasDeploymentAddress;
  const originalGetLensContract = constantsModule.getLensContract;
  const originalGetLensV2Contract = constantsModule.getLensV2Contract;
  const originalGetLensV2_5Contract = constantsModule.getLensV2_5Contract;
  const originalGetLatestLensContract = constantsModule.getLatestLensContract;
  const originalGetArchControllerContract = constantsModule.getArchControllerContract;
  const originalFromMarketDataWithLenderStatus = MarketAccount.fromMarketDataWithLenderStatus;

  const mutableConstants = constantsModule as typeof constantsModule & {
    hasDeploymentAddress: typeof originalHasDeploymentAddress;
    getLensContract: typeof originalGetLensContract;
    getLensV2Contract: typeof originalGetLensV2Contract;
    getLensV2_5Contract: typeof originalGetLensV2_5Contract;
    getLatestLensContract: typeof originalGetLatestLensContract;
    getArchControllerContract: typeof originalGetArchControllerContract;
  };

  afterEach(() => {
    mutableConstants.hasDeploymentAddress = originalHasDeploymentAddress;
    mutableConstants.getLensContract = originalGetLensContract;
    mutableConstants.getLensV2Contract = originalGetLensV2Contract;
    mutableConstants.getLensV2_5Contract = originalGetLensV2_5Contract;
    mutableConstants.getLatestLensContract = originalGetLatestLensContract;
    mutableConstants.getArchControllerContract = originalGetArchControllerContract;
    MarketAccount.fromMarketDataWithLenderStatus = originalFromMarketDataWithLenderStatus;
  });

  it("uses MarketLensV2_5 for token reads when deployed", async () => {
    const metadata = makeTokenMetadata(31, "Unified Token", "UNIT");

    mutableConstants.hasDeploymentAddress = ((_, name) =>
      name === "MarketLensV2_5") as typeof originalHasDeploymentAddress;
    mutableConstants.getLensV2_5Contract = (() => ({
      getTokenInfo: async () => metadata
    })) as unknown as typeof originalGetLensV2_5Contract;
    mutableConstants.getLensV2Contract = (() => ({
      getTokenInfo: async () => {
        throw new Error("should not read token data from MarketLensV2");
      }
    })) as unknown as typeof originalGetLensV2Contract;

    const token = await Token.getTokenData(
      constantsModule.SupportedChainId.Sepolia,
      metadata.token,
      provider
    );

    expect(token.address).to.equal(metadata.token);
    expect(token.symbol).to.equal("UNIT");
  });

  it("falls back to the legacy lens for batch token reads before the unified lens is deployed", async () => {
    const metadata = makeTokenMetadata(32, "Legacy Token", "LGCY");

    mutableConstants.hasDeploymentAddress = (() => false) as typeof originalHasDeploymentAddress;
    mutableConstants.getLensContract = (() => ({
      getTokensInfo: async () => [metadata]
    })) as unknown as typeof originalGetLensContract;
    mutableConstants.getLensV2_5Contract = (() => ({
      getTokensInfo: async () => {
        throw new Error("should not read tokens from MarketLensV2_5");
      }
    })) as unknown as typeof originalGetLensV2_5Contract;

    const tokens = await Token.getTokensData(
      constantsModule.SupportedChainId.Sepolia,
      [metadata.token],
      provider
    );

    expect(tokens.map((token) => token.address)).to.deep.equal([metadata.token]);
    expect(tokens[0].symbol).to.equal("LGCY");
  });

  it("uses the latest lender-account data path for V2 market instances", async () => {
    const account = makeAddress(40);
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactory"
    );
    const market = Market.fromMarketDataV2(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(hooksFactory)
    );

    mutableConstants.getLatestLensContract = (() => ({
      "getLenderAccountData(address,address)": async () => makeLenderAccountData(account)
    })) as unknown as typeof originalGetLatestLensContract;
    mutableConstants.getLensContract = (() => ({
      getMarketLenderStatus: async () => {
        throw new Error("should not use V1 lender status for V2 markets");
      }
    })) as unknown as typeof originalGetLensContract;

    const marketAccount = await MarketAccount.getMarketAccount(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      account,
      market
    );

    expect(marketAccount.market).to.equal(market);
    expect(marketAccount.account).to.equal(account);
    expect(marketAccount.marketBalance.raw.toString()).to.equal("50");
    expect(marketAccount.isKnownLender).to.equal(true);
  });

  it("falls back to the legacy lens for direct account reads when the latest lens rejects the market", async () => {
    const account = makeAddress(41);
    const marketAddress = makeAddress(42);
    const hydratedAccount = { account } as unknown as MarketAccount;
    const seenInfos: unknown[] = [];

    mutableConstants.getLatestLensContract = (() => ({
      getMarketDataWithLenderStatus: async () => {
        throw new Error("NotV2Market");
      }
    })) as unknown as typeof originalGetLatestLensContract;
    mutableConstants.getLensContract = (() => ({
      getMarketDataWithLenderStatus: async (_account: string, market: string) => ({
        legacyMarket: market
      })
    })) as unknown as typeof originalGetLensContract;
    MarketAccount.fromMarketDataWithLenderStatus = (async (_chainId, _provider, _account, info) => {
      seenInfos.push(info);
      return hydratedAccount;
    }) as typeof originalFromMarketDataWithLenderStatus;

    const marketAccount = await MarketAccount.getMarketAccount(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      account,
      marketAddress
    );

    expect(seenInfos).to.deep.equal([{ legacyMarket: marketAddress }]);
    expect(marketAccount).to.equal(hydratedAccount);
  });

  it("uses ArchController enumeration plus latest-lens hydration for unified all-market account reads", async () => {
    const account = makeAddress(41);
    const markets = [makeAddress(42), makeAddress(43)];
    const hydratedAccounts = [{ account: "a" }, { account: "b" }] as unknown as MarketAccount[];
    const seenMarkets: string[][] = [];
    const seenInfos: unknown[] = [];

    mutableConstants.hasDeploymentAddress = ((_, name) =>
      name === "MarketLensV2_5") as typeof originalHasDeploymentAddress;
    mutableConstants.getArchControllerContract = (() => ({
      "getRegisteredMarkets()": async () => markets
    })) as unknown as typeof originalGetArchControllerContract;
    mutableConstants.getLatestLensContract = (() => ({
      getMarketsDataWithLenderStatus: async (_account: string, addresses: string[]) => {
        seenMarkets.push(addresses);
        return [{ tag: "first" }, { tag: "second" }];
      }
    })) as unknown as typeof originalGetLatestLensContract;

    let hydrateIndex = 0;
    MarketAccount.fromMarketDataWithLenderStatus = (async (_chainId, _provider, _account, info) => {
      seenInfos.push(info);
      return hydratedAccounts[hydrateIndex++];
    }) as typeof originalFromMarketDataWithLenderStatus;

    const accounts = await MarketAccount.getAllMarketAccountsForLender(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      account
    );

    expect(seenMarkets).to.deep.equal([markets]);
    expect(seenInfos).to.deep.equal([{ tag: "first" }, { tag: "second" }]);
    expect(accounts).to.deep.equal(hydratedAccounts);
  });

  it("maps paginated unified account reads from start/count to ArchController start/end", async () => {
    const account = makeAddress(50);
    const markets = [makeAddress(51), makeAddress(52), makeAddress(53)];
    const rangeCalls: Array<[number, number]> = [];

    mutableConstants.hasDeploymentAddress = ((_, name) =>
      name === "MarketLensV2_5") as typeof originalHasDeploymentAddress;
    mutableConstants.getArchControllerContract = (() => ({
      getRegisteredMarketsCount: async () => BigNumber.from(markets.length),
      "getRegisteredMarkets(uint256,uint256)": async (start: number, end: number) => {
        rangeCalls.push([start, end]);
        return markets.slice(start, end);
      }
    })) as unknown as typeof originalGetArchControllerContract;
    mutableConstants.getLatestLensContract = (() => ({
      getMarketsDataWithLenderStatus: async () => []
    })) as unknown as typeof originalGetLatestLensContract;
    MarketAccount.fromMarketDataWithLenderStatus = (async () => {
      throw new Error("should not hydrate empty latest-lens responses");
    }) as typeof originalFromMarketDataWithLenderStatus;

    const accounts = await MarketAccount.getPaginatedMarketAccounts(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      account,
      1,
      5
    );

    expect(rangeCalls).to.deep.equal([[1, 3]]);
    expect(accounts).to.deep.equal([]);
  });
});
