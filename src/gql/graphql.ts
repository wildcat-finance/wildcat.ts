import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: string | number | bigint; output: string };
  Bytes: { input: string; output: string };
  Int8: { input: any; output: any };
  Timestamp: { input: any; output: any };
};

export type SubgraphAccountAccessGranted = {
  __typename: "AccountAccessGranted";
  account: SubgraphLenderHooksAccess;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  credentialTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  provider: SubgraphRoleProvider;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphAccountAccessGranted_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphAccountAccessGranted_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  credentialTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  credentialTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  credentialTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  credentialTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  credentialTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  credentialTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  credentialTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  credentialTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphAccountAccessGranted_Filter>>>;
  provider?: InputMaybe<Scalars["String"]["input"]>;
  provider_?: InputMaybe<SubgraphRoleProvider_Filter>;
  provider_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_gt?: InputMaybe<Scalars["String"]["input"]>;
  provider_gte?: InputMaybe<Scalars["String"]["input"]>;
  provider_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_lt?: InputMaybe<Scalars["String"]["input"]>;
  provider_lte?: InputMaybe<Scalars["String"]["input"]>;
  provider_not?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphAccountAccessGranted_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountCanRefresh = "account__canRefresh",
  AccountId = "account__id",
  AccountIsBlockedFromDeposits = "account__isBlockedFromDeposits",
  AccountLastApprovalTimestamp = "account__lastApprovalTimestamp",
  AccountLender = "account__lender",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  CredentialTimestamp = "credentialTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  Provider = "provider",
  ProviderId = "provider__id",
  ProviderIsApproved = "provider__isApproved",
  ProviderIsPullProvider = "provider__isPullProvider",
  ProviderIsPushProvider = "provider__isPushProvider",
  ProviderProviderAddress = "provider__providerAddress",
  ProviderPullProviderIndex = "provider__pullProviderIndex",
  ProviderPushProviderIndex = "provider__pushProviderIndex",
  ProviderTimeToLive = "provider__timeToLive",
  TransactionHash = "transactionHash"
}

export type SubgraphAccountAccessRevoked = {
  __typename: "AccountAccessRevoked";
  account: SubgraphLenderHooksAccess;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphAccountAccessRevoked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphAccountAccessRevoked_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphAccountAccessRevoked_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphAccountAccessRevoked_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountCanRefresh = "account__canRefresh",
  AccountId = "account__id",
  AccountIsBlockedFromDeposits = "account__isBlockedFromDeposits",
  AccountLastApprovalTimestamp = "account__lastApprovalTimestamp",
  AccountLender = "account__lender",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphAccountBlockedFromDeposits = {
  __typename: "AccountBlockedFromDeposits";
  account: SubgraphLenderHooksAccess;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphAccountBlockedFromDeposits_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphAccountBlockedFromDeposits_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphAccountBlockedFromDeposits_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphAccountBlockedFromDeposits_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountCanRefresh = "account__canRefresh",
  AccountId = "account__id",
  AccountIsBlockedFromDeposits = "account__isBlockedFromDeposits",
  AccountLastApprovalTimestamp = "account__lastApprovalTimestamp",
  AccountLender = "account__lender",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphAccountMadeFirstDeposit = {
  __typename: "AccountMadeFirstDeposit";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  lenderAccount: SubgraphLenderAccount;
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphAccountMadeFirstDeposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphAccountMadeFirstDeposit_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lenderAccount?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_?: InputMaybe<SubgraphLenderAccount_Filter>;
  lenderAccount_contains?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_gt?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_gte?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lenderAccount_lt?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_lte?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lenderAccount_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphAccountMadeFirstDeposit_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphAccountMadeFirstDeposit_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  LenderAccount = "lenderAccount",
  LenderAccountAddedTimestamp = "lenderAccount__addedTimestamp",
  LenderAccountAddress = "lenderAccount__address",
  LenderAccountId = "lenderAccount__id",
  LenderAccountLastScaleFactor = "lenderAccount__lastScaleFactor",
  LenderAccountLastUpdatedTimestamp = "lenderAccount__lastUpdatedTimestamp",
  LenderAccountNumPendingWithdrawalBatches = "lenderAccount__numPendingWithdrawalBatches",
  LenderAccountRole = "lenderAccount__role",
  LenderAccountScaledBalance = "lenderAccount__scaledBalance",
  LenderAccountTotalDeposited = "lenderAccount__totalDeposited",
  LenderAccountTotalInterestEarned = "lenderAccount__totalInterestEarned",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphAccountUnblockedFromDeposits = {
  __typename: "AccountUnblockedFromDeposits";
  account: SubgraphLenderHooksAccess;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphAccountUnblockedFromDeposits_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphAccountUnblockedFromDeposits_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphAccountUnblockedFromDeposits_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphAccountUnblockedFromDeposits_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountCanRefresh = "account__canRefresh",
  AccountId = "account__id",
  AccountIsBlockedFromDeposits = "account__isBlockedFromDeposits",
  AccountLastApprovalTimestamp = "account__lastApprovalTimestamp",
  AccountLender = "account__lender",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  TransactionHash = "transactionHash"
}

export enum SubgraphAggregation_Interval {
  Day = "day",
  Hour = "hour"
}

export type SubgraphAnnualInterestBipsUpdated = {
  __typename: "AnnualInterestBipsUpdated";
  annualInterestBipsUpdatedIndex: Scalars["Int"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  newAnnualInterestBips: Scalars["Int"]["output"];
  oldAnnualInterestBips: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphAnnualInterestBipsUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphAnnualInterestBipsUpdated_Filter>>>;
  annualInterestBipsUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  annualInterestBipsUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newAnnualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
  newAnnualInterestBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  newAnnualInterestBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  newAnnualInterestBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  newAnnualInterestBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  newAnnualInterestBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  newAnnualInterestBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  newAnnualInterestBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldAnnualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
  oldAnnualInterestBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  oldAnnualInterestBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  oldAnnualInterestBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldAnnualInterestBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  oldAnnualInterestBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  oldAnnualInterestBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  oldAnnualInterestBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphAnnualInterestBipsUpdated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphAnnualInterestBipsUpdated_OrderBy {
  AnnualInterestBipsUpdatedIndex = "annualInterestBipsUpdatedIndex",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NewAnnualInterestBips = "newAnnualInterestBips",
  OldAnnualInterestBips = "oldAnnualInterestBips",
  TransactionHash = "transactionHash"
}

export type SubgraphApproval = {
  __typename: "Approval";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  owner: Scalars["Bytes"]["output"];
  spender: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
  value: Scalars["BigInt"]["output"];
};

export type SubgraphApproval_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphApproval_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphApproval_Filter>>>;
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  spender?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  spender_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  spender_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  value?: InputMaybe<Scalars["BigInt"]["input"]>;
  value_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  value_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  value_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  value_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  value_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  value_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum SubgraphApproval_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  Owner = "owner",
  Spender = "spender",
  TransactionHash = "transactionHash",
  Value = "value"
}

export type SubgraphArchController = {
  __typename: "ArchController";
  borrowers: SubgraphRegisteredBorrower[];
  controllerFactories: SubgraphControllerFactory[];
  controllers: SubgraphController[];
  hooksFactory?: Maybe<SubgraphHooksFactory>;
  id: Scalars["ID"]["output"];
  markets: SubgraphMarket[];
};

export type SubgraphArchControllerBorrowersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRegisteredBorrower_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphRegisteredBorrower_Filter>;
};

export type SubgraphArchControllerControllerFactoriesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerFactory_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphControllerFactory_Filter>;
};

export type SubgraphArchControllerControllersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphController_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphController_Filter>;
};

export type SubgraphArchControllerMarketsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarket_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphMarket_Filter>;
};

export type SubgraphArchController_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphArchController_Filter>>>;
  borrowers_?: InputMaybe<SubgraphRegisteredBorrower_Filter>;
  controllerFactories_?: InputMaybe<SubgraphControllerFactory_Filter>;
  controllers_?: InputMaybe<SubgraphController_Filter>;
  hooksFactory_?: InputMaybe<SubgraphHooksFactory_Filter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  markets_?: InputMaybe<SubgraphMarket_Filter>;
  or?: InputMaybe<Array<InputMaybe<SubgraphArchController_Filter>>>;
};

export enum SubgraphArchController_OrderBy {
  Borrowers = "borrowers",
  ControllerFactories = "controllerFactories",
  Controllers = "controllers",
  HooksFactory = "hooksFactory",
  HooksFactoryEventIndex = "hooksFactory__eventIndex",
  HooksFactoryId = "hooksFactory__id",
  HooksFactoryIsRegistered = "hooksFactory__isRegistered",
  HooksFactorySentinel = "hooksFactory__sentinel",
  Id = "id",
  Markets = "markets"
}

export type SubgraphBlockChangedFilter = {
  number_gte: Scalars["Int"]["input"];
};

export type SubgraphBlock_Height = {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  number?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SubgraphBorrow = {
  __typename: "Borrow";
  assetAmount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  borrowIndex: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphBorrow_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphBorrow_Filter>>>;
  assetAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  assetAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrowIndex?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrowIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphBorrow_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphBorrow_OrderBy {
  AssetAmount = "assetAmount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  BorrowIndex = "borrowIndex",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphBorrowerRegistrationChange = {
  __typename: "BorrowerRegistrationChange";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  registration: SubgraphRegisteredBorrower;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphBorrowerRegistrationChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphBorrowerRegistrationChange_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isRegistered?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphBorrowerRegistrationChange_Filter>>>;
  registration?: InputMaybe<Scalars["String"]["input"]>;
  registration_?: InputMaybe<SubgraphRegisteredBorrower_Filter>;
  registration_contains?: InputMaybe<Scalars["String"]["input"]>;
  registration_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  registration_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  registration_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  registration_gt?: InputMaybe<Scalars["String"]["input"]>;
  registration_gte?: InputMaybe<Scalars["String"]["input"]>;
  registration_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  registration_lt?: InputMaybe<Scalars["String"]["input"]>;
  registration_lte?: InputMaybe<Scalars["String"]["input"]>;
  registration_not?: InputMaybe<Scalars["String"]["input"]>;
  registration_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  registration_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  registration_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  registration_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  registration_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  registration_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  registration_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphBorrowerRegistrationChange_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  IsRegistered = "isRegistered",
  Registration = "registration",
  RegistrationBorrower = "registration__borrower",
  RegistrationId = "registration__id",
  RegistrationIsRegistered = "registration__isRegistered",
  TransactionHash = "transactionHash"
}

export type SubgraphController = {
  __typename: "Controller";
  archController: SubgraphArchController;
  authorizationChanges: SubgraphLenderAuthorizationChange[];
  authorizedLenders: SubgraphLenderAuthorization[];
  borrower: Scalars["Bytes"]["output"];
  controllerFactory: SubgraphControllerFactory;
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  markets: SubgraphMarket[];
  numMarkets: Scalars["Int"]["output"];
  removal?: Maybe<SubgraphControllerRemoved>;
};

export type SubgraphControllerAuthorizationChangesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAuthorizationChange_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphLenderAuthorizationChange_Filter>;
};

export type SubgraphControllerAuthorizedLendersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAuthorization_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphLenderAuthorization_Filter>;
};

export type SubgraphControllerMarketsArgs = SubgraphArchControllerMarketsArgs;

export type SubgraphControllerAdded = {
  __typename: "ControllerAdded";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  controller: SubgraphController;
  controllerFactory: SubgraphControllerFactory;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphControllerAdded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphControllerAdded_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  controller?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_?: InputMaybe<SubgraphControllerFactory_Filter>;
  controllerFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_?: InputMaybe<SubgraphController_Filter>;
  controller_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_gt?: InputMaybe<Scalars["String"]["input"]>;
  controller_gte?: InputMaybe<Scalars["String"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["String"]["input"]>;
  controller_lte?: InputMaybe<Scalars["String"]["input"]>;
  controller_not?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphControllerAdded_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphControllerAdded_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Controller = "controller",
  ControllerFactory = "controllerFactory",
  ControllerFactoryFeeRecipient = "controllerFactory__feeRecipient",
  ControllerFactoryId = "controllerFactory__id",
  ControllerFactoryIsRegistered = "controllerFactory__isRegistered",
  ControllerFactoryOriginationFeeAmount = "controllerFactory__originationFeeAmount",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  ControllerNumMarkets = "controller__numMarkets",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphControllerFactory = {
  __typename: "ControllerFactory";
  archController: SubgraphArchController;
  constraints: SubgraphParameterConstraints;
  controllers: SubgraphController[];
  feeRecipient: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset?: Maybe<SubgraphToken>;
  protocolFeeBips: Scalars["Int"]["output"];
  removal?: Maybe<SubgraphControllerFactoryRemoved>;
  sentinel: Scalars["Bytes"]["output"];
};

export type SubgraphControllerFactoryControllersArgs = SubgraphArchControllerControllersArgs;

export type SubgraphControllerFactoryAdded = {
  __typename: "ControllerFactoryAdded";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  controllerFactory: SubgraphControllerFactory;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphControllerFactoryAdded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphControllerFactoryAdded_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  controllerFactory?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_?: InputMaybe<SubgraphControllerFactory_Filter>;
  controllerFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphControllerFactoryAdded_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphControllerFactoryAdded_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  ControllerFactory = "controllerFactory",
  ControllerFactoryFeeRecipient = "controllerFactory__feeRecipient",
  ControllerFactoryId = "controllerFactory__id",
  ControllerFactoryIsRegistered = "controllerFactory__isRegistered",
  ControllerFactoryOriginationFeeAmount = "controllerFactory__originationFeeAmount",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphControllerFactoryRemoved = {
  __typename: "ControllerFactoryRemoved";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  controllerFactory: SubgraphControllerFactory;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphControllerFactoryRemoved_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphControllerFactoryRemoved_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  controllerFactory?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_?: InputMaybe<SubgraphControllerFactory_Filter>;
  controllerFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphControllerFactoryRemoved_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphControllerFactoryRemoved_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  ControllerFactory = "controllerFactory",
  ControllerFactoryFeeRecipient = "controllerFactory__feeRecipient",
  ControllerFactoryId = "controllerFactory__id",
  ControllerFactoryIsRegistered = "controllerFactory__isRegistered",
  ControllerFactoryOriginationFeeAmount = "controllerFactory__originationFeeAmount",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphControllerFactory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphControllerFactory_Filter>>>;
  archController?: InputMaybe<Scalars["String"]["input"]>;
  archController_?: InputMaybe<SubgraphArchController_Filter>;
  archController_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_gt?: InputMaybe<Scalars["String"]["input"]>;
  archController_gte?: InputMaybe<Scalars["String"]["input"]>;
  archController_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_lt?: InputMaybe<Scalars["String"]["input"]>;
  archController_lte?: InputMaybe<Scalars["String"]["input"]>;
  archController_not?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  constraints?: InputMaybe<Scalars["String"]["input"]>;
  constraints_?: InputMaybe<SubgraphParameterConstraints_Filter>;
  constraints_contains?: InputMaybe<Scalars["String"]["input"]>;
  constraints_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  constraints_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  constraints_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  constraints_gt?: InputMaybe<Scalars["String"]["input"]>;
  constraints_gte?: InputMaybe<Scalars["String"]["input"]>;
  constraints_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  constraints_lt?: InputMaybe<Scalars["String"]["input"]>;
  constraints_lte?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  constraints_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  constraints_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  constraints_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  constraints_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllers_?: InputMaybe<SubgraphController_Filter>;
  feeRecipient?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feeRecipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isRegistered?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphControllerFactory_Filter>>>;
  originationFeeAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAsset?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_?: InputMaybe<SubgraphToken_Filter>;
  originationFeeAsset_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  protocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  removal_?: InputMaybe<SubgraphControllerFactoryRemoved_Filter>;
  sentinel?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  sentinel_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphControllerFactory_OrderBy {
  ArchController = "archController",
  ArchControllerId = "archController__id",
  Constraints = "constraints",
  ConstraintsId = "constraints__id",
  ConstraintsMaximumAnnualInterestBips = "constraints__maximumAnnualInterestBips",
  ConstraintsMaximumDelinquencyFeeBips = "constraints__maximumDelinquencyFeeBips",
  ConstraintsMaximumDelinquencyGracePeriod = "constraints__maximumDelinquencyGracePeriod",
  ConstraintsMaximumReserveRatioBips = "constraints__maximumReserveRatioBips",
  ConstraintsMaximumWithdrawalBatchDuration = "constraints__maximumWithdrawalBatchDuration",
  ConstraintsMinimumAnnualInterestBips = "constraints__minimumAnnualInterestBips",
  ConstraintsMinimumDelinquencyFeeBips = "constraints__minimumDelinquencyFeeBips",
  ConstraintsMinimumDelinquencyGracePeriod = "constraints__minimumDelinquencyGracePeriod",
  ConstraintsMinimumReserveRatioBips = "constraints__minimumReserveRatioBips",
  ConstraintsMinimumWithdrawalBatchDuration = "constraints__minimumWithdrawalBatchDuration",
  Controllers = "controllers",
  FeeRecipient = "feeRecipient",
  Id = "id",
  IsRegistered = "isRegistered",
  OriginationFeeAmount = "originationFeeAmount",
  OriginationFeeAsset = "originationFeeAsset",
  OriginationFeeAssetAddress = "originationFeeAsset__address",
  OriginationFeeAssetDecimals = "originationFeeAsset__decimals",
  OriginationFeeAssetId = "originationFeeAsset__id",
  OriginationFeeAssetIsMock = "originationFeeAsset__isMock",
  OriginationFeeAssetName = "originationFeeAsset__name",
  OriginationFeeAssetSymbol = "originationFeeAsset__symbol",
  ProtocolFeeBips = "protocolFeeBips",
  Removal = "removal",
  RemovalBlockNumber = "removal__blockNumber",
  RemovalBlockTimestamp = "removal__blockTimestamp",
  RemovalId = "removal__id",
  RemovalTransactionHash = "removal__transactionHash",
  Sentinel = "sentinel"
}

export type SubgraphControllerRemoved = {
  __typename: "ControllerRemoved";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  controller: SubgraphController;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphControllerRemoved_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphControllerRemoved_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  controller?: InputMaybe<Scalars["String"]["input"]>;
  controller_?: InputMaybe<SubgraphController_Filter>;
  controller_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_gt?: InputMaybe<Scalars["String"]["input"]>;
  controller_gte?: InputMaybe<Scalars["String"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["String"]["input"]>;
  controller_lte?: InputMaybe<Scalars["String"]["input"]>;
  controller_not?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphControllerRemoved_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphControllerRemoved_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  ControllerNumMarkets = "controller__numMarkets",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphController_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphController_Filter>>>;
  archController?: InputMaybe<Scalars["String"]["input"]>;
  archController_?: InputMaybe<SubgraphArchController_Filter>;
  archController_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_gt?: InputMaybe<Scalars["String"]["input"]>;
  archController_gte?: InputMaybe<Scalars["String"]["input"]>;
  archController_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_lt?: InputMaybe<Scalars["String"]["input"]>;
  archController_lte?: InputMaybe<Scalars["String"]["input"]>;
  archController_not?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorizationChanges_?: InputMaybe<SubgraphLenderAuthorizationChange_Filter>;
  authorizedLenders_?: InputMaybe<SubgraphLenderAuthorization_Filter>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  controllerFactory?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_?: InputMaybe<SubgraphControllerFactory_Filter>;
  controllerFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isRegistered?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  markets_?: InputMaybe<SubgraphMarket_Filter>;
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_gt?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_gte?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  numMarkets_lt?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_lte?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_not?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphController_Filter>>>;
  removal_?: InputMaybe<SubgraphControllerRemoved_Filter>;
};

export enum SubgraphController_OrderBy {
  ArchController = "archController",
  ArchControllerId = "archController__id",
  AuthorizationChanges = "authorizationChanges",
  AuthorizedLenders = "authorizedLenders",
  Borrower = "borrower",
  ControllerFactory = "controllerFactory",
  ControllerFactoryFeeRecipient = "controllerFactory__feeRecipient",
  ControllerFactoryId = "controllerFactory__id",
  ControllerFactoryIsRegistered = "controllerFactory__isRegistered",
  ControllerFactoryOriginationFeeAmount = "controllerFactory__originationFeeAmount",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  Id = "id",
  IsRegistered = "isRegistered",
  Markets = "markets",
  NumMarkets = "numMarkets",
  Removal = "removal",
  RemovalBlockNumber = "removal__blockNumber",
  RemovalBlockTimestamp = "removal__blockTimestamp",
  RemovalId = "removal__id",
  RemovalTransactionHash = "removal__transactionHash"
}

export type SubgraphDebtRepaid = {
  __typename: "DebtRepaid";
  assetAmount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  debtRepaidIndex: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  from: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphDebtRepaid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphDebtRepaid_Filter>>>;
  assetAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  assetAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  debtRepaidIndex?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  debtRepaidIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  from?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  from_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphDebtRepaid_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphDebtRepaid_OrderBy {
  AssetAmount = "assetAmount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  DebtRepaidIndex = "debtRepaidIndex",
  EventIndex = "eventIndex",
  From = "from",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphDelinquencyStatusChanged = {
  __typename: "DelinquencyStatusChanged";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  delinquencyStatusChangedIndex: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  isDelinquent: Scalars["Boolean"]["output"];
  liquidityCoverageRequired: Scalars["BigInt"]["output"];
  market: SubgraphMarket;
  totalAssets: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphDelinquencyStatusChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphDelinquencyStatusChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyStatusChangedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyStatusChangedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isDelinquent?: InputMaybe<Scalars["Boolean"]["input"]>;
  isDelinquent_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isDelinquent_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isDelinquent_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  liquidityCoverageRequired?: InputMaybe<Scalars["BigInt"]["input"]>;
  liquidityCoverageRequired_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  liquidityCoverageRequired_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  liquidityCoverageRequired_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  liquidityCoverageRequired_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  liquidityCoverageRequired_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  liquidityCoverageRequired_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  liquidityCoverageRequired_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphDelinquencyStatusChanged_Filter>>>;
  totalAssets?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalAssets_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalAssets_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalAssets_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalAssets_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalAssets_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalAssets_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalAssets_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphDelinquencyStatusChanged_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  DelinquencyStatusChangedIndex = "delinquencyStatusChangedIndex",
  EventIndex = "eventIndex",
  Id = "id",
  IsDelinquent = "isDelinquent",
  LiquidityCoverageRequired = "liquidityCoverageRequired",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TotalAssets = "totalAssets",
  TransactionHash = "transactionHash"
}

export type SubgraphDeposit = {
  __typename: "Deposit";
  account: SubgraphLenderAccount;
  assetAmount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  depositIndex: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  scaledAmount: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphDeposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderAccount_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphDeposit_Filter>>>;
  assetAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  assetAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  assetAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  depositIndex?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  depositIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphDeposit_Filter>>>;
  scaledAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphDeposit_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountAddress = "account__address",
  AccountId = "account__id",
  AccountLastScaleFactor = "account__lastScaleFactor",
  AccountLastUpdatedTimestamp = "account__lastUpdatedTimestamp",
  AccountNumPendingWithdrawalBatches = "account__numPendingWithdrawalBatches",
  AccountRole = "account__role",
  AccountScaledBalance = "account__scaledBalance",
  AccountTotalDeposited = "account__totalDeposited",
  AccountTotalInterestEarned = "account__totalInterestEarned",
  AssetAmount = "assetAmount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  DepositIndex = "depositIndex",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  ScaledAmount = "scaledAmount",
  TransactionHash = "transactionHash"
}

export type SubgraphDisabledForceBuyBacks = {
  __typename: "DisabledForceBuyBacks";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphDisabledForceBuyBacks_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphDisabledForceBuyBacks_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphDisabledForceBuyBacks_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphDisabledForceBuyBacks_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphFeesCollected = {
  __typename: "FeesCollected";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  feesCollected: Scalars["BigInt"]["output"];
  feesCollectedIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphFeesCollected_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphFeesCollected_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feesCollected?: InputMaybe<Scalars["BigInt"]["input"]>;
  feesCollectedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feesCollectedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feesCollected_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  feesCollected_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  feesCollected_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  feesCollected_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  feesCollected_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  feesCollected_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  feesCollected_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphFeesCollected_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphFeesCollected_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  FeesCollected = "feesCollected",
  FeesCollectedIndex = "feesCollectedIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphFixedTermUpdated = {
  __typename: "FixedTermUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  fixedTermUpdatedIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  newFixedTermEndTime: Scalars["Int"]["output"];
  oldFixedTermEndTime: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphFixedTermUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphFixedTermUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fixedTermUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fixedTermUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newFixedTermEndTime?: InputMaybe<Scalars["Int"]["input"]>;
  newFixedTermEndTime_gt?: InputMaybe<Scalars["Int"]["input"]>;
  newFixedTermEndTime_gte?: InputMaybe<Scalars["Int"]["input"]>;
  newFixedTermEndTime_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  newFixedTermEndTime_lt?: InputMaybe<Scalars["Int"]["input"]>;
  newFixedTermEndTime_lte?: InputMaybe<Scalars["Int"]["input"]>;
  newFixedTermEndTime_not?: InputMaybe<Scalars["Int"]["input"]>;
  newFixedTermEndTime_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldFixedTermEndTime?: InputMaybe<Scalars["Int"]["input"]>;
  oldFixedTermEndTime_gt?: InputMaybe<Scalars["Int"]["input"]>;
  oldFixedTermEndTime_gte?: InputMaybe<Scalars["Int"]["input"]>;
  oldFixedTermEndTime_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldFixedTermEndTime_lt?: InputMaybe<Scalars["Int"]["input"]>;
  oldFixedTermEndTime_lte?: InputMaybe<Scalars["Int"]["input"]>;
  oldFixedTermEndTime_not?: InputMaybe<Scalars["Int"]["input"]>;
  oldFixedTermEndTime_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphFixedTermUpdated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphFixedTermUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  FixedTermUpdatedIndex = "fixedTermUpdatedIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NewFixedTermEndTime = "newFixedTermEndTime",
  OldFixedTermEndTime = "oldFixedTermEndTime",
  TransactionHash = "transactionHash"
}

export type SubgraphForceBuyBack = {
  __typename: "ForceBuyBack";
  account: SubgraphLenderAccount;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  forceBuyBackIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  normalizedAmount: Scalars["BigInt"]["output"];
  scaledAmount: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
  withdrawalExpiry: Scalars["Int"]["output"];
};

export type SubgraphForceBuyBack_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderAccount_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphForceBuyBack_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  forceBuyBackIndex?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  forceBuyBackIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  normalizedAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphForceBuyBack_Filter>>>;
  scaledAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  withdrawalExpiry?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalExpiry_gt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalExpiry_gte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalExpiry_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalExpiry_lt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalExpiry_lte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalExpiry_not?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalExpiry_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export enum SubgraphForceBuyBack_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountAddress = "account__address",
  AccountId = "account__id",
  AccountLastScaleFactor = "account__lastScaleFactor",
  AccountLastUpdatedTimestamp = "account__lastUpdatedTimestamp",
  AccountNumPendingWithdrawalBatches = "account__numPendingWithdrawalBatches",
  AccountRole = "account__role",
  AccountScaledBalance = "account__scaledBalance",
  AccountTotalDeposited = "account__totalDeposited",
  AccountTotalInterestEarned = "account__totalInterestEarned",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  ForceBuyBackIndex = "forceBuyBackIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NormalizedAmount = "normalizedAmount",
  ScaledAmount = "scaledAmount",
  TransactionHash = "transactionHash",
  WithdrawalExpiry = "withdrawalExpiry"
}

export type SubgraphHooksConfig = {
  __typename: "HooksConfig";
  allowClosureBeforeTerm: Scalars["Boolean"]["output"];
  allowForceBuyBacks: Scalars["Boolean"]["output"];
  allowTermReduction: Scalars["Boolean"]["output"];
  depositRequiresAccess: Scalars["Boolean"]["output"];
  fixedTermEndTime: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  minimumDeposit?: Maybe<Scalars["BigInt"]["output"]>;
  queueWithdrawalRequiresAccess: Scalars["Boolean"]["output"];
  transferRequiresAccess: Scalars["Boolean"]["output"];
  transfersDisabled: Scalars["Boolean"]["output"];
  useOnBorrow: Scalars["Boolean"]["output"];
  useOnCloseMarket: Scalars["Boolean"]["output"];
  useOnDeposit: Scalars["Boolean"]["output"];
  useOnExecuteWithdrawal: Scalars["Boolean"]["output"];
  useOnNukeFromOrbit: Scalars["Boolean"]["output"];
  useOnQueueWithdrawal: Scalars["Boolean"]["output"];
  useOnRepay: Scalars["Boolean"]["output"];
  useOnSetAnnualInterestAndReserveRatioBips: Scalars["Boolean"]["output"];
  useOnSetMaxTotalSupply: Scalars["Boolean"]["output"];
  useOnSetProtocolFeeBips: Scalars["Boolean"]["output"];
  useOnTransfer: Scalars["Boolean"]["output"];
};

export type SubgraphHooksConfig_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  allowClosureBeforeTerm?: InputMaybe<Scalars["Boolean"]["input"]>;
  allowClosureBeforeTerm_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  allowClosureBeforeTerm_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  allowClosureBeforeTerm_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  allowForceBuyBacks?: InputMaybe<Scalars["Boolean"]["input"]>;
  allowForceBuyBacks_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  allowForceBuyBacks_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  allowForceBuyBacks_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  allowTermReduction?: InputMaybe<Scalars["Boolean"]["input"]>;
  allowTermReduction_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  allowTermReduction_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  allowTermReduction_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksConfig_Filter>>>;
  depositRequiresAccess?: InputMaybe<Scalars["Boolean"]["input"]>;
  depositRequiresAccess_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  depositRequiresAccess_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  depositRequiresAccess_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  fixedTermEndTime?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermEndTime_gt?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermEndTime_gte?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermEndTime_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fixedTermEndTime_lt?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermEndTime_lte?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermEndTime_not?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermEndTime_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  minimumDeposit?: InputMaybe<Scalars["BigInt"]["input"]>;
  minimumDeposit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  minimumDeposit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  minimumDeposit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  minimumDeposit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  minimumDeposit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  minimumDeposit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  minimumDeposit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksConfig_Filter>>>;
  queueWithdrawalRequiresAccess?: InputMaybe<Scalars["Boolean"]["input"]>;
  queueWithdrawalRequiresAccess_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  queueWithdrawalRequiresAccess_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  queueWithdrawalRequiresAccess_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  transferRequiresAccess?: InputMaybe<Scalars["Boolean"]["input"]>;
  transferRequiresAccess_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  transferRequiresAccess_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  transferRequiresAccess_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  transfersDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  transfersDisabled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  transfersDisabled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  transfersDisabled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnBorrow?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnBorrow_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnBorrow_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnBorrow_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnCloseMarket?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnCloseMarket_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnCloseMarket_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnCloseMarket_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnDeposit?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnDeposit_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnDeposit_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnDeposit_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnExecuteWithdrawal?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnExecuteWithdrawal_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnExecuteWithdrawal_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnExecuteWithdrawal_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnNukeFromOrbit?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnNukeFromOrbit_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnNukeFromOrbit_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnNukeFromOrbit_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnQueueWithdrawal?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnQueueWithdrawal_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnQueueWithdrawal_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnQueueWithdrawal_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnRepay?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnRepay_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnRepay_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnRepay_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnSetAnnualInterestAndReserveRatioBips?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnSetAnnualInterestAndReserveRatioBips_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnSetAnnualInterestAndReserveRatioBips_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnSetAnnualInterestAndReserveRatioBips_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnSetMaxTotalSupply?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnSetMaxTotalSupply_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnSetMaxTotalSupply_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnSetMaxTotalSupply_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnSetProtocolFeeBips?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnSetProtocolFeeBips_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnSetProtocolFeeBips_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnSetProtocolFeeBips_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnTransfer?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnTransfer_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  useOnTransfer_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  useOnTransfer_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

export enum SubgraphHooksConfig_OrderBy {
  AllowClosureBeforeTerm = "allowClosureBeforeTerm",
  AllowForceBuyBacks = "allowForceBuyBacks",
  AllowTermReduction = "allowTermReduction",
  DepositRequiresAccess = "depositRequiresAccess",
  FixedTermEndTime = "fixedTermEndTime",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  MinimumDeposit = "minimumDeposit",
  QueueWithdrawalRequiresAccess = "queueWithdrawalRequiresAccess",
  TransferRequiresAccess = "transferRequiresAccess",
  TransfersDisabled = "transfersDisabled",
  UseOnBorrow = "useOnBorrow",
  UseOnCloseMarket = "useOnCloseMarket",
  UseOnDeposit = "useOnDeposit",
  UseOnExecuteWithdrawal = "useOnExecuteWithdrawal",
  UseOnNukeFromOrbit = "useOnNukeFromOrbit",
  UseOnQueueWithdrawal = "useOnQueueWithdrawal",
  UseOnRepay = "useOnRepay",
  UseOnSetAnnualInterestAndReserveRatioBips = "useOnSetAnnualInterestAndReserveRatioBips",
  UseOnSetMaxTotalSupply = "useOnSetMaxTotalSupply",
  UseOnSetProtocolFeeBips = "useOnSetProtocolFeeBips",
  UseOnTransfer = "useOnTransfer"
}

export type SubgraphHooksFactory = {
  __typename: "HooksFactory";
  archController: SubgraphArchController;
  eventIndex: Scalars["Int"]["output"];
  hooksInstances: SubgraphHooksInstance[];
  hooksTemplates: SubgraphHooksTemplate[];
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  sentinel: Scalars["Bytes"]["output"];
};

export type SubgraphHooksFactoryHooksInstancesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksInstance_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphHooksInstance_Filter>;
};

export type SubgraphHooksFactoryHooksTemplatesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksTemplate_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphHooksTemplate_Filter>;
};

export type SubgraphHooksFactory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksFactory_Filter>>>;
  archController?: InputMaybe<Scalars["String"]["input"]>;
  archController_?: InputMaybe<SubgraphArchController_Filter>;
  archController_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_gt?: InputMaybe<Scalars["String"]["input"]>;
  archController_gte?: InputMaybe<Scalars["String"]["input"]>;
  archController_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_lt?: InputMaybe<Scalars["String"]["input"]>;
  archController_lte?: InputMaybe<Scalars["String"]["input"]>;
  archController_not?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooksInstances_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooksTemplates_?: InputMaybe<SubgraphHooksTemplate_Filter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isRegistered?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksFactory_Filter>>>;
  sentinel?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  sentinel_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphHooksFactory_OrderBy {
  ArchController = "archController",
  ArchControllerId = "archController__id",
  EventIndex = "eventIndex",
  HooksInstances = "hooksInstances",
  HooksTemplates = "hooksTemplates",
  Id = "id",
  IsRegistered = "isRegistered",
  Sentinel = "sentinel"
}

export type SubgraphHooksInstance = {
  __typename: "HooksInstance";
  accountAccessGrantedRecords: SubgraphAccountAccessGranted[];
  accountAccessRevokedRecords: SubgraphAccountAccessRevoked[];
  accountUnblockFromDepositsRecords: SubgraphAccountUnblockedFromDeposits[];
  borrower: Scalars["Bytes"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooksFactory: SubgraphHooksFactory;
  hooksTemplate: SubgraphHooksTemplate;
  id: Scalars["ID"]["output"];
  kind: SubgraphHooksKind;
  lenders: SubgraphLenderHooksAccess[];
  markets: SubgraphMarket[];
  name: Scalars["String"]["output"];
  nameUpdatedRecords: SubgraphHooksNameUpdated[];
  numMarkets: Scalars["Int"]["output"];
  providers: SubgraphRoleProvider[];
  roleProviderAddedRecords: SubgraphRoleProviderAdded[];
  roleProviderRemovedRecords: SubgraphRoleProviderRemoved[];
  roleProviderUpdatedRecords: SubgraphRoleProviderUpdated[];
};

export type SubgraphHooksInstanceAccountAccessGrantedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountAccessGranted_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphAccountAccessGranted_Filter>;
};

export type SubgraphHooksInstanceAccountAccessRevokedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountAccessRevoked_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphAccountAccessRevoked_Filter>;
};

export type SubgraphHooksInstanceAccountUnblockFromDepositsRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountUnblockedFromDeposits_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphAccountUnblockedFromDeposits_Filter>;
};

export type SubgraphHooksInstanceLendersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderHooksAccess_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
};

export type SubgraphHooksInstanceMarketsArgs = SubgraphArchControllerMarketsArgs;

export type SubgraphHooksInstanceNameUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksNameUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphHooksNameUpdated_Filter>;
};

export type SubgraphHooksInstanceProvidersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProvider_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphRoleProvider_Filter>;
};

