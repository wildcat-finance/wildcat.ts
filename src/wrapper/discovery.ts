import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { normalizeAnalyticsPageRequest, toAnalyticsPage } from "../analytics/pagination";
import { AnalyticsPage, AnalyticsPageRequest } from "../analytics/types";
import { SupportedChainId } from "../constants";
import {
  GetTokenWrapperForMarketDocument,
  GetWrappedMarketsPageDocument,
  SubgraphGetTokenWrapperForMarketQuery,
  SubgraphGetTokenWrapperForMarketQueryVariables,
  SubgraphGetWrappedMarketsPageQuery,
  SubgraphGetWrappedMarketsPageQueryVariables,
  SubgraphTokenWrapperDataFragment
} from "../gql/graphql";
import { assertMatchingAddress } from "../internal/read-identity";
import { SignerOrProvider } from "../types";
import { assert } from "../utils";

export { GetTokenWrapperForMarketDocument, GetWrappedMarketsPageDocument };

type SubgraphTokenWrapperFactoryData = SubgraphTokenWrapperDataFragment["factory"];
type SubgraphTokenWrapperDeployedEventData = NonNullable<
  SubgraphTokenWrapperDataFragment["deployedEvent"]
>;

export type SubgraphTokenWrapperData = Omit<
  SubgraphTokenWrapperDataFragment,
  "__typename" | "deployedEvent" | "factory"
> & {
  __typename?: SubgraphTokenWrapperDataFragment["__typename"];
  factory: Omit<SubgraphTokenWrapperFactoryData, "__typename"> & {
    __typename?: SubgraphTokenWrapperFactoryData["__typename"];
  };
  deployedEvent?:
    | (Omit<SubgraphTokenWrapperDeployedEventData, "__typename"> & {
        __typename?: SubgraphTokenWrapperDeployedEventData["__typename"];
      })
    | null;
};

export type GetTokenWrapperForMarketOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  market: string;
  fetchPolicy?: FetchPolicy;
  fallbackToFactory?: boolean;
};

export type WrappedMarket = {
  id: string;
  name: string;
  tokenWrapper: SubgraphTokenWrapperData;
};

export type WrappedMarketsPage = AnalyticsPage<WrappedMarket>;

export type GetWrappedMarketsPageOptions = AnalyticsPageRequest & {
  fetchPolicy?: FetchPolicy;
};

const assertWrapperIdentity = (wrapper: SubgraphTokenWrapperData, market: string): void => {
  assertMatchingAddress(wrapper.marketAddress, market, "Subgraph wrapper parent market");
  assertMatchingAddress(wrapper.marketToken.address, market, "Subgraph wrapper market token");
  assertMatchingAddress(wrapper.token.address, wrapper.address, "Subgraph wrapper share token");
};

/** Read indexed metadata and deployment provenance without making RPC requests. */
export async function getTokenWrapperDataForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  market: string,
  fetchPolicy: FetchPolicy = "cache-first"
): Promise<SubgraphTokenWrapperData | undefined> {
  const result = await subgraphClient.query<
    SubgraphGetTokenWrapperForMarketQuery,
    SubgraphGetTokenWrapperForMarketQueryVariables
  >({
    query: GetTokenWrapperForMarketDocument,
    variables: { market: market.toLowerCase() },
    fetchPolicy,
    errorPolicy: "none"
  });

  const marketData = result.data.market;
  if (!marketData) return undefined;
  assertMatchingAddress(marketData.id, market, "Subgraph wrapper market");
  const wrapper = marketData.tokenWrapper;
  if (wrapper) assertWrapperIdentity(wrapper, market);
  return wrapper ?? undefined;
}

/**
 * Discover registered markets with indexed wrappers, without RPC reads.
 * Pass pageInfo.nextCursor as `after` to keep subsequent pages at the same block.
 * A full page may be followed by an empty terminal page. Indexed results can lag
 * the chain; indexedAt reports the snapshot, not whether replay is complete.
 */
export async function getWrappedMarketsPage(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy = "network-only", ...request }: GetWrappedMarketsPageOptions = {}
): Promise<WrappedMarketsPage> {
  const { first, afterId, block } = normalizeAnalyticsPageRequest(request);
  const { data } = await subgraphClient.query<
    SubgraphGetWrappedMarketsPageQuery,
    SubgraphGetWrappedMarketsPageQueryVariables
  >({
    query: GetWrappedMarketsPageDocument,
    variables: { first, afterId, block },
    fetchPolicy,
    errorPolicy: "none"
  });

  let previousId = afterId;
  const items = data.markets.map(({ id, name, tokenWrapper }): WrappedMarket => {
    assert(id > previousId, "Wrapped market page IDs must advance in ascending order");
    previousId = id;
    assert(tokenWrapper != null, "Wrapped market query returned a market without a wrapper");
    assertWrapperIdentity(tokenWrapper, id);
    return { id, name, tokenWrapper };
  });
  const page = toAnalyticsPage(items, first, data._meta);
  assert(!page.indexedAt.hasIndexingErrors, "Wrapper discovery subgraph has indexing errors");
  if (block?.number != null) {
    assert(
      page.indexedAt.blockNumber === block.number,
      "Wrapped market page block does not match the requested snapshot"
    );
  }
  return page;
}
