import { MarketAccount } from "./account";
import { Token } from "./token";
import { Market } from "./market";
import { TokenFactory } from "./mockerc20factory";
import { WithdrawalBatch } from "./withdrawal-batch";
import { LenderWithdrawalStatus } from "./withdrawal-status";
import { MarketController } from "./controller";

export * from "./account";
export * from "./access";
export * from "./analytics";
export * from "./abi";
export * from "./authority";
export * from "./client";
export * from "./collateral";
export * from "./constants";
export * from "./controller";
export * from "./market";
export * from "./mockerc20factory";
export * from "./periodic-settlement";
export * from "./token";
export * from "./types";
export * from "./withdrawal-batch";
export * from "./withdrawal-status";
export * from "./utils";
export * from "./gql";
export * from "./identity";
export * from "./interest-only-withdrawal";
export * from "./wrapper";

export const {
  getMarket,
  getMarketV2,
  getMarkets,
  getAllMarkets,
  getMarketsCount,
  getPaginatedMarkets,
  hydrateMarketsLive,
  refreshMarketsV2LiveData
} = Market;

export const { getWithdrawalBatch } = WithdrawalBatch;

export const { getWithdrawalForLender } = LenderWithdrawalStatus;

export const {
  getMarketAccount,
  getMarketAccountV2,
  getMarketAccountsForLender,
  getAllMarketAccountsForLender,
  getPaginatedMarketAccounts,
  hydrateMarketAccountsLive,
  refreshMarketAccountsV2LiveData
} = MarketAccount;

export const { getTokenData, getTokensData } = Token;

export const { deployToken, populateDeployToken, getNextTokenAddress } = TokenFactory;

export const { getController } = MarketController;