export type SubgraphHooksInstanceRoleProviderAddedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProviderAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphRoleProviderAdded_Filter>;
};

export type SubgraphHooksInstanceRoleProviderRemovedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProviderRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphRoleProviderRemoved_Filter>;
};

export type SubgraphHooksInstanceRoleProviderUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProviderUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphRoleProviderUpdated_Filter>;
};

export type SubgraphHooksInstanceDeployed = {
  __typename: "HooksInstanceDeployed";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  hooksTemplate: SubgraphHooksTemplate;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphHooksInstanceDeployed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksInstanceDeployed_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_?: InputMaybe<SubgraphHooksTemplate_Filter>;
  hooksTemplate_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksInstanceDeployed_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphHooksInstanceDeployed_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Hooks = "hooks",
  HooksTemplate = "hooksTemplate",
  HooksTemplateDisabled = "hooksTemplate__disabled",
  HooksTemplateFeeRecipient = "hooksTemplate__feeRecipient",
  HooksTemplateId = "hooksTemplate__id",
  HooksTemplateName = "hooksTemplate__name",
  HooksTemplateOriginationFeeAmount = "hooksTemplate__originationFeeAmount",
  HooksTemplateProtocolFeeBips = "hooksTemplate__protocolFeeBips",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphHooksInstance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  accountAccessGrantedRecords_?: InputMaybe<SubgraphAccountAccessGranted_Filter>;
  accountAccessRevokedRecords_?: InputMaybe<SubgraphAccountAccessRevoked_Filter>;
  accountUnblockFromDepositsRecords_?: InputMaybe<SubgraphAccountUnblockedFromDeposits_Filter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksInstance_Filter>>>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooksFactory?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_?: InputMaybe<SubgraphHooksFactory_Filter>;
  hooksFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_?: InputMaybe<SubgraphHooksTemplate_Filter>;
  hooksTemplate_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  kind?: InputMaybe<SubgraphHooksKind>;
  kind_in?: InputMaybe<SubgraphHooksKind[]>;
  kind_not?: InputMaybe<SubgraphHooksKind>;
  kind_not_in?: InputMaybe<SubgraphHooksKind[]>;
  lenders_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  markets_?: InputMaybe<SubgraphMarket_Filter>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  nameUpdatedRecords_?: InputMaybe<SubgraphHooksNameUpdated_Filter>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_gt?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_gte?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  numMarkets_lt?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_lte?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_not?: InputMaybe<Scalars["Int"]["input"]>;
  numMarkets_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksInstance_Filter>>>;
  providers_?: InputMaybe<SubgraphRoleProvider_Filter>;
  roleProviderAddedRecords_?: InputMaybe<SubgraphRoleProviderAdded_Filter>;
  roleProviderRemovedRecords_?: InputMaybe<SubgraphRoleProviderRemoved_Filter>;
  roleProviderUpdatedRecords_?: InputMaybe<SubgraphRoleProviderUpdated_Filter>;
};

export enum SubgraphHooksInstance_OrderBy {
  AccountAccessGrantedRecords = "accountAccessGrantedRecords",
  AccountAccessRevokedRecords = "accountAccessRevokedRecords",
  AccountUnblockFromDepositsRecords = "accountUnblockFromDepositsRecords",
  Borrower = "borrower",
  EventIndex = "eventIndex",
  HooksFactory = "hooksFactory",
  HooksFactoryEventIndex = "hooksFactory__eventIndex",
  HooksFactoryId = "hooksFactory__id",
  HooksFactoryIsRegistered = "hooksFactory__isRegistered",
  HooksFactorySentinel = "hooksFactory__sentinel",
  HooksTemplate = "hooksTemplate",
  HooksTemplateDisabled = "hooksTemplate__disabled",
  HooksTemplateFeeRecipient = "hooksTemplate__feeRecipient",
  HooksTemplateId = "hooksTemplate__id",
  HooksTemplateName = "hooksTemplate__name",
  HooksTemplateOriginationFeeAmount = "hooksTemplate__originationFeeAmount",
  HooksTemplateProtocolFeeBips = "hooksTemplate__protocolFeeBips",
  Id = "id",
  Kind = "kind",
  Lenders = "lenders",
  Markets = "markets",
  Name = "name",
  NameUpdatedRecords = "nameUpdatedRecords",
  NumMarkets = "numMarkets",
  Providers = "providers",
  RoleProviderAddedRecords = "roleProviderAddedRecords",
  RoleProviderRemovedRecords = "roleProviderRemovedRecords",
  RoleProviderUpdatedRecords = "roleProviderUpdatedRecords"
}

export enum SubgraphHooksKind {
  FixedTerm = "FixedTerm",
  OpenTerm = "OpenTerm",
  Unknown = "Unknown"
}

export type SubgraphHooksNameUpdated = {
  __typename: "HooksNameUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  newName: Scalars["String"]["output"];
  oldName: Scalars["String"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphHooksNameUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksNameUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  newName?: InputMaybe<Scalars["String"]["input"]>;
  newName_contains?: InputMaybe<Scalars["String"]["input"]>;
  newName_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newName_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  newName_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newName_gt?: InputMaybe<Scalars["String"]["input"]>;
  newName_gte?: InputMaybe<Scalars["String"]["input"]>;
  newName_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  newName_lt?: InputMaybe<Scalars["String"]["input"]>;
  newName_lte?: InputMaybe<Scalars["String"]["input"]>;
  newName_not?: InputMaybe<Scalars["String"]["input"]>;
  newName_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  newName_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newName_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  newName_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newName_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  newName_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  newName_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newName_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  newName_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  oldName?: InputMaybe<Scalars["String"]["input"]>;
  oldName_contains?: InputMaybe<Scalars["String"]["input"]>;
  oldName_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  oldName_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  oldName_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  oldName_gt?: InputMaybe<Scalars["String"]["input"]>;
  oldName_gte?: InputMaybe<Scalars["String"]["input"]>;
  oldName_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  oldName_lt?: InputMaybe<Scalars["String"]["input"]>;
  oldName_lte?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  oldName_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  oldName_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  oldName_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  oldName_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksNameUpdated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphHooksNameUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  NewName = "newName",
  OldName = "oldName",
  TransactionHash = "transactionHash"
}

export type SubgraphHooksTemplate = {
  __typename: "HooksTemplate";
  deployedInstances: SubgraphHooksInstanceDeployed[];
  disabled: Scalars["Boolean"]["output"];
  feeRecipient: Scalars["Bytes"]["output"];
  hooksFactory: SubgraphHooksFactory;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset?: Maybe<SubgraphToken>;
  protocolFeeBips: Scalars["Int"]["output"];
};

export type SubgraphHooksTemplateDeployedInstancesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksInstanceDeployed_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphHooksInstanceDeployed_Filter>;
};

export type SubgraphHooksTemplateAdded = {
  __typename: "HooksTemplateAdded";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  feeRecipient: Scalars["Bytes"]["output"];
  hooksTemplate: SubgraphHooksTemplate;
  id: Scalars["ID"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset?: Maybe<SubgraphToken>;
  protocolFeeBips: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphHooksTemplateAdded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplateAdded_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feeRecipient?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feeRecipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  hooksTemplate?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_?: InputMaybe<SubgraphHooksTemplate_Filter>;
  hooksTemplate_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplateAdded_Filter>>>;
  originationFeeAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAsset?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_?: InputMaybe<SubgraphToken_Filter>;
  originationFeeAsset_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  protocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphHooksTemplateAdded_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  FeeRecipient = "feeRecipient",
  HooksTemplate = "hooksTemplate",
  HooksTemplateDisabled = "hooksTemplate__disabled",
  HooksTemplateFeeRecipient = "hooksTemplate__feeRecipient",
  HooksTemplateId = "hooksTemplate__id",
  HooksTemplateName = "hooksTemplate__name",
  HooksTemplateOriginationFeeAmount = "hooksTemplate__originationFeeAmount",
  HooksTemplateProtocolFeeBips = "hooksTemplate__protocolFeeBips",
  Id = "id",
  OriginationFeeAmount = "originationFeeAmount",
  OriginationFeeAsset = "originationFeeAsset",
  OriginationFeeAssetAddress = "originationFeeAsset__address",
  OriginationFeeAssetDecimals = "originationFeeAsset__decimals",
  OriginationFeeAssetId = "originationFeeAsset__id",
  OriginationFeeAssetIsMock = "originationFeeAsset__isMock",
  OriginationFeeAssetName = "originationFeeAsset__name",
  OriginationFeeAssetSymbol = "originationFeeAsset__symbol",
  ProtocolFeeBips = "protocolFeeBips",
  TransactionHash = "transactionHash"
}

export type SubgraphHooksTemplateDisabled = {
  __typename: "HooksTemplateDisabled";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  hooksTemplate: SubgraphHooksTemplate;
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphHooksTemplateDisabled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplateDisabled_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooksTemplate?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_?: InputMaybe<SubgraphHooksTemplate_Filter>;
  hooksTemplate_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplateDisabled_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphHooksTemplateDisabled_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  HooksTemplate = "hooksTemplate",
  HooksTemplateDisabled = "hooksTemplate__disabled",
  HooksTemplateFeeRecipient = "hooksTemplate__feeRecipient",
  HooksTemplateId = "hooksTemplate__id",
  HooksTemplateName = "hooksTemplate__name",
  HooksTemplateOriginationFeeAmount = "hooksTemplate__originationFeeAmount",
  HooksTemplateProtocolFeeBips = "hooksTemplate__protocolFeeBips",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphHooksTemplateFeesUpdated = {
  __typename: "HooksTemplateFeesUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  feeRecipient: Scalars["Bytes"]["output"];
  hooksTemplate: SubgraphHooksTemplate;
  id: Scalars["ID"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset?: Maybe<SubgraphToken>;
  protocolFeeBips: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphHooksTemplateFeesUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplateFeesUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feeRecipient?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feeRecipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  hooksTemplate?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_?: InputMaybe<SubgraphHooksTemplate_Filter>;
  hooksTemplate_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksTemplate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksTemplate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplateFeesUpdated_Filter>>>;
  originationFeeAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAsset?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_?: InputMaybe<SubgraphToken_Filter>;
  originationFeeAsset_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  protocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphHooksTemplateFeesUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  FeeRecipient = "feeRecipient",
  HooksTemplate = "hooksTemplate",
  HooksTemplateDisabled = "hooksTemplate__disabled",
  HooksTemplateFeeRecipient = "hooksTemplate__feeRecipient",
  HooksTemplateId = "hooksTemplate__id",
  HooksTemplateName = "hooksTemplate__name",
  HooksTemplateOriginationFeeAmount = "hooksTemplate__originationFeeAmount",
  HooksTemplateProtocolFeeBips = "hooksTemplate__protocolFeeBips",
  Id = "id",
  OriginationFeeAmount = "originationFeeAmount",
  OriginationFeeAsset = "originationFeeAsset",
  OriginationFeeAssetAddress = "originationFeeAsset__address",
  OriginationFeeAssetDecimals = "originationFeeAsset__decimals",
  OriginationFeeAssetId = "originationFeeAsset__id",
  OriginationFeeAssetIsMock = "originationFeeAsset__isMock",
  OriginationFeeAssetName = "originationFeeAsset__name",
  OriginationFeeAssetSymbol = "originationFeeAsset__symbol",
  ProtocolFeeBips = "protocolFeeBips",
  TransactionHash = "transactionHash"
}

export type SubgraphHooksTemplate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplate_Filter>>>;
  deployedInstances_?: InputMaybe<SubgraphHooksInstanceDeployed_Filter>;
  disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  disabled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  feeRecipient?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feeRecipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  hooksFactory?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_?: InputMaybe<SubgraphHooksFactory_Filter>;
  hooksFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphHooksTemplate_Filter>>>;
  originationFeeAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAsset?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_?: InputMaybe<SubgraphToken_Filter>;
  originationFeeAsset_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  protocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export enum SubgraphHooksTemplate_OrderBy {
  DeployedInstances = "deployedInstances",
  Disabled = "disabled",
  FeeRecipient = "feeRecipient",
  HooksFactory = "hooksFactory",
  HooksFactoryEventIndex = "hooksFactory__eventIndex",
  HooksFactoryId = "hooksFactory__id",
  HooksFactoryIsRegistered = "hooksFactory__isRegistered",
  HooksFactorySentinel = "hooksFactory__sentinel",
  Id = "id",
  Name = "name",
  OriginationFeeAmount = "originationFeeAmount",
  OriginationFeeAsset = "originationFeeAsset",
  OriginationFeeAssetAddress = "originationFeeAsset__address",
  OriginationFeeAssetDecimals = "originationFeeAsset__decimals",
  OriginationFeeAssetId = "originationFeeAsset__id",
  OriginationFeeAssetIsMock = "originationFeeAsset__isMock",
  OriginationFeeAssetName = "originationFeeAsset__name",
  OriginationFeeAssetSymbol = "originationFeeAsset__symbol",
  ProtocolFeeBips = "protocolFeeBips"
}

export type SubgraphKnownLenderStatus = {
  __typename: "KnownLenderStatus";
  hooksAccess: SubgraphLenderHooksAccess;
  id: Scalars["ID"]["output"];
  lenderAccount?: Maybe<SubgraphLenderAccount>;
  market: SubgraphMarket;
};

export type SubgraphKnownLenderStatus_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphKnownLenderStatus_Filter>>>;
  hooksAccess?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  hooksAccess_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksAccess_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksAccess_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lenderAccount?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_?: InputMaybe<SubgraphLenderAccount_Filter>;
  lenderAccount_contains?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_gt?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_gte?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lenderAccount_lt?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_lte?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lenderAccount_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lenderAccount_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphKnownLenderStatus_Filter>>>;
};

export enum SubgraphKnownLenderStatus_OrderBy {
  HooksAccess = "hooksAccess",
  HooksAccessAddedTimestamp = "hooksAccess__addedTimestamp",
  HooksAccessCanRefresh = "hooksAccess__canRefresh",
  HooksAccessId = "hooksAccess__id",
  HooksAccessIsBlockedFromDeposits = "hooksAccess__isBlockedFromDeposits",
  HooksAccessLastApprovalTimestamp = "hooksAccess__lastApprovalTimestamp",
  HooksAccessLender = "hooksAccess__lender",
  Id = "id",
  LenderAccount = "lenderAccount",
  LenderAccountAddedTimestamp = "lenderAccount__addedTimestamp",
  LenderAccountAddress = "lenderAccount__address",
  LenderAccountId = "lenderAccount__id",
  LenderAccountLastScaleFactor = "lenderAccount__lastScaleFactor",
  LenderAccountLastUpdatedTimestamp = "lenderAccount__lastUpdatedTimestamp",
  LenderAccountNumPendingWithdrawalBatches = "lenderAccount__numPendingWithdrawalBatches",
  LenderAccountRole = "lenderAccount__role",
  LenderAccountScaledBalance = "lenderAccount__scaledBalance",
  LenderAccountTotalDeposited = "lenderAccount__totalDeposited",
  LenderAccountTotalInterestEarned = "lenderAccount__totalInterestEarned",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex"
}

export type SubgraphLenderAccount = {
  __typename: "LenderAccount";
  addedTimestamp: Scalars["Int"]["output"];
  address: Scalars["Bytes"]["output"];
  controllerAuthorization?: Maybe<SubgraphLenderAuthorization>;
  deposits: SubgraphDeposit[];
  hooksAccess?: Maybe<SubgraphLenderHooksAccess>;
  id: Scalars["ID"]["output"];
  interestAccrualRecords: SubgraphLenderInterestAccrued[];
  knownLenderStatus?: Maybe<SubgraphKnownLenderStatus>;
  lastScaleFactor: Scalars["BigInt"]["output"];
  lastUpdatedTimestamp: Scalars["Int"]["output"];
  market: SubgraphMarket;
  numPendingWithdrawalBatches: Scalars["Int"]["output"];
  role: SubgraphLenderStatus;
  scaledBalance: Scalars["BigInt"]["output"];
  totalDeposited: Scalars["BigInt"]["output"];
  totalInterestEarned: Scalars["BigInt"]["output"];
  withdrawals: SubgraphLenderWithdrawalStatus[];
};

export type SubgraphLenderAccountDepositsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDeposit_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphDeposit_Filter>;
};

export type SubgraphLenderAccountInterestAccrualRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphLenderInterestAccrued_Filter>;
};

export type SubgraphLenderAccountWithdrawalsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderWithdrawalStatus_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
};

export type SubgraphLenderAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  addedTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  addedTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphLenderAccount_Filter>>>;
  controllerAuthorization?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_?: InputMaybe<SubgraphLenderAuthorization_Filter>;
  controllerAuthorization_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_gt?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_gte?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerAuthorization_lt?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_lte?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controllerAuthorization_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controllerAuthorization_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  deposits_?: InputMaybe<SubgraphDeposit_Filter>;
  hooksAccess?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  hooksAccess_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksAccess_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksAccess_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksAccess_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  interestAccrualRecords_?: InputMaybe<SubgraphLenderInterestAccrued_Filter>;
  knownLenderStatus_?: InputMaybe<SubgraphKnownLenderStatus_Filter>;
  lastScaleFactor?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastScaleFactor_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdatedTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lastUpdatedTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  numPendingWithdrawalBatches?: InputMaybe<Scalars["Int"]["input"]>;
  numPendingWithdrawalBatches_gt?: InputMaybe<Scalars["Int"]["input"]>;
  numPendingWithdrawalBatches_gte?: InputMaybe<Scalars["Int"]["input"]>;
  numPendingWithdrawalBatches_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  numPendingWithdrawalBatches_lt?: InputMaybe<Scalars["Int"]["input"]>;
  numPendingWithdrawalBatches_lte?: InputMaybe<Scalars["Int"]["input"]>;
  numPendingWithdrawalBatches_not?: InputMaybe<Scalars["Int"]["input"]>;
  numPendingWithdrawalBatches_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphLenderAccount_Filter>>>;
  role?: InputMaybe<SubgraphLenderStatus>;
  role_in?: InputMaybe<SubgraphLenderStatus[]>;
  role_not?: InputMaybe<SubgraphLenderStatus>;
  role_not_in?: InputMaybe<SubgraphLenderStatus[]>;
  scaledBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDeposited?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDeposited_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalInterestEarned?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalInterestEarned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  withdrawals_?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
};

export enum SubgraphLenderAccount_OrderBy {
  AddedTimestamp = "addedTimestamp",
  Address = "address",
  ControllerAuthorization = "controllerAuthorization",
  ControllerAuthorizationAddedTimestamp = "controllerAuthorization__addedTimestamp",
  ControllerAuthorizationAuthorized = "controllerAuthorization__authorized",
  ControllerAuthorizationId = "controllerAuthorization__id",
  ControllerAuthorizationLender = "controllerAuthorization__lender",
  Deposits = "deposits",
  HooksAccess = "hooksAccess",
  HooksAccessAddedTimestamp = "hooksAccess__addedTimestamp",
  HooksAccessCanRefresh = "hooksAccess__canRefresh",
  HooksAccessId = "hooksAccess__id",
  HooksAccessIsBlockedFromDeposits = "hooksAccess__isBlockedFromDeposits",
  HooksAccessLastApprovalTimestamp = "hooksAccess__lastApprovalTimestamp",
  HooksAccessLender = "hooksAccess__lender",
  Id = "id",
  InterestAccrualRecords = "interestAccrualRecords",
  KnownLenderStatus = "knownLenderStatus",
  KnownLenderStatusId = "knownLenderStatus__id",
  LastScaleFactor = "lastScaleFactor",
  LastUpdatedTimestamp = "lastUpdatedTimestamp",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NumPendingWithdrawalBatches = "numPendingWithdrawalBatches",
  Role = "role",
  ScaledBalance = "scaledBalance",
  TotalDeposited = "totalDeposited",
  TotalInterestEarned = "totalInterestEarned",
  Withdrawals = "withdrawals"
}

export type SubgraphLenderAuthorization = {
  __typename: "LenderAuthorization";
  addedTimestamp: Scalars["Int"]["output"];
  authorized: Scalars["Boolean"]["output"];
  changes: SubgraphLenderAuthorizationChange[];
  controller: SubgraphController;
  id: Scalars["ID"]["output"];
  lender: Scalars["Bytes"]["output"];
  marketAccounts: SubgraphLenderAccount[];
};

export type SubgraphLenderAuthorizationChangesArgs = SubgraphControllerAuthorizationChangesArgs;

export type SubgraphLenderAuthorizationMarketAccountsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAccount_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphLenderAccount_Filter>;
};

export type SubgraphLenderAuthorizationChange = {
  __typename: "LenderAuthorizationChange";
  authorization: SubgraphLenderAuthorization;
  authorized: Scalars["Boolean"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  controller: SubgraphController;
  id: Scalars["ID"]["output"];
  lender: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphLenderAuthorizationChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphLenderAuthorizationChange_Filter>>>;
  authorization?: InputMaybe<Scalars["String"]["input"]>;
  authorization_?: InputMaybe<SubgraphLenderAuthorization_Filter>;
  authorization_contains?: InputMaybe<Scalars["String"]["input"]>;
  authorization_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorization_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  authorization_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorization_gt?: InputMaybe<Scalars["String"]["input"]>;
  authorization_gte?: InputMaybe<Scalars["String"]["input"]>;
  authorization_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  authorization_lt?: InputMaybe<Scalars["String"]["input"]>;
  authorization_lte?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  authorization_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  authorization_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorization_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  authorization_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  authorized?: InputMaybe<Scalars["Boolean"]["input"]>;
  authorized_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  authorized_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  authorized_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  controller?: InputMaybe<Scalars["String"]["input"]>;
  controller_?: InputMaybe<SubgraphController_Filter>;
  controller_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_gt?: InputMaybe<Scalars["String"]["input"]>;
  controller_gte?: InputMaybe<Scalars["String"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["String"]["input"]>;
  controller_lte?: InputMaybe<Scalars["String"]["input"]>;
  controller_not?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lender?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lender_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphLenderAuthorizationChange_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphLenderAuthorizationChange_OrderBy {
  Authorization = "authorization",
  AuthorizationAddedTimestamp = "authorization__addedTimestamp",
  AuthorizationAuthorized = "authorization__authorized",
  AuthorizationId = "authorization__id",
  AuthorizationLender = "authorization__lender",
  Authorized = "authorized",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  ControllerNumMarkets = "controller__numMarkets",
  Id = "id",
  Lender = "lender",
  TransactionHash = "transactionHash"
}

export type SubgraphLenderAuthorization_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  addedTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  addedTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphLenderAuthorization_Filter>>>;
  authorized?: InputMaybe<Scalars["Boolean"]["input"]>;
  authorized_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  authorized_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  authorized_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  changes_?: InputMaybe<SubgraphLenderAuthorizationChange_Filter>;
  controller?: InputMaybe<Scalars["String"]["input"]>;
  controller_?: InputMaybe<SubgraphController_Filter>;
  controller_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_gt?: InputMaybe<Scalars["String"]["input"]>;
  controller_gte?: InputMaybe<Scalars["String"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["String"]["input"]>;
  controller_lte?: InputMaybe<Scalars["String"]["input"]>;
  controller_not?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lender?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lender_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  marketAccounts_?: InputMaybe<SubgraphLenderAccount_Filter>;
  or?: InputMaybe<Array<InputMaybe<SubgraphLenderAuthorization_Filter>>>;
};

export enum SubgraphLenderAuthorization_OrderBy {
  AddedTimestamp = "addedTimestamp",
  Authorized = "authorized",
  Changes = "changes",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  ControllerNumMarkets = "controller__numMarkets",
  Id = "id",
  Lender = "lender",
  MarketAccounts = "marketAccounts"
}

export type SubgraphLenderHooksAccess = {
  __typename: "LenderHooksAccess";
  accountAccessGrantedRecords: SubgraphAccountAccessGranted[];
  accountAccessRevokedRecords: SubgraphAccountAccessRevoked[];
  accountBlockedFromDepositsRecords: SubgraphAccountBlockedFromDeposits[];
  accountUnblockedFromDepositsRecords: SubgraphAccountUnblockedFromDeposits[];
  addedTimestamp: Scalars["Int"]["output"];
  canRefresh: Scalars["Boolean"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  isBlockedFromDeposits: Scalars["Boolean"]["output"];
  knownLenderStatuses: SubgraphKnownLenderStatus[];
  lastApprovalTimestamp: Scalars["Int"]["output"];
  lastProvider?: Maybe<SubgraphRoleProvider>;
  lender: Scalars["Bytes"]["output"];
  marketAccounts: SubgraphLenderAccount[];
};

export type SubgraphLenderHooksAccessAccountAccessGrantedRecordsArgs =
  SubgraphHooksInstanceAccountAccessGrantedRecordsArgs;

export type SubgraphLenderHooksAccessAccountAccessRevokedRecordsArgs =
  SubgraphHooksInstanceAccountAccessRevokedRecordsArgs;

export type SubgraphLenderHooksAccessAccountBlockedFromDepositsRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountBlockedFromDeposits_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphAccountBlockedFromDeposits_Filter>;
};

export type SubgraphLenderHooksAccessAccountUnblockedFromDepositsRecordsArgs =
  SubgraphHooksInstanceAccountUnblockFromDepositsRecordsArgs;

export type SubgraphLenderHooksAccessKnownLenderStatusesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphKnownLenderStatus_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphKnownLenderStatus_Filter>;
};

export type SubgraphLenderHooksAccessMarketAccountsArgs =
  SubgraphLenderAuthorizationMarketAccountsArgs;

export type SubgraphLenderHooksAccess_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  accountAccessGrantedRecords_?: InputMaybe<SubgraphAccountAccessGranted_Filter>;
  accountAccessRevokedRecords_?: InputMaybe<SubgraphAccountAccessRevoked_Filter>;
  accountBlockedFromDepositsRecords_?: InputMaybe<SubgraphAccountBlockedFromDeposits_Filter>;
  accountUnblockedFromDepositsRecords_?: InputMaybe<SubgraphAccountUnblockedFromDeposits_Filter>;
  addedTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  addedTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  addedTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphLenderHooksAccess_Filter>>>;
  canRefresh?: InputMaybe<Scalars["Boolean"]["input"]>;
  canRefresh_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  canRefresh_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  canRefresh_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isBlockedFromDeposits?: InputMaybe<Scalars["Boolean"]["input"]>;
  isBlockedFromDeposits_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isBlockedFromDeposits_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isBlockedFromDeposits_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  knownLenderStatuses_?: InputMaybe<SubgraphKnownLenderStatus_Filter>;
  lastApprovalTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  lastApprovalTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lastApprovalTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lastApprovalTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lastApprovalTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lastApprovalTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lastApprovalTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  lastApprovalTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lastProvider?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_?: InputMaybe<SubgraphRoleProvider_Filter>;
  lastProvider_contains?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_gt?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_gte?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lastProvider_lt?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_lte?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lastProvider_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lastProvider_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lender?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lender_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lender_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  marketAccounts_?: InputMaybe<SubgraphLenderAccount_Filter>;
  or?: InputMaybe<Array<InputMaybe<SubgraphLenderHooksAccess_Filter>>>;
};

export enum SubgraphLenderHooksAccess_OrderBy {
  AccountAccessGrantedRecords = "accountAccessGrantedRecords",
  AccountAccessRevokedRecords = "accountAccessRevokedRecords",
  AccountBlockedFromDepositsRecords = "accountBlockedFromDepositsRecords",
  AccountUnblockedFromDepositsRecords = "accountUnblockedFromDepositsRecords",
  AddedTimestamp = "addedTimestamp",
  CanRefresh = "canRefresh",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  IsBlockedFromDeposits = "isBlockedFromDeposits",
  KnownLenderStatuses = "knownLenderStatuses",
  LastApprovalTimestamp = "lastApprovalTimestamp",
  LastProvider = "lastProvider",
  LastProviderId = "lastProvider__id",
  LastProviderIsApproved = "lastProvider__isApproved",
  LastProviderIsPullProvider = "lastProvider__isPullProvider",
  LastProviderIsPushProvider = "lastProvider__isPushProvider",
  LastProviderProviderAddress = "lastProvider__providerAddress",
  LastProviderPullProviderIndex = "lastProvider__pullProviderIndex",
  LastProviderPushProviderIndex = "lastProvider__pushProviderIndex",
  LastProviderTimeToLive = "lastProvider__timeToLive",
  Lender = "lender",
  MarketAccounts = "marketAccounts"
}

export type SubgraphLenderInterestAccrued = {
  __typename: "LenderInterestAccrued";
  account: SubgraphLenderAccount;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  interestEarned: Scalars["BigInt"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphLenderInterestAccrued_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderAccount_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphLenderInterestAccrued_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  interestEarned?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  interestEarned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphLenderInterestAccrued_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphLenderInterestAccrued_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountAddress = "account__address",
  AccountId = "account__id",
  AccountLastScaleFactor = "account__lastScaleFactor",
  AccountLastUpdatedTimestamp = "account__lastUpdatedTimestamp",
  AccountNumPendingWithdrawalBatches = "account__numPendingWithdrawalBatches",
  AccountRole = "account__role",
  AccountScaledBalance = "account__scaledBalance",
  AccountTotalDeposited = "account__totalDeposited",
  AccountTotalInterestEarned = "account__totalInterestEarned",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  InterestEarned = "interestEarned",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export enum SubgraphLenderStatus {
  Blocked = "Blocked",
  DepositAndWithdraw = "DepositAndWithdraw",
  Null = "Null",
  WithdrawOnly = "WithdrawOnly"
}

export type SubgraphLenderWithdrawalStatus = {
  __typename: "LenderWithdrawalStatus";
  account: SubgraphLenderAccount;
  batch: SubgraphWithdrawalBatch;
  executions: SubgraphWithdrawalExecution[];
  executionsCount: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  isCompleted: Scalars["Boolean"]["output"];
  normalizedAmountWithdrawn: Scalars["BigInt"]["output"];
  requests: SubgraphWithdrawalRequest[];
  requestsCount: Scalars["Int"]["output"];
  scaledAmount: Scalars["BigInt"]["output"];
  totalNormalizedRequests: Scalars["BigInt"]["output"];
};

export type SubgraphLenderWithdrawalStatusExecutionsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalExecution_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphWithdrawalExecution_Filter>;
};

export type SubgraphLenderWithdrawalStatusRequestsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphWithdrawalRequest_Filter>;
};

export type SubgraphLenderWithdrawalStatus_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderAccount_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphLenderWithdrawalStatus_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionsCount?: InputMaybe<Scalars["Int"]["input"]>;
  executionsCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  executionsCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  executionsCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  executionsCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  executionsCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  executionsCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  executionsCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  executions_?: InputMaybe<SubgraphWithdrawalExecution_Filter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isCompleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  isCompleted_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isCompleted_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isCompleted_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  normalizedAmountWithdrawn?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountWithdrawn_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountWithdrawn_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountWithdrawn_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountWithdrawn_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountWithdrawn_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountWithdrawn_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountWithdrawn_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphLenderWithdrawalStatus_Filter>>>;
  requestsCount?: InputMaybe<Scalars["Int"]["input"]>;
  requestsCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  requestsCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  requestsCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  requestsCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  requestsCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  requestsCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  requestsCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  requests_?: InputMaybe<SubgraphWithdrawalRequest_Filter>;
  scaledAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalNormalizedRequests?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalNormalizedRequests_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum SubgraphLenderWithdrawalStatus_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountAddress = "account__address",
  AccountId = "account__id",
  AccountLastScaleFactor = "account__lastScaleFactor",
  AccountLastUpdatedTimestamp = "account__lastUpdatedTimestamp",
  AccountNumPendingWithdrawalBatches = "account__numPendingWithdrawalBatches",
  AccountRole = "account__role",
  AccountScaledBalance = "account__scaledBalance",
  AccountTotalDeposited = "account__totalDeposited",
  AccountTotalInterestEarned = "account__totalInterestEarned",
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  Executions = "executions",
  ExecutionsCount = "executionsCount",
  Id = "id",
  IsCompleted = "isCompleted",
  NormalizedAmountWithdrawn = "normalizedAmountWithdrawn",
  Requests = "requests",
  RequestsCount = "requestsCount",
  ScaledAmount = "scaledAmount",
  TotalNormalizedRequests = "totalNormalizedRequests"
}

