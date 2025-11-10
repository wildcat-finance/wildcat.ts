import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketsWithEventsDocument,
  SubgraphGetMarketsWithEventsQuery,
  SubgraphGetMarketsWithEventsQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";

type GetMarketsForBorrowerOptions = SubgraphGetMarketsWithEventsQueryVariables & {
  borrower: string;
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketsForBorrower(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { borrower, chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketsForBorrowerOptions
): Promise<Market[]> {
  const result = await subgraphClient.query<
    SubgraphGetMarketsWithEventsQuery,
    SubgraphGetMarketsWithEventsQueryVariables
  >({
    query: GetMarketsWithEventsDocument,
    variables: {
      marketFilter: { borrower: borrower.toLowerCase(), ...variables.marketFilter },
      ...variables
    },
    fetchPolicy
  });

  return (
    result.data.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    ) ?? []
  );
}
