import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation
} from "@apollo/client";
import { expect } from "chai";
import {
  getAnalyticsTokenPage,
  getAnnualInterestBipsUpdatePage,
  getBorrowerAnalyticsProfile,
  getBorrowerDailyStatsPage,
  getBorrowerWithdrawalReliabilityPage,
  getDelinquencyStatusChangePage,
  getLatestTokenUsdPrices,
  getLenderAnalyticsProfile,
  getLenderDailyStatsPage,
  getLenderDepositPage,
  getLenderPositionPage,
  getLenderTransferPage,
  getLenderWithdrawalExecutionPage,
  getLenderWithdrawalRequestPage,
  getLenderWithdrawalStatusPage,
  getMarketDailyStatsPage,
  getMarketInterestAccrualPage,
  getProtocolAnalyticsStats,
  getProtocolDailyStatsPage,
  getTokenPriceObservationPage
} from "../../src/analytics";
import {
  SubgraphFeatureUnavailableError,
  SubgraphDeploymentRequirementsByChain,
  SupportedChainId,
  getSubgraphFeatureAvailability
} from "../../src/config";
import { IndexerDeploymentMetadata } from "../../src/domain";

type OperationHandler = (variables: Record<string, unknown>) => Record<string, unknown>;

const transactionHash = `0x${"a".repeat(64)}`;
const borrower = "0x00000000000000000000000000000000000000b0";
const lender = "0x00000000000000000000000000000000000000c0";
const marketAddress = "0x00000000000000000000000000000000000000d0";
const tokenAddress = "0x00000000000000000000000000000000000000e0";

const metadataFor = (chainId: SupportedChainId): IndexerDeploymentMetadata => ({
  ...SubgraphDeploymentRequirementsByChain[chainId],
  configDigest: "f".repeat(64),
  firstObserved: {
    blockNumber: 1n,
    blockTimestamp: 2n,
    transactionHash,
    logIndex: 3n
  }
});

const graphPricingMode = (mode: IndexerDeploymentMetadata["pricingMode"]): string => {
  if (mode === "chainlink") return "CHAINLINK";
  if (mode === "synthetic-testnet") return "SYNTHETIC_TESTNET";
  if (mode === "none") return "NONE";
  return "UNKNOWN";
};

const graphMetadata = (metadata: IndexerDeploymentMetadata) => ({
  indexerDeployments: [
    {
      id: "deployment",
      chainId: String(metadata.chainId),
      network: metadata.network,
      graphNetwork: metadata.graphNetwork,
      schemaRelease: metadata.schemaRelease,
      configDigest: metadata.configDigest,
      archController: metadata.archController,
      sanctionsSentinel: metadata.sanctionsSentinel,
      analyticsEnabled: metadata.analyticsEnabled,
      collateralEnabled: metadata.collateralEnabled,
      wrappersEnabled: metadata.wrappersEnabled,
      pricingMode: graphPricingMode(metadata.pricingMode),
      firstObservedBlock: String(metadata.firstObserved.blockNumber),
      firstObservedTimestamp: String(metadata.firstObserved.blockTimestamp),
      firstObservedTransaction: metadata.firstObserved.transactionHash,
      firstObservedLogIndex: String(metadata.firstObserved.logIndex)
    }
  ]
});

const token = {
  id: tokenAddress,
  address: tokenAddress,
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  isMock: false,
  isUsdStablecoin: false,
  priceSource: "CHAINLINK_DIRECT",
  priceFeed0: "0x00000000000000000000000000000000000000f0",
  priceFeed1: null
};

const market = {
  id: marketAddress,
  address: marketAddress,
  name: "Market",
  borrower,
  createdAtTimestamp: "100",
  isClosed: false,
  annualInterestBips: 1_000,
  originalAnnualInterestBips: 900,
  delinquencyGracePeriod: 3_600,
  maxTotalSupply: "1000000",
  scaledTotalSupply: "500000",
  scaleFactor: "1000000000000000000000000000",
  isDelinquent: true,
  isIncurringPenalties: false,
  totalDebtUSD: "500000.123456",
  asset: token
};

