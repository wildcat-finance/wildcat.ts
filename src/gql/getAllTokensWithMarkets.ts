import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllTokensWithMarketsDocument,
  SubgraphGetAllTokensWithMarketsQuery,
  SubgraphGetAllTokensWithMarketsQueryVariables
} from "./graphql";

export async function getAllTokensWithMarkets(
  subgraphClient: ApolloClient<NormalizedCacheObject>
): Promise<SubgraphGetAllTokensWithMarketsQuery["tokens"]> {
  const { data } = await subgraphClient.query<
    SubgraphGetAllTokensWithMarketsQuery,
    SubgraphGetAllTokensWithMarketsQueryVariables
  >({
    query: GetAllTokensWithMarketsDocument
  });
  return data.tokens;
}
