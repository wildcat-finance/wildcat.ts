import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import {
  SubgraphFactoryLifecycle,
  SubgraphHooksKind,
  SubgraphProviderMetadataState,
  SubgraphRoleProviderKind,
  type SubgraphHookAuthorityDataFragment,
  type SubgraphRoleProviderAttachmentDataFragment,
  type SubgraphRoleProviderInstanceDataFragment,
  type SubgraphRoleProviderMemberDataFragment,
  type SubgraphRoleProviderRootChangeDataFragment
} from "../../src/gql/graphql";
import {
  getRoleProviderAuthority,
  getRoleProviderAdministratorChanges,
  normalizeHookAuthority,
  normalizeRoleProviderAuthority
} from "../../src/authority";
import { HooksKind } from "../../src/domain";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const attachment = {
  __typename: "RoleProvider",
  id: "attachment-id",
  providerAddress: makeAddress(1),
  hooks: {
    __typename: "HooksInstance",
    address: makeAddress(2),
    administrator: makeAddress(3),
    pendingAdministrator: makeAddress(4)
  },
  timeToLive: "3600",
  isPullProvider: true,
  pullProviderIndex: 0,
  isPushProvider: false,
  pushProviderIndex: 16_777_215,
  isApproved: true
} as SubgraphRoleProviderAttachmentDataFragment;

