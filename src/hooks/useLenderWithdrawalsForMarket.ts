import { useQuery } from "@tanstack/react-query";
import {
  GetLenderWithdrawalsForMarketDocument,
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables
} from "../gql/graphql";
import { Market } from "../market";
import { getSubgraphClient, SupportedChainId, getLensContract } from "../constants";
import { WithdrawalBatch } from "../withdrawal-batch";
import { logger } from "../utils/logger";
import { useMemo } from "react";
import { TwoStepQueryHookResult } from "./types";
import { LenderWithdrawalStatus } from "../withdrawal-status";

export type LenderWithdrawalsForMarketProps = {
  chainId: SupportedChainId;
  lender: string | undefined;
  market: Market | undefined;
  enabled: boolean;
};

export type LenderWithdrawalsForMarketResult = {
  completeWithdrawals: LenderWithdrawalStatus[];
  incompleteWithdrawals: LenderWithdrawalStatus[];
};

export function useLenderWithdrawalsForMarket({
  chainId,
  lender: _lender,
  market: _market,
  enabled
}: LenderWithdrawalsForMarketProps): TwoStepQueryHookResult<LenderWithdrawalsForMarketResult> {
  const lender = _lender?.toLowerCase();
  const market = _market?.address.toLowerCase();
  // getLenderWithdrawalsForMarket
  async function queryLenderWithdrawals() {
    if (!lender || !market || !_market) throw Error();
    logger.debug(`Getting lender withdrawals...`);
    const result = await getSubgraphClient(chainId).query<
      SubgraphGetLenderWithdrawalsForMarketQuery,
      SubgraphGetLenderWithdrawalsForMarketQueryVariables
    >({
      query: GetLenderWithdrawalsForMarketDocument,
      variables: { market, lender }
    });
    const lenderData = result.data.market?.lenders[0];
    const completeWithdrawals =
      lenderData?.completeWithdrawals.map((data) => {
        const batch = WithdrawalBatch.fromSubgraphWithdrawalBatch(_market, data.batch);
        return batch.withdrawals[0]!;
      }) ?? [];
    const incompleteWithdrawals =
      lenderData?.incompleteWithdrawals.map((data) => {
        const batch = WithdrawalBatch.fromSubgraphWithdrawalBatch(_market, data.batch);
        return batch.withdrawals[0]!;
      }) ?? [];
    logger.debug(`Got ${completeWithdrawals.length} complete withdrawals...`);
    logger.debug(`Got ${incompleteWithdrawals.length} incomplete withdrawals...`);
    return { completeWithdrawals, incompleteWithdrawals };
  }

  const {
    data,
    isLoading: isLoadingInitial,
    refetch: refetchInitial,
    isError: isErrorInitial,
    failureReason: errorInitial
  } = useQuery({
    queryKey: ["lenderWithdrawalsForMarket/initial", lender, market],
    queryFn: queryLenderWithdrawals,
    enabled: !!lender && !!market && enabled,
    refetchOnMount: false
  });

  const withdrawals = data ?? { completeWithdrawals: [], incompleteWithdrawals: [] };

  async function updateWithdrawals() {
    if (!lender || !market || !_market) throw Error();
    const lens = getLensContract(chainId, _market.provider);
    const withdrawalUpdates = await lens.getWithdrawalBatchesDataWithLenderStatus(
      market,
      [...withdrawals.completeWithdrawals, ...withdrawals.incompleteWithdrawals].map(
        (w) => w.expiry
      ),
      lender
    );
    let i = 0;
    for (const withdrawal of withdrawals.completeWithdrawals) {
      const update = withdrawalUpdates[i++];
      withdrawal.batch.applyLensUpdate(update.batch);
      withdrawal.updateWith(update.lenderStatus);
    }
    for (const withdrawal of withdrawals.incompleteWithdrawals) {
      const update = withdrawalUpdates[i++];
      withdrawal.batch.applyLensUpdate(update.batch);
      withdrawal.updateWith(update.lenderStatus);
    }
    logger.debug(`Updated ${withdrawals.completeWithdrawals.length} complete withdrawals...`);
    logger.debug(`Updated ${withdrawals.incompleteWithdrawals.length} incomplete withdrawals...`);
    return withdrawals;
  }

  const updateQueryKeys = useMemo(() => {
    return [
      ...withdrawals.completeWithdrawals.map((b) => [b.expiry]),
      ...withdrawals.incompleteWithdrawals.map((b) => [b.expiry])
    ];
  }, [withdrawals]);

  const {
    data: updatedWithdrawals,
    isLoading: isLoadingUpdate,
    isPaused: isPendingUpdate,
    refetch: refetchUpdate,
    isError: isErrorUpdate,
    failureReason: errorUpdate
  } = useQuery({
    queryKey: ["lenderWithdrawalsForMarket/update", updateQueryKeys],
    queryFn: updateWithdrawals,
    enabled: !!data,
    refetchOnMount: false
  });

  return {
    data: updatedWithdrawals ?? withdrawals,
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
