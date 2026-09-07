import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import { WithdrawalBatch } from "../withdrawal-batch";
import { assert } from "../utils";
import { completeWithdrawalBatch } from "./withdrawal-history";
import {
  GetIncompleteWithdrawalsForMarketDocument,
  SubgraphGetIncompleteWithdrawalsForMarketQuery,
  SubgraphGetIncompleteWithdrawalsForMarketQueryVariables,
  SubgraphOrderDirection,
  SubgraphWithdrawalBatch_OrderBy
} from "./graphql";

export type GetIncompleteWithdrawalsForMarketOptions = {
  market: Market;
  first?: number;
  skip?: number;
  /** Retained for compatibility; complete histories always bypass the normalized cache. */
  fetchPolicy?: FetchPolicy;
};

/**
 * Indexed batches which still contain at least one unexecuted lender request.
 * This intentionally includes fully paid batches until every lender has claimed.
 */
export async function getIncompleteWithdrawalsForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, first = 100, skip = 0 }: GetIncompleteWithdrawalsForMarketOptions
): Promise<WithdrawalBatch[]> {
  assert(
    Number.isSafeInteger(first) && first > 0 && first <= 1_000,
    "Invalid withdrawal batch page size"
  );
  assert(Number.isSafeInteger(skip) && skip >= 0, "Invalid withdrawal batch page offset");

  const { data } = await subgraphClient.query<
    SubgraphGetIncompleteWithdrawalsForMarketQuery,
    SubgraphGetIncompleteWithdrawalsForMarketQueryVariables
  >({
    query: GetIncompleteWithdrawalsForMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      numWithdrawalBatches: first,
      skipWithdrawalBatches: skip,
      orderWithdrawalBatches: SubgraphWithdrawalBatch_OrderBy.expiry,
      directionWithdrawalBatches: SubgraphOrderDirection.desc
    },
    fetchPolicy: "no-cache"
  });

  const batches: WithdrawalBatch[] = [];
  for (const batch of data.market?.withdrawalBatches ?? []) {
    const complete = await completeWithdrawalBatch(subgraphClient, batch, data._meta?.block.number);
    batches.push(WithdrawalBatch.fromSubgraphWithdrawalBatch(market, complete));
  }
  return batches;
}
