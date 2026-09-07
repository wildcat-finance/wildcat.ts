import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetAllPendingWithdrawalBatchesForMarketDocument,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
} from "./graphql";
import { WithdrawalBatch } from "../withdrawal-batch";
import { assert } from "../utils";
import { completeWithdrawalBatch, withdrawalHistoryBlock } from "./withdrawal-history";

/** Complete pending-batch history. Cache policy is retained only for call-site compatibility. */
export async function getAllPendingWithdrawalBatchesForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  market: Market,
  _fetchPolicy: FetchPolicy
): Promise<WithdrawalBatch[]> {
  const batches: WithdrawalBatch[] = [];
  let block: { number: number } | undefined;
  let lastId: string | undefined;
  for (let skip = 0; ; skip += 100) {
    const { data } = await subgraphClient.query<
      SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
      SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
    >({
      query: GetAllPendingWithdrawalBatchesForMarketDocument,
      variables: { market: market.address.toLowerCase(), ...(skip ? { skip, block } : {}) },
      fetchPolicy: "no-cache"
    });
    const page = data.market?.withdrawalBatches ?? [];
    if (lastId && page.length) assert(page[0].id > lastId, "Withdrawal batch page did not advance");
    if (block)
      assert(data._meta?.block.number === block.number, "Withdrawal history block changed");
    for (const batch of page) {
      const complete = await completeWithdrawalBatch(
        subgraphClient,
        batch,
        data._meta?.block.number
      );
      batches.push(WithdrawalBatch.fromSubgraphWithdrawalBatch(market, complete));
    }
    if (page.length < 100) return batches;
    lastId = page[page.length - 1].id;
    block = withdrawalHistoryBlock(data._meta?.block.number);
  }
}
