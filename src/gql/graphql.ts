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
const defaultOptions = {} as const;
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
};

export enum SubgraphAggregation_Interval {
  Day = "day",
  Hour = "hour"
}

export type SubgraphApproval = {
  __typename?: "Approval";
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
  __typename?: "ArchController";
  borrowers: SubgraphRegisteredBorrower[];
  controllerFactories: SubgraphControllerFactory[];
  controllers: SubgraphController[];
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
  __typename?: "Borrow";
  assetAmount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
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
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphBorrowerRegistrationChange = {
  __typename?: "BorrowerRegistrationChange";
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
  __typename?: "Controller";
  archController: SubgraphArchController;
  authorizationChanges: SubgraphLenderAuthorizationChange[];
  authorizedLenders: SubgraphLenderAuthorization[];
  borrower: Scalars["Bytes"]["output"];
  controllerFactory: SubgraphControllerFactory;
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  markets: SubgraphMarket[];
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
  __typename?: "ControllerAdded";
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
  ControllerFactoryOriginationFeeAsset = "controllerFactory__originationFeeAsset",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphControllerFactory = {
  __typename?: "ControllerFactory";
  archController: SubgraphArchController;
  constraints: SubgraphParameterConstraints;
  controllers: SubgraphController[];
  feeRecipient: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset: Scalars["Bytes"]["output"];
  protocolFeeBips: Scalars["Int"]["output"];
  removal?: Maybe<SubgraphControllerFactoryRemoved>;
  sentinel: Scalars["Bytes"]["output"];
};

export type SubgraphControllerFactoryControllersArgs = SubgraphArchControllerControllersArgs;

export type SubgraphControllerFactoryAdded = {
  __typename?: "ControllerFactoryAdded";
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
  ControllerFactoryOriginationFeeAsset = "controllerFactory__originationFeeAsset",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  Id = "id",
  TransactionHash = "transactionHash"
}

export type SubgraphControllerFactoryRemoved = {
  __typename?: "ControllerFactoryRemoved";
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
  ControllerFactoryOriginationFeeAsset = "controllerFactory__originationFeeAsset",
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
  originationFeeAsset?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
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
  ProtocolFeeBips = "protocolFeeBips",
  Removal = "removal",
  RemovalBlockNumber = "removal__blockNumber",
  RemovalBlockTimestamp = "removal__blockTimestamp",
  RemovalId = "removal__id",
  RemovalTransactionHash = "removal__transactionHash",
  Sentinel = "sentinel"
}

export type SubgraphControllerRemoved = {
  __typename?: "ControllerRemoved";
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
  ControllerFactoryOriginationFeeAsset = "controllerFactory__originationFeeAsset",
  ControllerFactoryProtocolFeeBips = "controllerFactory__protocolFeeBips",
  ControllerFactorySentinel = "controllerFactory__sentinel",
  Id = "id",
  IsRegistered = "isRegistered",
  Markets = "markets",
  Removal = "removal",
  RemovalBlockNumber = "removal__blockNumber",
  RemovalBlockTimestamp = "removal__blockTimestamp",
  RemovalId = "removal__id",
  RemovalTransactionHash = "removal__transactionHash"
}

export type SubgraphDebtRepaid = {
  __typename?: "DebtRepaid";
  assetAmount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
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
  From = "from",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphDelinquencyStatusChanged = {
  __typename?: "DelinquencyStatusChanged";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
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
  Id = "id",
  IsDelinquent = "isDelinquent",
  LiquidityCoverageRequired = "liquidityCoverageRequired",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TotalAssets = "totalAssets",
  TransactionHash = "transactionHash"
}

export type SubgraphDeposit = {
  __typename?: "Deposit";
  account: SubgraphLenderAccount;
  assetAmount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
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
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  ScaledAmount = "scaledAmount",
  TransactionHash = "transactionHash"
}

export type SubgraphFeesCollected = {
  __typename?: "FeesCollected";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  feesCollected: Scalars["BigInt"]["output"];
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
  feesCollected?: InputMaybe<Scalars["BigInt"]["input"]>;
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
  FeesCollected = "feesCollected",
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphLenderAccount = {
  __typename?: "LenderAccount";
  address: Scalars["Bytes"]["output"];
  controllerAuthorization: SubgraphLenderAuthorization;
  deposits: SubgraphDeposit[];
  id: Scalars["ID"]["output"];
  interestAccrualRecords: SubgraphLenderInterestAccrued[];
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
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  interestAccrualRecords_?: InputMaybe<SubgraphLenderInterestAccrued_Filter>;
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
  Address = "address",
  ControllerAuthorization = "controllerAuthorization",
  ControllerAuthorizationAuthorized = "controllerAuthorization__authorized",
  ControllerAuthorizationId = "controllerAuthorization__id",
  ControllerAuthorizationLender = "controllerAuthorization__lender",
  Deposits = "deposits",
  Id = "id",
  InterestAccrualRecords = "interestAccrualRecords",
  LastScaleFactor = "lastScaleFactor",
  LastUpdatedTimestamp = "lastUpdatedTimestamp",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  NumPendingWithdrawalBatches = "numPendingWithdrawalBatches",
  Role = "role",
  ScaledBalance = "scaledBalance",
  TotalDeposited = "totalDeposited",
  TotalInterestEarned = "totalInterestEarned",
  Withdrawals = "withdrawals"
}

export type SubgraphLenderAuthorization = {
  __typename?: "LenderAuthorization";
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
  __typename?: "LenderAuthorizationChange";
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
  Id = "id",
  Lender = "lender",
  TransactionHash = "transactionHash"
}

export type SubgraphLenderAuthorization_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
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
  Authorized = "authorized",
  Changes = "changes",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  Id = "id",
  Lender = "lender",
  MarketAccounts = "marketAccounts"
}

export type SubgraphLenderInterestAccrued = {
  __typename?: "LenderInterestAccrued";
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export enum SubgraphLenderStatus {
  Blocked = "Blocked",
  DepositAndWithdraw = "DepositAndWithdraw",
  Null = "Null",
  WithdrawOnly = "WithdrawOnly"
}

export type SubgraphLenderWithdrawalStatus = {
  __typename?: "LenderWithdrawalStatus";
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  __typename?: "Market";
  annualInterestBips: Scalars["Int"]["output"];
  archController: SubgraphArchController;
  asset: SubgraphToken;
  borrowRecords: SubgraphBorrow[];
  borrower: Scalars["Bytes"]["output"];
  controller: SubgraphController;
  createdAt: Scalars["Int"]["output"];
  decimals: Scalars["Int"]["output"];
  delinquencyFeeBips: Scalars["Int"]["output"];
  delinquencyGracePeriod: Scalars["Int"]["output"];
  delinquencyRecords: SubgraphDelinquencyStatusChanged[];
  deployedEvent: SubgraphMarketDeployed;
  depositRecords: SubgraphDeposit[];
  feeCollectionRecords: SubgraphFeesCollected[];
  feeRecipient: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  interestAccrualRecords: SubgraphMarketInterestAccrued[];
  isClosed: Scalars["Boolean"]["output"];
  isDelinquent: Scalars["Boolean"]["output"];
  isRegistered: Scalars["Boolean"]["output"];
  lastInterestAccruedTimestamp: Scalars["Int"]["output"];
  lenders: SubgraphLenderAccount[];
  maxTotalSupply: Scalars["BigInt"]["output"];
  name: Scalars["String"]["output"];
  normalizedUnclaimedWithdrawals: Scalars["BigInt"]["output"];
  originalAnnualInterestBips: Scalars["Int"]["output"];
  originalReserveRatioBips: Scalars["Int"]["output"];
  pendingProtocolFees: Scalars["BigInt"]["output"];
  pendingWithdrawalExpiry: Scalars["BigInt"]["output"];
  protocolFeeBips: Scalars["Int"]["output"];
  removal?: Maybe<SubgraphMarketRemoved>;
  repaymentRecords: SubgraphDebtRepaid[];
  reserveRatioBips: Scalars["Int"]["output"];
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
  withdrawalBatchDuration: Scalars["Int"]["output"];
  withdrawalBatches: SubgraphWithdrawalBatch[];
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

export type SubgraphMarketInterestAccrualRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphMarketInterestAccrued_Filter>;
};

export type SubgraphMarketLendersArgs = SubgraphLenderAuthorizationMarketAccountsArgs;

export type SubgraphMarketRepaymentRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphDebtRepaid_Filter>;
};

export type SubgraphMarketWithdrawalBatchesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatch_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
};

export type SubgraphMarketAdded = {
  __typename?: "MarketAdded";
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
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketClosed = {
  __typename?: "MarketClosed";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
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
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  Timestamp = "timestamp",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketDeployed = {
  __typename?: "MarketDeployed";
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketInterestAccrued = {
  __typename?: "MarketInterestAccrued";
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  ProtocolFeesAccrued = "protocolFeesAccrued",
  TimeWithPenalties = "timeWithPenalties",
  ToTimestamp = "toTimestamp",
  TransactionHash = "transactionHash"
}

export type SubgraphMarketRemoved = {
  __typename?: "MarketRemoved";
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphMarket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<SubgraphBlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubgraphMarket_Filter>>>;
  annualInterestBips?: InputMaybe<Scalars["Int"]["input"]>;
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
  depositRecords_?: InputMaybe<SubgraphDeposit_Filter>;
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
  maxTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  maxTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  maxTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
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
  withdrawalBatchDuration?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_gt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_gte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalBatchDuration_lt?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_lte?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_not?: InputMaybe<Scalars["Int"]["input"]>;
  withdrawalBatchDuration_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  withdrawalBatches_?: InputMaybe<SubgraphWithdrawalBatch_Filter>;
};

export enum SubgraphMarket_OrderBy {
  AnnualInterestBips = "annualInterestBips",
  ArchController = "archController",
  ArchControllerId = "archController__id",
  Asset = "asset",
  AssetAddress = "asset__address",
  AssetDecimals = "asset__decimals",
  AssetId = "asset__id",
  AssetIsMock = "asset__isMock",
  AssetName = "asset__name",
  AssetSymbol = "asset__symbol",
  BorrowRecords = "borrowRecords",
  Borrower = "borrower",
  Controller = "controller",
  ControllerBorrower = "controller__borrower",
  ControllerId = "controller__id",
  ControllerIsRegistered = "controller__isRegistered",
  CreatedAt = "createdAt",
  Decimals = "decimals",
  DelinquencyFeeBips = "delinquencyFeeBips",
  DelinquencyGracePeriod = "delinquencyGracePeriod",
  DelinquencyRecords = "delinquencyRecords",
  DeployedEvent = "deployedEvent",
  DeployedEventBlockNumber = "deployedEvent__blockNumber",
  DeployedEventBlockTimestamp = "deployedEvent__blockTimestamp",
  DeployedEventId = "deployedEvent__id",
  DeployedEventTransactionHash = "deployedEvent__transactionHash",
  DepositRecords = "depositRecords",
  FeeCollectionRecords = "feeCollectionRecords",
  FeeRecipient = "feeRecipient",
  Id = "id",
  InterestAccrualRecords = "interestAccrualRecords",
  IsClosed = "isClosed",
  IsDelinquent = "isDelinquent",
  IsRegistered = "isRegistered",
  LastInterestAccruedTimestamp = "lastInterestAccruedTimestamp",
  Lenders = "lenders",
  MaxTotalSupply = "maxTotalSupply",
  Name = "name",
  NormalizedUnclaimedWithdrawals = "normalizedUnclaimedWithdrawals",
  OriginalAnnualInterestBips = "originalAnnualInterestBips",
  OriginalReserveRatioBips = "originalReserveRatioBips",
  PendingProtocolFees = "pendingProtocolFees",
  PendingWithdrawalExpiry = "pendingWithdrawalExpiry",
  ProtocolFeeBips = "protocolFeeBips",
  Removal = "removal",
  RemovalBlockNumber = "removal__blockNumber",
  RemovalBlockTimestamp = "removal__blockTimestamp",
  RemovalId = "removal__id",
  RemovalTransactionHash = "removal__transactionHash",
  RepaymentRecords = "repaymentRecords",
  ReserveRatioBips = "reserveRatioBips",
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
  WithdrawalBatchDuration = "withdrawalBatchDuration",
  WithdrawalBatches = "withdrawalBatches"
}

export type SubgraphMaxTotalSupplyUpdated = {
  __typename?: "MaxTotalSupplyUpdated";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  market: SubgraphMarket;
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
  Id = "id",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  NewMaxTotalSupply = "newMaxTotalSupply",
  OldMaxTotalSupply = "oldMaxTotalSupply",
  TransactionHash = "transactionHash"
}

export type SubgraphNewController = {
  __typename?: "NewController";
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
  __typename?: "NewSanctionsEscrow";
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
  __typename?: "OwnershipHandoverCanceled";
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
  __typename?: "OwnershipHandoverRequested";
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
  __typename?: "OwnershipTransferred";
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
  __typename?: "ParameterConstraints";
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

export type SubgraphQuery = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<Subgraph_Meta_>;
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
  feesCollected?: Maybe<SubgraphFeesCollected>;
  feesCollecteds: SubgraphFeesCollected[];
  lenderAccount?: Maybe<SubgraphLenderAccount>;
  lenderAccounts: SubgraphLenderAccount[];
  lenderAuthorization?: Maybe<SubgraphLenderAuthorization>;
  lenderAuthorizationChange?: Maybe<SubgraphLenderAuthorizationChange>;
  lenderAuthorizationChanges: SubgraphLenderAuthorizationChange[];
  lenderAuthorizations: SubgraphLenderAuthorization[];
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
  registeredBorrower?: Maybe<SubgraphRegisteredBorrower>;
  registeredBorrowers: SubgraphRegisteredBorrower[];
  reserveRatioBipsUpdated?: Maybe<SubgraphReserveRatioBipsUpdated>;
  reserveRatioBipsUpdateds: SubgraphReserveRatioBipsUpdated[];
  sanctionOverride?: Maybe<SubgraphSanctionOverride>;
  sanctionOverrideRemoved?: Maybe<SubgraphSanctionOverrideRemoved>;
  sanctionOverrideRemoveds: SubgraphSanctionOverrideRemoved[];
  sanctionOverrides: SubgraphSanctionOverride[];
  sanctionedAccountAssetsSentToEscrow?: Maybe<SubgraphSanctionedAccountAssetsSentToEscrow>;
  sanctionedAccountAssetsSentToEscrows: SubgraphSanctionedAccountAssetsSentToEscrow[];
  sanctionedAccountWithdrawalSentToEscrow?: Maybe<SubgraphSanctionedAccountWithdrawalSentToEscrow>;
  sanctionedAccountWithdrawalSentToEscrows: SubgraphSanctionedAccountWithdrawalSentToEscrow[];
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

export type SubgraphQueryApprovalArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
};

export type SubgraphQueryApprovalsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphApproval_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphApproval_Filter>;
};

export type SubgraphQueryArchControllerArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryArchControllersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphArchController_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphArchController_Filter>;
};

export type SubgraphQueryBorrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryBorrowerRegistrationChangeArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQueryControllerArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryControllerAddedArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQueryControllerFactoryArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryControllerFactoryAddedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryControllerFactoryAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerFactoryAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerFactoryAdded_Filter>;
};

export type SubgraphQueryControllerFactoryRemovedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryControllerFactoryRemovedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphControllerFactoryRemoved_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphControllerFactoryRemoved_Filter>;
};

export type SubgraphQueryControllerRemovedArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQueryDebtRepaidArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryDebtRepaidsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDebtRepaid_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDebtRepaid_Filter>;
};

export type SubgraphQueryDelinquencyStatusChangedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryDelinquencyStatusChangedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDelinquencyStatusChanged_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDelinquencyStatusChanged_Filter>;
};

export type SubgraphQueryDepositArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryDepositsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphDeposit_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphDeposit_Filter>;
};

export type SubgraphQueryFeesCollectedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryFeesCollectedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphFeesCollected_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphFeesCollected_Filter>;
};

export type SubgraphQueryLenderAccountArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryLenderAccountsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderAccount_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderAccount_Filter>;
};

export type SubgraphQueryLenderAuthorizationArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryLenderAuthorizationChangeArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQueryLenderInterestAccruedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryLenderInterestAccruedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderInterestAccrued_Filter>;
};

export type SubgraphQueryLenderWithdrawalStatusArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryLenderWithdrawalStatusesArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphLenderWithdrawalStatus_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphLenderWithdrawalStatus_Filter>;
};

export type SubgraphQueryMarketArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryMarketAddedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryMarketAddedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketAdded_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketAdded_Filter>;
};

export type SubgraphQueryMarketClosedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryMarketClosedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketClosed_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketClosed_Filter>;
};

export type SubgraphQueryMarketDeployedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryMarketDeployedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketDeployed_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketDeployed_Filter>;
};

export type SubgraphQueryMarketInterestAccruedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryMarketInterestAccruedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMarketInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMarketInterestAccrued_Filter>;
};

export type SubgraphQueryMarketRemovedArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQueryMaxTotalSupplyUpdatedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryMaxTotalSupplyUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphMaxTotalSupplyUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphMaxTotalSupplyUpdated_Filter>;
};

export type SubgraphQueryNewControllerArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryNewControllersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphNewController_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphNewController_Filter>;
};

export type SubgraphQueryNewSanctionsEscrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryNewSanctionsEscrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphNewSanctionsEscrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphNewSanctionsEscrow_Filter>;
};

export type SubgraphQueryOwnershipHandoverCanceledArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryOwnershipHandoverCanceledsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphOwnershipHandoverCanceled_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphOwnershipHandoverCanceled_Filter>;
};

export type SubgraphQueryOwnershipHandoverRequestedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryOwnershipHandoverRequestedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphOwnershipHandoverRequested_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphOwnershipHandoverRequested_Filter>;
};

export type SubgraphQueryOwnershipTransferredArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryOwnershipTransferredsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphOwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphOwnershipTransferred_Filter>;
};

export type SubgraphQueryParameterConstraintsArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryParameterConstraints_CollectionArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphParameterConstraints_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphParameterConstraints_Filter>;
};

export type SubgraphQueryRegisteredBorrowerArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryRegisteredBorrowersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphRegisteredBorrower_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphRegisteredBorrower_Filter>;
};

export type SubgraphQueryReserveRatioBipsUpdatedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryReserveRatioBipsUpdatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphReserveRatioBipsUpdated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphReserveRatioBipsUpdated_Filter>;
};

export type SubgraphQuerySanctionOverrideArgs = SubgraphQueryApprovalArgs;

export type SubgraphQuerySanctionOverrideRemovedArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQuerySanctionedAccountAssetsSentToEscrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphQuerySanctionedAccountAssetsSentToEscrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionedAccountAssetsSentToEscrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionedAccountAssetsSentToEscrow_Filter>;
};

export type SubgraphQuerySanctionedAccountWithdrawalSentToEscrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphQuerySanctionedAccountWithdrawalSentToEscrowsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphSanctionedAccountWithdrawalSentToEscrow_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphSanctionedAccountWithdrawalSentToEscrow_Filter>;
};

export type SubgraphQueryTokenArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryTokensArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphToken_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphToken_Filter>;
};

export type SubgraphQueryTransferArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryTransfersArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphTransfer_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphTransfer_Filter>;
};

export type SubgraphQueryUpdateProtocolFeeConfigurationArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryUpdateProtocolFeeConfigurationsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphUpdateProtocolFeeConfiguration_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphUpdateProtocolFeeConfiguration_Filter>;
};

export type SubgraphQueryWithdrawalBatchArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryWithdrawalBatchCreatedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryWithdrawalBatchCreatedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchCreated_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchCreated_Filter>;
};

export type SubgraphQueryWithdrawalBatchExpiredArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryWithdrawalBatchExpiredsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchExpired_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchExpired_Filter>;
};

export type SubgraphQueryWithdrawalBatchInterestAccruedArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryWithdrawalBatchInterestAccruedsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalBatchInterestAccrued_Filter>;
};

export type SubgraphQueryWithdrawalBatchPaymentArgs = SubgraphQueryApprovalArgs;

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

export type SubgraphQueryWithdrawalExecutionArgs = SubgraphQueryApprovalArgs;

export type SubgraphQueryWithdrawalExecutionsArgs = {
  block?: InputMaybe<SubgraphBlock_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<SubgraphWithdrawalExecution_OrderBy>;
  orderDirection?: InputMaybe<SubgraphOrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: Subgraph_SubgraphErrorPolicy_;
  where?: InputMaybe<SubgraphWithdrawalExecution_Filter>;
};