describe("v2.5 hook and role-provider authority normalization", () => {
  it("keeps hook administration separate from provider attachment state", () => {
    const hooks = {
      __typename: "HooksInstance",
      id: "hooks-id",
      address: makeAddress(2),
      borrower: makeAddress(3),
      administrator: makeAddress(3),
      pendingAdministrator: makeAddress(4),
      providerMetadataState: SubgraphProviderMetadataState.AVAILABLE,
      hooksFactory: { __typename: "HooksFactory", address: makeAddress(5) },
      hooksTemplate: {
        __typename: "HooksTemplate",
        address: makeAddress(6),
        kind: SubgraphHooksKind.OpenTerm,
        version: "2.5"
      },
      providers: [attachment]
    } as SubgraphHookAuthorityDataFragment & {
      providers: SubgraphRoleProviderAttachmentDataFragment[];
    };

    const normalized = normalizeHookAuthority(hooks);
    expect(normalized).to.deep.include({
      address: makeAddress(2),
      borrower: makeAddress(3),
      administrator: makeAddress(3),
      pendingAdministrator: makeAddress(4),
      providerMetadataState: "available"
    });
    expect(normalized.hooksTemplate.kind).to.equal(HooksKind.OpenTerm);
    expect(normalized.providers[0]).to.deep.include({
      provider: makeAddress(1),
      hooks: makeAddress(2),
      hooksAdministrator: makeAddress(3),
      timeToLive: 3600n
    });
  });

  it("preserves managed provider provenance, membership, and all hook attachments", () => {
    const member = {
      __typename: "RoleProviderMember",
      id: "member-id",
      account: makeAddress(10),
      isMember: true,
      updatedAtBlock: "11",
      updatedAtTimestamp: "12",
      updatedAtTransaction: makeAddress(13),
      updatedAtLogIndex: "14"
    } as SubgraphRoleProviderMemberDataFragment;
    const provider = {
      __typename: "RoleProviderInstance",
      id: "provider-id",
      address: makeAddress(1),
      kind: SubgraphRoleProviderKind.ACCESS_LIST,
      administrator: makeAddress(15),
      pendingAdministrator: null,
      deployer: makeAddress(16),
      salt: makeAddress(17),
      deployedAtBlock: "18",
      deployedAtTimestamp: "19",
      deployedAtTransaction: makeAddress(20),
      deployedAtLogIndex: "21",
      deploymentFactory: {
        __typename: "RoleProviderFactory",
        address: makeAddress(22),
        kind: SubgraphRoleProviderKind.ACCESS_LIST,
        label: "access-list-v2.5",
        generation: "v2.5",
        configuredStartBlock: "17",
        indexed: true,
        lifecycle: SubgraphFactoryLifecycle.ACTIVE,
        configured: true
      },
      attachments: [attachment],
      members: [member],
      rootChanges: []
    } as SubgraphRoleProviderInstanceDataFragment & {
      attachments: SubgraphRoleProviderAttachmentDataFragment[];
      members: SubgraphRoleProviderMemberDataFragment[];
      rootChanges: SubgraphRoleProviderRootChangeDataFragment[];
    };

    const normalized = normalizeRoleProviderAuthority(provider);
    expect(normalized).to.deep.include({
      address: makeAddress(1),
      kind: "access-list",
      administrator: makeAddress(15),
      deployer: makeAddress(16)
    });
    expect(normalized.deploymentFactory).to.deep.equal({
      address: makeAddress(22),
      kind: "access-list",
      label: "access-list-v2.5",
      generation: "v2.5",
      configuredStartBlock: 17n,
      indexed: true,
      lifecycle: "active",
      configured: true
    });
    expect(normalized).not.to.have.property("pendingAdministrator");
    expect(normalized.deployedAt).to.deep.equal({
      blockNumber: 18n,
      blockTimestamp: 19n,
      transactionHash: makeAddress(20),
      logIndex: 21n
    });
    expect(normalized.attachments).to.have.length(1);
    expect(normalized.members[0]).to.deep.include({
      account: makeAddress(10),
      isMember: true
    });
  });

  it("normalizes every factory-backed provider configuration", () => {
    const base = {
      __typename: "RoleProviderInstance" as const,
      id: "provider-id",
      address: makeAddress(50),
      administrator: null,
      pendingAdministrator: null,
      deployer: makeAddress(51),
      salt: makeAddress(52),
      root: null,
      token: null,
      vault: null,
      minBalance: null,
      minAssets: null,
      tokenId: null,
      skipInterfaceCheck: null,
      deployedAtBlock: "53",
      deployedAtTimestamp: "54",
      deployedAtTransaction: makeAddress(55),
      deployedAtLogIndex: "56",
      deploymentFactory: null
    };
    const normalize = (data: SubgraphRoleProviderInstanceDataFragment) =>
      normalizeRoleProviderAuthority({
        ...data,
        attachments: [],
        members: [],
        rootChanges: []
      });

    expect(
      normalize({
        ...base,
        kind: SubgraphRoleProviderKind.MERKLE,
        root: makeAddress(57)
      })
    ).to.deep.include({ kind: "merkle", root: makeAddress(57) });
    expect(
      normalize({
        ...base,
        kind: SubgraphRoleProviderKind.ERC20,
        token: makeAddress(58),
        minBalance: "1000"
      })
    ).to.deep.include({
      kind: "erc20",
      token: makeAddress(58),
      minBalance: 1000n
    });
    expect(
      normalize({
        ...base,
        kind: SubgraphRoleProviderKind.ERC4626_ASSETS,
        vault: makeAddress(59),
        minAssets: "2000"
      })
    ).to.deep.include({
      kind: "erc4626-assets",
      vault: makeAddress(59),
      minAssets: 2000n
    });
    expect(
      normalize({
        ...base,
        kind: SubgraphRoleProviderKind.ERC721,
        token: makeAddress(60),
        skipInterfaceCheck: true
      })
    ).to.deep.include({
      kind: "erc721",
      token: makeAddress(60),
      skipInterfaceCheck: true
    });
    expect(
      normalize({
        ...base,
        kind: SubgraphRoleProviderKind.ERC1155,
        token: makeAddress(61),
        tokenId: "42",
        skipInterfaceCheck: false
      })
    ).to.deep.include({
      kind: "erc1155",
      token: makeAddress(61),
      tokenId: 42n,
      skipInterfaceCheck: false
    });
    const unknown = normalize({
      ...base,
      kind: SubgraphRoleProviderKind.UNKNOWN,
      deploymentFactory: {
        __typename: "RoleProviderFactory",
        address: makeAddress(64),
        kind: SubgraphRoleProviderKind.UNKNOWN,
        label: "future-provider",
        generation: "future",
        configuredStartBlock: "65",
        indexed: true,
        lifecycle: SubgraphFactoryLifecycle.ACTIVE,
        configured: true
      }
    });
    expect(unknown).to.deep.include({ kind: "unknown" });
    expect(unknown.deploymentFactory).to.deep.include({
      address: makeAddress(64),
      kind: "unknown",
      label: "future-provider"
    });
  });

  it("rejects incomplete typed provider metadata", () => {
    const provider = {
      __typename: "RoleProviderInstance" as const,
      id: "provider-id",
      address: makeAddress(62),
      kind: SubgraphRoleProviderKind.ERC20,
      administrator: null,
      pendingAdministrator: null,
      deployer: null,
      salt: null,
      root: null,
      token: makeAddress(63),
      vault: null,
      minBalance: null,
      minAssets: null,
      tokenId: null,
      skipInterfaceCheck: null,
      deployedAtBlock: null,
      deployedAtTimestamp: null,
      deployedAtTransaction: null,
      deployedAtLogIndex: null,
      deploymentFactory: null,
      attachments: [],
      members: [],
      rootChanges: []
    } as SubgraphRoleProviderInstanceDataFragment & {
      attachments: SubgraphRoleProviderAttachmentDataFragment[];
      members: SubgraphRoleProviderMemberDataFragment[];
      rootChanges: SubgraphRoleProviderRootChangeDataFragment[];
    };

    expect(() => normalizeRoleProviderAuthority(provider)).to.throw(
      `Role provider ${makeAddress(62)} is missing indexed minBalance`
    );
  });

  it("normalizes history filters without conflating provider and hook addresses", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return { data: { roleProviderAdministratorChanges: [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const provider = makeAddress(30).toUpperCase();
    const result = await getRoleProviderAdministratorChanges(client, provider, {
      first: 10,
      skip: 20,
      fetchPolicy: "no-cache"
    });

    expect(result).to.deep.equal([]);
    expect(calls[0].variables).to.deep.equal({
      provider: provider.toLowerCase(),
      first: 10,
      skip: 20
    });
  });

  it("paginates complete reusable-provider membership and attachment state", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const fullAttachmentPage = Array.from({ length: 1_000 }, (_, index) => ({
      ...attachment,
      id: `attachment-${index}`
    }));
    const member = {
      __typename: "RoleProviderMember",
      id: "member-id",
      account: makeAddress(40),
      isMember: true,
      updatedAtBlock: "41",
      updatedAtTimestamp: "42",
      updatedAtTransaction: makeAddress(43),
      updatedAtLogIndex: "44"
    } as SubgraphRoleProviderMemberDataFragment;
    const provider = {
      __typename: "RoleProviderInstance",
      id: "provider-id",
      address: makeAddress(45),
      kind: SubgraphRoleProviderKind.ACCESS_LIST,
      administrator: makeAddress(46),
      pendingAdministrator: null,
      deployer: null,
      salt: null,
      deployedAtBlock: null,
      deployedAtTimestamp: null,
      deployedAtTransaction: null,
      deployedAtLogIndex: null,
      deploymentFactory: null
    } as SubgraphRoleProviderInstanceDataFragment;
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        const skip = args.variables?.skip;
        return {
          data: {
            roleProviderInstance: {
              ...provider,
              attachments: skip === 0 ? fullAttachmentPage : [],
              members: skip === 0 ? [member] : [],
              rootChanges: []
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const normalized = await getRoleProviderAuthority(client, provider.address, {
      fetchPolicy: "no-cache"
    });

    expect(calls.map(({ variables }) => variables)).to.deep.equal([
      { provider: provider.address.toLowerCase(), first: 1_000, skip: 0 },
      { provider: provider.address.toLowerCase(), first: 1_000, skip: 1_000 }
    ]);
    expect(normalized?.attachments).to.have.length(1_000);
    expect(normalized?.members).to.have.length(1);
    expect(normalized?.rootChanges).to.deep.equal([]);
  });

  it("paginates complete Merkle root history", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const provider = {
      __typename: "RoleProviderInstance" as const,
      id: "merkle-provider-id",
      address: makeAddress(70),
      kind: SubgraphRoleProviderKind.MERKLE,
      administrator: makeAddress(71),
      pendingAdministrator: null,
      deployer: makeAddress(72),
      salt: makeAddress(73),
      root: makeAddress(74),
      token: null,
      vault: null,
      minBalance: null,
      minAssets: null,
      tokenId: null,
      skipInterfaceCheck: null,
      deployedAtBlock: "75",
      deployedAtTimestamp: "76",
      deployedAtTransaction: makeAddress(77),
      deployedAtLogIndex: "78",
      deploymentFactory: null
    } as SubgraphRoleProviderInstanceDataFragment;
    const rootChanges = Array.from({ length: 1_000 }, (_, index) => ({
      __typename: "RoleProviderRootChange" as const,
      id: `root-change-${index}`,
      provider: {
        __typename: "RoleProviderInstance" as const,
        address: provider.address
      },
      administrator: makeAddress(71),
      previousRoot: makeAddress(80),
      newRoot: makeAddress(81),
      blockNumber: "82",
      blockTimestamp: "83",
      transactionHash: makeAddress(84),
      blockLogIndex: String(index)
    })) as SubgraphRoleProviderRootChangeDataFragment[];
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            roleProviderInstance: {
              ...provider,
              attachments: [],
              members: [],
              rootChanges: args.variables?.skip === 0 ? rootChanges : []
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const normalized = await getRoleProviderAuthority(client, provider.address, {
      fetchPolicy: "no-cache"
    });

    expect(calls.map(({ variables }) => variables)).to.deep.equal([
      { provider: provider.address.toLowerCase(), first: 1_000, skip: 0 },
      { provider: provider.address.toLowerCase(), first: 1_000, skip: 1_000 }
    ]);
    expect(normalized?.rootChanges).to.have.length(1_000);
    expect(normalized?.rootChanges[0]).to.deep.equal({
      id: "root-change-0",
      provider: provider.address,
      administrator: makeAddress(71),
      previousRoot: makeAddress(80),
      newRoot: makeAddress(81),
      blockNumber: 82n,
      blockTimestamp: 83n,
      transactionHash: makeAddress(84),
      logIndex: 0n
    });
  });
});
