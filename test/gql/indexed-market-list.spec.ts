import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { getOperationAST, print } from "graphql";
import { SupportedChainId } from "../../src/constants";
import { getIndexedMarketList } from "../../src/gql";
import {
  SubgraphMarketKind,
  SubgraphMarket_OrderBy,
  SubgraphOrderDirection
} from "../../src/gql/graphql";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

describe("indexed market discovery", () => {
  it("maps SDK-owned filters and pagination to Graph transport variables", async () => {
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return { data: { markets: [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const result = await getIndexedMarketList(client, {
      chainId: SupportedChainId.Sepolia,
      signerOrProvider: new providers.JsonRpcProvider(),
      filter: {
        addresses: [makeAddress(1).toUpperCase()],
        excludeAddresses: [makeAddress(2).toUpperCase()],
        borrower: makeAddress(3).toUpperCase(),
        asset: makeAddress(4).toUpperCase(),
        marketKinds: ["standard", "revolving", "unknown"],
        isClosed: false,
        isRegistered: true
      },
      first: 25,
      skip: 50,
      orderBy: "createdAtBlock",
      direction: "asc",
      fetchPolicy: "no-cache"
    });

    expect(result).to.deep.equal([]);
    expect(calls[0].variables).to.deep.equal({
      marketFilter: {
        address_in: [makeAddress(1)],
        address_not_in: [makeAddress(2)],
        borrower: makeAddress(3),
        asset: makeAddress(4),
        marketKind_in: [
          SubgraphMarketKind.STANDARD,
          SubgraphMarketKind.REVOLVING,
          SubgraphMarketKind.UNKNOWN
        ],
        isClosed: false,
        isRegistered: true
      },
      numMarkets: 25,
      skipMarkets: 50,
      orderMarkets: SubgraphMarket_OrderBy.createdAtBlock,
      directionMarkets: SubgraphOrderDirection.asc
    });
    expect(print(calls[0].query)).to.match(/latestDeposit:\s*depositRecords\(\s*first:\s*1/);
  });

  it("routes legacy chains through a V2.0-compatible document and normalizes the market", async () => {
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const marketAddress = makeAddress(10);
    const borrower = makeAddress(11);
    const asset = makeAddress(12);
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            markets: [
              {
                __typename: "Market",
                id: marketAddress,
                version: "V1",
                isRegistered: true,
                isClosed: false,
                controller: { __typename: "Controller", id: makeAddress(13) },
                borrower,
                sentinel: makeAddress(14),
                feeRecipient: makeAddress(15),
                name: "Legacy market",
                symbol: "Wildcat USDC",
                decimals: 6,
                protocolFeeBips: 100,
                delinquencyGracePeriod: 3600,
                delinquencyFeeBips: 500,
                withdrawalBatchDuration: 7200,
                numCollateralContracts: 0,
                _asset: {
                  __typename: "Token",
                  id: `TKN-${asset}`,
                  address: asset,
                  name: "USD Coin",
                  symbol: "USDC",
                  decimals: 6,
                  isMock: false
                },
                hooksConfig: null,
                hooks: null,
                hooksFactory: null,
                archController: { __typename: "ArchController", id: makeAddress(16) },
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
                latestDeposit: [
                  {
                    __typename: "Deposit",
                    blockTimestamp: 1_750_000_000
                  }
                ],
                eventIndex: 1,
                deployedEvent: {
                  __typename: "MarketDeployed",
                  blockNumber: 100,
                  blockTimestamp: 1_600_000_000,
                  transactionHash: `0x${"1".repeat(64)}`
                }
              }
            ]
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const [market] = await getIndexedMarketList(client, {
      chainId: SupportedChainId.Mainnet,
      signerOrProvider: new providers.JsonRpcProvider(),
      filter: {
        addresses: [marketAddress.toUpperCase()],
        borrower: borrower.toUpperCase(),
        marketKinds: ["standard"],
        isClosed: false
      },
      orderBy: "createdAtBlock",
      fetchPolicy: "no-cache"
    });

    expect(getOperationAST(calls[0].query)?.name?.value).to.equal("legacyGetMarketList");
    expect(print(calls[0].query)).to.match(/latestDeposit:\s*depositRecords\(\s*first:\s*1/);
    expect(calls[0].variables).to.deep.include({
      marketFilter: {
        id_in: [marketAddress],
        borrower,
        isClosed: false
      },
      orderMarkets: "createdAt"
    });
    expect(market.address).to.equal(marketAddress);
    expect(market.marketKind).to.equal("standard");
    expect(market.provenance?.generation).to.equal("legacy-v2");
    expect(market.stateSource).to.equal("indexed");
    expect(market.latestDepositTimestamp).to.equal(1_750_000_000);
  });
});
