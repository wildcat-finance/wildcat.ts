import { expect } from "chai";
import { providers } from "ethers";
import { MarketCollateralV1 } from "../../src/collateral";
import { SupportedChainId } from "../../src/constants";
import {
  SubgraphSimpleCollateralContractDataFragment,
  SubgraphSnapshotSource
} from "../../src/gql/graphql";
import { Market } from "../../src/market";
import { Token } from "../../src/token";
import { CollateralContractDataStructOutput } from "../../src/lens-types";

const provider = new providers.JsonRpcProvider();
const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const makeToken = (suffix: number, symbol: string) => ({
  __typename: "Token" as const,
  id: makeAddress(suffix),
  address: makeAddress(suffix),
  name: symbol,
  symbol,
  decimals: 18,
  isMock: false
});

describe("collateral indexed snapshots", () => {
  it("uses explicit freshness-stamped snapshot state", () => {
    const data: SubgraphSimpleCollateralContractDataFragment = {
      __typename: "SimpleCollateralContract",
      id: makeAddress(1),
      factory: {
        __typename: "SimpleCollateralFactory",
        id: makeAddress(2),
        approvedExchanges: []
      },
      market: {
        __typename: "Market",
        id: makeAddress(3),
        underlyingAsset: makeToken(4, "USD"),
        isClosed: false,
        isDelinquent: false,
        timeDelinquent: 0,
        delinquencyGracePeriod: 86_400
      },
      collateralAsset: makeToken(5, "COL"),
      liquidationCooldown: 10,
      nextLiquidationTrigger: 11,
      totalDeposited: "1",
      totalReclaimed: "2",
      totalLiquidated: "3",
      totalShares: "4",
      availableCollateral: "5",
      lastFullLiquidationIndex: 6,
      depositIndex: 7,
      eventIndex: 8,
      snapshot: {
        __typename: "SimpleCollateralContractSnapshot",
        source: SubgraphSnapshotSource.EVENT_AND_CONTRACT_CALL,
        totalDeposited: "101",
        totalReclaimed: "102",
        totalLiquidated: "103",
        totalShares: "104",
        availableCollateral: "105",
        lastFullLiquidationIndex: 106,
        depositIndex: 107,
        liquidationCooldown: 108,
        nextLiquidationTrigger: 109,
        eventIndex: 110,
        updatedAtBlock: "111",
        updatedAtTimestamp: "1700000111",
        updatedAtTransaction: makeAddress(6),
        updatedAtLogIndex: "12"
      }
    };

    const market = {
      address: makeAddress(3),
      underlyingToken: Token.fromSubgraphToken(
        SupportedChainId.Sepolia,
        makeToken(4, "USD"),
        provider
      )
    } as Market;
    const collateral = MarketCollateralV1.fromSubgraphData(
      SupportedChainId.Sepolia,
      provider,
      market,
      data
    );

    expect(collateral.stateSource).to.equal("indexed");
    expect(collateral.availableCollateral.raw).to.equal(105n);
    expect(collateral.totalDeposited?.raw).to.equal(101n);
    expect(collateral.totalShares).to.equal(104n);
    expect(collateral.liquidationCooldown).to.equal(108);
    expect(collateral.indexedSnapshot).to.deep.include({
      source: "event-and-contract-call",
      blockNumber: 111n,
      blockTimestamp: 1_700_000_111n,
      logIndex: 12n
    });

    expect(() =>
      MarketCollateralV1.fromSubgraphData(
        SupportedChainId.Sepolia,
        provider,
        { ...market, address: makeAddress(99) } as Market,
        data
      )
    ).to.throw("Subgraph collateral market address mismatch");
    expect(() =>
      MarketCollateralV1.fromSubgraphData(SupportedChainId.Sepolia, provider, market, {
        ...data,
        market: { ...data.market!, underlyingAsset: makeToken(99, "OTHER") }
      })
    ).to.throw("Subgraph collateral underlying token address mismatch");

    const liveData: CollateralContractDataStructOutput = {
      collateralContract: data.id,
      market: market.address,
      marketBorrower: makeAddress(6),
      bebopSettlementContract: makeAddress(7),
      underlyingAsset: { ...makeToken(4, "USD"), token: makeAddress(4) },
      collateralAsset: { ...makeToken(5, "COL"), token: makeAddress(5) },
      liquidationCooldown: 108,
      maxRepaymentBips: 10000,
      fullLiquidationIndex: 106,
      totalShares: 204,
      availableCollateral: 205,
      collateralBalance: 205,
      nextLiquidationTrigger: 209,
      isMarketClosed: false,
      isMarketInPenalty: false,
      delinquentDebt: 0,
      maxRepayment: 0
    };
    expect(() => collateral.updateWith({ ...liveData, market: makeAddress(99) })).to.throw(
      "Live collateral market address mismatch"
    );
    expect(() =>
      collateral.updateWith({
        ...liveData,
        collateralAsset: { ...liveData.collateralAsset, token: makeAddress(99) }
      })
    ).to.throw("Live collateral token address mismatch");
    expect(collateral.availableCollateral.raw).to.equal(105n);
    expect(collateral.stateSource).to.equal("indexed");

    collateral.updateWith(liveData);
    expect(collateral.availableCollateral.raw).to.equal(205n);
    expect(collateral.stateSource).to.equal("live");
  });
});
