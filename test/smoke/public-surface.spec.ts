import { expect } from "chai";
import * as sdk from "../../src";
import * as typechain from "../../src/typechain";

describe("SDK public surface smoke", () => {
  it("exports the canonical read helpers and explicit V2 compatibility wrappers", () => {
    expect(typeof sdk.getMarket).to.equal("function");
    expect(typeof sdk.getMarketV2).to.equal("function");
    expect(typeof sdk.getMarkets).to.equal("function");
    expect(typeof sdk.getAllMarkets).to.equal("function");
    expect(typeof sdk.getMarketsCount).to.equal("function");
    expect(typeof sdk.getPaginatedMarkets).to.equal("function");
    expect(typeof sdk.getIndexedMarket).to.equal("function");
    expect(typeof sdk.getIndexedMarketList).to.equal("function");
    expect(typeof sdk.hydrateMarketsLive).to.equal("function");
    expect(typeof sdk.getMarketAccount).to.equal("function");
    expect(typeof sdk.getMarketAccountV2).to.equal("function");
    expect(typeof sdk.getMarketAccountsForLender).to.equal("function");
    expect(typeof sdk.getAllMarketAccountsForLender).to.equal("function");
    expect(typeof sdk.getPaginatedMarketAccounts).to.equal("function");
    expect(typeof sdk.getIndexedLenderAccountsForMarkets).to.equal("function");
    expect(typeof sdk.hydrateMarketAccountsLive).to.equal("function");
    expect(typeof sdk.getMarketEventPage).to.equal("function");
    expect(typeof sdk.getBorrowerAnalyticsProfile).to.equal("function");
    expect(typeof sdk.getBorrowerDailyStatsPage).to.equal("function");
    expect(typeof sdk.getLenderAnalyticsProfile).to.equal("function");
    expect(typeof sdk.getLenderPositionPage).to.equal("function");
    expect(typeof sdk.getMarketAggregatePage).to.equal("function");
    expect(typeof sdk.getMarketBorrowPage).to.equal("function");
    expect(typeof sdk.getMarketDailyStatsPage).to.equal("function");
    expect(typeof sdk.getMarketDebtRepaymentPage).to.equal("function");
    expect(typeof sdk.getMaxTotalSupplyUpdatePage).to.equal("function");
    expect(typeof sdk.getProtocolAnalyticsStats).to.equal("function");
    expect(typeof sdk.getLatestTokenUsdPrices).to.equal("function");
    expect(typeof sdk.collectIndexedPages).to.equal("function");
    expect(typeof sdk.getTokenData).to.equal("function");
    expect(typeof sdk.getTokensData).to.equal("function");
    expect(typeof sdk.getTokenWrapperDataForMarket).to.equal("function");
    expect(typeof sdk.createInterestOnlyWithdrawalQuote).to.equal("function");
    expect(typeof sdk.getIndexedLenderAccountSummaryForMarket).to.equal("function");
    expect(typeof sdk.getIncompleteLenderWithdrawalsForMarket).to.equal("function");
    expect(typeof sdk.getIncompleteWithdrawalsForMarket).to.equal("function");
    expect(typeof sdk.getLenderWithdrawalsForMarket).to.equal("function");
    expect(typeof sdk.getWithdrawalBatch).to.equal("function");
    expect(typeof sdk.getWithdrawalForLender).to.equal("function");
    expect(typeof sdk.normalizeWildcatClient).to.equal("function");
    expect(typeof sdk.requireWildcatWriteClient).to.equal("function");
    expect(Array.isArray(sdk.marketLensV2_5Abi)).to.equal(true);
    expect(Array.isArray(sdk.wildcatArchControllerAbi)).to.equal(true);
    expect("typechain" in sdk).to.equal(false);
    expect("GetMarketDocument" in sdk).to.equal(false);
    expect("SubgraphOrderDirection" in sdk).to.equal(false);
  });

  it("keeps the legacy dist/typechain subpath available for existing app code", () => {
    expect(typeof typechain.CheckBorrowersRegistered__factory.bytecode).to.equal("string");
    expect(typeof typechain.CheckSafeSignature__factory.bytecode).to.equal("string");
    expect(typeof typechain.ISafe__factory.connect).to.equal("function");
    expect(typeof typechain.WildcatMarket__factory.connect).to.equal("function");
    expect(typeof typechain.WildcatMarketV2__factory.connect).to.equal("function");
  });

  it("exports periodic term hooks and APR settlement helpers", () => {
    expect(typeof sdk.PeriodicTermHooks).to.equal("function");
    expect(typeof sdk.PeriodicTermHooksTemplate).to.equal("function");
    expect(sdk.PeriodicAprSettlementStatus.Ready).to.equal("Ready");
    expect(typeof sdk.getPeriodicAprReductionSettlementQuote).to.equal("function");
    expect(typeof sdk.populatePeriodicAprReductionPlan).to.equal("function");
  });

  it("exports the V2.5 domain and deployment-target model", () => {
    expect(sdk.MarketKinds).to.deep.equal(["standard", "revolving", "unknown"]);
    expect(typeof sdk.parseMarketKind).to.equal("function");
    expect(typeof sdk.getConfiguredHooksFactoryTargets).to.equal("function");
    expect(typeof sdk.getConfiguredMarketKindForHooksFactory).to.equal("function");
    expect(typeof sdk.getHooksFactoryAddress).to.equal("function");
    expect(typeof sdk.getHooksFactories).to.equal("function");
    expect(typeof sdk.getHooksTemplateRegistrations).to.equal("function");
    expect(typeof sdk.getHooksFactoryDeploymentTargetIssues).to.equal("function");
    expect(typeof sdk.getBorrowerHooksData).to.equal("function");
    expect(typeof sdk.getMarketOnboardingMode).to.equal("function");
    expect(typeof sdk.getBorrowerPrincipalIdentity).to.equal("function");
    expect(typeof sdk.getMarketBorrowerChanges).to.equal("function");
    expect(typeof sdk.getHookAuthority).to.equal("function");
    expect(typeof sdk.getRoleProviderAuthority).to.equal("function");
    expect(typeof sdk.getPolicyAccessListMembers).to.equal("function");
    expect(typeof sdk.encodeMarketSalt).to.equal("function");
    expect(typeof sdk.isMarketSaltFormatValid).to.equal("function");
    expect(typeof sdk.isMarketSaltForFactoryCaller).to.equal("function");
    expect(typeof sdk.readMarketTransferRecipientAllowed).to.equal("function");
    expect(typeof sdk.prepareRequestMarketBorrowerTransfer).to.equal("function");
    expect(typeof sdk.prepareAddAccessListMembers).to.equal("function");
    expect(sdk.MarketOnboardingMode.SelfOnboard).to.equal("self-onboard");
    expect(sdk.MarketOnboardingMode.BorrowerApproval).to.equal("borrower-approval");
    expect("MarketTypes" in sdk).to.equal(false);
  });
});
