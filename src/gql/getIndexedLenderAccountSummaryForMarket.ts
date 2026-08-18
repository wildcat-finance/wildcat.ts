import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { MarketAccount } from "../account";
import { usesLegacySubgraphSchema } from "../config";
import { Market } from "../market";
import { assert } from "../utils";
import {
  GetIndexedLenderAccountSummaryForMarketDocument,
  SubgraphGetIndexedLenderAccountSummaryForMarketQuery,
  SubgraphGetIndexedLenderAccountSummaryForMarketQueryVariables
} from "./graphql";
import {
  LegacyGetIndexedLenderAccountSummaryForMarketDocument,
  LegacyLenderAccountData,
  normalizeLegacyLenderAccountData
} from "./legacy-subgraph";

export type GetIndexedLenderAccountSummaryForMarketOptions = {
  market: Market;
  lender: string;
  fetchPolicy?: FetchPolicy;
};

/**
 * Indexed lender-account state for one market without deposit history.
 * Use a live account read before making action or authorization decisions.
 */
export async function getIndexedLenderAccountSummaryForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, lender, fetchPolicy = "cache-first" }: GetIndexedLenderAccountSummaryForMarketOptions
): Promise<MarketAccount> {
  const normalizedLender = lender.toLowerCase();
  if (usesLegacySubgraphSchema(market.chainId)) {
    const { data } = await subgraphClient.query<{
      market?: { id: string; lenders: LegacyLenderAccountData[] } | null;
    }>({
      query: LegacyGetIndexedLenderAccountSummaryForMarketDocument,
      variables: {
        market: market.address.toLowerCase(),
        lender: normalizedLender
      },
      fetchPolicy
    });

    assert(!!data.market, `Market not found in subgraph: ${market.address}`);
    const lenderData = data.market.lenders[0];
    if (!lenderData) {
      return MarketAccount.fromMarketDataOnly(market, normalizedLender, false);
    }
    return MarketAccount.fromSubgraphAccountData(
      market,
      normalizeLegacyLenderAccountData(lenderData)
    );
  }

  const { data } = await subgraphClient.query<
    SubgraphGetIndexedLenderAccountSummaryForMarketQuery,
    SubgraphGetIndexedLenderAccountSummaryForMarketQueryVariables
  >({
    query: GetIndexedLenderAccountSummaryForMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      lender: normalizedLender
    },
    fetchPolicy
  });

  assert(!!data.market, `Market not found in subgraph: ${market.address}`);
  const lenderData = data.market.lenders[0];
  if (!lenderData) {
    return MarketAccount.fromMarketDataOnly(market, normalizedLender, false);
  }
  return MarketAccount.fromSubgraphAccountData(market, lenderData);
}
