export const DEFAULT_DELINQUENCY_PERIOD = 90 * 24 * 60 * 60;

export type LegacyDelinquencyChange = {
  id: string;
  delinquencyStatusChangedIndex: number;
  isDelinquent: boolean;
  blockNumber: number;
  blockTimestamp: number;
  blockLogIndex: number;
};

export type LegacyDefaultSnapshot = {
  id: string;
  createdAt: number;
  delinquencyFeeBips: number;
  delinquencyGracePeriod: number;
  delinquencyStatusChangedIndex: number;
  timeDelinquent: number;
  isDelinquent: boolean;
  isClosed: boolean;
  lastInterestAccruedTimestamp: number;
  marketClosedEvent: { timestamp: number } | null;
};

export const isUnsignedInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

/**
 * Replay observed delinquency from creation, keeping the decaying fee clock separate
 * from each uninterrupted default run. A cure at the cutoff is still on time.
 * null means no default through asOfTimestamp; undefined means inconsistent history.
 */
export const reconstructLegacyDefault = (
  snapshot: LegacyDefaultSnapshot,
  changes: readonly LegacyDelinquencyChange[],
  asOfTimestamp: number,
  blockNumber: number
): number | null | undefined => {
  const {
    createdAt,
    delinquencyGracePeriod: grace,
    lastInterestAccruedTimestamp: accruedAt
  } = snapshot;
  const closedAt = snapshot.marketClosedEvent?.timestamp;
  if (
    ![
      createdAt,
      grace,
      snapshot.delinquencyFeeBips,
      accruedAt,
      snapshot.timeDelinquent,
      snapshot.delinquencyStatusChangedIndex,
      asOfTimestamp,
      blockNumber
    ].every(isUnsignedInteger) ||
    typeof snapshot.isClosed !== "boolean" ||
    typeof snapshot.isDelinquent !== "boolean" ||
    createdAt > accruedAt ||
    accruedAt > asOfTimestamp ||
    snapshot.delinquencyStatusChangedIndex !== changes.length ||
    snapshot.isClosed !== (closedAt !== undefined) ||
    (closedAt !== undefined &&
      (!isUnsignedInteger(closedAt) || closedAt < createdAt || closedAt > accruedAt))
  ) {
    return undefined;
  }

  let timestamp = createdAt;
  let timeDelinquent = 0;
  let isDelinquent = false;
  let cutoff: number | undefined;
  let defaultedAt: number | null = null;
  let previous: LegacyDelinquencyChange | undefined;
  const ids = new Set<string>();

  const advance = (to: number) => {
    if (isDelinquent) {
      // Keep the cutoff fixed across accruals; only a cure starts a new run.
      if (cutoff === undefined) {
        cutoff = timestamp + Math.max(0, grace - timeDelinquent) + DEFAULT_DELINQUENCY_PERIOD;
      }
      if (defaultedAt === null && to > cutoff) defaultedAt = cutoff;
      timeDelinquent += to - timestamp;
    } else {
      timeDelinquent = Math.max(0, timeDelinquent - (to - timestamp));
    }
    timestamp = to;
  };

  for (let index = 0; index < changes.length; index++) {
    const change = changes[index];
    if (
      ![
        change.delinquencyStatusChangedIndex,
        change.blockTimestamp,
        change.blockNumber,
        change.blockLogIndex
      ].every(isUnsignedInteger) ||
      typeof change.id !== "string" ||
      !change.id ||
      ids.has(change.id) ||
      change.delinquencyStatusChangedIndex !== index ||
      typeof change.isDelinquent !== "boolean" ||
      change.isDelinquent === isDelinquent ||
      change.blockTimestamp < timestamp ||
      change.blockTimestamp > accruedAt ||
      change.blockNumber > blockNumber ||
      (previous &&
        (change.blockTimestamp < previous.blockTimestamp ||
          change.blockNumber < previous.blockNumber ||
          (change.blockNumber === previous.blockNumber &&
            (change.blockTimestamp !== previous.blockTimestamp ||
              change.blockLogIndex <= previous.blockLogIndex))))
    ) {
      return undefined;
    }
    ids.add(change.id);
    // Closure ends the clock even if later transactions continue emitting state events.
    advance(Math.min(change.blockTimestamp, closedAt ?? change.blockTimestamp));
    isDelinquent = change.isDelinquent;
    cutoff = undefined;
    previous = change;
  }

  advance(Math.min(accruedAt, closedAt ?? accruedAt));
  // Older contracts skip fee-timer updates when the immutable penalty rate is zero.
  // Keep reconstructing the default clock from delinquency history regardless.
  const frozenFeeTimer = snapshot.delinquencyFeeBips === 0 && snapshot.timeDelinquent === 0;
  if (
    snapshot.isDelinquent !== isDelinquent ||
    snapshot.timeDelinquent !== (snapshot.isClosed || frozenFeeTimer ? 0 : timeDelinquent)
  ) {
    return undefined;
  }
  if (!snapshot.isClosed) advance(asOfTimestamp);
  return defaultedAt;
};
