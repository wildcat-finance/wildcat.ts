import { IndexedAt } from "../domain";
import {
  SubgraphBorrowerAccountIdentityDataFragment,
  SubgraphBorrowerAccountPrincipalChangeDataFragment,
  SubgraphBorrowerAccountPrincipalChangeKind,
  SubgraphBorrowerPrincipalIdentityDataFragment,
  SubgraphMarketBorrowerChangeDataFragment,
  SubgraphMarketBorrowerChangeKind,
  SubgraphMarketBorrowerIdentityDataFragment
} from "../gql/graphql";
import {
  BorrowerAccountIdentity,
  BorrowerAccountPrincipalChange,
  BorrowerAccountPrincipalChangeKind,
  BorrowerPrincipalIdentity,
  MarketBorrowerChange,
  MarketBorrowerChangeKind,
  MarketBorrowerIdentity
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

export const normalizeBorrowerAccountIdentity = (
  data: SubgraphBorrowerAccountIdentityDataFragment
): BorrowerAccountIdentity => ({
  id: data.id,
  address: data.address,
  registry: data.registry.address,
  accountFactory: {
    address: data.accountFactory.address,
    isApproved: data.accountFactory.isApproved
  },
  principal: data.principalAddress,
  ...optional("pendingPrincipal", data.pendingPrincipalAddress),
  registeredAt: indexedAt(
    data.registeredAtBlock,
    data.registeredAtTimestamp,
    data.registeredAtTransaction,
    data.registeredAtLogIndex
  )
});

export const normalizeBorrowerPrincipalIdentity = (
  data: SubgraphBorrowerPrincipalIdentityDataFragment & {
    accounts: SubgraphBorrowerAccountIdentityDataFragment[];
    pendingAccounts: SubgraphBorrowerAccountIdentityDataFragment[];
  }
): BorrowerPrincipalIdentity => ({
  id: data.id,
  address: data.address,
  firstSeen: indexedAt(
    data.firstSeenBlock,
    data.firstSeenTimestamp,
    data.firstSeenTransaction,
    data.firstSeenLogIndex
  ),
  lastSeen: indexedAt(
    data.lastSeenBlock,
    data.lastSeenTimestamp,
    data.lastSeenTransaction,
    data.lastSeenLogIndex
  ),
  registrations: data.registrations.map(({ archController, isRegistered }) => ({
    archController: archController.id,
    isRegistered
  })),
  accounts: data.accounts.map(normalizeBorrowerAccountIdentity),
  pendingAccounts: data.pendingAccounts.map(normalizeBorrowerAccountIdentity)
});

export const normalizeMarketBorrowerIdentity = (
  data: SubgraphMarketBorrowerIdentityDataFragment
): MarketBorrowerIdentity => ({
  id: data.id,
  market: data.address,
  borrower: data.borrower,
  borrowerPrincipal: data.borrowerPrincipal,
  ...optional("pendingBorrower", data.pendingBorrower),
  ...optional("pendingBorrowerPrincipal", data.pendingBorrowerPrincipal),
  ...optional("borrowerIdentityRegistry", data.borrowerIdentityRegistryAddress)
});

export const parseBorrowerAccountPrincipalChangeKind = (
  kind: SubgraphBorrowerAccountPrincipalChangeKind | string
): BorrowerAccountPrincipalChangeKind => {
  switch (kind) {
    case SubgraphBorrowerAccountPrincipalChangeKind.REGISTERED:
      return "registered";
    case SubgraphBorrowerAccountPrincipalChangeKind.TRANSFER_REQUESTED:
      return "transfer-requested";
    case SubgraphBorrowerAccountPrincipalChangeKind.TRANSFER_CANCELLED:
      return "transfer-cancelled";
    case SubgraphBorrowerAccountPrincipalChangeKind.TRANSFERRED:
      return "transferred";
    default:
      return "unknown";
  }
};

export const normalizeBorrowerAccountPrincipalChange = (
  data: SubgraphBorrowerAccountPrincipalChangeDataFragment
): BorrowerAccountPrincipalChange => ({
  id: data.id,
  kind: parseBorrowerAccountPrincipalChangeKind(data.kind),
  account: data.account.address,
  registry: data.account.registry.address,
  ...optional("currentPrincipal", data.currentPrincipalAddress),
  ...optional("previousPrincipal", data.previousPrincipalAddress),
  ...optional("newPrincipal", data.newPrincipalAddress),
  ...optional("previousPendingPrincipal", data.previousPendingPrincipalAddress),
  ...optional("pendingPrincipal", data.pendingPrincipalAddress),
  ...optional("cancelledPendingPrincipal", data.cancelledPendingPrincipalAddress),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});

export const parseMarketBorrowerChangeKind = (
  kind: SubgraphMarketBorrowerChangeKind | string
): MarketBorrowerChangeKind => {
  switch (kind) {
    case SubgraphMarketBorrowerChangeKind.TRANSFER_REQUESTED:
      return "transfer-requested";
    case SubgraphMarketBorrowerChangeKind.TRANSFER_CANCELLED:
      return "transfer-cancelled";
    case SubgraphMarketBorrowerChangeKind.TRANSFERRED:
      return "transferred";
    default:
      return "unknown";
  }
};

export const normalizeMarketBorrowerChange = (
  data: SubgraphMarketBorrowerChangeDataFragment
): MarketBorrowerChange => ({
  id: data.id,
  kind: parseMarketBorrowerChangeKind(data.kind),
  market: data.market.address,
  ...optional("borrower", data.borrower),
  ...optional("borrowerPrincipal", data.borrowerPrincipal),
  ...optional("previousBorrower", data.previousBorrower),
  ...optional("previousBorrowerPrincipal", data.previousBorrowerPrincipal),
  ...optional("newBorrower", data.newBorrower),
  ...optional("newBorrowerPrincipal", data.newBorrowerPrincipal),
  ...optional("previousPendingBorrower", data.previousPendingBorrower),
  ...optional("previousPendingBorrowerPrincipal", data.previousPendingBorrowerPrincipal),
  ...optional("pendingBorrower", data.pendingBorrower),
  ...optional("pendingBorrowerPrincipal", data.pendingBorrowerPrincipal),
  ...optional("cancelledPendingBorrower", data.cancelledPendingBorrower),
  ...optional("cancelledPendingBorrowerPrincipal", data.cancelledPendingBorrowerPrincipal),
  ...indexedAt(data.blockNumber, data.blockTimestamp, data.transactionHash, data.blockLogIndex)
});
