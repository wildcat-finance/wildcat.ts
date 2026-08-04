import { expect } from "chai";
import { providers } from "ethers";
import { print } from "graphql";
import { SupportedChainId } from "../src/constants";
import { getAllMarketsForLenderViewDocumentForChain } from "../src/gql/document-selectors";
import {
  SubgraphLenderHooksAccessDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketVersion,
  SubgraphRoleProviderDataFragment
} from "../src/gql/graphql";
import { Market } from "../src/market";
import { parseSubgraphLenderHooksAccess, parseSubgraphRoleProvider } from "../src/utils";

const marketAddress = "0x0000000000000000000000000000000000000001";
const borrowerAddress = "0x0000000000000000000000000000000000000002";
const controllerAddress = "0x0000000000000000000000000000000000000003";
const assetAddress = "0x0000000000000000000000000000000000000004";
const providerAddress = "0x0000000000000000000000000000000000000005";

const makeMarketData = (totalAssets: string): SubgraphMarketDataWithEventsFragment => ({
  __typename: "Market",
  id: marketAddress,
  version: SubgraphMarketVersion.V1,
  isRegistered: true,
  isClosed: false,
  controller: { __typename: "Controller", id: controllerAddress },
  borrower: borrowerAddress,
  sentinel: "0x0000000000000000000000000000000000000000",
  feeRecipient: "0x0000000000000000000000000000000000000000",
  name: "Wildcat Test Market",
  symbol: "WILDCAT-TST",
  decimals: 18,
  protocolFeeBips: 0,
  delinquencyGracePeriod: 86_400,
  delinquencyFeeBips: 0,
  withdrawalBatchDuration: 86_400,
  numCollateralContracts: 0,
  _asset: {
    __typename: "Token",
    id: assetAddress,
    address: assetAddress,
    name: "Test Asset",
    symbol: "TST",
    decimals: 18,
    isMock: false
  },
  hooksConfig: null,
  hooks: null,
  maxTotalSupply: "1000000000000000000000",
  totalAssets,
  pendingProtocolFees: "0",
  normalizedUnclaimedWithdrawals: "0",
  scaledTotalSupply: "1000000000000000000000",
  scaledPendingWithdrawals: "0",
  pendingWithdrawalExpiry: "0",
  isDelinquent: false,
  timeDelinquent: 0,
  annualInterestBips: 1_000,
  reserveRatioBips: 0,
  scaleFactor: "1000000000000000000000000000",
  lastInterestAccruedTimestamp: 1_700_000_000,
  originalAnnualInterestBips: 1_000,
  originalReserveRatioBips: 0,
  temporaryReserveRatioExpiry: 0,
  temporaryReserveRatioActive: false,
  totalBorrowed: "0",
  totalRepaid: "0",
  totalBaseInterestAccrued: "0",
  totalDelinquencyFeesAccrued: "0",
  totalProtocolFeesAccrued: "0",
  totalDeposited: "1000000000000000000000",
  eventIndex: 1,
  deployedEvent: {
    __typename: "MarketDeployed",
    blockNumber: 1,
    blockTimestamp: 1_700_000_000,
    transactionHash: "0x01"
  },
  depositRecords: [],
  borrowRecords: [],
  feeCollectionRecords: [],
  repaymentRecords: [],
  periodicTermUpdatedRecords: [],
  periodicTermClosedRecord: null,
  annualInterestBipsReductionProposalRecords: []
});

const roleProvider: SubgraphRoleProviderDataFragment = {
  __typename: "RoleProvider",
  id: providerAddress,
  providerAddress,
  timeToLive: "4294967295",
  isPullProvider: false,
  pullProviderIndex: 2 ** 24 - 1,
  isPushProvider: true,
  pushProviderIndex: 0,
  isApproved: true
};

describe("Explore subgraph hydration", () => {
  it("requests totalAssets from both periodic and legacy market queries", () => {
    const queries = [SupportedChainId.Sepolia, SupportedChainId.Mainnet].map((chainId) =>
      print(getAllMarketsForLenderViewDocumentForChain(chainId))
    );

    expect(queries.every((query) => query.includes("totalAssets"))).to.equal(true);
  });

  it("hydrates totalAssets instead of waiting for a Lens update", () => {
    const totalAssets = "987654321012345678901";
    const market = Market.fromSubgraphMarketData(
      SupportedChainId.Mainnet,
      new providers.JsonRpcProvider(),
      makeMarketData(totalAssets)
    );

    expect(market.totalAssets.raw.toString()).to.equal(totalAssets);
    expect(market.liquidReserves.raw.toString()).to.equal(totalAssets);
  });

  it("normalizes Graph BigInt provider TTLs to the public number type", () => {
    const parsedProvider = parseSubgraphRoleProvider(roleProvider);
    const hooksAccess: SubgraphLenderHooksAccessDataFragment = {
      __typename: "LenderHooksAccess",
      id: "hooks-access",
      lender: borrowerAddress,
      isBlockedFromDeposits: false,
      canRefresh: true,
      lastApprovalTimestamp: 1_000,
      addedTimestamp: 1_000,
      lastProvider: roleProvider
    };
    const credential = parseSubgraphLenderHooksAccess(hooksAccess);

    expect(parsedProvider.timeToLive).to.equal(4_294_967_295);
    expect(credential.lastProvider?.timeToLive).to.equal(4_294_967_295);
    expect(credential.lastApprovalTimestamp + (credential.lastProvider?.timeToLive ?? 0)).to.equal(
      4_294_968_295
    );
  });
});
