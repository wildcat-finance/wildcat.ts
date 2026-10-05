import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import type { Market } from "./market";
import { getSubgraphClientChainId, usesLegacySubgraphSchema } from "./config";
import { normalizeIndexedPageRequest } from "./analytics/pagination";
import { IndexedQueryMetadata } from "./analytics/types";
import { IndexedTraversalOptions } from "./indexed-pagination";
import { IndexedPageProgress, withIndexedTraversal } from "./internal/indexed-traversal";
import { assertMatchingAddress, assertReadIdentity } from "./internal/read-identity";
import {
  isUnsignedInteger,
  LegacyDefaultSnapshot,
  LegacyDelinquencyChange,
  reconstructLegacyDefault
} from "./internal/legacy-default";

export { DEFAULT_DELINQUENCY_PERIOD } from "./internal/legacy-default";

export type MarketDefaultStatus = {
  market: string;
  /** undefined is unknown, not evidence that the market has never defaulted. */
  isDefaulted: boolean | undefined;
  source: "recorded" | "legacy-history";
  /** First effective default time; remains present after cure or closure. */
  defaultedAt?: number;
  /** Model observation time for recorded flags; indexed block time for history reads. */
  asOfTimestamp?: number;
  indexedAt?: IndexedQueryMetadata;
  reason?:
    | "invalid-market-state"
    | "market-not-indexed"
    | "missing-index-metadata"
    | "indexing-errors"
    | "incomplete-history"
    | "inconsistent-history";
};

export type GetMarketDefaultStatusOptions = IndexedTraversalOptions & {
  market: Pick<Market, "address" | "chainId" | "defaultedAt" | "lastInterestAccruedTimestamp">;
  /** Delinquency transitions per page, from 1 to 1,000; defaults to 100. */
  first?: number;
};

// These history fields exist on both supported schema families. The monotonic
// transition index also lets us prove that a complete prefix was returned.
const historyFragment = gql`
  fragment MarketDefaultHistoryData on Market {
    id
    createdAt
    delinquencyFeeBips
    delinquencyGracePeriod
    delinquencyStatusChangedIndex
    timeDelinquent
    isDelinquent
    isClosed
    lastInterestAccruedTimestamp
    marketClosedEvent {
      timestamp
    }
    delinquencyRecords(
      first: $first
      orderBy: delinquencyStatusChangedIndex
      orderDirection: asc
      where: { delinquencyStatusChangedIndex_gte: $afterIndex }
    ) {
      id
      delinquencyStatusChangedIndex
      isDelinquent
      blockNumber
      blockTimestamp
      blockLogIndex
    }
  }
`;

const metadataFragment = gql`
  fragment MarketDefaultMetadata on _Meta_ {
    deployment
    hasIndexingErrors
    block {
      number
      timestamp
      hash
    }
  }
`;

const legacyHistoryDocument = gql`
  query legacyGetMarketDefaultHistory(
    $market: ID!
    $first: Int!
    $afterIndex: Int!
    $block: Block_height
  ) {
    market(id: $market, block: $block) {
      ...MarketDefaultHistoryData
    }
    _meta(block: $block) {
      ...MarketDefaultMetadata
    }
  }
  ${historyFragment}
  ${metadataFragment}
`;

const historyDocument = gql`
  query getMarketDefaultHistory(
    $market: ID!
    $first: Int!
    $afterIndex: Int!
    $block: Block_height
  ) {
    market(id: $market, block: $block) {
      defaultedAt
      ...MarketDefaultHistoryData
    }
    _meta(block: $block) {
      ...MarketDefaultMetadata
    }
  }
  ${historyFragment}
  ${metadataFragment}
`;

type HistoryPage = {
  market:
    | (LegacyDefaultSnapshot & {
        defaultedAt?: string | null;
        delinquencyRecords: LegacyDelinquencyChange[];
      })
    | null;
  _meta: {
    deployment: string;
    hasIndexingErrors: boolean;
    block: { number: number; timestamp?: number | null; hash?: string | null };
  } | null;
};

/**
 * Resolve the market's historical default status. Supported markets use their
 * committed flag without querying history (zero stays false, even after a deadline).
 * Older markets replay complete, block-pinned delinquency history and keep a proven
 * default after cure/closure. The decaying penalty timer itself is never changed.
 * Incomplete/inconsistent history is unknown; network and traversal failures reject.
 */
