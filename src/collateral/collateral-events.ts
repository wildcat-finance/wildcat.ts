import { Token, TokenAmount, toRawAmount } from "../token";
import {
  Exact,
  GetCollateralContractEventsDocument,
  SubgraphGetCollateralContractEventsQuery,
  SubgraphGetCollateralContractEventsQueryVariables,
  SubgraphSimpleCollateralContractDeposit_Filter,
  SubgraphSimpleCollateralContractDepositDataFragment,
  SubgraphSimpleCollateralContractFullReset_Filter,
  SubgraphSimpleCollateralContractFullResetDataFragment,
  SubgraphSimpleCollateralContractLiquidatedSharesReset_Filter,
  SubgraphSimpleCollateralContractLiquidatedSharesResetDataFragment,
  SubgraphSimpleCollateralContractLiquidation_Filter,
  SubgraphSimpleCollateralContractLiquidationDataFragment,
  SubgraphSimpleCollateralContractReclaim_Filter,
  SubgraphSimpleCollateralContractReclaimDataFragment
} from "../gql/graphql";
import { MarketCollateralV1 } from ".";
import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { assert } from "../utils";

export type CollateralContractDeposit = Exact<
  Omit<
    SubgraphSimpleCollateralContractDepositDataFragment,
    "collateralContract" | "account" | "amountDeposited" | "sharesMinted"
  > & {
    collateralContract: string;
    account: string;
    amountDeposited: TokenAmount;
    sharesMinted: bigint;
  }
>;

export type CollateralContractReclaim = Exact<
  Omit<
    SubgraphSimpleCollateralContractReclaimDataFragment,
    "collateralContract" | "account" | "amountReclaimed" | "sharesBurned"
  > & {
    collateralContract: string;
    account: string;
    amountReclaimed: TokenAmount;
    sharesBurned: bigint;
  }
>;

export type CollateralContractLiquidation = Exact<
  Omit<
    SubgraphSimpleCollateralContractLiquidationDataFragment,
    "collateralContract" | "collateralLiquidated" | "underlyingReceived"
  > & {
    collateralContract: string;
    collateralLiquidated: TokenAmount;
    underlyingReceived: TokenAmount;
  }
>;

export type CollateralContractFullReset = Exact<
  Omit<SubgraphSimpleCollateralContractFullResetDataFragment, "collateralContract"> & {
    collateralContract: string;
  }
>;

export type CollateralContractLiquidatedSharesReset = Exact<
  Omit<
    SubgraphSimpleCollateralContractLiquidatedSharesResetDataFragment,
    "collateralContract" | "account" | "sharesReset"
  > & {
    collateralContract: string;
    account: string;
    sharesReset: bigint;
  }
>;

export type CollateralContractEvent =
  | CollateralContractDeposit
  | CollateralContractReclaim
  | CollateralContractLiquidation
  | CollateralContractFullReset
  | CollateralContractLiquidatedSharesReset;

export type CollateralContractEventDataFragment =
  | SubgraphSimpleCollateralContractDepositDataFragment
  | SubgraphSimpleCollateralContractReclaimDataFragment
  | SubgraphSimpleCollateralContractLiquidationDataFragment
  | SubgraphSimpleCollateralContractFullResetDataFragment
  | SubgraphSimpleCollateralContractLiquidatedSharesResetDataFragment;

export type CollateralContractEventKind = CollateralContractEvent["__typename"];

export type CollateralContractRecordByType<K extends CollateralContractEventKind> =
  CollateralContractEvent extends infer C ? (C extends { __typename: K } ? C : never) : never;

export type CollateralContractEventDataFragmentByType<K extends CollateralContractEventKind> =
  CollateralContractEventDataFragment extends infer C
    ? C extends { __typename: K }
      ? C
      : never
    : never;

export type CollateralContractEventParserMap = {
  [K in CollateralContractEventKind]: (
    collateralAsset: Token,
    underlyingAsset: Token,
    log: CollateralContractEventDataFragmentByType<K>
  ) => CollateralContractRecordByType<K>;
};

export const collateralContractEventParsers: CollateralContractEventParserMap = {
  SimpleCollateralContractDeposit: (collateralAsset, underlyingAsset, log) => {
    const { collateralContract, account, amountDeposited, sharesMinted, ...rest } = log;
    return {
      collateralContract: collateralContract.id,
      account: account.address,
      amountDeposited: collateralAsset.getAmount(amountDeposited),
      sharesMinted: toRawAmount(sharesMinted),
      ...rest
    };
  },
  SimpleCollateralContractReclaim: (collateralAsset, underlyingAsset, log) => {
    const { collateralContract, account, amountReclaimed, sharesBurned, ...rest } = log;
    return {
      collateralContract: collateralContract.id,
      account: account.address,
      amountReclaimed: collateralAsset.getAmount(amountReclaimed),
      sharesBurned: toRawAmount(sharesBurned),
      ...rest
    };
  },
  SimpleCollateralContractFullReset: (collateralAsset, underlyingAsset, log) => {
    const { collateralContract, ...rest } = log;
    return {
      collateralContract: collateralContract.id,
      ...rest
    };
  },
  SimpleCollateralContractLiquidatedSharesReset: (collateralAsset, underlyingAsset, log) => {
    const { collateralContract, account, sharesReset, ...rest } = log;
    return {
      collateralContract: collateralContract.id,
      account: account.address,
      sharesReset: toRawAmount(sharesReset),
      ...rest
    };
  },
  SimpleCollateralContractLiquidation: (collateralAsset, underlyingAsset, log) => {
    const { collateralContract, collateralLiquidated, underlyingReceived, ...rest } = log;
    return {
      collateralContract: collateralContract.id,
      collateralLiquidated: collateralAsset.getAmount(collateralLiquidated),
      underlyingReceived: underlyingAsset.getAmount(underlyingReceived),
      ...rest
    };
  }
};

