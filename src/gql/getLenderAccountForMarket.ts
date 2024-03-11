import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetLenderAccountForMarketDocument,
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables
} from "./graphql";
import { MarketAccount } from "../account";
import { assert } from "../utils";

type GetLenderAccountForMarketOptions = Omit<
  SubgraphGetLenderAccountForMarketQueryVariables,
  "market"
> & {
  market: Market;
  fetchPolicy: FetchPolicy;
};

export async function getLenderAccountForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, lender, fetchPolicy, ...variables }: GetLenderAccountForMarketOptions
): Promise<MarketAccount> {
  const result = await subgraphClient.query<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >({
    query: GetLenderAccountForMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      lender: lender.toLowerCase(),
      ...variables
    },
    fetchPolicy
  });
  const marketData = result.data.market;
  assert(!!marketData, `Market not found in subgraph: ${market.address}`);
  if (!marketData.lenders.length) {
    return MarketAccount.fromMarketDataOnly(market, lender, false);
  }
  return MarketAccount.fromSubgraphAccountData(market, marketData.lenders[0]!);
}
