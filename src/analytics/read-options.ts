import { FetchPolicy } from "@apollo/client";
import { IndexedPageRequest } from "./types";

export type IndexedReadOptions = IndexedPageRequest & {
  fetchPolicy?: FetchPolicy;
};

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
