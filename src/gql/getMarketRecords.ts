import { BigNumber } from "ethers";
import { Market } from "../market";
import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetMarketEventsDocument,
  SubgraphGetMarketEventsQuery,
  SubgraphGetMarketEventsQueryVariables
} from "./graphql";
import { MarketRecord, parseMarketRecord } from "../utils";
import assert from "assert";

export type GetMarketRecordsOptions = {
  market: Market;
  fetchPolicy: FetchPolicy;
  limit?: number;
  endEventIndex?: number;
};

export async function getMarketRecords(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, fetchPolicy, limit = 100, endEventIndex }: GetMarketRecordsOptions
): Promise<MarketRecord[]> {
  const marketAddress = market.address.toLowerCase();
  // If no end index provided, try to set it with the market's eventIndex, which is
  // the total events count
  if (endEventIndex === undefined && market.eventIndex !== undefined) {
    endEventIndex = market.eventIndex;
  }

  // Get the end ID to query - either the ID for the provided `endEventIndex` or
  // the ID for a market with an address one higher
  const endEventID = endEventIndex
    ? `RECORD-${marketAddress}-${endEventIndex}`
    : `RECORD-${BigNumber.from(marketAddress).add(1).toString().toLowerCase()}`;

  const startEventIndex = endEventIndex ? Math.max(0, endEventIndex - (limit || 100)) : 0;
  const startEventID = `RECORD-${marketAddress}-${startEventIndex}`;
  const result = await subgraphClient.query<
    SubgraphGetMarketEventsQuery,
    SubgraphGetMarketEventsQueryVariables
  >({
    query: GetMarketEventsDocument,
    variables: {
      market: marketAddress,
      startEventID,
      endEventID
    },
    fetchPolicy
  });
  const marketData = result.data.market;
  assert(marketData, `Market not found in subgraph: ${market.address}`);
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
  const records: MarketRecord[] = [
    ...delinquencyRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...borrowRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...depositRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...feeCollectionRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...repaymentRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...annualInterestBipsUpdatedRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...maxTotalSupplyUpdatedRecords.map((r) => parseMarketRecord(market.marketToken, r)),
    ...withdrawalRequestRecords.map((r) => parseMarketRecord(market.underlyingToken, r))
  ];
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
