import { useQuery } from "@tanstack/react-query";
import {
  GetMarketsForBorrowerDocument,
  SubgraphGetMarketsForBorrowerQuery,
  SubgraphGetMarketsForBorrowerQueryVariables
} from "../gql/graphql";
import { Market } from "../market";
import { SubgraphClient, getLensContract } from "../constants";
import { logger } from "../utils/logger";
import { useMemo } from "react";
import { TwoStepQueryHookResult } from "./types";
import { SignerOrProvider } from "../types";

export type MarketsForBorrowerProps = {
  borrower: string;
  provider: SignerOrProvider;
} & Omit<SubgraphGetMarketsForBorrowerQueryVariables, "borrower">;

export function useMarketsForBorrower({
  borrower: _borrower,
  provider,
  ...filters
}: MarketsForBorrowerProps): TwoStepQueryHookResult<Market[]> {
  const borrower = _borrower.toLowerCase();

  async function queryMarketsForBorrower() {
    const result = await SubgraphClient.query<
      SubgraphGetMarketsForBorrowerQuery,
      SubgraphGetMarketsForBorrowerQueryVariables
    >({
      query: GetMarketsForBorrowerDocument,
      variables: { borrower, ...filters }
    });
    return (
      result.data.controllers[0].markets.map((market) =>
        Market.fromSubgraphMarketData(provider, market)
      ) ?? []
    );
  }

  const {
    data,
    isLoading: isLoadingInitial,
    refetch: refetchInitial,
    isError: isErrorInitial,
    error: errorInitial
  } = useQuery({
    queryKey: ["marketsForBorrower/initial", borrower],
    queryFn: queryMarketsForBorrower,
    enabled: !!borrower,
    refetchOnMount: false
  });

  const markets = data ?? [];
  async function updateMarkets() {
    const lens = getLensContract(provider);
    const updatedMarkets = await lens.getMarketsData(markets.map((x) => x.address));
    for (let i = 0; i < markets.length; i++) {
      const market = markets[i];
      const update = updatedMarkets[i];
      market.updateWith(update);
    }
    logger.debug(`Got ${markets.length} market updates`);
    return markets;
  }

  const updateQueryKeys = useMemo(() => {
    return markets.map((b) => [b.address]);
  }, [markets]);

  const {
    data: updatedMarkets,
    isLoading: isLoadingUpdate,
    isPending: isPendingUpdate,
    refetch: refetchUpdate,
    isError: isErrorUpdate,
    error: errorUpdate
  } = useQuery({
    queryKey: ["marketsForBorrower/update", updateQueryKeys],
    queryFn: updateMarkets,
    enabled: !!data,
    refetchOnMount: false
  });

  return {
    data: updatedMarkets ?? markets,
    isLoadingInitial,
    isErrorInitial,
    errorInitial,
    refetchInitial,
    isLoadingUpdate,
    isPendingUpdate,
    isErrorUpdate,
    errorUpdate,
    refetchUpdate
  };
}
