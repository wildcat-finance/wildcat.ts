import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetBorrowerAccountIdentitiesDocument,
  GetBorrowerAccountPrincipalChangesDocument,
  GetBorrowerPrincipalIdentityDocument,
  GetMarketBorrowerChangesDocument,
  GetMarketBorrowerIdentityDocument,
  SubgraphGetBorrowerAccountIdentitiesQuery,
  SubgraphGetBorrowerAccountIdentitiesQueryVariables,
  SubgraphGetBorrowerAccountPrincipalChangesQuery,
  SubgraphGetBorrowerAccountPrincipalChangesQueryVariables,
  SubgraphGetBorrowerPrincipalIdentityQuery,
  SubgraphGetBorrowerPrincipalIdentityQueryVariables,
  SubgraphGetMarketBorrowerChangesQuery,
  SubgraphGetMarketBorrowerChangesQueryVariables,
  SubgraphGetMarketBorrowerIdentityQuery,
  SubgraphGetMarketBorrowerIdentityQueryVariables
} from "../gql/graphql";
import {
  normalizeBorrowerAccountIdentity,
  normalizeBorrowerAccountPrincipalChange,
  normalizeBorrowerPrincipalIdentity,
  normalizeMarketBorrowerChange,
  normalizeMarketBorrowerIdentity
} from "./normalizers";
import {
  BorrowerAccountIdentity,
  BorrowerAccountPrincipalChange,
  BorrowerPrincipalIdentity,
  MarketBorrowerChange,
  MarketBorrowerIdentity
} from "./types";

export type IndexedHistoryReadOptions = {
  first?: number;
  skip?: number;
  fetchPolicy?: FetchPolicy;
};

export type IdentityReadOptions = {
  fetchPolicy?: FetchPolicy;
};

const IdentityPageSize = 1_000;

const normalizeAddress = (address: string): string => address.toLowerCase();

export const getBorrowerPrincipalIdentity = async (
  client: ApolloClient<NormalizedCacheObject>,
  principal: string,
  { fetchPolicy = "cache-first" }: IdentityReadOptions = {}
): Promise<BorrowerPrincipalIdentity | undefined> => {
  const accounts: NonNullable<SubgraphGetBorrowerPrincipalIdentityQuery["borrower"]>["accounts"] =
    [];
  const pendingAccounts: NonNullable<
    SubgraphGetBorrowerPrincipalIdentityQuery["borrower"]
  >["pendingAccounts"] = [];
  let borrower: NonNullable<SubgraphGetBorrowerPrincipalIdentityQuery["borrower"]> | undefined;

  for (let skip = 0; ; skip += IdentityPageSize) {
    const { data } = await client.query<
      SubgraphGetBorrowerPrincipalIdentityQuery,
      SubgraphGetBorrowerPrincipalIdentityQueryVariables
    >({
      query: GetBorrowerPrincipalIdentityDocument,
      variables: {
        principal: normalizeAddress(principal),
        first: IdentityPageSize,
        skip
      },
      fetchPolicy
    });
    if (!data.borrower) return undefined;
    borrower ??= data.borrower;
    accounts.push(...data.borrower.accounts);
    pendingAccounts.push(...data.borrower.pendingAccounts);
    if (
      data.borrower.accounts.length < IdentityPageSize &&
      data.borrower.pendingAccounts.length < IdentityPageSize
    ) {
      return normalizeBorrowerPrincipalIdentity({ ...borrower, accounts, pendingAccounts });
    }
  }
};

export const getBorrowerAccountIdentities = async (
  client: ApolloClient<NormalizedCacheObject>,
  account: string,
  { fetchPolicy = "cache-first" }: IdentityReadOptions = {}
): Promise<BorrowerAccountIdentity[]> => {
  const accounts: BorrowerAccountIdentity[] = [];
  for (let skip = 0; ; skip += IdentityPageSize) {
    const { data } = await client.query<
      SubgraphGetBorrowerAccountIdentitiesQuery,
      SubgraphGetBorrowerAccountIdentitiesQueryVariables
    >({
      query: GetBorrowerAccountIdentitiesDocument,
      variables: { account: normalizeAddress(account), first: IdentityPageSize, skip },
      fetchPolicy
    });
    accounts.push(...data.borrowerAccounts.map(normalizeBorrowerAccountIdentity));
    if (data.borrowerAccounts.length < IdentityPageSize) return accounts;
  }
};

export const getMarketBorrowerIdentity = async (
  client: ApolloClient<NormalizedCacheObject>,
  market: string,
  { fetchPolicy = "cache-first" }: IdentityReadOptions = {}
): Promise<MarketBorrowerIdentity | undefined> => {
  const { data } = await client.query<
    SubgraphGetMarketBorrowerIdentityQuery,
    SubgraphGetMarketBorrowerIdentityQueryVariables
  >({
    query: GetMarketBorrowerIdentityDocument,
    variables: { market: normalizeAddress(market) },
    fetchPolicy
  });
  return data.market ? normalizeMarketBorrowerIdentity(data.market) : undefined;
};

export const getBorrowerAccountPrincipalChanges = async (
  client: ApolloClient<NormalizedCacheObject>,
  account: string,
  { first = 100, skip = 0, fetchPolicy = "cache-first" }: IndexedHistoryReadOptions = {}
): Promise<BorrowerAccountPrincipalChange[]> => {
  const { data } = await client.query<
    SubgraphGetBorrowerAccountPrincipalChangesQuery,
    SubgraphGetBorrowerAccountPrincipalChangesQueryVariables
  >({
    query: GetBorrowerAccountPrincipalChangesDocument,
    variables: { account: normalizeAddress(account), first, skip },
    fetchPolicy
  });
  return data.borrowerAccountPrincipalChanges.map(normalizeBorrowerAccountPrincipalChange);
};

export const getMarketBorrowerChanges = async (
  client: ApolloClient<NormalizedCacheObject>,
  market: string,
  { first = 100, skip = 0, fetchPolicy = "cache-first" }: IndexedHistoryReadOptions = {}
): Promise<MarketBorrowerChange[]> => {
  const { data } = await client.query<
    SubgraphGetMarketBorrowerChangesQuery,
    SubgraphGetMarketBorrowerChangesQueryVariables
  >({
    query: GetMarketBorrowerChangesDocument,
    variables: { market: normalizeAddress(market), first, skip },
    fetchPolicy
  });
  return data.marketBorrowerChanges.map(normalizeMarketBorrowerChange);
};
