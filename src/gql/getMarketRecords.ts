import { Market } from "../market";
import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetMarketEventsDocument,
  SubgraphDelinquencyStatusChanged_Filter,
  SubgraphBorrow_Filter,
  SubgraphDeposit_Filter,
  SubgraphFeesCollected_Filter,
  SubgraphDebtRepaid_Filter,
  SubgraphAnnualInterestBipsUpdated_Filter,
  SubgraphMaxTotalSupplyUpdated_Filter,
  SubgraphWithdrawalRequest_Filter,
  SubgraphForceBuyBack_Filter,
  SubgraphMinimumDepositUpdated_Filter,
  SubgraphProtocolFeeBipsUpdated_Filter,
  SubgraphFixedTermUpdated_Filter,
  SubgraphGetMarketEventsQuery,
  SubgraphGetMarketEventsQueryVariables
} from "./graphql";
import {
  MarketDataFragment,
  MarketRecord,
  MarketRecordKind,
  assert,
  parseMarketRecord
} from "../utils";

export type GetMarketRecordsOptions = {
  market: Market;
  fetchPolicy?: FetchPolicy;
  limit?: number;
  endEventIndex?: number;
  kinds?: MarketRecordKind[];
  additionalFilter?: CommonFilter;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type CommonKeys<T, R = {}> = R extends T ? keyof T & CommonKeys<Exclude<T, R>> : keyof T;

type FilterUnion =
  | SubgraphDelinquencyStatusChanged_Filter
  | SubgraphBorrow_Filter
  | SubgraphDeposit_Filter
  | SubgraphFeesCollected_Filter
  | SubgraphDebtRepaid_Filter
  | SubgraphAnnualInterestBipsUpdated_Filter
  | SubgraphMaxTotalSupplyUpdated_Filter
  | SubgraphWithdrawalRequest_Filter
  | SubgraphForceBuyBack_Filter
  | SubgraphMinimumDepositUpdated_Filter
  | SubgraphProtocolFeeBipsUpdated_Filter
  | SubgraphFixedTermUpdated_Filter;

type Common<T> = Pick<T, CommonKeys<T>>;

type CommonFilter = Common<FilterUnion>;

export async function getMarketRecords(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    market,
    fetchPolicy = "network-only",
    limit = 300,
    endEventIndex,
    kinds,
    additionalFilter
  }: GetMarketRecordsOptions
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
      limit,
      delinquencyRecordsFilter: additionalFilter,
      borrowRecordsFilter: additionalFilter,
      depositRecordsFilter: additionalFilter,
      feeCollectionRecordsFilter: additionalFilter,
      repaymentRecordsFilter: additionalFilter,
      annualInterestBipsUpdatedRecordsFilter: additionalFilter,
      maxTotalSupplyUpdatedRecordsFilter: additionalFilter,
      withdrawalRequestRecordsFilter: additionalFilter,
      forceBuyBackRecordsFilter: additionalFilter,
      minimumDepositUpdateRecordsFilter: additionalFilter,
      protocolFeeBipsUpdatedRecordsFilter: additionalFilter,
      fixedTermUpdatedRecordsFilter: additionalFilter
    },
    fetchPolicy
  });

  const marketData = result.data.market;
  assert(!!marketData, `Market not found in subgraph: ${market.address}`);
  const {
    annualInterestBipsUpdatedRecords,
    borrowRecords,
    repaymentRecords: debtRepaidRecords,
    delinquencyRecords,
    depositRecords,
    forceBuyBackDisabledRecord: disabledForceBuyBacksRecord,
    feeCollectionRecords: feesCollectedRecords,
    fixedTermUpdatedRecords,
    forceBuyBackRecords,
    maxTotalSupplyUpdatedRecords,
    withdrawalRequestRecords,
    marketClosedEvent,
    minimumDepositUpdateRecords,
    protocolFeeBipsUpdatedRecords
  } = marketData;
  const filter = kinds ? (r: MarketRecord) => kinds.includes(r.__typename) : () => true;
  const handleSingleton = <T extends MarketDataFragment>(event: T | undefined | null): T[] => {
    const eventIndex = event?.eventIndex;
    // For singular events like MarketClosed and DisabledForceBuyBacks, filters don't apply so
    // we have to check if it is within the range of events we are querying for.
    if (
      eventIndex !== undefined &&
      eventIndex >= startEventIndex &&
      (!endEventIndex || eventIndex < endEventIndex)
    ) {
      return [event!];
    }
    return [];
  };

  const records: MarketRecord[] = [
    ...annualInterestBipsUpdatedRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...borrowRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...debtRepaidRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...delinquencyRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...depositRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...handleSingleton(disabledForceBuyBacksRecord).map((r) =>
      parseMarketRecord(market.underlyingToken, r)
    ),
    ...feesCollectedRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...fixedTermUpdatedRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...forceBuyBackRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...handleSingleton(marketClosedEvent).map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...maxTotalSupplyUpdatedRecords.map((r) => parseMarketRecord(market.marketToken, r)),
    ...minimumDepositUpdateRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...protocolFeeBipsUpdatedRecords.map((r) => parseMarketRecord(market.underlyingToken, r)),
    ...withdrawalRequestRecords.map((r) => parseMarketRecord(market.underlyingToken, r))
  ].filter(filter);

  records.sort((a, b) => b.eventIndex - a.eventIndex);

  return records;
}
