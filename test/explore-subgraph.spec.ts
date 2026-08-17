import { expect } from "chai";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { BigNumber, providers } from "ethers";
import { print } from "graphql";
import { LenderRole, MarketAccount, SetAprStatus } from "../src/account";
import {
  getDeployableHooksTemplateForKind,
  getEnabledHooksTemplatesForKind,
  HooksTemplate
} from "../src/access";
import * as sdkConstants from "../src/constants";
import { SupportedChainId } from "../src/constants";
import {
  getAllMarketsForLenderViewDocumentForChain,
  getLenderMarketCatalogueDocumentForChain
} from "../src/gql/document-selectors";
import { getLenderMarketCatalogue } from "../src/gql/getLenderMarketCatalogue";
import {
  SubgraphGetLenderMarketCatalogueQuery,
  SubgraphHooksKind,
  SubgraphLenderHooksAccessDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketVersion,
  SubgraphRoleProviderDataFragment
} from "../src/gql/graphql";
import { Market } from "../src/market";
import {
  PeriodicAprSettlementQuote,
  PeriodicAprSettlementStatus,
  populatePeriodicAprReductionPlan
} from "../src/periodic-settlement";
import {
  LenderAccountDataStructOutput,
  MarketDataV2StructOutput,
  MarketLenderStatusStructOutput
} from "../src/typechain";
import { parseSubgraphLenderHooksAccess, parseSubgraphRoleProvider } from "../src/utils";
import { HooksKind } from "../src/types";

const marketAddress = "0x0000000000000000000000000000000000000001";
const borrowerAddress = "0x0000000000000000000000000000000000000002";
const controllerAddress = "0x0000000000000000000000000000000000000003";
const assetAddress = "0x0000000000000000000000000000000000000004";
const providerAddress = "0x0000000000000000000000000000000000000005";
const hooksAddress = "0x0000000000000000000000000000000000000006";
const hooksTemplateAddress = "0x0000000000000000000000000000000000000007";
const secondMarketAddress = "0x0000000000000000000000000000000000000008";
const pushProviderAddress = "0x0000000000000000000000000000000000000009";
const removedProviderAddress = "0x000000000000000000000000000000000000000a";
const lenderAddress = "0x000000000000000000000000000000000000000b";
const nullAddress = "0x0000000000000000000000000000000000000000";
const nullProviderIndex = 2 ** 24 - 1;

type V1LenderStateReader = (
  lender: string,
  markets: string[]
) => Promise<MarketLenderStatusStructOutput[]>;
type V2LenderStateReader = (
  lender: string,
  markets: string[]
) => Promise<LenderAccountDataStructOutput[]>;

const withStubbedLenderStateReaders = async <T>(
  getV1Updates: V1LenderStateReader,
  getV2Updates: V2LenderStateReader,
  run: () => Promise<T>
): Promise<T> => {
  const constants = sdkConstants as {
    getLensContract: typeof sdkConstants.getLensContract;
    getLensV2Contract: typeof sdkConstants.getLensV2Contract;
  };
  const originalGetLensContract = constants.getLensContract;
  const originalGetLensV2Contract = constants.getLensV2Contract;
  constants.getLensContract = (() => ({
    getMarketsLenderStatus: getV1Updates
  })) as unknown as typeof sdkConstants.getLensContract;
  constants.getLensV2Contract = (() => ({
    "getLenderAccountData(address,address[])": getV2Updates
  })) as unknown as typeof sdkConstants.getLensV2Contract;

  try {
    return await run();
  } finally {
    constants.getLensContract = originalGetLensContract;
    constants.getLensV2Contract = originalGetLensV2Contract;
  }
};

