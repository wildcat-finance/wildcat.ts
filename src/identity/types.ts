import { IndexedAt } from "../domain";

export type BorrowerPrincipalRegistration = {
  archController: string;
  isRegistered: boolean;
};

export type BorrowerAccountFactoryIdentity = {
  address: string;
  isApproved: boolean;
};

export type BorrowerAccountIdentity = {
  id: string;
  address: string;
  registry: string;
  accountFactory: BorrowerAccountFactoryIdentity;
  principal: string;
  pendingPrincipal?: string;
  registeredAt: IndexedAt;
};

export type BorrowerPrincipalIdentity = {
  id: string;
  address: string;
  firstSeen: IndexedAt;
  lastSeen: IndexedAt;
  registrations: BorrowerPrincipalRegistration[];
  accounts: BorrowerAccountIdentity[];
  pendingAccounts: BorrowerAccountIdentity[];
};

export type MarketBorrowerIdentity = {
  id: string;
  market: string;
  borrower: string;
  borrowerPrincipal: string;
  pendingBorrower?: string;
  pendingBorrowerPrincipal?: string;
  borrowerIdentityRegistry?: string;
};

export type BorrowerAccountPrincipalChangeKind =
  | "registered"
  | "transfer-requested"
  | "transfer-cancelled"
  | "transferred"
  | "unknown";

export type BorrowerAccountPrincipalChange = IndexedAt & {
  id: string;
  kind: BorrowerAccountPrincipalChangeKind;
  account: string;
  registry: string;
  currentPrincipal?: string;
  previousPrincipal?: string;
  newPrincipal?: string;
  previousPendingPrincipal?: string;
  pendingPrincipal?: string;
  cancelledPendingPrincipal?: string;
};

export type MarketBorrowerChangeKind =
  | "transfer-requested"
  | "transfer-cancelled"
  | "transferred"
  | "unknown";

export type MarketBorrowerChange = IndexedAt & {
  id: string;
  kind: MarketBorrowerChangeKind;
  market: string;
  borrower?: string;
  borrowerPrincipal?: string;
  previousBorrower?: string;
  previousBorrowerPrincipal?: string;
  newBorrower?: string;
  newBorrowerPrincipal?: string;
  previousPendingBorrower?: string;
  previousPendingBorrowerPrincipal?: string;
  pendingBorrower?: string;
  pendingBorrowerPrincipal?: string;
  cancelledPendingBorrower?: string;
  cancelledPendingBorrowerPrincipal?: string;
};
