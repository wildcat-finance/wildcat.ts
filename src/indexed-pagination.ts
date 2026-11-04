export type IndexedTraversalLimits = {
  /** Total page requests, including nested history and a final empty page. */
  maxPages: number;
  /** Total collection entries, including nested withdrawal records. */
  maxItems: number;
  /** Deadline for the entire traversal, in milliseconds. */
  timeoutMs: number;
};

export const DEFAULT_INDEXED_TRAVERSAL_LIMITS: Readonly<IndexedTraversalLimits> = Object.freeze({
  maxPages: 1_000,
  maxItems: 100_000,
  timeoutMs: 120_000
});

export type IndexedTraversalOptions = {
  /** Override individual defaults when intentionally reading larger histories. */
  limits?: Partial<IndexedTraversalLimits>;
  signal?: AbortSignal;
};

export type IndexedTraversalErrorCode =
  | "PAGE_LIMIT"
  | "ITEM_LIMIT"
  | "TIMEOUT"
  | "CANCELLED"
  | "INVALID_PAGE";

/** The requested traversal did not complete; no partial collection is returned. */
export class IndexedTraversalError extends Error {
  constructor(readonly code: IndexedTraversalErrorCode, message: string) {
    super(message);
    this.name = "IndexedTraversalError";
  }
}