const makeMarketData = (totalAssets: string): SubgraphMarketDataWithEventsFragment => ({
  __typename: "Market",
  id: marketAddress,
  version: SubgraphMarketVersion.V1,
  isRegistered: true,
  isClosed: false,
  controller: { __typename: "Controller", id: controllerAddress },
  borrower: borrowerAddress,
  sentinel: "0x0000000000000000000000000000000000000000",
  feeRecipient: "0x0000000000000000000000000000000000000000",
  name: "Wildcat Test Market",
  symbol: "WILDCAT-TST",
  decimals: 18,
  protocolFeeBips: 0,
  delinquencyGracePeriod: 86_400,
  delinquencyFeeBips: 0,
  withdrawalBatchDuration: 86_400,
  numCollateralContracts: 0,
  _asset: {
    __typename: "Token",
    id: assetAddress,
    address: assetAddress,
    name: "Test Asset",
    symbol: "TST",
    decimals: 18,
    isMock: false
  },
  hooksConfig: null,
  hooks: null,
  maxTotalSupply: "1000000000000000000000",
  totalAssets,
  pendingProtocolFees: "0",
  normalizedUnclaimedWithdrawals: "0",
  scaledTotalSupply: "1000000000000000000000",
  scaledPendingWithdrawals: "0",
  pendingWithdrawalExpiry: "0",
  isDelinquent: false,
  timeDelinquent: 0,
  annualInterestBips: 1_000,
  reserveRatioBips: 0,
  scaleFactor: "1000000000000000000000000000",
  lastInterestAccruedTimestamp: 1_700_000_000,
  originalAnnualInterestBips: 1_000,
  originalReserveRatioBips: 0,
  temporaryReserveRatioExpiry: 0,
  temporaryReserveRatioActive: false,
  unpaidWithdrawalBatches: [],
  totalBorrowed: "0",
  totalRepaid: "0",
  totalBaseInterestAccrued: "0",
  totalDelinquencyFeesAccrued: "0",
  totalProtocolFeesAccrued: "0",
  totalDeposited: "1000000000000000000000",
  eventIndex: 1,
  deployedEvent: {
    __typename: "MarketDeployed",
    blockNumber: 1,
    blockTimestamp: 1_700_000_000,
    transactionHash: "0x01"
  },
  depositRecords: [],
  borrowRecords: [],
  feeCollectionRecords: [],
  repaymentRecords: [],
  periodicTermUpdatedRecords: [],
  periodicTermClosedRecord: null,
  annualInterestBipsReductionProposalRecords: []
});

const roleProvider: SubgraphRoleProviderDataFragment = {
  __typename: "RoleProvider",
  id: providerAddress,
  providerAddress,
  timeToLive: "4294967295",
  isPullProvider: false,
  pullProviderIndex: 2 ** 24 - 1,
  isPushProvider: true,
  pushProviderIndex: 0,
  isApproved: true
};

type CatalogueMarket = SubgraphGetLenderMarketCatalogueQuery["markets"][number];

const makeRoleProvider = (
  address: string,
  isPullProvider: boolean,
  isPushProvider: boolean,
  isApproved = true
): SubgraphRoleProviderDataFragment => ({
  __typename: "RoleProvider",
  id: address,
  providerAddress: address,
  timeToLive: "3600",
  isPullProvider,
  pullProviderIndex: isPullProvider ? 0 : nullProviderIndex,
  isPushProvider,
  pushProviderIndex: isPushProvider ? 0 : nullProviderIndex,
  isApproved
});

const approvedPullProvider = makeRoleProvider(providerAddress, true, false);
const approvedPushProvider = makeRoleProvider(pushProviderAddress, false, true);
const removedPullProvider = makeRoleProvider(removedProviderAddress, true, false, false);