export type SubgraphQueryWithdrawalRequestArgs = SubgraphQueryApprovalArgs;

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
  __typename?: "RegisteredBorrower";
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
  __typename?: "ReserveRatioBipsUpdated";
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  NewReserveRatioBips = "newReserveRatioBips",
  OldReserveRatioBips = "oldReserveRatioBips",
  TransactionHash = "transactionHash"
}

export type SubgraphSanctionOverride = {
  __typename?: "SanctionOverride";
  account: Scalars["Bytes"]["output"];
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  borrower: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type SubgraphSanctionOverrideRemoved = {
  __typename?: "SanctionOverrideRemoved";
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

export type SubgraphSanctionedAccountAssetsSentToEscrow = {
  __typename?: "SanctionedAccountAssetsSentToEscrow";
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
  __typename?: "SanctionedAccountWithdrawalSentToEscrow";
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

export type SubgraphSubscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<Subgraph_Meta_>;
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
  feesCollected?: Maybe<SubgraphFeesCollected>;
  feesCollecteds: SubgraphFeesCollected[];
  lenderAccount?: Maybe<SubgraphLenderAccount>;
  lenderAccounts: SubgraphLenderAccount[];
  lenderAuthorization?: Maybe<SubgraphLenderAuthorization>;
  lenderAuthorizationChange?: Maybe<SubgraphLenderAuthorizationChange>;
  lenderAuthorizationChanges: SubgraphLenderAuthorizationChange[];
  lenderAuthorizations: SubgraphLenderAuthorization[];
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
  registeredBorrower?: Maybe<SubgraphRegisteredBorrower>;
  registeredBorrowers: SubgraphRegisteredBorrower[];
  reserveRatioBipsUpdated?: Maybe<SubgraphReserveRatioBipsUpdated>;
  reserveRatioBipsUpdateds: SubgraphReserveRatioBipsUpdated[];
  sanctionOverride?: Maybe<SubgraphSanctionOverride>;
  sanctionOverrideRemoved?: Maybe<SubgraphSanctionOverrideRemoved>;
  sanctionOverrideRemoveds: SubgraphSanctionOverrideRemoved[];
  sanctionOverrides: SubgraphSanctionOverride[];
  sanctionedAccountAssetsSentToEscrow?: Maybe<SubgraphSanctionedAccountAssetsSentToEscrow>;
  sanctionedAccountAssetsSentToEscrows: SubgraphSanctionedAccountAssetsSentToEscrow[];
  sanctionedAccountWithdrawalSentToEscrow?: Maybe<SubgraphSanctionedAccountWithdrawalSentToEscrow>;
  sanctionedAccountWithdrawalSentToEscrows: SubgraphSanctionedAccountWithdrawalSentToEscrow[];
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

export type SubgraphSubscriptionApprovalArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionApprovalsArgs = SubgraphQueryApprovalsArgs;

export type SubgraphSubscriptionArchControllerArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionArchControllersArgs = SubgraphQueryArchControllersArgs;

export type SubgraphSubscriptionBorrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionBorrowerRegistrationChangeArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionBorrowerRegistrationChangesArgs =
  SubgraphQueryBorrowerRegistrationChangesArgs;

export type SubgraphSubscriptionBorrowsArgs = SubgraphQueryBorrowsArgs;

export type SubgraphSubscriptionControllerArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionControllerAddedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionControllerAddedsArgs = SubgraphQueryControllerAddedsArgs;

export type SubgraphSubscriptionControllerFactoriesArgs = SubgraphQueryControllerFactoriesArgs;

export type SubgraphSubscriptionControllerFactoryArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionControllerFactoryAddedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionControllerFactoryAddedsArgs =
  SubgraphQueryControllerFactoryAddedsArgs;

export type SubgraphSubscriptionControllerFactoryRemovedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionControllerFactoryRemovedsArgs =
  SubgraphQueryControllerFactoryRemovedsArgs;

export type SubgraphSubscriptionControllerRemovedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionControllerRemovedsArgs = SubgraphQueryControllerRemovedsArgs;

export type SubgraphSubscriptionControllersArgs = SubgraphQueryControllersArgs;

export type SubgraphSubscriptionDebtRepaidArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionDebtRepaidsArgs = SubgraphQueryDebtRepaidsArgs;

export type SubgraphSubscriptionDelinquencyStatusChangedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionDelinquencyStatusChangedsArgs =
  SubgraphQueryDelinquencyStatusChangedsArgs;

export type SubgraphSubscriptionDepositArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionDepositsArgs = SubgraphQueryDepositsArgs;

export type SubgraphSubscriptionFeesCollectedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionFeesCollectedsArgs = SubgraphQueryFeesCollectedsArgs;

export type SubgraphSubscriptionLenderAccountArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionLenderAccountsArgs = SubgraphQueryLenderAccountsArgs;

export type SubgraphSubscriptionLenderAuthorizationArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionLenderAuthorizationChangeArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionLenderAuthorizationChangesArgs =
  SubgraphQueryLenderAuthorizationChangesArgs;

export type SubgraphSubscriptionLenderAuthorizationsArgs = SubgraphQueryLenderAuthorizationsArgs;

export type SubgraphSubscriptionLenderInterestAccruedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionLenderInterestAccruedsArgs =
  SubgraphQueryLenderInterestAccruedsArgs;

export type SubgraphSubscriptionLenderWithdrawalStatusArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionLenderWithdrawalStatusesArgs =
  SubgraphQueryLenderWithdrawalStatusesArgs;

export type SubgraphSubscriptionMarketArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMarketAddedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMarketAddedsArgs = SubgraphQueryMarketAddedsArgs;

export type SubgraphSubscriptionMarketClosedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMarketClosedsArgs = SubgraphQueryMarketClosedsArgs;

export type SubgraphSubscriptionMarketDeployedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMarketDeployedsArgs = SubgraphQueryMarketDeployedsArgs;

export type SubgraphSubscriptionMarketInterestAccruedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMarketInterestAccruedsArgs =
  SubgraphQueryMarketInterestAccruedsArgs;

export type SubgraphSubscriptionMarketRemovedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMarketRemovedsArgs = SubgraphQueryMarketRemovedsArgs;

export type SubgraphSubscriptionMarketsArgs = SubgraphQueryMarketsArgs;

export type SubgraphSubscriptionMaxTotalSupplyUpdatedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionMaxTotalSupplyUpdatedsArgs =
  SubgraphQueryMaxTotalSupplyUpdatedsArgs;

export type SubgraphSubscriptionNewControllerArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionNewControllersArgs = SubgraphQueryNewControllersArgs;

export type SubgraphSubscriptionNewSanctionsEscrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionNewSanctionsEscrowsArgs = SubgraphQueryNewSanctionsEscrowsArgs;

export type SubgraphSubscriptionOwnershipHandoverCanceledArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionOwnershipHandoverCanceledsArgs =
  SubgraphQueryOwnershipHandoverCanceledsArgs;

export type SubgraphSubscriptionOwnershipHandoverRequestedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionOwnershipHandoverRequestedsArgs =
  SubgraphQueryOwnershipHandoverRequestedsArgs;

export type SubgraphSubscriptionOwnershipTransferredArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionOwnershipTransferredsArgs = SubgraphQueryOwnershipTransferredsArgs;

export type SubgraphSubscriptionParameterConstraintsArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionParameterConstraints_CollectionArgs =
  SubgraphQueryParameterConstraints_CollectionArgs;

export type SubgraphSubscriptionRegisteredBorrowerArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionRegisteredBorrowersArgs = SubgraphQueryRegisteredBorrowersArgs;

export type SubgraphSubscriptionReserveRatioBipsUpdatedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionReserveRatioBipsUpdatedsArgs =
  SubgraphQueryReserveRatioBipsUpdatedsArgs;

export type SubgraphSubscriptionSanctionOverrideArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionSanctionOverrideRemovedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionSanctionOverrideRemovedsArgs =
  SubgraphQuerySanctionOverrideRemovedsArgs;

export type SubgraphSubscriptionSanctionOverridesArgs = SubgraphQuerySanctionOverridesArgs;

export type SubgraphSubscriptionSanctionedAccountAssetsSentToEscrowArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionSanctionedAccountAssetsSentToEscrowsArgs =
  SubgraphQuerySanctionedAccountAssetsSentToEscrowsArgs;

export type SubgraphSubscriptionSanctionedAccountWithdrawalSentToEscrowArgs =
  SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionSanctionedAccountWithdrawalSentToEscrowsArgs =
  SubgraphQuerySanctionedAccountWithdrawalSentToEscrowsArgs;

export type SubgraphSubscriptionTokenArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionTokensArgs = SubgraphQueryTokensArgs;

export type SubgraphSubscriptionTransferArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionTransfersArgs = SubgraphQueryTransfersArgs;

export type SubgraphSubscriptionUpdateProtocolFeeConfigurationArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionUpdateProtocolFeeConfigurationsArgs =
  SubgraphQueryUpdateProtocolFeeConfigurationsArgs;

export type SubgraphSubscriptionWithdrawalBatchArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalBatchCreatedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalBatchCreatedsArgs =
  SubgraphQueryWithdrawalBatchCreatedsArgs;

export type SubgraphSubscriptionWithdrawalBatchExpiredArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalBatchExpiredsArgs =
  SubgraphQueryWithdrawalBatchExpiredsArgs;

export type SubgraphSubscriptionWithdrawalBatchInterestAccruedArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalBatchInterestAccruedsArgs =
  SubgraphQueryWithdrawalBatchInterestAccruedsArgs;

export type SubgraphSubscriptionWithdrawalBatchPaymentArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalBatchPaymentsArgs =
  SubgraphQueryWithdrawalBatchPaymentsArgs;

export type SubgraphSubscriptionWithdrawalBatchesArgs = SubgraphQueryWithdrawalBatchesArgs;

export type SubgraphSubscriptionWithdrawalExecutionArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalExecutionsArgs = SubgraphQueryWithdrawalExecutionsArgs;

export type SubgraphSubscriptionWithdrawalRequestArgs = SubgraphQueryApprovalArgs;

export type SubgraphSubscriptionWithdrawalRequestsArgs = SubgraphQueryWithdrawalRequestsArgs;

export type SubgraphToken = {
  __typename?: "Token";
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
  __typename?: "Transfer";
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  ScaledAmount = "scaledAmount",
  To = "to",
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
  __typename?: "UpdateProtocolFeeConfiguration";
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  feeRecipient: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  originationFeeAmount: Scalars["BigInt"]["output"];
  originationFeeAsset: Scalars["Bytes"]["output"];
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
  originationFeeAsset?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  originationFeeAsset_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  originationFeeAsset_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
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
  ProtocolFeeBips = "protocolFeeBips",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatch = {
  __typename?: "WithdrawalBatch";
  creation: SubgraphWithdrawalBatchCreated;
  executions: SubgraphWithdrawalExecution[];
  expiry: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  interestAccrualRecords: SubgraphWithdrawalBatchInterestAccrued[];
  isClosed: Scalars["Boolean"]["output"];
  isExpired: Scalars["Boolean"]["output"];
  lastScaleFactor: Scalars["BigInt"]["output"];
  lastUpdatedTimestamp: Scalars["Int"]["output"];
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
  __typename?: "WithdrawalBatchCreated";
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  __typename?: "WithdrawalBatchExpired";
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  ScaledTotalAmount = "scaledTotalAmount",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatchInterestAccrued = {
  __typename?: "WithdrawalBatchInterestAccrued";
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
  TransactionHash = "transactionHash"
}

export type SubgraphWithdrawalBatchPayment = {
  __typename?: "WithdrawalBatchPayment";
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  IsExpired = "isExpired",
  LastScaleFactor = "lastScaleFactor",
  LastUpdatedTimestamp = "lastUpdatedTimestamp",
  Market = "market",
  MarketAnnualInterestBips = "market__annualInterestBips",
  MarketBorrower = "market__borrower",
  MarketCreatedAt = "market__createdAt",
  MarketDecimals = "market__decimals",
  MarketDelinquencyFeeBips = "market__delinquencyFeeBips",
  MarketDelinquencyGracePeriod = "market__delinquencyGracePeriod",
  MarketFeeRecipient = "market__feeRecipient",
  MarketId = "market__id",
  MarketIsClosed = "market__isClosed",
  MarketIsDelinquent = "market__isDelinquent",
  MarketIsRegistered = "market__isRegistered",
  MarketLastInterestAccruedTimestamp = "market__lastInterestAccruedTimestamp",
  MarketMaxTotalSupply = "market__maxTotalSupply",
  MarketName = "market__name",
  MarketNormalizedUnclaimedWithdrawals = "market__normalizedUnclaimedWithdrawals",
  MarketOriginalAnnualInterestBips = "market__originalAnnualInterestBips",
  MarketOriginalReserveRatioBips = "market__originalReserveRatioBips",
  MarketPendingProtocolFees = "market__pendingProtocolFees",
  MarketPendingWithdrawalExpiry = "market__pendingWithdrawalExpiry",
  MarketProtocolFeeBips = "market__protocolFeeBips",
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
  MarketWithdrawalBatchDuration = "market__withdrawalBatchDuration",
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
  __typename?: "WithdrawalExecution";
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  __typename?: "WithdrawalRequest";
  account: SubgraphLenderAccount;
  batch: SubgraphWithdrawalBatch;
  blockNumber: Scalars["Int"]["output"];
  blockTimestamp: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  normalizedAmount: Scalars["BigInt"]["output"];
  requestIndex: Scalars["Int"]["output"];
  scaledAmount: Scalars["BigInt"]["output"];
  status: SubgraphLenderWithdrawalStatus;
  transactionHash: Scalars["Bytes"]["output"];
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
};

export enum SubgraphWithdrawalRequest_OrderBy {
  Account = "account",
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
  BatchExpiry = "batch__expiry",
  BatchId = "batch__id",
  BatchIsClosed = "batch__isClosed",
  BatchIsExpired = "batch__isExpired",
  BatchLastScaleFactor = "batch__lastScaleFactor",
  BatchLastUpdatedTimestamp = "batch__lastUpdatedTimestamp",
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
  TransactionHash = "transactionHash"
}

export type Subgraph_Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /** The block number */
  number: Scalars["Int"]["output"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
};

/** The type for the top-level _meta field */
export type Subgraph_Meta_ = {
  __typename?: "_Meta_";
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

export type SubgraphAccountDataForLenderViewFragment = {
  __typename?: "LenderAccount";
  id: string;
  address: string;
  scaledBalance: string;
  role: SubgraphLenderStatus;
  totalDeposited: string;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  numPendingWithdrawalBatches: number;
  controllerAuthorization: { __typename?: "LenderAuthorization"; authorized: boolean };
  deposits: SubgraphDepositDataFragment[];
};

export type SubgraphGetLenderAccountForMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
  lender: Scalars["Bytes"]["input"];
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SubgraphGetLenderAccountForMarketQuery = {
  __typename?: "Query";
  market?: {
    __typename?: "Market";
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
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
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
  __typename?: "Query";
  market?: {
    __typename?: "Market";
    id: string;
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
    lenders: SubgraphAccountDataForLenderViewFragment[];
    borrowRecords: SubgraphBorrowDataFragment[];
    repaymentRecords: SubgraphRepaymentDataFragment[];
    controller: { __typename?: "Controller"; id: string };
    _asset: {
      __typename?: "Token";
      id: string;
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      isMock: boolean;
    };
    deployedEvent: SubgraphMarketDeployedEventFragment;
  } | null;
};

export type SubgraphGetAllMarketsForLenderViewQueryVariables = Exact<{
  lender?: InputMaybe<Scalars["Bytes"]["input"]>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
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
  __typename?: "Query";
  markets: Array<{
    __typename?: "Market";
    id: string;
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
    borrowRecords: SubgraphBorrowDataFragment[];
    repaymentRecords: SubgraphRepaymentDataFragment[];
    controller: { __typename?: "Controller"; id: string };
    _asset: {
      __typename?: "Token";
      id: string;
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      isMock: boolean;
    };
    deployedEvent: SubgraphMarketDeployedEventFragment;
  }>;
  lenderAccounts: Array<{
    __typename?: "LenderAccount";
    id: string;
    address: string;
    scaledBalance: string;
    role: SubgraphLenderStatus;
    totalDeposited: string;
    lastScaleFactor: string;
    lastUpdatedTimestamp: number;
    totalInterestEarned: string;
    numPendingWithdrawalBatches: number;
    market: { __typename?: "Market"; id: string };
    controllerAuthorization: { __typename?: "LenderAuthorization"; authorized: boolean };
    deposits: SubgraphDepositDataFragment[];
  }>;
  controllerAuthorizations: Array<{
    __typename?: "LenderAuthorization";
    lender: string;
    authorized: boolean;
    controller: {
      __typename?: "Controller";
      markets: Array<{ __typename?: "Market"; id: string }>;
    };
  }>;
};

export type SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables = Exact<{
  lender: Scalars["Bytes"]["input"];
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
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
  __typename?: "Query";
  lenderAccounts: Array<{
    __typename?: "LenderAccount";
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
      __typename?: "Market";
      id: string;
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
      borrowRecords: SubgraphBorrowDataFragment[];
      repaymentRecords: SubgraphRepaymentDataFragment[];
      controller: { __typename?: "Controller"; id: string };
      _asset: {
        __typename?: "Token";
        id: string;
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        isMock: boolean;
      };
      deployedEvent: SubgraphMarketDeployedEventFragment;
    };
    controllerAuthorization: { __typename?: "LenderAuthorization"; authorized: boolean };
    deposits: SubgraphDepositDataFragment[];
  }>;
  controllerAuthorizations: Array<{
    __typename?: "LenderAuthorization";
    lender: string;
    authorized: boolean;
    controller: {
      __typename?: "Controller";
      markets: Array<{
        __typename?: "Market";
        id: string;
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
        borrowRecords: SubgraphBorrowDataFragment[];
        repaymentRecords: SubgraphRepaymentDataFragment[];
        controller: { __typename?: "Controller"; id: string };
        _asset: {
          __typename?: "Token";
          id: string;
          address: string;
          name: string;
          symbol: string;
          decimals: number;
          isMock: boolean;
        };
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
  __typename?: "Query";
  market?: {
    __typename?: "Market";
    lenders: Array<{
      __typename?: "LenderAccount";
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
  __typename?: "Query";
  market?: {
    __typename?: "Market";
    controller: {
      __typename?: "Controller";
      authorizedLenders: Array<{
        __typename?: "LenderAuthorization";
        lender: string;
        authorized: boolean;
      }>;
    };
  } | null;
};

export type SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables = Exact<{
  lender: Scalars["Bytes"]["input"];
  minimumBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  numDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  skipDeposits?: InputMaybe<Scalars["Int"]["input"]>;
  orderDeposits?: InputMaybe<SubgraphDeposit_OrderBy>;
  directionDeposits?: InputMaybe<SubgraphOrderDirection>;
  numWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
  skipWithdrawals?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery = {
  __typename?: "Query";
  lenderAccounts: Array<{
    __typename?: "LenderAccount";
    scaledBalance: string;
    role: SubgraphLenderStatus;
    totalDeposited: string;
    lastScaleFactor: string;
    totalInterestEarned: string;
    market: { __typename?: "Market"; id: string };
    controllerAuthorization: { __typename?: "LenderAuthorization"; authorized: boolean };
    withdrawals: SubgraphLenderWithdrawalPropertiesWithEventsFragment[];
    deposits: SubgraphDepositDataFragment[];
  }>;
};

export type SubgraphGetMarketsForBorrowerQueryVariables = Exact<{
  borrower: Scalars["Bytes"]["input"];
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

export type SubgraphGetMarketsForBorrowerQuery = {
  __typename?: "Query";
  controllers: Array<{
    __typename?: "Controller";
    markets: SubgraphMarketDataWithEventsFragment[];
  }>;
};

export type SubgraphGetMarketsForAllBorrowersQueryVariables = Exact<{
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

export type SubgraphGetMarketsForAllBorrowersQuery = {
  __typename?: "Query";
  markets: SubgraphMarketDataWithEventsFragment[];
};

export type SubgraphGetMarketQueryVariables = Exact<{
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

export type SubgraphGetMarketQuery = {
  __typename?: "Query";
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
  __typename?: "Query";
  withdrawalRequests: SubgraphWithdrawalRequestPropertiesFragment[];
};

export type SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
}>;

export type SubgraphGetAllPendingWithdrawalBatchesForMarketQuery = {
  __typename?: "Query";
  market?: {
    __typename?: "Market";
    withdrawalBatches: SubgraphWithdrawalBatchPropertiesWithEventsFragment[];
  } | null;
};

export type SubgraphGetAllMarketsQueryVariables = Exact<{ [key: string]: never }>;

export type SubgraphGetAllMarketsQuery = {
  __typename?: "Query";
  markets: SubgraphMarketDataFragment[];
};

export type SubgraphGetAuthorizedLendersByMarketQueryVariables = Exact<{
  market: Scalars["ID"]["input"];
}>;

export type SubgraphGetAuthorizedLendersByMarketQuery = {
  __typename?: "Query";
  market?: {
    __typename?: "Market";
    controller: {
      __typename?: "Controller";
      authorizedLenders: Array<{ __typename?: "LenderAuthorization"; lender: string }>;
    };
  } | null;
};

export type SubgraphGetAuthorizedLendersByBorrowerQueryVariables = Exact<{
  filter: SubgraphController_Filter;
}>;

export type SubgraphGetAuthorizedLendersByBorrowerQuery = {
  __typename?: "Query";
  controllers: Array<{
    __typename?: "Controller";
    authorizedLenders: Array<{ __typename?: "LenderAuthorization"; lender: string }>;
  }>;
};

export type SubgraphGetSubgraphStatusQueryVariables = Exact<{ [key: string]: never }>;

export type SubgraphGetSubgraphStatusQuery = {
  __typename?: "Query";
  _meta?: {
    __typename?: "_Meta_";
    hasIndexingErrors: boolean;
    block: {
      __typename?: "_Block_";
      hash?: string | null;
      number: number;
      timestamp?: number | null;
    };
  } | null;
};

export type SubgraphLenderPropertiesFragment = {
  __typename?: "LenderAccount";
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

export type SubgraphDepositDataFragment = {
  __typename?: "Deposit";
  id: string;
  assetAmount: string;
  scaledAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename?: "LenderAccount"; address: string };
};

export type SubgraphMarketDataFragment = {
  __typename?: "Market";
  id: string;
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
  controller: { __typename?: "Controller"; id: string };
  _asset: {
    __typename?: "Token";
    id: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    isMock: boolean;
  };
  deployedEvent: SubgraphMarketDeployedEventFragment;
};

export type SubgraphMarketDeployedEventFragment = {
  __typename?: "MarketDeployed";
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphMarketDataWithEventsFragment = {
  __typename?: "Market";
  id: string;
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
  controller: { __typename?: "Controller"; id: string };
  _asset: {
    __typename?: "Token";
    id: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    isMock: boolean;
  };
  deployedEvent: SubgraphMarketDeployedEventFragment;
  depositRecords: SubgraphDepositDataFragment[];
  borrowRecords: SubgraphBorrowDataFragment[];
  feeCollectionRecords: SubgraphFeesCollectedDataFragment[];
  repaymentRecords: SubgraphRepaymentDataFragment[];
};

export type SubgraphAprConstraintsFragment = {
  __typename?: "ParameterConstraints";
  minimumAnnualInterestBips: number;
  maximumAnnualInterestBips: number;
};

export type SubgraphWithdrawalBatchPaymentPropertiesFragment = {
  __typename?: "WithdrawalBatchPayment";
  id: string;
  scaledAmountBurned: string;
  normalizedAmountPaid: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphWithdrawalRequestPropertiesFragment = {
  __typename?: "WithdrawalRequest";
  id: string;
  requestIndex: number;
  scaledAmount: string;
  normalizedAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename?: "LenderAccount"; address: string };
};

export type SubgraphWithdrawalExecutionPropertiesFragment = {
  __typename?: "WithdrawalExecution";
  id: string;
  normalizedAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  account: { __typename?: "LenderAccount"; address: string };
};

export type SubgraphLenderWithdrawalPropertiesFragment = {
  __typename?: "LenderWithdrawalStatus";
  id: string;
  requestsCount: number;
  executionsCount: number;
  scaledAmount: string;
  normalizedAmountWithdrawn: string;
  totalNormalizedRequests: string;
  isCompleted: boolean;
  account: { __typename?: "LenderAccount"; address: string };
};

export type SubgraphLenderWithdrawalPropertiesWithEventsFragment = {
  __typename?: "LenderWithdrawalStatus";
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
  account: { __typename?: "LenderAccount"; address: string };
};

export type SubgraphWithdrawalBatchPropertiesFragment = {
  __typename?: "WithdrawalBatch";
  id: string;
  expiry: string;
  scaledTotalAmount: string;
  scaledAmountBurned: string;
  normalizedAmountPaid: string;
  normalizedAmountClaimed: string;
  totalNormalizedRequests: string;
  isExpired: boolean;
  isClosed: boolean;
  paymentsCount: number;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  creation: {
    __typename?: "WithdrawalBatchCreated";
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  };
  payments: SubgraphWithdrawalBatchPaymentPropertiesFragment[];
};

export type SubgraphWithdrawalBatchPropertiesWithEventsFragment = {
  __typename?: "WithdrawalBatch";
  id: string;
  expiry: string;
  scaledTotalAmount: string;
  scaledAmountBurned: string;
  normalizedAmountPaid: string;
  normalizedAmountClaimed: string;
  totalNormalizedRequests: string;
  isExpired: boolean;
  isClosed: boolean;
  paymentsCount: number;
  lastScaleFactor: string;
  lastUpdatedTimestamp: number;
  totalInterestEarned: string;
  withdrawals: SubgraphLenderWithdrawalPropertiesFragment[];
  requests: SubgraphWithdrawalRequestPropertiesFragment[];
  executions: SubgraphWithdrawalExecutionPropertiesFragment[];
  creation: {
    __typename?: "WithdrawalBatchCreated";
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  };
  payments: SubgraphWithdrawalBatchPaymentPropertiesFragment[];
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
  __typename?: "Query";
  market?: SubgraphMarketRecordsFragment | null;
};

export type SubgraphMarketRecordsFragment = {
  __typename?: "Market";
  depositRecords: SubgraphDepositDataFragment[];
  borrowRecords: SubgraphBorrowDataFragment[];
  feeCollectionRecords: SubgraphFeesCollectedDataFragment[];
  repaymentRecords: SubgraphRepaymentDataFragment[];
};

export type SubgraphBorrowDataFragment = {
  __typename?: "Borrow";
  assetAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphRepaymentDataFragment = {
  __typename?: "DebtRepaid";
  from: string;
  assetAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
};

export type SubgraphFeesCollectedDataFragment = {
  __typename?: "FeesCollected";
  feesCollected: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
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
export const DepositDataFragmentDoc = gql`
  fragment DepositData on Deposit {
    id
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
      id
      address
      name
      symbol
      decimals
      isMock
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
    deployedEvent {
      ...MarketDeployedEvent
    }
  }
`;
export const BorrowDataFragmentDoc = gql`
  fragment BorrowData on Borrow {
    assetAmount
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const FeesCollectedDataFragmentDoc = gql`
  fragment FeesCollectedData on FeesCollected {
    feesCollected
    blockNumber
    blockTimestamp
    transactionHash
  }
`;
export const RepaymentDataFragmentDoc = gql`
  fragment RepaymentData on DebtRepaid {
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
    ...MarketRecords
  }
`;
export const AprConstraintsFragmentDoc = gql`
  fragment AprConstraints on ParameterConstraints {
    minimumAnnualInterestBips
    maximumAnnualInterestBips
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
export const GetLenderAccountForMarketDocument = gql`
  query getLenderAccountForMarket(
    $market: ID!
    $lender: Bytes!
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
  ) {
    market(id: $market) {
      lenders(where: { address: $lender }) {
        ...AccountDataForLenderView
      }
    }
  }
  ${AccountDataForLenderViewFragmentDoc}
  ${LenderPropertiesFragmentDoc}
  ${DepositDataFragmentDoc}
`;

/**
 * __useGetLenderAccountForMarketQuery__
 *
 * To run a query within a React component, call `useGetLenderAccountForMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLenderAccountForMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLenderAccountForMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *      lender: // value for 'lender'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *   },
 * });
 */
export function useGetLenderAccountForMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >
): GetLenderAccountForMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >(GetLenderAccountForMarketDocument, options);
}
export function useGetLenderAccountForMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >
): GetLenderAccountForMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >(GetLenderAccountForMarketDocument, options);
}
export function useGetLenderAccountForMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >
): GetLenderAccountForMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetLenderAccountForMarketQuery,
    SubgraphGetLenderAccountForMarketQueryVariables
  >(GetLenderAccountForMarketDocument, options);
}
export type GetLenderAccountForMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables
>;
export type GetLenderAccountForMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables
>;
export type GetLenderAccountForMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetLenderAccountForMarketQuery,
  SubgraphGetLenderAccountForMarketQueryVariables
>;
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
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
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
  ${DepositDataFragmentDoc}
  ${MarketDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;

/**
 * __useGetLenderAccountWithMarketQuery__
 *
 * To run a query within a React component, call `useGetLenderAccountWithMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLenderAccountWithMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLenderAccountWithMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *      lender: // value for 'lender'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetLenderAccountWithMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetLenderAccountWithMarketQuery,
    SubgraphGetLenderAccountWithMarketQueryVariables
  >
): GetLenderAccountWithMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetLenderAccountWithMarketQuery,
    SubgraphGetLenderAccountWithMarketQueryVariables
  >(GetLenderAccountWithMarketDocument, options);
}
export function useGetLenderAccountWithMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetLenderAccountWithMarketQuery,
    SubgraphGetLenderAccountWithMarketQueryVariables
  >
): GetLenderAccountWithMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetLenderAccountWithMarketQuery,
    SubgraphGetLenderAccountWithMarketQueryVariables
  >(GetLenderAccountWithMarketDocument, options);
}
export function useGetLenderAccountWithMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetLenderAccountWithMarketQuery,
    SubgraphGetLenderAccountWithMarketQueryVariables
  >
): GetLenderAccountWithMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetLenderAccountWithMarketQuery,
    SubgraphGetLenderAccountWithMarketQueryVariables
  >(GetLenderAccountWithMarketDocument, options);
}
export type GetLenderAccountWithMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetLenderAccountWithMarketQuery,
  SubgraphGetLenderAccountWithMarketQueryVariables
>;
export type GetLenderAccountWithMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetLenderAccountWithMarketQuery,
  SubgraphGetLenderAccountWithMarketQueryVariables
>;
export type GetLenderAccountWithMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetLenderAccountWithMarketQuery,
  SubgraphGetLenderAccountWithMarketQueryVariables
>;
export type GetLenderAccountWithMarketQueryResult = Apollo.QueryResult<
  SubgraphGetLenderAccountWithMarketQuery,
  SubgraphGetLenderAccountWithMarketQueryVariables
>;
export const GetAllMarketsForLenderViewDocument = gql`
  query getAllMarketsForLenderView(
    $lender: Bytes
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
    $numBorrows: Int = 10
    $skipBorrows: Int = 0
    $orderBorrows: Borrow_orderBy = blockTimestamp
    $directionBorrows: OrderDirection = desc
    $numRepayments: Int = 10
    $skipRepayments: Int = 0
    $orderRepayments: DebtRepaid_orderBy = blockTimestamp
    $directionRepayments: OrderDirection = desc
  ) {
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
    lenderAccounts(
      where: {
        and: [
          { address: $lender }
          {
            or: [
              { role_in: [DepositAndWithdraw, WithdrawOnly] }
              { scaledBalance_gt: 0 }
              { controllerAuthorization_: { authorized: true } }
              { totalDeposited_gt: 0 }
            ]
          }
        ]
      }
    ) {
      ...AccountDataForLenderView
      market {
        id
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
  ${MarketDeployedEventFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
  ${AccountDataForLenderViewFragmentDoc}
  ${LenderPropertiesFragmentDoc}
  ${DepositDataFragmentDoc}
`;

/**
 * __useGetAllMarketsForLenderViewQuery__
 *
 * To run a query within a React component, call `useGetAllMarketsForLenderViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllMarketsForLenderViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllMarketsForLenderViewQuery({
 *   variables: {
 *      lender: // value for 'lender'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetAllMarketsForLenderViewQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >
): GetAllMarketsForLenderViewQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >(GetAllMarketsForLenderViewDocument, options);
}
export function useGetAllMarketsForLenderViewLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >
): GetAllMarketsForLenderViewLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >(GetAllMarketsForLenderViewDocument, options);
}
export function useGetAllMarketsForLenderViewSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >
): GetAllMarketsForLenderViewSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetAllMarketsForLenderViewQuery,
    SubgraphGetAllMarketsForLenderViewQueryVariables
  >(GetAllMarketsForLenderViewDocument, options);
}
export type GetAllMarketsForLenderViewQueryHookResult = Apollo.QueryResult<
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
>;
export type GetAllMarketsForLenderViewLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
>;
export type GetAllMarketsForLenderViewSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
>;
export type GetAllMarketsForLenderViewQueryResult = Apollo.QueryResult<
  SubgraphGetAllMarketsForLenderViewQuery,
  SubgraphGetAllMarketsForLenderViewQueryVariables
>;
export const GetAccountsWhereLenderAuthorizedOrActiveDocument = gql`
  query getAccountsWhereLenderAuthorizedOrActive(
    $lender: Bytes!
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
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
          { address: $lender }
          {
            or: [
              { role_in: [DepositAndWithdraw, WithdrawOnly] }
              { scaledBalance_gt: 0 }
              { controllerAuthorization_: { authorized: true } }
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
  ${DepositDataFragmentDoc}
  ${MarketDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;

/**
 * __useGetAccountsWhereLenderAuthorizedOrActiveQuery__
 *
 * To run a query within a React component, call `useGetAccountsWhereLenderAuthorizedOrActiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountsWhereLenderAuthorizedOrActiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountsWhereLenderAuthorizedOrActiveQuery({
 *   variables: {
 *      lender: // value for 'lender'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetAccountsWhereLenderAuthorizedOrActiveQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >
): GetAccountsWhereLenderAuthorizedOrActiveQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >(GetAccountsWhereLenderAuthorizedOrActiveDocument, options);
}
export function useGetAccountsWhereLenderAuthorizedOrActiveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >
): GetAccountsWhereLenderAuthorizedOrActiveLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >(GetAccountsWhereLenderAuthorizedOrActiveDocument, options);
}
export function useGetAccountsWhereLenderAuthorizedOrActiveSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >
): GetAccountsWhereLenderAuthorizedOrActiveSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >(GetAccountsWhereLenderAuthorizedOrActiveDocument, options);
}
export type GetAccountsWhereLenderAuthorizedOrActiveQueryHookResult = Apollo.QueryResult<
  SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
  SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
>;
export type GetAccountsWhereLenderAuthorizedOrActiveLazyQueryHookResult =
  Apollo.LazyQueryResultTuple<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >;
export type GetAccountsWhereLenderAuthorizedOrActiveSuspenseQueryHookResult =
  Apollo.UseSuspenseQueryResult<
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetAccountsWhereLenderAuthorizedOrActiveQueryVariables
  >;
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

/**
 * __useGetLenderWithdrawalsForMarketQuery__
 *
 * To run a query within a React component, call `useGetLenderWithdrawalsForMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLenderWithdrawalsForMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLenderWithdrawalsForMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *      lender: // value for 'lender'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *   },
 * });
 */
export function useGetLenderWithdrawalsForMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >
): GetLenderWithdrawalsForMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >(GetLenderWithdrawalsForMarketDocument, options);
}
export function useGetLenderWithdrawalsForMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >
): GetLenderWithdrawalsForMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >(GetLenderWithdrawalsForMarketDocument, options);
}
export function useGetLenderWithdrawalsForMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >
): GetLenderWithdrawalsForMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetLenderWithdrawalsForMarketQuery,
    SubgraphGetLenderWithdrawalsForMarketQueryVariables
  >(GetLenderWithdrawalsForMarketDocument, options);
}
export type GetLenderWithdrawalsForMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables
>;
export type GetLenderWithdrawalsForMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables
>;
export type GetLenderWithdrawalsForMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetLenderWithdrawalsForMarketQuery,
  SubgraphGetLenderWithdrawalsForMarketQueryVariables
>;
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

/**
 * __useGetLenderAuthorizationByMarketQuery__
 *
 * To run a query within a React component, call `useGetLenderAuthorizationByMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLenderAuthorizationByMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLenderAuthorizationByMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *      lender: // value for 'lender'
 *   },
 * });
 */
export function useGetLenderAuthorizationByMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetLenderAuthorizationByMarketQuery,
    SubgraphGetLenderAuthorizationByMarketQueryVariables
  >
): GetLenderAuthorizationByMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetLenderAuthorizationByMarketQuery,
    SubgraphGetLenderAuthorizationByMarketQueryVariables
  >(GetLenderAuthorizationByMarketDocument, options);
}
export function useGetLenderAuthorizationByMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetLenderAuthorizationByMarketQuery,
    SubgraphGetLenderAuthorizationByMarketQueryVariables
  >
): GetLenderAuthorizationByMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetLenderAuthorizationByMarketQuery,
    SubgraphGetLenderAuthorizationByMarketQueryVariables
  >(GetLenderAuthorizationByMarketDocument, options);
}
export function useGetLenderAuthorizationByMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetLenderAuthorizationByMarketQuery,
    SubgraphGetLenderAuthorizationByMarketQueryVariables
  >
): GetLenderAuthorizationByMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetLenderAuthorizationByMarketQuery,
    SubgraphGetLenderAuthorizationByMarketQueryVariables
  >(GetLenderAuthorizationByMarketDocument, options);
}
export type GetLenderAuthorizationByMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetLenderAuthorizationByMarketQuery,
  SubgraphGetLenderAuthorizationByMarketQueryVariables
>;
export type GetLenderAuthorizationByMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetLenderAuthorizationByMarketQuery,
  SubgraphGetLenderAuthorizationByMarketQueryVariables
>;
export type GetLenderAuthorizationByMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetLenderAuthorizationByMarketQuery,
  SubgraphGetLenderAuthorizationByMarketQueryVariables
>;
export type GetLenderAuthorizationByMarketQueryResult = Apollo.QueryResult<
  SubgraphGetLenderAuthorizationByMarketQuery,
  SubgraphGetLenderAuthorizationByMarketQueryVariables
>;
export const GetMarketsAndLogsWhereLenderAuthorizedOrActiveDocument = gql`
  query getMarketsAndLogsWhereLenderAuthorizedOrActive(
    $lender: Bytes!
    $minimumBalance: BigInt = 1
    $numDeposits: Int = 200
    $skipDeposits: Int = 0
    $orderDeposits: Deposit_orderBy = blockTimestamp
    $directionDeposits: OrderDirection = desc
    $numWithdrawals: Int = 200
    $skipWithdrawals: Int = 0
  ) {
    lenderAccounts(
      where: {
        address: $lender
        or: [
          { role_in: [DepositAndWithdraw, WithdrawOnly] }
          { scaledBalance_gt: $minimumBalance }
          { controllerAuthorization_: { authorized: true } }
        ]
      }
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

/**
 * __useGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery__
 *
 * To run a query within a React component, call `useGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery({
 *   variables: {
 *      lender: // value for 'lender'
 *      minimumBalance: // value for 'minimumBalance'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *   },
 * });
 */
export function useGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >
): GetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >(GetMarketsAndLogsWhereLenderAuthorizedOrActiveDocument, options);
}
export function useGetMarketsAndLogsWhereLenderAuthorizedOrActiveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >
): GetMarketsAndLogsWhereLenderAuthorizedOrActiveLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >(GetMarketsAndLogsWhereLenderAuthorizedOrActiveDocument, options);
}
export function useGetMarketsAndLogsWhereLenderAuthorizedOrActiveSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >
): GetMarketsAndLogsWhereLenderAuthorizedOrActiveSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >(GetMarketsAndLogsWhereLenderAuthorizedOrActiveDocument, options);
}
export type GetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryHookResult = Apollo.QueryResult<
  SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
  SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
