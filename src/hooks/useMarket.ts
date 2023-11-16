import { useQuery } from "@tanstack/react-query";
import { Market } from "../market";
import { SignerOrProvider } from "../types";
import {
  GetMarketDocument,
  SubgraphGetMarketQuery,
  SubgraphGetMarketQueryVariables
} from "../gql/graphql";
import { SubgraphClient, getLensContract } from "../constants";
import { TwoStepQueryHookResult } from "./types";

export type UseMarketProps = {
  address: string | undefined;
  provider: SignerOrProvider | undefined;
  enabled: boolean;
} & Omit<SubgraphGetMarketQueryVariables, "market">;

export function useMarket({
  address,
  provider,
  enabled,
  ...filters
}: UseMarketProps): TwoStepQueryHookResult<Market | undefined> {
  const marketAddress = address?.toLowerCase();
  async function queryMarket() {
    if (!marketAddress || !provider) throw Error();
    const result = await SubgraphClient.query<
      SubgraphGetMarketQuery,
      SubgraphGetMarketQueryVariables
    >({
      query: GetMarketDocument,
      variables: {
        market: marketAddress,
        ...filters
      }
    });
    return Market.fromSubgraphMarketData(provider, result.data.market!);
  }

  const {
    data,
    isLoading: isLoadingInitial,
    refetch: refetchInitial,
    isError: isErrorInitial,
    failureReason: errorInitial
  } = useQuery({
    queryKey: ["getMarket/initial", marketAddress],
    queryFn: queryMarket,
    enabled: !!marketAddress && !!provider && enabled,
    refetchOnMount: false
  });
  async function updateMarket() {
    if (!data || !marketAddress || !provider) throw Error();
    const lens = getLensContract(provider);
    const update = await lens.getMarketData(marketAddress);
    data.updateWith(update);
    return data;
  }

  const {
    data: updatedMarket,
    isLoading: isLoadingUpdate,
    isPaused: isPendingUpdate,
    refetch: refetchUpdate,
    isError: isErrorUpdate,
    failureReason: errorUpdate
  } = useQuery({
    queryKey: ["getMarket/update", marketAddress],
    queryFn: updateMarket,
    enabled: !!data,
    refetchOnMount: false
  });

  return {
    data: updatedMarket ?? data,
    isLoadingInitial,
    isErrorInitial,
    errorInitial: errorInitial as Error | null,
    refetchInitial,
    isLoadingUpdate,
    isPendingUpdate,
    isErrorUpdate,
    errorUpdate: errorUpdate as Error | null,
    refetchUpdate
  };
}
