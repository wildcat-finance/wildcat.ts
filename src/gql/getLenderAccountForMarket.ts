import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetLenderAccountForMarketDocument,
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables
} from "./graphql";
import { MarketAccount } from "../account";
import { assert } from "../utils";
import { usesLegacySubgraphSchema } from "../config";
import { assertMatchingAddress } from "../internal/read-identity";
import {
  LegacyGetLenderAccountForMarketDocument,
  LegacyLenderAccountData,
  normalizeLegacyLenderAccountData
} from "./legacy-subgraph";

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
  const normalizedLender = lender.toLowerCase();
  if (usesLegacySubgraphSchema(market.chainId)) {
    const result = await subgraphClient.query<{
      market?: { id: string; lenders: LegacyLenderAccountData[] } | null;
    }>({
      query: LegacyGetLenderAccountForMarketDocument,
      variables: {
        market: market.address.toLowerCase(),
        lender: normalizedLender,
        ...variables
      },
      fetchPolicy
    });
    const marketData = result.data.market;
    assert(!!marketData, `Market not found in subgraph: ${market.address}`);
    assertMatchingAddress(marketData.id, market.address, "Subgraph lender market");
    if (!marketData.lenders.length) {
      return MarketAccount.fromMarketDataOnly(market, normalizedLender, false);
    }
    assertMatchingAddress(marketData.lenders[0]!.address, lender, "Subgraph lender");
    return MarketAccount.fromSubgraphAccountData(
      market,
      normalizeLegacyLenderAccountData(marketData.lenders[0]!)
    );
  }

  const result = await subgraphClient.query<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >({
    query: GetLenderAccountForMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      lender: normalizedLender,
      ...variables
    },
    fetchPolicy
  });
  const marketData = result.data.market;
  assert(!!marketData, `Market not found in subgraph: ${market.address}`);
  assertMatchingAddress(marketData.id, market.address, "Subgraph lender market");
  if (!marketData.lenders.length) {
    return MarketAccount.fromMarketDataOnly(market, lender, false);
  }
  assertMatchingAddress(marketData.lenders[0]!.address, lender, "Subgraph lender");
  return MarketAccount.fromSubgraphAccountData(market, marketData.lenders[0]!);
}
