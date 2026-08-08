import { assert } from "../utils";
import { SubgraphAnalyticsQueryMetadataFragment, SubgraphBlock_Height } from "../gql/graphql";
import { AnalyticsPage, AnalyticsPageRequest, AnalyticsQueryMetadata } from "./types";

export const DEFAULT_ANALYTICS_PAGE_SIZE = 100;
export const MAX_ANALYTICS_PAGE_SIZE = 1_000;

export const normalizeAnalyticsMetadata = (
  metadata: SubgraphAnalyticsQueryMetadataFragment | null | undefined
): AnalyticsQueryMetadata => {
  assert(metadata !== null && metadata !== undefined, "Subgraph metadata is unavailable");
  const { block } = metadata;
  return {
    deployment: metadata.deployment,
    hasIndexingErrors: metadata.hasIndexingErrors,
    blockNumber: block.number,
    ...(block.timestamp !== null && block.timestamp !== undefined
      ? { blockTimestamp: block.timestamp }
      : {}),
    ...(block.hash !== null && block.hash !== undefined ? { blockHash: block.hash } : {})
  };
};

export const normalizeAnalyticsPageRequest = (
  request: AnalyticsPageRequest = {}
): { first: number; afterId: string; block?: SubgraphBlock_Height } => {
  const first = request.first ?? DEFAULT_ANALYTICS_PAGE_SIZE;
  assert(
    Number.isSafeInteger(first) && first > 0 && first <= MAX_ANALYTICS_PAGE_SIZE,
    "Invalid analytics page size"
  );

  if (!request.after) return { first, afterId: "", block: request.block };

  const { entityId, blockNumber } = request.after;
  assert(entityId.length > 0, "Invalid analytics page cursor");
  assert(
    Number.isSafeInteger(blockNumber) && blockNumber >= 0,
    "Invalid analytics page cursor block"
  );
  if (request.block?.number !== undefined) {
    assert(
      request.block.number === blockNumber,
      "Analytics page cursor block does not match block"
    );
  }
  return { first, afterId: entityId, block: { number: blockNumber } };
};

export const toAnalyticsPage = <T extends { id: string }>(
  items: T[],
  first: number,
  metadata: SubgraphAnalyticsQueryMetadataFragment | null | undefined
): AnalyticsPage<T> => {
  const indexedAt = normalizeAnalyticsMetadata(metadata);
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

/** Drain cursor-based results while pinning every continuation to the first indexed block. */
export const collectAnalyticsPages = async <T extends { id: string }>(
  getPage: (request: AnalyticsPageRequest) => Promise<AnalyticsPage<T>>,
  request: AnalyticsPageRequest = {}
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
        "Analytics page block changed during traversal"
      );
      assert(
        page.pageInfo.nextCursor.entityId > after.entityId,
        "Analytics page cursor did not advance"
      );
    }
    after = page.pageInfo.nextCursor;
  }
};
