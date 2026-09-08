import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { rejects } from "assert";
import { expect } from "chai";
import { SupportedChainId } from "../../src/constants";
import { getIndexedMarket } from "../../src/gql";
import { LegacyMarketData, normalizeLegacyMarketData } from "../../src/gql/legacy-subgraph";
import { makeAddress, offlineProvider } from "../helpers/review-fixtures";

const marketAddress = makeAddress(0xabcd);
const makeLegacyMarket = (): LegacyMarketData => ({
  id: marketAddress,
  version: "V1",
  isRegistered: true,
  isClosed: false,
  controller: { id: makeAddress(1) },
  borrower: makeAddress(2),
  sentinel: makeAddress(3),
  feeRecipient: makeAddress(4),
  name: "Test market",
  symbol: "MKT",
  decimals: 6,
  protocolFeeBips: 100,
  delinquencyGracePeriod: 3600,
  delinquencyFeeBips: 500,
  withdrawalBatchDuration: 7200,
  numCollateralContracts: 0,
  _asset: {
    id: makeAddress(5),
    address: makeAddress(5),
    name: "Test asset",
    symbol: "AST",
    decimals: 6,
    isMock: false
  },
  maxTotalSupply: "1000000",
  totalAssets: "0",
  pendingProtocolFees: "0",
  normalizedUnclaimedWithdrawals: "0",
  scaledTotalSupply: "0",
  scaledPendingWithdrawals: "0",
  pendingWithdrawalExpiry: "0",
  isDelinquent: false,
  timeDelinquent: 0,
  annualInterestBips: 1000,
  reserveRatioBips: 0,
  scaleFactor: (10n ** 27n).toString(),
  lastInterestAccruedTimestamp: 1_700_000_000,
  originalAnnualInterestBips: 1000,
  originalReserveRatioBips: 0,
  temporaryReserveRatioExpiry: 0,
  temporaryReserveRatioActive: false,
  totalBorrowed: "0",
  totalRepaid: "0",
  totalBaseInterestAccrued: "0",
  totalDelinquencyFeesAccrued: "0",
  totalProtocolFeesAccrued: "0",
  totalDeposited: "0",
  eventIndex: 0
});

const createClient = (market: unknown) =>
  ({ query: async () => ({ data: { market } }) } as unknown as ApolloClient<NormalizedCacheObject>);

describe("indexed market detail identity", () => {
  for (const chainId of [SupportedChainId.Mainnet, SupportedChainId.Sepolia]) {
    const legacy = chainId === SupportedChainId.Mainnet;
    describe(legacy ? "legacy schema" : "V2.5 schema", () => {
      const options = {
        chainId,
        market: marketAddress,
        signerOrProvider: offlineProvider,
        shouldSkipRecords: true,
        fetchPolicy: "no-cache" as const
      };

      it("accepts the requested address regardless of response casing", async () => {
        const record = { ...makeLegacyMarket(), id: marketAddress.toUpperCase() };
        const data = legacy ? record : normalizeLegacyMarketData(chainId, record);
        const market = await getIndexedMarket(createClient(data), options);

        expect(market?.address.toLowerCase()).to.equal(marketAddress);
        expect(market?.stateSource).to.equal("indexed");
      });

      it("rejects a different returned market address", async () => {
        const otherAddress = makeAddress(0xef01);
        const data = legacy
          ? { ...makeLegacyMarket(), id: otherAddress }
          : {
              ...normalizeLegacyMarketData(chainId, makeLegacyMarket()),
              address: otherAddress
            };

        await rejects(getIndexedMarket(createClient(data), options), {
          message: "Subgraph market address mismatch"
        });
      });

      it("preserves the missing-market result", async () => {
        expect(await getIndexedMarket(createClient(null), options)).to.equal(undefined);
      });
    });
  }
});
