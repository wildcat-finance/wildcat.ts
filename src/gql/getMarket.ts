import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import { SubgraphGetMarketQuery, SubgraphGetMarketQueryVariables } from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { getMarketDocumentForChain } from "./document-selectors";

export type GetMarketOptions = SubgraphGetMarketQueryVariables & {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  fetchPolicy: FetchPolicy;
};

export async function getMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, market, signerOrProvider, ...variables }: GetMarketOptions
): Promise<Market | undefined> {
  const result = await subgraphClient.query<
    SubgraphGetMarketQuery,
    SubgraphGetMarketQueryVariables
  >({
    query: getMarketDocumentForChain(chainId),
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
