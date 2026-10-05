import { ApolloClient, ApolloLink, InMemoryCache, Observable, Operation } from "@apollo/client";
import { rejects } from "assert";
import { expect } from "chai";
import { readFileSync } from "fs";
import { buildSchema, print, validate } from "graphql";
import { createSubgraphClient, SupportedChainId } from "../../src/config";
import { getMarketDefaultStatus, GetMarketDefaultStatusOptions } from "../../src/market-default";
import {
  DEFAULT_DELINQUENCY_PERIOD as DELAY,
  LegacyDefaultSnapshot,
  LegacyDelinquencyChange,
  reconstructLegacyDefault
} from "../../src/internal/legacy-default";

const DAY = 86_400;
const START = 1_700_000_000;
const address = "0x00000000000000000000000000000000000000ab";
const model: GetMarketDefaultStatusOptions["market"] = {
  address,
  chainId: SupportedChainId.Mainnet,
  defaultedAt: undefined,
  lastInterestAccruedTimestamp: START
};

const change = (index: number, elapsed: number): LegacyDelinquencyChange => ({
  id: `change-${index}`,
  delinquencyStatusChangedIndex: index,
  isDelinquent: index % 2 === 0,
  blockNumber: index + 1,
  blockTimestamp: START + elapsed,
  blockLogIndex: 0
});

const snapshot = (overrides: Partial<LegacyDefaultSnapshot> = {}): LegacyDefaultSnapshot => ({
  id: address,
  createdAt: START,
  delinquencyFeeBips: 1_000,
  delinquencyGracePeriod: 0,
  delinquencyStatusChangedIndex: 0,
  timeDelinquent: 0,
  isDelinquent: false,
  isClosed: false,
  lastInterestAccruedTimestamp: START,
  marketClosedEvent: null,
  ...overrides
});

const replay = (
  changes: LegacyDelinquencyChange[],
  elapsed: number,
  overrides: Partial<LegacyDefaultSnapshot> = {}
) =>
  reconstructLegacyDefault(
    snapshot({ delinquencyStatusChangedIndex: changes.length, ...overrides }),
    changes,
    START + elapsed,
    999
  );

