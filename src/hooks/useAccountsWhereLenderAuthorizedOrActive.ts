import { useQuery } from "@tanstack/react-query";
import {
  GetAccountsWhereLenderAuthorizedOrActiveDocument,
  SubgraphBorrow_OrderBy,
  SubgraphDebtRepaid_OrderBy,
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
  lender: string | undefined;
  provider: SignerOrProvider | undefined;
  enabled: boolean;
  numDeposits?: number;
  skipDeposits?: number;
  orderDeposits?: SubgraphDeposit_OrderBy;
  directionDeposits?: SubgraphOrderDirection;
  numWithdrawals?: number;
  skipWithdrawals?: number;
  numBorrows?: number;
  skipBorrows?: number;
  orderBorrows?: SubgraphBorrow_OrderBy;
  directionBorrows?: SubgraphOrderDirection;
  numRepayments?: number;
  skipRepayments?: number;
  orderRepayments?: SubgraphDebtRepaid_OrderBy;
  directionRepayments?: SubgraphOrderDirection;
};

export function useAccountsWhereLenderAuthorizedOrActive({
  lender: _lender,
  provider,
  enabled,
  ...filters
}: AccountsWhereLenderAuthorizedOrActiveProps): TwoStepQueryHookResult<MarketAccount[]> {
  const lender = _lender?.toLowerCase();
  async function queryLenders() {
    logger.debug(`Getting lenders...`);
    const result = await SubgraphClient.query<
      SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
      SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
    >({
      query: GetAccountsWhereLenderAuthorizedOrActiveDocument,
      variables: {
        lender: lender as string,
        ...filters,
        numWithdrawals: 1
      }
    });
    logger.debug(`Got ${result.data.lenderAccounts.length} existing lender accounts...`);

    const lenderAccounts = result.data.lenderAccounts.map((account) => {
      const market = Market.fromSubgraphMarketData(provider as SignerOrProvider, account.market);
      return MarketAccount.fromSubgraphAccountData(market, account);
    });
    result.data.controllerAuthorizations.map((controller) => {
      const markets = controller.controller.markets.filter((market) => {
        const marketAccount = lenderAccounts.find(
          (account) => account.market.address.toLowerCase() === market.id.toLowerCase()
        );
        return !marketAccount;
      });
      logger.debug(`Got markets without account: ${markets.length}!`);
      for (const marketData of markets) {
        const market = Market.fromSubgraphMarketData(provider as SignerOrProvider, marketData);
        const account = MarketAccount.fromMarketDataOnly(market, lender as string, true);
        lenderAccounts.push(account);
      }
    });
    logger.debug(`Got ${lenderAccounts.length} lender accounts...`);
    return lenderAccounts;
  }

  const {
    data,
    isLoading: isLoadingInitial,
    refetch: refetchInitial,
    isError: isErrorInitial,
    failureReason: errorInitial
  } = useQuery({
    queryKey: ["accountsWhereLenderAuthorizedOrActive/initial", lender],
    queryFn: queryLenders,
    enabled: !!lender && !!provider && enabled,
    refetchOnMount: false
  });

  const accounts = data ?? [];

  async function getLenderUpdates() {
    logger.debug(`Getting lender updates...`);
    const lens = getLensContract(provider as SignerOrProvider);
    const accountUpdates = await lens.getMarketsDataWithLenderStatus(
      lender as string,
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
    isPaused: isPendingUpdate,
    refetch: refetchUpdate,
    isError: isErrorUpdate,
    failureReason: errorUpdate
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
    errorInitial: errorInitial as Error | null,
    refetchInitial,
    isLoadingUpdate,
    isPendingUpdate,
    isErrorUpdate,
    errorUpdate: errorUpdate as Error | null,
    refetchUpdate
  };
}