const makeCatalogueMarket = (id: string, latestDepositTimestamp?: number): CatalogueMarket => {
  const market = makeMarketData("900000000000000000000");

  return {
    ...market,
    id,
    version: SubgraphMarketVersion.V2,
    controller: null,
    hooksConfig: {
      __typename: "HooksConfig",
      id: `${id}-hooks-config`,
      useOnDeposit: true,
      useOnQueueWithdrawal: false,
      useOnExecuteWithdrawal: false,
      useOnTransfer: true,
      useOnBorrow: false,
      useOnRepay: false,
      useOnCloseMarket: false,
      useOnNukeFromOrbit: false,
      useOnSetMaxTotalSupply: false,
      useOnSetAnnualInterestAndReserveRatioBips: false,
      useOnSetProtocolFeeBips: false,
      depositRequiresAccess: true,
      transferRequiresAccess: true,
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
      id: hooksAddress,
      borrower: borrowerAddress,
      name: "Test hooks",
      kind: SubgraphHooksKind.OpenTerm,
      numMarkets: 2,
      eventIndex: 1,
      hooksTemplate: {
        __typename: "HooksTemplate",
        id: hooksTemplateAddress,
        name: "OpenTermHooks",
        feeRecipient: nullAddress,
        protocolFeeBips: 0,
        originationFeeAsset: null,
        originationFeeAmount: "0",
        disabled: false
      },
      providers: [approvedPullProvider, approvedPushProvider, removedPullProvider]
    },
    latestDeposit: latestDepositTimestamp
      ? [{ __typename: "Deposit", blockTimestamp: latestDepositTimestamp }]
      : [],
    lenders: []
  };
};

const makePeriodicCatalogueMarket = (id: string): CatalogueMarket => {
  const market = makeCatalogueMarket(id);
  if (!market.hooks || !market.hooksConfig) throw Error("Missing hooks fixture");
  market.hooks.kind = SubgraphHooksKind.PeriodicTerm;
  market.hooks.hooksTemplate.name = "PeriodicTermHooks";
  market.hooksConfig.firstWithdrawalWindowStart = 100;
  market.hooksConfig.periodDuration = 100;
  market.hooksConfig.withdrawalWindowDuration = 10;
  market.hooksConfig.pendingAprChangeAnnualInterestBips = 900;
  market.hooksConfig.pendingAprChangeProposalTimestamp = 100;
  market.hooksConfig.pendingAprChangeResponseWindowStart = 150;
  market.hooksConfig.pendingAprChangeResponseWindowEnd = 200;
  return market;
};

