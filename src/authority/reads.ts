import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetHookAdministratorChangesDocument,
  GetHooksAuthorityDocument,
  GetRoleProviderAdministratorChangesDocument,
  GetRoleProviderAuthorityDocument,
  GetRoleProviderMembershipChangesDocument,
  SubgraphGetHookAdministratorChangesQuery,
  SubgraphGetHookAdministratorChangesQueryVariables,
  SubgraphGetHooksAuthorityQuery,
  SubgraphGetHooksAuthorityQueryVariables,
  SubgraphGetRoleProviderAdministratorChangesQuery,
  SubgraphGetRoleProviderAdministratorChangesQueryVariables,
  SubgraphGetRoleProviderAuthorityQuery,
  SubgraphGetRoleProviderAuthorityQueryVariables,
  SubgraphGetRoleProviderMembershipChangesQuery,
  SubgraphGetRoleProviderMembershipChangesQueryVariables
} from "../gql/graphql";
import {
  normalizeHookAdministratorChange,
  normalizeHookAuthority,
  normalizeRoleProviderAdministratorChange,
  normalizeRoleProviderAuthority,
  normalizeRoleProviderMembershipChange
} from "./normalizers";
import {
  HookAdministratorChange,
  HookAuthority,
  RoleProviderAdministratorChange,
  RoleProviderAuthority,
  RoleProviderMembershipChange
} from "./types";

export type AuthorityReadOptions = {
  fetchPolicy?: FetchPolicy;
};

export type AuthorityHistoryReadOptions = AuthorityReadOptions & {
  first?: number;
  skip?: number;
};

const AuthorityPageSize = 1_000;

const normalizeAddress = (address: string): string => address.toLowerCase();

export const getHookAuthority = async (
  client: ApolloClient<NormalizedCacheObject>,
  hooks: string,
  { fetchPolicy = "cache-first" }: AuthorityReadOptions = {}
): Promise<HookAuthority | undefined> => {
  const providers: NonNullable<SubgraphGetHooksAuthorityQuery["hooksInstance"]>["providers"] = [];
  let hooksInstance: NonNullable<SubgraphGetHooksAuthorityQuery["hooksInstance"]> | undefined;

  for (let skip = 0; ; skip += AuthorityPageSize) {
    const { data } = await client.query<
      SubgraphGetHooksAuthorityQuery,
      SubgraphGetHooksAuthorityQueryVariables
    >({
      query: GetHooksAuthorityDocument,
      variables: { hooks: normalizeAddress(hooks), first: AuthorityPageSize, skip },
      fetchPolicy
    });
    if (!data.hooksInstance) return undefined;
    hooksInstance ??= data.hooksInstance;
    providers.push(...data.hooksInstance.providers);
    if (data.hooksInstance.providers.length < AuthorityPageSize) {
      return normalizeHookAuthority({ ...hooksInstance, providers });
    }
  }
};

export const getRoleProviderAuthority = async (
  client: ApolloClient<NormalizedCacheObject>,
  provider: string,
  { fetchPolicy = "cache-first" }: AuthorityReadOptions = {}
): Promise<RoleProviderAuthority | undefined> => {
  const attachments: NonNullable<
    SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]
  >["attachments"] = [];
  const members: NonNullable<
    SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]
  >["members"] = [];
  let providerInstance:
    | NonNullable<SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]>
    | undefined;

  for (let skip = 0; ; skip += AuthorityPageSize) {
    const { data } = await client.query<
      SubgraphGetRoleProviderAuthorityQuery,
      SubgraphGetRoleProviderAuthorityQueryVariables
    >({
      query: GetRoleProviderAuthorityDocument,
      variables: { provider: normalizeAddress(provider), first: AuthorityPageSize, skip },
      fetchPolicy
    });
    if (!data.roleProviderInstance) return undefined;
    providerInstance ??= data.roleProviderInstance;
    attachments.push(...data.roleProviderInstance.attachments);
    members.push(...data.roleProviderInstance.members);
    if (
      data.roleProviderInstance.attachments.length < AuthorityPageSize &&
      data.roleProviderInstance.members.length < AuthorityPageSize
    ) {
      return normalizeRoleProviderAuthority({ ...providerInstance, attachments, members });
    }
  }
};

export const getHookAdministratorChanges = async (
  client: ApolloClient<NormalizedCacheObject>,
  hooks: string,
  { first = 100, skip = 0, fetchPolicy = "cache-first" }: AuthorityHistoryReadOptions = {}
): Promise<HookAdministratorChange[]> => {
  const { data } = await client.query<
    SubgraphGetHookAdministratorChangesQuery,
    SubgraphGetHookAdministratorChangesQueryVariables
  >({
    query: GetHookAdministratorChangesDocument,
    variables: { hooks: normalizeAddress(hooks), first, skip },
    fetchPolicy
  });
  return data.hookAdministratorChanges.map(normalizeHookAdministratorChange);
};

export const getRoleProviderAdministratorChanges = async (
  client: ApolloClient<NormalizedCacheObject>,
  provider: string,
  { first = 100, skip = 0, fetchPolicy = "cache-first" }: AuthorityHistoryReadOptions = {}
): Promise<RoleProviderAdministratorChange[]> => {
  const { data } = await client.query<
    SubgraphGetRoleProviderAdministratorChangesQuery,
    SubgraphGetRoleProviderAdministratorChangesQueryVariables
  >({
    query: GetRoleProviderAdministratorChangesDocument,
    variables: { provider: normalizeAddress(provider), first, skip },
    fetchPolicy
  });
  return data.roleProviderAdministratorChanges.map(normalizeRoleProviderAdministratorChange);
};

export const getRoleProviderMembershipChanges = async (
  client: ApolloClient<NormalizedCacheObject>,
  provider: string,
  { first = 100, skip = 0, fetchPolicy = "cache-first" }: AuthorityHistoryReadOptions = {}
): Promise<RoleProviderMembershipChange[]> => {
  const { data } = await client.query<
    SubgraphGetRoleProviderMembershipChangesQuery,
    SubgraphGetRoleProviderMembershipChangesQueryVariables
  >({
    query: GetRoleProviderMembershipChangesDocument,
    variables: { provider: normalizeAddress(provider), first, skip },
    fetchPolicy
  });
  return data.roleProviderMembershipChanges.map(normalizeRoleProviderMembershipChange);
};
