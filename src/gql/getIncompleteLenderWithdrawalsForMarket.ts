import { IndexedTraversalOptions } from "../indexed-pagination";
import { withIndexedTraversal } from "../internal/indexed-traversal";
import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { usesLegacySubgraphSchema } from "../config";
import { Market } from "../market";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import { WithdrawalBatch } from "../withdrawal-batch";
import { assert } from "../utils";
import { completeLenderWithdrawal } from "./withdrawal-history";
import {
  GetIncompleteLenderWithdrawalsForMarketDocument,
  SubgraphGetIncompleteLenderWithdrawalsForMarketQuery,
  SubgraphGetIncompleteLenderWithdrawalsForMarketQueryVariables,
  SubgraphLenderWithdrawalStatus_OrderBy,
  SubgraphOrderDirection
} from "./graphql";
import { LegacyGetIncompleteLenderWithdrawalsForMarketDocument } from "./legacy-subgraph";

export type GetIncompleteLenderWithdrawalsForMarketOptions = IndexedTraversalOptions & {
  market: Market;
  lender: string;
  first?: number;
  skip?: number;
  /** Retained for compatibility; complete histories always bypass the normalized cache. */
  fetchPolicy?: FetchPolicy;
};

/**
 * Indexed, incomplete lender withdrawals for one market, ordered by newest batch.
 * Hydrate the returned statuses through the lens before using claimable amounts
 * or completion state for an action decision.
 */
export async function getIncompleteLenderWithdrawalsForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    market,
    lender,
    first = 200,
    skip = 0,
    limits,
    signal
  }: GetIncompleteLenderWithdrawalsForMarketOptions
): Promise<LenderWithdrawalStatus[]> {
  return withIndexedTraversal({ limits, signal }, async (traversal) => {
    assert(
      Number.isSafeInteger(first) && first > 0 && first <= 1_000,
      "Invalid lender withdrawal page size"
    );
    assert(Number.isSafeInteger(skip) && skip >= 0, "Invalid lender withdrawal page offset");

    const legacySchema = usesLegacySubgraphSchema(market.chainId);

    const { data } = await traversal.query<
      SubgraphGetIncompleteLenderWithdrawalsForMarketQuery,
      SubgraphGetIncompleteLenderWithdrawalsForMarketQueryVariables
    >(subgraphClient, {
      query: legacySchema
        ? LegacyGetIncompleteLenderWithdrawalsForMarketDocument
        : GetIncompleteLenderWithdrawalsForMarketDocument,
      variables: {
        market: market.address.toLowerCase(),
        lender: lender.toLowerCase(),
        numWithdrawals: first,
        skipWithdrawals: skip,
        orderWithdrawals: (legacySchema
          ? "batch__expiry"
          : SubgraphLenderWithdrawalStatus_OrderBy.batchExpiry) as SubgraphLenderWithdrawalStatus_OrderBy,
        directionWithdrawals: SubgraphOrderDirection.desc
      },
      fetchPolicy: "no-cache"
    });

    traversal.accept(data.market?.lenders[0]?.incompleteWithdrawals ?? [], first);
    const withdrawals: LenderWithdrawalStatus[] = [];
    for (const withdrawal of data.market?.lenders[0]?.incompleteWithdrawals ?? []) {
      const complete = await completeLenderWithdrawal(
        subgraphClient,
        withdrawal,
        data._meta?.block.number,
        traversal
      );
      const batch = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, complete.batch);
      withdrawals.push(
        LenderWithdrawalStatus.fromSubgraphLenderWithdrawalStatus(market, batch, complete)
      );
    }
    return withdrawals;
  });
}
