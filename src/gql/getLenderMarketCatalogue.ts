import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { HooksInstance, hooksInstanceFromSubgraph } from "../access";
import { MarketAccount } from "../account";
import { SupportedChainId } from "../constants";
import { Market } from "../market";
import { SignerOrProvider } from "../types";
import { parseSubgraphLenderHooksAccess } from "../utils";
import { getLenderMarketCatalogueDocumentForChain } from "./document-selectors";
import {
  SubgraphGetLenderMarketCatalogueQuery,
  SubgraphGetLenderMarketCatalogueQueryVariables
} from "./graphql";

export type LenderMarketCatalogue = {
  accounts: MarketAccount[];
  indexedBlockNumber?: number;
  indexedBlockTimestamp?: number;
};

export type GetLenderMarketCatalogueOptions = Omit<
  SubgraphGetLenderMarketCatalogueQueryVariables,
  "lender"
> & {
  lender: string;
  chainId: SupportedChainId;
  fetchPolicy?: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

/**
 * Fetch current market and lender state without raw market history.
 *
 * The returned accounts represent the indexed subgraph block. Consumers may
 * enrich the same Market and MarketAccount instances with Lens data for newer
 * chain and wallet state.
 */
export async function getLenderMarketCatalogue(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    fetchPolicy = "cache-first",
    chainId,
    signerOrProvider,
    ...variables
  }: GetLenderMarketCatalogueOptions
): Promise<LenderMarketCatalogue> {
  const {
    data: { _meta, markets, controllerAuthorizations, lenderHooksAccesses }
  } = await subgraphClient.query<
    SubgraphGetLenderMarketCatalogueQuery,
    SubgraphGetLenderMarketCatalogueQueryVariables
  >({
    query: getLenderMarketCatalogueDocumentForChain(chainId),
    variables: {
      lender: lender.toLowerCase(),
      ...variables
    },
    fetchPolicy
  });

  const authorizedMarkets = new Set(
    controllerAuthorizations
      .filter((authorization) => !!authorization.controller)
      .flatMap((authorization) => authorization.controller.markets)
      .map(({ id }) => id.toLowerCase())
  );
  const hooksInstances = new Map<string, HooksInstance>();
  const hooksAccessByInstance = new Map(
    lenderHooksAccesses.map((access) => [access.hooks.id.toLowerCase(), access])
  );

  const accounts = markets.map((marketData) => {
    let hooksInstance: HooksInstance | undefined;
    if (marketData.hooks) {
      const hooksAddress = marketData.hooks.id.toLowerCase();
      hooksInstance = hooksInstances.get(hooksAddress);
      if (!hooksInstance) {
        hooksInstance = hooksInstanceFromSubgraph(chainId, signerOrProvider, marketData.hooks);
        hooksInstances.set(hooksAddress, hooksInstance);
      }
    }

    const market = Market.fromSubgraphMarketData(
      chainId,
      signerOrProvider,
      marketData,
      undefined,
      hooksInstance
    );
    const hooksAccess = hooksInstance
      ? hooksAccessByInstance.get(hooksInstance.address.toLowerCase())
      : undefined;
    const access = hooksAccess
      ? {
          credential: parseSubgraphLenderHooksAccess(hooksAccess),
          isKnownLender: hooksAccess.knownLenderStatuses.some(
            ({ market: knownMarket }) =>
              knownMarket.id.toLowerCase() === market.address.toLowerCase()
          )
        }
      : undefined;
    const lenderData = marketData.lenders[0];

    if (lenderData) {
      return MarketAccount.fromSubgraphAccountData(market, lenderData, access);
    }
    return MarketAccount.fromMarketDataOnly(
      market,
      lender,
      authorizedMarkets.has(market.address.toLowerCase()),
      access
    );
  });

  return {
    accounts,
    indexedBlockNumber: _meta?.block.number,
    indexedBlockTimestamp: _meta?.block.timestamp ?? undefined
  };
}