export type GetCollateralContractEventsOptions = {
  collateralContract: MarketCollateralV1;
  fetchPolicy?: FetchPolicy;
  limit?: number;
  endEventIndex?: number;
  kinds?: CollateralContractEventKind[];
  additionalFilter?: CommonFilter;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type CommonKeys<T, R = {}> = R extends T ? keyof T & CommonKeys<Exclude<T, R>> : keyof T;

type FilterUnion =
  | SubgraphSimpleCollateralContractDeposit_Filter
  | SubgraphSimpleCollateralContractReclaim_Filter
  | SubgraphSimpleCollateralContractLiquidation_Filter
  | SubgraphSimpleCollateralContractFullReset_Filter
  | SubgraphSimpleCollateralContractLiquidatedSharesReset_Filter;

type Common<T> = Pick<T, CommonKeys<T>>;

type CommonFilter = Common<FilterUnion>;

export const parseCollateralContractEvent = <K extends CollateralContractEventKind>(
  collateralAsset: Token,
  underlyingAsset: Token,
  log: CollateralContractEventDataFragmentByType<K>
): CollateralContractRecordByType<K> => {
  const k = log.__typename as K;
  return collateralContractEventParsers[k](collateralAsset, underlyingAsset, log);
};

export async function getCollateralContractEvents(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    collateralContract,
    fetchPolicy = "network-only",
    limit = 300,
    endEventIndex,
    kinds,
    additionalFilter
  }: GetCollateralContractEventsOptions
): Promise<CollateralContractEvent[]> {
  const collateralContractAddress = collateralContract.address.toLowerCase();
  // If no end index provided, try to set it with the contract's eventIndex, which is
  // the total events count
  if (endEventIndex === undefined && collateralContract.eventIndex !== undefined) {
    endEventIndex = collateralContract.eventIndex;
  }
  const startEventIndex = endEventIndex ? Math.max(0, endEventIndex - limit) : 0;
  console.log(`OPTIONS:`);
  console.log({
    startEventIndex,
    endEventIndex,
    limit,
    depositRecordsFilter: additionalFilter,
    reclaimRecordsFilter: additionalFilter,
    liquidationRecordsFilter: additionalFilter,
    fullResetRecordsFilter: additionalFilter,
    liquidatedSharesResetRecordsFilter: additionalFilter,
    includeDeposits: !kinds?.length || kinds.includes("SimpleCollateralContractDeposit"),
    includeReclaims: !kinds?.length || kinds.includes("SimpleCollateralContractReclaim"),
    includeLiquidations: !kinds?.length || kinds.includes("SimpleCollateralContractLiquidation"),
    includeFullResets: !kinds?.length || kinds.includes("SimpleCollateralContractFullReset"),
    includeLiquidatedSharesResets:
      !kinds?.length || kinds.includes("SimpleCollateralContractLiquidatedSharesReset")
  });
  const result = await subgraphClient.query<
    SubgraphGetCollateralContractEventsQuery,
    SubgraphGetCollateralContractEventsQueryVariables
  >({
    query: GetCollateralContractEventsDocument,
    fetchPolicy,
    variables: {
      collateralContract: collateralContractAddress,
      startEventIndex,
      endEventIndex,
      limit,
      depositRecordsFilter: additionalFilter,
      reclaimRecordsFilter: additionalFilter,
      liquidationRecordsFilter: additionalFilter,
      fullResetRecordsFilter: additionalFilter,
      liquidatedSharesResetRecordsFilter: additionalFilter,
      includeDeposits: !kinds?.length || kinds.includes("SimpleCollateralContractDeposit"),
      includeReclaims: !kinds?.length || kinds.includes("SimpleCollateralContractReclaim"),
      includeLiquidations: !kinds?.length || kinds.includes("SimpleCollateralContractLiquidation"),
      includeFullResets: !kinds?.length || kinds.includes("SimpleCollateralContractFullReset"),
      includeLiquidatedSharesResets:
        !kinds?.length || kinds.includes("SimpleCollateralContractLiquidatedSharesReset")
    }
  });
  const {
    data: { simpleCollateralContract: collateralContractData }
  } = result;
  assert(
    !!collateralContractData,
    `Collateral contract not found in subgraph: ${collateralContractAddress}`
  );
  const { collateralAsset, underlyingAsset } = collateralContract;
  const { deposits, reclaims, liquidations, fullResets, liquidatedSharesResets } =
    collateralContractData;
  return [
    ...(deposits?.map((deposit) =>
      parseCollateralContractEvent(collateralAsset, underlyingAsset, deposit)
    ) ?? []),
    ...(reclaims?.map((reclaim) =>
      parseCollateralContractEvent(collateralAsset, underlyingAsset, reclaim)
    ) ?? []),
    ...(liquidations?.map((liquidation) =>
      parseCollateralContractEvent(collateralAsset, underlyingAsset, liquidation)
    ) ?? []),
    ...(fullResets?.map((fullReset) =>
      parseCollateralContractEvent(collateralAsset, underlyingAsset, fullReset)
    ) ?? []),
    ...(liquidatedSharesResets?.map((liquidatedSharesReset) =>
      parseCollateralContractEvent(collateralAsset, underlyingAsset, liquidatedSharesReset)
    ) ?? [])
  ];
}
