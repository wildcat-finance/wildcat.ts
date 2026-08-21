import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { getOperationAST } from "graphql";
import { getActiveLendersByMarket, getLenderAccountsForAllMarkets } from "../../src/gql";
import { SupportedChainId } from "../../src/constants";
import { HooksKind } from "../../src/domain";
import { Market } from "../../src/market";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

describe("legacy lender market discovery", () => {
  it("preserves hook credentials and known-market access on V2.0 schemas", async () => {
    const marketAddress = makeAddress(1);
    const lender = makeAddress(2);
    const hooksAddress = makeAddress(3);
    const hooksFactory = makeAddress(4);
    const providerAddress = makeAddress(5);
    const asset = makeAddress(6);
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            markets: [
              {
                __typename: "Market",
                id: marketAddress,
                version: "V2",
                isRegistered: true,
                isClosed: false,
                controller: null,
                borrower: makeAddress(7),
                sentinel: makeAddress(8),
                feeRecipient: makeAddress(9),
                name: "Legacy V2 market",
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
                hooksFactory: { __typename: "HooksFactory", id: hooksFactory },
                archController: { __typename: "ArchController", id: makeAddress(10) },
                hooksConfig: {
                  __typename: "HooksConfig",
                  id: `HOOKSCONFIG-${marketAddress}`,
                  useOnDeposit: true,
                  useOnQueueWithdrawal: true,
                  useOnExecuteWithdrawal: false,
                  useOnTransfer: true,
                  useOnBorrow: false,
                  useOnRepay: false,
                  useOnCloseMarket: true,
                  useOnNukeFromOrbit: false,
                  useOnSetMaxTotalSupply: false,
                  useOnSetAnnualInterestAndReserveRatioBips: true,
                  useOnSetProtocolFeeBips: false,
                  depositRequiresAccess: true,
                  transferRequiresAccess: false,
                  transfersDisabled: true,
                  minimumDeposit: "0",
                  allowForceBuyBacks: true,
                  queueWithdrawalRequiresAccess: false,
                  fixedTermEndTime: 1_800_000_000,
                  allowClosureBeforeTerm: true,
                  allowTermReduction: false
                },
                hooks: {
                  __typename: "HooksInstance",
                  id: hooksAddress,
                  borrower: makeAddress(7),
                  name: "Legacy fixed policy",
                  kind: "FixedTerm",
                  numMarkets: 1,
                  hooksTemplate: {
                    __typename: "HooksTemplate",
                    id: makeAddress(11),
                    name: "FixedTermHooks",
                    feeRecipient: makeAddress(9),
                    protocolFeeBips: 100,
                    originationFeeAsset: null,
                    originationFeeAmount: "0",
                    disabled: false
                  },
                  providers: [
                    {
                      __typename: "RoleProvider",
                      id: `PROVIDER-${providerAddress}`,
                      providerAddress,
                      timeToLive: "3600",
                      isPullProvider: true,
                      pullProviderIndex: 0,
                      isPushProvider: false,
                      pushProviderIndex: 16777215,
                      isApproved: true
                    }
                  ],
                  eventIndex: 1
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
                eventIndex: 1,
                deployedEvent: {
                  __typename: "MarketDeployed",
                  blockNumber: 100,
                  blockTimestamp: 1_600_000_000,
                  transactionHash: `0x${"1".repeat(64)}`
                },
                lenders: [
                  {
                    __typename: "LenderAccount",
                    id: `${marketAddress}-${lender}`,
                    address: lender,
                    scaledBalance: "0",
                    role: "Null",
                    totalDeposited: "0",
                    lastScaleFactor: (10n ** 27n).toString(),
                    lastUpdatedTimestamp: 1_700_000_000,
                    totalInterestEarned: "0",
                    numPendingWithdrawalBatches: 0,
                    controllerAuthorization: null,
                    hooksAccess: null,
                    knownLenderStatus: { id: `${marketAddress}-${lender}` },
                    deposits: []
                  }
                ]
              }
            ],
            controllerAuthorizations: [],
            lenderHooksAccesses: [
              {
                __typename: "LenderHooksAccess",
                id: `${hooksAddress}-${lender}`,
                lender,
                isBlockedFromDeposits: false,
                lastProvider: {
                  __typename: "RoleProvider",
                  id: `PROVIDER-${providerAddress}`,
                  providerAddress,
                  timeToLive: "3600",
                  isPullProvider: true,
                  pullProviderIndex: 0,
                  isPushProvider: false,
                  pushProviderIndex: 16777215,
                  isApproved: true
                },
                canRefresh: true,
                lastApprovalTimestamp: 1_700_000_000,
                addedTimestamp: 1_700_000_000,
                hooks: { __typename: "HooksInstance", id: hooksAddress },
                knownLenderStatuses: []
              }
            ]
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const [account] = await getLenderAccountsForAllMarkets(client, {
      lender: lender.toUpperCase(),
      chainId: SupportedChainId.Mainnet,
      signerOrProvider: new providers.JsonRpcProvider(),
      fetchPolicy: "network-only"
    });

    expect(getOperationAST(calls[0].query)?.name?.value).to.equal(
      "legacyGetAllMarketsForLenderView"
    );
    expect(calls[0].variables?.lender).to.equal(lender);
    expect(account.market.address).to.equal(marketAddress);
    const hooksConfig = account.market.hooksConfig;
    expect(hooksConfig?.kind).to.equal(HooksKind.FixedTerm);
    if (!hooksConfig || hooksConfig.kind !== HooksKind.FixedTerm) {
      throw Error("Expected fixed-term hooks config");
    }
    expect(hooksConfig.allowForceBuyBacks).to.equal(true);
    expect(account.market.roleProviders?.[0]?.kind).to.equal("unknown");
    expect(account.credential?.lastProvider?.providerAddress).to.equal(providerAddress);
    expect(account.credential?.lastProvider?.kind).to.equal("unknown");
    expect(account.isKnownLender).to.equal(true);
  });

  it("routes active-lender reads through legacy provider data", async () => {
    const marketAddress = makeAddress(20);
    const lender = makeAddress(21);
    const providerAddress = makeAddress(22);
    const calls: Array<{ query: DocumentNode }> = [];
    const client = {
      query: async (args: { query: DocumentNode }) => {
        calls.push(args);
        return {
          data: {
            market: {
              lenders: [
                {
                  __typename: "LenderAccount",
                  id: `${marketAddress}-${lender}`,
                  address: lender,
                  scaledBalance: "100",
                  addedTimestamp: 1_700_000_000,
                  role: "DepositAndWithdraw",
                  controllerAuthorization: null,
                  hooksAccess: {
                    __typename: "LenderHooksAccess",
                    id: `${makeAddress(23)}-${lender}`,
                    lender,
                    isBlockedFromDeposits: false,
                    lastProvider: {
                      __typename: "RoleProvider",
                      id: `PROVIDER-${providerAddress}`,
                      providerAddress,
                      timeToLive: "3600",
                      isPullProvider: true,
                      pullProviderIndex: 0,
                      isPushProvider: false,
                      pushProviderIndex: 16777215,
                      isApproved: true
                    },
                    canRefresh: true,
                    lastApprovalTimestamp: 1_700_000_000,
                    addedTimestamp: 1_700_000_000
                  },
                  knownLenderStatus: { id: `${marketAddress}-${lender}` }
                }
              ]
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const [activeLender] = await getActiveLendersByMarket(client, {
      market: {
        chainId: SupportedChainId.Mainnet,
        address: marketAddress
      } as Market,
      fetchPolicy: "network-only"
    });

    expect(getOperationAST(calls[0].query)?.name?.value).to.equal("legacyGetActiveLendersByMarket");
    expect(activeLender.address).to.equal(lender);
    expect(activeLender.credential?.lastProvider).to.deep.include({
      kind: "unknown",
      providerAddress
    });
    expect(activeLender.isKnownLender).to.equal(true);
  });
});
