import { FactoryLifecycle, HooksKind, IndexedAt, RoleProviderKind } from "../domain";

export type ProviderMetadataState = "available" | "unavailable" | "unknown";
export type AdministratorChangeKind =
  | "transfer-requested"
  | "transfer-cancelled"
  | "transferred"
  | "unknown";
export type MembershipChangeKind = "added" | "removed" | "unknown";

export type RoleProviderAttachment = {
  id: string;
  provider: string;
  hooks: string;
  hooksAdministrator: string;
  hooksPendingAdministrator?: string;
  timeToLive: bigint;
  isPullProvider: boolean;
  pullProviderIndex: number;
  isPushProvider: boolean;
  pushProviderIndex: number;
  isApproved: boolean;
};

export type HookAuthority = {
  id: string;
  address: string;
  /** Compatibility alias maintained by the v2.5 subgraph. */
  borrower: string;
  administrator: string;
  pendingAdministrator?: string;
  providerMetadataState: ProviderMetadataState;
  hooksFactory: string;
  hooksTemplate: {
    address: string;
    kind: HooksKind;
    version: string;
  };
  providers: RoleProviderAttachment[];
};

export type RoleProviderMember = {
  id: string;
  account: string;
  isMember: boolean;
  updatedAt: IndexedAt;
};

export type RoleProviderFactoryMetadata = {
  address: string;
  kind: RoleProviderKind;
  label: string;
  generation: string;
  configuredStartBlock: bigint;
  indexed: boolean;
  lifecycle: FactoryLifecycle;
  configured: boolean;
};

type RoleProviderAuthorityBase = {
  id: string;
  address: string;
  administrator?: string;
  pendingAdministrator?: string;
  deployer?: string;
  deploymentFactory?: RoleProviderFactoryMetadata;
  salt?: string;
  deployedAt?: IndexedAt;
  attachments: RoleProviderAttachment[];
  members: RoleProviderMember[];
  rootChanges: RoleProviderRootChange[];
};

export type RoleProviderConfiguration =
  | { kind: "access-list" }
  | { kind: "merkle"; root: string }
  | { kind: "erc20"; token: string; minBalance: bigint }
  | { kind: "erc4626-assets"; vault: string; minAssets: bigint }
  | { kind: "erc721"; token: string; skipInterfaceCheck: boolean }
  | {
      kind: "erc1155";
      token: string;
      tokenId: bigint;
      skipInterfaceCheck: boolean;
    }
  | { kind: "unknown" };

export type RoleProviderAuthority = RoleProviderAuthorityBase & RoleProviderConfiguration;

export type AdministratorChange = IndexedAt & {
  id: string;
  kind: AdministratorChangeKind;
  administrator?: string;
  previousAdministrator?: string;
  newAdministrator?: string;
  previousPendingAdministrator?: string;
  pendingAdministrator?: string;
  cancelledPendingAdministrator?: string;
};

export type HookAdministratorChange = AdministratorChange & {
  hooks: string;
};

export type RoleProviderAdministratorChange = AdministratorChange & {
  provider: string;
};

export type RoleProviderMembershipChange = IndexedAt & {
  id: string;
  provider: string;
  kind: MembershipChangeKind;
  account: string;
  administrator: string;
};

export type RoleProviderRootChange = IndexedAt & {
  id: string;
  provider: string;
  administrator: string;
  previousRoot: string;
  newRoot: string;
};
