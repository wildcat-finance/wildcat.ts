import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { MarketAccount } from "../account";
import { Market } from "../market";
import { assert } from "../utils";
import {
  GetIndexedLenderAccountSummaryForMarketDocument,
  SubgraphGetIndexedLenderAccountSummaryForMarketQuery,
  SubgraphGetIndexedLenderAccountSummaryForMarketQueryVariables
} from "./graphql";

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
  const { data } = await subgraphClient.query<
    SubgraphGetIndexedLenderAccountSummaryForMarketQuery,
    SubgraphGetIndexedLenderAccountSummaryForMarketQueryVariables
  >({
    query: GetIndexedLenderAccountSummaryForMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      lender: lender.toLowerCase()
    },
    fetchPolicy
  });

  assert(!!data.market, `Market not found in subgraph: ${market.address}`);
  const lenderData = data.market.lenders[0];
  if (!lenderData) {
    return MarketAccount.fromMarketDataOnly(market, lender, false);
  }
  return MarketAccount.fromSubgraphAccountData(market, lenderData);
}
