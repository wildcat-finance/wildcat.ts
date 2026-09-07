import { FetchPolicy } from "@apollo/client";
import { IndexedPageRequest } from "./types";

export type IndexedReadOptions = IndexedPageRequest & {
  /** Applies to unpinned reads. Pinned pages bypass the shared normalized cache. */
  fetchPolicy?: FetchPolicy;
};

// Apollo entity keys omit block height; network-only still overwrites other snapshots.
export const indexedFetchPolicy = (
  fetchPolicy: FetchPolicy,
  block?: { number: number }
): FetchPolicy => (block ? "no-cache" : fetchPolicy);

export type IndexedTimeRange = {
  /** Inclusive Unix timestamp. */
  fromTimestamp?: number;
  /** Exclusive Unix timestamp. */
  toTimestamp?: number;
};

export type MarketAnalyticsFilter = IndexedTimeRange & {
  markets?: readonly string[];
  borrower?: string;
};

export const normalizeAddresses = (addresses: readonly string[]): string[] =>
  Array.from(new Set(addresses.map((address) => address.toLowerCase())));
