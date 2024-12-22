import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetBasicBorrowerDataDocument } from "./graphql";

export async function getBasicBorrowerData(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  borrower: string
): Promise<{ isRegisteredBorrower: boolean; hasMarkets: boolean }> {
  const { data } = await subgraphClient.query({
    query: GetBasicBorrowerDataDocument,
    variables: { borrower }
  });
  return {
    isRegisteredBorrower: data.registeredBorrowers[0]?.isRegistered ?? false,
    hasMarkets: data.markets[0]?.id !== null
  };
}
