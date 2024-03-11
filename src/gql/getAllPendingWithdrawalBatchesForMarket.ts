import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetAllPendingWithdrawalBatchesForMarketDocument,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
} from "./graphql";
import { WithdrawalBatch } from "../withdrawal-batch";

export async function getAllPendingWithdrawalBatchesForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  market: Market,
  fetchPolicy: FetchPolicy
): Promise<WithdrawalBatch[]> {
  const result = await subgraphClient.query<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >({
    query: GetAllPendingWithdrawalBatchesForMarketDocument,
    variables: { market: market.address.toLowerCase() },
    fetchPolicy
  });
  return (
    result.data.market?.withdrawalBatches.map((batch) =>
      WithdrawalBatch.fromSubgraphWithdrawalBatch(market, batch)
    ) ?? []
  );
}