export const getMarketDefaultStatus = async (
  client: ApolloClient<NormalizedCacheObject>,
  { market, first: requestedFirst, ...options }: GetMarketDefaultStatusOptions
): Promise<MarketDefaultStatus> => {
  const address = market.address.toLowerCase();
  const source = market.defaultedAt === undefined ? "legacy-history" : "recorded";
  const unknown = (
    reason: MarketDefaultStatus["reason"],
    indexedAt?: IndexedQueryMetadata
  ): MarketDefaultStatus => ({
    market: address,
    isDefaulted: undefined,
    source,
    reason,
    indexedAt,
    asOfTimestamp:
      indexedAt?.blockTimestamp === undefined ? undefined : Number(indexedAt.blockTimestamp)
  });
  const recorded = (defaultedAt: number, asOfTimestamp: number): MarketDefaultStatus => ({
    market: address,
    isDefaulted: defaultedAt !== 0,
    source: "recorded",
    defaultedAt: defaultedAt || undefined,
    asOfTimestamp
  });

  const clientChainId = getSubgraphClientChainId(client);
  assertReadIdentity(
    clientChainId === undefined || clientChainId === market.chainId,
    "Default history client chain mismatch"
  );

  return withIndexedTraversal(options, async (traversal) => {
    const { first } = normalizeIndexedPageRequest({ first: requestedFirst });
    if (market.defaultedAt !== undefined) {
      if (
        !isUnsignedInteger(market.defaultedAt) ||
        !isUnsignedInteger(market.lastInterestAccruedTimestamp) ||
        market.defaultedAt > market.lastInterestAccruedTimestamp
      )
        return unknown("invalid-market-state");
      return recorded(market.defaultedAt, market.lastInterestAccruedTimestamp);
    }

    const query = usesLegacySubgraphSchema(market.chainId)
      ? legacyHistoryDocument
      : historyDocument;
    let indexedAt: IndexedQueryMetadata | undefined;
    let snapshot: LegacyDefaultSnapshot | undefined;
    const changes: LegacyDelinquencyChange[] = [];
    const progress = new IndexedPageProgress();

    for (;;) {
      const { data } = await traversal.query<HistoryPage>(client, {
        query,
        variables: {
          market: address,
          first,
          afterIndex: changes.length,
          ...(indexedAt ? { block: { number: Number(indexedAt.blockNumber) } } : {})
        },
        fetchPolicy: "no-cache"
      });
      const meta = data._meta;
      // Graph Node may omit the timestamp/hash on an explicitly pinned _meta read.
      const asOfTimestamp =
        meta?.block.timestamp ??
        (indexedAt?.blockTimestamp === undefined ? undefined : Number(indexedAt.blockTimestamp));
      if (
        !meta ||
        !meta.deployment ||
        !isUnsignedInteger(meta.block.number) ||
        !isUnsignedInteger(asOfTimestamp) ||
        typeof meta.hasIndexingErrors !== "boolean"
      )
        return unknown("missing-index-metadata", indexedAt);
      const currentMetadata: IndexedQueryMetadata = {
        deployment: meta.deployment,
        blockNumber: BigInt(meta.block.number),
        blockTimestamp: BigInt(asOfTimestamp),
        blockHash: meta.block.hash ?? indexedAt?.blockHash,
        hasIndexingErrors: meta.hasIndexingErrors
      };
      if (meta.hasIndexingErrors) return unknown("indexing-errors", currentMetadata);
      if (
        indexedAt &&
        (indexedAt.deployment !== currentMetadata.deployment ||
          indexedAt.blockNumber !== currentMetadata.blockNumber ||
          indexedAt.blockTimestamp !== currentMetadata.blockTimestamp ||
          indexedAt.blockHash !== currentMetadata.blockHash)
      )
        return unknown("inconsistent-history", indexedAt);
      indexedAt = currentMetadata;
      if (!data.market) return unknown("market-not-indexed", indexedAt);
      assertMatchingAddress(data.market.id, address, "Default history market");
      const { delinquencyRecords: page, defaultedAt, ...currentSnapshot } = data.market;
      if (defaultedAt !== null && defaultedAt !== undefined) {
        const timestamp = Number(defaultedAt);
        if (
          !/^\d+$/.test(defaultedAt) ||
          !isUnsignedInteger(timestamp) ||
          timestamp > asOfTimestamp
        ) {
          return unknown("invalid-market-state", indexedAt);
        }
        return { ...recorded(timestamp, asOfTimestamp), indexedAt };
      }
      if (snapshot && JSON.stringify(snapshot) !== JSON.stringify(currentSnapshot)) {
        return unknown("inconsistent-history", indexedAt);
      }
      snapshot = currentSnapshot;
      if (!Array.isArray(page) || !isUnsignedInteger(snapshot.delinquencyStatusChangedIndex)) {
        return unknown("incomplete-history", indexedAt);
      }
      traversal.accept(page, first, progress);
      if (
        page.length !== Math.min(first, snapshot.delinquencyStatusChangedIndex - changes.length) ||
        page.some(
          (change, index) => change.delinquencyStatusChangedIndex !== changes.length + index
        )
      )
        return unknown("incomplete-history", indexedAt);
      changes.push(...page);
      if (changes.length === snapshot.delinquencyStatusChangedIndex) {
        const reconstructed = reconstructLegacyDefault(
          snapshot,
          changes,
          asOfTimestamp,
          meta.block.number
        );
        if (reconstructed === undefined) return unknown("inconsistent-history", indexedAt);
        return {
          market: address,
          isDefaulted: reconstructed !== null,
          source: "legacy-history",
          defaultedAt: reconstructed ?? undefined,
          asOfTimestamp,
          indexedAt
        };
      }
    }
  });
};