>;
export type GetMarketsAndLogsWhereLenderAuthorizedOrActiveLazyQueryHookResult =
  Apollo.LazyQueryResultTuple<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >;
export type GetMarketsAndLogsWhereLenderAuthorizedOrActiveSuspenseQueryHookResult =
  Apollo.UseSuspenseQueryResult<
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
    SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
  >;
export type GetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryResult = Apollo.QueryResult<
  SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQuery,
  SubgraphGetMarketsAndLogsWhereLenderAuthorizedOrActiveQueryVariables
>;
export const GetMarketsForBorrowerDocument = gql`
  query getMarketsForBorrower(
    $borrower: Bytes!
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
    controllers(where: { borrower: $borrower }) {
      markets(
        orderBy: $orderMarkets
        orderDirection: $directionMarkets
        first: $numMarkets
        skip: $skipMarkets
      ) {
        ...MarketDataWithEvents
      }
    }
  }
  ${MarketDataWithEventsFragmentDoc}
  ${MarketDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${MarketRecordsFragmentDoc}
  ${DepositDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;

/**
 * __useGetMarketsForBorrowerQuery__
 *
 * To run a query within a React component, call `useGetMarketsForBorrowerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketsForBorrowerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketsForBorrowerQuery({
 *   variables: {
 *      borrower: // value for 'borrower'
 *      numMarkets: // value for 'numMarkets'
 *      skipMarkets: // value for 'skipMarkets'
 *      orderMarkets: // value for 'orderMarkets'
 *      directionMarkets: // value for 'directionMarkets'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numFeeCollections: // value for 'numFeeCollections'
 *      skipFeeCollections: // value for 'skipFeeCollections'
 *      orderFeeCollections: // value for 'orderFeeCollections'
 *      directionFeeCollections: // value for 'directionFeeCollections'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetMarketsForBorrowerQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >
): GetMarketsForBorrowerQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >(GetMarketsForBorrowerDocument, options);
}
export function useGetMarketsForBorrowerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >
): GetMarketsForBorrowerLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >(GetMarketsForBorrowerDocument, options);
}
export function useGetMarketsForBorrowerSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >
): GetMarketsForBorrowerSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetMarketsForBorrowerQuery,
    SubgraphGetMarketsForBorrowerQueryVariables
  >(GetMarketsForBorrowerDocument, options);
}
export type GetMarketsForBorrowerQueryHookResult = Apollo.QueryResult<
  SubgraphGetMarketsForBorrowerQuery,
  SubgraphGetMarketsForBorrowerQueryVariables
