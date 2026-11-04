import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions
} from "@apollo/client";
import {
  DEFAULT_INDEXED_TRAVERSAL_LIMITS,
  IndexedTraversalError,
  IndexedTraversalLimits,
  IndexedTraversalOptions
} from "../indexed-pagination";
import { queryWithIndexedSignal, waitForIndexedOperation } from "./indexed-query";

/** Track each independently paginated collection, including short terminal pages. */
export class IndexedPageProgress {
  private readonly seen = new Set<string>();

  constructor(
    private readonly ordered = false,
    private lastId?: string,
    private readonly message = "Indexed page contains a duplicate or invalid entity"
  ) {}

  check(items: ReadonlyArray<{ id: string }>): void {
    for (const { id } of items) {
      if (
        typeof id !== "string" ||
        id.length === 0 ||
        this.seen.has(id) ||
        (this.ordered && this.lastId !== undefined && id <= this.lastId)
      ) {
        throw new IndexedTraversalError("INVALID_PAGE", this.message);
      }
      if (!this.ordered) this.seen.add(id);
      this.lastId = id;
    }
  }
}

/** One allowance and deadline shared by a public read and all of its child reads. */
export class IndexedTraversal {
  readonly limits: IndexedTraversalLimits;
  private readonly controller = new AbortController();
  readonly signal = this.controller.signal;
  private readonly startedAt = Date.now();
  private readonly timer: ReturnType<typeof setTimeout>;
  private pages = 0;
  private items = 0;
  private readonly onAbort = () =>
    this.cancel(new IndexedTraversalError("CANCELLED", "Indexed traversal cancelled"));

  constructor(private readonly options: IndexedTraversalOptions) {
    this.limits = { ...DEFAULT_INDEXED_TRAVERSAL_LIMITS };
    for (const key of ["maxPages", "maxItems", "timeoutMs"] as const) {
      const value = options.limits?.[key] ?? this.limits[key];
      if (
        !Number.isSafeInteger(value) ||
        value <= 0 ||
        (key === "timeoutMs" && value > 2_147_483_647)
      ) {
        throw new RangeError(`Invalid indexed traversal ${key}`);
      }
      this.limits[key] = value;
    }
    this.timer = setTimeout(() => this.timeout(), this.limits.timeoutMs);
    options.signal?.addEventListener("abort", this.onAbort, { once: true });
    if (options.signal?.aborted) this.onAbort();
  }

  private cancel(error: IndexedTraversalError): void {
    if (!this.signal.aborted) this.controller.abort(error);
  }

  private timeout(): void {
    this.cancel(
      new IndexedTraversalError("TIMEOUT", `Indexed traversal exceeded ${this.limits.timeoutMs}ms`)
    );
  }

  check(): void {
    // Also enforce elapsed time when promptly resolved pages keep the timer from running.
    if (Date.now() - this.startedAt >= this.limits.timeoutMs) this.timeout();
    if (this.signal.aborted) throw this.signal.reason;
  }

  async page<T>(load: (signal: AbortSignal) => Promise<T>): Promise<T> {
    this.check();
    if (this.pages >= this.limits.maxPages) {
      throw new IndexedTraversalError(
        "PAGE_LIMIT",
        `Indexed traversal exceeded ${this.limits.maxPages} page requests`
      );
    }
    this.pages++;
    const result = await waitForIndexedOperation(() => load(this.signal), this.signal);
    this.check();
    return result;
  }

  query<T, V extends OperationVariables = OperationVariables>(
    client: ApolloClient<NormalizedCacheObject>,
    options: QueryOptions<V, T>
  ): Promise<ApolloQueryResult<T>> {
    return this.page((signal) => queryWithIndexedSignal(client, options, signal));
  }

  accept(
    items: ReadonlyArray<{ id: string }>,
    pageSize: number,
    progress = new IndexedPageProgress()
  ): void {
    this.check();
    if (items.length > pageSize) {
      throw new IndexedTraversalError("INVALID_PAGE", "Indexed page exceeded the requested size");
    }
    if (items.length > this.limits.maxItems - this.items) {
      throw new IndexedTraversalError(
        "ITEM_LIMIT",
        `Indexed traversal exceeded ${this.limits.maxItems} collection entries`
      );
    }
    progress.check(items);
    this.items += items.length;
  }

  dispose(): void {
    clearTimeout(this.timer);
    this.options.signal?.removeEventListener("abort", this.onAbort);
  }
}

export const withIndexedTraversal = async <T>(
  options: IndexedTraversalOptions,
  read: (traversal: IndexedTraversal) => Promise<T>
): Promise<T> => {
  const traversal = new IndexedTraversal(options);
  try {
    traversal.check();
    const result = await read(traversal);
    traversal.check();
    return result;
  } finally {
    traversal.dispose();
  }
};
