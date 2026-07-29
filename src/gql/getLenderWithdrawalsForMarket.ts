import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import { WithdrawalBatch } from "../withdrawal-batch";
import { assert } from "../utils";
import {
  GetLenderWithdrawalsForMarketDocument,
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables,
  SubgraphLenderWithdrawalPropertiesWithEventsFragment,
  SubgraphLenderWithdrawalStatus_OrderBy,
  SubgraphOrderDirection
} from "./graphql";

export type GetLenderWithdrawalsForMarketOptions = {
  market: Market;
  lender: string;
  first?: number;
  skip?: number;
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
  {
    market,
    lender,
    first = 200,
    skip = 0,
    fetchPolicy = "cache-first"
  }: GetLenderWithdrawalsForMarketOptions
): Promise<LenderWithdrawalsForMarket> {
  assert(
    Number.isSafeInteger(first) && first > 0 && first <= 1_000,
    "Invalid lender withdrawal page size"
  );
  assert(Number.isSafeInteger(skip) && skip >= 0, "Invalid lender withdrawal page offset");

  const { data } = await subgraphClient.query<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >({
    query: GetLenderWithdrawalsForMarketDocument,
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

  const account = data.market?.lenders[0];
  return {
    incompleteWithdrawals:
      account?.incompleteWithdrawals.map((withdrawal) =>
        hydrateLenderWithdrawal(market, withdrawal)
      ) ?? [],
    completeWithdrawals:
      account?.completeWithdrawals.map((withdrawal) =>
        hydrateLenderWithdrawal(market, withdrawal)
      ) ?? []
  };
}
