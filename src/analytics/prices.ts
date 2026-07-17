import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  getSubgraphClientDeploymentMetadata,
  getSubgraphFeatureAvailability,
  requireSubgraphFeature
} from "../config";
import {
  GetAnalyticsTokensDocument,
  GetLatestTokenPriceObservationDocument,
  GetTokenPriceObservationPageDocument,
  SubgraphGetAnalyticsTokensQuery,
  SubgraphGetAnalyticsTokensQueryVariables,
  SubgraphGetLatestTokenPriceObservationQuery,
  SubgraphGetLatestTokenPriceObservationQueryVariables,
  SubgraphGetTokenPriceObservationPageQuery,
  SubgraphGetTokenPriceObservationPageQueryVariables,
  SubgraphTokenDailyPrice_Filter,
  SubgraphToken_Filter
} from "../gql/graphql";
import { assert } from "../utils";
import {
  normalizeAnalyticsToken,
  normalizeIndexedQueryMetadata,
  normalizeTokenPriceObservation
} from "./normalizers";
import { MAX_INDEXED_PAGE_SIZE, normalizeIndexedPageRequest, toIndexedPage } from "./pagination";
import { IndexedReadOptions, normalizeAddresses } from "./read-options";
import {
  IndexedAnalyticsToken,
  IndexedPage,
  IndexedTokenUsdPrice,
  IndexedTokenUsdPrices,
  TokenPriceObservation
} from "./types";

export type GetAnalyticsTokenPageOptions = IndexedReadOptions & {
  addresses?: readonly string[];
};

export const getAnalyticsTokenPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  { addresses, fetchPolicy = "cache-first", ...request }: GetAnalyticsTokenPageOptions = {}
): Promise<IndexedPage<IndexedAnalyticsToken>> => {
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphToken_Filter = {
    id_gt: afterId,
    ...(addresses ? { address_in: normalizeAddresses(addresses) } : {})
  };
  const { data } = await client.query<
    SubgraphGetAnalyticsTokensQuery,
    SubgraphGetAnalyticsTokensQueryVariables
  >({
    query: GetAnalyticsTokensDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.tokens.map(normalizeAnalyticsToken),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetTokenPriceObservationPageOptions = IndexedReadOptions & {
  tokens?: readonly string[];
  fromTimestamp?: number;
  toTimestamp?: number;
};

export const getTokenPriceObservationPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    tokens,
    fromTimestamp,
    toTimestamp,
    fetchPolicy = "cache-first",
    ...request
  }: GetTokenPriceObservationPageOptions = {}
): Promise<IndexedPage<TokenPriceObservation>> => {
  await requireSubgraphFeature(client, "pricing");
  const { first, afterId, block } = normalizeIndexedPageRequest(request);
  const filter: SubgraphTokenDailyPrice_Filter = {
    id_gt: afterId,
    ...(tokens ? { token_in: normalizeAddresses(tokens) } : {}),
    ...(fromTimestamp !== undefined ? { timestamp_gte: fromTimestamp } : {}),
    ...(toTimestamp !== undefined ? { timestamp_lt: toTimestamp } : {})
  };
  const { data } = await client.query<
    SubgraphGetTokenPriceObservationPageQuery,
    SubgraphGetTokenPriceObservationPageQueryVariables
  >({
    query: GetTokenPriceObservationPageDocument,
    variables: { filter, first, block },
    fetchPolicy
  });
  return toIndexedPage(
    data.tokenDailyPrices.map(normalizeTokenPriceObservation),
    first,
    normalizeIndexedQueryMetadata(data._meta)
  );
};

export type GetLatestTokenUsdPricesOptions = {
  tokens: readonly string[];
  fetchPolicy?: FetchPolicy;
};

/** Latest indexed quote per token with explicit reasons for every unpriced result. */
export const getLatestTokenUsdPrices = async (
  client: ApolloClient<NormalizedCacheObject>,
  { tokens, fetchPolicy = "cache-first" }: GetLatestTokenUsdPricesOptions
): Promise<IndexedTokenUsdPrices> => {
  const addresses = normalizeAddresses(tokens);
  assert(addresses.length <= MAX_INDEXED_PAGE_SIZE, "Too many token price targets");

  const [tokenPage, metadata] = await Promise.all([
    getAnalyticsTokenPage(client, {
      addresses,
      first: Math.max(1, addresses.length),
      fetchPolicy
    }),
    getSubgraphClientDeploymentMetadata(client)
  ]);
  const indexedTokens = tokenPage.items;
  const priceBlock = { number: Number(tokenPage.indexedAt.blockNumber) };
  const tokensByAddress = new Map(
    indexedTokens.map((token) => [token.address.toLowerCase(), token])
  );
  const analytics = getSubgraphFeatureAvailability(metadata, "analytics");
  const pricing = getSubgraphFeatureAvailability(metadata, "pricing");

  const results = new Map<string, IndexedTokenUsdPrice>();
  const observedTokens: IndexedAnalyticsToken[] = [];
  for (const address of addresses) {
    const token = tokensByAddress.get(address);
    if (!token) {
      results.set(address, { status: "unpriced", address, reason: "token-not-indexed" });
    } else if (!analytics.available) {
      results.set(address, {
        status: "unpriced",
        address,
        token,
        reason: "analytics-disabled"
      });
    } else if (!pricing.available) {
      results.set(address, {
        status: "unpriced",
        address,
        token,
        reason: "pricing-disabled"
      });
    } else if (token.isUsdStablecoin && token.priceSource === "usd-peg") {
      results.set(address, {
        status: "priced",
        address,
        token,
        priceUSD: "1",
        source: "usd-peg",
        basis: "configured-peg"
      });
    } else if (token.priceSource === "unknown") {
      results.set(address, { status: "unpriced", address, token, reason: "no-price-source" });
    } else {
      observedTokens.push(token);
    }
  }

  await Promise.all(
    observedTokens.map(async (token) => {
      const filter: SubgraphTokenDailyPrice_Filter = { token: token.address.toLowerCase() };
      const { data } = await client.query<
        SubgraphGetLatestTokenPriceObservationQuery,
        SubgraphGetLatestTokenPriceObservationQueryVariables
      >({
        query: GetLatestTokenPriceObservationDocument,
        variables: { filter, block: priceBlock },
        fetchPolicy
      });
      const rawObservation = data.tokenDailyPrices[0];
      const address = token.address.toLowerCase();
      if (!rawObservation) {
        results.set(address, { status: "unpriced", address, token, reason: "no-observation" });
        return;
      }
      const observation = normalizeTokenPriceObservation(rawObservation);
      results.set(address, {
        status: "priced",
        address,
        token,
        priceUSD: observation.priceUSD,
        source: observation.source,
        basis: "observation",
        observation
      });
    })
  );

  return {
    indexedAt: tokenPage.indexedAt,
    prices: addresses.map((address) => results.get(address) as IndexedTokenUsdPrice)
  };
};
