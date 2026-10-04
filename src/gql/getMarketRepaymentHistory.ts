import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { IndexedAt } from "../domain";
import { assertMatchingAddress } from "../internal/read-identity";
import {
  GetMarketRepaymentHistoryDocument,
  SubgraphGetMarketRepaymentHistoryQuery,
  SubgraphGetMarketRepaymentHistoryQueryVariables
} from "./graphql";

export type MarketRepaymentHistory = {
  market: string;
  indexedBlock?: number;
  terms?: IndexedAt & { repaymentDate: number; repaymentPeriod: number };
  activation?: IndexedAt & { effectiveTimestamp: number };
  default?: IndexedAt & { effectiveTimestamp: number };
};

const provenance = (record: {
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  blockLogIndex: string;
}): IndexedAt => ({
  blockNumber: BigInt(record.blockNumber),
  blockTimestamp: BigInt(record.blockTimestamp),
  transactionHash: record.transactionHash,
  logIndex: BigInt(record.blockLogIndex)
});

/** V2.5.13 immutable lifecycle records. Effective time can precede the recording transaction.
 * Missing records do not establish that a repayment deadline has not passed. */
export const getMarketRepaymentHistory = async (
  client: ApolloClient<NormalizedCacheObject>,
  {
    market,
    block,
    fetchPolicy = "cache-first"
  }: {
    market: string;
    block?: SubgraphGetMarketRepaymentHistoryQueryVariables["block"];
    fetchPolicy?: FetchPolicy;
  }
): Promise<MarketRepaymentHistory | undefined> => {
  const { data } = await client.query<
    SubgraphGetMarketRepaymentHistoryQuery,
    SubgraphGetMarketRepaymentHistoryQueryVariables
  >({
    query: GetMarketRepaymentHistoryDocument,
    variables: { market: market.toLowerCase(), block },
    fetchPolicy
  });
  if (!data.market) return undefined;
  assertMatchingAddress(data.market.id, market, "Indexed repayment history market");
  const { repaymentTerms, repaymentDateReached, defaultRecord } = data.market;
  return {
    market: data.market.id,
    indexedBlock: data._meta?.block.number,
    terms: repaymentTerms
      ? {
          ...provenance(repaymentTerms),
          repaymentDate: Number(repaymentTerms.repaymentDate),
          repaymentPeriod: Number(repaymentTerms.repaymentPeriod)
        }
      : undefined,
    activation: repaymentDateReached
      ? {
          ...provenance(repaymentDateReached),
          effectiveTimestamp: Number(repaymentDateReached.effectiveTimestamp)
        }
      : undefined,
    default: defaultRecord
      ? {
          ...provenance(defaultRecord),
          effectiveTimestamp: Number(defaultRecord.effectiveTimestamp)
        }
      : undefined
  };
};
