import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  SubgraphGetMarketsWithEventsQuery,
  SubgraphGetMarketsWithEventsQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { getMarketsWithEventsDocumentForChain } from "./document-selectors";

type GetMarketsWithEventsOptions = SubgraphGetMarketsWithEventsQueryVariables & {
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketsWithEvents(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketsWithEventsOptions
): Promise<Market[]> {
  const result = await subgraphClient.query<
    SubgraphGetMarketsWithEventsQuery,
    SubgraphGetMarketsWithEventsQueryVariables
  >({
    query: getMarketsWithEventsDocumentForChain(chainId),
    variables: { ...variables },
    fetchPolicy
  });

  return (
    result.data.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    ) ?? []
  );
}
