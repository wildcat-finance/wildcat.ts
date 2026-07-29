import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import { WithdrawalBatch } from "../withdrawal-batch";
import { assert } from "../utils";
import {
  GetIncompleteLenderWithdrawalsForMarketDocument,
  SubgraphGetIncompleteLenderWithdrawalsForMarketQuery,
  SubgraphGetIncompleteLenderWithdrawalsForMarketQueryVariables,
  SubgraphLenderWithdrawalStatus_OrderBy,
  SubgraphOrderDirection
} from "./graphql";

export type GetIncompleteLenderWithdrawalsForMarketOptions = {
  market: Market;
  lender: string;
  first?: number;
  skip?: number;
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
    fetchPolicy = "cache-first"
  }: GetIncompleteLenderWithdrawalsForMarketOptions
): Promise<LenderWithdrawalStatus[]> {
  assert(
    Number.isSafeInteger(first) && first > 0 && first <= 1_000,
    "Invalid lender withdrawal page size"
  );
  assert(Number.isSafeInteger(skip) && skip >= 0, "Invalid lender withdrawal page offset");

  const { data } = await subgraphClient.query<
    SubgraphGetIncompleteLenderWithdrawalsForMarketQuery,
    SubgraphGetIncompleteLenderWithdrawalsForMarketQueryVariables
  >({
    query: GetIncompleteLenderWithdrawalsForMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      lender: lender.toLowerCase(),
      numWithdrawals: first,
      skipWithdrawals: skip,
      orderWithdrawals: SubgraphLenderWithdrawalStatus_OrderBy.batchExpiry,
      directionWithdrawals: SubgraphOrderDirection.desc
    },
    fetchPolicy
  });

  return (
    data.market?.lenders[0]?.incompleteWithdrawals.map((withdrawal) => {
      const batch = WithdrawalBatch.fromSubgraphWithdrawalBatch(market, withdrawal.batch);
      return LenderWithdrawalStatus.fromSubgraphLenderWithdrawalStatus(market, batch, withdrawal);
    }) ?? []
  );
}
