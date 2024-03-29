import { Market } from "../market";
import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetMarketEventsDocument,
  SubgraphGetMarketEventsQuery,
  SubgraphGetMarketEventsQueryVariables
} from "./graphql";
import { MarketRecord, MarketRecordKind, assert, parseMarketRecord } from "../utils";

export type GetMarketRecordsOptions = {
  market: Market;
  fetchPolicy: FetchPolicy;
  limit?: number;
  endEventIndex?: number;
  kinds?: MarketRecordKind[];
};

export async function getMarketRecords(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, fetchPolicy, limit = 100, endEventIndex, kinds }: GetMarketRecordsOptions
): Promise<MarketRecord[]> {
  const marketAddress = market.address.toLowerCase();
  // If no end index provided, try to set it with the market's eventIndex, which is
  // the total events count
  if (endEventIndex === undefined && market.eventIndex !== undefined) {
    endEventIndex = market.eventIndex;
  }
  const startEventIndex = endEventIndex ? Math.max(0, endEventIndex - limit) : 0;
  const result = await subgraphClient.query<
    SubgraphGetMarketEventsQuery,
    SubgraphGetMarketEventsQueryVariables
  >({
    query: GetMarketEventsDocument,
    variables: {
      market: marketAddress,
      startEventIndex,
      endEventIndex,
      limit
    },
    fetchPolicy
  });

  const marketData = result.data.market;
  assert(!!marketData, `Market not found in subgraph: ${market.address}`);
  const {
    delinquencyRecords,
    borrowRecords,
    depositRecords,
    feeCollectionRecords,
    repaymentRecords,
    annualInterestBipsUpdatedRecords,
    maxTotalSupplyUpdatedRecords,
    withdrawalRequestRecords,
    marketClosedEvent
  } = marketData;
  const filter = kinds ? (r: MarketRecord) => kinds.includes(r.__typename) : () => true;
  const records: MarketRecord[] = [
    ...delinquencyRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...borrowRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...depositRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...feeCollectionRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...repaymentRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...annualInterestBipsUpdatedRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...maxTotalSupplyUpdatedRecords.map((r) => parseMarketRecord(market.marketToken, r)),
    ...withdrawalRequestRecords.map((r) => parseMarketRecord(market.underlyingToken, r))
  ].filter(filter);
  if (marketClosedEvent) {
    const { eventIndex } = marketClosedEvent;
    // If the market is closed, we should only include the market closed event
    // if it is within the range of events we are querying for.
    if (eventIndex >= startEventIndex && (!endEventIndex || eventIndex < endEventIndex)) {
      records.push(parseMarketRecord(market.underlyingToken, marketClosedEvent));
    }
  }
  records.sort((a, b) => b.eventIndex - a.eventIndex);
  return records.slice(0, limit);
}
