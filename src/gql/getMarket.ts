import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketDocument,
  SubgraphGetMarketQuery,
  SubgraphGetMarketQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { usesLegacySubgraphSchema } from "../config";
import {
  LegacyGetMarketDocument,
  LegacyMarketData,
  normalizeLegacyMarketData
} from "./legacy-subgraph";

export type GetMarketOptions = SubgraphGetMarketQueryVariables & {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  fetchPolicy: FetchPolicy;
};

export async function getMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, market, signerOrProvider, ...variables }: GetMarketOptions
): Promise<Market | undefined> {
  if (usesLegacySubgraphSchema(chainId)) {
    const result = await subgraphClient.query<{ market?: LegacyMarketData | null }>({
      query: LegacyGetMarketDocument,
      variables: {
        market: market.toLowerCase(),
        ...variables
      },
      fetchPolicy
    });
    return result.data.market
      ? Market.fromSubgraphMarketData(
          chainId,
          signerOrProvider,
          normalizeLegacyMarketData(chainId, result.data.market)
        )
      : undefined;
  }

  const result = await subgraphClient.query<
    SubgraphGetMarketQuery,
    SubgraphGetMarketQueryVariables
  >({
    query: GetMarketDocument,
    variables: {
      market: market.toLowerCase(),
      ...variables
    },
    fetchPolicy
  });
  const marketData = result.data.market;
  return marketData
    ? Market.fromSubgraphMarketData(chainId, signerOrProvider, marketData)
    : undefined;
}

/** Indexed market detail; call `market.update()` or `hydrateMarketsLive` for current state. */
export const getIndexedMarket = getMarket;