const eventFields = {
  blockNumber: 200,
  blockTimestamp: 300,
  transactionHash,
  blockLogIndex: 4
};

const queryMetadata = {
  deployment: "test-deployment",
  hasIndexingErrors: false,
  block: {
    number: 999,
    timestamp: 1_234,
    hash: `0x${"b".repeat(64)}`
  }
};

const createClient = (
  metadata: IndexerDeploymentMetadata,
  handlers: Record<string, OperationHandler>
): { client: ApolloClient<NormalizedCacheObject>; operations: Operation[] } => {
  const operations: Operation[] = [];
  const link = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        operations.push(operation);
        try {
          const handlerData = handlers[operation.operationName]?.(operation.variables);
          const data =
            operation.operationName === "getIndexerDeployment"
              ? graphMetadata(metadata)
              : handlerData
              ? { _meta: queryMetadata, ...handlerData }
              : undefined;
          if (data === undefined) throw new Error(`Unhandled operation ${operation.operationName}`);
          observer.next({ data });
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })
  );
  return {
    client: new ApolloClient({ cache: new InMemoryCache(), link }),
    operations
  };
};

const borrowerTotals = {
  totalDepositedUSD: "100.0000001",
  totalBorrowedUSD: "90.0000002",
  totalRepaidUSD: "20.0000003",
  totalWithdrawalsRequestedUSD: "10.0000004",
  totalWithdrawalsExecutedUSD: "9.0000005",
  totalBaseInterestAccruedUSD: "1.0000006",
  totalDelinquencyFeesAccruedUSD: "0.1000007",
  totalProtocolFeesAccruedUSD: "0.0100008"
};

