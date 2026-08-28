import { expect } from "chai";
import { BigNumber, constants, providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import {
  iERC20Abi,
  marketLensAbi,
  marketLensV2Abi,
  marketLensV2_5Abi,
  wildcatArchControllerAbi
} from "../../src/abi";
import * as constantsModule from "../../src/constants";
import { Market } from "../../src/market";
import { MarketAccount } from "../../src/account";
import { Token } from "../../src/token";
import {
  MarketDataStructOutput,
  MarketDataV2StructOutput,
  MarketLiveDataV2_5StructOutput,
  MarketLenderStatusStructOutput
} from "../../src/lens-types";

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

const makeViemTokenMetadata = (suffix: number, name: string, symbol: string) => ({
  token: makeAddress(suffix),
  name,
  symbol,
  decimals: 18n,
  isMock: false
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

const encodeArchControllerResult = (functionName: string, result: unknown): `0x${string}` => {
  return encodeLensResult(wildcatArchControllerAbi as Abi, functionName, result);
};

const decodeArchControllerCall = (call: FakeRpcCall) => {
  return decodeFunctionData({
    abi: wildcatArchControllerAbi as Abi,
    data: call.data as `0x${string}`
  });
};

const decodeLensCall = (abi: Abi, call: FakeRpcCall) => {
  return decodeFunctionData({
    abi,
    data: call.data as `0x${string}`
  });
};

const getMainnetTokenInfoTarget = (): { address: string; abi: Abi } => {
  const chainId = constantsModule.SupportedChainId.Mainnet;
  if (constantsModule.hasDeploymentAddress(chainId, "MarketLensV2_5")) {
    return {
      address: constantsModule.getDeploymentAddress(chainId, "MarketLensV2_5"),
      abi: marketLensV2_5Abi as Abi
    };
  }
  return {
    address: constantsModule.getDeploymentAddress(chainId, "MarketLensV2"),
    abi: marketLensV2Abi as Abi
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

const makeUnifiedMarketData = (hooksFactory: string) => {
  const marketData = makeFactoryBackedMarketData(hooksFactory);
  const hooksConfig = { ...marketData.hooksConfig };
  const { borrower: hooksAdministrator, ...hooks } = marketData.hooks;
  delete (hooksConfig as { allowForceBuyBacks?: unknown }).allowForceBuyBacks;

  return {
    ...marketData,
    hooksConfig,
    hooks: {
      ...hooks,
      administrator: hooksAdministrator,
      pendingAdministrator: constants.AddressZero
    }
  };
};

const makeFullUnifiedMarketData = (
  hooksFactory: string,
  {
    commitmentFeeBips = { isPresent: false, value: BigNumber.from(0) },
    drawnAmount = { isPresent: false, value: BigNumber.from(0) }
  }: {
    commitmentFeeBips?: { isPresent: boolean; value: BigNumber };
    drawnAmount?: { isPresent: boolean; value: BigNumber };
  } = {}
) => ({
  market: makeUnifiedMarketData(hooksFactory),
  borrowerPrincipal: makeAddress(30),
  pendingBorrower: constants.AddressZero,
  pendingBorrowerPrincipal: constants.AddressZero,
  borrowerIdentityRegistry: makeAddress(31),
  commitmentFeeBips,
  drawnAmount
});

const makeMarketLiveData = (
  hooksFactory: string,
  {
    commitmentFeeBips = { isPresent: false, value: BigNumber.from(0) },
    drawnAmount = { isPresent: false, value: BigNumber.from(0) }
  }: {
    commitmentFeeBips?: { isPresent: boolean; value: BigNumber };
    drawnAmount?: { isPresent: boolean; value: BigNumber };
  } = {}
): MarketLiveDataV2_5StructOutput => {
  const data = makeFactoryBackedMarketData(hooksFactory);
  return {
    market: data.marketToken.token,
    isClosed: data.isClosed,
    protocolFeeBips: data.protocolFeeBips,
    reserveRatioBips: data.reserveRatioBips,
    annualInterestBips: data.annualInterestBips,
    scaleFactor: data.scaleFactor,
    totalSupply: data.totalSupply,
    maxTotalSupply: data.maxTotalSupply,
    scaledTotalSupply: data.scaledTotalSupply,
    totalAssets: data.totalAssets,
    lastAccruedProtocolFees: data.lastAccruedProtocolFees,
    normalizedUnclaimedWithdrawals: data.normalizedUnclaimedWithdrawals,
    scaledPendingWithdrawals: data.scaledPendingWithdrawals,
    pendingWithdrawalExpiry: data.pendingWithdrawalExpiry,
    isDelinquent: data.isDelinquent,
    timeDelinquent: data.timeDelinquent,
    lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp,
    coverageLiquidity: data.coverageLiquidity,
    commitmentFeeBips,
    drawnAmount
  };
};

const makeMarketLenderStatus = (lender: string): MarketLenderStatusStructOutput => ({
  lender,
  isAuthorizedOnController: true,
  role: 3,
  scaledBalance: BigNumber.from(25),
  normalizedBalance: BigNumber.from(50),
  underlyingBalance: BigNumber.from(75),
  underlyingApproval: BigNumber.from(100)
});

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
    timeToLive: 3_600,
    isManaged: true,
    administrator: makeAddress(21),
    pendingAdministrator: constants.AddressZero
  },
  canRefresh: true,
  lastApprovalTimestamp: 1_700_000_000,
  isKnownLender: true
});

describe("Account and token read routing", () => {
  const originalFromMarketDataWithLenderStatus = MarketAccount.fromMarketDataWithLenderStatus;

  afterEach(() => {
    MarketAccount.fromMarketDataWithLenderStatus = originalFromMarketDataWithLenderStatus;
  });

  it("uses MarketLensV2_5 for token reads when deployed", async () => {
    const metadata = makeViemTokenMetadata(31, "Unified Token", "UNIT");
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const viemProvider = new FakeViemProvider(() =>
      encodeLensResult(marketLensV2_5Abi as Abi, "getTokenInfo", metadata)
    );

    const token = await Token.getTokenData(
      constantsModule.SupportedChainId.Sepolia,
      metadata.token,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([lensAddress]);
    expect(token.address.toLowerCase()).to.equal(metadata.token);
    expect(token.symbol).to.equal("UNIT");
  });

  it("routes mainnet token reads from deployment configuration", async () => {
    const metadata = makeViemTokenMetadata(33, "Mainnet Token", "MAIN");
    const target = getMainnetTokenInfoTarget();
    const viemProvider = new FakeViemProvider(() =>
      encodeLensResult(target.abi, "getTokenInfo", metadata)
    );

    const token = await Token.getTokenData(
      constantsModule.SupportedChainId.Mainnet,
      metadata.token,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([target.address]);
    expect(token.address.toLowerCase()).to.equal(metadata.token);
    expect(token.symbol).to.equal("MAIN");
  });

  it("falls back to the legacy lens for batch token reads before the unified lens is deployed", async () => {
    const metadata = makeViemTokenMetadata(32, "Legacy Token", "LGCY");
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Mainnet,
      "MarketLens"
    );
    const viemProvider = new FakeViemProvider(() =>
      encodeLensResult(marketLensAbi as Abi, "getTokensInfo", [metadata])
    );

    const tokens = await Token.getTokensData(
      constantsModule.SupportedChainId.Mainnet,
      [metadata.token],
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([lensAddress]);
    expect(tokens.map((token) => token.address)).to.deep.equal([metadata.token]);
    expect(tokens[0].symbol).to.equal("LGCY");
  });

  it("reads direct ERC20 balances, allowance, and total supply through viem", async () => {
    const tokenAddress = makeAddress(34);
    const owner = makeAddress(35);
    const spender = makeAddress(36);
    const viemProvider = new FakeViemProvider((call) => {
      const { functionName, args } = decodeFunctionData({
        abi: iERC20Abi as Abi,
        data: call.data as `0x${string}`
      });

      if (functionName === "balanceOf") {
        expect(args).to.deep.equal([owner]);
        return encodeLensResult(iERC20Abi as Abi, functionName, 123n);
      }
      if (functionName === "allowance") {
        expect(args).to.deep.equal([owner, spender]);
        return encodeLensResult(iERC20Abi as Abi, functionName, 456n);
      }
      if (functionName === "totalSupply") {
        return encodeLensResult(iERC20Abi as Abi, functionName, 789n);
      }
      throw new Error(`Unexpected ERC20 read: ${functionName}`);
    });
    const token = new Token(
      constantsModule.SupportedChainId.Sepolia,
      tokenAddress,
      "Mock Token",
      "MOCK",
      18,
      false,
      viemProvider as unknown as providers.Provider
    );

    const [balance, allowance, totalSupply] = await Promise.all([
      token.balanceOf(owner),
      token.allowance(owner, spender),
      token.totalSupply()
    ]);

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([
      tokenAddress,
      tokenAddress,
      tokenAddress
    ]);
    expect(balance.raw).to.equal(123n);
    expect(allowance.raw).to.equal(456n);
    expect(totalSupply.raw).to.equal(789n);
  });

  it("uses the latest lender-account data path for V2 market instances", async () => {
    const account = makeAddress(40);
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactoryStandard"
    );
    const market = Market.fromMarketDataV2(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(hooksFactory)
    );
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getLenderAccountData");
      expect((decoded.args as string[]).map((address) => address.toLowerCase())).to.deep.equal([
        account,
        market.address.toLowerCase()
      ]);

      return encodeLensResult(
        marketLensV2_5Abi as Abi,
        "getLenderAccountData",
        makeLenderAccountData(account)
      );
    });

    const marketAccount = await MarketAccount.getMarketAccount(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      account,
      market
    );

    expect(marketAccount.market).to.equal(market);
    expect(marketAccount.account).to.equal(account);
    expect(marketAccount.marketBalance.raw.toString()).to.equal("50");
    expect(marketAccount.isKnownLender).to.equal(true);
  });

  it("refreshes V2 lender market accounts through the live list endpoint", async () => {
    const account = makeAddress(43);
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(hooksFactory)
    );
    const marketAccount = MarketAccount.fromLenderAccountData(
      market,
      makeLenderAccountData(account)
    );
    market.stateSource = "indexed";
    marketAccount.stateSource = "indexed";
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketsLiveDataWithLenderStatusV2");
      expect((decoded.args as [string, string[]])[0].toLowerCase()).to.equal(account);
      expect(
        (decoded.args as [string, string[]])[1].map((address) => address.toLowerCase())
      ).to.deep.equal([market.address.toLowerCase()]);

      return encodeLensResult(marketLensV2_5Abi as Abi, "getMarketsLiveDataWithLenderStatusV2", [
        {
          market: makeMarketLiveData(hooksFactory, {
            commitmentFeeBips: { isPresent: true, value: BigNumber.from(200) },
            drawnAmount: { isPresent: true, value: BigNumber.from(300) }
          }),
          lenderStatus: makeLenderAccountData(account)
        }
      ]);
    });

    const result = await MarketAccount.hydrateMarketAccountsLive(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      account,
      [marketAccount]
    );

    expect(result[0]).to.equal(marketAccount);
    expect(marketAccount.market.commitmentFeeBips).to.equal(200);
    expect(marketAccount.market.drawnAmount?.raw).to.equal(300n);
    expect(marketAccount.marketBalance.raw.toString()).to.equal("50");
    expect(marketAccount.market.stateSource).to.equal("live");
    expect(marketAccount.stateSource).to.equal("live");
  });

  it("retains V2 access state while clearing wallet state when no account is connected", async () => {
    const account = makeAddress(43);
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const market = Market.fromMarketDataV2(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      makeFactoryBackedMarketData(hooksFactory)
    );
    const marketAccount = MarketAccount.fromLenderAccountData(
      market,
      makeLenderAccountData(account)
    );
    const credential = marketAccount.credential;
    const disconnectedLenderStatus = {
      ...makeLenderAccountData(constants.AddressZero),
      canRefresh: false,
      isBlockedFromDeposits: true,
      lastApprovalTimestamp: 0,
      isKnownLender: false
    };
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketsLiveDataWithLenderStatusV2");
      expect((decoded.args as [string, string[]])[0].toLowerCase()).to.equal(constants.AddressZero);

      return encodeLensResult(marketLensV2_5Abi as Abi, decoded.functionName, [
        {
          market: makeMarketLiveData(hooksFactory),
          lenderStatus: disconnectedLenderStatus
        }
      ]);
    });

    await MarketAccount.refreshMarketAccountsV2LiveData(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      undefined,
      [marketAccount]
    );

    expect(marketAccount.credential).to.equal(credential);
    expect(marketAccount.isKnownLender).to.equal(true);
    expect(marketAccount.scaledMarketBalance).to.equal(0n);
    expect(marketAccount.marketBalance.raw).to.equal(0n);
    expect(marketAccount.underlyingBalance.raw).to.equal(0n);
    expect(marketAccount.underlyingApproval).to.equal(0n);
    expect(marketAccount.stateSource).to.equal("live");
  });

  it("retains legacy access state while clearing wallet state when no account is connected", async () => {
    const chainId = constantsModule.SupportedChainId.Mainnet;
    const account = makeAddress(44);
    const marketData = makeLegacyMarketData();
    const market = Market.fromMarketData(chainId, marketData, provider);
    const marketAccount = MarketAccount.fromMarketLenderStatus(
      account,
      makeMarketLenderStatus(account),
      market
    );
    const lensAddress = constantsModule.getDeploymentAddress(chainId, "MarketLens");
    const disconnectedLenderStatus = {
      ...makeMarketLenderStatus(constants.AddressZero),
      isAuthorizedOnController: false,
      role: 0
    };
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensAbi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getMarketsDataWithLenderStatus");
      expect((decoded.args as [string, string[]])[0].toLowerCase()).to.equal(constants.AddressZero);

      return encodeLensResult(marketLensAbi as Abi, decoded.functionName, [
        {
          market: marketData,
          lenderStatus: disconnectedLenderStatus
        }
      ]);
    });

    await MarketAccount.hydrateMarketAccountsLive(
      chainId,
      viemProvider as unknown as providers.Provider,
      undefined,
      [marketAccount]
    );

    expect(marketAccount.role).to.equal(3);
    expect(marketAccount.isAuthorizedOnController).to.equal(true);
    expect(marketAccount.scaledMarketBalance).to.equal(0n);
    expect(marketAccount.marketBalance.raw).to.equal(0n);
    expect(marketAccount.underlyingBalance.raw).to.equal(0n);
    expect(marketAccount.underlyingApproval).to.equal(0n);
    expect(marketAccount.stateSource).to.equal("live");
  });

  it("batch-refreshes a singleton legacy V2 account without ambiguous lens overloads", async () => {
    const chainId = constantsModule.SupportedChainId.Mainnet;
    const account = makeAddress(44);
    const hooksFactory = constantsModule.getDeploymentAddress(chainId, "HooksFactoryStandard");
    const marketData = makeFactoryBackedMarketData(hooksFactory);
    const market = Market.fromMarketDataV2(chainId, provider, marketData);
    const marketAccount = MarketAccount.fromLenderAccountData(
      market,
      makeLenderAccountData(account)
    );
    const lensAddress = constantsModule.getDeploymentAddress(chainId, "MarketLensV2");
    const seenFunctions: string[] = [];
    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2Abi as Abi, call);

      expect(call.to).to.equal(lensAddress);
      seenFunctions.push(decoded.functionName);
      if (decoded.functionName === "getMarketsData") {
        expect(
          (decoded.args as [string[]])[0].map((address) => address.toLowerCase())
        ).to.deep.equal([market.address.toLowerCase()]);
        return encodeLensResult(marketLensV2Abi as Abi, "getMarketsData", [marketData]);
      }
      if (decoded.functionName === "getLenderAccountData") {
        const [lender, markets] = decoded.args as [string, string[]];
        expect(lender.toLowerCase()).to.equal(account);
        expect(markets.map((address) => address.toLowerCase())).to.deep.equal([
          market.address.toLowerCase()
        ]);
        const batchLenderAccountAbi = (marketLensV2Abi as Abi).filter(
          (item) =>
            item.type === "function" &&
            item.name === "getLenderAccountData" &&
            item.inputs[1]?.type === "address[]"
        ) as Abi;
        return encodeLensResult(batchLenderAccountAbi, "getLenderAccountData", [
          makeLenderAccountData(account)
        ]);
      }
      throw new Error(`Unexpected legacy V2 lens read: ${decoded.functionName}`);
    });

    const result = await MarketAccount.refreshMarketAccountsV2LiveData(
      chainId,
      viemProvider as unknown as providers.Provider,
      account,
      [marketAccount]
    );

    expect(result).to.deep.equal([marketAccount]);
    expect(seenFunctions.sort()).to.deep.equal(["getLenderAccountData", "getMarketsData"].sort());
    expect(marketAccount.marketBalance.raw.toString()).to.equal("50");
  });

  it("preserves full revolving metadata in direct V2.5 account reads", async () => {
    const account = makeAddress(40);
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const marketData = makeFullUnifiedMarketData(hooksFactory, {
      commitmentFeeBips: { isPresent: true, value: BigNumber.from(175) },
      drawnAmount: { isPresent: true, value: BigNumber.from(250) }
    });
    const marketAddress = marketData.market.marketToken.token;
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const seenFunctions: string[] = [];
    const viemProvider = new FakeViemProvider((call) => {
      expect(call.to).to.equal(lensAddress);
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      seenFunctions.push(decoded.functionName);

      if (decoded.functionName === "getMarketDataV2") {
        expect((decoded.args as string[])[0].toLowerCase()).to.equal(marketAddress);
        return encodeLensResult(marketLensV2_5Abi as Abi, decoded.functionName, marketData);
      }
      if (decoded.functionName === "getLenderAccountData") {
        expect((decoded.args as string[]).map((address) => address.toLowerCase())).to.deep.equal([
          account,
          marketAddress
        ]);
        return encodeLensResult(
          marketLensV2_5Abi as Abi,
          decoded.functionName,
          makeLenderAccountData(account)
        );
      }
      throw new Error(`Unexpected V2.5 lens read: ${decoded.functionName}`);
    });

    const marketAccount = await MarketAccount.getMarketAccount(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      account,
      marketAddress
    );

    expect(seenFunctions.sort()).to.deep.equal(["getLenderAccountData", "getMarketDataV2"]);
    expect(marketAccount.market.marketKind).to.equal("revolving");
    expect(marketAccount.market.commitmentFeeBips).to.equal(175);
    expect(marketAccount.market.drawnAmount?.raw).to.equal(250n);
    expect(marketAccount.market.currentAprDisplayBips).to.include({
      isRevolving: true,
      configuredAprKind: "utilization"
    });
  });

  it("falls back to the legacy lens for direct account reads when the latest lens rejects the market", async () => {
    const account = makeAddress(41);
    const marketAddress = makeAddress(42);
    const hydratedAccount = { account } as unknown as MarketAccount;
    const seenInfos: unknown[] = [];
    const latestLensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const legacyLensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLens"
    );
    const latestFunctions = new Set<string>();

    const viemProvider = new FakeViemProvider((call) => {
      if (call.to?.toLowerCase() === latestLensAddress.toLowerCase()) {
        const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
        expect(["getMarketDataV2", "getLenderAccountData"]).to.include(decoded.functionName);
        latestFunctions.add(decoded.functionName);
        throw new Error("NotV2Market");
      }

      expect(call.to).to.equal(legacyLensAddress);
      const decoded = decodeLensCall(marketLensAbi as Abi, call);
      expect(decoded.functionName).to.equal("getMarketDataWithLenderStatus");
      expect((decoded.args as string[]).map((address) => address.toLowerCase())).to.deep.equal([
        account,
        marketAddress
      ]);

      return encodeLensResult(marketLensAbi as Abi, "getMarketDataWithLenderStatus", {
        market: makeLegacyMarketData(),
        lenderStatus: makeMarketLenderStatus(account)
      });
    });
    MarketAccount.fromMarketDataWithLenderStatus = (async (_chainId, _provider, _account, info) => {
      seenInfos.push(info);
      return hydratedAccount;
    }) as typeof originalFromMarketDataWithLenderStatus;

    const marketAccount = await MarketAccount.getMarketAccount(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      account,
      marketAddress
    );

    expect(seenInfos).to.have.lengthOf(1);
    expect((seenInfos[0] as { market: { controller: string } }).market.controller).to.equal(
      makeAddress(4)
    );
    expect(Array.from(latestFunctions).sort()).to.deep.equal([
      "getLenderAccountData",
      "getMarketDataV2"
    ]);
    expect(marketAccount).to.equal(hydratedAccount);
  });

  it("uses ArchController enumeration plus latest-lens hydration for unified all-market account reads", async () => {
    const account = makeAddress(41);
    const markets = [makeAddress(42), makeAddress(43)];
    const hooksFactory = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "HooksFactoryStandard"
    );
    const hydratedAccounts = [{ account: "a" }, { account: "b" }] as unknown as MarketAccount[];
    const seenMarkets: string[][] = [];
    const seenInfos: unknown[] = [];
    const seenFunctions: string[] = [];

    let hydrateIndex = 0;
    MarketAccount.fromMarketDataWithLenderStatus = (async (_chainId, _provider, _account, info) => {
      seenInfos.push(info);
      return hydratedAccounts[hydrateIndex++];
    }) as typeof originalFromMarketDataWithLenderStatus;

    const archControllerAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "WildcatArchController"
    );
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === archControllerAddress) {
        return encodeArchControllerResult("getRegisteredMarkets", markets);
      }

      expect(call.to).to.equal(lensAddress);
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      seenFunctions.push(decoded.functionName);
      if (decoded.functionName === "getMarketsDataV2") {
        const [addresses] = decoded.args as [string[]];
        seenMarkets.push(addresses);
        return encodeLensResult(marketLensV2_5Abi as Abi, decoded.functionName, [
          makeFullUnifiedMarketData(hooksFactory),
          makeFullUnifiedMarketData(hooksFactory)
        ]);
      }
      if (decoded.functionName === "getLenderAccountData") {
        const [, addresses] = decoded.args as [string, string[]];
        expect(addresses.map((address) => address.toLowerCase())).to.deep.equal(markets);
        const batchLenderAccountAbi = (marketLensV2_5Abi as Abi).filter(
          (item) =>
            item.type === "function" &&
            item.name === "getLenderAccountData" &&
            item.inputs[1]?.type === "address[]"
        ) as Abi;
        return encodeLensResult(batchLenderAccountAbi, decoded.functionName, [
          makeLenderAccountData(account),
          makeLenderAccountData(account)
        ]);
      }
      throw new Error(`Unexpected V2.5 lens read: ${decoded.functionName}`);
    });

    const accounts = await MarketAccount.getAllMarketAccountsForLender(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      account
    );

    expect(viemProvider.calls[0].to).to.equal(archControllerAddress);
    expect(viemProvider.calls.slice(1).map((call) => call.to)).to.deep.equal([
      lensAddress,
      lensAddress
    ]);
    expect(seenFunctions.sort()).to.deep.equal(["getLenderAccountData", "getMarketsDataV2"]);
    expect(
      seenMarkets.map((addresses) => addresses.map((address) => address.toLowerCase()))
    ).to.deep.equal([markets]);
    expect(seenInfos).to.have.lengthOf(2);
    expect(accounts).to.deep.equal(hydratedAccounts);
  });

  it("maps paginated unified account reads from start/count to ArchController start/end", async () => {
    const account = makeAddress(50);
    const markets = [makeAddress(51), makeAddress(52), makeAddress(53)];
    const rangeCalls: Array<[number, number]> = [];

    MarketAccount.fromMarketDataWithLenderStatus = (async () => {
      throw new Error("should not hydrate empty latest-lens responses");
    }) as typeof originalFromMarketDataWithLenderStatus;

    const archControllerAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "WildcatArchController"
    );
    const lensAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "MarketLensV2_5"
    );
    const seenFunctions: string[] = [];
    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === lensAddress) {
        const { functionName } = decodeLensCall(marketLensV2_5Abi as Abi, call);
        seenFunctions.push(functionName);
        if (functionName === "getMarketsDataV2") {
          return encodeLensResult(marketLensV2_5Abi as Abi, functionName, []);
        }
        if (functionName === "getLenderAccountData") {
          const batchLenderAccountAbi = (marketLensV2_5Abi as Abi).filter(
            (item) =>
              item.type === "function" &&
              item.name === "getLenderAccountData" &&
              item.inputs[1]?.type === "address[]"
          ) as Abi;
          return encodeLensResult(batchLenderAccountAbi, functionName, []);
        }
        throw new Error(`Unexpected V2.5 lens read: ${functionName}`);
      }

      const { functionName, args } = decodeArchControllerCall(call);
      if (functionName === "getRegisteredMarketsCount") {
        return encodeArchControllerResult(functionName, BigInt(markets.length));
      }

      rangeCalls.push((args as [bigint, bigint]).map(Number) as [number, number]);
      return encodeArchControllerResult(functionName, markets.slice(1, 3));
    });

    const accounts = await MarketAccount.getPaginatedMarketAccounts(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      account,
      1,
      5
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([
      archControllerAddress,
      archControllerAddress,
      lensAddress,
      lensAddress
    ]);
    expect(seenFunctions.sort()).to.deep.equal(["getLenderAccountData", "getMarketsDataV2"]);
    expect(rangeCalls).to.deep.equal([[1, 3]]);
    expect(accounts).to.deep.equal([]);
  });
});
