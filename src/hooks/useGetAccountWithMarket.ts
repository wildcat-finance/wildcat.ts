import { useQuery } from "@tanstack/react-query";
import { Market } from "../market";
import { SignerOrProvider } from "../types";
import {
  GetLenderAccountWithMarketDocument,
  SubgraphGetLenderAccountWithMarketQuery,
  SubgraphGetLenderAccountWithMarketQueryVariables,
  SubgraphGetMarketQueryVariables
} from "../gql/graphql";
import { SubgraphClient, getLensContract } from "../constants";
import { TwoStepQueryHookResult } from "./types";
import { MarketAccount } from "../account";

export type UseLenderWithMarketProps = {
  market: string | undefined;
  lender: string | undefined;
  provider: SignerOrProvider | undefined;
  enabled: boolean;
} & Omit<SubgraphGetMarketQueryVariables, "market">;

export function useGetAccountWithMarket({
  market,
  lender,
  provider,
  enabled,
  ...filters
}: UseLenderWithMarketProps): TwoStepQueryHookResult<MarketAccount | undefined> {
  const marketAddress = market?.toLowerCase();
  const lenderAddress = lender?.toLowerCase();
  async function queryMarketAccount() {
    const result = await SubgraphClient.query<
      SubgraphGetLenderAccountWithMarketQuery,
      SubgraphGetLenderAccountWithMarketQueryVariables
    >({
      query: GetLenderAccountWithMarketDocument,
      variables: {
        market: marketAddress as string,
        lender: lenderAddress as string,
        ...filters
      }
    });
    const market = Market.fromSubgraphMarketData(provider as SignerOrProvider, result.data.market!);
    return MarketAccount.fromSubgraphAccountData(market as Market, result.data.market!.lenders[0]!);
  }

  const {
    data,
    isLoading: isLoadingInitial,
    refetch: refetchInitial,
    isError: isErrorInitial,
    failureReason: errorInitial
  } = useQuery({
    queryKey: ["getLenderAccount/initial", marketAddress, lenderAddress],
    queryFn: queryMarketAccount,
    enabled: !!market && !!lenderAddress && !!provider && enabled,
    refetchOnMount: false
  });
  async function updateMarketAccount() {
    if (!data || !provider) throw Error();
    const lens = getLensContract(provider);
    const update = await lens.getMarketDataWithLenderStatus(
      lenderAddress as string,
      marketAddress as string
    );
    data.updateWith(update.lenderStatus);
    data.market.updateWith(update.market);
    return data;
  }

  const {
    data: updatedLender,
    isLoading: isLoadingUpdate,
    isPaused: isPendingUpdate,
    refetch: refetchUpdate,
    isError: isErrorUpdate,
    failureReason: errorUpdate
  } = useQuery({
    queryKey: ["getLenderAccount/update", marketAddress, lenderAddress],
    queryFn: updateMarketAccount,
    enabled: !!data,
    refetchOnMount: false
  });

  return {
    data: updatedLender ?? data,
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
