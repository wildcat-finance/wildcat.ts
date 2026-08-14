import { HooksKind, IndexedAt, RoleProviderKind } from "../domain";

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

export type RoleProviderAuthority = {
  id: string;
  address: string;
  kind: RoleProviderKind;
  administrator?: string;
  pendingAdministrator?: string;
  deployer?: string;
  deploymentFactory?: string;
  salt?: string;
  deployedAt?: IndexedAt;
  attachments: RoleProviderAttachment[];
  members: RoleProviderMember[];
};

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