>;
export type GetMarketsForBorrowerLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetMarketsForBorrowerQuery,
  SubgraphGetMarketsForBorrowerQueryVariables
>;
export type GetMarketsForBorrowerSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetMarketsForBorrowerQuery,
  SubgraphGetMarketsForBorrowerQueryVariables
>;
export type GetMarketsForBorrowerQueryResult = Apollo.QueryResult<
  SubgraphGetMarketsForBorrowerQuery,
  SubgraphGetMarketsForBorrowerQueryVariables
>;
export const GetMarketsForAllBorrowersDocument = gql`
  query getMarketsForAllBorrowers(
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
  ${MarketDeployedEventFragmentDoc}
  ${MarketRecordsFragmentDoc}
  ${DepositDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;

/**
 * __useGetMarketsForAllBorrowersQuery__
 *
 * To run a query within a React component, call `useGetMarketsForAllBorrowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketsForAllBorrowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketsForAllBorrowersQuery({
 *   variables: {
 *      numMarkets: // value for 'numMarkets'
 *      skipMarkets: // value for 'skipMarkets'
 *      orderMarkets: // value for 'orderMarkets'
 *      directionMarkets: // value for 'directionMarkets'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numFeeCollections: // value for 'numFeeCollections'
 *      skipFeeCollections: // value for 'skipFeeCollections'
 *      orderFeeCollections: // value for 'orderFeeCollections'
 *      directionFeeCollections: // value for 'directionFeeCollections'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetMarketsForAllBorrowersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >
): GetMarketsForAllBorrowersQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >(GetMarketsForAllBorrowersDocument, options);
}
export function useGetMarketsForAllBorrowersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >
): GetMarketsForAllBorrowersLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >(GetMarketsForAllBorrowersDocument, options);
}
export function useGetMarketsForAllBorrowersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >
): GetMarketsForAllBorrowersSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetMarketsForAllBorrowersQuery,
    SubgraphGetMarketsForAllBorrowersQueryVariables
  >(GetMarketsForAllBorrowersDocument, options);
}
export type GetMarketsForAllBorrowersQueryHookResult = Apollo.QueryResult<
  SubgraphGetMarketsForAllBorrowersQuery,
  SubgraphGetMarketsForAllBorrowersQueryVariables