export type SubgraphMarket = {
  __typename: "Market";
  accountMadeFirstDepositRecords: SubgraphAccountMadeFirstDeposit[];
  annualInterestBips: Scalars["Int"]["output"];
  annualInterestBipsUpdatedIndex: Scalars["Int"]["output"];
  annualInterestBipsUpdatedRecords: SubgraphAnnualInterestBipsUpdated[];
  archController: SubgraphArchController;
  asset: SubgraphToken;
  borrowIndex: Scalars["Int"]["output"];
  borrowRecords: SubgraphBorrow[];
  borrower: Scalars["Bytes"]["output"];
  controller?: Maybe<SubgraphController>;
  createdAt: Scalars["Int"]["output"];
  debtRepaidIndex: Scalars["Int"]["output"];
  decimals: Scalars["Int"]["output"];
  delinquencyFeeBips: Scalars["Int"]["output"];
  delinquencyGracePeriod: Scalars["Int"]["output"];
  delinquencyRecords: SubgraphDelinquencyStatusChanged[];
  delinquencyStatusChangedIndex: Scalars["Int"]["output"];
  deployedEvent: SubgraphMarketDeployed;
  depositIndex: Scalars["Int"]["output"];
  depositRecords: SubgraphDeposit[];
  eventIndex: Scalars["Int"]["output"];
  feeCollectionRecords: SubgraphFeesCollected[];
  feeRecipient: Scalars["Bytes"]["output"];
  feesCollectedIndex: Scalars["Int"]["output"];
  fixedTermUpdatedIndex: Scalars["Int"]["output"];
  fixedTermUpdatedRecords: SubgraphFixedTermUpdated[];
  forceBuyBackDisabledRecord?: Maybe<SubgraphDisabledForceBuyBacks>;
  forceBuyBackIndex: Scalars["Int"]["output"];
  forceBuyBackRecords: SubgraphForceBuyBack[];
  hooks?: Maybe<SubgraphHooksInstance>;
  hooksConfig?: Maybe<SubgraphHooksConfig>;
  hooksFactory?: Maybe<SubgraphHooksFactory>;
  id: Scalars["ID"]["output"];
  interestAccrualRecords: SubgraphMarketInterestAccrued[];
  isClosed: Scalars["Boolean"]["output"];
  isDelinquent: Scalars["Boolean"]["output"];
  isIncurringPenalties: Scalars["Boolean"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  lastInterestAccruedTimestamp: Scalars["Int"]["output"];
  lenders: SubgraphLenderAccount[];
  marketClosedEvent?: Maybe<SubgraphMarketClosed>;
  maxTotalSupply: Scalars["BigInt"]["output"];
  maxTotalSupplyUpdatedIndex: Scalars["Int"]["output"];
  maxTotalSupplyUpdatedRecords: SubgraphMaxTotalSupplyUpdated[];
  minimumDepositUpdateRecords: SubgraphMinimumDepositUpdated[];
  minimumDepositUpdatedIndex: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  normalizedUnclaimedWithdrawals: Scalars["BigInt"]["output"];
  originalAnnualInterestBips: Scalars["Int"]["output"];
  originalReserveRatioBips: Scalars["Int"]["output"];
  pendingProtocolFees: Scalars["BigInt"]["output"];
  pendingWithdrawalExpiry: Scalars["BigInt"]["output"];
  protocolFeeBips: Scalars["Int"]["output"];
  protocolFeeBipsUpdatedIndex: Scalars["Int"]["output"];
  protocolFeeBipsUpdatedRecords: SubgraphProtocolFeeBipsUpdated[];
  removal?: Maybe<SubgraphMarketRemoved>;
  repaymentRecords: SubgraphDebtRepaid[];
  reserveRatioBips: Scalars["Int"]["output"];
  reserveRatioBipsUpdatedRecords: SubgraphReserveRatioBipsUpdated[];
  scaleFactor: Scalars["BigInt"]["output"];
  scaledPendingWithdrawals: Scalars["BigInt"]["output"];
  scaledTotalSupply: Scalars["BigInt"]["output"];
  sentinel: Scalars["Bytes"]["output"];
  symbol: Scalars["String"]["output"];
  temporaryReserveRatioActive: Scalars["Boolean"]["output"];
  temporaryReserveRatioExpiry: Scalars["Int"]["output"];
  timeDelinquent: Scalars["Int"]["output"];
  totalBaseInterestAccrued: Scalars["BigInt"]["output"];
  totalBorrowed: Scalars["BigInt"]["output"];
  totalDelinquencyFeesAccrued: Scalars["BigInt"]["output"];
  totalDeposited: Scalars["BigInt"]["output"];
  totalProtocolFeesAccrued: Scalars["BigInt"]["output"];
  totalRepaid: Scalars["BigInt"]["output"];
  version: SubgraphMarketVersion;
  withdrawalBatchDuration: Scalars["Int"]["output"];
  withdrawalBatches: SubgraphWithdrawalBatch[];
  withdrawalRequestRecords: SubgraphWithdrawalRequest[];
  withdrawalRequestsIndex: Scalars["Int"]["output"];
};

export type SubgraphMarketAccountMadeFirstDepositRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountMadeFirstDeposit_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphAccountMadeFirstDeposit_Filter>;
};

export type SubgraphMarketAnnualInterestBipsUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAnnualInterestBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphAnnualInterestBipsUpdated_Filter>;
};

export type SubgraphMarketBorrowRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphBorrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphBorrow_Filter>;
};

export type SubgraphMarketDelinquencyRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDelinquencyStatusChanged_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphDelinquencyStatusChanged_Filter>;
};

export type SubgraphMarketDepositRecordsArgs = SubgraphLenderAccountDepositsArgs;

export type SubgraphMarketFeeCollectionRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphFeesCollected_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphFeesCollected_Filter>;
};

export type SubgraphMarketFixedTermUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphFixedTermUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphFixedTermUpdated_Filter>;
};

export type SubgraphMarketForceBuyBackRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphForceBuyBack_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphForceBuyBack_Filter>;
};

export type SubgraphMarketInterestAccrualRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphMarketInterestAccrued_Filter>;
};

export type SubgraphMarketLendersArgs = SubgraphLenderAuthorizationMarketAccountsArgs;

export type SubgraphMarketMaxTotalSupplyUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMaxTotalSupplyUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>;
};

export type SubgraphMarketMinimumDepositUpdateRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMinimumDepositUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphMinimumDepositUpdated_Filter>;
};

export type SubgraphMarketProtocolFeeBipsUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphProtocolFeeBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphProtocolFeeBipsUpdated_Filter>;
};

export type SubgraphMarketRepaymentRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphDebtRepaid_Filter>;
};

export type SubgraphMarketReserveRatioBipsUpdatedRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphReserveRatioBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphReserveRatioBipsUpdated_Filter>;
};

export type SubgraphMarketWithdrawalBatchesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatch_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
};

export type SubgraphMarketWithdrawalRequestRecordsArgs = SubgraphLenderWithdrawalStatusRequestsArgs;

export type SubgraphMarketAdded = {
  __typename: "MarketAdded";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  controller: SubgraphController;
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMarketAdded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarketAdded_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  controller?: InputMaybe<Scalars["String"]["input"]>;
  controller_?: InputMaybe<SubgraphController_Filter>;
  controller_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_gt?: InputMaybe<Scalars["String"]["input"]>;
  controller_gte?: InputMaybe<Scalars["String"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["String"]["input"]>;
  controller_lte?: InputMaybe<Scalars["String"]["input"]>;
  controller_not?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMarketAdded_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMarketAdded_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  ControllerNumMarkets = "controller__numMarkets",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketClosed = {
  __typename: "MarketClosed";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  timestamp: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMarketClosed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarketClosed_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMarketClosed_Filter>>>;
  timestamp?: InputMaybe<Scalars["Int"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMarketClosed_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  Timestamp = "timestamp",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketDeployed = {
  __typename: "MarketDeployed";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMarketDeployed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarketDeployed_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMarketDeployed_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMarketDeployed_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketInterestAccrued = {
  __typename: "MarketInterestAccrued";
  baseInterestAccrued: Scalars["BigInt"]["output"];
  baseInterestRay: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  delinquencyFeeRay: Scalars["BigInt"]["output"];
  delinquencyFeesAccrued: Scalars["BigInt"]["output"];
  fromTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  protocolFeesAccrued: Scalars["BigInt"]["output"];
  timeWithPenalties: Scalars["Int"]["output"];
  toTimestamp: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMarketInterestAccrued_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarketInterestAccrued_Filter>>>;
  baseInterestAccrued?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestAccrued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestAccrued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestAccrued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  baseInterestAccrued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestAccrued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestAccrued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestAccrued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  baseInterestRay?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestRay_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestRay_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestRay_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  baseInterestRay_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestRay_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestRay_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  baseInterestRay_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyFeeRay?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeeRay_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeeRay_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeeRay_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delinquencyFeeRay_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeeRay_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeeRay_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeeRay_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delinquencyFeesAccrued?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeesAccrued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeesAccrued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeesAccrued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delinquencyFeesAccrued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeesAccrued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeesAccrued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  delinquencyFeesAccrued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  fromTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  fromTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  fromTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  fromTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fromTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  fromTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  fromTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  fromTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMarketInterestAccrued_Filter>>>;
  protocolFeesAccrued?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolFeesAccrued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolFeesAccrued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolFeesAccrued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  protocolFeesAccrued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolFeesAccrued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolFeesAccrued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolFeesAccrued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timeWithPenalties?: InputMaybe<Scalars["Int"]["input"]>;
  timeWithPenalties_gt?: InputMaybe<Scalars["Int"]["input"]>;
  timeWithPenalties_gte?: InputMaybe<Scalars["Int"]["input"]>;
  timeWithPenalties_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeWithPenalties_lt?: InputMaybe<Scalars["Int"]["input"]>;
  timeWithPenalties_lte?: InputMaybe<Scalars["Int"]["input"]>;
  timeWithPenalties_not?: InputMaybe<Scalars["Int"]["input"]>;
  timeWithPenalties_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  toTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  toTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  toTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  toTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  toTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  toTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  toTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  toTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMarketInterestAccrued_OrderBy {
  BaseInterestAccrued = "baseInterestAccrued",
  BaseInterestRay = "baseInterestRay",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  DelinquencyFeeRay = "delinquencyFeeRay",
  DelinquencyFeesAccrued = "delinquencyFeesAccrued",
  FromTimestamp = "fromTimestamp",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  ProtocolFeesAccrued = "protocolFeesAccrued",
  TimeWithPenalties = "timeWithPenalties",
  ToTimestamp = "toTimestamp",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketRemoved = {
  __typename: "MarketRemoved";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMarketRemoved_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarketRemoved_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMarketRemoved_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMarketRemoved_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export enum SubgraphMarketVersion {
  V1 = "V1",
  V2 = "V2"
}

export type SubgraphMarket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  accountMadeFirstDepositRecords_?: InputMaybe<SubgraphAccountMadeFirstDeposit_Filter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarket_Filter>>>;
  annualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  annualInterestBipsUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBipsUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  annualInterestBipsUpdatedRecords_?: InputMaybe<SubgraphAnnualInterestBipsUpdated_Filter>;
  annualInterestBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  annualInterestBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  annualInterestBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  archController?: InputMaybe<Scalars["String"]["input"]>;
  archController_?: InputMaybe<SubgraphArchController_Filter>;
  archController_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_gt?: InputMaybe<Scalars["String"]["input"]>;
  archController_gte?: InputMaybe<Scalars["String"]["input"]>;
  archController_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_lt?: InputMaybe<Scalars["String"]["input"]>;
  archController_lte?: InputMaybe<Scalars["String"]["input"]>;
  archController_not?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  asset?: InputMaybe<Scalars["String"]["input"]>;
  asset_?: InputMaybe<SubgraphToken_Filter>;
  asset_contains?: InputMaybe<Scalars["String"]["input"]>;
  asset_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  asset_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  asset_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  asset_gt?: InputMaybe<Scalars["String"]["input"]>;
  asset_gte?: InputMaybe<Scalars["String"]["input"]>;
  asset_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  asset_lt?: InputMaybe<Scalars["String"]["input"]>;
  asset_lte?: InputMaybe<Scalars["String"]["input"]>;
  asset_not?: InputMaybe<Scalars["String"]["input"]>;
  asset_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  asset_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  asset_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  asset_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  asset_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  asset_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  asset_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  borrowIndex?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrowIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  borrowIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrowRecords_?: InputMaybe<SubgraphBorrow_Filter>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  controller?: InputMaybe<Scalars["String"]["input"]>;
  controller_?: InputMaybe<SubgraphController_Filter>;
  controller_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_gt?: InputMaybe<Scalars["String"]["input"]>;
  controller_gte?: InputMaybe<Scalars["String"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["String"]["input"]>;
  controller_lte?: InputMaybe<Scalars["String"]["input"]>;
  controller_not?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  controller_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_gt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_gte?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  createdAt_lt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_lte?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_not?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  debtRepaidIndex?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  debtRepaidIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  debtRepaidIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  decimals?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  decimals_lt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_lte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyGracePeriod?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyGracePeriod_gt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyGracePeriod_gte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyGracePeriod_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyGracePeriod_lt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyGracePeriod_lte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyGracePeriod_not?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyGracePeriod_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyRecords_?: InputMaybe<SubgraphDelinquencyStatusChanged_Filter>;
  delinquencyStatusChangedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delinquencyStatusChangedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyStatusChangedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  deployedEvent?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_?: InputMaybe<SubgraphMarketDeployed_Filter>;
  deployedEvent_contains?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_gt?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_gte?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  deployedEvent_lt?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_lte?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  deployedEvent_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  deployedEvent_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  depositIndex?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  depositIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  depositIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  depositRecords_?: InputMaybe<SubgraphDeposit_Filter>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feeCollectionRecords_?: InputMaybe<SubgraphFeesCollected_Filter>;
  feeRecipient?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feeRecipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feesCollectedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feesCollectedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  feesCollectedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fixedTermUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fixedTermUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  fixedTermUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fixedTermUpdatedRecords_?: InputMaybe<SubgraphFixedTermUpdated_Filter>;
  forceBuyBackDisabledRecord_?: InputMaybe<SubgraphDisabledForceBuyBacks_Filter>;
  forceBuyBackIndex?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  forceBuyBackIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  forceBuyBackIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  forceBuyBackRecords_?: InputMaybe<SubgraphForceBuyBack_Filter>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooksConfig_?: InputMaybe<SubgraphHooksConfig_Filter>;
  hooksFactory?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_?: InputMaybe<SubgraphHooksFactory_Filter>;
  hooksFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooksFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooksFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  interestAccrualRecords_?: InputMaybe<SubgraphMarketInterestAccrued_Filter>;
  isClosed?: InputMaybe<Scalars["Boolean"]["input"]>;
  isClosed_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isClosed_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isClosed_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isDelinquent?: InputMaybe<Scalars["Boolean"]["input"]>;
  isDelinquent_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isDelinquent_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isDelinquent_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isIncurringPenalties?: InputMaybe<Scalars["Boolean"]["input"]>;
  isIncurringPenalties_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isIncurringPenalties_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isIncurringPenalties_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  lastInterestAccruedTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  lastInterestAccruedTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lastInterestAccruedTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lastInterestAccruedTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lastInterestAccruedTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lastInterestAccruedTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lastInterestAccruedTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  lastInterestAccruedTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lenders_?: InputMaybe<SubgraphLenderAccount_Filter>;
  marketClosedEvent_?: InputMaybe<SubgraphMarketClosed_Filter>;
  maxTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupplyUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maxTotalSupplyUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maxTotalSupplyUpdatedRecords_?: InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>;
  maxTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  maxTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  minimumDepositUpdateRecords_?: InputMaybe<SubgraphMinimumDepositUpdated_Filter>;
  minimumDepositUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumDepositUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  normalizedUnclaimedWithdrawals?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedUnclaimedWithdrawals_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedUnclaimedWithdrawals_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedUnclaimedWithdrawals_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedUnclaimedWithdrawals_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedUnclaimedWithdrawals_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedUnclaimedWithdrawals_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedUnclaimedWithdrawals_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMarket_Filter>>>;
  originalAnnualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
  originalAnnualInterestBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  originalAnnualInterestBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  originalAnnualInterestBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  originalAnnualInterestBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  originalAnnualInterestBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  originalAnnualInterestBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  originalAnnualInterestBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  originalReserveRatioBips?: InputMaybe<Scalars["Int"]["input"]>;
  originalReserveRatioBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  originalReserveRatioBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  originalReserveRatioBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  originalReserveRatioBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  originalReserveRatioBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  originalReserveRatioBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  originalReserveRatioBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pendingProtocolFees?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingProtocolFees_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingProtocolFees_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingProtocolFees_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  pendingProtocolFees_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingProtocolFees_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingProtocolFees_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingProtocolFees_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  pendingWithdrawalExpiry?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingWithdrawalExpiry_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingWithdrawalExpiry_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingWithdrawalExpiry_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  pendingWithdrawalExpiry_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingWithdrawalExpiry_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingWithdrawalExpiry_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  pendingWithdrawalExpiry_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  protocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBipsUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBipsUpdatedRecords_?: InputMaybe<SubgraphProtocolFeeBipsUpdated_Filter>;
  protocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  removal_?: InputMaybe<SubgraphMarketRemoved_Filter>;
  repaymentRecords_?: InputMaybe<SubgraphDebtRepaid_Filter>;
  reserveRatioBips?: InputMaybe<Scalars["Int"]["input"]>;
  reserveRatioBipsUpdatedRecords_?: InputMaybe<SubgraphReserveRatioBipsUpdated_Filter>;
  reserveRatioBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  reserveRatioBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  reserveRatioBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  reserveRatioBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  reserveRatioBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  reserveRatioBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  reserveRatioBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  scaleFactor?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaleFactor_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaleFactor_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaleFactor_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaleFactor_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaleFactor_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaleFactor_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaleFactor_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledPendingWithdrawals?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledPendingWithdrawals_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledPendingWithdrawals_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledPendingWithdrawals_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledPendingWithdrawals_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledPendingWithdrawals_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledPendingWithdrawals_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledPendingWithdrawals_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sentinel?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  sentinel_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  sentinel_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  symbol?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_lte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  temporaryReserveRatioActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  temporaryReserveRatioActive_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  temporaryReserveRatioActive_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  temporaryReserveRatioActive_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  temporaryReserveRatioExpiry?: InputMaybe<Scalars["Int"]["input"]>;
  temporaryReserveRatioExpiry_gt?: InputMaybe<Scalars["Int"]["input"]>;
  temporaryReserveRatioExpiry_gte?: InputMaybe<Scalars["Int"]["input"]>;
  temporaryReserveRatioExpiry_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  temporaryReserveRatioExpiry_lt?: InputMaybe<Scalars["Int"]["input"]>;
  temporaryReserveRatioExpiry_lte?: InputMaybe<Scalars["Int"]["input"]>;
  temporaryReserveRatioExpiry_not?: InputMaybe<Scalars["Int"]["input"]>;
  temporaryReserveRatioExpiry_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeDelinquent?: InputMaybe<Scalars["Int"]["input"]>;
  timeDelinquent_gt?: InputMaybe<Scalars["Int"]["input"]>;
  timeDelinquent_gte?: InputMaybe<Scalars["Int"]["input"]>;
  timeDelinquent_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeDelinquent_lt?: InputMaybe<Scalars["Int"]["input"]>;
  timeDelinquent_lte?: InputMaybe<Scalars["Int"]["input"]>;
  timeDelinquent_not?: InputMaybe<Scalars["Int"]["input"]>;
  timeDelinquent_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  totalBaseInterestAccrued?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBaseInterestAccrued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBaseInterestAccrued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBaseInterestAccrued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBaseInterestAccrued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBaseInterestAccrued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBaseInterestAccrued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBaseInterestAccrued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBorrowed?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBorrowed_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBorrowed_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBorrowed_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBorrowed_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBorrowed_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBorrowed_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBorrowed_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelinquencyFeesAccrued?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelinquencyFeesAccrued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelinquencyFeesAccrued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelinquencyFeesAccrued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelinquencyFeesAccrued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelinquencyFeesAccrued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelinquencyFeesAccrued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelinquencyFeesAccrued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDeposited?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDeposited_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDeposited_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalProtocolFeesAccrued?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalProtocolFeesAccrued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalProtocolFeesAccrued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalProtocolFeesAccrued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalProtocolFeesAccrued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalProtocolFeesAccrued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalProtocolFeesAccrued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalProtocolFeesAccrued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalRepaid?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRepaid_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRepaid_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRepaid_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalRepaid_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRepaid_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRepaid_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRepaid_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  version?: InputMaybe<SubgraphMarketVersion>;
  version_in?: InputMaybe<SubgraphMarketVersion[]>;
  version_not?: InputMaybe<SubgraphMarketVersion>;
  version_not_in?: InputMaybe<SubgraphMarketVersion[]>;
  withdrawalBatchDuration?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_gt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_gte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalBatchDuration_lt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_lte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_not?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalBatches_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  withdrawalRequestRecords_?: InputMaybe<SubgraphWithdrawalRequest_Filter>;
  withdrawalRequestsIndex?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalRequestsIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export enum SubgraphMarket_OrderBy {
  AccountMadeFirstDepositRecords = "accountMadeFirstDepositRecords",
  AnnualInterestBips = "annualInterestBips",
  AnnualInterestBipsUpdatedIndex = "annualInterestBipsUpdatedIndex",
  AnnualInterestBipsUpdatedRecords = "annualInterestBipsUpdatedRecords",
  ArchController = "archController",
  ArchControllerId = "archController__id",
  Asset = "asset",
  AssetAddress = "asset__address",
  AssetDecimals = "asset__decimals",
  AssetId = "asset__id",
  AssetIsMock = "asset__isMock",
  AssetName = "asset__name",
  AssetSymbol = "asset__symbol",
  BorrowIndex = "borrowIndex",
  BorrowRecords = "borrowRecords",
  Borrower = "borrower",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  ControllerNumMarkets = "controller__numMarkets",
  CreatedAt = "createdAt",
  DebtRepaidIndex = "debtRepaidIndex",
  Decimals = "decimals",
  DelinquencyFeeBips = "delinquencyFeeBips",
  DelinquencyGracePeriod = "delinquencyGracePeriod",
  DelinquencyRecords = "delinquencyRecords",
  DelinquencyStatusChangedIndex = "delinquencyStatusChangedIndex",
  DeployedEvent = "deployedEvent",
  DeployedEventBlockNumber = "deployedEvent__blockNumber",
  DeployedEventBlockTimestamp = "deployedEvent__blockTimestamp",
  DeployedEventId = "deployedEvent__id",
  DeployedEventTransactionHash = "deployedEvent__transactionHash",
  DepositIndex = "depositIndex",
  DepositRecords = "depositRecords",
  EventIndex = "eventIndex",
  FeeCollectionRecords = "feeCollectionRecords",
  FeeRecipient = "feeRecipient",
  FeesCollectedIndex = "feesCollectedIndex",
  FixedTermUpdatedIndex = "fixedTermUpdatedIndex",
  FixedTermUpdatedRecords = "fixedTermUpdatedRecords",
  ForceBuyBackDisabledRecord = "forceBuyBackDisabledRecord",
  ForceBuyBackDisabledRecordBlockNumber = "forceBuyBackDisabledRecord__blockNumber",
  ForceBuyBackDisabledRecordBlockTimestamp = "forceBuyBackDisabledRecord__blockTimestamp",
  ForceBuyBackDisabledRecordEventIndex = "forceBuyBackDisabledRecord__eventIndex",
  ForceBuyBackDisabledRecordId = "forceBuyBackDisabledRecord__id",
  ForceBuyBackDisabledRecordTransactionHash = "forceBuyBackDisabledRecord__transactionHash",
  ForceBuyBackIndex = "forceBuyBackIndex",
  ForceBuyBackRecords = "forceBuyBackRecords",
  Hooks = "hooks",
  HooksConfig = "hooksConfig",
  HooksConfigAllowClosureBeforeTerm = "hooksConfig__allowClosureBeforeTerm",
  HooksConfigAllowForceBuyBacks = "hooksConfig__allowForceBuyBacks",
  HooksConfigAllowTermReduction = "hooksConfig__allowTermReduction",
  HooksConfigDepositRequiresAccess = "hooksConfig__depositRequiresAccess",
  HooksConfigFixedTermEndTime = "hooksConfig__fixedTermEndTime",
  HooksConfigId = "hooksConfig__id",
  HooksConfigMinimumDeposit = "hooksConfig__minimumDeposit",
  HooksConfigQueueWithdrawalRequiresAccess = "hooksConfig__queueWithdrawalRequiresAccess",
  HooksConfigTransferRequiresAccess = "hooksConfig__transferRequiresAccess",
  HooksConfigTransfersDisabled = "hooksConfig__transfersDisabled",
  HooksConfigUseOnBorrow = "hooksConfig__useOnBorrow",
  HooksConfigUseOnCloseMarket = "hooksConfig__useOnCloseMarket",
  HooksConfigUseOnDeposit = "hooksConfig__useOnDeposit",
  HooksConfigUseOnExecuteWithdrawal = "hooksConfig__useOnExecuteWithdrawal",
  HooksConfigUseOnNukeFromOrbit = "hooksConfig__useOnNukeFromOrbit",
  HooksConfigUseOnQueueWithdrawal = "hooksConfig__useOnQueueWithdrawal",
  HooksConfigUseOnRepay = "hooksConfig__useOnRepay",
  HooksConfigUseOnSetAnnualInterestAndReserveRatioBips = "hooksConfig__useOnSetAnnualInterestAndReserveRatioBips",
  HooksConfigUseOnSetMaxTotalSupply = "hooksConfig__useOnSetMaxTotalSupply",
  HooksConfigUseOnSetProtocolFeeBips = "hooksConfig__useOnSetProtocolFeeBips",
  HooksConfigUseOnTransfer = "hooksConfig__useOnTransfer",
  HooksFactory = "hooksFactory",
  HooksFactoryEventIndex = "hooksFactory__eventIndex",
  HooksFactoryId = "hooksFactory__id",
  HooksFactoryIsRegistered = "hooksFactory__isRegistered",
  HooksFactorySentinel = "hooksFactory__sentinel",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  InterestAccrualRecords = "interestAccrualRecords",
  IsClosed = "isClosed",
  IsDelinquent = "isDelinquent",
  IsIncurringPenalties = "isIncurringPenalties",
  IsRegistered = "isRegistered",
  LastInterestAccruedTimestamp = "lastInterestAccruedTimestamp",
  Lenders = "lenders",
  MarketClosedEvent = "marketClosedEvent",
  MarketClosedEventBlockNumber = "marketClosedEvent__blockNumber",
  MarketClosedEventBlockTimestamp = "marketClosedEvent__blockTimestamp",
  MarketClosedEventEventIndex = "marketClosedEvent__eventIndex",
  MarketClosedEventId = "marketClosedEvent__id",
  MarketClosedEventTimestamp = "marketClosedEvent__timestamp",
  MarketClosedEventTransactionHash = "marketClosedEvent__transactionHash",
  MaxTotalSupply = "maxTotalSupply",
  MaxTotalSupplyUpdatedIndex = "maxTotalSupplyUpdatedIndex",
  MaxTotalSupplyUpdatedRecords = "maxTotalSupplyUpdatedRecords",
  MinimumDepositUpdateRecords = "minimumDepositUpdateRecords",
  MinimumDepositUpdatedIndex = "minimumDepositUpdatedIndex",
  Name = "name",
  NormalizedUnclaimedWithdrawals = "normalizedUnclaimedWithdrawals",
  OriginalAnnualInterestBips = "originalAnnualInterestBips",
  OriginalReserveRatioBips = "originalReserveRatioBips",
  PendingProtocolFees = "pendingProtocolFees",
  PendingWithdrawalExpiry = "pendingWithdrawalExpiry",
  ProtocolFeeBips = "protocolFeeBips",
  ProtocolFeeBipsUpdatedIndex = "protocolFeeBipsUpdatedIndex",
  ProtocolFeeBipsUpdatedRecords = "protocolFeeBipsUpdatedRecords",
  Removal = "removal",
  RemovalBlockNumber = "removal__blockNumber",
  RemovalBlockTimestamp = "removal__blockTimestamp",
  RemovalId = "removal__id",
  RemovalTransactionHash = "removal__transactionHash",
  RepaymentRecords = "repaymentRecords",
  ReserveRatioBips = "reserveRatioBips",
  ReserveRatioBipsUpdatedRecords = "reserveRatioBipsUpdatedRecords",
  ScaleFactor = "scaleFactor",
  ScaledPendingWithdrawals = "scaledPendingWithdrawals",
  ScaledTotalSupply = "scaledTotalSupply",
  Sentinel = "sentinel",
  Symbol = "symbol",
  TemporaryReserveRatioActive = "temporaryReserveRatioActive",
  TemporaryReserveRatioExpiry = "temporaryReserveRatioExpiry",
  TimeDelinquent = "timeDelinquent",
  TotalBaseInterestAccrued = "totalBaseInterestAccrued",
  TotalBorrowed = "totalBorrowed",
  TotalDelinquencyFeesAccrued = "totalDelinquencyFeesAccrued",
  TotalDeposited = "totalDeposited",
  TotalProtocolFeesAccrued = "totalProtocolFeesAccrued",
  TotalRepaid = "totalRepaid",
  Version = "version",
  WithdrawalBatchDuration = "withdrawalBatchDuration",
  WithdrawalBatches = "withdrawalBatches",
  WithdrawalRequestRecords = "withdrawalRequestRecords",
  WithdrawalRequestsIndex = "withdrawalRequestsIndex"
}

export type SubgraphMaxTotalSupplyUpdated = {
  __typename: "MaxTotalSupplyUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  maxTotalSupplyUpdatedIndex: Scalars["Int"]["output"];
  newMaxTotalSupply: Scalars["BigInt"]["output"];
  oldMaxTotalSupply: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMaxTotalSupplyUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  maxTotalSupplyUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maxTotalSupplyUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  maxTotalSupplyUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  newMaxTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMaxTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMaxTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMaxTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  newMaxTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMaxTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMaxTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMaxTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldMaxTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMaxTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMaxTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMaxTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldMaxTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMaxTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMaxTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMaxTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMaxTotalSupplyUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  MaxTotalSupplyUpdatedIndex = "maxTotalSupplyUpdatedIndex",
  NewMaxTotalSupply = "newMaxTotalSupply",
  OldMaxTotalSupply = "oldMaxTotalSupply",
  TransactionHash = "transactionHash"
}

export type SubgraphMinimumDepositUpdated = {
  __typename: "MinimumDepositUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  minimumDepositUpdatedIndex: Scalars["Int"]["output"];
  newMinimumDeposit: Scalars["BigInt"]["output"];
  oldMinimumDeposit?: Maybe<Scalars["BigInt"]["output"]>;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphMinimumDepositUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMinimumDepositUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  minimumDepositUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumDepositUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDepositUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  newMinimumDeposit?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMinimumDeposit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMinimumDeposit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMinimumDeposit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  newMinimumDeposit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMinimumDeposit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMinimumDeposit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  newMinimumDeposit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldMinimumDeposit?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMinimumDeposit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMinimumDeposit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMinimumDeposit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldMinimumDeposit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMinimumDeposit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMinimumDeposit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldMinimumDeposit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphMinimumDepositUpdated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphMinimumDepositUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  MinimumDepositUpdatedIndex = "minimumDepositUpdatedIndex",
  NewMinimumDeposit = "newMinimumDeposit",
  OldMinimumDeposit = "oldMinimumDeposit",
  TransactionHash = "transactionHash"
}

export type SubgraphNewController = {
  __typename: "NewController";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  borrower: Scalars["Bytes"]["output"];
  controller: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  namePrefix: Scalars["String"]["output"];
  symbolPrefix: Scalars["String"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphNewController_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphNewController_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  controller?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  controller_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  controller_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  namePrefix?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_contains?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_gt?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_gte?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  namePrefix_lt?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_lte?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  namePrefix_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  namePrefix_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphNewController_Filter>>>;
  symbolPrefix?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_gt?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_gte?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbolPrefix_lt?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_lte?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbolPrefix_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbolPrefix_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphNewController_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Borrower = "borrower",
  Controller = "controller",
  Id = "id",
  NamePrefix = "namePrefix",
  SymbolPrefix = "symbolPrefix",
  TransactionHash = "transactionHash"
}

export type SubgraphNewSanctionsEscrow = {
  __typename: "NewSanctionsEscrow";
  account: Scalars["Bytes"]["output"];
  asset: Scalars["Bytes"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  borrower: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphNewSanctionsEscrow_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  account_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphNewSanctionsEscrow_Filter>>>;
  asset?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  asset_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  asset_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphNewSanctionsEscrow_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphNewSanctionsEscrow_OrderBy {
  Account = "account",
  Asset = "asset",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Borrower = "borrower",
  Id = "id",
  TransactionHash = "transactionHash"
}

/** Defines the order direction, either ascending or descending */
export enum SubgraphOrderDirection {
  Asc = "asc",
  Desc = "desc"
}

export type SubgraphOwnershipHandoverCanceled = {
  __typename: "OwnershipHandoverCanceled";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  pendingOwner: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphOwnershipHandoverCanceled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphOwnershipHandoverCanceled_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphOwnershipHandoverCanceled_Filter>>>;
  pendingOwner?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  pendingOwner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphOwnershipHandoverCanceled_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  PendingOwner = "pendingOwner",
  TransactionHash = "transactionHash"
}

export type SubgraphOwnershipHandoverRequested = {
  __typename: "OwnershipHandoverRequested";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  pendingOwner: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphOwnershipHandoverRequested_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphOwnershipHandoverRequested_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphOwnershipHandoverRequested_Filter>>>;
  pendingOwner?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  pendingOwner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  pendingOwner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphOwnershipHandoverRequested_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  PendingOwner = "pendingOwner",
  TransactionHash = "transactionHash"
}

export type SubgraphOwnershipTransferred = {
  __typename: "OwnershipTransferred";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  newOwner: Scalars["Bytes"]["output"];
  oldOwner: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphOwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphOwnershipTransferred_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  newOwner?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  newOwner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  oldOwner?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  oldOwner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  oldOwner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphOwnershipTransferred_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphOwnershipTransferred_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  NewOwner = "newOwner",
  OldOwner = "oldOwner",
  TransactionHash = "transactionHash"
}

export type SubgraphParameterConstraints = {
  __typename: "ParameterConstraints";
  id: Scalars["ID"]["output"];
  maximumAnnualInterestBips: Scalars["Int"]["output"];
  maximumDelinquencyFeeBips: Scalars["Int"]["output"];
  maximumDelinquencyGracePeriod: Scalars["Int"]["output"];
  maximumReserveRatioBips: Scalars["Int"]["output"];
  maximumWithdrawalBatchDuration: Scalars["Int"]["output"];
  minimumAnnualInterestBips: Scalars["Int"]["output"];
  minimumDelinquencyFeeBips: Scalars["Int"]["output"];
  minimumDelinquencyGracePeriod: Scalars["Int"]["output"];
  minimumReserveRatioBips: Scalars["Int"]["output"];
  minimumWithdrawalBatchDuration: Scalars["Int"]["output"];
};

export type SubgraphParameterConstraints_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphParameterConstraints_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  maximumAnnualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
  maximumAnnualInterestBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumAnnualInterestBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumAnnualInterestBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumAnnualInterestBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumAnnualInterestBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumAnnualInterestBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  maximumAnnualInterestBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumDelinquencyFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumDelinquencyFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumDelinquencyGracePeriod?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyGracePeriod_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyGracePeriod_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyGracePeriod_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumDelinquencyGracePeriod_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyGracePeriod_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyGracePeriod_not?: InputMaybe<Scalars["Int"]["input"]>;
  maximumDelinquencyGracePeriod_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumReserveRatioBips?: InputMaybe<Scalars["Int"]["input"]>;
  maximumReserveRatioBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumReserveRatioBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumReserveRatioBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumReserveRatioBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumReserveRatioBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumReserveRatioBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  maximumReserveRatioBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumWithdrawalBatchDuration?: InputMaybe<Scalars["Int"]["input"]>;
  maximumWithdrawalBatchDuration_gt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumWithdrawalBatchDuration_gte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumWithdrawalBatchDuration_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  maximumWithdrawalBatchDuration_lt?: InputMaybe<Scalars["Int"]["input"]>;
  maximumWithdrawalBatchDuration_lte?: InputMaybe<Scalars["Int"]["input"]>;
  maximumWithdrawalBatchDuration_not?: InputMaybe<Scalars["Int"]["input"]>;
  maximumWithdrawalBatchDuration_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumAnnualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
  minimumAnnualInterestBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumAnnualInterestBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumAnnualInterestBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumAnnualInterestBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumAnnualInterestBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumAnnualInterestBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumAnnualInterestBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumDelinquencyFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumDelinquencyFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumDelinquencyGracePeriod?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyGracePeriod_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyGracePeriod_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyGracePeriod_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumDelinquencyGracePeriod_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyGracePeriod_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyGracePeriod_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumDelinquencyGracePeriod_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumReserveRatioBips?: InputMaybe<Scalars["Int"]["input"]>;
  minimumReserveRatioBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumReserveRatioBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumReserveRatioBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumReserveRatioBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumReserveRatioBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumReserveRatioBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumReserveRatioBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumWithdrawalBatchDuration?: InputMaybe<Scalars["Int"]["input"]>;
  minimumWithdrawalBatchDuration_gt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumWithdrawalBatchDuration_gte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumWithdrawalBatchDuration_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimumWithdrawalBatchDuration_lt?: InputMaybe<Scalars["Int"]["input"]>;
  minimumWithdrawalBatchDuration_lte?: InputMaybe<Scalars["Int"]["input"]>;
  minimumWithdrawalBatchDuration_not?: InputMaybe<Scalars["Int"]["input"]>;
  minimumWithdrawalBatchDuration_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphParameterConstraints_Filter>>>;
};

export enum SubgraphParameterConstraints_OrderBy {
  Id = "id",
  MaximumAnnualInterestBips = "maximumAnnualInterestBips",
  MaximumDelinquencyFeeBips = "maximumDelinquencyFeeBips",
  MaximumDelinquencyGracePeriod = "maximumDelinquencyGracePeriod",
  MaximumReserveRatioBips = "maximumReserveRatioBips",
  MaximumWithdrawalBatchDuration = "maximumWithdrawalBatchDuration",
  MinimumAnnualInterestBips = "minimumAnnualInterestBips",
  MinimumDelinquencyFeeBips = "minimumDelinquencyFeeBips",
  MinimumDelinquencyGracePeriod = "minimumDelinquencyGracePeriod",
  MinimumReserveRatioBips = "minimumReserveRatioBips",
  MinimumWithdrawalBatchDuration = "minimumWithdrawalBatchDuration"
}

export type SubgraphProtocolFeeBipsUpdated = {
  __typename: "ProtocolFeeBipsUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  newProtocolFeeBips: Scalars["Int"]["output"];
  oldProtocolFeeBips: Scalars["Int"]["output"];
  protocolFeeBipsUpdatedIndex: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphProtocolFeeBipsUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphProtocolFeeBipsUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newProtocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  newProtocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  newProtocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  newProtocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  newProtocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  newProtocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  newProtocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  newProtocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldProtocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  oldProtocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  oldProtocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  oldProtocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldProtocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  oldProtocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  oldProtocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  oldProtocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphProtocolFeeBipsUpdated_Filter>>>;
  protocolFeeBipsUpdatedIndex?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBipsUpdatedIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBipsUpdatedIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphProtocolFeeBipsUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NewProtocolFeeBips = "newProtocolFeeBips",
  OldProtocolFeeBips = "oldProtocolFeeBips",
  ProtocolFeeBipsUpdatedIndex = "protocolFeeBipsUpdatedIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphQuery = {
  __typename: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<Subgraph_Meta_>;
  accountAccessGranted?: Maybe<SubgraphAccountAccessGranted>;
  accountAccessGranteds: SubgraphAccountAccessGranted[];
  accountAccessRevoked?: Maybe<SubgraphAccountAccessRevoked>;
  accountAccessRevokeds: SubgraphAccountAccessRevoked[];
  accountBlockedFromDeposits?: Maybe<SubgraphAccountBlockedFromDeposits>;
  accountBlockedFromDeposits_collection: SubgraphAccountBlockedFromDeposits[];
  accountMadeFirstDeposit?: Maybe<SubgraphAccountMadeFirstDeposit>;
  accountMadeFirstDeposits: SubgraphAccountMadeFirstDeposit[];
  accountUnblockedFromDeposits?: Maybe<SubgraphAccountUnblockedFromDeposits>;
  accountUnblockedFromDeposits_collection: SubgraphAccountUnblockedFromDeposits[];
  annualInterestBipsUpdated?: Maybe<SubgraphAnnualInterestBipsUpdated>;
  annualInterestBipsUpdateds: SubgraphAnnualInterestBipsUpdated[];
  approval?: Maybe<SubgraphApproval>;
  approvals: SubgraphApproval[];
  archController?: Maybe<SubgraphArchController>;
  archControllers: SubgraphArchController[];
  borrow?: Maybe<SubgraphBorrow>;
  borrowerRegistrationChange?: Maybe<SubgraphBorrowerRegistrationChange>;
  borrowerRegistrationChanges: SubgraphBorrowerRegistrationChange[];
  borrows: SubgraphBorrow[];
  controller?: Maybe<SubgraphController>;
  controllerAdded?: Maybe<SubgraphControllerAdded>;
  controllerAddeds: SubgraphControllerAdded[];
  controllerFactories: SubgraphControllerFactory[];
  controllerFactory?: Maybe<SubgraphControllerFactory>;
  controllerFactoryAdded?: Maybe<SubgraphControllerFactoryAdded>;
  controllerFactoryAddeds: SubgraphControllerFactoryAdded[];
  controllerFactoryRemoved?: Maybe<SubgraphControllerFactoryRemoved>;
  controllerFactoryRemoveds: SubgraphControllerFactoryRemoved[];
  controllerRemoved?: Maybe<SubgraphControllerRemoved>;
  controllerRemoveds: SubgraphControllerRemoved[];
  controllers: SubgraphController[];
  debtRepaid?: Maybe<SubgraphDebtRepaid>;
  debtRepaids: SubgraphDebtRepaid[];
  delinquencyStatusChanged?: Maybe<SubgraphDelinquencyStatusChanged>;
  delinquencyStatusChangeds: SubgraphDelinquencyStatusChanged[];
  deposit?: Maybe<SubgraphDeposit>;
  deposits: SubgraphDeposit[];
  disabledForceBuyBacks?: Maybe<SubgraphDisabledForceBuyBacks>;
  disabledForceBuyBacks_collection: SubgraphDisabledForceBuyBacks[];
  feesCollected?: Maybe<SubgraphFeesCollected>;
  feesCollecteds: SubgraphFeesCollected[];
  fixedTermUpdated?: Maybe<SubgraphFixedTermUpdated>;
  fixedTermUpdateds: SubgraphFixedTermUpdated[];
  forceBuyBack?: Maybe<SubgraphForceBuyBack>;
  forceBuyBacks: SubgraphForceBuyBack[];
  hooksConfig?: Maybe<SubgraphHooksConfig>;
  hooksConfigs: SubgraphHooksConfig[];
  hooksFactories: SubgraphHooksFactory[];
  hooksFactory?: Maybe<SubgraphHooksFactory>;
  hooksInstance?: Maybe<SubgraphHooksInstance>;
  hooksInstanceDeployed?: Maybe<SubgraphHooksInstanceDeployed>;
  hooksInstanceDeployeds: SubgraphHooksInstanceDeployed[];
  hooksInstances: SubgraphHooksInstance[];
  hooksNameUpdated?: Maybe<SubgraphHooksNameUpdated>;
  hooksNameUpdateds: SubgraphHooksNameUpdated[];
  hooksTemplate?: Maybe<SubgraphHooksTemplate>;
  hooksTemplateAdded?: Maybe<SubgraphHooksTemplateAdded>;
  hooksTemplateAddeds: SubgraphHooksTemplateAdded[];
  hooksTemplateDisabled?: Maybe<SubgraphHooksTemplateDisabled>;
  hooksTemplateDisableds: SubgraphHooksTemplateDisabled[];
  hooksTemplateFeesUpdated?: Maybe<SubgraphHooksTemplateFeesUpdated>;
  hooksTemplateFeesUpdateds: SubgraphHooksTemplateFeesUpdated[];
  hooksTemplates: SubgraphHooksTemplate[];
  knownLenderStatus?: Maybe<SubgraphKnownLenderStatus>;
  knownLenderStatuses: SubgraphKnownLenderStatus[];
  lenderAccount?: Maybe<SubgraphLenderAccount>;
  lenderAccounts: SubgraphLenderAccount[];
  lenderAuthorization?: Maybe<SubgraphLenderAuthorization>;
  lenderAuthorizationChange?: Maybe<SubgraphLenderAuthorizationChange>;
  lenderAuthorizationChanges: SubgraphLenderAuthorizationChange[];
  lenderAuthorizations: SubgraphLenderAuthorization[];
  lenderHooksAccess?: Maybe<SubgraphLenderHooksAccess>;
  lenderHooksAccesses: SubgraphLenderHooksAccess[];
  lenderInterestAccrued?: Maybe<SubgraphLenderInterestAccrued>;
  lenderInterestAccrueds: SubgraphLenderInterestAccrued[];
  lenderWithdrawalStatus?: Maybe<SubgraphLenderWithdrawalStatus>;
  lenderWithdrawalStatuses: SubgraphLenderWithdrawalStatus[];
  market?: Maybe<SubgraphMarket>;
  marketAdded?: Maybe<SubgraphMarketAdded>;
  marketAddeds: SubgraphMarketAdded[];
  marketClosed?: Maybe<SubgraphMarketClosed>;
  marketCloseds: SubgraphMarketClosed[];
  marketDeployed?: Maybe<SubgraphMarketDeployed>;
  marketDeployeds: SubgraphMarketDeployed[];
  marketInterestAccrued?: Maybe<SubgraphMarketInterestAccrued>;
  marketInterestAccrueds: SubgraphMarketInterestAccrued[];
  marketRemoved?: Maybe<SubgraphMarketRemoved>;
  marketRemoveds: SubgraphMarketRemoved[];
  markets: SubgraphMarket[];
  maxTotalSupplyUpdated?: Maybe<SubgraphMaxTotalSupplyUpdated>;
  maxTotalSupplyUpdateds: SubgraphMaxTotalSupplyUpdated[];
  minimumDepositUpdated?: Maybe<SubgraphMinimumDepositUpdated>;
  minimumDepositUpdateds: SubgraphMinimumDepositUpdated[];
  newController?: Maybe<SubgraphNewController>;
  newControllers: SubgraphNewController[];
  newSanctionsEscrow?: Maybe<SubgraphNewSanctionsEscrow>;
  newSanctionsEscrows: SubgraphNewSanctionsEscrow[];
  ownershipHandoverCanceled?: Maybe<SubgraphOwnershipHandoverCanceled>;
  ownershipHandoverCanceleds: SubgraphOwnershipHandoverCanceled[];
  ownershipHandoverRequested?: Maybe<SubgraphOwnershipHandoverRequested>;
  ownershipHandoverRequesteds: SubgraphOwnershipHandoverRequested[];
  ownershipTransferred?: Maybe<SubgraphOwnershipTransferred>;
  ownershipTransferreds: SubgraphOwnershipTransferred[];
  parameterConstraints?: Maybe<SubgraphParameterConstraints>;
  parameterConstraints_collection: SubgraphParameterConstraints[];
  protocolFeeBipsUpdated?: Maybe<SubgraphProtocolFeeBipsUpdated>;
  protocolFeeBipsUpdateds: SubgraphProtocolFeeBipsUpdated[];
  registeredBorrower?: Maybe<SubgraphRegisteredBorrower>;
  registeredBorrowers: SubgraphRegisteredBorrower[];
  reserveRatioBipsUpdated?: Maybe<SubgraphReserveRatioBipsUpdated>;
  reserveRatioBipsUpdateds: SubgraphReserveRatioBipsUpdated[];
  roleProvider?: Maybe<SubgraphRoleProvider>;
  roleProviderAdded?: Maybe<SubgraphRoleProviderAdded>;
  roleProviderAddeds: SubgraphRoleProviderAdded[];
  roleProviderRemoved?: Maybe<SubgraphRoleProviderRemoved>;
  roleProviderRemoveds: SubgraphRoleProviderRemoved[];
  roleProviderUpdated?: Maybe<SubgraphRoleProviderUpdated>;
  roleProviderUpdateds: SubgraphRoleProviderUpdated[];
  roleProviders: SubgraphRoleProvider[];
  sanctionOverride?: Maybe<SubgraphSanctionOverride>;
  sanctionOverrideRemoved?: Maybe<SubgraphSanctionOverrideRemoved>;
  sanctionOverrideRemoveds: SubgraphSanctionOverrideRemoved[];
  sanctionOverrides: SubgraphSanctionOverride[];
  sanctionedAccountAssetsQueuedForWithdrawal?: Maybe<SubgraphSanctionedAccountAssetsQueuedForWithdrawal>;
  sanctionedAccountAssetsQueuedForWithdrawals: SubgraphSanctionedAccountAssetsQueuedForWithdrawal[];
  sanctionedAccountAssetsSentToEscrow?: Maybe<SubgraphSanctionedAccountAssetsSentToEscrow>;
  sanctionedAccountAssetsSentToEscrows: SubgraphSanctionedAccountAssetsSentToEscrow[];
  sanctionedAccountWithdrawalSentToEscrow?: Maybe<SubgraphSanctionedAccountWithdrawalSentToEscrow>;
  sanctionedAccountWithdrawalSentToEscrows: SubgraphSanctionedAccountWithdrawalSentToEscrow[];
  subgraphVersion?: Maybe<SubgraphSubgraphVersion>;
  subgraphVersions: SubgraphSubgraphVersion[];
  token?: Maybe<SubgraphToken>;
  tokens: SubgraphToken[];
  transfer?: Maybe<SubgraphTransfer>;
  transfers: SubgraphTransfer[];
  updateProtocolFeeConfiguration?: Maybe<SubgraphUpdateProtocolFeeConfiguration>;
  updateProtocolFeeConfigurations: SubgraphUpdateProtocolFeeConfiguration[];
  withdrawalBatch?: Maybe<SubgraphWithdrawalBatch>;
  withdrawalBatchCreated?: Maybe<SubgraphWithdrawalBatchCreated>;
  withdrawalBatchCreateds: SubgraphWithdrawalBatchCreated[];
  withdrawalBatchExpired?: Maybe<SubgraphWithdrawalBatchExpired>;
  withdrawalBatchExpireds: SubgraphWithdrawalBatchExpired[];
  withdrawalBatchInterestAccrued?: Maybe<SubgraphWithdrawalBatchInterestAccrued>;
  withdrawalBatchInterestAccrueds: SubgraphWithdrawalBatchInterestAccrued[];
  withdrawalBatchPayment?: Maybe<SubgraphWithdrawalBatchPayment>;
  withdrawalBatchPayments: SubgraphWithdrawalBatchPayment[];
  withdrawalBatches: SubgraphWithdrawalBatch[];
  withdrawalExecution?: Maybe<SubgraphWithdrawalExecution>;
  withdrawalExecutions: SubgraphWithdrawalExecution[];
  withdrawalRequest?: Maybe<SubgraphWithdrawalRequest>;
  withdrawalRequests: SubgraphWithdrawalRequest[];
};

export type SubgraphQuery_MetaArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
};

export type SubgraphQueryAccountAccessGrantedArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
};

export type SubgraphQueryAccountAccessGrantedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountAccessGranted_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphAccountAccessGranted_Filter>;
};

export type SubgraphQueryAccountAccessRevokedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryAccountAccessRevokedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountAccessRevoked_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphAccountAccessRevoked_Filter>;
};

export type SubgraphQueryAccountBlockedFromDepositsArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryAccountBlockedFromDeposits_CollectionArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountBlockedFromDeposits_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphAccountBlockedFromDeposits_Filter>;
};

export type SubgraphQueryAccountMadeFirstDepositArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryAccountMadeFirstDepositsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountMadeFirstDeposit_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphAccountMadeFirstDeposit_Filter>;
};

export type SubgraphQueryAccountUnblockedFromDepositsArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryAccountUnblockedFromDeposits_CollectionArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAccountUnblockedFromDeposits_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphAccountUnblockedFromDeposits_Filter>;
};

export type SubgraphQueryAnnualInterestBipsUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryAnnualInterestBipsUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphAnnualInterestBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphAnnualInterestBipsUpdated_Filter>;
};

export type SubgraphQueryApprovalArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryApprovalsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphApproval_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphApproval_Filter>;
};

export type SubgraphQueryArchControllerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryArchControllersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphArchController_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphArchController_Filter>;
};

export type SubgraphQueryBorrowArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryBorrowerRegistrationChangeArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryBorrowerRegistrationChangesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphBorrowerRegistrationChange_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphBorrowerRegistrationChange_Filter>;
};

