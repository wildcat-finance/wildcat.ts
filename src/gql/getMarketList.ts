import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketListDocument,
  SubgraphMarketKind,
  SubgraphMarket_Filter,
  SubgraphMarket_OrderBy,
  SubgraphOrderDirection,
  SubgraphGetMarketListQuery,
  SubgraphGetMarketListQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { MarketKind } from "../domain";
import { assert } from "../utils";
import { usesLegacySubgraphSchema } from "../config";
import {
  LegacyGetMarketListDocument,
  LegacyMarketData,
  legacyMarketFilterCanMatch,
  normalizeLegacyMarketData,
  toLegacyMarketFilter,
  toLegacyMarketOrder
} from "./legacy-subgraph";

export type MarketListItem = SubgraphGetMarketListQuery["markets"][number];

export type GetMarketListOptions = SubgraphGetMarketListQueryVariables & {
  fetchPolicy: FetchPolicy;
};

export type GetMarketListAsMarketsOptions = GetMarketListOptions & {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketList(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy, ...variables }: GetMarketListOptions
): Promise<MarketListItem[]> {
  const result = await subgraphClient.query<
    SubgraphGetMarketListQuery,
    SubgraphGetMarketListQueryVariables
  >({
    query: GetMarketListDocument,
    variables,
    fetchPolicy
  });

  return result.data.markets;
}

export async function getMarketListAsMarkets(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketListAsMarketsOptions
): Promise<Market[]> {
  if (usesLegacySubgraphSchema(chainId)) {
    if (!legacyMarketFilterCanMatch(variables.marketFilter)) return [];
    const result = await subgraphClient.query<{ markets: LegacyMarketData[] }>({
      query: LegacyGetMarketListDocument,
      variables: {
        ...variables,
        marketFilter: toLegacyMarketFilter(variables.marketFilter),
        orderMarkets: toLegacyMarketOrder(variables.orderMarkets)
      },
      fetchPolicy
    });
    return result.data.markets.map((market) =>
      Market.fromSubgraphMarketData(
        chainId,
        signerOrProvider,
        normalizeLegacyMarketData(chainId, market)
      )
    );
  }

  const markets = await getMarketList(subgraphClient, {
    fetchPolicy,
    ...variables
  });

  return markets.map((market) => Market.fromSubgraphMarketData(chainId, signerOrProvider, market));
}

export type IndexedMarketListFilter = {
  addresses?: readonly string[];
  excludeAddresses?: readonly string[];
  borrower?: string;
  asset?: string;
  marketKinds?: readonly MarketKind[];
  isClosed?: boolean;
  isRegistered?: boolean;
};

export type GetIndexedMarketListOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  filter?: IndexedMarketListFilter;
  first?: number;
  skip?: number;
  orderBy?: "createdAt" | "createdAtBlock" | "name" | "address";
  direction?: "asc" | "desc";
  fetchPolicy?: FetchPolicy;
};

const subgraphMarketKind = (kind: MarketKind): SubgraphMarketKind => {
  if (kind === "standard") return SubgraphMarketKind.STANDARD;
  if (kind === "revolving") return SubgraphMarketKind.REVOLVING;
  return SubgraphMarketKind.UNKNOWN;
};

/** Indexed market discovery; call `hydrateMarketsLive` before action decisions. */
export const getIndexedMarketList = async (
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    chainId,
    signerOrProvider,
    filter = {},
    first = 1_000,
    skip = 0,
    orderBy = "createdAt",
    direction = "desc",
    fetchPolicy = "cache-first"
  }: GetIndexedMarketListOptions
): Promise<Market[]> => {
  assert(Number.isSafeInteger(first) && first > 0 && first <= 1_000, "Invalid market page size");
  assert(Number.isSafeInteger(skip) && skip >= 0, "Invalid market page offset");
  const marketFilter: SubgraphMarket_Filter = {
    ...(filter.addresses
      ? { address_in: filter.addresses.map((address) => address.toLowerCase()) }
      : {}),
    ...(filter.excludeAddresses
      ? { address_not_in: filter.excludeAddresses.map((address) => address.toLowerCase()) }
      : {}),
    ...(filter.borrower ? { borrower: filter.borrower.toLowerCase() } : {}),
    ...(filter.asset ? { asset: filter.asset.toLowerCase() } : {}),
    ...(filter.marketKinds ? { marketKind_in: filter.marketKinds.map(subgraphMarketKind) } : {}),
    ...(filter.isClosed !== undefined ? { isClosed: filter.isClosed } : {}),
    ...(filter.isRegistered !== undefined ? { isRegistered: filter.isRegistered } : {})
  };

  return getMarketListAsMarkets(subgraphClient, {
    chainId,
    signerOrProvider,
    fetchPolicy,
    marketFilter,
    numMarkets: first,
    skipMarkets: skip,
    orderMarkets: SubgraphMarket_OrderBy[orderBy],
    directionMarkets: direction === "asc" ? SubgraphOrderDirection.asc : SubgraphOrderDirection.desc
  });
};
