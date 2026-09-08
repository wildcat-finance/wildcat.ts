import { IndexedTraversalOptions } from "../indexed-pagination";
import { IndexedPageProgress, withIndexedTraversal } from "../internal/indexed-traversal";
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
  { fetchPolicy = "cache-first", ...options }: AuthorityReadOptions & IndexedTraversalOptions = {}
): Promise<HookAuthority | undefined> =>
  withIndexedTraversal(options, async (traversal) => {
    const providers: NonNullable<SubgraphGetHooksAuthorityQuery["hooksInstance"]>["providers"] = [];
    let hooksInstance: NonNullable<SubgraphGetHooksAuthorityQuery["hooksInstance"]> | undefined;

    const providersProgress = new IndexedPageProgress();
    for (let skip = 0; ; skip += AuthorityPageSize) {
      const { data } = await traversal.query<
        SubgraphGetHooksAuthorityQuery,
        SubgraphGetHooksAuthorityQueryVariables
      >(client, {
        query: GetHooksAuthorityDocument,
        variables: { hooks: normalizeAddress(hooks), first: AuthorityPageSize, skip },
        fetchPolicy
      });
      if (!data.hooksInstance) return undefined;
      hooksInstance ??= data.hooksInstance;
      traversal.accept(data.hooksInstance.providers, AuthorityPageSize, providersProgress);
      providers.push(...data.hooksInstance.providers);
      if (data.hooksInstance.providers.length < AuthorityPageSize) {
        return normalizeHookAuthority({ ...hooksInstance, providers });
      }
    }
  });

export const getRoleProviderAuthority = async (
  client: ApolloClient<NormalizedCacheObject>,
  provider: string,
  { fetchPolicy = "cache-first", ...options }: AuthorityReadOptions & IndexedTraversalOptions = {}
): Promise<RoleProviderAuthority | undefined> =>
  withIndexedTraversal(options, async (traversal) => {
    const attachments: NonNullable<
      SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]
    >["attachments"] = [];
    const members: NonNullable<
      SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]
    >["members"] = [];
    const rootChanges: NonNullable<
      SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]
    >["rootChanges"] = [];
    let providerInstance:
      | NonNullable<SubgraphGetRoleProviderAuthorityQuery["roleProviderInstance"]>
      | undefined;

    const attachmentsProgress = new IndexedPageProgress();
    const membersProgress = new IndexedPageProgress();
    const rootChangesProgress = new IndexedPageProgress();
    for (let skip = 0; ; skip += AuthorityPageSize) {
      const { data } = await traversal.query<
        SubgraphGetRoleProviderAuthorityQuery,
        SubgraphGetRoleProviderAuthorityQueryVariables
      >(client, {
        query: GetRoleProviderAuthorityDocument,
        variables: { provider: normalizeAddress(provider), first: AuthorityPageSize, skip },
        fetchPolicy
      });
      if (!data.roleProviderInstance) return undefined;
      providerInstance ??= data.roleProviderInstance;
      traversal.accept(
        data.roleProviderInstance.attachments,
        AuthorityPageSize,
        attachmentsProgress
      );
      attachments.push(...data.roleProviderInstance.attachments);
      traversal.accept(data.roleProviderInstance.members, AuthorityPageSize, membersProgress);
      members.push(...data.roleProviderInstance.members);
      traversal.accept(
        data.roleProviderInstance.rootChanges,
        AuthorityPageSize,
        rootChangesProgress
      );
      rootChanges.push(...data.roleProviderInstance.rootChanges);
      if (
        data.roleProviderInstance.attachments.length < AuthorityPageSize &&
        data.roleProviderInstance.members.length < AuthorityPageSize &&
        data.roleProviderInstance.rootChanges.length < AuthorityPageSize
      ) {
        return normalizeRoleProviderAuthority({
          ...providerInstance,
          attachments,
          members,
          rootChanges
        });
      }
    }
  });

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
