import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAuthorizedLendersByMarketDocument,
  SubgraphGetAuthorizedLendersByMarketQuery,
  SubgraphGetAuthorizedLendersByMarketQueryVariables
} from "./graphql";

type GetLenderAccountForMarketOptions = SubgraphGetAuthorizedLendersByMarketQueryVariables & {
  fetchPolicy: FetchPolicy;
};

export async function getAuthorisedLendersByMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, fetchPolicy }: GetLenderAccountForMarketOptions
): Promise<string[]> {
  const result = await subgraphClient.query<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >({
    query: GetAuthorizedLendersByMarketDocument,
    variables: { market: market.toLowerCase() },
    fetchPolicy
  });
  return result.data.market?.controller.authorizedLenders.map((lender) => lender.lender) ?? [];
}
