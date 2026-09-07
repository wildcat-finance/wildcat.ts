import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { assert } from "../utils";
import {
  GetWithdrawalBatchChildrenDocument,
  GetLenderWithdrawalChildrenDocument,
  SubgraphGetWithdrawalBatchChildrenQuery,
  SubgraphGetLenderWithdrawalChildrenQuery,
  SubgraphWithdrawalBatchPropertiesFragment,
  SubgraphWithdrawalBatchPropertiesWithEventsFragment,
  SubgraphLenderWithdrawalPropertiesWithEventsFragment
} from "./graphql";

const CHILD_PAGE_SIZE = 100;
type Children = Partial<
  Pick<
    SubgraphWithdrawalBatchPropertiesWithEventsFragment,
    "payments" | "withdrawals" | "requests" | "executions"
  >
>;
const childKeys = ["payments", "withdrawals", "requests", "executions"] as const;

// Never mutate Apollo results. Page every requested collection at the parent read's
// block; a missing parent or stalled page is an error, not a silently partial history.
const completeChildren = async <T extends Children>(
  initial: T,
  load: (skip: number) => Promise<Children>
): Promise<T> => {
  const result = { ...initial };
  const keys = childKeys.filter((key) => initial[key] !== undefined);
  let page: Children = initial;
  for (
    let skip = CHILD_PAGE_SIZE;
    keys.some((key) => page[key]?.length === CHILD_PAGE_SIZE);
    skip += CHILD_PAGE_SIZE
  ) {
    page = await load(skip);
    for (const key of keys) {
      const next = page[key];
      assert(next !== undefined, `Missing withdrawal history collection: ${key}`);
      const prior = result[key] ?? [];
      if (next.length && prior.length) {
        assert(next[0].id > prior[prior.length - 1].id, "Withdrawal history page did not advance");
      }
      Object.assign(result, { [key]: [...prior, ...next] });
    }
  }
  return result;
};

export const withdrawalHistoryBlock = (blockNumber?: number): { number: number } => {
  assert(
    blockNumber !== undefined && Number.isSafeInteger(blockNumber) && blockNumber >= 0,
    "Withdrawal history pagination requires the indexed block number"
  );
  return { number: blockNumber };
};

export const completeWithdrawalBatch = async <
  T extends SubgraphWithdrawalBatchPropertiesFragment & Children
>(
  client: ApolloClient<NormalizedCacheObject>,
  batch: T,
  blockNumber?: number
): Promise<T> =>
  completeChildren(batch, async (skip) => {
    const { data } = await client.query<SubgraphGetWithdrawalBatchChildrenQuery>({
      query: GetWithdrawalBatchChildrenDocument,
      variables: {
        id: batch.id,
        skip,
        block: withdrawalHistoryBlock(blockNumber),
        includeEvents: batch.withdrawals !== undefined
      },
      fetchPolicy: "no-cache"
    });
    assert(data.withdrawalBatch != null, "Withdrawal batch missing at indexed block");
    return data.withdrawalBatch;
  });

export const completeLenderWithdrawal = async (
  client: ApolloClient<NormalizedCacheObject>,
  withdrawal: SubgraphLenderWithdrawalPropertiesWithEventsFragment,
  blockNumber?: number
): Promise<SubgraphLenderWithdrawalPropertiesWithEventsFragment> => {
  const batch = await completeWithdrawalBatch(client, withdrawal.batch, blockNumber);
  return completeChildren({ ...withdrawal, batch }, async (skip) => {
    const { data } = await client.query<SubgraphGetLenderWithdrawalChildrenQuery>({
      query: GetLenderWithdrawalChildrenDocument,
      variables: { id: withdrawal.id, skip, block: withdrawalHistoryBlock(blockNumber) },
      fetchPolicy: "no-cache"
    });
    assert(data.lenderWithdrawalStatus != null, "Lender withdrawal missing at indexed block");
    return data.lenderWithdrawalStatus;
  });
};