describe("V2.5 indexed analytics reads", () => {
  it("normalizes borrower, lender, market, and protocol read models losslessly", async () => {
    const { client, operations } = createClient(metadataFor(SupportedChainId.Sepolia), {
      getBorrowerAnalyticsProfile: () => ({
        borrower: {
          id: borrower,
          address: borrower,
          firstSeenBlock: "10",
          firstSeenTimestamp: "11",
          firstSeenTransaction: transactionHash,
          firstSeenLogIndex: "12",
          lastSeenBlock: "20",
          lastSeenTimestamp: "21",
          lastSeenTransaction: transactionHash,
          lastSeenLogIndex: "22",
          registrations: [
            {
              isRegistered: true,
              archController: {
                id: SubgraphDeploymentRequirementsByChain[SupportedChainId.Sepolia].archController
              }
            }
          ]
        },
        borrowerStats_collection: [
          {
            id: `BORROWER-STATS-${borrower}`,
            borrower,
            ...borrowerTotals,
            numMarkets: 2,
            numActiveMarkets: 1,
            numDelinquentMarkets: 1,
            numClosedMarkets: 0,
            numBatchesExpired: 3,
            numBatchesExpiredUnpaid: 1,
            numBatchesPaidLate: 1
          }
        ]
      }),
      getBorrowerDailyStatsPage: () => ({
        borrowerDailyStats_collection: [
          {
            id: "BORROWER-DAILY-a",
            borrower,
            startTimestamp: 86_400,
            endTimestamp: 172_800,
            dayDepositedUSD: "10",
            dayBorrowedUSD: "9",
            dayRepaidUSD: "2",
            dayWithdrawalsRequestedUSD: "1",
            dayWithdrawalsExecutedUSD: "0.9",
            dayBaseInterestAccruedUSD: "0.1",
            dayDelinquencyFeesAccruedUSD: "0.01",
            dayProtocolFeesAccruedUSD: "0.001",
            ...borrowerTotals,
            numMarkets: 2,
            numActiveMarkets: 1,
            numDelinquentMarkets: 1,
            numClosedMarkets: 0
          }
        ]
      }),
      getMarketDailyStatsPage: () => ({
        marketDailyStats_collection: [
          {
            id: "MARKET-DAILY-a",
            startTimestamp: 86_400,
            endTimestamp: 172_800,
            market,
            dayDeposited: "10",
            dayWithdrawalsRequested: "9",
            dayWithdrawalsExecuted: "8",
            dayBorrowed: "7",
            dayRepaid: "6",
            dayBaseInterestAccrued: "5",
            dayDelinquencyFeesAccrued: "4",
            dayProtocolFeesAccrued: "3",
            totalBorrowed: "100",
            totalRepaid: "90",
            totalBaseInterestAccrued: "80",
            totalDelinquencyFeesAccrued: "70",
            totalProtocolFeesAccrued: "60",
            totalDeposited: "50",
            totalWithdrawalsRequested: "40",
            totalWithdrawalsExecuted: "30",
            totalBorrowedUSD: "100.1",
            totalRepaidUSD: "90.2",
            totalBaseInterestAccruedUSD: "80.3",
            totalDelinquencyFeesAccruedUSD: "70.4",
            totalProtocolFeesAccruedUSD: "60.5",
            totalDepositedUSD: "50.6",
            totalWithdrawalsRequestedUSD: "40.7",
            totalWithdrawalsExecutedUSD: "30.8",
            scaledTotalSupply: "500000",
            scaleFactor: "1000000000000000000000000000",
            usdPrice: null
          }
        ]
      }),
      getDelinquencyStatusChangePage: () => ({
        delinquencyStatusChangeds: [
          {
            id: "RECORD-a",
            market,
            isDelinquent: true,
            liquidityCoverageRequired: "123",
            totalAssets: "100",
            ...eventFields
          }
        ]
      }),
      getLenderAnalyticsProfile: () => ({
        lenderStats_collection: [
          {
            id: `LENDER-STATS-${lender}`,
            lender,
            firstSeenTimestamp: 42,
            totalDepositedUSD: "100.1",
            totalWithdrawalsRequestedUSD: "20.2",
            totalWithdrawalsExecutedUSD: "19.3",
            totalInterestEarnedUSD: "4.4",
            numMarkets: 2,
            numActiveMarkets: 1
          }
        ]
      }),
      getLenderPositionPage: () => ({
        lenderAccounts: [
          {
            id: `LENDER-${marketAddress}-${lender}`,
            address: lender,
            market,
            scaledBalance: "123",
            totalDeposited: "456",
            totalInterestEarned: "7",
            lastScaleFactor: "1000000000000000000000000000",
            addedTimestamp: 44,
            lastUpdatedTimestamp: 45,
            numPendingWithdrawalBatches: 1,
            snapshot: {
              source: "EVENT_PROJECTION",
              scaledBalance: "123",
              role: "DepositAndWithdraw",
              totalDeposited: "456",
              lastScaleFactor: "1000000000000000000000000000",
              lastUpdatedTimestamp: 45,
              lastUpdatedBlockNumber: 200,
              totalInterestEarned: "7",
              numPendingWithdrawalBatches: 1,
              updatedAtBlock: "200",
              updatedAtTimestamp: "300",
              updatedAtTransaction: transactionHash,
              updatedAtLogIndex: "4"
            }
          }
        ]
      }),
      getProtocolAnalyticsStats: () => ({
        protocolStats: {
          id: "PROTOCOL_STATS",
          ...borrowerTotals,
          numMarkets: 4,
          numActiveMarkets: 3,
          numDelinquentMarkets: 1,
          numClosedMarkets: 0,
          numActiveBorrowers: 2,
          numActiveLenders: 5,
          numActiveLenderAccounts: 6
        }
      }),
      getProtocolDailyStatsPage: () => ({
        protocolDailyStats_collection: [
          {
            id: "PROTOCOL-86400",
            startTimestamp: 86_400,
            endTimestamp: 172_800,
            dayDepositedUSD: "10",
            dayBorrowedUSD: "9",
            dayRepaidUSD: "8",
            dayWithdrawalsRequestedUSD: "7",
            dayWithdrawalsExecutedUSD: "6",
            dayBaseInterestAccruedUSD: "5",
            dayDelinquencyFeesAccruedUSD: "4",
            dayProtocolFeesAccruedUSD: "3",
            ...borrowerTotals,
            numMarkets: 4,
            numActiveMarkets: 3,
            numDelinquentMarkets: 1,
            numClosedMarkets: 0,
            numActiveBorrowers: 2,
            numActiveLenders: 5,
            numActiveLenderAccounts: 6
          }
        ]
      })
    });

    const profile = await getBorrowerAnalyticsProfile(client, {
      borrower,
      fetchPolicy: "no-cache"
    });
    expect(profile.identity?.firstSeen.blockNumber).to.equal(10n);
    expect(profile.stats?.totalDepositedUSD).to.equal("100.0000001");
    expect(profile.indexedAt.blockNumber).to.equal(999n);

    const daily = await getBorrowerDailyStatsPage(client, {
      borrower,
      first: 1,
      fetchPolicy: "no-cache"
    });
    expect(daily.pageInfo.nextCursor).to.deep.equal({
      entityId: "BORROWER-DAILY-a",
      blockNumber: 999n
    });
    expect(daily.items[0].dayProtocolFeesAccruedUSD).to.equal("0.001");
    await getBorrowerDailyStatsPage(client, {
      borrower,
      first: 1,
      after: daily.pageInfo.nextCursor,
      fetchPolicy: "no-cache"
    });

    const marketDaily = await getMarketDailyStatsPage(client, {
      borrower,
      first: 2,
      fetchPolicy: "no-cache"
    });
    expect(marketDaily.items[0].dayDeposited).to.equal(10n);
    expect(marketDaily.items[0].usdPrice).to.equal(undefined);
    expect(marketDaily.items[0].market.totalDebtUSD).to.equal("500000.123456");

    const delinquency = await getDelinquencyStatusChangePage(client, {
      markets: [marketAddress.toUpperCase()],
      fetchPolicy: "no-cache"
    });
    expect(delinquency.items[0].liquidityCoverageRequired).to.equal(123n);

    expect(
      (await getLenderAnalyticsProfile(client, { lender, fetchPolicy: "no-cache" })).stats
        ?.totalInterestEarnedUSD
    ).to.equal("4.4");
    const positions = await getLenderPositionPage(client, {
      lender,
      activeOnly: true,
      fetchPolicy: "no-cache"
    });
    expect(positions.items[0].scaledBalance).to.equal(123n);
    expect(positions.items[0].snapshot?.blockNumber).to.equal(200n);

    expect((await getProtocolAnalyticsStats(client, "no-cache")).stats?.numActiveLenders).to.equal(
      5
    );
    expect(
      (await getProtocolDailyStatsPage(client, { fetchPolicy: "no-cache" })).items[0].dayBorrowedUSD
    ).to.equal("9");

    const borrowerDailyOperation = operations.filter(
      ({ operationName }) => operationName === "getBorrowerDailyStatsPage"
    )[1];
    expect(borrowerDailyOperation?.variables).to.deep.include({ first: 1 });
    expect(borrowerDailyOperation?.variables.filter).to.deep.include({
      borrower,
      id_gt: "BORROWER-DAILY-a"
    });
    expect(borrowerDailyOperation?.variables.block).to.deep.equal({ number: 999 });
  });

  it("normalizes lender activity while retaining exact account and market identity", async () => {
    const account = { id: `LENDER-${marketAddress}-${lender}`, address: lender };
    const { client, operations } = createClient(metadataFor(SupportedChainId.Sepolia), {
      getLenderDepositPage: () => ({
        deposits: [
          {
            id: "RECORD-deposit",
            account,
            market,
            assetAmount: "1000000",
            scaledAmount: "900000",
            ...eventFields
          }
        ]
      }),
      getLenderTransferPage: () => ({
        transfers: [
          {
            id: "RECORD-transfer",
            market,
            from: account,
            to: { id: `LENDER-${marketAddress}-other`, address: borrower },
            amount: "100",
            scaledAmount: "90",
            ...eventFields
          }
        ]
      })
    });

    const deposits = await getLenderDepositPage(client, {
      lender,
      markets: [marketAddress],
      fetchPolicy: "no-cache"
    });
    expect(deposits.items[0]).to.include({ kind: "deposit", lender, assetAmount: 1_000_000n });

    const transfers = await getLenderTransferPage(client, {
      lender,
      direction: "out",
      fetchPolicy: "no-cache"
    });
    expect(transfers.items[0]).to.include({ kind: "transfer", from: lender, to: borrower });
    expect(
      operations.find(({ operationName }) => operationName === "getLenderTransferPage")?.variables
        .filter
    ).to.deep.include({ from_: { address: lender } });
  });

  it("normalizes the remaining analytics history surfaces and their scopes", async () => {
    const account = { id: `LENDER-${marketAddress}-${lender}`, address: lender };
    const batch = {
      id: `BATCH-${marketAddress}-400`,
      expiry: "400",
      isClosed: true,
      isExpired: true,
      isCompleted: false
    };
    const { client, operations } = createClient(metadataFor(SupportedChainId.Sepolia), {
      getBorrowerWithdrawalReliabilityPage: () => ({
        withdrawalBatches: [
          {
            ...batch,
            market,
            totalNormalizedRequests: "1000",
            updatedAtBlock: "210",
            updatedAtTimestamp: "310",
            updatedAtTransaction: transactionHash,
            updatedAtLogIndex: "5",
            expiration: {
              normalizedAmountPaid: "900",
              normalizedAmountOwed: "1000",
              blockNumber: "205",
              blockTimestamp: "305",
              transactionHash,
              blockLogIndex: "6"
            }
          }
        ]
      }),
      getMarketInterestAccrualPage: () => ({
        marketInterestAccrueds: [
          {
            id: "RECORD-interest",
            market,
            fromTimestamp: 250,
            toTimestamp: 300,
            timeWithPenalties: 10,
            baseInterestRay: "1000000000000000000000000000",
            delinquencyFeeRay: "2000000000000000000000000000",
            baseInterestAccrued: "11",
            delinquencyFeesAccrued: "12",
            protocolFeesAccrued: "13",
            ...eventFields
          }
        ]
      }),
      getAnnualInterestBipsUpdatePage: () => ({
        annualInterestBipsUpdateds: [
          {
            id: "RECORD-apr",
            market,
            oldAnnualInterestBips: 900,
            newAnnualInterestBips: 1_000,
            ...eventFields
          }
        ]
      }),
      getLenderDailyStatsPage: () => ({
        lenderDailyStats_collection: [
          {
            id: "LENDER-DAILY-a",
            lender,
            startTimestamp: 86_400,
            endTimestamp: 172_800,
            dayDepositedUSD: "10.1",
            dayWithdrawalsRequestedUSD: "2.2",
            dayWithdrawalsExecutedUSD: "1.3",
            dayInterestEarnedUSD: "0.4",
            totalDepositedUSD: "100.1",
            totalWithdrawalsRequestedUSD: "20.2",
            totalWithdrawalsExecutedUSD: "19.3",
            totalInterestEarnedUSD: "4.4",
            numMarkets: 2,
            numActiveMarkets: 1
          }
        ]
      }),
      getLenderWithdrawalRequestPage: () => ({
        withdrawalRequests: [
          {
            id: "RECORD-request",
            account,
            market,
            batch,
            scaledAmount: "81",
            normalizedAmount: "90",
            ...eventFields
          }
        ]
      }),
      getLenderWithdrawalExecutionPage: () => ({
        withdrawalExecutions: [
          {
            id: "RECORD-execution",
            account,
            batch: { ...batch, market },
            normalizedAmount: "70",
            ...eventFields
          }
        ]
      }),
      getLenderWithdrawalStatusPage: () => ({
        lenderWithdrawalStatuses: [
          {
            id: "WDSTAT-a",
            account: { ...account, market },
            batch,
            scaledAmount: "81",
            normalizedAmountWithdrawn: "70",
            totalNormalizedRequests: "90",
            isCompleted: false,
            updatedAtBlock: "210",
            updatedAtTimestamp: "310",
            updatedAtTransaction: transactionHash,
            updatedAtLogIndex: "5"
          }
        ]
      }),
      getAnalyticsTokens: () => ({ tokens: [token] })
    });

    const reliability = await getBorrowerWithdrawalReliabilityPage(client, {
      borrower,
      fetchPolicy: "no-cache"
    });
    expect(reliability.items[0].expiration).to.deep.include({
      normalizedAmountPaid: 900n,
      normalizedAmountOwed: 1_000n
    });

    const interest = await getMarketInterestAccrualPage(client, {
      borrower,
      fromTimestamp: 200,
      toTimestamp: 400,
      fetchPolicy: "no-cache"
    });
    expect(interest.items[0]).to.include({
      baseInterestAccrued: 11n,
      delinquencyFeesAccrued: 12n,
      protocolFeesAccrued: 13n
    });

    const apr = await getAnnualInterestBipsUpdatePage(client, {
      markets: [marketAddress.toUpperCase()],
      fetchPolicy: "no-cache"
    });
    expect(apr.items[0]).to.include({ oldAnnualInterestBips: 900, newAnnualInterestBips: 1_000 });

    const lenderDaily = await getLenderDailyStatsPage(client, {
      lender,
      fetchPolicy: "no-cache"
    });
    expect(lenderDaily.items[0].dayInterestEarnedUSD).to.equal("0.4");

    const request = await getLenderWithdrawalRequestPage(client, {
      lender,
      markets: [marketAddress],
      fetchPolicy: "no-cache"
    });
    expect(request.items[0]).to.include({
      kind: "withdrawal-request",
      scaledAmount: 81n,
      normalizedAmount: 90n
    });

    const execution = await getLenderWithdrawalExecutionPage(client, {
      lender,
      markets: [marketAddress],
      fetchPolicy: "no-cache"
    });
    expect(execution.items[0]).to.include({
      kind: "withdrawal-execution",
      normalizedAmount: 70n
    });

    const status = await getLenderWithdrawalStatusPage(client, {
      lender,
      markets: [marketAddress],
      fetchPolicy: "no-cache"
    });
    expect(status.items[0]).to.include({
      scaledAmount: 81n,
      normalizedAmountWithdrawn: 70n,
      totalNormalizedRequests: 90n
    });

    const tokens = await getAnalyticsTokenPage(client, {
      addresses: [tokenAddress.toUpperCase()],
      fetchPolicy: "no-cache"
    });
    expect(tokens.items[0]).to.include({ address: tokenAddress, priceSource: "chainlink-direct" });

    const operationFilter = (operationName: string) =>
      operations.find((operation) => operation.operationName === operationName)?.variables.filter;
    expect(operationFilter("getBorrowerWithdrawalReliabilityPage")).to.deep.include({
      market_: { borrower }
    });
    expect(operationFilter("getMarketInterestAccrualPage")).to.deep.include({
      market_: { borrower },
      fromTimestamp_gte: 200,
      fromTimestamp_lt: 400
    });
    expect(operationFilter("getAnnualInterestBipsUpdatePage")).to.deep.include({
      market_in: [marketAddress]
    });
    expect(operationFilter("getLenderWithdrawalRequestPage")).to.deep.include({
      account_: { address: lender, market_in: [marketAddress] }
    });
  });

  it("preserves price provenance and returns explicit unpriced reasons", async () => {
    const observation = {
      id: `PRICE-${tokenAddress}-86400`,
      token,
      timestamp: 86_400,
      priceUSD: "0.99991234",
      source: "CHAINLINK_DIRECT",
      observedAtBlock: "500",
      observedAtTimestamp: "600",
      observedAtTransaction: transactionHash,
      observedAtLogIndex: "7"
    };
    const { client } = createClient(metadataFor(SupportedChainId.Sepolia), {
      getAnalyticsTokens: () => ({ tokens: [token] }),
      getLatestTokenPriceObservation: () => ({ tokenDailyPrices: [observation] }),
      getTokenPriceObservationPage: () => ({ tokenDailyPrices: [observation] })
    });

    const page = await getTokenPriceObservationPage(client, {
      tokens: [tokenAddress],
      fetchPolicy: "no-cache"
    });
    expect(page.items[0].priceUSD).to.equal("0.99991234");
    expect(page.items[0].source).to.equal("chainlink-direct");
    expect(page.items[0].observedAt.blockNumber).to.equal(500n);

    const latest = await getLatestTokenUsdPrices(client, {
      tokens: [tokenAddress, borrower],
      fetchPolicy: "no-cache"
    });
    expect(latest.indexedAt.blockNumber).to.equal(999n);
    expect(latest.prices[0]).to.include({
      status: "priced",
      priceUSD: "0.99991234",
      basis: "observation"
    });
    expect(latest.prices[1]).to.deep.equal({
      status: "unpriced",
      address: borrower,
      reason: "token-not-indexed"
    });
  });

  it("does not query observations when deployment pricing is disabled", async () => {
    const operations: string[] = [];
    const plasmaToken = { ...token, isUsdStablecoin: false, priceSource: null };
    const { client, operations: clientOperations } = createClient(
      metadataFor(SupportedChainId.PlasmaMainnet),
      {
        getAnalyticsTokens: () => ({ tokens: [plasmaToken] })
      }
    );

    const { prices } = await getLatestTokenUsdPrices(client, {
      tokens: [tokenAddress],
      fetchPolicy: "no-cache"
    });
    const [quote] = prices;
    operations.push(...clientOperations.map(({ operationName }) => operationName));
    expect(quote).to.include({ status: "unpriced", reason: "pricing-disabled" });
    expect(operations).not.to.include("getLatestTokenPriceObservation");
  });

  it("reports every optional module independently from deployment metadata", () => {
    const disabled = {
      ...metadataFor(SupportedChainId.Sepolia),
      analyticsEnabled: false,
      collateralEnabled: false,
      wrappersEnabled: false,
      pricingMode: "none" as const
    };
    expect(getSubgraphFeatureAvailability(disabled, "analytics")).to.deep.equal({
      feature: "analytics",
      available: false,
      reason: "analytics-disabled"
    });
    expect(getSubgraphFeatureAvailability(disabled, "collateral")).to.deep.equal({
      feature: "collateral",
      available: false,
      reason: "collateral-disabled"
    });
    expect(getSubgraphFeatureAvailability(disabled, "wrappers")).to.deep.equal({
      feature: "wrappers",
      available: false,
      reason: "wrappers-disabled"
    });
    expect(getSubgraphFeatureAvailability(disabled, "pricing")).to.deep.equal({
      feature: "pricing",
      available: false,
      reason: "analytics-disabled"
    });
  });

  it("fails analytics reads before querying feature data when analytics is disabled", async () => {
    const metadata = { ...metadataFor(SupportedChainId.Sepolia), analyticsEnabled: false };
    const { client, operations } = createClient(metadata, {});

    let failure: unknown;
    try {
      await getBorrowerAnalyticsProfile(client, { borrower, fetchPolicy: "no-cache" });
    } catch (error) {
      failure = error;
    }

    expect(failure).to.be.instanceOf(SubgraphFeatureUnavailableError);
    expect((failure as SubgraphFeatureUnavailableError).reason).to.equal("analytics-disabled");
    expect(operations.map(({ operationName }) => operationName)).to.deep.equal([
      "getIndexerDeployment"
    ]);
  });
});
