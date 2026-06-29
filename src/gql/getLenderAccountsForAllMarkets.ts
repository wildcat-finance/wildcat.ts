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
    data: { markets: _markets, controllerAuthorizations }
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
  const authorizedMarkets = controllerAuthorizations
    .filter((auth) => !!auth.controller)
    .map((auth) => auth.controller.markets)
    .flat();
  return _markets.map((marketData) => {
    const market = Market.fromSubgraphMarketData(chainId, signerOrProvider, marketData);
    const lenderData = marketData.lenders[0];
    if (!lenderData) {
      const authorization = authorizedMarkets.find(
        (auth) => auth.id.toLowerCase() === market.address.toLowerCase()
      );
      return MarketAccount.fromMarketDataOnly(market, lender, !!authorization);
    }
    return MarketAccount.fromSubgraphAccountData(market, lenderData);
  });
}
