import { rejects } from "assert";
import { expect } from "chai";
import { collectIndexedPages, toIndexedPage } from "../../src/analytics";
import { IndexedTraversalError } from "../../src/indexed-pagination";

const indexedAt = { deployment: "test", blockNumber: 77n, hasIndexingErrors: false };
const records = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: String(index).padStart(6, "0") }));

describe("bounded indexed history collection", () => {
  it("preserves a callback's own 1,000-record page size when first is omitted", async () => {
    const history = records(1_001);
    let requests = 0;
    const result = await collectIndexedPages(async ({ first = 1_000, after }) => {
      requests++;
      const offset = after ? Number(after.entityId) + 1 : 0;
      return toIndexedPage(history.slice(offset, offset + first), first, indexedAt);
    });
    expect(result).to.deep.equal(history);
    expect(requests).to.equal(2);
  });
  for (const count of [1_000, 1_001, 5_000]) {
    for (const first of [100, 1_000]) {
      it(`returns all ${count} records with ${first}-record pages under default limits`, async () => {
        const history = records(count);
        let requests = 0;
        const result = await collectIndexedPages(
          async ({ after }) => {
            requests++;
            const offset = after ? Number(after.entityId) + 1 : 0;
            return toIndexedPage(history.slice(offset, offset + first), first, indexedAt);
          },
          { first }
        );
        expect(result).to.deep.equal(history);
        expect(requests).to.equal(Math.floor(count / first) + 1);
      });
    }
  }

  it("lets callers raise a record allowance and finish at the exact limit", async () => {
    const history = records(1_000);
    const getPage = async ({ after }: { after?: unknown }) =>
      toIndexedPage(after ? [] : history, 1_000, indexedAt);
    await rejects(collectIndexedPages(getPage, { first: 1_000, limits: { maxItems: 999 } }), {
      code: "ITEM_LIMIT"
    });
    expect(
      await collectIndexedPages(getPage, { first: 1_000, limits: { maxItems: 1_000 } })
    ).to.deep.equal(history);
  });

  it("requires room for the final empty request before claiming a full page is complete", async () => {
    let requests = 0;
    await rejects(
      collectIndexedPages(
        async () => {
          requests++;
          return toIndexedPage(records(2), 2, indexedAt);
        },
        { first: 2, limits: { maxPages: 1 } }
      ),
      { code: "PAGE_LIMIT" }
    );
    expect(requests).to.equal(1);
  });

  it("counts entries across pages before returning any result", async () => {
    const history = records(4);
    let requests = 0;
    await rejects(
      collectIndexedPages(
        async ({ after }) => {
          requests++;
          return toIndexedPage(after ? history.slice(2) : history.slice(0, 2), 2, indexedAt);
        },
        { first: 2, limits: { maxItems: 3 } }
      ),
      { code: "ITEM_LIMIT" }
    );
    expect(requests).to.equal(2);
  });

  for (const items of [
    [{ id: "a" }, { id: "a" }],
    [{ id: "z" }, { id: "a" }],
    [{ id: "a" }, { id: "b" }, { id: "c" }]
  ]) {
    it(`rejects a duplicate, unordered, or oversized page: ${items.map(
      (item) => item.id
    )}`, async () => {
      await rejects(
        collectIndexedPages(async () => toIndexedPage(items, 2, indexedAt), { first: 2 }),
        {
          code: "INVALID_PAGE"
        }
      );
    });
  }

  it("checks records in a short final page against the preceding page", async () => {
    await rejects(
      collectIndexedPages(
        async ({ after }) =>
          toIndexedPage(after ? [{ id: "b" }] : [{ id: "a" }, { id: "b" }], 2, indexedAt),
        { first: 2 }
      ),
      { code: "INVALID_PAGE" }
    );
  });

  it("checks the block even on an empty final page", async () => {
    await rejects(
      collectIndexedPages(
        async ({ after }) =>
          toIndexedPage(
            after ? [] : [{ id: "a" }],
            1,
            after ? { ...indexedAt, blockNumber: 78n } : indexedAt
          ),
        { first: 1 }
      ),
      { code: "INVALID_PAGE", message: "Indexed page block changed during traversal" }
    );
  });

  it("rejects a next cursor that skips beyond the returned records", async () => {
    await rejects(
      collectIndexedPages(async () => ({
        ...toIndexedPage([{ id: "a" }], 1, indexedAt),
        pageInfo: { hasNextPage: true, nextCursor: { entityId: "z", blockNumber: 77n } }
      })),
      { code: "INVALID_PAGE" }
    );
  });

  it("rejects a continuation flag without a cursor", async () => {
    await rejects(
      collectIndexedPages(async () => ({
        items: [{ id: "a" }],
        indexedAt,
        pageInfo: { hasNextPage: true }
      })),
      { code: "INVALID_PAGE" }
    );
  });

  for (const limits of [
    { maxItems: 0 },
    { maxPages: Infinity },
    { timeoutMs: 2 ** 31 },
    { maxItems: 1.5 }
  ]) {
    it(`rejects invalid limits before starting a read: ${JSON.stringify(limits)}`, async () => {
      let called = false;
      await rejects(
        collectIndexedPages(
          async () => {
            called = true;
            return toIndexedPage([], 100, indexedAt);
          },
          { limits }
        ),
        RangeError
      );
      expect(called).to.equal(false);
    });
  }

  it("honors cancellation before the first page", async () => {
    const controller = new AbortController();
    controller.abort();
    let called = false;
    await rejects(
      collectIndexedPages(
        async () => {
          called = true;
          return toIndexedPage([], 100, indexedAt);
        },
        { signal: controller.signal }
      ),
      { code: "CANCELLED" }
    );
    expect(called).to.equal(false);
  });

  it("stops waiting on an uncooperative page source and never starts its next page", async () => {
    const controller = new AbortController();
    let resolvePage!: (page: ReturnType<typeof toIndexedPage<{ id: string }>>) => void;
    let pageSignal!: AbortSignal;
    let requests = 0;
    const result = collectIndexedPages(
      ({ signal }) => {
        requests++;
        pageSignal = signal!;
        return new Promise<ReturnType<typeof toIndexedPage<{ id: string }>>>((resolve) => {
          resolvePage = resolve;
        });
      },
      { signal: controller.signal, first: 1 }
    );
    controller.abort();
    await rejects(result, { code: "CANCELLED" });
    expect(pageSignal.aborted).to.equal(true);
    resolvePage(toIndexedPage([{ id: "a" }], 1, indexedAt));
    await Promise.resolve();
    expect(requests).to.equal(1);
  });

  it("times out a stalled page independently of the page source", async () => {
    let pageSignal!: AbortSignal;
    await rejects(
      collectIndexedPages(
        ({ signal }) => {
          pageSignal = signal!;
          return new Promise<never>(() => undefined);
        },
        { limits: { timeoutMs: 20 } }
      ),
      (error) => error instanceof IndexedTraversalError && error.code === "TIMEOUT"
    );
    expect(pageSignal.aborted).to.equal(true);
  });

  it("uses one deadline across promptly returning pages", async () => {
    const originalNow = Date.now;
    let now = originalNow();
    let requests = 0;
    Date.now = () => now;
    try {
      await rejects(
        collectIndexedPages(
          async () => {
            requests++;
            now += 40;
            return toIndexedPage([{ id: String(requests) }], 1, indexedAt);
          },
          { first: 1, limits: { timeoutMs: 100 } }
        ),
        { code: "TIMEOUT" }
      );
      expect(requests).to.equal(3);
    } finally {
      Date.now = originalNow;
    }
  });
});
