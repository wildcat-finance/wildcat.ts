import { Market, MarketArgs } from "../../src/market";
import { LenderRole, MarketAccount, MarketAccountArgs } from "../../src/account";
import { Token } from "../../src/token";
import { HooksKind, MarketVersion, SignerOrProvider } from "../../src/types";
import { SupportedChainId } from "../../src/constants";
import { RAY_BIGINT } from "../../src/utils";

export const makeAddress = (value: number): string => `0x${value.toString(16).padStart(40, "0")}`;
export const reviewTimestamp = 1_800_000_000;
export const offlineProvider: SignerOrProvider = {
  call: async () => {
    throw Error("Unexpected RPC call in offline fixture");
  },
  send: async () => {
    throw Error("Unexpected RPC send in offline fixture");
  }
};

export const makeMarket = (overrides: Partial<MarketArgs> = {}, decimals = 18): Market => {
  const chainId = overrides.chainId ?? SupportedChainId.Mainnet;
  const underlyingToken = new Token(
    chainId,
    makeAddress(1),
    "Asset",
    "AST",
    decimals,
    false,
    offlineProvider
  );
  const marketToken = new Token(
    chainId,
    makeAddress(2),
    "Market",
    "MKT",
    decimals,
    false,
    offlineProvider
  );
  const amount = (n: number) => underlyingToken.getAmount(BigInt(n) * 10n ** BigInt(decimals));
  return new Market({
    provider: offlineProvider,
    chainId,
    underlyingToken,
    marketToken,
    version: MarketVersion.V2,
    eventGeneration: "legacy",
    marketKind: "standard",
    borrower: makeAddress(3),
    feeRecipient: makeAddress(4),
    hooksConfig: {
      kind: HooksKind.OpenTerm,
      hooksAddress: makeAddress(5),
      flags: {
        useOnDeposit: true,
        useOnQueueWithdrawal: true,
        useOnExecuteWithdrawal: false,
        useOnTransfer: false,
        useOnBorrow: false,
        useOnRepay: false,
        useOnCloseMarket: false,
        useOnNukeFromOrbit: false,
        useOnSetMaxTotalSupply: false,
        useOnSetAnnualInterestAndReserveRatioBips: true,
        useOnSetProtocolFeeBips: false
      },
      depositRequiresAccess: false,
      transferRequiresAccess: false,
      transfersDisabled: false,
      allowForceBuyBacks: false
    },
    protocolFeeBips: 0,
    delinquencyFeeBips: 0,
    delinquencyGracePeriod: 86_400,
    withdrawalBatchDuration: 86_400,
    reserveRatioBips: 2_000,
    annualInterestBips: 1_000,
    temporaryReserveRatio: false,
    originalAnnualInterestBips: 1_000,
    originalReserveRatioBips: 2_000,
    temporaryReserveRatioExpiry: 0,
    isClosed: false,
    scaleFactor: RAY_BIGINT,
    totalSupply: amount(1_000_000),
    maxTotalSupply: amount(2_000_000),
    scaledTotalSupply: amount(1_000_000).raw,
    totalAssets: amount(1_000_000),
    lastAccruedProtocolFees: amount(0),
    normalizedUnclaimedWithdrawals: amount(0),
    scaledPendingWithdrawals: 0n,
    pendingWithdrawalExpiry: 0,
    isDelinquent: false,
    timeDelinquent: 0,
    lastInterestAccruedTimestamp: reviewTimestamp,
    unpaidWithdrawalBatchExpiries: [],
    coverageLiquidity: amount(200_000),
    ...overrides
  });
};

export const makeMarketAccount = (
  market: Market,
  overrides: Partial<MarketAccountArgs> = {}
): MarketAccount =>
  new MarketAccount({
    market,
    account: market.borrower,
    role: LenderRole.DepositAndWithdraw,
    isKnownLender: true,
    scaledMarketBalance: 100n * 10n ** BigInt(market.decimals),
    marketBalance: market.marketToken.getAmount(100n * 10n ** BigInt(market.decimals)),
    underlyingBalance: market.underlyingToken.getAmount(0),
    underlyingApproval: 0n,
    ...overrides
  });
