import { expect } from "chai";
import {
  collectIndexedPages,
  normalizeIndexedPageRequest,
  toIndexedPage
} from "../../src/analytics";

describe("indexed analytics pagination", () => {
  const indexedAt = {
    deployment: "test",
    blockNumber: 1n,
    blockTimestamp: 2n,
    hasIndexingErrors: false
  };

  it("normalizes bounded entity-ID cursor requests", () => {
    expect(normalizeIndexedPageRequest()).to.deep.equal({ first: 100, afterId: "" });
    expect(
      normalizeIndexedPageRequest({
        first: 17,
        after: { entityId: "cursor", blockNumber: 123n }
      })
    ).to.deep.equal({
      first: 17,
      afterId: "cursor",
      block: { number: 123 }
    });
    expect(() => normalizeIndexedPageRequest({ first: 0 })).to.throw("Invalid indexed page size");
    expect(() => normalizeIndexedPageRequest({ first: 1_001 })).to.throw(
      "Invalid indexed page size"
    );
    expect(() =>
      normalizeIndexedPageRequest({ after: { entityId: "", blockNumber: 123n } })
    ).to.throw("Invalid indexed page cursor");
    expect(() =>
      normalizeIndexedPageRequest({
        after: { entityId: "cursor", blockNumber: BigInt(Number.MAX_SAFE_INTEGER) + 1n }
      })
    ).to.throw("Invalid indexed page cursor block");
  });

  it("drains pages by the last entity ID without mutable offsets", async () => {
    const requests: Array<{ entityId: string; blockNumber: bigint } | undefined> = [];
    const all = await collectIndexedPages(
      async ({ after }) => {
        requests.push(after);
        const items =
          after === undefined
            ? [{ id: "a" }, { id: "b" }]
            : after.entityId === "b"
            ? [{ id: "c" }]
            : [];
        return toIndexedPage(items, 2, indexedAt);
      },
      { first: 2 }
    );

    expect(all.map(({ id }) => id)).to.deep.equal(["a", "b", "c"]);
    expect(requests).to.deep.equal([undefined, { entityId: "b", blockNumber: 1n }]);
  });

  it("rejects a non-advancing cursor", async () => {
    let failure: unknown;
    try {
      await collectIndexedPages(
        async () => ({
          items: [{ id: "same" }],
          indexedAt,
          pageInfo: {
            hasNextPage: true,
            nextCursor: { entityId: "same", blockNumber: 1n }
          }
        }),
        { after: { entityId: "same", blockNumber: 1n } }
      );
    } catch (error) {
      failure = error;
    }
    expect(String(failure)).to.contain("Indexed page cursor did not advance");
  });

  it("rejects a cursor that moves backwards", async () => {
    let failure: unknown;
    try {
      await collectIndexedPages(
        async () => ({
          items: [{ id: "earlier" }],
          indexedAt,
          pageInfo: {
            hasNextPage: true,
            nextCursor: { entityId: "earlier", blockNumber: 1n }
          }
        }),
        { after: { entityId: "later", blockNumber: 1n } }
      );
    } catch (error) {
      failure = error;
    }
    expect(String(failure)).to.contain("Indexed page cursor did not advance");
  });

  it("rejects a continuation that drifts to another indexed block", async () => {
    let failure: unknown;
    try {
      await collectIndexedPages(
        async () => ({
          items: [{ id: "next" }],
          indexedAt: { ...indexedAt, blockNumber: 2n },
          pageInfo: {
            hasNextPage: true,
            nextCursor: { entityId: "next", blockNumber: 2n }
          }
        }),
        { after: { entityId: "previous", blockNumber: 1n } }
      );
    } catch (error) {
      failure = error;
    }
    expect(String(failure)).to.contain("Indexed page block changed during traversal");
  });
});
