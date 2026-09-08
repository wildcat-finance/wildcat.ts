import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { assert } from "../utils";
import { IndexedPageProgress, IndexedTraversal } from "../internal/indexed-traversal";
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
type ChildRecord = NonNullable<Children[keyof Children]>[number];
const childKeys = ["payments", "withdrawals", "requests", "executions"] as const;

// Never mutate Apollo results. Page every requested collection at the parent read's
// block; a missing parent or stalled page is an error, not a silently partial history.
const completeChildren = async <T extends Children>(
  initial: T,
  load: (skip: number) => Promise<Children>,
  traversal: IndexedTraversal
): Promise<T> => {
  const result = { ...initial };
  const keys = childKeys.filter((key) => initial[key] !== undefined);
  const progress = new Map(
    keys.map((key) => [
      key,
      new IndexedPageProgress(true, undefined, "Withdrawal history page did not advance")
    ])
  );
  for (const key of keys) {
    const items = initial[key]!;
    traversal.accept(items, CHILD_PAGE_SIZE, progress.get(key));
    Object.assign(result, { [key]: [...items] });
  }
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
      traversal.accept(next, CHILD_PAGE_SIZE, progress.get(key));
      // These arrays are owned by this read; append without repeatedly copying all history.
      (result[key] as ChildRecord[]).push(...next);
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
  blockNumber: number | undefined,
  traversal: IndexedTraversal
): Promise<T> =>
  completeChildren(
    batch,
    async (skip) => {
      const { data } = await traversal.query<SubgraphGetWithdrawalBatchChildrenQuery>(client, {
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
    },
    traversal
  );

export const completeLenderWithdrawal = async (
  client: ApolloClient<NormalizedCacheObject>,
  withdrawal: SubgraphLenderWithdrawalPropertiesWithEventsFragment,
  blockNumber: number | undefined,
  traversal: IndexedTraversal
): Promise<SubgraphLenderWithdrawalPropertiesWithEventsFragment> => {
  const batch = await completeWithdrawalBatch(client, withdrawal.batch, blockNumber, traversal);
  return completeChildren(
    { ...withdrawal, batch },
    async (skip) => {
      const { data } = await traversal.query<SubgraphGetLenderWithdrawalChildrenQuery>(client, {
        query: GetLenderWithdrawalChildrenDocument,
        variables: { id: withdrawal.id, skip, block: withdrawalHistoryBlock(blockNumber) },
        fetchPolicy: "no-cache"
      });
      assert(data.lenderWithdrawalStatus != null, "Lender withdrawal missing at indexed block");
      return data.lenderWithdrawalStatus;
    },
    traversal
  );
};