export type SubgraphQueryBorrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphBorrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphBorrow_Filter>;
};

export type SubgraphQueryControllerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryControllerAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryControllerAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerAdded_Filter>;
};

export type SubgraphQueryControllerFactoriesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerFactory_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerFactory_Filter>;
};

export type SubgraphQueryControllerFactoryArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryControllerFactoryAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryControllerFactoryAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerFactoryAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerFactoryAdded_Filter>;
};

export type SubgraphQueryControllerFactoryRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryControllerFactoryRemovedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerFactoryRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerFactoryRemoved_Filter>;
};

export type SubgraphQueryControllerRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryControllerRemovedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerRemoved_Filter>;
};

export type SubgraphQueryControllersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphController_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphController_Filter>;
};

export type SubgraphQueryDebtRepaidArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryDebtRepaidsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDebtRepaid_Filter>;
};

export type SubgraphQueryDelinquencyStatusChangedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryDelinquencyStatusChangedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDelinquencyStatusChanged_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDelinquencyStatusChanged_Filter>;
};

export type SubgraphQueryDepositArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryDepositsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDeposit_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDeposit_Filter>;
};

export type SubgraphQueryDisabledForceBuyBacksArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryDisabledForceBuyBacks_CollectionArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDisabledForceBuyBacks_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDisabledForceBuyBacks_Filter>;
};

export type SubgraphQueryFeesCollectedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryFeesCollectedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphFeesCollected_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphFeesCollected_Filter>;
};

export type SubgraphQueryFixedTermUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryFixedTermUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphFixedTermUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphFixedTermUpdated_Filter>;
};

export type SubgraphQueryForceBuyBackArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryForceBuyBacksArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphForceBuyBack_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphForceBuyBack_Filter>;
};

export type SubgraphQueryHooksConfigArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksConfigsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksConfig_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksConfig_Filter>;
};

export type SubgraphQueryHooksFactoriesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksFactory_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksFactory_Filter>;
};

export type SubgraphQueryHooksFactoryArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksInstanceArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksInstanceDeployedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksInstanceDeployedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksInstanceDeployed_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksInstanceDeployed_Filter>;
};

export type SubgraphQueryHooksInstancesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksInstance_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksInstance_Filter>;
};

export type SubgraphQueryHooksNameUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksNameUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksNameUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksNameUpdated_Filter>;
};

export type SubgraphQueryHooksTemplateArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksTemplateAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksTemplateAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksTemplateAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksTemplateAdded_Filter>;
};

export type SubgraphQueryHooksTemplateDisabledArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksTemplateDisabledsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksTemplateDisabled_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksTemplateDisabled_Filter>;
};

export type SubgraphQueryHooksTemplateFeesUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryHooksTemplateFeesUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksTemplateFeesUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksTemplateFeesUpdated_Filter>;
};

export type SubgraphQueryHooksTemplatesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphHooksTemplate_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphHooksTemplate_Filter>;
};

export type SubgraphQueryKnownLenderStatusArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryKnownLenderStatusesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphKnownLenderStatus_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphKnownLenderStatus_Filter>;
};

export type SubgraphQueryLenderAccountArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryLenderAccountsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAccount_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderAccount_Filter>;
};

export type SubgraphQueryLenderAuthorizationArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryLenderAuthorizationChangeArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryLenderAuthorizationChangesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAuthorizationChange_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderAuthorizationChange_Filter>;
};

export type SubgraphQueryLenderAuthorizationsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAuthorization_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderAuthorization_Filter>;
};

export type SubgraphQueryLenderHooksAccessArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryLenderHooksAccessesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderHooksAccess_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
};

export type SubgraphQueryLenderInterestAccruedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryLenderInterestAccruedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderInterestAccrued_Filter>;
};

export type SubgraphQueryLenderWithdrawalStatusArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryLenderWithdrawalStatusesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderWithdrawalStatus_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
};

export type SubgraphQueryMarketArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMarketAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMarketAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketAdded_Filter>;
};

export type SubgraphQueryMarketClosedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMarketClosedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketClosed_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketClosed_Filter>;
};

export type SubgraphQueryMarketDeployedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMarketDeployedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketDeployed_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketDeployed_Filter>;
};

export type SubgraphQueryMarketInterestAccruedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMarketInterestAccruedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketInterestAccrued_Filter>;
};

export type SubgraphQueryMarketRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMarketRemovedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketRemoved_Filter>;
};

export type SubgraphQueryMarketsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarket_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarket_Filter>;
};

export type SubgraphQueryMaxTotalSupplyUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMaxTotalSupplyUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMaxTotalSupplyUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>;
};

export type SubgraphQueryMinimumDepositUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryMinimumDepositUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMinimumDepositUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMinimumDepositUpdated_Filter>;
};

export type SubgraphQueryNewControllerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryNewControllersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphNewController_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphNewController_Filter>;
};

export type SubgraphQueryNewSanctionsEscrowArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryNewSanctionsEscrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphNewSanctionsEscrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphNewSanctionsEscrow_Filter>;
};

export type SubgraphQueryOwnershipHandoverCanceledArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryOwnershipHandoverCanceledsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphOwnershipHandoverCanceled_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphOwnershipHandoverCanceled_Filter>;
};

export type SubgraphQueryOwnershipHandoverRequestedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryOwnershipHandoverRequestedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphOwnershipHandoverRequested_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphOwnershipHandoverRequested_Filter>;
};

export type SubgraphQueryOwnershipTransferredArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryOwnershipTransferredsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphOwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphOwnershipTransferred_Filter>;
};

export type SubgraphQueryParameterConstraintsArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryParameterConstraints_CollectionArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphParameterConstraints_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphParameterConstraints_Filter>;
};

export type SubgraphQueryProtocolFeeBipsUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryProtocolFeeBipsUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphProtocolFeeBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphProtocolFeeBipsUpdated_Filter>;
};

export type SubgraphQueryRegisteredBorrowerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryRegisteredBorrowersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRegisteredBorrower_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphRegisteredBorrower_Filter>;
};

export type SubgraphQueryReserveRatioBipsUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryReserveRatioBipsUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphReserveRatioBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphReserveRatioBipsUpdated_Filter>;
};

export type SubgraphQueryRoleProviderArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryRoleProviderAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryRoleProviderAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProviderAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphRoleProviderAdded_Filter>;
};

export type SubgraphQueryRoleProviderRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryRoleProviderRemovedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProviderRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphRoleProviderRemoved_Filter>;
};

export type SubgraphQueryRoleProviderUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryRoleProviderUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProviderUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphRoleProviderUpdated_Filter>;
};

export type SubgraphQueryRoleProvidersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRoleProvider_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphRoleProvider_Filter>;
};

export type SubgraphQuerySanctionOverrideArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQuerySanctionOverrideRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQuerySanctionOverrideRemovedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionOverrideRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionOverrideRemoved_Filter>;
};

export type SubgraphQuerySanctionOverridesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionOverride_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionOverride_Filter>;
};

export type SubgraphQuerySanctionedAccountAssetsQueuedForWithdrawalArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQuerySanctionedAccountAssetsQueuedForWithdrawalsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionedAccountAssetsQueuedForWithdrawal_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionedAccountAssetsQueuedForWithdrawal_Filter>;
};

export type SubgraphQuerySanctionedAccountAssetsSentToEscrowArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQuerySanctionedAccountAssetsSentToEscrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionedAccountAssetsSentToEscrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionedAccountAssetsSentToEscrow_Filter>;
};

export type SubgraphQuerySanctionedAccountWithdrawalSentToEscrowArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQuerySanctionedAccountWithdrawalSentToEscrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionedAccountWithdrawalSentToEscrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionedAccountWithdrawalSentToEscrow_Filter>;
};

export type SubgraphQuerySubgraphVersionArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQuerySubgraphVersionsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSubgraphVersion_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSubgraphVersion_Filter>;
};

export type SubgraphQueryTokenArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryTokensArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphToken_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphToken_Filter>;
};

export type SubgraphQueryTransferArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryTransfersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphTransfer_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphTransfer_Filter>;
};

export type SubgraphQueryUpdateProtocolFeeConfigurationArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryUpdateProtocolFeeConfigurationsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphUpdateProtocolFeeConfiguration_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphUpdateProtocolFeeConfiguration_Filter>;
};

export type SubgraphQueryWithdrawalBatchArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalBatchCreatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalBatchCreatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchCreated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchCreated_Filter>;
};

export type SubgraphQueryWithdrawalBatchExpiredArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalBatchExpiredsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchExpired_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchExpired_Filter>;
};

export type SubgraphQueryWithdrawalBatchInterestAccruedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalBatchInterestAccruedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_Filter>;
};

export type SubgraphQueryWithdrawalBatchPaymentArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalBatchPaymentsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchPayment_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchPayment_Filter>;
};

export type SubgraphQueryWithdrawalBatchesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatch_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
};

export type SubgraphQueryWithdrawalExecutionArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalExecutionsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalExecution_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalExecution_Filter>;
};

export type SubgraphQueryWithdrawalRequestArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphQueryWithdrawalRequestsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalRequest_Filter>;
};

export type SubgraphRegisteredBorrower = {
  __typename: "RegisteredBorrower";
  archController: SubgraphArchController;
  borrower: Scalars["Bytes"]["output"];
  changes: SubgraphBorrowerRegistrationChange[];
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
};

export type SubgraphRegisteredBorrowerChangesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphBorrowerRegistrationChange_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphBorrowerRegistrationChange_Filter>;
};

export type SubgraphRegisteredBorrower_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphRegisteredBorrower_Filter>>>;
  archController?: InputMaybe<Scalars["String"]["input"]>;
  archController_?: InputMaybe<SubgraphArchController_Filter>;
  archController_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_gt?: InputMaybe<Scalars["String"]["input"]>;
  archController_gte?: InputMaybe<Scalars["String"]["input"]>;
  archController_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_lt?: InputMaybe<Scalars["String"]["input"]>;
  archController_lte?: InputMaybe<Scalars["String"]["input"]>;
  archController_not?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  archController_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  archController_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  changes_?: InputMaybe<SubgraphBorrowerRegistrationChange_Filter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isRegistered?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRegistered_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRegistered_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphRegisteredBorrower_Filter>>>;
};

export enum SubgraphRegisteredBorrower_OrderBy {
  ArchController = "archController",
  ArchControllerId = "archController__id",
  Borrower = "borrower",
  Changes = "changes",
  Id = "id",
  IsRegistered = "isRegistered"
}

export type SubgraphReserveRatioBipsUpdated = {
  __typename: "ReserveRatioBipsUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  newReserveRatioBips: Scalars["Int"]["output"];
  oldReserveRatioBips: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphReserveRatioBipsUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphReserveRatioBipsUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  newReserveRatioBips?: InputMaybe<Scalars["Int"]["input"]>;
  newReserveRatioBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  newReserveRatioBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  newReserveRatioBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  newReserveRatioBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  newReserveRatioBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  newReserveRatioBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  newReserveRatioBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldReserveRatioBips?: InputMaybe<Scalars["Int"]["input"]>;
  oldReserveRatioBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  oldReserveRatioBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  oldReserveRatioBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  oldReserveRatioBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  oldReserveRatioBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  oldReserveRatioBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  oldReserveRatioBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphReserveRatioBipsUpdated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphReserveRatioBipsUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NewReserveRatioBips = "newReserveRatioBips",
  OldReserveRatioBips = "oldReserveRatioBips",
  TransactionHash = "transactionHash"
}

export type SubgraphRoleProvider = {
  __typename: "RoleProvider";
  addedEvent?: Maybe<SubgraphRoleProviderAdded>;
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  isApproved: Scalars["Boolean"]["output"];
  isPullProvider: Scalars["Boolean"]["output"];
  isPushProvider: Scalars["Boolean"]["output"];
  providerAddress: Scalars["Bytes"]["output"];
  pullProviderIndex: Scalars["Int"]["output"];
  pushProviderIndex: Scalars["Int"]["output"];
  removedEvent?: Maybe<SubgraphRoleProviderRemoved>;
  timeToLive: Scalars["Int"]["output"];
  updatedEvents: SubgraphRoleProviderUpdated[];
};

export type SubgraphRoleProviderUpdatedEventsArgs =
  SubgraphHooksInstanceRoleProviderUpdatedRecordsArgs;

export type SubgraphRoleProviderAdded = {
  __typename: "RoleProviderAdded";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  isPullProvider: Scalars["Boolean"]["output"];
  isPushProvider: Scalars["Boolean"]["output"];
  provider: SubgraphRoleProvider;
  pullProviderIndex: Scalars["Int"]["output"];
  pushProviderIndex: Scalars["Int"]["output"];
  timeToLive: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphRoleProviderAdded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphRoleProviderAdded_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isPullProvider?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPullProvider_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPullProvider_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPullProvider_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPushProvider?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPushProvider_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPushProvider_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPushProvider_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphRoleProviderAdded_Filter>>>;
  provider?: InputMaybe<Scalars["String"]["input"]>;
  provider_?: InputMaybe<SubgraphRoleProvider_Filter>;
  provider_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_gt?: InputMaybe<Scalars["String"]["input"]>;
  provider_gte?: InputMaybe<Scalars["String"]["input"]>;
  provider_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_lt?: InputMaybe<Scalars["String"]["input"]>;
  provider_lte?: InputMaybe<Scalars["String"]["input"]>;
  provider_not?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  pullProviderIndex?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pullProviderIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pushProviderIndex?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pushProviderIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeToLive?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_gt?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_gte?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeToLive_lt?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_lte?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_not?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphRoleProviderAdded_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  IsPullProvider = "isPullProvider",
  IsPushProvider = "isPushProvider",
  Provider = "provider",
  ProviderId = "provider__id",
  ProviderIsApproved = "provider__isApproved",
  ProviderIsPullProvider = "provider__isPullProvider",
  ProviderIsPushProvider = "provider__isPushProvider",
  ProviderProviderAddress = "provider__providerAddress",
  ProviderPullProviderIndex = "provider__pullProviderIndex",
  ProviderPushProviderIndex = "provider__pushProviderIndex",
  ProviderTimeToLive = "provider__timeToLive",
  PullProviderIndex = "pullProviderIndex",
  PushProviderIndex = "pushProviderIndex",
  TimeToLive = "timeToLive",
  TransactionHash = "transactionHash"
}

export type SubgraphRoleProviderRemoved = {
  __typename: "RoleProviderRemoved";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  provider: SubgraphRoleProvider;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphRoleProviderRemoved_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphRoleProviderRemoved_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphRoleProviderRemoved_Filter>>>;
  provider?: InputMaybe<Scalars["String"]["input"]>;
  provider_?: InputMaybe<SubgraphRoleProvider_Filter>;
  provider_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_gt?: InputMaybe<Scalars["String"]["input"]>;
  provider_gte?: InputMaybe<Scalars["String"]["input"]>;
  provider_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_lt?: InputMaybe<Scalars["String"]["input"]>;
  provider_lte?: InputMaybe<Scalars["String"]["input"]>;
  provider_not?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphRoleProviderRemoved_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  Provider = "provider",
  ProviderId = "provider__id",
  ProviderIsApproved = "provider__isApproved",
  ProviderIsPullProvider = "provider__isPullProvider",
  ProviderIsPushProvider = "provider__isPushProvider",
  ProviderProviderAddress = "provider__providerAddress",
  ProviderPullProviderIndex = "provider__pullProviderIndex",
  ProviderPushProviderIndex = "provider__pushProviderIndex",
  ProviderTimeToLive = "provider__timeToLive",
  TransactionHash = "transactionHash"
}