describe("legacy default reconstruction", () => {
  for (const [elapsed, expected] of [
    [DELAY - 1, null],
    [DELAY, null],
    [DELAY + 1, START + DELAY]
  ] as const) {
    it(`uses the inclusive cure cutoff at ${elapsed} elapsed seconds`, () => {
      expect(replay([change(0, 0)], elapsed, { isDelinquent: true })).to.equal(expected);
    });
  }

  it("accounts for remaining grace before the 90-day run", () => {
    const grace = DAY;
    const state = { isDelinquent: true, delinquencyGracePeriod: grace };
    expect(replay([change(0, 0)], DELAY + grace, state)).to.equal(null);
    expect(replay([change(0, 0)], DELAY + grace + 1, state)).to.equal(START + DELAY + grace);
  });

  it("resets the default run at a cure while the penalty timer decays", () => {
    // 80 days delinquent, 1 healthy, 12 delinquent. The fee clock is 91 days,
    // but neither uninterrupted delinquency run reaches the default threshold.
    expect(
      replay([change(0, 0), change(1, 80 * DAY), change(2, 81 * DAY)], 93 * DAY, {
        isDelinquent: true,
        lastInterestAccruedTimestamp: START + 93 * DAY,
        timeDelinquent: 91 * DAY
      })
    ).to.equal(null);
  });

  it("does not count penalty burn-down as continued delinquency", () => {
    expect(
      replay([change(0, 0), change(1, 80 * DAY)], 100 * DAY, {
        lastInterestAccruedTimestamp: START + 100 * DAY,
        timeDelinquent: 60 * DAY
      })
    ).to.equal(null);
  });

  it("preserves zero-fee defaults when a keeper advances the accrual timestamp", () => {
    const state = {
      delinquencyFeeBips: 0,
      delinquencyGracePeriod: DAY,
      isDelinquent: true,
      timeDelinquent: 0
    };
    const elapsed = DELAY + DAY + 1;
    for (const accruedAt of [START, START + elapsed]) {
      expect(
        replay([change(0, 0)], elapsed, { ...state, lastInterestAccruedTimestamp: accruedAt })
      ).to.equal(START + DELAY + DAY);
    }
  });

  it("retains grace and cure boundaries for zero-fee markets", () => {
    const state = { delinquencyFeeBips: 0, delinquencyGracePeriod: DAY };
    const cutoff = DELAY + DAY;
    expect(replay([change(0, 0)], cutoff, { ...state, isDelinquent: true })).to.equal(null);
    expect(
      replay([change(0, 0), change(1, cutoff)], 200 * DAY, {
        ...state,
        lastInterestAccruedTimestamp: START + 200 * DAY
      })
    ).to.equal(null);
    expect(
      replay([change(0, 0), change(1, cutoff + 1)], 200 * DAY, {
        ...state,
        lastInterestAccruedTimestamp: START + 200 * DAY
      })
    ).to.equal(START + cutoff);
  });

  it("resets a zero-fee default run at a cure and retains defaults after closure", () => {
    expect(
      replay([change(0, 0), change(1, 80 * DAY), change(2, 81 * DAY)], 93 * DAY, {
        delinquencyFeeBips: 0,
        isDelinquent: true,
        lastInterestAccruedTimestamp: START + 93 * DAY
      })
    ).to.equal(null);
    expect(
      replay([change(0, 0), change(1, 100 * DAY)], 250 * DAY, {
        delinquencyFeeBips: 0,
        isClosed: true,
        lastInterestAccruedTimestamp: START + 150 * DAY,
        marketClosedEvent: { timestamp: START + 100 * DAY }
      })
    ).to.equal(START + DELAY);
  });

  it("accepts a reconstructed zero-fee timer but rejects arbitrary timer values", () => {
    const state = {
      delinquencyFeeBips: 0,
      isDelinquent: true,
      lastInterestAccruedTimestamp: START + 100 * DAY
    };
    expect(replay([change(0, 0)], 100 * DAY, { ...state, timeDelinquent: 100 * DAY })).to.equal(
      START + DELAY
    );
    expect(replay([change(0, 0)], 100 * DAY, { ...state, timeDelinquent: 1 })).to.equal(undefined);
    expect(replay([], DAY, { delinquencyFeeBips: -1 })).to.equal(undefined);
  });

  it("restores grace through healthy time without discarding the residual timer", () => {
    const changes = [change(0, 0), change(1, DAY / 2), change(2, (3 * DAY) / 4)];
    const state = {
      isDelinquent: true,
      delinquencyGracePeriod: DAY,
      lastInterestAccruedTimestamp: START + (3 * DAY) / 4,
      timeDelinquent: DAY / 4
    };
    const cutoff = (3 * DAY) / 2 + DELAY;
    expect(replay(changes, cutoff, state)).to.equal(null);
    expect(replay(changes, cutoff + 1, state)).to.equal(START + cutoff);
  });

  it("keeps the earliest default after a cure and complete timer decay", () => {
    expect(
      replay([change(0, 0), change(1, 100 * DAY)], 250 * DAY, {
        lastInterestAccruedTimestamp: START + 250 * DAY,
        timeDelinquent: 0
      })
    ).to.equal(START + DELAY);
  });

  it("preserves a historical default after closure", () => {
    expect(
      replay([change(0, 0), change(1, 100 * DAY)], 250 * DAY, {
        isClosed: true,
        lastInterestAccruedTimestamp: START + 150 * DAY,
        marketClosedEvent: { timestamp: START + 100 * DAY }
      })
    ).to.equal(START + DELAY);
  });

  it("accepts a cure or closure exactly at the cutoff", () => {
    for (const isClosed of [false, true]) {
      expect(
        replay([change(0, 0), change(1, DELAY)], DELAY + DAY, {
          isClosed,
          lastInterestAccruedTimestamp: START + DELAY,
          timeDelinquent: isClosed ? 0 : DELAY,
          marketClosedEvent: isClosed ? { timestamp: START + DELAY } : null
        })
      ).to.equal(null);
    }
  });

  it("never extends the default clock past early closure", () => {
    expect(
      replay([change(0, 0), change(1, DAY)], 200 * DAY, {
        isClosed: true,
        lastInterestAccruedTimestamp: START + 200 * DAY,
        marketClosedEvent: { timestamp: START + DAY }
      })
    ).to.equal(null);
  });

  it("orders same-block cures and relapses by transition index and log position", () => {
    const changes = [
      change(0, 0),
      change(1, 80 * DAY),
      {
        ...change(2, 80 * DAY),
        blockNumber: 2,
        blockLogIndex: 1
      }
    ];
    expect(
      replay(changes, 100 * DAY, {
        isDelinquent: true,
        lastInterestAccruedTimestamp: START + 80 * DAY,
        timeDelinquent: 80 * DAY
      })
    ).to.equal(null);
  });

  it("returns unknown when replay and the indexed timer or status disagree", () => {
    expect(
      replay([change(0, 0)], 200 * DAY, {
        isDelinquent: true,
        timeDelinquent: 1
      })
    ).to.equal(undefined);
    expect(replay([change(0, 0)], 200 * DAY)).to.equal(undefined);
  });

  it("requires a closure record for a closed market and rejects future state", () => {
    expect(replay([], DAY, { isClosed: true })).to.equal(undefined);
    expect(replay([], DAY, { lastInterestAccruedTimestamp: START + 2 * DAY })).to.equal(undefined);
  });

  it("rejects incomplete, unordered, duplicate and non-alternating transitions", () => {
    for (const changes of [
      [change(1, 0)],
      [change(0, 0), { ...change(1, DAY), isDelinquent: true }],
      [change(0, DAY), change(1, 0)],
      [change(0, 0), { ...change(1, 0), blockNumber: 1 }],
      [change(0, 0), { ...change(1, DAY), id: "change-0" }],
      [{ ...change(0, 0), blockNumber: 1_000 }]
    ]) {
      expect(replay(changes, DAY, { lastInterestAccruedTimestamp: START + DAY })).to.equal(
        undefined
      );
    }
  });
});

