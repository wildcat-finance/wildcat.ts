import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { HooksInstance } from "../../src/access";
import { getPolicyAccessListMembers } from "../../src/gql";
import { RoleProvider } from "../../src/types";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const makeProvider = (overrides: Partial<RoleProvider> = {}): RoleProvider => ({
  kind: "access-list",
  providerAddress: makeAddress(1),
  timeToLive: 86_400,
  isPullProvider: true,
  isPushProvider: false,
  pushProviderIndex: 16_777_215,
  pullProviderIndex: 0,
  isApproved: true,
  ...overrides
});

const makeHooksInstance = (roleProviders: RoleProvider[]): HooksInstance =>
  ({ roleProviders, provider: new providers.JsonRpcProvider() } as unknown as HooksInstance);

const makeMember = (provider: string, account: string, id: string) => ({
  __typename: "RoleProviderMember" as const,
  id,
  account,
  isMember: true,
  updatedAtBlock: "10",
  updatedAtTimestamp: "11",
  updatedAtTransaction: makeAddress(12),
  updatedAtLogIndex: "13",
  provider: {
    __typename: "RoleProviderInstance" as const,
    address: provider
  }
});

describe("policy AccessList members", () => {
  it("returns no members without an approved pull-based AccessList", async () => {
    let queried = false;
    const client = {
      query: async () => {
        queried = true;
        return { data: { roleProviderMembers: [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;
    const hooksInstance = makeHooksInstance([
      makeProvider({ kind: "erc20" }),
      makeProvider({ providerAddress: makeAddress(2), isApproved: false }),
      makeProvider({ providerAddress: makeAddress(3), isPullProvider: false })
    ]);

    expect(await getPolicyAccessListMembers(client, hooksInstance)).to.deep.equal([]);
    expect(queried).to.equal(false);
  });

  it("deduplicates members and preserves each provider membership", async () => {
    const firstProvider = makeProvider({ providerAddress: makeAddress(1) });
    const secondProvider = makeProvider({ providerAddress: makeAddress(2), pullProviderIndex: 1 });
    const member = makeAddress(20);
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            roleProviderMembers: [
              makeMember(secondProvider.providerAddress, member, "second-member"),
              makeMember(firstProvider.providerAddress, member, "first-member")
            ]
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const result = await getPolicyAccessListMembers(
      client,
      makeHooksInstance([firstProvider, secondProvider]),
      { fetchPolicy: "no-cache" }
    );

    expect(calls[0].variables).to.deep.equal({
      providers: [firstProvider.providerAddress, secondProvider.providerAddress],
      first: 1_000,
      skip: 0
    });
    expect(result).to.have.length(1);
    expect(result[0].address).to.equal(member);
    expect(result[0].memberships.map(({ provider }) => provider.providerAddress)).to.deep.equal([
      firstProvider.providerAddress,
      secondProvider.providerAddress
    ]);
    expect(result[0].memberships[0].membership.updatedAt).to.deep.equal({
      blockNumber: 10n,
      blockTimestamp: 11n,
      transactionHash: makeAddress(12),
      logIndex: 13n
    });
  });

  it("paginates complete membership state", async () => {
    const provider = makeProvider();
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const firstPage = Array.from({ length: 1_000 }, (_, index) =>
      makeMember(provider.providerAddress, makeAddress(index + 100), `member-${index}`)
    );
    const finalMember = makeMember(provider.providerAddress, makeAddress(1_100), "member-1000");
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            roleProviderMembers: args.variables?.skip === 0 ? firstPage : [finalMember]
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const result = await getPolicyAccessListMembers(client, makeHooksInstance([provider]));

    expect(calls.map(({ variables }) => variables?.skip)).to.deep.equal([0, 1_000]);
    expect(result).to.have.length(1_001);
    expect(result.some(({ address }) => address === finalMember.account)).to.equal(true);
  });
});
