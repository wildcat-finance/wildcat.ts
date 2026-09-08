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
  GetLenderWithdrawalsForMarketDocument,
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables,
  SubgraphLenderWithdrawalPropertiesWithEventsFragment,
  SubgraphLenderWithdrawalStatus_OrderBy,
  SubgraphOrderDirection
} from "./graphql";
import { LegacyGetLenderWithdrawalsForMarketDocument } from "./legacy-subgraph";

export type GetLenderWithdrawalsForMarketOptions = IndexedTraversalOptions & {
  market: Market;
  lender: string;
  first?: number;
  skip?: number;
  /** Retained for compatibility; complete histories always bypass the normalized cache. */
  fetchPolicy?: FetchPolicy;
};

export type LenderWithdrawalsForMarket = {
  incompleteWithdrawals: LenderWithdrawalStatus[];
  completeWithdrawals: LenderWithdrawalStatus[];
};

const hydrateLenderWithdrawal = (
  market: Market,
  data: SubgraphLenderWithdrawalPropertiesWithEventsFragment
): LenderWithdrawalStatus => {
  const batch = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, data.batch);
  return LenderWithdrawalStatus.fromSubgraphLenderWithdrawalStatus(market, batch, data);
};

/**
 * Indexed lender withdrawal history for one market, ordered by newest batch.
 * Hydrate the returned statuses through the lens before using claimable amounts
 * or completion state for an action decision.
 */
export async function getLenderWithdrawalsForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, lender, first = 200, skip = 0, limits, signal }: GetLenderWithdrawalsForMarketOptions
): Promise<LenderWithdrawalsForMarket> {
  return withIndexedTraversal({ limits, signal }, async (traversal) => {
    assert(
      Number.isSafeInteger(first) && first > 0 && first <= 1_000,
      "Invalid lender withdrawal page size"
    );
    assert(Number.isSafeInteger(skip) && skip >= 0, "Invalid lender withdrawal page offset");

    const legacySchema = usesLegacySubgraphSchema(market.chainId);

    const { data } = await traversal.query<
      SubgraphGetLenderWithdrawalsForMarketQuery,
      SubgraphGetLenderWithdrawalsForMarketQueryVariables
    >(subgraphClient, {
      query: legacySchema
        ? LegacyGetLenderWithdrawalsForMarketDocument
        : GetLenderWithdrawalsForMarketDocument,
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

    const account = data.market?.lenders[0];
    const result: LenderWithdrawalsForMarket = {
      incompleteWithdrawals: [],
      completeWithdrawals: []
    };
    for (const key of ["incompleteWithdrawals", "completeWithdrawals"] as const) {
      traversal.accept(account?.[key] ?? [], first);
      for (const withdrawal of account?.[key] ?? []) {
        const complete = await completeLenderWithdrawal(
          subgraphClient,
          withdrawal,
          data._meta?.block.number,
          traversal
        );
        result[key].push(hydrateLenderWithdrawal(market, complete));
      }
    }
    return result;
  });
}
