import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
} from "./graphql";
import { MarketAccount } from "../account";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { getAllMarketsForLenderViewDocumentForChain } from "./document-selectors";
import { HooksInstance, hooksInstanceFromSubgraph } from "../access";
import { parseSubgraphLenderHooksAccess } from "../utils";

type GetLenderAccountsForAllMarketsOptions = SubgraphGetAllMarketsForLenderViewQueryVariables & {
  lender: string;
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

export async function getLenderAccountsForAllMarkets(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    fetchPolicy,
    chainId,
    signerOrProvider,
    ...variables
  }: GetLenderAccountsForAllMarketsOptions
): Promise<MarketAccount[]> {
  const {
    data: { markets: _markets, controllerAuthorizations, lenderHooksAccesses }
  } = await subgraphClient.query<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >({
    query: getAllMarketsForLenderViewDocumentForChain(chainId),
    variables: {
      lender: lender.toLowerCase(),
      ...variables
    },
    fetchPolicy
  });
  const authorizedMarkets = new Set(
    controllerAuthorizations
      .filter((auth) => !!auth.controller)
      .map((auth) => auth.controller.markets)
      .flat()
      .map(({ id }) => id.toLowerCase())
  );
  const hooksInstances = new Map<string, HooksInstance>();
  const hooksAccessByInstance = new Map(
    lenderHooksAccesses.map((access) => [access.hooks.id.toLowerCase(), access])
  );
  return _markets.map((marketData) => {
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
    if (!lenderData) {
      return MarketAccount.fromMarketDataOnly(
        market,
        lender,
        authorizedMarkets.has(market.address.toLowerCase()),
        access
      );
    }
    return MarketAccount.fromSubgraphAccountData(market, lenderData, access);
  });
}
