import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketsWithEventsDocument,
  SubgraphGetMarketsWithEventsQuery,
  SubgraphGetMarketsWithEventsQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";

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
    query: GetMarketsWithEventsDocument,
    variables: { ...variables },
    fetchPolicy
  });

  return (
    result.data.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    ) ?? []
  );
}
