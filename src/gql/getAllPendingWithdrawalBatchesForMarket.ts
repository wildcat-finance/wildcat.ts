import { IndexedTraversalOptions } from "../indexed-pagination";
import { IndexedPageProgress, withIndexedTraversal } from "../internal/indexed-traversal";
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
  _fetchPolicy: FetchPolicy,
  options: IndexedTraversalOptions = {}
): Promise<WithdrawalBatch[]> {
  return withIndexedTraversal(options, async (traversal) => {
    const batches: WithdrawalBatch[] = [];
    let block: { number: number } | undefined;
    const progress = new IndexedPageProgress(
      true,
      undefined,
      "Withdrawal batch page did not advance"
    );
    for (let skip = 0; ; skip += 100) {
      const { data } = await traversal.query<
        SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
        SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
      >(subgraphClient, {
        query: GetAllPendingWithdrawalBatchesForMarketDocument,
        variables: { market: market.address.toLowerCase(), ...(skip ? { skip, block } : {}) },
        fetchPolicy: "no-cache"
      });
      const page = data.market?.withdrawalBatches ?? [];
      traversal.accept(page, 100, progress);
      if (block)
        assert(data._meta?.block.number === block.number, "Withdrawal history block changed");
      for (const batch of page) {
        const complete = await completeWithdrawalBatch(
          subgraphClient,
          batch,
          data._meta?.block.number,
          traversal
        );
        batches.push(WithdrawalBatch.fromSubgraphWithdrawalBatch(market, complete));
      }
      if (page.length < 100) return batches;
      block = withdrawalHistoryBlock(data._meta?.block.number);
    }
  });
}
