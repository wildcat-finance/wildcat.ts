import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketsForAllBorrowersDocument,
  SubgraphGetMarketsForAllBorrowersQuery,
  SubgraphGetMarketsForAllBorrowersQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";

type GetMarketsForAllBorrowersOptions = SubgraphGetMarketsForAllBorrowersQueryVariables & {
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketsForAllBorrowers(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketsForAllBorrowersOptions
): Promise<Market[]> {
  const result = await subgraphClient.query<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >({
    query: GetMarketsForAllBorrowersDocument,
    variables: { ...variables },
    fetchPolicy
  });

  return (
    result.data.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    ) ?? []
  );
}
