import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { HooksInstance } from "../access";
import { normalizeRoleProviderMember } from "../authority";
import { RoleProviderMember } from "../authority/types";
import { RoleProvider } from "../types";
import {
  GetActiveRoleProviderMembersDocument,
  SubgraphGetActiveRoleProviderMembersQuery,
  SubgraphGetActiveRoleProviderMembersQueryVariables
} from "./graphql";

const PolicyMemberPageSize = 1_000;

export type PolicyAccessListMembership = {
  provider: RoleProvider;
  membership: RoleProviderMember;
};

export type PolicyAccessListMember = {
  address: string;
  memberships: PolicyAccessListMembership[];
};

export type GetPolicyAccessListMembersOptions = {
  fetchPolicy?: FetchPolicy;
};

/**
 * Returns current members of approved pull-based AccessList providers attached
 * to a hooks instance. Membership means an account can obtain a credential; it
 * does not imply that the hooks instance has already cached one.
 */
export async function getPolicyAccessListMembers(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  hooksInstance: HooksInstance,
  { fetchPolicy = "cache-first" }: GetPolicyAccessListMembersOptions = {}
): Promise<PolicyAccessListMember[]> {
  const providersByAddress = new Map(
    hooksInstance.roleProviders
      .filter(
        ({ kind, isApproved, isPullProvider }) =>
          kind === "access-list" && isApproved && isPullProvider
      )
      .map((provider) => [provider.providerAddress.toLowerCase(), provider] as const)
  );
  if (providersByAddress.size === 0) return [];

  const membersByAddress = new Map<string, PolicyAccessListMember>();
  for (let skip = 0; ; skip += PolicyMemberPageSize) {
    const { data } = await subgraphClient.query<
      SubgraphGetActiveRoleProviderMembersQuery,
      SubgraphGetActiveRoleProviderMembersQueryVariables
    >({
      query: GetActiveRoleProviderMembersDocument,
      variables: {
        providers: Array.from(providersByAddress.keys()),
        first: PolicyMemberPageSize,
        skip
      },
      fetchPolicy
    });

    for (const dataMember of data.roleProviderMembers) {
      const provider = providersByAddress.get(dataMember.provider.address.toLowerCase());
      if (!provider) {
        throw new Error(
          `Subgraph returned role provider ${dataMember.provider.address} outside the policy filter`
        );
      }
      const membership = normalizeRoleProviderMember(dataMember);
      const key = membership.account.toLowerCase();
      const member = membersByAddress.get(key) ?? {
        address: membership.account,
        memberships: []
      };
      member.memberships.push({ provider, membership });
      membersByAddress.set(key, member);
    }

    if (data.roleProviderMembers.length < PolicyMemberPageSize) break;
  }

  return Array.from(membersByAddress.values())
    .map((member) => ({
      ...member,
      memberships: member.memberships.sort((a, b) =>
        a.provider.providerAddress.localeCompare(b.provider.providerAddress)
      )
    }))
    .sort((a, b) => a.address.localeCompare(b.address));
}
