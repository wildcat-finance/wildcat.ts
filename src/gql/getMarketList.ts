import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketListDocument,
  SubgraphGetMarketListQuery,
  SubgraphGetMarketListQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";

export type MarketListItem = SubgraphGetMarketListQuery["markets"][number];

export type GetMarketListOptions = SubgraphGetMarketListQueryVariables & {
  fetchPolicy: FetchPolicy;
};

export type GetMarketListAsMarketsOptions = GetMarketListOptions & {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketList(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy, ...variables }: GetMarketListOptions
): Promise<MarketListItem[]> {
  const result = await subgraphClient.query<
    SubgraphGetMarketListQuery,
    SubgraphGetMarketListQueryVariables
  >({
    query: GetMarketListDocument,
    variables,
    fetchPolicy
  });

  return result.data.markets;
}

export async function getMarketListAsMarkets(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketListAsMarketsOptions
): Promise<Market[]> {
  const markets = await getMarketList(subgraphClient, {
    fetchPolicy,
    ...variables
  });

  return markets.map((market) => Market.fromSubgraphMarketData(chainId, signerOrProvider, market));
}
