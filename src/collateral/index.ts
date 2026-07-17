import { TokenAmount, toRawAmount } from "../token";
import type { CollateralContractDataStructOutput } from "../lens-types";
import {
  ContractWrapper,
  IndexedCollateralSnapshot,
  PartialTransaction,
  ReadStateSource,
  SignerOrProvider,
  TransactionHash
} from "../types";
import { Token } from "../token";
import {
  getCollateralFactoryContract,
  getCollateralLensContract,
  SupportedChainId
} from "../constants";
import {
  GetCollateralContractsByMarketDocument,
  SubgraphGetCollateralContractsByMarketQuery,
  SubgraphGetCollateralContractsByMarketQueryVariables,
  SubgraphSimpleCollateralContractDataFragment
} from "../gql/graphql";
import { Market } from "../market";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { assert, prepareTransaction, toNumber } from "../utils";
import { simpleMarketCollateralAbi, wildcatCollateralFactoryAbi } from "../abi";
import { submitPreparedTransaction } from "../internal/viem-write";
import { isEthersSigner } from "../internal/ethers-signer";
import { normalizeSubgraphCollateralSnapshot } from "../gql/normalizers";

export * from "./collateral-events";

export interface CollateralV1Args {
  provider: SignerOrProvider;
  address: string;
  underlyingAsset: Token;
  collateralAsset: Token;
  liquidationCooldown: number;
  maxRepaymentBips: number;
  fullLiquidationIndex: number;
  totalShares: bigint;
  availableCollateral: TokenAmount;
  nextLiquidationTrigger: number;
  eventIndex?: number;
  // isMarketClosed: boolean;
  // isMarketInPenalty: boolean;
  // delinquentDebt: TokenAmount;
  totalDeposited?: TokenAmount;
  totalReclaimed?: TokenAmount;
  totalLiquidated?: TokenAmount;
  market: Market;
  indexedSnapshot?: IndexedCollateralSnapshot;
  stateSource?: ReadStateSource;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MarketCollateralV1 extends CollateralV1Args {
  stateSource: ReadStateSource;
}

export class MarketCollateralV1 extends ContractWrapper {
  public address: string;

  constructor({ provider, address, ...args }: CollateralV1Args) {
    super(provider);
    this.address = address;
    Object.assign(this, { ...args, stateSource: args.stateSource ?? "live" });
  }

  get maxRepayment(): TokenAmount {
    return this.market.delinquentDebt.bipMul(this.maxRepaymentBips);
  }

