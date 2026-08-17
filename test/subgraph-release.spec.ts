import { expect } from "chai";
import { print } from "graphql";
import {
  SubgraphUrls,
  SupportedChainId,
  supportsPeriodicTermHooks,
  supportsSubgraphAnalytics
} from "../src/constants";
import {
  getAccountsWhereLenderAuthorizedOrActiveDocumentForChain,
  getAllMarketsDocumentForChain,
  getAllMarketsForLenderViewDocumentForChain,
  getLenderAccountWithMarketDocumentForChain,
  getLenderMarketCatalogueDocumentForChain,
  getMarketDocumentForChain,
  getMarketEventsDocumentForChain,
  getMarketsWithEventsDocumentForChain,
  getPolicyMarketsAndLendersDocumentForChain
} from "../src/gql/document-selectors";
import {
  GetAnalyticsTokenPricesDocument,
  GetBorrowerAnalyticsDailyPageDocument,
  GetBorrowerAnalyticsStatsDocument,
  GetBorrowerWithdrawalReliabilityPageDocument,
  GetLenderAnalyticsDailyPageDocument,
  GetLenderAnalyticsStatsDocument,
  GetMarketAnalyticsDailyPageDocument,
  GetMarketAnalyticsDocument,
  GetProtocolAnalyticsDailyPageDocument,
  GetProtocolAnalyticsStatsDocument
} from "../src/gql/graphql";

describe("SDK 3.1.17 subgraph release matrix", () => {
  it("routes every supported chain to its maintained subgraph release", () => {
    expect(SubgraphUrls).to.deep.equal({
      [SupportedChainId.Sepolia]:
        "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/sepolia/v2.1.8/gn",
      [SupportedChainId.Mainnet]:
        "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/mainnet/v2.0.30/gn",
      [SupportedChainId.PlasmaTestnet]:
        "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-testnet/v2.0.30/gn",
      [SupportedChainId.PlasmaMainnet]:
        "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-mainnet/v2.0.30/gn"
    });
    for (const chainId of Object.values(SupportedChainId).filter(
      (value): value is SupportedChainId => typeof value === "number"
    )) {
      expect(supportsSubgraphAnalytics(chainId)).to.equal(true);
    }
    expect(supportsPeriodicTermHooks(SupportedChainId.Sepolia)).to.equal(true);
    expect(supportsPeriodicTermHooks(SupportedChainId.Mainnet)).to.equal(false);
    expect(supportsPeriodicTermHooks(SupportedChainId.PlasmaMainnet)).to.equal(false);
    expect(supportsPeriodicTermHooks(SupportedChainId.PlasmaTestnet)).to.equal(false);
  });

  it("uses PTH documents only on Sepolia for every dual-schema operation", () => {
    const selectors = [
      getAccountsWhereLenderAuthorizedOrActiveDocumentForChain,
      getAllMarketsDocumentForChain,
      getAllMarketsForLenderViewDocumentForChain,
      getLenderAccountWithMarketDocumentForChain,
      getLenderMarketCatalogueDocumentForChain,
      getMarketDocumentForChain,
      getMarketEventsDocumentForChain,
      getMarketsWithEventsDocumentForChain,
      getPolicyMarketsAndLendersDocumentForChain
    ];
    const periodicTermMarkers = [
      "firstWithdrawalWindowStart",
      "PeriodicTermUpdated",
      "annualInterestBipsReductionProposalRecords"
    ];
    for (const selector of selectors) {
      const sepoliaDocument = print(selector(SupportedChainId.Sepolia));
      expect(periodicTermMarkers.some((marker) => sepoliaDocument.includes(marker))).to.equal(true);
      for (const chainId of [
        SupportedChainId.Mainnet,
        SupportedChainId.PlasmaMainnet,
        SupportedChainId.PlasmaTestnet
      ]) {
        const legacyDocument = print(selector(chainId));
        expect(periodicTermMarkers.some((marker) => legacyDocument.includes(marker))).to.equal(
          false
        );
      }
    }
  });

  it("exports analytics documents that use explicit daily and cumulative fields", () => {
    const documents = [
      GetAnalyticsTokenPricesDocument,
      GetBorrowerAnalyticsDailyPageDocument,
      GetBorrowerAnalyticsStatsDocument,
      GetBorrowerWithdrawalReliabilityPageDocument,
      GetLenderAnalyticsDailyPageDocument,
      GetLenderAnalyticsStatsDocument,
      GetMarketAnalyticsDailyPageDocument,
      GetMarketAnalyticsDocument,
      GetProtocolAnalyticsDailyPageDocument,
      GetProtocolAnalyticsStatsDocument
    ];
    for (const document of documents) {
      expect(print(document)).not.to.contain("firstWithdrawalWindowStart");
    }
    const marketDaily = print(GetMarketAnalyticsDailyPageDocument);
    expect(marketDaily).to.contain("dayDeposited");
    expect(marketDaily).to.contain("cumulativeDeposited");
    expect(marketDaily).to.contain("cumulativeUsdTotalsComplete");
  });
});
