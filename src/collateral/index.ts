import { BigNumber, ContractTransaction, Overrides } from "ethers";
import { maxTokenAmount, TokenAmount } from "../token";
import {
  CollateralContractDataStructOutput,
  SimpleMarketCollateral,
  SimpleMarketCollateral__factory
} from "../typechain";
import { ContractWrapper, PartialTransaction, SignerOrProvider } from "../types";
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
import { assert } from "../utils";

export * from "./collateral-events";

export interface CollateralV1Args {
  provider: SignerOrProvider;
  address: string;
  underlyingAsset: Token;
  collateralAsset: Token;
  liquidationCooldown: number;
  maxRepaymentBips: number;
  fullLiquidationIndex: number;
  totalShares: BigNumber;
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
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MarketCollateralV1 extends CollateralV1Args {}

export class MarketCollateralV1 extends ContractWrapper<SimpleMarketCollateral> {
  readonly contractFactory = SimpleMarketCollateral__factory;
  protected readonly _contractAddress: string;
  public address: string;

  constructor({ provider, address, ...args }: CollateralV1Args) {
    super(provider);
    this._contractAddress = address;
    this.address = address;
    Object.assign(this, args);
  }

  get maxRepayment(): TokenAmount {
    const maxRepay = this.market.delinquentDebt.bipMul(this.maxRepaymentBips);
    return maxTokenAmount(this.availableCollateral, maxRepay);
  }

  async deposit(amount: TokenAmount): Promise<ContractTransaction> {
    return this.contract.deposit(amount.raw);
  }

  populateDeposit(amount: TokenAmount): PartialTransaction {
    const data = this.contract.interface.encodeFunctionData("deposit", [amount.raw]);
    return {
      to: this.contract.address,
      data,
      value: "0"
    };
  }

  async reclaimCollateral(): Promise<ContractTransaction> {
    return this.contract.reclaimCollateral();
  }

  populateReclaimCollateral(): PartialTransaction {
    const data = this.contract.interface.encodeFunctionData("reclaimCollateral");
    return {
      to: this.contract.address,
      data,
      value: "0"
    };
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    market: Market,
    data: SubgraphSimpleCollateralContractDataFragment
  ): MarketCollateralV1 {
    const collateralAsset = Token.fromSubgraphToken(chainId, data.collateralAsset!, provider);
    const underlyingAsset = Token.fromSubgraphToken(
      chainId,
      data.market.underlyingAsset!,
      provider
    );

    return new MarketCollateralV1({
      provider,
      address: data.id,
      availableCollateral: collateralAsset.getAmount(data.availableCollateral),
      totalShares: BigNumber.from(data.totalShares),

      totalDeposited: collateralAsset.getAmount(data.totalDeposited),
      totalReclaimed: collateralAsset.getAmount(data.totalReclaimed),
      totalLiquidated: collateralAsset.getAmount(data.totalLiquidated),
      underlyingAsset,
      collateralAsset,
      liquidationCooldown: data.liquidationCooldown,
      maxRepaymentBips: 10000,
      fullLiquidationIndex: data.lastFullLiquidationIndex,
      nextLiquidationTrigger: data.nextLiquidationTrigger,
      market,
      eventIndex: data.eventIndex
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
      this.totalShares = BigNumber.from(data.totalShares);
      this.fullLiquidationIndex = data.lastFullLiquidationIndex;
    } else {
      this.totalShares = data.totalShares;
      this.fullLiquidationIndex = data.fullLiquidationIndex;
    }
    this.nextLiquidationTrigger = data.nextLiquidationTrigger;
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
      availableCollateral: new TokenAmount(
        BigNumber.from(data.availableCollateral),
        collateralAsset
      ),
      totalShares: BigNumber.from(data.totalShares),
      underlyingAsset,
      collateralAsset,
      fullLiquidationIndex: data.fullLiquidationIndex,
      liquidationCooldown: data.liquidationCooldown,
      maxRepaymentBips: data.maxRepaymentBips,
      nextLiquidationTrigger: data.nextLiquidationTrigger,
      market
    });
  }

  static create(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    market: Market,
    collateralAsset: Token
  ): Promise<ContractTransaction> {
    const collateralFactory = getCollateralFactoryContract(chainId, provider);
    return collateralFactory.deployCollateralContract(market.address, collateralAsset.address);
  }

  static populateCreate(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    market: Market,
    collateralAsset: Token
  ): PartialTransaction {
    const collateralFactory = getCollateralFactoryContract(chainId, provider);
    const data = collateralFactory.interface.encodeFunctionData("deployCollateralContract", [
      market.address,
      collateralAsset.address
    ]);
    return { to: collateralFactory.address, data, value: "0" };
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