  async deposit(amount: TokenAmount): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateDeposit(amount));
  }

  populateDeposit(amount: TokenAmount): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: simpleMarketCollateralAbi,
      functionName: "deposit",
      args: [amount.raw]
    });
  }

  async reclaimCollateral(): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateReclaimCollateral());
  }

  populateReclaimCollateral(): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: simpleMarketCollateralAbi,
      functionName: "reclaimCollateral"
    });
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    market: Market,
    data: SubgraphSimpleCollateralContractDataFragment
  ): MarketCollateralV1 {
    assert(data.market !== null && data.market !== undefined, "Collateral market is not indexed");
    assert(
      data.liquidationCooldown !== null && data.liquidationCooldown !== undefined,
      "Collateral liquidation cooldown is not indexed"
    );
    const collateralAsset = Token.fromSubgraphToken(chainId, data.collateralAsset, provider);
    const underlyingAsset = Token.fromSubgraphToken(chainId, data.market.underlyingAsset, provider);
    const indexedSnapshot = normalizeSubgraphCollateralSnapshot(data.snapshot);
    const indexedState = data.snapshot ?? data;

    return new MarketCollateralV1({
      provider,
      address: data.id,
      availableCollateral: collateralAsset.getAmount(indexedState.availableCollateral),
      totalShares: toRawAmount(indexedState.totalShares),

      totalDeposited: collateralAsset.getAmount(indexedState.totalDeposited),
      totalReclaimed: collateralAsset.getAmount(indexedState.totalReclaimed),
      totalLiquidated: collateralAsset.getAmount(indexedState.totalLiquidated),
      underlyingAsset,
      collateralAsset,
      liquidationCooldown: indexedState.liquidationCooldown ?? data.liquidationCooldown,
      maxRepaymentBips: 10000,
      fullLiquidationIndex: indexedState.lastFullLiquidationIndex,
      nextLiquidationTrigger: indexedState.nextLiquidationTrigger,
      market,
      eventIndex: indexedState.eventIndex,
      indexedSnapshot,
      stateSource: "indexed"
    });
  }

  updateWith(
    data: CollateralContractDataStructOutput | SubgraphSimpleCollateralContractDataFragment
  ): void {
    this.availableCollateral = this.collateralAsset.getAmount(data.availableCollateral);
    if ("__typename" in data) {
      this.totalDeposited = this.collateralAsset.getAmount(data.totalDeposited);
      this.totalReclaimed = this.collateralAsset.getAmount(data.totalReclaimed);
      this.totalLiquidated = this.collateralAsset.getAmount(data.totalLiquidated);
      this.totalShares = toRawAmount(data.totalShares);
      this.fullLiquidationIndex = toNumber(data.lastFullLiquidationIndex);
    } else {
      this.totalShares = toRawAmount(data.totalShares);
      this.fullLiquidationIndex = toNumber(data.fullLiquidationIndex);
    }
    this.nextLiquidationTrigger = toNumber(data.nextLiquidationTrigger);
    this.stateSource = "__typename" in data ? "indexed" : "live";
  }

  static fromLensData(
    market: Market,
    data: CollateralContractDataStructOutput
  ): MarketCollateralV1 {
    const collateralAsset = Token.fromTokenMetadata(
      market.chainId,
      data.collateralAsset,
      market.provider
    );
    const underlyingAsset = Token.fromTokenMetadata(
      market.chainId,
      data.underlyingAsset,
      market.provider
    );
    return new MarketCollateralV1({
      provider: market.provider,
      address: data.collateralContract,
      availableCollateral: collateralAsset.getAmount(data.availableCollateral),
      totalShares: toRawAmount(data.totalShares),
      underlyingAsset,
      collateralAsset,
      fullLiquidationIndex: toNumber(data.fullLiquidationIndex),
      liquidationCooldown: toNumber(data.liquidationCooldown),
      maxRepaymentBips: toNumber(data.maxRepaymentBips),
      nextLiquidationTrigger: toNumber(data.nextLiquidationTrigger),
      market
    });
  }

  static create(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    market: Market,
    collateralAsset: Token
  ): Promise<TransactionHash> {
    assert(isEthersSigner(provider), "Signer is required to create collateral");
    return submitPreparedTransaction(
      provider,
      MarketCollateralV1.populateCreate(chainId, provider, market, collateralAsset)
    );
  }

  static populateCreate(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    market: Market,
    collateralAsset: Token
  ): PartialTransaction {
    const collateralFactory = getCollateralFactoryContract(chainId, provider);
    return prepareTransaction({
      to: collateralFactory.address,
      abi: wildcatCollateralFactoryAbi,
      functionName: "deployCollateralContract",
      args: [market.address, collateralAsset.address]
    });
  }
}

export async function getCollateralContractsForMarketFromSubgraph(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: Market
): Promise<MarketCollateralV1[]> {
  const {
    data: { market: marketData }
  } = await subgraphClient.query<
    SubgraphGetCollateralContractsByMarketQuery,
    SubgraphGetCollateralContractsByMarketQueryVariables
  >({
    query: GetCollateralContractsByMarketDocument,
    variables: {
      market: market.address.toLowerCase()
    }
  });

  assert(marketData !== undefined && marketData !== null, `Market not found ${market}`);

  return marketData.collateralContracts.map((collateral) =>
    MarketCollateralV1.fromSubgraphData(chainId, provider, market, collateral)
  );
}

export async function getCollateralContractsForMarketFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: Market
): Promise<MarketCollateralV1[]> {
  const lens = getCollateralLensContract(chainId, provider);
  const lensData = await lens["getCollateralContractsForMarket(address)"](market.address);
  return lensData.map((data) => MarketCollateralV1.fromLensData(market, data));
}

export const getIndexedCollateralContractsForMarket = getCollateralContractsForMarketFromSubgraph;

export const getLiveCollateralContractsForMarket = getCollateralContractsForMarketFromLens;
