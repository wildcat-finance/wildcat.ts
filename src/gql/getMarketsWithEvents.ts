import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Market } from "../market";
import {
  GetMarketsWithEventsDocument,
  SubgraphGetMarketsWithEventsQuery,
  SubgraphGetMarketsWithEventsQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { getMarketListAsMarkets } from "./getMarketList";

type GetMarketsWithEventsOptions = SubgraphGetMarketsWithEventsQueryVariables & {
  chainId: SupportedChainId;
  fetchPolicy: FetchPolicy;
  signerOrProvider: SignerOrProvider;
};

export async function getMarketsWithEvents(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, signerOrProvider, ...variables }: GetMarketsWithEventsOptions
): Promise<Market[]> {
  const shouldSkipRecords = variables.shouldSkipRecords;
  const marketListVariables = { ...variables };
  delete marketListVariables.shouldSkipRecords;
  delete marketListVariables.numDeposits;
  delete marketListVariables.skipDeposits;
  delete marketListVariables.orderDeposits;
  delete marketListVariables.directionDeposits;
  delete marketListVariables.numBorrows;
  delete marketListVariables.skipBorrows;
  delete marketListVariables.orderBorrows;
  delete marketListVariables.directionBorrows;
  delete marketListVariables.numFeeCollections;
  delete marketListVariables.skipFeeCollections;
  delete marketListVariables.orderFeeCollections;
  delete marketListVariables.directionFeeCollections;
  delete marketListVariables.numRepayments;
  delete marketListVariables.skipRepayments;
  delete marketListVariables.orderRepayments;
  delete marketListVariables.directionRepayments;

  if (shouldSkipRecords) {
    return getMarketListAsMarkets(subgraphClient, {
      chainId,
      fetchPolicy,
      signerOrProvider,
      ...marketListVariables
    });
  }

  const result = await subgraphClient.query<
    SubgraphGetMarketsWithEventsQuery,
    SubgraphGetMarketsWithEventsQueryVariables
  >({
    query: GetMarketsWithEventsDocument,
    variables: { ...variables },
    fetchPolicy
  });

  return (
    result.data.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    ) ?? []
  );
}