const meta = {
  deployment: "test-default-history",
  hasIndexingErrors: false,
  block: { number: 999, timestamp: START + DELAY + 1, hash: `0x${"a".repeat(64)}` }
};

const createClient = (respond: (operation: Operation) => unknown) => {
  const operations: Operation[] = [];
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          operations.push(operation);
          try {
            observer.next({ data: respond(operation) as any });
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        })
    )
  });
  return { client, operations };
};

const historyClient = (
  changes = [change(0, 0)],
  state: Partial<LegacyDefaultSnapshot> = { isDelinquent: true },
  metadata = meta
) =>
  createClient(({ variables }) => ({
    _meta: metadata,
    market: {
      ...snapshot({ delinquencyStatusChangedIndex: changes.length, ...state }),
      delinquencyRecords: changes.slice(
        variables.afterIndex,
        variables.afterIndex + variables.first
      )
    }
  }));

describe("market default status API", () => {
  for (const defaultedAt of [0, START - 1]) {
    it(`uses the recorded flag ${defaultedAt} without a history read`, async () => {
      const { client, operations } = createClient(() => {
        throw new Error("Unexpected history read");
      });
      const result = await getMarketDefaultStatus(client, { market: { ...model, defaultedAt } });
      expect(result.isDefaulted).to.equal(defaultedAt !== 0);
      expect(result.source).to.equal("recorded");
      expect(result.defaultedAt).to.equal(defaultedAt || undefined);
      expect(operations).to.have.length(0);
    });
  }

  it("returns a dated, persistent legacy default using the indexed block, not wall time", async () => {
    const { client } = historyClient();
    expect(await getMarketDefaultStatus(client, { market: model })).to.include({
      market: address,
      isDefaulted: true,
      defaultedAt: START + DELAY,
      source: "legacy-history",
      asOfTimestamp: meta.block.timestamp
    });
  });

  it("reads the immutable penalty rate to validate a zero-fee legacy snapshot", async () => {
    const { client, operations } = historyClient([change(0, 0)], {
      delinquencyFeeBips: 0,
      isDelinquent: true,
      lastInterestAccruedTimestamp: meta.block.timestamp
    });
    expect(await getMarketDefaultStatus(client, { market: model })).to.include({
      isDefaulted: true,
      defaultedAt: START + DELAY,
      source: "legacy-history"
    });
    expect(print(operations[0].query)).to.include("delinquencyFeeBips");
  });

  it("pins all pages and completes the counter without requiring an extra empty page", async () => {
    const { client, operations } = historyClient([change(0, 0), change(1, DAY)], {
      lastInterestAccruedTimestamp: START + DAY,
      timeDelinquent: DAY
    });
    const result = await getMarketDefaultStatus(client, { market: model, first: 1 });
    expect(result.isDefaulted).to.equal(false);
    expect(operations.map((operation) => operation.variables)).to.deep.equal([
      { market: address, first: 1, afterIndex: 0 },
      { market: address, first: 1, afterIndex: 1, block: { number: 999 } }
    ]);
    expect(client.extract()).to.deep.equal({});
  });

  it("retains first-page time and hash when pinned metadata omits them", async () => {
    const changes = [change(0, 0), change(1, DAY)];
    const { client } = createClient(({ variables }) => ({
      _meta: {
        ...meta,
        block: variables.block ? { number: 999, timestamp: null, hash: null } : meta.block
      },
      market: {
        ...snapshot({
          delinquencyStatusChangedIndex: 2,
          lastInterestAccruedTimestamp: START + DAY,
          timeDelinquent: DAY
        }),
        delinquencyRecords: [changes[variables.afterIndex]]
      }
    }));
    const result = await getMarketDefaultStatus(client, { market: model, first: 1 });
    expect(result.isDefaulted).to.equal(false);
    expect(result.asOfTimestamp).to.equal(meta.block.timestamp);
    expect(result.indexedAt?.blockHash).to.equal(meta.block.hash);
  });

  it("queries only legacy fields on legacy chains and validates both documents against V2.5", async () => {
    const schema = buildSchema(readFileSync("gql/v2.5-schema.graphql", "utf8"));
    for (const chainId of [SupportedChainId.Mainnet, SupportedChainId.Sepolia]) {
      const { client, operations } = historyClient();
      await getMarketDefaultStatus(client, { market: { ...model, chainId } });
      expect(validate(schema, operations[0].query).map((error) => error.message)).to.deep.equal([]);
      expect(print(operations[0].query).includes("defaultedAt")).to.equal(
        chainId === SupportedChainId.Sepolia
      );
    }
  });

  it("prefers an indexed recorded flag if the supplied model lacked it", async () => {
    const { client } = createClient(() => ({
      _meta: meta,
      market: { ...snapshot(), defaultedAt: "0", delinquencyRecords: [] }
    }));
    const result = await getMarketDefaultStatus(client, {
      market: { ...model, chainId: SupportedChainId.Sepolia }
    });
    expect(result.isDefaulted).to.equal(false);
    expect(result.source).to.equal("recorded");
  });

  for (const [reason, data] of [
    ["market-not-indexed", { _meta: meta, market: null }],
    ["missing-index-metadata", { _meta: null, market: null }],
    ["indexing-errors", { _meta: { ...meta, hasIndexingErrors: true }, market: null }],
    [
      "incomplete-history",
      {
        _meta: meta,
        market: { ...snapshot({ delinquencyStatusChangedIndex: 1 }), delinquencyRecords: [] }
      }
    ],
    [
      "inconsistent-history",
      { _meta: meta, market: { ...snapshot({ timeDelinquent: 1 }), delinquencyRecords: [] } }
    ]
  ] as const) {
    it(`returns unknown for ${reason}`, async () => {
      const { client } = createClient(() => data);
      expect(await getMarketDefaultStatus(client, { market: model })).to.include({
        isDefaulted: undefined,
        reason
      });
    });
  }

  it("rejects cross-market and cross-chain responses", async () => {
    const { client } = createClient(() => ({
      _meta: meta,
      market: { ...snapshot(), id: "other", delinquencyRecords: [] }
    }));
    await rejects(getMarketDefaultStatus(client, { market: model }), {
      message: "Default history market address mismatch"
    });
    await rejects(
      getMarketDefaultStatus(createSubgraphClient(SupportedChainId.Sepolia), { market: model }),
      { message: "Default history client chain mismatch" }
    );
  });

  it("does not accept page drift or a skipped transition", async () => {
    for (const drift of ["deployment", "block", "snapshot", "index"]) {
      const changes = [change(0, 0), change(1, DAY)];
      const { client } = createClient(({ variables }) => ({
        _meta: variables.afterIndex
          ? {
              ...meta,
              ...(drift === "deployment" ? { deployment: "other" } : {}),
              ...(drift === "block" ? { block: { ...meta.block, number: 1_000 } } : {})
            }
          : meta,
        market: {
          ...snapshot({
            delinquencyStatusChangedIndex: 2,
            lastInterestAccruedTimestamp: START + DAY
          }),
          ...(variables.afterIndex && drift === "snapshot" ? { timeDelinquent: 1 } : {}),
          delinquencyRecords:
            variables.afterIndex && drift === "index"
              ? [change(2, DAY)]
              : [changes[variables.afterIndex]]
        }
      }));
      expect(
        (await getMarketDefaultStatus(client, { market: model, first: 1 })).isDefaulted
      ).to.equal(undefined);
    }
  });

  it("honors traversal limits, cancellation and transport failures without returning false", async () => {
    const { client } = historyClient([change(0, 0), change(1, DAY)]);
    await rejects(
      getMarketDefaultStatus(client, { market: model, first: 1, limits: { maxPages: 1 } }),
      { code: "PAGE_LIMIT" }
    );
    await rejects(getMarketDefaultStatus(client, { market: model, limits: { maxItems: 1 } }), {
      code: "ITEM_LIMIT"
    });
    const controller = new AbortController();
    controller.abort();
    await rejects(getMarketDefaultStatus(client, { market: model, signal: controller.signal }), {
      code: "CANCELLED"
    });
    const failed = createClient(() => {
      throw new Error("offline");
    });
    await rejects(getMarketDefaultStatus(failed.client, { market: model }), /offline/);
  });
});
