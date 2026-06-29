import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetAllMarketsForLenderListViewDocument,
  GetAllMarketsForLenderViewDocument,
  SubgraphGetAllMarketsForLenderListViewQuery,
  SubgraphGetAllMarketsForLenderListViewQueryVariables,
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
} from "./graphql";
import { MarketAccount } from "../account";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";

type GetLenderAccountsForAllMarketsOptions = SubgraphGetAllMarketsForLenderViewQueryVariables & {
  lender: string;
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

type GetLenderAccountsForAllMarketsListOptions =
  SubgraphGetAllMarketsForLenderListViewQueryVariables & {
    lender: string;
    chainId: SupportedChainId;
    fetchPolicy: FetchPolicy;
    signerOrProvider: SignerOrProvider;
  };

function buildMarketAccounts(
  chainId: SupportedChainId,
  signerOrProvider: SignerOrProvider,
  lender: string,
  markets: SubgraphGetAllMarketsForLenderListViewQuery["markets"],
  controllerAuthorizations: SubgraphGetAllMarketsForLenderListViewQuery["controllerAuthorizations"]
): MarketAccount[] {
  const authorizedMarkets = controllerAuthorizations
    .filter((auth) => !!auth.controller)
    .map((auth) => auth.controller.markets)
    .flat();
  return markets.map((marketData) => {
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
    query: GetAllMarketsForLenderViewDocument,
    variables: {
      lender: lender.toLowerCase(),
      ...variables
    },
    fetchPolicy
  });
  return buildMarketAccounts(chainId, signerOrProvider, lender, _markets, controllerAuthorizations);
}

export async function getLenderAccountsForAllMarketsList(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    lender,
    fetchPolicy,
    chainId,
    signerOrProvider,
    ...variables
  }: GetLenderAccountsForAllMarketsListOptions
): Promise<MarketAccount[]> {
  const {
    data: { markets: _markets, controllerAuthorizations }
  } = await subgraphClient.query<
    SubgraphGetAllMarketsForLenderListViewQuery,
    SubgraphGetAllMarketsForLenderListViewQueryVariables
  >({
    query: GetAllMarketsForLenderListViewDocument,
    variables: {
      lender: lender.toLowerCase(),
      ...variables
    },
    fetchPolicy
  });
  return buildMarketAccounts(chainId, signerOrProvider, lender, _markets, controllerAuthorizations);
}
