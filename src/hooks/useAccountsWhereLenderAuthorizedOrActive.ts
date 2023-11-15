import { useQuery } from "@tanstack/react-query";
import {
  GetAccountsWhereLenderAuthorizedOrActiveDocument,
  SubgraphDeposit_OrderBy,
  SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
  SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables,
  SubgraphOrderDirection
} from "../gql/graphql";
import { Market } from "../market";
import { SubgraphClient, getLensContract } from "../constants";
import { SignerOrProvider } from "../types";
import { logger } from "../utils/logger";
import { MarketAccount } from "../account";
import { useMemo } from "react";
import { TwoStepQueryHookResult } from "./types";

export type AccountsWhereLenderAuthorizedOrActiveProps = {
  lender: string;
  provider: SignerOrProvider;
  numDeposits?: number;
  skipDeposits?: number;
  orderDeposits?: SubgraphDeposit_OrderBy;
  directionDeposits?: SubgraphOrderDirection;
};

export function useAccountsWhereLenderAuthorizedOrActive({
  lender: _lender,
  provider,
  ...depositFilters
}: AccountsWhereLenderAuthorizedOrActiveProps): TwoStepQueryHookResult<MarketAccount[]> {
  const lender = _lender.toLowerCase();
  async function queryLenders() {
    logger.debug(`Getting lenders...`);
    const result = await SubgraphClient.query<
      SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
      SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
    >({
      query: GetAccountsWhereLenderAuthorizedOrActiveDocument,
      variables: {
        lender,
        ...depositFilters,
        numWithdrawals: 1
      }
    });
    logger.debug(`Got ${result.data.lenderAccounts.length} lenders...`);
    return result.data.lenderAccounts.map((account) => {
      const market = Market.fromSubgraphMarketData(provider, account.market);
      return MarketAccount.fromSubgraphAccountData(market, account);
    });
  }

  const {
    data,
    isLoading: isLoadingInitial,
    refetch: refetchInitial,
    isError: isErrorInitial,
    error: errorInitial
  } = useQuery({
    queryKey: ["accountsWhereLenderAuthorizedOrActive/initial", lender],
    queryFn: queryLenders,
    enabled: !!lender,
    refetchOnMount: false
  });

  const accounts = data ?? [];

  async function getLenderUpdates() {
    logger.debug(`Getting lender updates...`);
    const lens = getLensContract(provider);
    const accountUpdates = await lens.getMarketsDataWithLenderStatus(
      lender,
      accounts.map((x) => x.market.address)
    );
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const update = accountUpdates[i];
      account.market.updateWith(update.market);
      account.updateWith(update.lenderStatus);
    }
    logger.debug(`Got lender updates: ${accounts.length}`);
    return accounts;
  }

  const updateQueryKeys = useMemo(() => {
    return accounts.map((b) => [b.market.address]);
  }, [accounts]);

  const {
    data: updatedLenders,
    isLoading: isLoadingUpdate,
    isPending: isPendingUpdate,
    refetch: refetchUpdate,
    isError: isErrorUpdate,
    error: errorUpdate
  } = useQuery({
    queryKey: ["accountsWhereLenderAuthorizedOrActive/update", updateQueryKeys],
    queryFn: getLenderUpdates,
    enabled: !!data,
    refetchOnMount: false
  });

  return {
    data: updatedLenders ?? accounts,
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
