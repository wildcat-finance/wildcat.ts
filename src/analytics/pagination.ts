import { assert } from "../utils";
import { IndexedPage, IndexedPageRequest, IndexedQueryMetadata } from "./types";

export const DEFAULT_INDEXED_PAGE_SIZE = 100;
export const MAX_INDEXED_PAGE_SIZE = 1_000;

export const normalizeIndexedPageRequest = (
  request: IndexedPageRequest = {}
): { first: number; afterId: string; block?: { number: number } } => {
  const first = request.first ?? DEFAULT_INDEXED_PAGE_SIZE;
  assert(
    Number.isSafeInteger(first) && first > 0 && first <= MAX_INDEXED_PAGE_SIZE,
    "Invalid indexed page size"
  );
  if (!request.after) return { first, afterId: "" };
  assert(request.after.entityId.length > 0, "Invalid indexed page cursor");
  const blockNumber = Number(request.after.blockNumber);
  assert(
    Number.isSafeInteger(blockNumber) && blockNumber >= 0,
    "Invalid indexed page cursor block"
  );
  return { first, afterId: request.after.entityId, block: { number: blockNumber } };
};

export const toIndexedPage = <T extends { id: string }>(
  items: T[],
  first: number,
  indexedAt: IndexedQueryMetadata
): IndexedPage<T> => {
  const last = items[items.length - 1];
  const hasNextPage = items.length === first && last !== undefined;
  return {
    items,
    indexedAt,
    pageInfo: {
      hasNextPage,
      ...(hasNextPage
        ? { nextCursor: { entityId: last.id, blockNumber: indexedAt.blockNumber } }
        : {})
    }
  };
};

/** Drain a cursor-based indexed read without relying on mutable offsets. */
export const collectIndexedPages = async <T extends { id: string }>(
  getPage: (request: IndexedPageRequest) => Promise<IndexedPage<T>>,
  request: IndexedPageRequest = {}
): Promise<T[]> => {
  const items: T[] = [];
  let after = request.after;

  for (;;) {
    const page = await getPage({ ...request, after });
    items.push(...page.items);
    if (!page.pageInfo.nextCursor) return items;
    if (after) {
      assert(
        page.pageInfo.nextCursor.blockNumber === after.blockNumber,
        "Indexed page block changed during traversal"
      );
      assert(
        page.pageInfo.nextCursor.entityId > after.entityId,
        "Indexed page cursor did not advance"
      );
    }
    after = page.pageInfo.nextCursor;
  }
};