>;
export type GetMarketsForAllBorrowersLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetMarketsForAllBorrowersQuery,
  SubgraphGetMarketsForAllBorrowersQueryVariables
>;
export type GetMarketsForAllBorrowersSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetMarketsForAllBorrowersQuery,
  SubgraphGetMarketsForAllBorrowersQueryVariables
>;
export type GetMarketsForAllBorrowersQueryResult = Apollo.QueryResult<
  SubgraphGetMarketsForAllBorrowersQuery,
  SubgraphGetMarketsForAllBorrowersQueryVariables
>;
export const GetMarketDocument = gql`
  query getMarket(
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
      ...MarketDataWithEvents
    }
  }
  ${MarketDataWithEventsFragmentDoc}
  ${MarketDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
  ${MarketRecordsFragmentDoc}
  ${DepositDataFragmentDoc}
  ${BorrowDataFragmentDoc}
  ${FeesCollectedDataFragmentDoc}
  ${RepaymentDataFragmentDoc}
`;

/**
 * __useGetMarketQuery__
 *
 * To run a query within a React component, call `useGetMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numFeeCollections: // value for 'numFeeCollections'
 *      skipFeeCollections: // value for 'skipFeeCollections'
 *      orderFeeCollections: // value for 'orderFeeCollections'
 *      directionFeeCollections: // value for 'directionFeeCollections'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetMarketQuery(
  baseOptions: Apollo.QueryHookOptions<SubgraphGetMarketQuery, SubgraphGetMarketQueryVariables>
): GetMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubgraphGetMarketQuery, SubgraphGetMarketQueryVariables>(
    GetMarketDocument,
    options
  );
}
export function useGetMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubgraphGetMarketQuery, SubgraphGetMarketQueryVariables>
): GetMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SubgraphGetMarketQuery, SubgraphGetMarketQueryVariables>(
    GetMarketDocument,
    options
  );
}
export function useGetMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetMarketQuery,
    SubgraphGetMarketQueryVariables
  >
): GetMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SubgraphGetMarketQuery, SubgraphGetMarketQueryVariables>(
    GetMarketDocument,
    options
  );
}
export type GetMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetMarketQuery,
  SubgraphGetMarketQueryVariables
>;
export type GetMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetMarketQuery,
  SubgraphGetMarketQueryVariables
>;
export type GetMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetMarketQuery,
  SubgraphGetMarketQueryVariables
>;
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

/**
 * __useGetWithdrawalRequestsByMarketQuery__
 *
 * To run a query within a React component, call `useGetWithdrawalRequestsByMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWithdrawalRequestsByMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWithdrawalRequestsByMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *      numWithdrawals: // value for 'numWithdrawals'
 *      skipWithdrawals: // value for 'skipWithdrawals'
 *      orderWithdrawals: // value for 'orderWithdrawals'
 *      directionWithdrawals: // value for 'directionWithdrawals'
 *   },
 * });
 */
export function useGetWithdrawalRequestsByMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetWithdrawalRequestsByMarketQuery,
    SubgraphGetWithdrawalRequestsByMarketQueryVariables
  >
): GetWithdrawalRequestsByMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetWithdrawalRequestsByMarketQuery,
    SubgraphGetWithdrawalRequestsByMarketQueryVariables
  >(GetWithdrawalRequestsByMarketDocument, options);
}
export function useGetWithdrawalRequestsByMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetWithdrawalRequestsByMarketQuery,
    SubgraphGetWithdrawalRequestsByMarketQueryVariables
  >
): GetWithdrawalRequestsByMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetWithdrawalRequestsByMarketQuery,
    SubgraphGetWithdrawalRequestsByMarketQueryVariables
  >(GetWithdrawalRequestsByMarketDocument, options);
}
export function useGetWithdrawalRequestsByMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetWithdrawalRequestsByMarketQuery,
    SubgraphGetWithdrawalRequestsByMarketQueryVariables
  >
): GetWithdrawalRequestsByMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetWithdrawalRequestsByMarketQuery,
    SubgraphGetWithdrawalRequestsByMarketQueryVariables
  >(GetWithdrawalRequestsByMarketDocument, options);
}
export type GetWithdrawalRequestsByMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetWithdrawalRequestsByMarketQuery,
  SubgraphGetWithdrawalRequestsByMarketQueryVariables
>;
export type GetWithdrawalRequestsByMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetWithdrawalRequestsByMarketQuery,
  SubgraphGetWithdrawalRequestsByMarketQueryVariables
>;
export type GetWithdrawalRequestsByMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetWithdrawalRequestsByMarketQuery,
  SubgraphGetWithdrawalRequestsByMarketQueryVariables
>;
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

/**
 * __useGetAllPendingWithdrawalBatchesForMarketQuery__
 *
 * To run a query within a React component, call `useGetAllPendingWithdrawalBatchesForMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPendingWithdrawalBatchesForMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPendingWithdrawalBatchesForMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *   },
 * });
 */
export function useGetAllPendingWithdrawalBatchesForMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >
): GetAllPendingWithdrawalBatchesForMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >(GetAllPendingWithdrawalBatchesForMarketDocument, options);
}
export function useGetAllPendingWithdrawalBatchesForMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >
): GetAllPendingWithdrawalBatchesForMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >(GetAllPendingWithdrawalBatchesForMarketDocument, options);
}
export function useGetAllPendingWithdrawalBatchesForMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >
): GetAllPendingWithdrawalBatchesForMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >(GetAllPendingWithdrawalBatchesForMarketDocument, options);
}
export type GetAllPendingWithdrawalBatchesForMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
>;
export type GetAllPendingWithdrawalBatchesForMarketLazyQueryHookResult =
  Apollo.LazyQueryResultTuple<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >;
export type GetAllPendingWithdrawalBatchesForMarketSuspenseQueryHookResult =
  Apollo.UseSuspenseQueryResult<
    SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
    SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
  >;
export type GetAllPendingWithdrawalBatchesForMarketQueryResult = Apollo.QueryResult<
  SubgraphGetAllPendingWithdrawalBatchesForMarketQuery,
  SubgraphGetAllPendingWithdrawalBatchesForMarketQueryVariables
>;
export const GetAllMarketsDocument = gql`
  query getAllMarkets {
    markets {
      ...MarketData
    }
  }
  ${MarketDataFragmentDoc}
  ${MarketDeployedEventFragmentDoc}
`;

