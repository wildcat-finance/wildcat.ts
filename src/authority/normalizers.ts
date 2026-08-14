import { IndexedAt, parseHooksKind, parseRoleProviderKind } from "../domain";
import {
  SubgraphAdministratorChangeKind,
  SubgraphHookAdministratorChangeDataFragment,
  SubgraphHookAuthorityDataFragment,
  SubgraphMembershipChangeKind,
  SubgraphProviderMetadataState,
  SubgraphRoleProviderAdministratorChangeDataFragment,
  SubgraphRoleProviderAttachmentDataFragment,
  SubgraphRoleProviderInstanceDataFragment,
  SubgraphRoleProviderMemberDataFragment,
  SubgraphRoleProviderMembershipChangeDataFragment
} from "../gql/graphql";
import {
  AdministratorChange,
  AdministratorChangeKind,
  HookAdministratorChange,
  HookAuthority,
  MembershipChangeKind,
  ProviderMetadataState,
  RoleProviderAdministratorChange,
  RoleProviderAttachment,
  RoleProviderAuthority,
  RoleProviderMember,
  RoleProviderMembershipChange
} from "./types";

const indexedAt = (
  blockNumber: string,
  blockTimestamp: string,
  transactionHash: string,
  logIndex: string
): IndexedAt => ({
  blockNumber: BigInt(blockNumber),
  blockTimestamp: BigInt(blockTimestamp),
  transactionHash,
  logIndex: BigInt(logIndex)
});

const optional = <Key extends string>(key: Key, value: string | null | undefined) =>
  value === null || value === undefined ? {} : ({ [key]: value } as Record<Key, string>);

export const parseProviderMetadataState = (
  state: SubgraphProviderMetadataState | string
): ProviderMetadataState => {
  switch (state) {
    case SubgraphProviderMetadataState.AVAILABLE:
      return "available";
    case SubgraphProviderMetadataState.UNAVAILABLE:
      return "unavailable";
    default:
      return "unknown";
  }
};

export const parseAdministratorChangeKind = (
  kind: SubgraphAdministratorChangeKind | string
): AdministratorChangeKind => {
  switch (kind) {
    case SubgraphAdministratorChangeKind.TRANSFER_REQUESTED:
      return "transfer-requested";
    case SubgraphAdministratorChangeKind.TRANSFER_CANCELLED:
      return "transfer-cancelled";
    case SubgraphAdministratorChangeKind.TRANSFERRED:
      return "transferred";
    default:
      return "unknown";
  }
};

export const parseMembershipChangeKind = (
  kind: SubgraphMembershipChangeKind | string
): MembershipChangeKind => {
  switch (kind) {
    case SubgraphMembershipChangeKind.ADDED:
      return "added";
    case SubgraphMembershipChangeKind.REMOVED:
      return "removed";
    default:
      return "unknown";
  }
};

export const normalizeRoleProviderAttachment = (
  data: SubgraphRoleProviderAttachmentDataFragment
): RoleProviderAttachment => ({
  id: data.id,
  provider: data.providerAddress,
  hooks: data.hooks.address,
  hooksAdministrator: data.hooks.administrator,
  ...optional("hooksPendingAdministrator", data.hooks.pendingAdministrator),
  timeToLive: BigInt(data.timeToLive),
  isPullProvider: data.isPullProvider,
  pullProviderIndex: data.pullProviderIndex,
  isPushProvider: data.isPushProvider,
  pushProviderIndex: data.pushProviderIndex,
  isApproved: data.isApproved
});

export const normalizeHookAuthority = (
  data: SubgraphHookAuthorityDataFragment & {
    providers: SubgraphRoleProviderAttachmentDataFragment[];
  }
): HookAuthority => ({
  id: data.id,
  address: data.address,
  borrower: data.borrower,
  administrator: data.administrator,
  ...optional("pendingAdministrator", data.pendingAdministrator),
  providerMetadataState: parseProviderMetadataState(data.providerMetadataState),
  hooksFactory: data.hooksFactory.address,
  hooksTemplate: {
    address: data.hooksTemplate.address,
    kind: parseHooksKind(data.hooksTemplate.kind),
    version: data.hooksTemplate.version
  },
  providers: data.providers.map(normalizeRoleProviderAttachment)
});

export const normalizeRoleProviderMember = (
  data: SubgraphRoleProviderMemberDataFragment
): RoleProviderMember => ({
  id: data.id,
  account: data.account,
  isMember: data.isMember,
  updatedAt: indexedAt(
    data.updatedAtBlock,
    data.updatedAtTimestamp,
    data.updatedAtTransaction,
    data.updatedAtLogIndex
  )
});

export const normalizeRoleProviderAuthority = (
  data: SubgraphRoleProviderInstanceDataFragment & {
    attachments: SubgraphRoleProviderAttachmentDataFragment[];
    members: SubgraphRoleProviderMemberDataFragment[];
  }
): RoleProviderAuthority => {
  const hasDeploymentRecord =
    data.deployedAtBlock !== null &&
    data.deployedAtBlock !== undefined &&
    data.deployedAtTimestamp !== null &&
    data.deployedAtTimestamp !== undefined &&
    data.deployedAtTransaction !== null &&
    data.deployedAtTransaction !== undefined &&
    data.deployedAtLogIndex !== null &&
    data.deployedAtLogIndex !== undefined;
  return {
    id: data.id,
    address: data.address,
    kind: parseRoleProviderKind(data.kind),
    ...optional("administrator", data.administrator),
    ...optional("pendingAdministrator", data.pendingAdministrator),
    ...optional("deployer", data.deployer),
    ...optional("deploymentFactory", data.deploymentFactory?.address),
    ...optional("salt", data.salt),
    ...(hasDeploymentRecord
      ? {
          deployedAt: indexedAt(
            data.deployedAtBlock as string,
            data.deployedAtTimestamp as string,
            data.deployedAtTransaction as string,
            data.deployedAtLogIndex as string
          )
        }
      : {}),
    attachments: data.attachments.map(normalizeRoleProviderAttachment),
    members: data.members.map(normalizeRoleProviderMember)
  };
};

type AdministratorChangeData =
  | SubgraphHookAdministratorChangeDataFragment
  | SubgraphRoleProviderAdministratorChangeDataFragment;

const normalizeAdministratorChange = (data: AdministratorChangeData): AdministratorChange => ({
  id: data.id,
  kind: parseAdministratorChangeKind(data.kind),
  ...optional("administrator", data.administrator),
  ...optional("previousAdministrator", data.previousAdministrator),
  ...optional("newAdministrator", data.newAdministrator),
  ...optional("previousPendingAdministrator", data.previousPendingAdministrator),
  ...optional("pendingAdministrator", data.pendingAdministrator),
  ...optional("cancelledPendingAdministrator", data.cancelledPendingAdministrator),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const normalizeHookAdministratorChange = (
  data: SubgraphHookAdministratorChangeDataFragment
): HookAdministratorChange => ({
  ...normalizeAdministratorChange(data),
  hooks: data.hooks.address
});

export const normalizeRoleProviderAdministratorChange = (
  data: SubgraphRoleProviderAdministratorChangeDataFragment
): RoleProviderAdministratorChange => ({
  ...normalizeAdministratorChange(data),
  provider: data.provider.address
});

export const normalizeRoleProviderMembershipChange = (
  data: SubgraphRoleProviderMembershipChangeDataFragment
): RoleProviderMembershipChange => ({
  id: data.id,
  provider: data.provider.address,
  kind: parseMembershipChangeKind(data.kind),
  account: data.account,
  administrator: data.administrator,
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});