const makeLensMarketUpdate = (market: Market): MarketDataV2StructOutput => {
  const flags = {
    useOnDeposit: true,
    useOnQueueWithdrawal: false,
    useOnExecuteWithdrawal: false,
    useOnTransfer: true,
    useOnBorrow: false,
    useOnRepay: false,
    useOnCloseMarket: false,
    useOnNukeFromOrbit: false,
    useOnSetMaxTotalSupply: false,
    useOnSetAnnualInterestAndReserveRatioBips: false,
    useOnSetProtocolFeeBips: false
  };
  const tokenMetadata = {
    token: assetAddress,
    name: "Test Asset",
    symbol: "TST",
    decimals: BigNumber.from(18),
    isMock: false
  };
  const constraints = {
    minimumDelinquencyGracePeriod: 0,
    maximumDelinquencyGracePeriod: 0,
    minimumReserveRatioBips: 0,
    maximumReserveRatioBips: 10_000,
    minimumDelinquencyFeeBips: 0,
    maximumDelinquencyFeeBips: 10_000,
    minimumWithdrawalBatchDuration: 0,
    maximumWithdrawalBatchDuration: 0,
    minimumAnnualInterestBips: 0,
    maximumAnnualInterestBips: 10_000
  };

  return {
    marketToken: { ...tokenMetadata, token: market.address },
    underlyingToken: tokenMetadata,
    hooksFactory: nullAddress,
    borrower: borrowerAddress,
    hooksConfig: {
      hooksAddress,
      flags,
      kind: 1,
      transferRequiresAccess: true,
      depositRequiresAccess: true,
      minimumDeposit: BigNumber.from(0),
      transfersDisabled: false,
      allowForceBuyBacks: false,
      withdrawalRequiresAccess: false,
      fixedTermEndTime: 0,
      allowClosureBeforeTerm: false,
      allowTermReduction: false
    },
    withdrawalBatchDuration: BigNumber.from(market.withdrawalBatchDuration),
    feeRecipient: market.feeRecipient,
    delinquencyFeeBips: BigNumber.from(market.delinquencyFeeBips),
    delinquencyGracePeriod: BigNumber.from(market.delinquencyGracePeriod),
    hooks: {
      hooksAddress,
      borrower: borrowerAddress,
      name: "Lens-refreshed hooks",
      kind: 1,
      hooksTemplate: {
        hooksTemplate: hooksTemplateAddress,
        fees: {
          feeRecipient: nullAddress,
          protocolFeeBips: 0,
          originationFeeToken: { ...tokenMetadata, token: nullAddress },
          originationFeeAmount: BigNumber.from(0),
          borrowerOriginationFeeBalance: BigNumber.from(0),
          borrowerOriginationFeeApproval: BigNumber.from(0)
        },
        exists: true,
        enabled: true,
        index: 0,
        name: "OpenTermHooks",
        totalMarkets: BigNumber.from(2)
      },
      constraints,
      deploymentFlags: { optional: flags, required: flags },
      pullProviders: [],
      pushProviders: [
        {
          providerAddress: pushProviderAddress,
          timeToLive: 7200,
          pullProviderIndex: nullProviderIndex,
          pushProviderIndex: 0
        }
      ],
      totalMarkets: BigNumber.from(2)
    },
    temporaryReserveRatio: market.temporaryReserveRatio,
    originalAnnualInterestBips: BigNumber.from(market.originalAnnualInterestBips),
    originalReserveRatioBips: BigNumber.from(market.originalReserveRatioBips),
    temporaryReserveRatioExpiry: BigNumber.from(market.temporaryReserveRatioExpiry),
    isClosed: market.isClosed,
    protocolFeeBips: BigNumber.from(market.protocolFeeBips),
    reserveRatioBips: BigNumber.from(market.reserveRatioBips),
    annualInterestBips: BigNumber.from(market.annualInterestBips),
    scaleFactor: market.scaleFactor,
    totalSupply: market.totalSupply.raw,
    maxTotalSupply: market.maxTotalSupply.raw,
    scaledTotalSupply: market.scaledTotalSupply,
    totalAssets: market.totalAssets.raw,
    lastAccruedProtocolFees: market.lastAccruedProtocolFees.raw,
    normalizedUnclaimedWithdrawals: market.normalizedUnclaimedWithdrawals.raw,
    scaledPendingWithdrawals: market.scaledPendingWithdrawals,
    pendingWithdrawalExpiry: BigNumber.from(market.pendingWithdrawalExpiry),
    isDelinquent: market.isDelinquent,
    timeDelinquent: BigNumber.from(market.timeDelinquent),
    lastInterestAccruedTimestamp: BigNumber.from(market.lastInterestAccruedTimestamp),
    unpaidWithdrawalBatchExpiries: market.unpaidWithdrawalBatchExpiries,
    coverageLiquidity: market.coverageLiquidity.raw
  };
};

const makeV1LenderState = (): MarketLenderStatusStructOutput => ({
  lender: lenderAddress,
  isAuthorizedOnController: true,
  role: LenderRole.DepositAndWithdraw,
  scaledBalance: BigNumber.from(11),
  normalizedBalance: BigNumber.from(12),
  underlyingBalance: BigNumber.from(13),
  underlyingApproval: BigNumber.from(14)
});

const makeV2LenderState = (): LenderAccountDataStructOutput => ({
  lender: lenderAddress,
  scaledBalance: BigNumber.from(21),
  normalizedBalance: BigNumber.from(22),
  underlyingBalance: BigNumber.from(23),
  underlyingApproval: BigNumber.from(24),
  isBlockedFromDeposits: true,
  lastProvider: {
    timeToLive: 3600,
    providerAddress,
    pullProviderIndex: 0,
    pushProviderIndex: nullProviderIndex
  },
  canRefresh: true,
  lastApprovalTimestamp: 1_700_000_000,
  isKnownLender: true
});

const makeMixedMarketAccounts = () => {
  const provider = new providers.JsonRpcProvider();
  const v1Market = Market.fromSubgraphMarketData(
    SupportedChainId.Sepolia,
    provider,
    makeMarketData("900000000000000000000")
  );
  const v2Market = Market.fromSubgraphMarketData(
    SupportedChainId.Sepolia,
    provider,
    makeCatalogueMarket(secondMarketAddress)
  );
  const v1Account = MarketAccount.fromMarketDataOnly(v1Market, lenderAddress, false);
  const v2Account = MarketAccount.fromMarketDataOnly(v2Market, lenderAddress, false);
  return { provider, v1Account, v2Account };
};

