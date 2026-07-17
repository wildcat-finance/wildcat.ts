import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { IndexedMarketEvent } from "../domain";
import { assert } from "../utils";
import {
  GetMarketEventPageDocument,
  SubgraphGetMarketEventPageQuery,
  SubgraphGetMarketEventPageQueryVariables
} from "./graphql";
import { normalizeSubgraphMarketEvent } from "./normalizers";

export type GetMarketEventPageOptions = {
  market: string;
  fromSequence?: number;
  first?: number;
  fetchPolicy?: FetchPolicy;
};

export type IndexedMarketEventPage = {
  events: IndexedMarketEvent[];
  nextSequence?: number;
};

/** Stable chronological market-event cursor without discarding typed payload APIs. */
export const getMarketEventPage = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { market, fromSequence = 0, first = 100, fetchPolicy = "cache-first" }: GetMarketEventPageOptions
): Promise<IndexedMarketEventPage> => {
  assert(Number.isSafeInteger(fromSequence) && fromSequence >= 0, "Invalid event sequence");
  assert(Number.isSafeInteger(first) && first > 0 && first <= 1_000, "Invalid event page size");

  const { data } = await subgraphClient.query<
    SubgraphGetMarketEventPageQuery,
    SubgraphGetMarketEventPageQueryVariables
  >({
    query: GetMarketEventPageDocument,
    variables: { market: market.toLowerCase(), fromSequence, first },
    fetchPolicy
  });
  const events = data.marketEvents.map(normalizeSubgraphMarketEvent);
  return {
    events,
    nextSequence:
      events.length === first && events.length > 0
        ? events[events.length - 1].sequence + 1
        : undefined
  };
};
