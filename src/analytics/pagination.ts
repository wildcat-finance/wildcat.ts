import { assert } from "../utils";
import { IndexedPage, IndexedPageRequest, IndexedQueryMetadata } from "./types";
import { IndexedTraversalError, IndexedTraversalOptions } from "../indexed-pagination";
import { IndexedPageProgress, withIndexedTraversal } from "../internal/indexed-traversal";

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

/** Drain complete cursor-based history within configurable aggregate limits. */
export const collectIndexedPages = async <T extends { id: string }>(
  getPage: (request: IndexedPageRequest) => Promise<IndexedPage<T>>,
  request: IndexedPageRequest & IndexedTraversalOptions = {}
): Promise<T[]> =>
  withIndexedTraversal(request, async (traversal) => {
    normalizeIndexedPageRequest(request);
    // A callback may choose its own page size when the collector's caller omits first.
    const pageSize = request.first ?? MAX_INDEXED_PAGE_SIZE;
    const items: T[] = [];
    let after = request.after;
    let blockNumber = after?.blockNumber;
    const progress = new IndexedPageProgress(true, after?.entityId);

    for (;;) {
      const page = await traversal.page((signal) =>
        getPage({ ...(request.first !== undefined ? { first: request.first } : {}), after, signal })
      );
      const next = page.pageInfo.nextCursor;
      if (blockNumber !== undefined && page.indexedAt.blockNumber !== blockNumber) {
        throw new IndexedTraversalError(
          "INVALID_PAGE",
          "Indexed page block changed during traversal"
        );
      }
      blockNumber = page.indexedAt.blockNumber;
      if (next && after) {
        if (next.blockNumber !== after.blockNumber) {
          throw new IndexedTraversalError(
            "INVALID_PAGE",
            "Indexed page block changed during traversal"
          );
        }
        if (next.entityId <= after.entityId) {
          throw new IndexedTraversalError("INVALID_PAGE", "Indexed page cursor did not advance");
        }
      }
      if (
        page.pageInfo.hasNextPage !== (next !== undefined) ||
        (next &&
          (next.entityId !== page.items[page.items.length - 1]?.id ||
            next.blockNumber !== blockNumber))
      ) {
        throw new IndexedTraversalError(
          "INVALID_PAGE",
          "Indexed page cursor does not match its records"
        );
      }
      traversal.accept(page.items, pageSize, progress);
      items.push(...page.items);
      if (!next) return items;
      after = next;
    }
  });