export type SubgraphRoleProviderUpdated = {
  __typename: "RoleProviderUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  hooks: SubgraphHooksInstance;
  id: Scalars["ID"]["output"];
  isPullProvider: Scalars["Boolean"]["output"];
  isPushProvider: Scalars["Boolean"]["output"];
  provider: SubgraphRoleProvider;
  pullProviderIndex: Scalars["Int"]["output"];
  pushProviderIndex: Scalars["Int"]["output"];
  timeToLive: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphRoleProviderUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphRoleProviderUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isPullProvider?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPullProvider_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPullProvider_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPullProvider_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPushProvider?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPushProvider_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPushProvider_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPushProvider_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphRoleProviderUpdated_Filter>>>;
  provider?: InputMaybe<Scalars["String"]["input"]>;
  provider_?: InputMaybe<SubgraphRoleProvider_Filter>;
  provider_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_gt?: InputMaybe<Scalars["String"]["input"]>;
  provider_gte?: InputMaybe<Scalars["String"]["input"]>;
  provider_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_lt?: InputMaybe<Scalars["String"]["input"]>;
  provider_lte?: InputMaybe<Scalars["String"]["input"]>;
  provider_not?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  provider_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  provider_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  pullProviderIndex?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pullProviderIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pushProviderIndex?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pushProviderIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeToLive?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_gt?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_gte?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeToLive_lt?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_lte?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_not?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphRoleProviderUpdated_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  IsPullProvider = "isPullProvider",
  IsPushProvider = "isPushProvider",
  Provider = "provider",
  ProviderId = "provider__id",
  ProviderIsApproved = "provider__isApproved",
  ProviderIsPullProvider = "provider__isPullProvider",
  ProviderIsPushProvider = "provider__isPushProvider",
  ProviderProviderAddress = "provider__providerAddress",
  ProviderPullProviderIndex = "provider__pullProviderIndex",
  ProviderPushProviderIndex = "provider__pushProviderIndex",
  ProviderTimeToLive = "provider__timeToLive",
  PullProviderIndex = "pullProviderIndex",
  PushProviderIndex = "pushProviderIndex",
  TimeToLive = "timeToLive",
  TransactionHash = "transactionHash"
}

export type SubgraphRoleProvider_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  addedEvent_?: InputMaybe<SubgraphRoleProviderAdded_Filter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphRoleProvider_Filter>>>;
  hooks?: InputMaybe<Scalars["String"]["input"]>;
  hooks_?: InputMaybe<SubgraphHooksInstance_Filter>;
  hooks_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_gte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_lt?: InputMaybe<Scalars["String"]["input"]>;
  hooks_lte?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hooks_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hooks_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isApproved?: InputMaybe<Scalars["Boolean"]["input"]>;
  isApproved_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isApproved_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isApproved_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPullProvider?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPullProvider_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPullProvider_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPullProvider_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPushProvider?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPushProvider_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isPushProvider_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPushProvider_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphRoleProvider_Filter>>>;
  providerAddress?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  providerAddress_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  providerAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  pullProviderIndex?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pullProviderIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  pullProviderIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pushProviderIndex?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pushProviderIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  pushProviderIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  removedEvent_?: InputMaybe<SubgraphRoleProviderRemoved_Filter>;
  timeToLive?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_gt?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_gte?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timeToLive_lt?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_lte?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_not?: InputMaybe<Scalars["Int"]["input"]>;
  timeToLive_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  updatedEvents_?: InputMaybe<SubgraphRoleProviderUpdated_Filter>;
};

export enum SubgraphRoleProvider_OrderBy {
  AddedEvent = "addedEvent",
  AddedEventBlockNumber = "addedEvent__blockNumber",
  AddedEventBlockTimestamp = "addedEvent__blockTimestamp",
  AddedEventEventIndex = "addedEvent__eventIndex",
  AddedEventId = "addedEvent__id",
  AddedEventIsPullProvider = "addedEvent__isPullProvider",
  AddedEventIsPushProvider = "addedEvent__isPushProvider",
  AddedEventPullProviderIndex = "addedEvent__pullProviderIndex",
  AddedEventPushProviderIndex = "addedEvent__pushProviderIndex",
  AddedEventTimeToLive = "addedEvent__timeToLive",
  AddedEventTransactionHash = "addedEvent__transactionHash",
  Hooks = "hooks",
  HooksBorrower = "hooks__borrower",
  HooksEventIndex = "hooks__eventIndex",
  HooksId = "hooks__id",
  HooksKind = "hooks__kind",
  HooksName = "hooks__name",
  HooksNumMarkets = "hooks__numMarkets",
  Id = "id",
  IsApproved = "isApproved",
  IsPullProvider = "isPullProvider",
  IsPushProvider = "isPushProvider",
  ProviderAddress = "providerAddress",
  PullProviderIndex = "pullProviderIndex",
  PushProviderIndex = "pushProviderIndex",
  RemovedEvent = "removedEvent",
  RemovedEventBlockNumber = "removedEvent__blockNumber",
  RemovedEventBlockTimestamp = "removedEvent__blockTimestamp",
  RemovedEventEventIndex = "removedEvent__eventIndex",
  RemovedEventId = "removedEvent__id",
  RemovedEventTransactionHash = "removedEvent__transactionHash",
  TimeToLive = "timeToLive",
  UpdatedEvents = "updatedEvents"
}