describe("Explore subgraph hydration", () => {
  it("requests totalAssets from both periodic and legacy market queries", () => {
    const queries = [SupportedChainId.Sepolia, SupportedChainId.Mainnet].map((chainId) =>
      print(getAllMarketsForLenderViewDocumentForChain(chainId))
    );

    expect(queries.every((query) => query.includes("totalAssets"))).to.equal(true);
  });

  it("uses a history-free catalogue query with a stable variable set", () => {
    const queries = [SupportedChainId.Sepolia, SupportedChainId.Mainnet].map((chainId) =>
      print(getLenderMarketCatalogueDocumentForChain(chainId))
    );

    for (const query of queries) {
      expect(query).to.include("totalAssets");
      expect(query).to.match(/latestDeposit:\s*depositRecords\(\s*first:\s*1/);
      expect(query).to.include("lenderHooksAccesses");
      expect(query).not.to.include("borrowRecords");
      expect(query).not.to.include("repaymentRecords");
      expect(query).not.to.match(/\bdeposits\s*\(/);
      expect(query).not.to.include("$numDeposits");
      expect(query).not.to.include("$numBorrows");
      expect(query).not.to.include("$numRepayments");
    }
  });

  it("hydrates totalAssets instead of waiting for a Lens update", () => {
    const totalAssets = "987654321012345678901";
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Mainnet,
      new providers.JsonRpcProvider(),
      makeMarketData(totalAssets)
    );

    expect(market.totalAssets.raw.toString()).to.equal(totalAssets);
    expect(market.liquidReserves.raw.toString()).to.equal(totalAssets);
  });

  it("hydrates the stored unpaid withdrawal FIFO", () => {
    const data = makeMarketData("1");
    data.unpaidWithdrawalBatches = [
      { __typename: "WithdrawalBatch", expiry: "100" },
      { __typename: "WithdrawalBatch", expiry: "200" }
    ];
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Mainnet,
      new providers.JsonRpcProvider(),
      data
    );

    expect(market.unpaidWithdrawalBatchExpiries).to.deep.equal([100, 200]);
  });

  it("refreshes V2 markets through the V2 lens", async () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      new providers.JsonRpcProvider(),
      makeCatalogueMarket(marketAddress)
    );
    const constants = sdkConstants as {
      getLensContract: typeof sdkConstants.getLensContract;
      getLensV2Contract: typeof sdkConstants.getLensV2Contract;
    };
    const originalGetLensContract = constants.getLensContract;
    const originalGetLensV2Contract = constants.getLensV2Contract;
    let v2Reads = 0;
    constants.getLensContract = (() => {
      throw Error("V1 lens must not be used for a V2 market");
    }) as typeof sdkConstants.getLensContract;
    constants.getLensV2Contract = (() => ({
      getMarketData: async () => {
        v2Reads += 1;
        return makeLensMarketUpdate(market);
      }
    })) as unknown as typeof sdkConstants.getLensV2Contract;

    try {
      await market.update();
    } finally {
      constants.getLensContract = originalGetLensContract;
      constants.getLensV2Contract = originalGetLensV2Contract;
    }
    expect(v2Reads).to.equal(1);
  });

  it("selects exactly one enabled deployable template per hooks kind", () => {
    const templates = [
      { kind: HooksKind.OpenTerm, enabled: false, hooksTemplate: "disabled" },
      { kind: HooksKind.OpenTerm, enabled: true, hooksTemplate: "enabled" },
      { kind: HooksKind.PeriodicTerm, enabled: true, hooksTemplate: "periodic" }
    ] as unknown as HooksTemplate[];

    expect(getEnabledHooksTemplatesForKind(templates, HooksKind.OpenTerm)).to.have.length(1);
    expect(
      getDeployableHooksTemplateForKind(templates, HooksKind.OpenTerm)?.hooksTemplate
    ).to.equal("enabled");
    expect(() =>
      getDeployableHooksTemplateForKind(
        [templates[1], { ...templates[1], hooksTemplate: "duplicate" }] as HooksTemplate[],
        HooksKind.OpenTerm
      )
    ).to.throw("Multiple enabled hooks templates");
  });

  it("previews the V2.1 periodic APR execution gates in onchain order", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      new providers.JsonRpcProvider(),
      makePeriodicCatalogueMarket(marketAddress)
    );
    const account = MarketAccount.fromMarketDataOnly(market, borrowerAddress, true);

    expect(account.previewSetAPR(900, 199).status).to.equal(SetAprStatus.AprChangeNotReady);
    expect(account.previewSetAPR(900, 400).status).to.equal(SetAprStatus.AprChangeExpired);

    market.scaledPendingWithdrawals = BigNumber.from(1);
    expect(account.previewSetAPR(900, 200).status).to.equal(SetAprStatus.UnpaidWithdrawalsExist);

    market.scaledPendingWithdrawals = BigNumber.from(0);
    market.totalAssets = market.underlyingToken.getAmount(1);
    market.coverageLiquidity = market.underlyingToken.getAmount(2);
    expect(account.previewSetAPR(900, 200).status).to.equal(SetAprStatus.InsufficientReserves);

    market.totalAssets = market.underlyingToken.getAmount(2);
    expect(account.previewSetAPR(900, 200).status).to.equal(SetAprStatus.Ready);
    expect(account.previewSetAPR(1_100, 200)).to.include({
      status: SetAprStatus.Ready,
      willCancelPendingProposal: true
    });
  });

  it("does not advertise borrower-only APR execution as batchable for another payer", async () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      new providers.JsonRpcProvider(),
      makePeriodicCatalogueMarket(marketAddress)
    );
    const payer = MarketAccount.fromMarketDataOnly(market, lenderAddress, true);
    const zero = market.underlyingToken.getAmount(0);
    const quote: PeriodicAprSettlementQuote = {
      status: PeriodicAprSettlementStatus.Ready,
      amountToSettle: zero,
      suggestedApprovalAmount: zero,
      needsRepayment: false,
      needsBatchProcessing: false,
      unpaidBatchCount: 0,
      maxBatches: 0,
      remainingBatchesAfterThisPass: 0,
      settlementIsPermissionless: true,
      isWithdrawalWindowOpen: false,
      responseWindowEnd: 200,
      proposedAprBips: 900
    };

    const plan = await populatePeriodicAprReductionPlan(payer, 900, quote);
    expect(plan.transactions.map(({ kind }) => kind)).to.deep.equal(["executeApr"]);
    expect(plan.safeBatchable).to.equal(false);
  });

  it("normalizes Graph BigInt provider TTLs to the public number type", () => {
    const parsedProvider = parseSubgraphRoleProvider(roleProvider);
    const hooksAccess: SubgraphLenderHooksAccessDataFragment = {
      __typename: "LenderHooksAccess",
      id: "hooks-access",
      lender: borrowerAddress,
      isBlockedFromDeposits: false,
      canRefresh: true,
      lastApprovalTimestamp: 1_000,
      addedTimestamp: 1_000,
      lastProvider: roleProvider
    };
    const credential = parseSubgraphLenderHooksAccess(hooksAccess);

    expect(parsedProvider.timeToLive).to.equal(4_294_967_295);
    expect(credential.lastProvider?.timeToLive).to.equal(4_294_967_295);
    expect(credential.lastApprovalTimestamp + (credential.lastProvider?.timeToLive ?? 0)).to.equal(
      4_294_968_295
    );
  });

  it("hydrates shared hooks, lender access, known status, and latest deposits", async () => {
    const firstLatestDepositTimestamp = 1_700_000_123;
    const data: SubgraphGetLenderMarketCatalogueQuery = {
      __typename: "Query",
      _meta: {
        __typename: "_Meta_",
        block: { __typename: "_Block_", number: 123, timestamp: 1_700_000_456 }
      },
      markets: [
        makeCatalogueMarket(marketAddress, firstLatestDepositTimestamp),
        makeCatalogueMarket(secondMarketAddress)
      ],
      controllerAuthorizations: [],
      lenderHooksAccesses: [
        {
          __typename: "LenderHooksAccess",
          id: "hooks-access",
          lender: lenderAddress,
          isBlockedFromDeposits: true,
          canRefresh: true,
          lastApprovalTimestamp: 1_700_000_000,
          addedTimestamp: 1_699_000_000,
          lastProvider: approvedPullProvider,
          hooks: { __typename: "HooksInstance", id: hooksAddress },
          knownLenderStatuses: [
            {
              __typename: "KnownLenderStatus",
              market: { __typename: "Market", id: marketAddress }
            }
          ]
        }
      ]
    };
    const client = {
      query: async () => ({ data })
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const catalogue = await getLenderMarketCatalogue(client, {
      lender: lenderAddress.toUpperCase(),
      chainId: SupportedChainId.Sepolia,
      signerOrProvider: new providers.JsonRpcProvider()
    });
    const [first, second] = catalogue.accounts;

    expect(catalogue.indexedBlockNumber).to.equal(123);
    expect(catalogue.indexedBlockTimestamp).to.equal(1_700_000_456);
    expect(first.market.hooksInstance).to.equal(second.market.hooksInstance);
    expect(first.market.approvedPullProviders.map((provider) => provider.providerAddress)).to.eql([
      providerAddress
    ]);
    expect(first.market.approvedPushProviders.map((provider) => provider.providerAddress)).to.eql([
      pushProviderAddress
    ]);
    expect(first.market.canSelfOnboard).to.equal(true);
    expect(first.market.latestDepositTimestamp).to.equal(firstLatestDepositTimestamp);
    expect(second.market.latestDepositTimestamp).to.equal(undefined);
    expect(first.credential?.isBlockedFromDeposits).to.equal(true);
    expect(second.credential?.canRefresh).to.equal(true);
    expect(first.credential?.lastApprovalTimestamp).to.equal(1_700_000_000);
    expect(first.credential?.lastProvider?.providerAddress).to.equal(providerAddress);
    expect(first.isKnownLender).to.equal(true);
    expect(second.isKnownLender).to.equal(false);
    expect(first.depositRecords).to.have.length(0);
    expect(second.depositRecords).to.have.length(0);
  });

  it("refreshes the same hooks instance and provider getters with Lens data", () => {
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Sepolia,
      new providers.JsonRpcProvider(),
      makeCatalogueMarket(marketAddress)
    );
    const hooksInstance = market.hooksInstance;

    expect(market.canSelfOnboard).to.equal(true);
    market.updateWith(makeLensMarketUpdate(market));

    expect(market.hooksInstance).to.equal(hooksInstance);
    expect(market.hooksInstance?.name).to.equal("Lens-refreshed hooks");
    expect(market.approvedPullProviders).to.have.length(0);
    expect(market.approvedPushProviders.map((provider) => provider.providerAddress)).to.eql([
      pushProviderAddress
    ]);
    expect(market.canSelfOnboard).to.equal(false);
  });

  it("refreshes mixed V1 and V2 lender state without replacing or reordering accounts", async () => {
    const { provider, v1Account, v2Account } = makeMixedMarketAccounts();
    const accounts = [v2Account, v1Account];
    const v1TotalAssets = v1Account.market.totalAssets;
    const v2TotalAssets = v2Account.market.totalAssets;
    const calls: Array<{ version: string; lender: string; markets: string[] }> = [];

    await withStubbedLenderStateReaders(
      async (lender, markets) => {
        calls.push({ version: "V1", lender, markets });
        return [makeV1LenderState()];
      },
      async (lender, markets) => {
        calls.push({ version: "V2", lender, markets });
        return [makeV2LenderState()];
      },
      async () => {
        const result = await MarketAccount.refreshLenderAccountState(
          SupportedChainId.Sepolia,
          provider,
          lenderAddress,
          accounts
        );

        expect(result).to.equal(accounts);
        expect(result[0]).to.equal(v2Account);
        expect(result[1]).to.equal(v1Account);
      }
    );

    expect(calls).to.deep.equal([
      { version: "V1", lender: lenderAddress, markets: [v1Account.market.address] },
      { version: "V2", lender: lenderAddress, markets: [v2Account.market.address] }
    ]);
    expect(v1Account.isAuthorizedOnController).to.equal(true);
    expect(v1Account.role).to.equal(LenderRole.DepositAndWithdraw);
    expect(v1Account.marketBalance.raw.toString()).to.equal("12");
    expect(v1Account.underlyingBalance.raw.toString()).to.equal("13");
    expect(v1Account.underlyingApproval.toString()).to.equal("14");
    expect(v2Account.credential?.isBlockedFromDeposits).to.equal(true);
    expect(v2Account.credential?.lastProvider?.providerAddress).to.equal(providerAddress);
    expect(v2Account.isKnownLender).to.equal(true);
    expect(v2Account.marketBalance.raw.toString()).to.equal("22");
    expect(v2Account.underlyingBalance.raw.toString()).to.equal("23");
    expect(v2Account.underlyingApproval.toString()).to.equal("24");
    expect(v1Account.market.totalAssets).to.equal(v1TotalAssets);
    expect(v2Account.market.totalAssets).to.equal(v2TotalAssets);
  });

  it("retains access state but zeroes anonymous wallet balances and allowances", async () => {
    const { provider, v1Account, v2Account } = makeMixedMarketAccounts();
    const lensLenders: string[] = [];

    await withStubbedLenderStateReaders(
      async (lender) => {
        lensLenders.push(lender);
        return [makeV1LenderState()];
      },
      async (lender) => {
        lensLenders.push(lender);
        return [makeV2LenderState()];
      },
      () =>
        MarketAccount.refreshLenderAccountState(SupportedChainId.Sepolia, provider, undefined, [
          v1Account,
          v2Account
        ])
    );

    expect(lensLenders).to.deep.equal([nullAddress, nullAddress]);
    expect(v1Account.isAuthorizedOnController).to.equal(true);
    expect(v1Account.role).to.equal(LenderRole.DepositAndWithdraw);
    expect(v2Account.credential?.isBlockedFromDeposits).to.equal(true);
    expect(v2Account.isKnownLender).to.equal(true);
    for (const account of [v1Account, v2Account]) {
      expect(account.scaledMarketBalance.isZero()).to.equal(true);
      expect(account.marketBalance.raw.isZero()).to.equal(true);
      expect(account.underlyingBalance.raw.isZero()).to.equal(true);
      expect(account.underlyingApproval.isZero()).to.equal(true);
    }
  });

  it("returns the original empty collection without constructing a Lens", async () => {
    const accounts: MarketAccount[] = [];
    const result = await MarketAccount.refreshLenderAccountState(
      SupportedChainId.PlasmaMainnet,
      new providers.JsonRpcProvider(),
      lenderAddress,
      accounts
    );

    expect(result).to.equal(accounts);
  });

  it("does not partially apply mixed-version updates when either Lens read fails", async () => {
    const { provider, v1Account, v2Account } = makeMixedMarketAccounts();
    let error: Error | undefined;

    await withStubbedLenderStateReaders(
      async () => [makeV1LenderState()],
      async () => {
        throw new Error("V2 RPC unavailable");
      },
      async () => {
        try {
          await MarketAccount.refreshLenderAccountState(
            SupportedChainId.Sepolia,
            provider,
            lenderAddress,
            [v1Account, v2Account]
          );
        } catch (caught) {
          error = caught as Error;
        }
      }
    );

    expect(error?.message).to.equal("V2 RPC unavailable");
    expect(v1Account.role).to.equal(LenderRole.Null);
    expect(v1Account.marketBalance.raw.isZero()).to.equal(true);
    expect(v2Account.marketBalance.raw.isZero()).to.equal(true);
  });
});