/**
 * __useGetAllMarketsQuery__
 *
 * To run a query within a React component, call `useGetAllMarketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllMarketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllMarketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllMarketsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubgraphGetAllMarketsQuery,
    SubgraphGetAllMarketsQueryVariables
  >
): GetAllMarketsQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubgraphGetAllMarketsQuery, SubgraphGetAllMarketsQueryVariables>(
    GetAllMarketsDocument,
    options
  );
}
export function useGetAllMarketsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetAllMarketsQuery,
    SubgraphGetAllMarketsQueryVariables
  >
): GetAllMarketsLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SubgraphGetAllMarketsQuery, SubgraphGetAllMarketsQueryVariables>(
    GetAllMarketsDocument,
    options
  );
}
export function useGetAllMarketsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetAllMarketsQuery,
    SubgraphGetAllMarketsQueryVariables
  >
): GetAllMarketsSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SubgraphGetAllMarketsQuery, SubgraphGetAllMarketsQueryVariables>(
    GetAllMarketsDocument,
    options
  );
}
export type GetAllMarketsQueryHookResult = Apollo.QueryResult<
  SubgraphGetAllMarketsQuery,
  SubgraphGetAllMarketsQueryVariables
>;
export type GetAllMarketsLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetAllMarketsQuery,
  SubgraphGetAllMarketsQueryVariables
>;
export type GetAllMarketsSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetAllMarketsQuery,
  SubgraphGetAllMarketsQueryVariables
>;
export type GetAllMarketsQueryResult = Apollo.QueryResult<
  SubgraphGetAllMarketsQuery,
  SubgraphGetAllMarketsQueryVariables
>;
export const GetAuthorizedLendersByMarketDocument = gql`
  query getAuthorizedLendersByMarket($market: ID!) {
    market(id: $market) {
      controller {
        authorizedLenders(where: { authorized: true }) {
          lender
        }
      }
    }
  }
`;

/**
 * __useGetAuthorizedLendersByMarketQuery__
 *
 * To run a query within a React component, call `useGetAuthorizedLendersByMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthorizedLendersByMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthorizedLendersByMarketQuery({
 *   variables: {
 *      market: // value for 'market'
 *   },
 * });
 */
export function useGetAuthorizedLendersByMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >
): GetAuthorizedLendersByMarketQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >(GetAuthorizedLendersByMarketDocument, options);
}
export function useGetAuthorizedLendersByMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >
): GetAuthorizedLendersByMarketLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >(GetAuthorizedLendersByMarketDocument, options);
}
export function useGetAuthorizedLendersByMarketSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >
): GetAuthorizedLendersByMarketSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetAuthorizedLendersByMarketQuery,
    SubgraphGetAuthorizedLendersByMarketQueryVariables
  >(GetAuthorizedLendersByMarketDocument, options);
}
export type GetAuthorizedLendersByMarketQueryHookResult = Apollo.QueryResult<
  SubgraphGetAuthorizedLendersByMarketQuery,
  SubgraphGetAuthorizedLendersByMarketQueryVariables
>;
export type GetAuthorizedLendersByMarketLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetAuthorizedLendersByMarketQuery,
  SubgraphGetAuthorizedLendersByMarketQueryVariables
>;
export type GetAuthorizedLendersByMarketSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetAuthorizedLendersByMarketQuery,
  SubgraphGetAuthorizedLendersByMarketQueryVariables
>;
export type GetAuthorizedLendersByMarketQueryResult = Apollo.QueryResult<
  SubgraphGetAuthorizedLendersByMarketQuery,
  SubgraphGetAuthorizedLendersByMarketQueryVariables
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

/**
 * __useGetAuthorizedLendersByBorrowerQuery__
 *
 * To run a query within a React component, call `useGetAuthorizedLendersByBorrowerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthorizedLendersByBorrowerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthorizedLendersByBorrowerQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAuthorizedLendersByBorrowerQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetAuthorizedLendersByBorrowerQuery,
    SubgraphGetAuthorizedLendersByBorrowerQueryVariables
  >
): GetAuthorizedLendersByBorrowerQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SubgraphGetAuthorizedLendersByBorrowerQuery,
    SubgraphGetAuthorizedLendersByBorrowerQueryVariables
  >(GetAuthorizedLendersByBorrowerDocument, options);
}
export function useGetAuthorizedLendersByBorrowerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetAuthorizedLendersByBorrowerQuery,
    SubgraphGetAuthorizedLendersByBorrowerQueryVariables
  >
): GetAuthorizedLendersByBorrowerLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetAuthorizedLendersByBorrowerQuery,
    SubgraphGetAuthorizedLendersByBorrowerQueryVariables
  >(GetAuthorizedLendersByBorrowerDocument, options);
}
export function useGetAuthorizedLendersByBorrowerSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetAuthorizedLendersByBorrowerQuery,
    SubgraphGetAuthorizedLendersByBorrowerQueryVariables
  >
): GetAuthorizedLendersByBorrowerSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetAuthorizedLendersByBorrowerQuery,
    SubgraphGetAuthorizedLendersByBorrowerQueryVariables
  >(GetAuthorizedLendersByBorrowerDocument, options);
}
export type GetAuthorizedLendersByBorrowerQueryHookResult = Apollo.QueryResult<
  SubgraphGetAuthorizedLendersByBorrowerQuery,
  SubgraphGetAuthorizedLendersByBorrowerQueryVariables
>;
export type GetAuthorizedLendersByBorrowerLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetAuthorizedLendersByBorrowerQuery,
  SubgraphGetAuthorizedLendersByBorrowerQueryVariables
>;
export type GetAuthorizedLendersByBorrowerSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetAuthorizedLendersByBorrowerQuery,
  SubgraphGetAuthorizedLendersByBorrowerQueryVariables
>;
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

/**
 * __useGetSubgraphStatusQuery__
 *
 * To run a query within a React component, call `useGetSubgraphStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubgraphStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubgraphStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSubgraphStatusQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubgraphGetSubgraphStatusQuery,
    SubgraphGetSubgraphStatusQueryVariables
  >
): GetSubgraphStatusQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubgraphGetSubgraphStatusQuery, SubgraphGetSubgraphStatusQueryVariables>(
    GetSubgraphStatusDocument,
    options
  );
}
export function useGetSubgraphStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetSubgraphStatusQuery,
    SubgraphGetSubgraphStatusQueryVariables
  >
): GetSubgraphStatusLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SubgraphGetSubgraphStatusQuery,
    SubgraphGetSubgraphStatusQueryVariables
  >(GetSubgraphStatusDocument, options);
}
export function useGetSubgraphStatusSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetSubgraphStatusQuery,
    SubgraphGetSubgraphStatusQueryVariables
  >
): GetSubgraphStatusSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetSubgraphStatusQuery,
    SubgraphGetSubgraphStatusQueryVariables
  >(GetSubgraphStatusDocument, options);
}
export type GetSubgraphStatusQueryHookResult = Apollo.QueryResult<
  SubgraphGetSubgraphStatusQuery,
  SubgraphGetSubgraphStatusQueryVariables
>;
export type GetSubgraphStatusLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetSubgraphStatusQuery,
  SubgraphGetSubgraphStatusQueryVariables
>;
export type GetSubgraphStatusSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetSubgraphStatusQuery,
  SubgraphGetSubgraphStatusQueryVariables
>;
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

/**
 * __useGetMarketRecordsQuery__
 *
 * To run a query within a React component, call `useGetMarketRecordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketRecordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketRecordsQuery({
 *   variables: {
 *      market: // value for 'market'
 *      numDeposits: // value for 'numDeposits'
 *      skipDeposits: // value for 'skipDeposits'
 *      orderDeposits: // value for 'orderDeposits'
 *      directionDeposits: // value for 'directionDeposits'
 *      numBorrows: // value for 'numBorrows'
 *      skipBorrows: // value for 'skipBorrows'
 *      orderBorrows: // value for 'orderBorrows'
 *      directionBorrows: // value for 'directionBorrows'
 *      numFeeCollections: // value for 'numFeeCollections'
 *      skipFeeCollections: // value for 'skipFeeCollections'
 *      orderFeeCollections: // value for 'orderFeeCollections'
 *      directionFeeCollections: // value for 'directionFeeCollections'
 *      numRepayments: // value for 'numRepayments'
 *      skipRepayments: // value for 'skipRepayments'
 *      orderRepayments: // value for 'orderRepayments'
 *      directionRepayments: // value for 'directionRepayments'
 *   },
 * });
 */
export function useGetMarketRecordsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SubgraphGetMarketRecordsQuery,
    SubgraphGetMarketRecordsQueryVariables
  >
): GetMarketRecordsQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubgraphGetMarketRecordsQuery, SubgraphGetMarketRecordsQueryVariables>(
    GetMarketRecordsDocument,
    options
  );
}
export function useGetMarketRecordsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubgraphGetMarketRecordsQuery,
    SubgraphGetMarketRecordsQueryVariables
  >
): GetMarketRecordsLazyQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SubgraphGetMarketRecordsQuery, SubgraphGetMarketRecordsQueryVariables>(
    GetMarketRecordsDocument,
    options
  );
}
export function useGetMarketRecordsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubgraphGetMarketRecordsQuery,
    SubgraphGetMarketRecordsQueryVariables
  >
): GetMarketRecordsSuspenseQueryHookResult {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SubgraphGetMarketRecordsQuery,
    SubgraphGetMarketRecordsQueryVariables
  >(GetMarketRecordsDocument, options);
}
export type GetMarketRecordsQueryHookResult = Apollo.QueryResult<
  SubgraphGetMarketRecordsQuery,
  SubgraphGetMarketRecordsQueryVariables
>;
export type GetMarketRecordsLazyQueryHookResult = Apollo.LazyQueryResultTuple<
  SubgraphGetMarketRecordsQuery,
  SubgraphGetMarketRecordsQueryVariables
>;
export type GetMarketRecordsSuspenseQueryHookResult = Apollo.UseSuspenseQueryResult<
  SubgraphGetMarketRecordsQuery,
  SubgraphGetMarketRecordsQueryVariables
>;
export type GetMarketRecordsQueryResult = Apollo.QueryResult<
  SubgraphGetMarketRecordsQuery,
  SubgraphGetMarketRecordsQueryVariables
>;