export type SubgraphSanctionOverride = {
  __typename: "SanctionOverride";
  account: Scalars["Bytes"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  borrower: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphSanctionOverrideRemoved = {
  __typename: "SanctionOverrideRemoved";
  account: Scalars["Bytes"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  borrower: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphSanctionOverrideRemoved_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  account_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphSanctionOverrideRemoved_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphSanctionOverrideRemoved_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphSanctionOverrideRemoved_OrderBy {
  Account = "account",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Borrower = "borrower",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphSanctionOverride_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  account_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphSanctionOverride_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  borrower_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  borrower_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphSanctionOverride_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphSanctionOverride_OrderBy {
  Account = "account",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Borrower = "borrower",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphSanctionedAccountAssetsQueuedForWithdrawal = {
  __typename: "SanctionedAccountAssetsQueuedForWithdrawal";
  account: Scalars["Bytes"]["output"];
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  normalizedAmount: Scalars["BigInt"]["output"];
  scaledAmount: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphSanctionedAccountAssetsQueuedForWithdrawal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  account_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphSanctionedAccountAssetsQueuedForWithdrawal_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  normalizedAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphSanctionedAccountAssetsQueuedForWithdrawal_Filter>>>;
  scaledAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphSanctionedAccountAssetsQueuedForWithdrawal_OrderBy {
  Account = "account",
  Amount = "amount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  NormalizedAmount = "normalizedAmount",
  ScaledAmount = "scaledAmount",
  TransactionHash = "transactionHash"
}

export type SubgraphSanctionedAccountAssetsSentToEscrow = {
  __typename: "SanctionedAccountAssetsSentToEscrow";
  account: Scalars["Bytes"]["output"];
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  escrow: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphSanctionedAccountAssetsSentToEscrow_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  account_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphSanctionedAccountAssetsSentToEscrow_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  escrow?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  escrow_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphSanctionedAccountAssetsSentToEscrow_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphSanctionedAccountAssetsSentToEscrow_OrderBy {
  Account = "account",
  Amount = "amount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Escrow = "escrow",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphSanctionedAccountWithdrawalSentToEscrow = {
  __typename: "SanctionedAccountWithdrawalSentToEscrow";
  account: Scalars["Bytes"]["output"];
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  escrow: Scalars["Bytes"]["output"];
  expiry: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphSanctionedAccountWithdrawalSentToEscrow_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  account_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphSanctionedAccountWithdrawalSentToEscrow_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  escrow?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  escrow_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  escrow_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  expiry?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  expiry_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphSanctionedAccountWithdrawalSentToEscrow_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphSanctionedAccountWithdrawalSentToEscrow_OrderBy {
  Account = "account",
  Amount = "amount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Escrow = "escrow",
  Expiry = "expiry",
  Id = "id",
  TransactionHash = "transactionHash"
}

/** v2.0.1 */
export type SubgraphSubgraphVersion = {
  __typename: "SubgraphVersion";
  id: Scalars["ID"]["output"];
};

export type SubgraphSubgraphVersion_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphSubgraphVersion_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphSubgraphVersion_Filter>>>;
};

export enum SubgraphSubgraphVersion_OrderBy {
  Id = "id"
}

export type SubgraphSubscription = {
  __typename: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<Subgraph_Meta_>;
  accountAccessGranted?: Maybe<SubgraphAccountAccessGranted>;
  accountAccessGranteds: SubgraphAccountAccessGranted[];
  accountAccessRevoked?: Maybe<SubgraphAccountAccessRevoked>;
  accountAccessRevokeds: SubgraphAccountAccessRevoked[];
  accountBlockedFromDeposits?: Maybe<SubgraphAccountBlockedFromDeposits>;
  accountBlockedFromDeposits_collection: SubgraphAccountBlockedFromDeposits[];
  accountMadeFirstDeposit?: Maybe<SubgraphAccountMadeFirstDeposit>;
  accountMadeFirstDeposits: SubgraphAccountMadeFirstDeposit[];
  accountUnblockedFromDeposits?: Maybe<SubgraphAccountUnblockedFromDeposits>;
  accountUnblockedFromDeposits_collection: SubgraphAccountUnblockedFromDeposits[];
  annualInterestBipsUpdated?: Maybe<SubgraphAnnualInterestBipsUpdated>;
  annualInterestBipsUpdateds: SubgraphAnnualInterestBipsUpdated[];
  approval?: Maybe<SubgraphApproval>;
  approvals: SubgraphApproval[];
  archController?: Maybe<SubgraphArchController>;
  archControllers: SubgraphArchController[];
  borrow?: Maybe<SubgraphBorrow>;
  borrowerRegistrationChange?: Maybe<SubgraphBorrowerRegistrationChange>;
  borrowerRegistrationChanges: SubgraphBorrowerRegistrationChange[];
  borrows: SubgraphBorrow[];
  controller?: Maybe<SubgraphController>;
  controllerAdded?: Maybe<SubgraphControllerAdded>;
  controllerAddeds: SubgraphControllerAdded[];
  controllerFactories: SubgraphControllerFactory[];
  controllerFactory?: Maybe<SubgraphControllerFactory>;
  controllerFactoryAdded?: Maybe<SubgraphControllerFactoryAdded>;
  controllerFactoryAddeds: SubgraphControllerFactoryAdded[];
  controllerFactoryRemoved?: Maybe<SubgraphControllerFactoryRemoved>;
  controllerFactoryRemoveds: SubgraphControllerFactoryRemoved[];
  controllerRemoved?: Maybe<SubgraphControllerRemoved>;
  controllerRemoveds: SubgraphControllerRemoved[];
  controllers: SubgraphController[];
  debtRepaid?: Maybe<SubgraphDebtRepaid>;
  debtRepaids: SubgraphDebtRepaid[];
  delinquencyStatusChanged?: Maybe<SubgraphDelinquencyStatusChanged>;
  delinquencyStatusChangeds: SubgraphDelinquencyStatusChanged[];
  deposit?: Maybe<SubgraphDeposit>;
  deposits: SubgraphDeposit[];
  disabledForceBuyBacks?: Maybe<SubgraphDisabledForceBuyBacks>;
  disabledForceBuyBacks_collection: SubgraphDisabledForceBuyBacks[];
  feesCollected?: Maybe<SubgraphFeesCollected>;
  feesCollecteds: SubgraphFeesCollected[];
  fixedTermUpdated?: Maybe<SubgraphFixedTermUpdated>;
  fixedTermUpdateds: SubgraphFixedTermUpdated[];
  forceBuyBack?: Maybe<SubgraphForceBuyBack>;
  forceBuyBacks: SubgraphForceBuyBack[];
  hooksConfig?: Maybe<SubgraphHooksConfig>;
  hooksConfigs: SubgraphHooksConfig[];
  hooksFactories: SubgraphHooksFactory[];
  hooksFactory?: Maybe<SubgraphHooksFactory>;
  hooksInstance?: Maybe<SubgraphHooksInstance>;
  hooksInstanceDeployed?: Maybe<SubgraphHooksInstanceDeployed>;
  hooksInstanceDeployeds: SubgraphHooksInstanceDeployed[];
  hooksInstances: SubgraphHooksInstance[];
  hooksNameUpdated?: Maybe<SubgraphHooksNameUpdated>;
  hooksNameUpdateds: SubgraphHooksNameUpdated[];
  hooksTemplate?: Maybe<SubgraphHooksTemplate>;
  hooksTemplateAdded?: Maybe<SubgraphHooksTemplateAdded>;
  hooksTemplateAddeds: SubgraphHooksTemplateAdded[];
  hooksTemplateDisabled?: Maybe<SubgraphHooksTemplateDisabled>;
  hooksTemplateDisableds: SubgraphHooksTemplateDisabled[];
  hooksTemplateFeesUpdated?: Maybe<SubgraphHooksTemplateFeesUpdated>;
  hooksTemplateFeesUpdateds: SubgraphHooksTemplateFeesUpdated[];
  hooksTemplates: SubgraphHooksTemplate[];
  knownLenderStatus?: Maybe<SubgraphKnownLenderStatus>;
  knownLenderStatuses: SubgraphKnownLenderStatus[];
  lenderAccount?: Maybe<SubgraphLenderAccount>;
  lenderAccounts: SubgraphLenderAccount[];
  lenderAuthorization?: Maybe<SubgraphLenderAuthorization>;
  lenderAuthorizationChange?: Maybe<SubgraphLenderAuthorizationChange>;
  lenderAuthorizationChanges: SubgraphLenderAuthorizationChange[];
  lenderAuthorizations: SubgraphLenderAuthorization[];
  lenderHooksAccess?: Maybe<SubgraphLenderHooksAccess>;
  lenderHooksAccesses: SubgraphLenderHooksAccess[];
  lenderInterestAccrued?: Maybe<SubgraphLenderInterestAccrued>;
  lenderInterestAccrueds: SubgraphLenderInterestAccrued[];
  lenderWithdrawalStatus?: Maybe<SubgraphLenderWithdrawalStatus>;
  lenderWithdrawalStatuses: SubgraphLenderWithdrawalStatus[];
  market?: Maybe<SubgraphMarket>;
  marketAdded?: Maybe<SubgraphMarketAdded>;
  marketAddeds: SubgraphMarketAdded[];
  marketClosed?: Maybe<SubgraphMarketClosed>;
  marketCloseds: SubgraphMarketClosed[];
  marketDeployed?: Maybe<SubgraphMarketDeployed>;
  marketDeployeds: SubgraphMarketDeployed[];
  marketInterestAccrued?: Maybe<SubgraphMarketInterestAccrued>;
  marketInterestAccrueds: SubgraphMarketInterestAccrued[];
  marketRemoved?: Maybe<SubgraphMarketRemoved>;
  marketRemoveds: SubgraphMarketRemoved[];
  markets: SubgraphMarket[];
  maxTotalSupplyUpdated?: Maybe<SubgraphMaxTotalSupplyUpdated>;
  maxTotalSupplyUpdateds: SubgraphMaxTotalSupplyUpdated[];
  minimumDepositUpdated?: Maybe<SubgraphMinimumDepositUpdated>;
  minimumDepositUpdateds: SubgraphMinimumDepositUpdated[];
  newController?: Maybe<SubgraphNewController>;
  newControllers: SubgraphNewController[];
  newSanctionsEscrow?: Maybe<SubgraphNewSanctionsEscrow>;
  newSanctionsEscrows: SubgraphNewSanctionsEscrow[];
  ownershipHandoverCanceled?: Maybe<SubgraphOwnershipHandoverCanceled>;
  ownershipHandoverCanceleds: SubgraphOwnershipHandoverCanceled[];
  ownershipHandoverRequested?: Maybe<SubgraphOwnershipHandoverRequested>;
  ownershipHandoverRequesteds: SubgraphOwnershipHandoverRequested[];
  ownershipTransferred?: Maybe<SubgraphOwnershipTransferred>;
  ownershipTransferreds: SubgraphOwnershipTransferred[];
  parameterConstraints?: Maybe<SubgraphParameterConstraints>;
  parameterConstraints_collection: SubgraphParameterConstraints[];
  protocolFeeBipsUpdated?: Maybe<SubgraphProtocolFeeBipsUpdated>;
  protocolFeeBipsUpdateds: SubgraphProtocolFeeBipsUpdated[];
  registeredBorrower?: Maybe<SubgraphRegisteredBorrower>;
  registeredBorrowers: SubgraphRegisteredBorrower[];
  reserveRatioBipsUpdated?: Maybe<SubgraphReserveRatioBipsUpdated>;
  reserveRatioBipsUpdateds: SubgraphReserveRatioBipsUpdated[];
  roleProvider?: Maybe<SubgraphRoleProvider>;
  roleProviderAdded?: Maybe<SubgraphRoleProviderAdded>;
  roleProviderAddeds: SubgraphRoleProviderAdded[];
  roleProviderRemoved?: Maybe<SubgraphRoleProviderRemoved>;
  roleProviderRemoveds: SubgraphRoleProviderRemoved[];
  roleProviderUpdated?: Maybe<SubgraphRoleProviderUpdated>;
  roleProviderUpdateds: SubgraphRoleProviderUpdated[];
  roleProviders: SubgraphRoleProvider[];
  sanctionOverride?: Maybe<SubgraphSanctionOverride>;
  sanctionOverrideRemoved?: Maybe<SubgraphSanctionOverrideRemoved>;
  sanctionOverrideRemoveds: SubgraphSanctionOverrideRemoved[];
  sanctionOverrides: SubgraphSanctionOverride[];
  sanctionedAccountAssetsQueuedForWithdrawal?: Maybe<SubgraphSanctionedAccountAssetsQueuedForWithdrawal>;
  sanctionedAccountAssetsQueuedForWithdrawals: SubgraphSanctionedAccountAssetsQueuedForWithdrawal[];
  sanctionedAccountAssetsSentToEscrow?: Maybe<SubgraphSanctionedAccountAssetsSentToEscrow>;
  sanctionedAccountAssetsSentToEscrows: SubgraphSanctionedAccountAssetsSentToEscrow[];
  sanctionedAccountWithdrawalSentToEscrow?: Maybe<SubgraphSanctionedAccountWithdrawalSentToEscrow>;
  sanctionedAccountWithdrawalSentToEscrows: SubgraphSanctionedAccountWithdrawalSentToEscrow[];
  subgraphVersion?: Maybe<SubgraphSubgraphVersion>;
  subgraphVersions: SubgraphSubgraphVersion[];
  token?: Maybe<SubgraphToken>;
  tokens: SubgraphToken[];
  transfer?: Maybe<SubgraphTransfer>;
  transfers: SubgraphTransfer[];
  updateProtocolFeeConfiguration?: Maybe<SubgraphUpdateProtocolFeeConfiguration>;
  updateProtocolFeeConfigurations: SubgraphUpdateProtocolFeeConfiguration[];
  withdrawalBatch?: Maybe<SubgraphWithdrawalBatch>;
  withdrawalBatchCreated?: Maybe<SubgraphWithdrawalBatchCreated>;
  withdrawalBatchCreateds: SubgraphWithdrawalBatchCreated[];
  withdrawalBatchExpired?: Maybe<SubgraphWithdrawalBatchExpired>;
  withdrawalBatchExpireds: SubgraphWithdrawalBatchExpired[];
  withdrawalBatchInterestAccrued?: Maybe<SubgraphWithdrawalBatchInterestAccrued>;
  withdrawalBatchInterestAccrueds: SubgraphWithdrawalBatchInterestAccrued[];
  withdrawalBatchPayment?: Maybe<SubgraphWithdrawalBatchPayment>;
  withdrawalBatchPayments: SubgraphWithdrawalBatchPayment[];
  withdrawalBatches: SubgraphWithdrawalBatch[];
  withdrawalExecution?: Maybe<SubgraphWithdrawalExecution>;
  withdrawalExecutions: SubgraphWithdrawalExecution[];
  withdrawalRequest?: Maybe<SubgraphWithdrawalRequest>;
  withdrawalRequests: SubgraphWithdrawalRequest[];
};

export type SubgraphSubscription_MetaArgs = SubgraphQuery_MetaArgs;

export type SubgraphSubscriptionAccountAccessGrantedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionAccountAccessGrantedsArgs = SubgraphQueryAccountAccessGrantedsArgs;

export type SubgraphSubscriptionAccountAccessRevokedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionAccountAccessRevokedsArgs = SubgraphQueryAccountAccessRevokedsArgs;

export type SubgraphSubscriptionAccountBlockedFromDepositsArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionAccountBlockedFromDeposits_CollectionArgs =
  SubgraphQueryAccountBlockedFromDeposits_CollectionArgs;

export type SubgraphSubscriptionAccountMadeFirstDepositArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionAccountMadeFirstDepositsArgs =
  SubgraphQueryAccountMadeFirstDepositsArgs;

export type SubgraphSubscriptionAccountUnblockedFromDepositsArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionAccountUnblockedFromDeposits_CollectionArgs =
  SubgraphQueryAccountUnblockedFromDeposits_CollectionArgs;

export type SubgraphSubscriptionAnnualInterestBipsUpdatedArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionAnnualInterestBipsUpdatedsArgs =
  SubgraphQueryAnnualInterestBipsUpdatedsArgs;

export type SubgraphSubscriptionApprovalArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionApprovalsArgs = SubgraphQueryApprovalsArgs;

export type SubgraphSubscriptionArchControllerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionArchControllersArgs = SubgraphQueryArchControllersArgs;

export type SubgraphSubscriptionBorrowArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionBorrowerRegistrationChangeArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionBorrowerRegistrationChangesArgs =
  SubgraphQueryBorrowerRegistrationChangesArgs;

export type SubgraphSubscriptionBorrowsArgs = SubgraphQueryBorrowsArgs;

export type SubgraphSubscriptionControllerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionControllerAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionControllerAddedsArgs = SubgraphQueryControllerAddedsArgs;

export type SubgraphSubscriptionControllerFactoriesArgs = SubgraphQueryControllerFactoriesArgs;

export type SubgraphSubscriptionControllerFactoryArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionControllerFactoryAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionControllerFactoryAddedsArgs =
  SubgraphQueryControllerFactoryAddedsArgs;

export type SubgraphSubscriptionControllerFactoryRemovedArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionControllerFactoryRemovedsArgs =
  SubgraphQueryControllerFactoryRemovedsArgs;

export type SubgraphSubscriptionControllerRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionControllerRemovedsArgs = SubgraphQueryControllerRemovedsArgs;

export type SubgraphSubscriptionControllersArgs = SubgraphQueryControllersArgs;

export type SubgraphSubscriptionDebtRepaidArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionDebtRepaidsArgs = SubgraphQueryDebtRepaidsArgs;

export type SubgraphSubscriptionDelinquencyStatusChangedArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionDelinquencyStatusChangedsArgs =
  SubgraphQueryDelinquencyStatusChangedsArgs;

export type SubgraphSubscriptionDepositArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionDepositsArgs = SubgraphQueryDepositsArgs;

export type SubgraphSubscriptionDisabledForceBuyBacksArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionDisabledForceBuyBacks_CollectionArgs =
  SubgraphQueryDisabledForceBuyBacks_CollectionArgs;

export type SubgraphSubscriptionFeesCollectedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionFeesCollectedsArgs = SubgraphQueryFeesCollectedsArgs;

export type SubgraphSubscriptionFixedTermUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionFixedTermUpdatedsArgs = SubgraphQueryFixedTermUpdatedsArgs;

export type SubgraphSubscriptionForceBuyBackArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionForceBuyBacksArgs = SubgraphQueryForceBuyBacksArgs;

export type SubgraphSubscriptionHooksConfigArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksConfigsArgs = SubgraphQueryHooksConfigsArgs;

export type SubgraphSubscriptionHooksFactoriesArgs = SubgraphQueryHooksFactoriesArgs;

export type SubgraphSubscriptionHooksFactoryArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksInstanceArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksInstanceDeployedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksInstanceDeployedsArgs =
  SubgraphQueryHooksInstanceDeployedsArgs;

export type SubgraphSubscriptionHooksInstancesArgs = SubgraphQueryHooksInstancesArgs;

export type SubgraphSubscriptionHooksNameUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksNameUpdatedsArgs = SubgraphQueryHooksNameUpdatedsArgs;

export type SubgraphSubscriptionHooksTemplateArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksTemplateAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksTemplateAddedsArgs = SubgraphQueryHooksTemplateAddedsArgs;

export type SubgraphSubscriptionHooksTemplateDisabledArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksTemplateDisabledsArgs =
  SubgraphQueryHooksTemplateDisabledsArgs;

export type SubgraphSubscriptionHooksTemplateFeesUpdatedArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionHooksTemplateFeesUpdatedsArgs =
  SubgraphQueryHooksTemplateFeesUpdatedsArgs;

export type SubgraphSubscriptionHooksTemplatesArgs = SubgraphQueryHooksTemplatesArgs;

export type SubgraphSubscriptionKnownLenderStatusArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionKnownLenderStatusesArgs = SubgraphQueryKnownLenderStatusesArgs;

export type SubgraphSubscriptionLenderAccountArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionLenderAccountsArgs = SubgraphQueryLenderAccountsArgs;

export type SubgraphSubscriptionLenderAuthorizationArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionLenderAuthorizationChangeArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionLenderAuthorizationChangesArgs =
  SubgraphQueryLenderAuthorizationChangesArgs;

export type SubgraphSubscriptionLenderAuthorizationsArgs = SubgraphQueryLenderAuthorizationsArgs;

export type SubgraphSubscriptionLenderHooksAccessArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionLenderHooksAccessesArgs = SubgraphQueryLenderHooksAccessesArgs;

export type SubgraphSubscriptionLenderInterestAccruedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionLenderInterestAccruedsArgs =
  SubgraphQueryLenderInterestAccruedsArgs;

export type SubgraphSubscriptionLenderWithdrawalStatusArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionLenderWithdrawalStatusesArgs =
  SubgraphQueryLenderWithdrawalStatusesArgs;

export type SubgraphSubscriptionMarketArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMarketAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMarketAddedsArgs = SubgraphQueryMarketAddedsArgs;

export type SubgraphSubscriptionMarketClosedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMarketClosedsArgs = SubgraphQueryMarketClosedsArgs;

export type SubgraphSubscriptionMarketDeployedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMarketDeployedsArgs = SubgraphQueryMarketDeployedsArgs;

export type SubgraphSubscriptionMarketInterestAccruedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMarketInterestAccruedsArgs =
  SubgraphQueryMarketInterestAccruedsArgs;

export type SubgraphSubscriptionMarketRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMarketRemovedsArgs = SubgraphQueryMarketRemovedsArgs;

export type SubgraphSubscriptionMarketsArgs = SubgraphQueryMarketsArgs;

export type SubgraphSubscriptionMaxTotalSupplyUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMaxTotalSupplyUpdatedsArgs =
  SubgraphQueryMaxTotalSupplyUpdatedsArgs;

export type SubgraphSubscriptionMinimumDepositUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionMinimumDepositUpdatedsArgs =
  SubgraphQueryMinimumDepositUpdatedsArgs;

export type SubgraphSubscriptionNewControllerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionNewControllersArgs = SubgraphQueryNewControllersArgs;

export type SubgraphSubscriptionNewSanctionsEscrowArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionNewSanctionsEscrowsArgs = SubgraphQueryNewSanctionsEscrowsArgs;

export type SubgraphSubscriptionOwnershipHandoverCanceledArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionOwnershipHandoverCanceledsArgs =
  SubgraphQueryOwnershipHandoverCanceledsArgs;

export type SubgraphSubscriptionOwnershipHandoverRequestedArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionOwnershipHandoverRequestedsArgs =
  SubgraphQueryOwnershipHandoverRequestedsArgs;

export type SubgraphSubscriptionOwnershipTransferredArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionOwnershipTransferredsArgs = SubgraphQueryOwnershipTransferredsArgs;

export type SubgraphSubscriptionParameterConstraintsArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionParameterConstraints_CollectionArgs =
  SubgraphQueryParameterConstraints_CollectionArgs;

export type SubgraphSubscriptionProtocolFeeBipsUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionProtocolFeeBipsUpdatedsArgs =
  SubgraphQueryProtocolFeeBipsUpdatedsArgs;

export type SubgraphSubscriptionRegisteredBorrowerArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionRegisteredBorrowersArgs = SubgraphQueryRegisteredBorrowersArgs;

export type SubgraphSubscriptionReserveRatioBipsUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionReserveRatioBipsUpdatedsArgs =
  SubgraphQueryReserveRatioBipsUpdatedsArgs;

export type SubgraphSubscriptionRoleProviderArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionRoleProviderAddedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionRoleProviderAddedsArgs = SubgraphQueryRoleProviderAddedsArgs;

export type SubgraphSubscriptionRoleProviderRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionRoleProviderRemovedsArgs = SubgraphQueryRoleProviderRemovedsArgs;

export type SubgraphSubscriptionRoleProviderUpdatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionRoleProviderUpdatedsArgs = SubgraphQueryRoleProviderUpdatedsArgs;

export type SubgraphSubscriptionRoleProvidersArgs = SubgraphQueryRoleProvidersArgs;

export type SubgraphSubscriptionSanctionOverrideArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionSanctionOverrideRemovedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionSanctionOverrideRemovedsArgs =
  SubgraphQuerySanctionOverrideRemovedsArgs;

export type SubgraphSubscriptionSanctionOverridesArgs = SubgraphQuerySanctionOverridesArgs;

export type SubgraphSubscriptionSanctionedAccountAssetsQueuedForWithdrawalArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionSanctionedAccountAssetsQueuedForWithdrawalsArgs =
  SubgraphQuerySanctionedAccountAssetsQueuedForWithdrawalsArgs;

export type SubgraphSubscriptionSanctionedAccountAssetsSentToEscrowArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionSanctionedAccountAssetsSentToEscrowsArgs =
  SubgraphQuerySanctionedAccountAssetsSentToEscrowsArgs;

export type SubgraphSubscriptionSanctionedAccountWithdrawalSentToEscrowArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionSanctionedAccountWithdrawalSentToEscrowsArgs =
  SubgraphQuerySanctionedAccountWithdrawalSentToEscrowsArgs;

export type SubgraphSubscriptionSubgraphVersionArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionSubgraphVersionsArgs = SubgraphQuerySubgraphVersionsArgs;

export type SubgraphSubscriptionTokenArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionTokensArgs = SubgraphQueryTokensArgs;

export type SubgraphSubscriptionTransferArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionTransfersArgs = SubgraphQueryTransfersArgs;

export type SubgraphSubscriptionUpdateProtocolFeeConfigurationArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionUpdateProtocolFeeConfigurationsArgs =
  SubgraphQueryUpdateProtocolFeeConfigurationsArgs;

export type SubgraphSubscriptionWithdrawalBatchArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalBatchCreatedArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalBatchCreatedsArgs =
  SubgraphQueryWithdrawalBatchCreatedsArgs;

export type SubgraphSubscriptionWithdrawalBatchExpiredArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalBatchExpiredsArgs =
  SubgraphQueryWithdrawalBatchExpiredsArgs;

export type SubgraphSubscriptionWithdrawalBatchInterestAccruedArgs =
  SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalBatchInterestAccruedsArgs =
  SubgraphQueryWithdrawalBatchInterestAccruedsArgs;

export type SubgraphSubscriptionWithdrawalBatchPaymentArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalBatchPaymentsArgs =
  SubgraphQueryWithdrawalBatchPaymentsArgs;

export type SubgraphSubscriptionWithdrawalBatchesArgs = SubgraphQueryWithdrawalBatchesArgs;

export type SubgraphSubscriptionWithdrawalExecutionArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalExecutionsArgs = SubgraphQueryWithdrawalExecutionsArgs;

export type SubgraphSubscriptionWithdrawalRequestArgs = SubgraphQueryAccountAccessGrantedArgs;

export type SubgraphSubscriptionWithdrawalRequestsArgs = SubgraphQueryWithdrawalRequestsArgs;

export type SubgraphToken = {
  __typename: "Token";
  address: Scalars["Bytes"]["output"];
  decimals: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  isMock: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  symbol: Scalars["String"]["output"];
};

export type SubgraphToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphToken_Filter>>>;
  decimals?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  decimals_lt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_lte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isMock?: InputMaybe<Scalars["Boolean"]["input"]>;
  isMock_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isMock_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isMock_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphToken_Filter>>>;
  symbol?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_lte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum SubgraphToken_OrderBy {
  Address = "address",
  Decimals = "decimals",
  Id = "id",
  IsMock = "isMock",
  Name = "name",
  Symbol = "symbol"
}

export type SubgraphTransfer = {
  __typename: "Transfer";
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  from: SubgraphLenderAccount;
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  scaledAmount: Scalars["BigInt"]["output"];
  to: SubgraphLenderAccount;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<SubgraphTransfer_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  from?: InputMaybe<Scalars["String"]["input"]>;
  from_?: InputMaybe<SubgraphLenderAccount_Filter>;
  from_contains?: InputMaybe<Scalars["String"]["input"]>;
  from_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  from_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_gt?: InputMaybe<Scalars["String"]["input"]>;
  from_gte?: InputMaybe<Scalars["String"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  from_lt?: InputMaybe<Scalars["String"]["input"]>;
  from_lte?: InputMaybe<Scalars["String"]["input"]>;
  from_not?: InputMaybe<Scalars["String"]["input"]>;
  from_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  from_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  from_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  from_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  from_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  from_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphTransfer_Filter>>>;
  scaledAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  to?: InputMaybe<Scalars["String"]["input"]>;
  to_?: InputMaybe<SubgraphLenderAccount_Filter>;
  to_contains?: InputMaybe<Scalars["String"]["input"]>;
  to_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  to_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_gt?: InputMaybe<Scalars["String"]["input"]>;
  to_gte?: InputMaybe<Scalars["String"]["input"]>;
  to_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  to_lt?: InputMaybe<Scalars["String"]["input"]>;
  to_lte?: InputMaybe<Scalars["String"]["input"]>;
  to_not?: InputMaybe<Scalars["String"]["input"]>;
  to_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  to_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  to_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  to_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  to_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  to_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphTransfer_OrderBy {
  Amount = "amount",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  From = "from",
  FromAddedTimestamp = "from__addedTimestamp",
  FromAddress = "from__address",
  FromId = "from__id",
  FromLastScaleFactor = "from__lastScaleFactor",
  FromLastUpdatedTimestamp = "from__lastUpdatedTimestamp",
  FromNumPendingWithdrawalBatches = "from__numPendingWithdrawalBatches",
  FromRole = "from__role",
  FromScaledBalance = "from__scaledBalance",
  FromTotalDeposited = "from__totalDeposited",
  FromTotalInterestEarned = "from__totalInterestEarned",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  ScaledAmount = "scaledAmount",
  To = "to",
  ToAddedTimestamp = "to__addedTimestamp",
  ToAddress = "to__address",
  ToId = "to__id",
  ToLastScaleFactor = "to__lastScaleFactor",
  ToLastUpdatedTimestamp = "to__lastUpdatedTimestamp",
  ToNumPendingWithdrawalBatches = "to__numPendingWithdrawalBatches",
  ToRole = "to__role",
  ToScaledBalance = "to__scaledBalance",
  ToTotalDeposited = "to__totalDeposited",
  ToTotalInterestEarned = "to__totalInterestEarned",
  TransactionHash = "transactionHash"
}

export type SubgraphUpdateProtocolFeeConfiguration = {
  __typename: "UpdateProtocolFeeConfiguration";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  feeRecipient: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset?: Maybe<SubgraphToken>;
  protocolFeeBips: Scalars["Int"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphUpdateProtocolFeeConfiguration_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphUpdateProtocolFeeConfiguration_Filter>>>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  feeRecipient?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  feeRecipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphUpdateProtocolFeeConfiguration_Filter>>>;
  originationFeeAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  originationFeeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  originationFeeAsset?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_?: InputMaybe<SubgraphToken_Filter>;
  originationFeeAsset_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  originationFeeAsset_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  originationFeeAsset_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  protocolFeeBips?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_gte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolFeeBips_lt?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_lte?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not?: InputMaybe<Scalars["Int"]["input"]>;
  protocolFeeBips_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphUpdateProtocolFeeConfiguration_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  FeeRecipient = "feeRecipient",
  Id = "id",
  OriginationFeeAmount = "originationFeeAmount",
  OriginationFeeAsset = "originationFeeAsset",
  OriginationFeeAssetAddress = "originationFeeAsset__address",
  OriginationFeeAssetDecimals = "originationFeeAsset__decimals",
  OriginationFeeAssetId = "originationFeeAsset__id",
  OriginationFeeAssetIsMock = "originationFeeAsset__isMock",
  OriginationFeeAssetName = "originationFeeAsset__name",
  OriginationFeeAssetSymbol = "originationFeeAsset__symbol",
  ProtocolFeeBips = "protocolFeeBips",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatch = {
  __typename: "WithdrawalBatch";
  completedWithdrawalsCount: Scalars["Int"]["output"];
  creation: SubgraphWithdrawalBatchCreated;
  executions: SubgraphWithdrawalExecution[];
  expiry: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  interestAccrualRecords: SubgraphWithdrawalBatchInterestAccrued[];
  isClosed: Scalars["Boolean"]["output"];
  isCompleted: Scalars["Boolean"]["output"];
  isExpired: Scalars["Boolean"]["output"];
  lastScaleFactor: Scalars["BigInt"]["output"];
  lastUpdatedTimestamp: Scalars["Int"]["output"];
  lenderWithdrawalsCount: Scalars["Int"]["output"];
  market: SubgraphMarket;
  normalizedAmountClaimed: Scalars["BigInt"]["output"];
  normalizedAmountPaid: Scalars["BigInt"]["output"];
  payments: SubgraphWithdrawalBatchPayment[];
  paymentsCount: Scalars["Int"]["output"];
  requests: SubgraphWithdrawalRequest[];
  scaledAmountBurned: Scalars["BigInt"]["output"];
  scaledTotalAmount: Scalars["BigInt"]["output"];
  totalInterestEarned: Scalars["BigInt"]["output"];
  totalNormalizedRequests: Scalars["BigInt"]["output"];
  withdrawals: SubgraphLenderWithdrawalStatus[];
};

export type SubgraphWithdrawalBatchExecutionsArgs = SubgraphLenderWithdrawalStatusExecutionsArgs;

export type SubgraphWithdrawalBatchInterestAccrualRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_Filter>;
};

export type SubgraphWithdrawalBatchPaymentsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchPayment_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphWithdrawalBatchPayment_Filter>;
};

export type SubgraphWithdrawalBatchRequestsArgs = SubgraphLenderWithdrawalStatusRequestsArgs;

export type SubgraphWithdrawalBatchWithdrawalsArgs = SubgraphLenderAccountWithdrawalsArgs;

export type SubgraphWithdrawalBatchCreated = {
  __typename: "WithdrawalBatchCreated";
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphWithdrawalBatchCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchCreated_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchCreated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphWithdrawalBatchCreated_OrderBy {
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatchExpired = {
  __typename: "WithdrawalBatchExpired";
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  normalizedAmountOwed: Scalars["BigInt"]["output"];
  normalizedAmountPaid: Scalars["BigInt"]["output"];
  scaledAmountBurned: Scalars["BigInt"]["output"];
  scaledTotalAmount: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphWithdrawalBatchExpired_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchExpired_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  normalizedAmountOwed?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountOwed_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountOwed_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountOwed_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountOwed_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountOwed_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountOwed_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountOwed_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountPaid?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountPaid_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchExpired_Filter>>>;
  scaledAmountBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmountBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledTotalAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledTotalAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphWithdrawalBatchExpired_OrderBy {
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  NormalizedAmountOwed = "normalizedAmountOwed",
  NormalizedAmountPaid = "normalizedAmountPaid",
  ScaledAmountBurned = "scaledAmountBurned",
  ScaledTotalAmount = "scaledTotalAmount",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatchInterestAccrued = {
  __typename: "WithdrawalBatchInterestAccrued";
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  interestEarned: Scalars["BigInt"]["output"];
  market: SubgraphMarket;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphWithdrawalBatchInterestAccrued_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchInterestAccrued_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  interestEarned?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  interestEarned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  interestEarned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchInterestAccrued_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphWithdrawalBatchInterestAccrued_OrderBy {
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  InterestEarned = "interestEarned",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatchPayment = {
  __typename: "WithdrawalBatchPayment";
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  normalizedAmountPaid: Scalars["BigInt"]["output"];
  scaledAmountBurned: Scalars["BigInt"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphWithdrawalBatchPayment_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchPayment_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  normalizedAmountPaid?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountPaid_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatchPayment_Filter>>>;
  scaledAmountBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmountBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphWithdrawalBatchPayment_OrderBy {
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  NormalizedAmountPaid = "normalizedAmountPaid",
  ScaledAmountBurned = "scaledAmountBurned",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatch_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatch_Filter>>>;
  completedWithdrawalsCount?: InputMaybe<Scalars["Int"]["input"]>;
  completedWithdrawalsCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  completedWithdrawalsCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  completedWithdrawalsCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  completedWithdrawalsCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  completedWithdrawalsCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  completedWithdrawalsCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  completedWithdrawalsCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  creation_?: InputMaybe<SubgraphWithdrawalBatchCreated_Filter>;
  executions_?: InputMaybe<SubgraphWithdrawalExecution_Filter>;
  expiry?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  expiry_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  expiry_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  interestAccrualRecords_?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_Filter>;
  isClosed?: InputMaybe<Scalars["Boolean"]["input"]>;
  isClosed_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isClosed_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isClosed_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isCompleted?: InputMaybe<Scalars["Boolean"]["input"]>;
  isCompleted_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isCompleted_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isCompleted_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isExpired?: InputMaybe<Scalars["Boolean"]["input"]>;
  isExpired_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isExpired_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isExpired_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  lastScaleFactor?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastScaleFactor_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastScaleFactor_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdatedTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lastUpdatedTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  lastUpdatedTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lenderWithdrawalsCount?: InputMaybe<Scalars["Int"]["input"]>;
  lenderWithdrawalsCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lenderWithdrawalsCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lenderWithdrawalsCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lenderWithdrawalsCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lenderWithdrawalsCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lenderWithdrawalsCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  lenderWithdrawalsCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  normalizedAmountClaimed?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountClaimed_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountClaimed_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountClaimed_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountClaimed_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountClaimed_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountClaimed_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountClaimed_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountPaid?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmountPaid_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmountPaid_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalBatch_Filter>>>;
  paymentsCount?: InputMaybe<Scalars["Int"]["input"]>;
  paymentsCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  paymentsCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  paymentsCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  paymentsCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  paymentsCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  paymentsCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  paymentsCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  payments_?: InputMaybe<SubgraphWithdrawalBatchPayment_Filter>;
  requests_?: InputMaybe<SubgraphWithdrawalRequest_Filter>;
  scaledAmountBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmountBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmountBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledTotalAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledTotalAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledTotalAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalInterestEarned?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalInterestEarned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalInterestEarned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalNormalizedRequests?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalNormalizedRequests_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalNormalizedRequests_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  withdrawals_?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
};

export enum SubgraphWithdrawalBatch_OrderBy {
  CompletedWithdrawalsCount = "completedWithdrawalsCount",
  Creation = "creation",
  CreationBlockNumber = "creation__blockNumber",
  CreationBlockTimestamp = "creation__blockTimestamp",
  CreationId = "creation__id",
  CreationTransactionHash = "creation__transactionHash",
  Executions = "executions",
  Expiry = "expiry",
  Id = "id",
  InterestAccrualRecords = "interestAccrualRecords",
  IsClosed = "isClosed",
  IsCompleted = "isCompleted",
  IsExpired = "isExpired",
  LastScaleFactor = "lastScaleFactor",
  LastUpdatedTimestamp = "lastUpdatedTimestamp",
  LenderWithdrawalsCount = "lenderWithdrawalsCount",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NormalizedAmountClaimed = "normalizedAmountClaimed",
  NormalizedAmountPaid = "normalizedAmountPaid",
  Payments = "payments",
  PaymentsCount = "paymentsCount",
  Requests = "requests",
  ScaledAmountBurned = "scaledAmountBurned",
  ScaledTotalAmount = "scaledTotalAmount",
  TotalInterestEarned = "totalInterestEarned",
  TotalNormalizedRequests = "totalNormalizedRequests",
  Withdrawals = "withdrawals"
}

export type SubgraphWithdrawalExecution = {
  __typename: "WithdrawalExecution";
  account: SubgraphLenderAccount;
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  normalizedAmount: Scalars["BigInt"]["output"];
  status: SubgraphLenderWithdrawalStatus;
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphWithdrawalExecution_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderAccount_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalExecution_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  normalizedAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalExecution_Filter>>>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  status_?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
  status_contains?: InputMaybe<Scalars["String"]["input"]>;
  status_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  status_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_gt?: InputMaybe<Scalars["String"]["input"]>;
  status_gte?: InputMaybe<Scalars["String"]["input"]>;
  status_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status_lt?: InputMaybe<Scalars["String"]["input"]>;
  status_lte?: InputMaybe<Scalars["String"]["input"]>;
  status_not?: InputMaybe<Scalars["String"]["input"]>;
  status_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  status_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  status_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  status_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  status_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum SubgraphWithdrawalExecution_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountAddress = "account__address",
  AccountId = "account__id",
  AccountLastScaleFactor = "account__lastScaleFactor",
  AccountLastUpdatedTimestamp = "account__lastUpdatedTimestamp",
  AccountNumPendingWithdrawalBatches = "account__numPendingWithdrawalBatches",
  AccountRole = "account__role",
  AccountScaledBalance = "account__scaledBalance",
  AccountTotalDeposited = "account__totalDeposited",
  AccountTotalInterestEarned = "account__totalInterestEarned",
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Id = "id",
  NormalizedAmount = "normalizedAmount",
  Status = "status",
  StatusExecutionsCount = "status__executionsCount",
  StatusId = "status__id",
  StatusIsCompleted = "status__isCompleted",
  StatusNormalizedAmountWithdrawn = "status__normalizedAmountWithdrawn",
  StatusRequestsCount = "status__requestsCount",
  StatusScaledAmount = "status__scaledAmount",
  StatusTotalNormalizedRequests = "status__totalNormalizedRequests",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalRequest = {
  __typename: "WithdrawalRequest";
  account: SubgraphLenderAccount;
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  eventIndex: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
  normalizedAmount: Scalars["BigInt"]["output"];
  requestIndex: Scalars["Int"]["output"];
  scaledAmount: Scalars["BigInt"]["output"];
  status: SubgraphLenderWithdrawalStatus;
  transactionHash: Scalars["Bytes"]["output"];
  withdrawalRequestsIndex: Scalars["Int"]["output"];
};

export type SubgraphWithdrawalRequest_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<SubgraphLenderAccount_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalRequest_Filter>>>;
  batch?: InputMaybe<Scalars["String"]["input"]>;
  batch_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
  batch_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_gt?: InputMaybe<Scalars["String"]["input"]>;
  batch_gte?: InputMaybe<Scalars["String"]["input"]>;
  batch_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_lt?: InputMaybe<Scalars["String"]["input"]>;
  batch_lte?: InputMaybe<Scalars["String"]["input"]>;
  batch_not?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batch_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  batch_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["Int"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eventIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  eventIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  market?: InputMaybe<Scalars["String"]["input"]>;
  market_?: InputMaybe<SubgraphMarket_Filter>;
  market_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_gt?: InputMaybe<Scalars["String"]["input"]>;
  market_gte?: InputMaybe<Scalars["String"]["input"]>;
  market_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_lt?: InputMaybe<Scalars["String"]["input"]>;
  market_lte?: InputMaybe<Scalars["String"]["input"]>;
  market_not?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  market_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  market_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  market_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  normalizedAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  normalizedAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  normalizedAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<SubgraphWithdrawalRequest_Filter>>>;
  requestIndex?: InputMaybe<Scalars["Int"]["input"]>;
  requestIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  requestIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  requestIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  requestIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  requestIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  requestIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  requestIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  scaledAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scaledAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  scaledAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  status_?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
  status_contains?: InputMaybe<Scalars["String"]["input"]>;
  status_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  status_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_gt?: InputMaybe<Scalars["String"]["input"]>;
  status_gte?: InputMaybe<Scalars["String"]["input"]>;
  status_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status_lt?: InputMaybe<Scalars["String"]["input"]>;
  status_lte?: InputMaybe<Scalars["String"]["input"]>;
  status_not?: InputMaybe<Scalars["String"]["input"]>;
  status_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  status_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  status_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  status_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  status_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  status_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  withdrawalRequestsIndex?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalRequestsIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalRequestsIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export enum SubgraphWithdrawalRequest_OrderBy {
  Account = "account",
  AccountAddedTimestamp = "account__addedTimestamp",
  AccountAddress = "account__address",
  AccountId = "account__id",
  AccountLastScaleFactor = "account__lastScaleFactor",
  AccountLastUpdatedTimestamp = "account__lastUpdatedTimestamp",
  AccountNumPendingWithdrawalBatches = "account__numPendingWithdrawalBatches",
  AccountRole = "account__role",
  AccountScaledBalance = "account__scaledBalance",
  AccountTotalDeposited = "account__totalDeposited",
  AccountTotalInterestEarned = "account__totalInterestEarned",
  Batch = "batch",
  BatchCompletedWithdrawalsCount = "batch__completedWithdrawalsCount",
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsCompleted = "batch__isCompleted",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
  BatchLenderWithdrawalsCount = "batch__lenderWithdrawalsCount",
  BatchNormalizedAmountClaimed = "batch__normalizedAmountClaimed",
  BatchNormalizedAmountPaid = "batch__normalizedAmountPaid",
  BatchPaymentsCount = "batch__paymentsCount",
  BatchScaledAmountBurned = "batch__scaledAmountBurned",
  BatchScaledTotalAmount = "batch__scaledTotalAmount",
  BatchTotalInterestEarned = "batch__totalInterestEarned",
  BatchTotalNormalizedRequests = "batch__totalNormalizedRequests",
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  EventIndex = "eventIndex",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketAnnualInterestBipsUpdatedIndex = "market__annualInterestBipsUpdatedIndex",
  MarketBorrowIndex = "market__borrowIndex",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDebtRepaidIndex = "market__debtRepaidIndex",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketDelinquencyStatusChangedIndex = "market__delinquencyStatusChangedIndex",
  MarketDepositIndex = "market__depositIndex",
  MarketEventIndex = "market__eventIndex",
  MarketFeeRecipient = "market__feeRecipient",
  MarketFeesCollectedIndex = "market__feesCollectedIndex",
  MarketFixedTermUpdatedIndex = "market__fixedTermUpdatedIndex",
  MarketForceBuyBackIndex = "market__forceBuyBackIndex",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsIncurringPenalties = "market__isIncurringPenalties",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketMaxTotalSupplyUpdatedIndex = "market__maxTotalSupplyUpdatedIndex",
  MarketMinimumDepositUpdatedIndex = "market__minimumDepositUpdatedIndex",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
  MarketProtocolFeeBipsUpdatedIndex = "market__protocolFeeBipsUpdatedIndex",
  MarketReserveRatioBips = "market__reserveRatioBips",
  MarketScaleFactor = "market__scaleFactor",
  MarketScaledPendingWithdrawals = "market__scaledPendingWithdrawals",
  MarketScaledTotalSupply = "market__scaledTotalSupply",
  MarketSentinel = "market__sentinel",
  MarketSymbol = "market__symbol",
  MarketTemporaryReserveRatioActive = "market__temporaryReserveRatioActive",
  MarketTemporaryReserveRatioExpiry = "market__temporaryReserveRatioExpiry",
  MarketTimeDelinquent = "market__timeDelinquent",
  MarketTotalBaseInterestAccrued = "market__totalBaseInterestAccrued",
  MarketTotalBorrowed = "market__totalBorrowed",
  MarketTotalDelinquencyFeesAccrued = "market__totalDelinquencyFeesAccrued",
  MarketTotalDeposited = "market__totalDeposited",
  MarketTotalProtocolFeesAccrued = "market__totalProtocolFeesAccrued",
  MarketTotalRepaid = "market__totalRepaid",
  MarketVersion = "market__version",
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  MarketWithdrawalRequestsIndex = "market__withdrawalRequestsIndex",
  NormalizedAmount = "normalizedAmount",
  RequestIndex = "requestIndex",
  ScaledAmount = "scaledAmount",
  Status = "status",
  StatusExecutionsCount = "status__executionsCount",
  StatusId = "status__id",
  StatusIsCompleted = "status__isCompleted",
  StatusNormalizedAmountWithdrawn = "status__normalizedAmountWithdrawn",
  StatusRequestsCount = "status__requestsCount",
  StatusScaledAmount = "status__scaledAmount",
  StatusTotalNormalizedRequests = "status__totalNormalizedRequests",
  TransactionHash = "transactionHash",
  WithdrawalRequestsIndex = "withdrawalRequestsIndex"
}

export type Subgraph_Block_ = {
  __typename: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /** The block number */
  number: Scalars["Int"]["output"];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars["Bytes"]["output"]>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
};

/** The type for the top-level _meta field */
export type Subgraph_Meta_ = {
  __typename: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: Subgraph_Block_;
  /** The deployment ID */
  deployment: Scalars["String"]["output"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"]["output"];
};

export enum Subgraph_SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny"
}

export type SubgraphTokenDataFragment = {
  __typename: "Token";
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isMock: boolean;
};

export type SubgraphRoleProviderDataFragment = {
  __typename: "RoleProvider";
  id: string;
  providerAddress: string;
  timeToLive: number;
  isPullProvider: boolean;
  pullProviderIndex: number;
  isPushProvider: boolean;
  pushProviderIndex: number;
  isApproved: boolean;
};

export type SubgraphLenderHooksAccessDataFragment = {
  __typename: "LenderHooksAccess";
  id: string;
  lender: string;
  isBlockedFromDeposits: boolean;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
  addedTimestamp: number;
  lastProvider?: SubgraphRoleProviderDataFragment | null;
};

export type SubgraphAccountDataForLenderViewFragment = {
  __typename: "LenderAccount";
  id: string;
  address: string;
  scaledBalance: string;
  role: SubgraphLenderStatus;
  totalDeposited: string;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  numPendingWithdrawalBatches: number;
  controllerAuthorization?: { __typename: "LenderAuthorization"; authorized: boolean } | null;
  hooksAccess?: SubgraphLenderHooksAccessDataFragment | null;
  knownLenderStatus?: { __typename: "KnownLenderStatus"; id: string } | null;
  deposits: SubgraphDepositDataFragment[];
};

export type SubgraphBasicLenderDataFragment = {
  __typename: "LenderAccount";
  id: string;
  address: string;
  scaledBalance: string;
  addedTimestamp: number;
  role: SubgraphLenderStatus;
  controllerAuthorization?: {
    __typename: "LenderAuthorization";
    authorized: boolean;
    addedTimestamp: number;
  } | null;
  hooksAccess?: SubgraphLenderHooksAccessDataFragment | null;
  knownLenderStatus?: { __typename: "KnownLenderStatus"; id: string } | null;
};

export type SubgraphLenderPropertiesFragment = {
  __typename: "LenderAccount";
  id: string;
  address: string;
  scaledBalance: string;
  role: SubgraphLenderStatus;
  totalDeposited: string;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  numPendingWithdrawalBatches: number;
};

export type SubgraphAllAuthorizedLendersViewFragment = {
  __typename: "LenderAuthorization";
  lender: string;
  authorized: boolean;
  changes: Array<{ __typename: "LenderAuthorizationChange"; blockTimestamp: number }>;
};

export type SubgraphMinimalControllerDataFragment = {
  __typename: "Controller";
  id: string;
  borrower: string;
  numMarkets: number;
  isRegistered: boolean;
  controllerFactory: {
    __typename: "ControllerFactory";
    id: string;
    feeRecipient: string;
    protocolFeeBips: number;
    originationFeeAmount: string;
    constraints: SubgraphParameterConstraintsDataFragment;
    originationFeeAsset?: SubgraphTokenDataFragment | null;
  };
  archController: { __typename: "ArchController"; id: string };
};

export type SubgraphMarketDataFragment = {
  __typename: "Market";
  id: string;
  version: SubgraphMarketVersion;
  isRegistered: boolean;
  isClosed: boolean;
  borrower: string;
  sentinel: string;
  feeRecipient: string;
  name: string;
  symbol: string;
  decimals: number;
  protocolFeeBips: number;
  delinquencyGracePeriod: number;
  delinquencyFeeBips: number;
  withdrawalBatchDuration: number;
  maxTotalSupply: string;
  pendingProtocolFees: string;
  normalizedUnclaimedWithdrawals: string;
  scaledTotalSupply: string;
  scaledPendingWithdrawals: string;
  pendingWithdrawalExpiry: string;
  isDelinquent: boolean;
  timeDelinquent: number;
  annualInterestBips: number;
  reserveRatioBips: number;
  scaleFactor: string;
  lastInterestAccruedTimestamp: number;
  originalAnnualInterestBips: number;
  originalReserveRatioBips: number;
  temporaryReserveRatioExpiry: number;
  temporaryReserveRatioActive: boolean;
  totalBorrowed: string;
  totalRepaid: string;
  totalBaseInterestAccrued: string;
  totalDelinquencyFeesAccrued: string;
  totalProtocolFeesAccrued: string;
  totalDeposited: string;
  eventIndex: number;
  controller?: { __typename: "Controller"; id: string } | null;
  _asset: SubgraphTokenDataFragment;
  hooksConfig?: SubgraphHooksConfigDataForMarketFragment | null;
  hooks?: SubgraphHooksInstanceDataFragment | null;
  deployedEvent: SubgraphMarketDeployedEventFragment;
};

export type SubgraphAprConstraintsFragment = {
  __typename: "ParameterConstraints";
  minimumAnnualInterestBips: number;
  maximumAnnualInterestBips: number;
};

export type SubgraphParameterConstraintsDataFragment = {
  __typename: "ParameterConstraints";
  minimumDelinquencyGracePeriod: number;
  maximumDelinquencyGracePeriod: number;
  minimumReserveRatioBips: number;
  maximumReserveRatioBips: number;
  minimumDelinquencyFeeBips: number;
  maximumDelinquencyFeeBips: number;
  minimumWithdrawalBatchDuration: number;
  maximumWithdrawalBatchDuration: number;
  minimumAnnualInterestBips: number;
  maximumAnnualInterestBips: number;
};

export type SubgraphDelinquencyStatusChangedDataFragment = {
  __typename: "DelinquencyStatusChanged";
  id: string;
  eventIndex: number;
  isDelinquent: boolean;
  liquidityCoverageRequired: string;
  totalAssets: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphDepositDataFragment = {
  __typename: "Deposit";
  id: string;
  eventIndex: number;
  assetAmount: string;
  scaledAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename: "LenderAccount"; address: string };
};

export type SubgraphMarketDeployedEventFragment = {
  __typename: "MarketDeployed";
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphMarketDataWithEventsFragment = {
  __typename: "Market";
  id: string;
  version: SubgraphMarketVersion;
  isRegistered: boolean;
  isClosed: boolean;
  borrower: string;
  sentinel: string;
  feeRecipient: string;
  name: string;
  symbol: string;
  decimals: number;
  protocolFeeBips: number;
  delinquencyGracePeriod: number;
  delinquencyFeeBips: number;
  withdrawalBatchDuration: number;
  maxTotalSupply: string;
  pendingProtocolFees: string;
  normalizedUnclaimedWithdrawals: string;
  scaledTotalSupply: string;
  scaledPendingWithdrawals: string;
  pendingWithdrawalExpiry: string;
  isDelinquent: boolean;
  timeDelinquent: number;
  annualInterestBips: number;
  reserveRatioBips: number;
  scaleFactor: string;
  lastInterestAccruedTimestamp: number;
  originalAnnualInterestBips: number;
  originalReserveRatioBips: number;
  temporaryReserveRatioExpiry: number;
  temporaryReserveRatioActive: boolean;
  totalBorrowed: string;
  totalRepaid: string;
  totalBaseInterestAccrued: string;
  totalDelinquencyFeesAccrued: string;
  totalProtocolFeesAccrued: string;
  totalDeposited: string;
  eventIndex: number;
  controller?: { __typename: "Controller"; id: string } | null;
  _asset: SubgraphTokenDataFragment;
  hooksConfig?: SubgraphHooksConfigDataForMarketFragment | null;
  hooks?: SubgraphHooksInstanceDataFragment | null;
  deployedEvent: SubgraphMarketDeployedEventFragment;
  depositRecords: SubgraphDepositDataFragment[];
  borrowRecords: SubgraphBorrowDataFragment[];
  feeCollectionRecords: SubgraphFeesCollectedDataFragment[];
  repaymentRecords: SubgraphRepaymentDataFragment[];
};

export type SubgraphWithdrawalBatchPaymentPropertiesFragment = {
  __typename: "WithdrawalBatchPayment";
  id: string;
  scaledAmountBurned: string;
  normalizedAmountPaid: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphWithdrawalRequestPropertiesFragment = {
  __typename: "WithdrawalRequest";
  id: string;
  eventIndex: number;
  requestIndex: number;
  scaledAmount: string;
  normalizedAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename: "LenderAccount"; address: string };
};

export type SubgraphWithdrawalExecutionPropertiesFragment = {
  __typename: "WithdrawalExecution";
  id: string;
  normalizedAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename: "LenderAccount"; address: string };
};

export type SubgraphLenderWithdrawalPropertiesFragment = {
  __typename: "LenderWithdrawalStatus";
  id: string;
  requestsCount: number;
  executionsCount: number;
  scaledAmount: string;
  normalizedAmountWithdrawn: string;
  totalNormalizedRequests: string;
  isCompleted: boolean;
  account: { __typename: "LenderAccount"; address: string };
};

export type SubgraphForceBuyBackDataFragment = {
  __typename: "ForceBuyBack";
  id: string;
  eventIndex: number;
  withdrawalExpiry: number;
  scaledAmount: string;
  normalizedAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename: "LenderAccount"; address: string };
};

export type SubgraphMinimumDepositUpdatedDataFragment = {
  __typename: "MinimumDepositUpdated";
  id: string;
  eventIndex: number;
  oldMinimumDeposit?: string | null;
  newMinimumDeposit: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphProtocolFeeBipsUpdatedDataFragment = {
  __typename: "ProtocolFeeBipsUpdated";
  id: string;
  protocolFeeBipsUpdatedIndex: number;
  eventIndex: number;
  oldProtocolFeeBips: number;
  newProtocolFeeBips: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphDisabledForceBuyBacksDataFragment = {
  __typename: "DisabledForceBuyBacks";
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  eventIndex: number;
};

export type SubgraphFixedTermUpdatedDataFragment = {
  __typename: "FixedTermUpdated";
  id: string;
  oldFixedTermEndTime: number;
  newFixedTermEndTime: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  eventIndex: number;
  fixedTermUpdatedIndex: number;
};

export type SubgraphLenderWithdrawalPropertiesWithEventsFragment = {
  __typename: "LenderWithdrawalStatus";
  id: string;
  requestsCount: number;
  executionsCount: number;
  scaledAmount: string;
  normalizedAmountWithdrawn: string;
  totalNormalizedRequests: string;
  isCompleted: boolean;
  batch: SubgraphWithdrawalBatchPropertiesFragment;
  requests: SubgraphWithdrawalRequestPropertiesFragment[];
  executions: SubgraphWithdrawalExecutionPropertiesFragment[];
  account: { __typename: "LenderAccount"; address: string };
};

export type SubgraphWithdrawalBatchPropertiesFragment = {
  __typename: "WithdrawalBatch";
  id: string;
  expiry: string;
  scaledTotalAmount: string;
  scaledAmountBurned: string;
  normalizedAmountPaid: string;
  normalizedAmountClaimed: string;
  totalNormalizedRequests: string;
  isExpired: boolean;
  isClosed: boolean;
  isCompleted: boolean;
  paymentsCount: number;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  creation: {
    __typename: "WithdrawalBatchCreated";
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  };
  payments: SubgraphWithdrawalBatchPaymentPropertiesFragment[];
};

export type SubgraphWithdrawalBatchPropertiesWithEventsFragment = {
  __typename: "WithdrawalBatch";
  id: string;
  expiry: string;
  scaledTotalAmount: string;
  scaledAmountBurned: string;
  normalizedAmountPaid: string;
  normalizedAmountClaimed: string;
  totalNormalizedRequests: string;
  isExpired: boolean;
  isClosed: boolean;
  isCompleted: boolean;
  paymentsCount: number;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  withdrawals: SubgraphLenderWithdrawalPropertiesFragment[];
  requests: SubgraphWithdrawalRequestPropertiesFragment[];
  executions: SubgraphWithdrawalExecutionPropertiesFragment[];
  creation: {
    __typename: "WithdrawalBatchCreated";
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  };
  payments: SubgraphWithdrawalBatchPaymentPropertiesFragment[];
};

export type SubgraphMarketRecordsFragment = {
  __typename: "Market";
  depositRecords: SubgraphDepositDataFragment[];
  borrowRecords: SubgraphBorrowDataFragment[];
  feeCollectionRecords: SubgraphFeesCollectedDataFragment[];
  repaymentRecords: SubgraphRepaymentDataFragment[];
};

export type SubgraphBorrowDataFragment = {
  __typename: "Borrow";
  eventIndex: number;
  assetAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphRepaymentDataFragment = {
  __typename: "DebtRepaid";
  eventIndex: number;
  from: string;
  assetAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphFeesCollectedDataFragment = {
  __typename: "FeesCollected";
  eventIndex: number;
  feesCollected: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphAnnualInterestBipsUpdatedDataFragment = {
  __typename: "AnnualInterestBipsUpdated";
  eventIndex: number;
  oldAnnualInterestBips: number;
  newAnnualInterestBips: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphMaxTotalSupplyUpdatedDataFragment = {
  __typename: "MaxTotalSupplyUpdated";
  eventIndex: number;
  oldMaxTotalSupply: string;
  newMaxTotalSupply: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphMarketClosedDataFragment = {
  __typename: "MarketClosed";
  eventIndex: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphHooksConfigDataForMarketFragment = {
  __typename: "HooksConfig";
  id: string;
  useOnDeposit: boolean;
  useOnQueueWithdrawal: boolean;
  useOnExecuteWithdrawal: boolean;
  useOnTransfer: boolean;
  useOnBorrow: boolean;
  useOnRepay: boolean;
  useOnCloseMarket: boolean;
  useOnNukeFromOrbit: boolean;
  useOnSetMaxTotalSupply: boolean;
  useOnSetAnnualInterestAndReserveRatioBips: boolean;
  useOnSetProtocolFeeBips: boolean;
  depositRequiresAccess: boolean;
  transferRequiresAccess: boolean;
  transfersDisabled: boolean;
  minimumDeposit?: string | null;
  allowForceBuyBacks: boolean;
  queueWithdrawalRequiresAccess: boolean;
  fixedTermEndTime: number;
  allowClosureBeforeTerm: boolean;
  allowTermReduction: boolean;
};

export type SubgraphHooksInstanceDataFragment = {
  __typename: "HooksInstance";
  id: string;
  borrower: string;
  name: string;
  kind: SubgraphHooksKind;
  numMarkets: number;
  eventIndex: number;
  hooksTemplate: SubgraphHooksTemplateDataFragment;
  providers: SubgraphRoleProviderDataFragment[];
};

export type SubgraphHooksTemplateDataFragment = {
  __typename: "HooksTemplate";
  id: string;
  name: string;
  feeRecipient: string;
  protocolFeeBips: number;
  originationFeeAmount: string;
  disabled: boolean;
  originationFeeAsset?: SubgraphTokenDataFragment | null;
};

export type SubgraphGetLenderAccountForMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  lender: Scalars["Bytes"]["input"];
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetLenderAccountForMarketQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    lenders: SubgraphAccountDataForLenderViewFragment[];
  } | null;
};

export type SubgraphGetLenderAccountWithMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  lender: Scalars["Bytes"]["input"];
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  skipBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  orderBorrows?: InputMaybe<SubgraphBorrow_OrderBy>;
  directionBorrows?: InputMaybe<SubgraphOrderDirection>;
  numRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  skipRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  orderRepayments?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  directionRepayments?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetLenderAccountWithMarketQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    id: string;
    version: SubgraphMarketVersion;
    isRegistered: boolean;
    isClosed: boolean;
    borrower: string;
    sentinel: string;
    feeRecipient: string;
    name: string;
    symbol: string;
    decimals: number;
    protocolFeeBips: number;
    delinquencyGracePeriod: number;
    delinquencyFeeBips: number;
    withdrawalBatchDuration: number;
    maxTotalSupply: string;
    pendingProtocolFees: string;
    normalizedUnclaimedWithdrawals: string;
    scaledTotalSupply: string;
    scaledPendingWithdrawals: string;
    pendingWithdrawalExpiry: string;
    isDelinquent: boolean;
    timeDelinquent: number;
    annualInterestBips: number;
    reserveRatioBips: number;
    scaleFactor: string;
    lastInterestAccruedTimestamp: number;
    originalAnnualInterestBips: number;
    originalReserveRatioBips: number;
    temporaryReserveRatioExpiry: number;
    temporaryReserveRatioActive: boolean;
    totalBorrowed: string;
    totalRepaid: string;
    totalBaseInterestAccrued: string;
    totalDelinquencyFeesAccrued: string;
    totalProtocolFeesAccrued: string;
    totalDeposited: string;
    eventIndex: number;
    lenders: SubgraphAccountDataForLenderViewFragment[];
    borrowRecords: SubgraphBorrowDataFragment[];
    repaymentRecords: SubgraphRepaymentDataFragment[];
    controller?: { __typename: "Controller"; id: string } | null;
    _asset: SubgraphTokenDataFragment;
    hooksConfig?: SubgraphHooksConfigDataForMarketFragment | null;
    hooks?: SubgraphHooksInstanceDataFragment | null;
    deployedEvent: SubgraphMarketDeployedEventFragment;
  } | null;
};

export type SubgraphGetBasicBorrowerDataQueryVariables = Exact<{
  borrower: Scalars["Bytes"]["input"];
}>;

export type SubgraphGetBasicBorrowerDataQuery = {
  __typename: "Query";
  registeredBorrowers: Array<{ __typename: "RegisteredBorrower"; isRegistered: boolean }>;
  markets: Array<{ __typename: "Market"; id: string }>;
};

export type SubgraphGetAllMarketsForLenderViewQueryVariables = Exact<{
  lender?: InputMaybe<Scalars["Bytes"]["input"]>;
  marketFilter?: InputMaybe<SubgraphMarket_Filter>;
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  orderMarkets?: InputMaybe<SubgraphMarket_OrderBy>;
  directionMarkets?: InputMaybe<SubgraphOrderDirection>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  skipBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  orderBorrows?: InputMaybe<SubgraphBorrow_OrderBy>;
  directionBorrows?: InputMaybe<SubgraphOrderDirection>;
  numRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  skipRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  orderRepayments?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  directionRepayments?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetAllMarketsForLenderViewQuery = {
  __typename: "Query";
  markets: Array<{
    __typename: "Market";
    id: string;
    version: SubgraphMarketVersion;
    isRegistered: boolean;
    isClosed: boolean;
    borrower: string;
    sentinel: string;
    feeRecipient: string;
    name: string;
    symbol: string;
    decimals: number;
    protocolFeeBips: number;
    delinquencyGracePeriod: number;
    delinquencyFeeBips: number;
    withdrawalBatchDuration: number;
    maxTotalSupply: string;
    pendingProtocolFees: string;
    normalizedUnclaimedWithdrawals: string;
    scaledTotalSupply: string;
    scaledPendingWithdrawals: string;
    pendingWithdrawalExpiry: string;
    isDelinquent: boolean;
    timeDelinquent: number;
    annualInterestBips: number;
    reserveRatioBips: number;
    scaleFactor: string;
    lastInterestAccruedTimestamp: number;
    originalAnnualInterestBips: number;
    originalReserveRatioBips: number;
    temporaryReserveRatioExpiry: number;
    temporaryReserveRatioActive: boolean;
    totalBorrowed: string;
    totalRepaid: string;
    totalBaseInterestAccrued: string;
    totalDelinquencyFeesAccrued: string;
    totalProtocolFeesAccrued: string;
    totalDeposited: string;
    eventIndex: number;
    borrowRecords: SubgraphBorrowDataFragment[];
    repaymentRecords: SubgraphRepaymentDataFragment[];
    lenders: SubgraphAccountDataForLenderViewFragment[];
    controller?: { __typename: "Controller"; id: string } | null;
    _asset: SubgraphTokenDataFragment;
    hooksConfig?: SubgraphHooksConfigDataForMarketFragment | null;
    hooks?: SubgraphHooksInstanceDataFragment | null;
    deployedEvent: SubgraphMarketDeployedEventFragment;
  }>;
  controllerAuthorizations: Array<{
    __typename: "LenderAuthorization";
    lender: string;
    authorized: boolean;
    controller: { __typename: "Controller"; markets: Array<{ __typename: "Market"; id: string }> };
  }>;
};

export type SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables = Exact<{
  lender: Scalars["Bytes"]["input"];
  accountFilter?: InputMaybe<SubgraphLenderAccount_Filter>;
  marketFilter?: InputMaybe<SubgraphMarket_Filter>;
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  orderMarkets?: InputMaybe<SubgraphMarket_OrderBy>;
  directionMarkets?: InputMaybe<SubgraphOrderDirection>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  skipBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  orderBorrows?: InputMaybe<SubgraphBorrow_OrderBy>;
  directionBorrows?: InputMaybe<SubgraphOrderDirection>;
  numRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  skipRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  orderRepayments?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  directionRepayments?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery = {
  __typename: "Query";
  lenderAccounts: Array<{
    __typename: "LenderAccount";
    id: string;
    address: string;
    scaledBalance: string;
    role: SubgraphLenderStatus;
    totalDeposited: string;
    lastScaleFactor: string;
    lastUpdatedTimestamp: number;
    totalInterestEarned: string;
    numPendingWithdrawalBatches: number;
    market: {
      __typename: "Market";
      id: string;
      version: SubgraphMarketVersion;
      isRegistered: boolean;
      isClosed: boolean;
      borrower: string;
      sentinel: string;
      feeRecipient: string;
      name: string;
      symbol: string;
      decimals: number;
      protocolFeeBips: number;
      delinquencyGracePeriod: number;
      delinquencyFeeBips: number;
      withdrawalBatchDuration: number;
      maxTotalSupply: string;
      pendingProtocolFees: string;
      normalizedUnclaimedWithdrawals: string;
      scaledTotalSupply: string;
      scaledPendingWithdrawals: string;
      pendingWithdrawalExpiry: string;
      isDelinquent: boolean;
      timeDelinquent: number;
      annualInterestBips: number;
      reserveRatioBips: number;
      scaleFactor: string;
      lastInterestAccruedTimestamp: number;
      originalAnnualInterestBips: number;
      originalReserveRatioBips: number;
      temporaryReserveRatioExpiry: number;
      temporaryReserveRatioActive: boolean;
      totalBorrowed: string;
      totalRepaid: string;
      totalBaseInterestAccrued: string;
      totalDelinquencyFeesAccrued: string;
      totalProtocolFeesAccrued: string;
      totalDeposited: string;
      eventIndex: number;
      borrowRecords: SubgraphBorrowDataFragment[];
      repaymentRecords: SubgraphRepaymentDataFragment[];
      controller?: { __typename: "Controller"; id: string } | null;
      _asset: SubgraphTokenDataFragment;
      hooksConfig?: SubgraphHooksConfigDataForMarketFragment | null;
      hooks?: SubgraphHooksInstanceDataFragment | null;
      deployedEvent: SubgraphMarketDeployedEventFragment;
    };
    controllerAuthorization?: { __typename: "LenderAuthorization"; authorized: boolean } | null;
    hooksAccess?: SubgraphLenderHooksAccessDataFragment | null;
    knownLenderStatus?: { __typename: "KnownLenderStatus"; id: string } | null;
    deposits: SubgraphDepositDataFragment[];
  }>;
  controllerAuthorizations: Array<{
    __typename: "LenderAuthorization";
    lender: string;
    authorized: boolean;
    controller: {
      __typename: "Controller";
      markets: Array<{
        __typename: "Market";
        id: string;
        version: SubgraphMarketVersion;
        isRegistered: boolean;
        isClosed: boolean;
        borrower: string;
        sentinel: string;
        feeRecipient: string;
        name: string;
        symbol: string;
        decimals: number;
        protocolFeeBips: number;
        delinquencyGracePeriod: number;
        delinquencyFeeBips: number;
        withdrawalBatchDuration: number;
        maxTotalSupply: string;
        pendingProtocolFees: string;
        normalizedUnclaimedWithdrawals: string;
        scaledTotalSupply: string;
        scaledPendingWithdrawals: string;
        pendingWithdrawalExpiry: string;
        isDelinquent: boolean;
        timeDelinquent: number;
        annualInterestBips: number;
        reserveRatioBips: number;
        scaleFactor: string;
        lastInterestAccruedTimestamp: number;
        originalAnnualInterestBips: number;
        originalReserveRatioBips: number;
        temporaryReserveRatioExpiry: number;
        temporaryReserveRatioActive: boolean;
        totalBorrowed: string;
        totalRepaid: string;
        totalBaseInterestAccrued: string;
        totalDelinquencyFeesAccrued: string;
        totalProtocolFeesAccrued: string;
        totalDeposited: string;
        eventIndex: number;
        borrowRecords: SubgraphBorrowDataFragment[];
        repaymentRecords: SubgraphRepaymentDataFragment[];
        controller?: { __typename: "Controller"; id: string } | null;
        _asset: SubgraphTokenDataFragment;
        hooksConfig?: SubgraphHooksConfigDataForMarketFragment | null;
        hooks?: SubgraphHooksInstanceDataFragment | null;
        deployedEvent: SubgraphMarketDeployedEventFragment;
      }>;
    };
  }>;
};

export type SubgraphGetLenderWithdrawalsForMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  lender: Scalars["Bytes"]["input"];
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SubgraphGetLenderWithdrawalsForMarketQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    lenders: Array<{
      __typename: "LenderAccount";
      incompleteWithdrawals: SubgraphLenderWithdrawalPropertiesWithEventsFragment[];
      completeWithdrawals: SubgraphLenderWithdrawalPropertiesWithEventsFragment[];
    }>;
  } | null;
};

export type SubgraphGetLenderAuthorizationByMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  lender: Scalars["Bytes"]["input"];
}>;

export type SubgraphGetLenderAuthorizationByMarketQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    controller?: {
      __typename: "Controller";
      authorizedLenders: Array<{
        __typename: "LenderAuthorization";
        lender: string;
        authorized: boolean;
      }>;
    } | null;
  } | null;
};

export type SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables = Exact<{
  lender: Scalars["Bytes"]["input"];
  minimumBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  accountFilter?: InputMaybe<SubgraphLenderAccount_Filter>;
  numAccounts?: InputMaybe<Scalars["Int"]["input"]>;
  skipAccounts?: InputMaybe<Scalars["Int"]["input"]>;
  orderAccounts?: InputMaybe<SubgraphLenderAccount_OrderBy>;
  directionAccounts?: InputMaybe<SubgraphOrderDirection>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery = {
  __typename: "Query";
  lenderAccounts: Array<{
    __typename: "LenderAccount";
    scaledBalance: string;
    role: SubgraphLenderStatus;
    totalDeposited: string;
    lastScaleFactor: string;
    totalInterestEarned: string;
    market: { __typename: "Market"; id: string };
    controllerAuthorization?: { __typename: "LenderAuthorization"; authorized: boolean } | null;
    withdrawals: SubgraphLenderWithdrawalPropertiesWithEventsFragment[];
    deposits: SubgraphDepositDataFragment[];
  }>;
};

export type SubgraphGetAllHooksTemplatesQueryVariables = Exact<{
  borrower?: InputMaybe<Scalars["Bytes"]["input"]>;
  includeBorrower: Scalars["Boolean"]["input"];
}>;

export type SubgraphGetAllHooksTemplatesQuery = {
  __typename: "Query";
  hooksTemplates: SubgraphHooksTemplateDataFragment[];
  registeredBorrowers?: Array<{ __typename: "RegisteredBorrower"; isRegistered: boolean }>;
};

export type SubgraphGetHooksInstancesForBorrowerQueryVariables = Exact<{
  borrower: Scalars["Bytes"]["input"];
}>;

export type SubgraphGetHooksInstancesForBorrowerQuery = {
  __typename: "Query";
  hooksInstances: SubgraphHooksInstanceDataFragment[];
};

export type SubgraphGetAllHooksDataForBorrowerQueryVariables = Exact<{
  borrower: Scalars["Bytes"]["input"];
}>;

export type SubgraphGetAllHooksDataForBorrowerQuery = {
  __typename: "Query";
  hooksTemplates: SubgraphHooksTemplateDataFragment[];
  hooksInstances: SubgraphHooksInstanceDataFragment[];
  registeredBorrowers: Array<{ __typename: "RegisteredBorrower"; isRegistered: boolean }>;
  controllers: SubgraphMinimalControllerDataFragment[];
};

export type SubgraphGetMarketEventsQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  startEventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  endEventIndex?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  delinquencyRecordsFilter?: InputMaybe<SubgraphDelinquencyStatusChanged_Filter>;
  borrowRecordsFilter?: InputMaybe<SubgraphBorrow_Filter>;
  depositRecordsFilter?: InputMaybe<SubgraphDeposit_Filter>;
  feeCollectionRecordsFilter?: InputMaybe<SubgraphFeesCollected_Filter>;
  repaymentRecordsFilter?: InputMaybe<SubgraphDebtRepaid_Filter>;
  annualInterestBipsUpdatedRecordsFilter?: InputMaybe<SubgraphAnnualInterestBipsUpdated_Filter>;
  maxTotalSupplyUpdatedRecordsFilter?: InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>;
  withdrawalRequestRecordsFilter?: InputMaybe<SubgraphWithdrawalRequest_Filter>;
  forceBuyBackRecordsFilter?: InputMaybe<SubgraphForceBuyBack_Filter>;
  minimumDepositUpdateRecordsFilter?: InputMaybe<SubgraphMinimumDepositUpdated_Filter>;
  protocolFeeBipsUpdatedRecordsFilter?: InputMaybe<SubgraphProtocolFeeBipsUpdated_Filter>;
  fixedTermUpdatedRecordsFilter?: InputMaybe<SubgraphFixedTermUpdated_Filter>;
}>;

export type SubgraphGetMarketEventsQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    marketClosedEvent?: SubgraphMarketClosedDataFragment | null;
    forceBuyBackDisabledRecord?: SubgraphDisabledForceBuyBacksDataFragment | null;
    delinquencyRecords: SubgraphDelinquencyStatusChangedDataFragment[];
    borrowRecords: SubgraphBorrowDataFragment[];
    depositRecords: SubgraphDepositDataFragment[];
    feeCollectionRecords: SubgraphFeesCollectedDataFragment[];
    repaymentRecords: SubgraphRepaymentDataFragment[];
    annualInterestBipsUpdatedRecords: SubgraphAnnualInterestBipsUpdatedDataFragment[];
    maxTotalSupplyUpdatedRecords: SubgraphMaxTotalSupplyUpdatedDataFragment[];
    withdrawalRequestRecords: SubgraphWithdrawalRequestPropertiesFragment[];
    forceBuyBackRecords: SubgraphForceBuyBackDataFragment[];
    minimumDepositUpdateRecords: SubgraphMinimumDepositUpdatedDataFragment[];
    protocolFeeBipsUpdatedRecords: SubgraphProtocolFeeBipsUpdatedDataFragment[];
    fixedTermUpdatedRecords: SubgraphFixedTermUpdatedDataFragment[];
  } | null;
};

export type SubgraphGetMarketsWithEventsQueryVariables = Exact<{
  marketFilter?: InputMaybe<SubgraphMarket_Filter>;
  shouldSkipRecords?: InputMaybe<Scalars["Boolean"]["input"]>;
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  orderMarkets?: InputMaybe<SubgraphMarket_OrderBy>;
  directionMarkets?: InputMaybe<SubgraphOrderDirection>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  skipBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  orderBorrows?: InputMaybe<SubgraphBorrow_OrderBy>;
  directionBorrows?: InputMaybe<SubgraphOrderDirection>;
  numFeeCollections?: InputMaybe<Scalars["Int"]["input"]>;
  skipFeeCollections?: InputMaybe<Scalars["Int"]["input"]>;
  orderFeeCollections?: InputMaybe<SubgraphFeesCollected_OrderBy>;
  directionFeeCollections?: InputMaybe<SubgraphOrderDirection>;
  numRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  skipRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  orderRepayments?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  directionRepayments?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetMarketsWithEventsQuery = {
  __typename: "Query";
  markets: SubgraphMarketDataWithEventsFragment[];
};

export type SubgraphGetMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  shouldSkipRecords?: InputMaybe<Scalars["Boolean"]["input"]>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  skipBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  orderBorrows?: InputMaybe<SubgraphBorrow_OrderBy>;
  directionBorrows?: InputMaybe<SubgraphOrderDirection>;
  numFeeCollections?: InputMaybe<Scalars["Int"]["input"]>;
  skipFeeCollections?: InputMaybe<Scalars["Int"]["input"]>;
  orderFeeCollections?: InputMaybe<SubgraphFeesCollected_OrderBy>;
  directionFeeCollections?: InputMaybe<SubgraphOrderDirection>;
  numRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  skipRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  orderRepayments?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  directionRepayments?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetMarketQuery = {
  __typename: "Query";
  market?: SubgraphMarketDataWithEventsFragment | null;
};

export type SubgraphGetWithdrawalRequestsByMarketQueryVariables = Exact<{
  market: Scalars["String"]["input"];
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  orderWithdrawals?: InputMaybe<SubgraphWithdrawalRequest_OrderBy>;
  directionWithdrawals?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetWithdrawalRequestsByMarketQuery = {
  __typename: "Query";
  withdrawalRequests: SubgraphWithdrawalRequestPropertiesFragment[];
};

export type SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
}>;

export type SubgraphGetAllPendingWithdrawalBatchesForMarketQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    withdrawalBatches: SubgraphWithdrawalBatchPropertiesWithEventsFragment[];
  } | null;
};

export type SubgraphGetIncompleteWithdrawalsForMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  numWithdrawalBatches?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawalBatches?: InputMaybe<Scalars["Int"]["input"]>;
  orderWithdrawalBatches?: InputMaybe<SubgraphWithdrawalBatch_OrderBy>;
  directionWithdrawalBatches?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetIncompleteWithdrawalsForMarketQuery =
  SubgraphGetAllPendingWithdrawalBatchesForMarketQuery;

export type SubgraphGetAllMarketsQueryVariables = Exact<{ [key: string]: never }>;

export type SubgraphGetAllMarketsQuery = {
  __typename: "Query";
  markets: SubgraphMarketDataFragment[];
};

export type SubgraphGetAuthorizedLendersByMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
}>;

export type SubgraphGetAuthorizedLendersByMarketQuery = {
  __typename: "Query";
  market?: {
    __typename: "Market";
    controller?: {
      __typename: "Controller";
      authorizedLenders: SubgraphAllAuthorizedLendersViewFragment[];
    } | null;
    lenders: Array<{
      __typename: "LenderAccount";
      address: string;
      scaledBalance: string;
      role: SubgraphLenderStatus;
    }>;
  } | null;
};

export type SubgraphGetAllAuthorizedLendersQueryVariables = Exact<{
  borrower: Scalars["Bytes"]["input"];
}>;

export type SubgraphGetAllAuthorizedLendersQuery = {
  __typename: "Query";
  markets: Array<{
    __typename: "Market";
    id: string;
    name: string;
    controller?: {
      __typename: "Controller";
      authorizedLenders: SubgraphAllAuthorizedLendersViewFragment[];
    } | null;
    hooks?: {
      __typename: "HooksInstance";
      lenders: SubgraphLenderHooksAccessDataFragment[];
    } | null;
  }>;
};

export type SubgraphGetV1AuthorizedLendersQueryVariables = Exact<{
  borrower: Scalars["Bytes"]["input"];
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  orderMarkets?: InputMaybe<SubgraphMarket_OrderBy>;
  directionMarkets?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetV1AuthorizedLendersQuery = {
  __typename: "Query";
  controllers: Array<{
    __typename: "Controller";
    markets: Array<{ __typename: "Market"; id: string; name: string }>;
    authorizedLenders: Array<{
      __typename: "LenderAuthorization";
      lender: string;
      authorized: boolean;
    }>;
  }>;
};

export type SubgraphV1LenderWithActiveMarketsFragment = {
  __typename: "LenderAuthorization";
  lender: string;
  authorized: boolean;
  addedTimestamp: number;
  marketAccounts: Array<{
    __typename: "LenderAccount";
    role: SubgraphLenderStatus;
    market: { __typename: "Market"; id: string; name: string };
  }>;
};

export type SubgraphV2LenderWithActiveMarketsFragment = {
  __typename: "LenderHooksAccess";
  addedTimestamp: number;
  id: string;
  lender: string;
  isBlockedFromDeposits: boolean;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
  marketAccounts: Array<{
    __typename: "LenderAccount";
    knownLenderStatus?: { __typename: "KnownLenderStatus"; id: string } | null;
    market: { __typename: "Market"; id: string; name: string };
  }>;
  lastProvider?: SubgraphRoleProviderDataFragment | null;
};

export type SubgraphControllerAuthorizedLendersWithActiveMarketsFragment = {
  __typename: "Controller";
  authorizedLenders: SubgraphV1LenderWithActiveMarketsFragment[];
};

export type SubgraphHooksInstanceLendersWithActiveMarketsFragment = {
  __typename: "HooksInstance";
  lenders: SubgraphV2LenderWithActiveMarketsFragment[];
};

export type SubgraphGetLendersByHooksInstanceOrControllerQueryVariables = Exact<{
  contractAddress: Scalars["ID"]["input"];
  isController: Scalars["Boolean"]["input"];
  lenderHooksAccessFilter?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  lenderAuthorizationFilter?: InputMaybe<SubgraphLenderAuthorization_Filter>;
  numMarketAccountsPerLender?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarketAccountsPerLender?: InputMaybe<Scalars["Int"]["input"]>;
  numLenders?: InputMaybe<Scalars["Int"]["input"]>;
  skipLenders?: InputMaybe<Scalars["Int"]["input"]>;
  orderLenderHooksAccess?: InputMaybe<SubgraphLenderHooksAccess_OrderBy>;
  directionLenders?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetLendersByHooksInstanceOrControllerQuery = {
  __typename: "Query";
  hooksInstance?: {
    __typename: "HooksInstance";
    id: string;
    borrower: string;
    name: string;
    kind: SubgraphHooksKind;
    numMarkets: number;
    eventIndex: number;
    hooksTemplate: SubgraphHooksTemplateDataFragment;
    providers: SubgraphRoleProviderDataFragment[];
    lenders: SubgraphV2LenderWithActiveMarketsFragment[];
  } | null;
  controller?: SubgraphControllerAuthorizedLendersWithActiveMarketsFragment | null;
};

export type SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables = Exact<{
  contractAddress: Scalars["ID"]["input"];
  marketFilter?: InputMaybe<SubgraphMarket_Filter>;
  numMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarkets?: InputMaybe<Scalars["Int"]["input"]>;
  orderMarkets?: InputMaybe<SubgraphMarket_OrderBy>;
  directionMarkets?: InputMaybe<SubgraphOrderDirection>;
  lenderHooksAccessFilter?: InputMaybe<SubgraphLenderHooksAccess_Filter>;
  lenderAuthorizationFilter?: InputMaybe<SubgraphLenderAuthorization_Filter>;
  numMarketAccountsPerLender?: InputMaybe<Scalars["Int"]["input"]>;
  skipMarketAccountsPerLender?: InputMaybe<Scalars["Int"]["input"]>;
  numLenders?: InputMaybe<Scalars["Int"]["input"]>;
  skipLenders?: InputMaybe<Scalars["Int"]["input"]>;
  orderLenderHooksAccess?: InputMaybe<SubgraphLenderHooksAccess_OrderBy>;
  directionLenders?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQuery = {
  __typename: "Query";
  hooksInstance?: {
    __typename: "HooksInstance";
    id: string;
    borrower: string;
    name: string;
    kind: SubgraphHooksKind;
    numMarkets: number;
    eventIndex: number;
    markets: SubgraphMarketDataFragment[];
    hooksTemplate: SubgraphHooksTemplateDataFragment;
    providers: SubgraphRoleProviderDataFragment[];
    lenders: SubgraphV2LenderWithActiveMarketsFragment[];
  } | null;
  controller?: {
    __typename: "Controller";
    id: string;
    borrower: string;
    numMarkets: number;
    isRegistered: boolean;
    markets: SubgraphMarketDataFragment[];
    controllerFactory: {
      __typename: "ControllerFactory";
      id: string;
      feeRecipient: string;
      protocolFeeBips: number;
      originationFeeAmount: string;
      constraints: SubgraphParameterConstraintsDataFragment;
      originationFeeAsset?: SubgraphTokenDataFragment | null;
    };
    archController: { __typename: "ArchController"; id: string };
    authorizedLenders: SubgraphV1LenderWithActiveMarketsFragment[];
  } | null;
};

export type SubgraphGetActiveLendersByMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  accountFilter?: InputMaybe<SubgraphLenderAccount_Filter>;
  numAccounts?: InputMaybe<Scalars["Int"]["input"]>;
  skipAccounts?: InputMaybe<Scalars["Int"]["input"]>;
  orderAccounts?: InputMaybe<SubgraphLenderAccount_OrderBy>;
  directionAccounts?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetActiveLendersByMarketQuery = {
  __typename: "Query";
  market?: { __typename: "Market"; lenders: SubgraphBasicLenderDataFragment[] } | null;
};

export type SubgraphGetAuthorizedLendersByBorrowerQueryVariables = Exact<{
  filter: SubgraphController_Filter;
}>;

export type SubgraphGetAuthorizedLendersByBorrowerQuery = {
  __typename: "Query";
  controllers: Array<{
    __typename: "Controller";
    authorizedLenders: Array<{ __typename: "LenderAuthorization"; lender: string }>;
  }>;
};

export type SubgraphGetSubgraphStatusQueryVariables = Exact<{ [key: string]: never }>;

export type SubgraphGetSubgraphStatusQuery = {
  __typename: "Query";
  _meta?: {
    __typename: "_Meta_";
    hasIndexingErrors: boolean;
    block: {
      __typename: "_Block_";
      hash?: string | null;
      number: number;
      timestamp?: number | null;
    };
  } | null;
};

export type SubgraphGetMarketRecordsQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  skipBorrows?: InputMaybe<Scalars["Int"]["input"]>;
  orderBorrows?: InputMaybe<SubgraphBorrow_OrderBy>;
  directionBorrows?: InputMaybe<SubgraphOrderDirection>;
  numFeeCollections?: InputMaybe<Scalars["Int"]["input"]>;
  skipFeeCollections?: InputMaybe<Scalars["Int"]["input"]>;
  orderFeeCollections?: InputMaybe<SubgraphFeesCollected_OrderBy>;
  directionFeeCollections?: InputMaybe<SubgraphOrderDirection>;
  numRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  skipRepayments?: InputMaybe<Scalars["Int"]["input"]>;
  orderRepayments?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  directionRepayments?: InputMaybe<SubgraphOrderDirection>;
}>;

export type SubgraphGetMarketRecordsQuery = {
  __typename: "Query";
  market?: SubgraphMarketRecordsFragment | null;
};

export type SubgraphGetAllTokensWithMarketsQueryVariables = Exact<{ [key: string]: never }>;

export type SubgraphGetAllTokensWithMarketsQuery = {
  __typename: "Query";
  tokens: Array<{
    __typename: "Token";
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  }>;
};

export const LenderPropertiesFragmentDoc = gql`
  fragment LenderProperties on LenderAccount {
    id
    address
    scaledBalance
    role
    totalDeposited
    lastScaleFactor
    lastUpdatedTimestamp
    totalInterestEarned
    numPendingWithdrawalBatches
  }
`;
export const RoleProviderDataFragmentDoc = gql`
  fragment RoleProviderData on RoleProvider {
    id
    providerAddress
    timeToLive
    isPullProvider
    pullProviderIndex
    isPushProvider
    pushProviderIndex
    isApproved
  }
`;
export const LenderHooksAccessDataFragmentDoc = gql`
  fragment LenderHooksAccessData on LenderHooksAccess {
    id
    lender
    isBlockedFromDeposits
    lastProvider {
      ...RoleProviderData
    }
    canRefresh
    lastApprovalTimestamp
    addedTimestamp
  }
`;
export const DepositDataFragmentDoc = gql`
  fragment DepositData on Deposit {
    id
    eventIndex
    account {
      address
    }
    assetAmount
    scaledAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const AccountDataForLenderViewFragmentDoc = gql`
  fragment AccountDataForLenderView on LenderAccount {
    ...LenderProperties
    controllerAuthorization {
      authorized
    }
    hooksAccess {
      ...LenderHooksAccessData
    }
    knownLenderStatus {
      id
    }
    deposits(
      first: $numDeposits
      skip: $skipDeposits
      orderBy: $orderDeposits
      orderDirection: $directionDeposits
    ) {
      ...DepositData
    }
  }
`;
export const BasicLenderDataFragmentDoc = gql`
  fragment BasicLenderData on LenderAccount {
    id
    address
    scaledBalance
    addedTimestamp
    role
    controllerAuthorization {
      authorized
      addedTimestamp
    }
    hooksAccess {
      ...LenderHooksAccessData
    }
    knownLenderStatus {
      id
    }
  }
`;
export const AllAuthorizedLendersViewFragmentDoc = gql`
  fragment AllAuthorizedLendersView on LenderAuthorization {
    lender
    authorized
    changes(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
      blockTimestamp
    }
  }
`;
export const ParameterConstraintsDataFragmentDoc = gql`
  fragment ParameterConstraintsData on ParameterConstraints {
    minimumDelinquencyGracePeriod
    maximumDelinquencyGracePeriod
    minimumReserveRatioBips
    maximumReserveRatioBips
    minimumDelinquencyFeeBips
    maximumDelinquencyFeeBips
    minimumWithdrawalBatchDuration
    maximumWithdrawalBatchDuration
    minimumAnnualInterestBips
    maximumAnnualInterestBips
  }
`;
export const TokenDataFragmentDoc = gql`
  fragment TokenData on Token {
    id
    address
    name
    symbol
    decimals
    isMock
  }
`;
export const MinimalControllerDataFragmentDoc = gql`
  fragment MinimalControllerData on Controller {
    id
    borrower
    numMarkets
    controllerFactory {
      id
      constraints {
        ...ParameterConstraintsData
      }
      feeRecipient
      protocolFeeBips
      originationFeeAsset {
        ...TokenData
      }
      originationFeeAmount
    }
    archController {
      id
    }
    isRegistered
  }
`;
export const AprConstraintsFragmentDoc = gql`
  fragment AprConstraints on ParameterConstraints {
    minimumAnnualInterestBips
    maximumAnnualInterestBips
  }
`;
export const DelinquencyStatusChangedDataFragmentDoc = gql`
  fragment DelinquencyStatusChangedData on DelinquencyStatusChanged {
    id
    eventIndex
    isDelinquent
    liquidityCoverageRequired
    totalAssets
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const HooksConfigDataForMarketFragmentDoc = gql`
  fragment HooksConfigDataForMarket on HooksConfig {
    id
    useOnDeposit
    useOnQueueWithdrawal
    useOnExecuteWithdrawal
    useOnTransfer
    useOnBorrow
    useOnRepay
    useOnCloseMarket
    useOnNukeFromOrbit
    useOnSetMaxTotalSupply
    useOnSetAnnualInterestAndReserveRatioBips
    useOnSetProtocolFeeBips
    depositRequiresAccess
    transferRequiresAccess
    transfersDisabled
    minimumDeposit
    allowForceBuyBacks
    queueWithdrawalRequiresAccess
    fixedTermEndTime
    allowClosureBeforeTerm
    allowTermReduction
  }
`;
export const HooksTemplateDataFragmentDoc = gql`
  fragment HooksTemplateData on HooksTemplate {
    id
    name
    feeRecipient
    protocolFeeBips
    originationFeeAsset {
      ...TokenData
    }
    originationFeeAmount
    disabled
  }
`;
export const HooksInstanceDataFragmentDoc = gql`
  fragment HooksInstanceData on HooksInstance {
    id
    borrower
    name
    kind
    numMarkets
    hooksTemplate {
      ...HooksTemplateData
    }
    providers {
      ...RoleProviderData
    }
    eventIndex
  }
`;
export const MarketDeployedEventFragmentDoc = gql`
  fragment MarketDeployedEvent on MarketDeployed {
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const MarketDataFragmentDoc = gql`
  fragment MarketData on Market {
    id
    version
    isRegistered
    isClosed
    controller {
      id
    }
    borrower
    sentinel
    feeRecipient
    name
    symbol
    decimals
    protocolFeeBips
    delinquencyGracePeriod
    delinquencyFeeBips
    withdrawalBatchDuration
    _asset: asset {
      ...TokenData
    }
    hooksConfig {
      ...HooksConfigDataForMarket
    }
    hooks {
      ...HooksInstanceData
    }
    maxTotalSupply
    pendingProtocolFees
    normalizedUnclaimedWithdrawals
    scaledTotalSupply
    scaledPendingWithdrawals
    pendingWithdrawalExpiry
    isDelinquent
    timeDelinquent
    annualInterestBips
    reserveRatioBips
    scaleFactor
    lastInterestAccruedTimestamp
    originalAnnualInterestBips
    originalReserveRatioBips
    temporaryReserveRatioExpiry
    temporaryReserveRatioActive
    totalBorrowed
    totalRepaid
    totalBaseInterestAccrued
    totalDelinquencyFeesAccrued
    totalProtocolFeesAccrued
    totalDeposited
    eventIndex
    deployedEvent {
      ...MarketDeployedEvent
    }
  }
`;
export const BorrowDataFragmentDoc = gql`
  fragment BorrowData on Borrow {
    eventIndex
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const FeesCollectedDataFragmentDoc = gql`
  fragment FeesCollectedData on FeesCollected {
    eventIndex
    feesCollected
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const RepaymentDataFragmentDoc = gql`
  fragment RepaymentData on DebtRepaid {
    eventIndex
    from
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const MarketRecordsFragmentDoc = gql`
  fragment MarketRecords on Market {
    depositRecords(
      first: $numDeposits
      skip: $skipDeposits
      orderBy: $orderDeposits
      orderDirection: $directionDeposits
    ) {
      ...DepositData
    }
    borrowRecords(
      first: $numBorrows
      skip: $skipBorrows
      orderBy: $orderBorrows
      orderDirection: $directionBorrows
    ) {
      ...BorrowData
    }
    feeCollectionRecords(
      first: $numFeeCollections
      skip: $skipFeeCollections
      orderBy: $orderFeeCollections
      orderDirection: $directionFeeCollections
    ) {
      ...FeesCollectedData
    }
    repaymentRecords(
      first: $numRepayments
      skip: $skipRepayments
      orderBy: $orderRepayments
      orderDirection: $directionRepayments
    ) {
      ...RepaymentData
    }
  }
`;
export const MarketDataWithEventsFragmentDoc = gql`
  fragment MarketDataWithEvents on Market {
    ...MarketData
    ...MarketRecords @skip(if: $shouldSkipRecords)
  }
`;
export const ForceBuyBackDataFragmentDoc = gql`
  fragment ForceBuyBackData on ForceBuyBack {
    id
    account {
      address
    }
    eventIndex
    withdrawalExpiry
    scaledAmount
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const MinimumDepositUpdatedDataFragmentDoc = gql`
  fragment MinimumDepositUpdatedData on MinimumDepositUpdated {
    id
    eventIndex
    oldMinimumDeposit
    newMinimumDeposit
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const ProtocolFeeBipsUpdatedDataFragmentDoc = gql`
  fragment ProtocolFeeBipsUpdatedData on ProtocolFeeBipsUpdated {
    id
    protocolFeeBipsUpdatedIndex
    eventIndex
    oldProtocolFeeBips
    newProtocolFeeBips
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const DisabledForceBuyBacksDataFragmentDoc = gql`
  fragment DisabledForceBuyBacksData on DisabledForceBuyBacks {
    id
    blockNumber
    blockTimestamp
    transactionHash
    eventIndex
  }
`;
export const FixedTermUpdatedDataFragmentDoc = gql`
  fragment FixedTermUpdatedData on FixedTermUpdated {
    id
    oldFixedTermEndTime
    newFixedTermEndTime
    blockNumber
    blockTimestamp
    transactionHash
    eventIndex
    fixedTermUpdatedIndex
  }
`;
export const LenderWithdrawalPropertiesFragmentDoc = gql`
  fragment LenderWithdrawalProperties on LenderWithdrawalStatus {
    id
    account {
      address
    }
    requestsCount
    executionsCount
    scaledAmount
    normalizedAmountWithdrawn
    totalNormalizedRequests
    isCompleted
  }
`;
export const WithdrawalBatchPaymentPropertiesFragmentDoc = gql`
  fragment WithdrawalBatchPaymentProperties on WithdrawalBatchPayment {
    id
    scaledAmountBurned
    normalizedAmountPaid
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const WithdrawalBatchPropertiesFragmentDoc = gql`
  fragment WithdrawalBatchProperties on WithdrawalBatch {
    id
    expiry
    scaledTotalAmount
    scaledAmountBurned
    normalizedAmountPaid
    normalizedAmountClaimed
    totalNormalizedRequests
    isExpired
    isClosed
    isCompleted
    paymentsCount
    lastScaleFactor
    lastUpdatedTimestamp
    totalInterestEarned
    creation {
      blockNumber
      blockTimestamp
      transactionHash
    }
    payments {
      ...WithdrawalBatchPaymentProperties
    }
  }
`;
export const WithdrawalRequestPropertiesFragmentDoc = gql`
  fragment WithdrawalRequestProperties on WithdrawalRequest {
    id
    eventIndex
    requestIndex
    account {
      address
    }
    scaledAmount
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const WithdrawalExecutionPropertiesFragmentDoc = gql`
  fragment WithdrawalExecutionProperties on WithdrawalExecution {
    id
    account {
      address
    }
    normalizedAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const LenderWithdrawalPropertiesWithEventsFragmentDoc = gql`
  fragment LenderWithdrawalPropertiesWithEvents on LenderWithdrawalStatus {
    ...LenderWithdrawalProperties
    batch {
      ...WithdrawalBatchProperties
    }
    requests {
      ...WithdrawalRequestProperties
    }
    executions {
      ...WithdrawalExecutionProperties
    }
  }
`;
export const WithdrawalBatchPropertiesWithEventsFragmentDoc = gql`
  fragment WithdrawalBatchPropertiesWithEvents on WithdrawalBatch {
    ...WithdrawalBatchProperties
    withdrawals {
      ...LenderWithdrawalProperties
    }
    requests {
      ...WithdrawalRequestProperties
    }
    executions {
      ...WithdrawalExecutionProperties
    }
  }
`;
export const AnnualInterestBipsUpdatedDataFragmentDoc = gql`
  fragment AnnualInterestBipsUpdatedData on AnnualInterestBipsUpdated {
    eventIndex
    oldAnnualInterestBips
    newAnnualInterestBips
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const MaxTotalSupplyUpdatedDataFragmentDoc = gql`
  fragment MaxTotalSupplyUpdatedData on MaxTotalSupplyUpdated {
    eventIndex
    oldMaxTotalSupply
    newMaxTotalSupply
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const MarketClosedDataFragmentDoc = gql`
  fragment MarketClosedData on MarketClosed {
    eventIndex
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const V1LenderWithActiveMarketsFragmentDoc = gql`
  fragment V1LenderWithActiveMarkets on LenderAuthorization {
    lender
    authorized
    addedTimestamp
    marketAccounts(first: $numMarketAccountsPerLender, skip: $skipMarketAccountsPerLender) {
      role
      market {
        id
        name
      }
    }
  }
`;
export const ControllerAuthorizedLendersWithActiveMarketsFragmentDoc = gql`
  fragment ControllerAuthorizedLendersWithActiveMarkets on Controller {
    authorizedLenders(first: $numLenders, skip: $skipLenders, where: $lenderAuthorizationFilter) {
      ...V1LenderWithActiveMarkets
    }
  }
`;
export const V2LenderWithActiveMarketsFragmentDoc = gql`
  fragment V2LenderWithActiveMarkets on LenderHooksAccess {
    ...LenderHooksAccessData
    addedTimestamp
    marketAccounts(first: $numMarketAccountsPerLender, skip: $skipMarketAccountsPerLender) {
      knownLenderStatus {
        id
      }
      market {
        id
        name
      }
    }
  }
`;
export const HooksInstanceLendersWithActiveMarketsFragmentDoc = gql`
  fragment HooksInstanceLendersWithActiveMarkets on HooksInstance {
    lenders(
      first: $numLenders
      skip: $skipLenders
      orderBy: $orderLenderHooksAccess
      orderDirection: $directionLenders
      where: $lenderHooksAccessFilter
    ) {
      ...V2LenderWithActiveMarkets
    }
  }
`;
export const GetLenderAccountForMarketDocument = gql`
  query getLenderAccountForMarket(
    $market: ID!
    $lender: Bytes!
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
  ) {
    market(id: $market) {
      lenders(where: { address: $lender }) {
        ...AccountDataForLenderView
      }
    }
  }
  ${AccountDataForLenderViewFragmentDoc}
  ${LenderPropertiesFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${DepositDataFragmentDoc}
`;
export type GetLenderAccountForMarketQueryResult = Apollo.QueryResult<
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables
>;
export const GetLenderAccountWithMarketDocument = gql`
  query getLenderAccountWithMarket(
    $market: ID!
    $lender: Bytes!
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    market(id: $market) {
      lenders(where: { address: $lender }) {
        ...AccountDataForLenderView
      }
      ...MarketData
      borrowRecords(
        first: $numBorrows
        skip: $skipBorrows
        orderBy: $orderBorrows
        orderDirection: $directionBorrows
      ) {
        ...BorrowData
      }
      repaymentRecords(
        first: $numRepayments
        skip: $skipRepayments
        orderBy: $orderRepayments
        orderDirection: $directionRepayments
      ) {
        ...RepaymentData
      }
    }
  }
  ${AccountDataForLenderViewFragmentDoc}
  ${LenderPropertiesFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${DepositDataFragmentDoc}
  ${MarketDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;
export type GetLenderAccountWithMarketQueryResult = Apollo.QueryResult<
  SubgraphGetLenderAccountWithMarketQuery,
  SubgraphGetLenderAccountWithMarketQueryVariables
>;
export const GetBasicBorrowerDataDocument = gql`
  query getBasicBorrowerData($borrower: Bytes!) {
    registeredBorrowers(where: { borrower: $borrower }, first: 1) {
      isRegistered
    }
    markets(where: { borrower: $borrower }, first: 1) {
      id
    }
  }
`;
export type GetBasicBorrowerDataQueryResult = Apollo.QueryResult<
  SubgraphGetBasicBorrowerDataQuery,
  SubgraphGetBasicBorrowerDataQueryVariables
>;
export const GetAllMarketsForLenderViewDocument = gql`
  query getAllMarketsForLenderView(
    $lender: Bytes
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    markets(
      where: $marketFilter
      orderBy: $orderMarkets
      orderDirection: $directionMarkets
      first: $numMarkets
      skip: $skipMarkets
    ) {
      ...MarketData
      borrowRecords(
        first: $numBorrows
        skip: $skipBorrows
        orderBy: $orderBorrows
        orderDirection: $directionBorrows
      ) {
        ...BorrowData
      }
      repaymentRecords(
        first: $numRepayments
        skip: $skipRepayments
        orderBy: $orderRepayments
        orderDirection: $directionRepayments
      ) {
        ...RepaymentData
      }
      lenders(where: { address: $lender }, first: 1) {
        ...AccountDataForLenderView
      }
    }
    controllerAuthorizations: lenderAuthorizations(
      where: { and: [{ lender: $lender }, { authorized: true }] }
    ) {
      lender
      authorized
      controller {
        markets {
          id
        }
      }
    }
  }
  ${MarketDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
  ${AccountDataForLenderViewFragmentDoc}
  ${LenderPropertiesFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${DepositDataFragmentDoc}
`;
export type GetAllMarketsForLenderViewQueryResult = Apollo.QueryResult<
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
>;
export const GetAccountsWhereLenderAuthorizedOrActiveDocument = gql`
  query getAccountsWhereLenderAuthorizedOrActive(
    $lender: Bytes!
    $accountFilter: LenderAccount_filter = { address_not: null }
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    lenderAccounts(
      where: {
        and: [
          $accountFilter
          { address: $lender }
          {
            or: [
              { role_in: [DepositAndWithdraw, WithdrawOnly] }
              { scaledBalance_gt: 0 }
              { controllerAuthorization_: { authorized: true } }
              { knownLenderStatus_: { id_not: null } }
              { hooksAccess_: { lastApprovalTimestamp_gt: 0 } }
              { totalDeposited_gt: 0 }
            ]
          }
        ]
      }
    ) {
      ...AccountDataForLenderView
      market {
        ...MarketData
        borrowRecords(
          first: $numBorrows
          skip: $skipBorrows
          orderBy: $orderBorrows
          orderDirection: $directionBorrows
        ) {
          ...BorrowData
        }
        repaymentRecords(
          first: $numRepayments
          skip: $skipRepayments
          orderBy: $orderRepayments
          orderDirection: $directionRepayments
        ) {
          ...RepaymentData
        }
      }
    }
    controllerAuthorizations: lenderAuthorizations(
      where: { and: [{ lender: $lender }, { authorized: true }] }
    ) {
      lender
      authorized
      controller {
        markets {
          ...MarketData
          borrowRecords(
            first: $numBorrows
            skip: $skipBorrows
            orderBy: $orderBorrows
            orderDirection: $directionBorrows
          ) {
            ...BorrowData
          }
          repaymentRecords(
            first: $numRepayments
            skip: $skipRepayments
            orderBy: $orderRepayments
            orderDirection: $directionRepayments
          ) {
            ...RepaymentData
          }
        }
      }
    }
  }
  ${AccountDataForLenderViewFragmentDoc}
  ${LenderPropertiesFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${DepositDataFragmentDoc}
  ${MarketDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;
export type GetAccountsWhereLenderAuthorizedOrActiveQueryResult = Apollo.QueryResult<
  SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
  SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
>;
export const GetLenderWithdrawalsForMarketDocument = gql`
  query getLenderWithdrawalsForMarket(
    $market: ID!
    $lender: Bytes!
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
  ) {
    market(id: $market) {
      lenders(where: { address: $lender }) {
        incompleteWithdrawals: withdrawals(
          first: $numWithdrawals
          skip: $skipWithdrawals
          where: { isCompleted: false }
        ) {
          ...LenderWithdrawalPropertiesWithEvents
        }
        completeWithdrawals: withdrawals(
          first: $numWithdrawals
          skip: $skipWithdrawals
          where: { isCompleted: true }
        ) {
          ...LenderWithdrawalPropertiesWithEvents
        }
      }
    }
  }
  ${LenderWithdrawalPropertiesWithEventsFragmentDoc}
  ${LenderWithdrawalPropertiesFragmentDoc}
  ${WithdrawalBatchPropertiesFragmentDoc}
  ${WithdrawalBatchPaymentPropertiesFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${WithdrawalExecutionPropertiesFragmentDoc}
`;
export type GetLenderWithdrawalsForMarketQueryResult = Apollo.QueryResult<
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables
>;
export const GetLenderAuthorizationByMarketDocument = gql`
  query getLenderAuthorizationByMarket($market: ID!, $lender: Bytes!) {
    market(id: $market) {
      controller {
        authorizedLenders(where: { lender: $lender }) {
          lender
          authorized
        }
      }
    }
  }
`;
export type GetLenderAuthorizationByMarketQueryResult = Apollo.QueryResult<
  SubgraphGetLenderAuthorizationByMarketQuery,
  SubgraphGetLenderAuthorizationByMarketQueryVariables
>;
export const GetMarketsAndLogsWhereLenderAuthorizedOrActiveDocument = gql`
  query getMarketsAndLogsWhereLenderAuthorizedOrActive(
    $lender: Bytes!
    $minimumBalance: BigInt = 1
    $accountFilter: LenderAccount_filter = { address_not: null }
    $numAccounts: Int = 1000
    $skipAccounts: Int = 0
    $orderAccounts: LenderAccount_orderBy = lastUpdatedTimestamp
    $directionAccounts: OrderDirection = desc
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
  ) {
    lenderAccounts(
      where: {
        and: [
          {
            address: $lender
            or: [
              { role_in: [DepositAndWithdraw, WithdrawOnly] }
              { scaledBalance_gt: $minimumBalance }
              { controllerAuthorization_: { authorized: true } }
            ]
          }
          $accountFilter
        ]
      }
      first: $numAccounts
      skip: $skipAccounts
      orderBy: $orderAccounts
      orderDirection: $directionAccounts
    ) {
      market {
        id
      }
      scaledBalance
      role
      totalDeposited
      lastScaleFactor
      totalInterestEarned
      controllerAuthorization {
        authorized
      }
      withdrawals(first: $numWithdrawals, skip: $skipWithdrawals, where: { isCompleted: false }) {
        ...LenderWithdrawalProperties
        batch {
          ...WithdrawalBatchProperties
        }
        requests {
          ...WithdrawalRequestProperties
        }
        executions {
          ...WithdrawalExecutionProperties
        }
      }
      deposits(
        first: $numDeposits
        skip: $skipDeposits
        orderBy: $orderDeposits
        orderDirection: $directionDeposits
      ) {
        ...DepositData
      }
    }
  }
  ${LenderWithdrawalPropertiesFragmentDoc}
  ${WithdrawalBatchPropertiesFragmentDoc}
  ${WithdrawalBatchPaymentPropertiesFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${WithdrawalExecutionPropertiesFragmentDoc}
  ${DepositDataFragmentDoc}
`;
export type GetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryResult = Apollo.QueryResult<
  SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
  SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
>;
export const GetAllHooksTemplatesDocument = gql`
  query getAllHooksTemplates($borrower: Bytes, $includeBorrower: Boolean!) {
    hooksTemplates {
      ...HooksTemplateData
    }
    registeredBorrowers(where: { borrower: $borrower }, first: 1) @include(if: $includeBorrower) {
      isRegistered
    }
  }
  ${HooksTemplateDataFragmentDoc}
  ${TokenDataFragmentDoc}
`;
export type GetAllHooksTemplatesQueryResult = Apollo.QueryResult<
  SubgraphGetAllHooksTemplatesQuery,
  SubgraphGetAllHooksTemplatesQueryVariables
>;
export const GetHooksInstancesForBorrowerDocument = gql`
  query getHooksInstancesForBorrower($borrower: Bytes!) {
    hooksInstances(where: { borrower: $borrower }) {
      ...HooksInstanceData
    }
  }
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
`;
export type GetHooksInstancesForBorrowerQueryResult = Apollo.QueryResult<
  SubgraphGetHooksInstancesForBorrowerQuery,
  SubgraphGetHooksInstancesForBorrowerQueryVariables
>;
export const GetAllHooksDataForBorrowerDocument = gql`
  query getAllHooksDataForBorrower($borrower: Bytes!) {
    hooksTemplates {
      ...HooksTemplateData
    }
    hooksInstances(where: { borrower: $borrower }) {
      ...HooksInstanceData
    }
    registeredBorrowers(where: { borrower: $borrower }, first: 1) {
      isRegistered
    }
    controllers(where: { borrower: $borrower }, first: 1) {
      ...MinimalControllerData
    }
  }
  ${HooksTemplateDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${MinimalControllerDataFragmentDoc}
  ${ParameterConstraintsDataFragmentDoc}
`;
export type GetAllHooksDataForBorrowerQueryResult = Apollo.QueryResult<
  SubgraphGetAllHooksDataForBorrowerQuery,
  SubgraphGetAllHooksDataForBorrowerQueryVariables
>;
export const GetMarketEventsDocument = gql`
  query getMarketEvents(
    $market: ID!
    $startEventIndex: Int = 0
    $endEventIndex: Int = 100000000
    $limit: Int = 10
    $delinquencyRecordsFilter: DelinquencyStatusChanged_filter = { id_not: null }
    $borrowRecordsFilter: Borrow_filter = { id_not: null }
    $depositRecordsFilter: Deposit_filter = { id_not: null }
    $feeCollectionRecordsFilter: FeesCollected_filter = { id_not: null }
    $repaymentRecordsFilter: DebtRepaid_filter = { id_not: null }
    $annualInterestBipsUpdatedRecordsFilter: AnnualInterestBipsUpdated_filter = { id_not: null }
    $maxTotalSupplyUpdatedRecordsFilter: MaxTotalSupplyUpdated_filter = { id_not: null }
    $withdrawalRequestRecordsFilter: WithdrawalRequest_filter = { id_not: null }
    $forceBuyBackRecordsFilter: ForceBuyBack_filter = { id_not: null }
    $minimumDepositUpdateRecordsFilter: MinimumDepositUpdated_filter = { id_not: null }
    $protocolFeeBipsUpdatedRecordsFilter: ProtocolFeeBipsUpdated_filter = { id_not: null }
    $fixedTermUpdatedRecordsFilter: FixedTermUpdated_filter = { id_not: null }
  ) {
    market(id: $market) {
      marketClosedEvent {
        ...MarketClosedData
      }
      forceBuyBackDisabledRecord {
        ...DisabledForceBuyBacksData
      }
      delinquencyRecords(
        where: {
          and: [
            $delinquencyRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...DelinquencyStatusChangedData
      }
      borrowRecords(
        where: {
          and: [
            $borrowRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...BorrowData
      }
      depositRecords(
        where: {
          and: [
            $depositRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...DepositData
      }
      feeCollectionRecords(
        where: {
          and: [
            $feeCollectionRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...FeesCollectedData
      }
      repaymentRecords(
        where: {
          and: [
            $repaymentRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...RepaymentData
      }
      annualInterestBipsUpdatedRecords(
        where: {
          and: [
            $annualInterestBipsUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...AnnualInterestBipsUpdatedData
      }
      maxTotalSupplyUpdatedRecords(
        where: {
          and: [
            $maxTotalSupplyUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...MaxTotalSupplyUpdatedData
      }
      withdrawalRequestRecords(
        where: {
          and: [
            $withdrawalRequestRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...WithdrawalRequestProperties
      }
      forceBuyBackRecords(
        where: {
          and: [
            $forceBuyBackRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...ForceBuyBackData
      }
      minimumDepositUpdateRecords(
        where: {
          and: [
            $minimumDepositUpdateRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...MinimumDepositUpdatedData
      }
      protocolFeeBipsUpdatedRecords(
        where: {
          and: [
            $protocolFeeBipsUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...ProtocolFeeBipsUpdatedData
      }
      fixedTermUpdatedRecords(
        where: {
          and: [
            $fixedTermUpdatedRecordsFilter
            { eventIndex_gte: $startEventIndex, eventIndex_lt: $endEventIndex }
          ]
        }
        orderBy: eventIndex
        orderDirection: desc
        first: $limit
      ) {
        ...FixedTermUpdatedData
      }
    }
  }
  ${MarketClosedDataFragmentDoc}
  ${DisabledForceBuyBacksDataFragmentDoc}
  ${DelinquencyStatusChangedDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${DepositDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
  ${AnnualInterestBipsUpdatedDataFragmentDoc}
  ${MaxTotalSupplyUpdatedDataFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${ForceBuyBackDataFragmentDoc}
  ${MinimumDepositUpdatedDataFragmentDoc}
  ${ProtocolFeeBipsUpdatedDataFragmentDoc}
  ${FixedTermUpdatedDataFragmentDoc}
`;
export type GetMarketEventsQueryResult = Apollo.QueryResult<
  SubgraphGetMarketEventsQuery,
  SubgraphGetMarketEventsQueryVariables
>;
export const GetMarketsWithEventsDocument = gql`
  query getMarketsWithEvents(
    $marketFilter: Market_filter = { id_not: null }
    $shouldSkipRecords: Boolean = false
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numFeeCollections: Int = 10
    $skipFeeCollections: Int = 0
    $orderFeeCollections: FeesCollected_orderBy = blockTimestamp
    $directionFeeCollections: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    markets(
      where: $marketFilter
      orderBy: $orderMarkets
      orderDirection: $directionMarkets
      first: $numMarkets
      skip: $skipMarkets
    ) {
      ...MarketDataWithEvents
    }
  }
  ${MarketDataWithEventsFragmentDoc}
  ${MarketDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${MarketRecordsFragmentDoc}
  ${DepositDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;
export type GetMarketsWithEventsQueryResult = Apollo.QueryResult<
  SubgraphGetMarketsWithEventsQuery,
  SubgraphGetMarketsWithEventsQueryVariables
>;
export const GetMarketDocument = gql`
  query getMarket(
    $market: ID!
    $shouldSkipRecords: Boolean = false
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numFeeCollections: Int = 10
    $skipFeeCollections: Int = 0
    $orderFeeCollections: FeesCollected_orderBy = blockTimestamp
    $directionFeeCollections: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    market(id: $market) {
      ...MarketDataWithEvents
    }
  }
  ${MarketDataWithEventsFragmentDoc}
  ${MarketDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${MarketRecordsFragmentDoc}
  ${DepositDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;
export type GetMarketQueryResult = Apollo.QueryResult<
  SubgraphGetMarketQuery,
  SubgraphGetMarketQueryVariables
>;
export const GetWithdrawalRequestsByMarketDocument = gql`
  query getWithdrawalRequestsByMarket(
    $market: String!
    $numWithdrawals: Int = 1000
    $skipWithdrawals: Int = 0
    $orderWithdrawals: WithdrawalRequest_orderBy = blockTimestamp
    $directionWithdrawals: OrderDirection = desc
  ) {
    withdrawalRequests(
      orderBy: $orderWithdrawals
      orderDirection: $directionWithdrawals
      first: $numWithdrawals
      skip: $skipWithdrawals
      where: { batch_contains_nocase: $market }
    ) {
      ...WithdrawalRequestProperties
    }
  }
  ${WithdrawalRequestPropertiesFragmentDoc}
`;
export type GetWithdrawalRequestsByMarketQueryResult = Apollo.QueryResult<
  SubgraphGetWithdrawalRequestsByMarketQuery,
  SubgraphGetWithdrawalRequestsByMarketQueryVariables
>;
export const GetAllPendingWithdrawalBatchesForMarketDocument = gql`
  query getAllPendingWithdrawalBatchesForMarket($market: ID!) {
    market(id: $market) {
      withdrawalBatches(where: { isClosed: false }) {
        ...WithdrawalBatchPropertiesWithEvents
      }
    }
  }
  ${WithdrawalBatchPropertiesWithEventsFragmentDoc}
  ${WithdrawalBatchPropertiesFragmentDoc}
  ${WithdrawalBatchPaymentPropertiesFragmentDoc}
  ${LenderWithdrawalPropertiesFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${WithdrawalExecutionPropertiesFragmentDoc}
`;
export type GetAllPendingWithdrawalBatchesForMarketQueryResult = Apollo.QueryResult<
  SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
>;
export const GetIncompleteWithdrawalsForMarketDocument = gql`
  query getIncompleteWithdrawalsForMarket(
    $market: ID!
    $numWithdrawalBatches: Int = 100
    $skipWithdrawalBatches: Int = 0
    $orderWithdrawalBatches: WithdrawalBatch_orderBy = expiry
    $directionWithdrawalBatches: OrderDirection = desc
  ) {
    market(id: $market) {
      withdrawalBatches(
        orderBy: $orderWithdrawalBatches
        orderDirection: $directionWithdrawalBatches
        first: $numWithdrawalBatches
        skip: $skipWithdrawalBatches
        where: { isCompleted: false }
      ) {
        ...WithdrawalBatchPropertiesWithEvents
      }
    }
  }
  ${WithdrawalBatchPropertiesWithEventsFragmentDoc}
  ${WithdrawalBatchPropertiesFragmentDoc}
  ${WithdrawalBatchPaymentPropertiesFragmentDoc}
  ${LenderWithdrawalPropertiesFragmentDoc}
  ${WithdrawalRequestPropertiesFragmentDoc}
  ${WithdrawalExecutionPropertiesFragmentDoc}
`;
export type GetIncompleteWithdrawalsForMarketQueryResult = Apollo.QueryResult<
  SubgraphGetIncompleteWithdrawalsForMarketQuery,
  SubgraphGetIncompleteWithdrawalsForMarketQueryVariables
>;
export const GetAllMarketsDocument = gql`
  query getAllMarkets {
    markets {
      ...MarketData
    }
  }
  ${MarketDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
`;
export type GetAllMarketsQueryResult = Apollo.QueryResult<
  SubgraphGetAllMarketsQuery,
  SubgraphGetAllMarketsQueryVariables
>;
export const GetAuthorizedLendersByMarketDocument = gql`
  query getAuthorizedLendersByMarket($market: ID!) {
    market(id: $market) {
      controller {
        authorizedLenders {
          lender
          authorized
          changes(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
            blockTimestamp
          }
        }
      }
      lenders {
        address
        scaledBalance
        role
      }
    }
  }
`;
export type GetAuthorizedLendersByMarketQueryResult = Apollo.QueryResult<
  SubgraphGetAuthorizedLendersByMarketQuery,
  SubgraphGetAuthorizedLendersByMarketQueryVariables
>;
export const GetAllAuthorizedLendersDocument = gql`
  query getAllAuthorizedLenders($borrower: Bytes!) {
    markets(where: { borrower: $borrower, isClosed: false }) {
      id
      name
      controller {
        authorizedLenders {
          ...AllAuthorizedLendersView
        }
      }
      hooks {
        lenders {
          ...LenderHooksAccessData
        }
      }
    }
  }
  ${AllAuthorizedLendersViewFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
`;
export type GetAllAuthorizedLendersQueryResult = Apollo.QueryResult<
  SubgraphGetAllAuthorizedLendersQuery,
  SubgraphGetAllAuthorizedLendersQueryVariables
>;
export const GetV1AuthorizedLendersDocument = gql`
  query getV1AuthorizedLenders(
    $borrower: Bytes!
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
  ) {
    controllers(where: { borrower: $borrower }, first: 1) {
      markets(
        where: { borrower: $borrower, isClosed: false, version: V2 }
        first: $numMarkets
        skip: $skipMarkets
        orderBy: $orderMarkets
        orderDirection: $directionMarkets
      ) {
        id
        name
      }
      authorizedLenders {
        lender
        authorized
      }
    }
  }
`;
export type GetV1AuthorizedLendersQueryResult = Apollo.QueryResult<
  SubgraphGetV1AuthorizedLendersQuery,
  SubgraphGetV1AuthorizedLendersQueryVariables
>;
export const GetLendersByHooksInstanceOrControllerDocument = gql`
  query getLendersByHooksInstanceOrController(
    $contractAddress: ID!
    $isController: Boolean!
    $lenderHooksAccessFilter: LenderHooksAccess_filter = { id_not: null }
    $lenderAuthorizationFilter: LenderAuthorization_filter = { id_not: null }
    $numMarketAccountsPerLender: Int = 100
    $skipMarketAccountsPerLender: Int = 0
    $numLenders: Int = 1000
    $skipLenders: Int = 0
    $orderLenderHooksAccess: LenderHooksAccess_orderBy = lastApprovalTimestamp
    $directionLenders: OrderDirection = desc
  ) {
    hooksInstance(id: $contractAddress) @skip(if: $isController) {
      ...HooksInstanceData
      ...HooksInstanceLendersWithActiveMarkets
    }
    controller(id: $contractAddress) @include(if: $isController) {
      ...ControllerAuthorizedLendersWithActiveMarkets
    }
  }
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${HooksInstanceLendersWithActiveMarketsFragmentDoc}
  ${V2LenderWithActiveMarketsFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${ControllerAuthorizedLendersWithActiveMarketsFragmentDoc}
  ${V1LenderWithActiveMarketsFragmentDoc}
`;
export type GetLendersByHooksInstanceOrControllerQueryResult = Apollo.QueryResult<
  SubgraphGetLendersByHooksInstanceOrControllerQuery,
  SubgraphGetLendersByHooksInstanceOrControllerQueryVariables
>;
export const GetMarketsAndLendersByHooksInstanceOrControllerDocument = gql`
  query getMarketsAndLendersByHooksInstanceOrController(
    $contractAddress: ID!
    $marketFilter: Market_filter = { id_not: null }
    $numMarkets: Int = 1000
    $skipMarkets: Int = 0
    $orderMarkets: Market_orderBy = createdAt
    $directionMarkets: OrderDirection = desc
    $lenderHooksAccessFilter: LenderHooksAccess_filter = { id_not: null }
    $lenderAuthorizationFilter: LenderAuthorization_filter = { id_not: null }
    $numMarketAccountsPerLender: Int = 100
    $skipMarketAccountsPerLender: Int = 0
    $numLenders: Int = 1000
    $skipLenders: Int = 0
    $orderLenderHooksAccess: LenderHooksAccess_orderBy = lastApprovalTimestamp
    $directionLenders: OrderDirection = desc
  ) {
    hooksInstance(id: $contractAddress) {
      ...HooksInstanceData
      markets(
        where: $marketFilter
        first: $numMarkets
        skip: $skipMarkets
        orderBy: $orderMarkets
        orderDirection: $directionMarkets
      ) {
        ...MarketData
      }
      ...HooksInstanceLendersWithActiveMarkets
    }
    controller(id: $contractAddress) {
      ...MinimalControllerData
      markets(
        where: $marketFilter
        first: $numMarkets
        skip: $skipMarkets
        orderBy: $orderMarkets
        orderDirection: $directionMarkets
      ) {
        ...MarketData
      }
      ...ControllerAuthorizedLendersWithActiveMarkets
    }
  }
  ${HooksInstanceDataFragmentDoc}
  ${HooksTemplateDataFragmentDoc}
  ${TokenDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
  ${MarketDataFragmentDoc}
  ${HooksConfigDataForMarketFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${HooksInstanceLendersWithActiveMarketsFragmentDoc}
  ${V2LenderWithActiveMarketsFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${MinimalControllerDataFragmentDoc}
  ${ParameterConstraintsDataFragmentDoc}
  ${ControllerAuthorizedLendersWithActiveMarketsFragmentDoc}
  ${V1LenderWithActiveMarketsFragmentDoc}
`;
export type GetMarketsAndLendersByHooksInstanceOrControllerQueryResult = Apollo.QueryResult<
  SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQuery,
  SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables
>;
export const GetActiveLendersByMarketDocument = gql`
  query getActiveLendersByMarket(
    $market: ID!
    $accountFilter: LenderAccount_filter = { address_not: null }
    $numAccounts: Int = 1000
    $skipAccounts: Int = 0
    $orderAccounts: LenderAccount_orderBy = lastUpdatedTimestamp
    $directionAccounts: OrderDirection = desc
  ) {
    market(id: $market) {
      lenders(
        where: $accountFilter
        first: $numAccounts
        skip: $skipAccounts
        orderBy: $orderAccounts
        orderDirection: $directionAccounts
      ) {
        ...BasicLenderData
      }
    }
  }
  ${BasicLenderDataFragmentDoc}
  ${LenderHooksAccessDataFragmentDoc}
  ${RoleProviderDataFragmentDoc}
`;
export type GetActiveLendersByMarketQueryResult = Apollo.QueryResult<
  SubgraphGetActiveLendersByMarketQuery,
  SubgraphGetActiveLendersByMarketQueryVariables
>;
export const GetAuthorizedLendersByBorrowerDocument = gql`
  query getAuthorizedLendersByBorrower($filter: Controller_filter!) {
    controllers(where: $filter) {
      authorizedLenders(where: { authorized: true }) {
        lender
      }
    }
  }
`;
export type GetAuthorizedLendersByBorrowerQueryResult = Apollo.QueryResult<
  SubgraphGetAuthorizedLendersByBorrowerQuery,
  SubgraphGetAuthorizedLendersByBorrowerQueryVariables
>;
export const GetSubgraphStatusDocument = gql`
  query getSubgraphStatus {
    _meta {
      hasIndexingErrors
      block {
        hash
        number
        timestamp
      }
    }
  }
`;
export type GetSubgraphStatusQueryResult = Apollo.QueryResult<
  SubgraphGetSubgraphStatusQuery,
  SubgraphGetSubgraphStatusQueryVariables
>;
export const GetMarketRecordsDocument = gql`
  query getMarketRecords(
    $market: ID!
    $numDeposits: Int = 10
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numFeeCollections: Int = 10
    $skipFeeCollections: Int = 0
    $orderFeeCollections: FeesCollected_orderBy = blockTimestamp
    $directionFeeCollections: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
    market(id: $market) {
      ...MarketRecords
    }
  }
  ${MarketRecordsFragmentDoc}
  ${DepositDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;
export type GetMarketRecordsQueryResult = Apollo.QueryResult<
  SubgraphGetMarketRecordsQuery,
  SubgraphGetMarketRecordsQueryVariables
>;
export const GetAllTokensWithMarketsDocument = gql`
  query getAllTokensWithMarkets {
    tokens {
      address
      name
      symbol
      decimals
    }
  }
`;
export type GetAllTokensWithMarketsQueryResult = Apollo.QueryResult<
  SubgraphGetAllTokensWithMarketsQuery,
  SubgraphGetAllTokensWithMarketsQueryVariables
>;
