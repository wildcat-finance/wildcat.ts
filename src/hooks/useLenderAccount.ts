import { useQuery } from "@tanstack/react-query";
import { Market } from "../market";
import { SignerOrProvider } from "../types";
import {
  GetLenderAccountForMarketDocument,
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables,
  SubgraphGetMarketQueryVariables
} from "../gql/graphql";
import { getSubgraphClient, getLensContract, SupportedChainId } from "../constants";
import { TwoStepQueryHookResult } from "./types";
import { MarketAccount } from "../account";

export type UseLenderProps = {
  chainId: SupportedChainId;
  market: Market | undefined;
  lender: string | undefined;
  provider: SignerOrProvider | undefined;
  enabled: boolean;
} & Omit<SubgraphGetMarketQueryVariables, "market">;

export function useLenderAccount({
  chainId,
  market,
  lender,
  provider,
  enabled,
  ...filters
}: UseLenderProps): TwoStepQueryHookResult<MarketAccount | undefined> {
  const marketAddress = market?.address.toLowerCase();
  const lenderAddress = lender?.toLowerCase();
  async function queryMarketAccount() {
    const result = await getSubgraphClient(chainId).query<
      SubgraphGetLenderAccountForMarketQuery,
      SubgraphGetLenderAccountForMarketQueryVariables
    >({
      query: GetLenderAccountForMarketDocument,
      variables: {
        market: marketAddress as string,
        lender: lenderAddress as string,
        ...filters
      }
    });
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
    const lens = getLensContract(chainId, provider);
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
