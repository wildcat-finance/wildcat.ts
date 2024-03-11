import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketsForBorrowerDocument,
  SubgraphGetMarketsForBorrowerQuery,
  SubgraphGetMarketsForBorrowerQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";

type GetMarketsForBorrowerOptions = SubgraphGetMarketsForBorrowerQueryVariables & {
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketsForBorrower(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { borrower, chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketsForBorrowerOptions
): Promise<Market[]> {
  const result = await subgraphClient.query<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >({
    query: GetMarketsForBorrowerDocument,
    variables: { borrower: borrower.toLowerCase(), ...variables },
    fetchPolicy
  });

  const controller = result.data.controllers[0];
  if (controller) {
    return (
      controller.markets.map((market) =>
        Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
      ) ?? []
    );
  }
  return [];
}
