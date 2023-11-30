import {
  ControllerDataStructOutput,
  WildcatMarketController,
  WildcatMarketController__factory
} from "./typechain";
import {
  SupportedChainId,
  getControllerFactoryContract,
  getLensContract,
  getMockArchControllerOwnerContract
} from "./constants";
import { ContractWrapper, SignerOrProvider } from "./types";
import { Market } from "./market";
import { ContractReceipt, ContractTransaction } from "ethers";
import { Token, TokenAmount } from "./token";
import {
  FeeConfiguration,
  MarketParameterConstraints,
  assert,
  parseFeeConfiguration,
  parseMarketParameterConstraints
} from "./utils";
import { MarketDeployedEvent } from "./typechain/WildcatMarketController";

export class MarketController extends ContractWrapper<WildcatMarketController> {
  readonly contractFactory = WildcatMarketController__factory;

  public authorizedLenders: string[] = [];

  constructor(
    public chainId: SupportedChainId,
    public address: string,
    public borrower: string,
    public controllerFactory: string,
    public isRegisteredBorrower: boolean,
    public isDeployed: boolean,
    public fees: FeeConfiguration,
    public constraints: MarketParameterConstraints,
    public markets: Market[],
    provider: SignerOrProvider,
    public borrowerOriginationFeeBalance?: TokenAmount,
    public borrowerOriginationFeeApproval?: TokenAmount
  ) {
    super(provider);
  }

  get hasOriginationFees(): boolean {
    return this.fees.originationFeeAmount !== undefined;
  }

  async update(): Promise<void> {
    const [lenders, data] = await Promise.all([
      this.contract["getAuthorizedLenders()"](),
      getLensContract(this.chainId, this.provider).getControllerDataForBorrower(this.address)
    ]);
    this.authorizedLenders = lenders;
    this.updateWith(data);
  }

  updateWith(data: ControllerDataStructOutput): void {
    this.fees = parseFeeConfiguration(this.provider, data.fees);
    this.constraints = parseMarketParameterConstraints(data.constraints);
    this.borrowerOriginationFeeBalance = this.fees.originationFeeToken?.getAmount(
      data.borrowerOriginationFeeBalance
    );
    this.borrowerOriginationFeeApproval = this.fees.originationFeeToken?.getAmount(
      data.borrowerOriginationFeeApproval
    );
    for (const market of data.markets) {
      const existing = this.markets.find((x) => x.address === market.marketToken.token);
      if (existing) {
        existing.updateWith(market);
      } else {
        this.markets.push(Market.fromMarketData(this.chainId, market, this.provider));
      }
    }
    this.isRegisteredBorrower = data.isRegisteredBorrower;
    this.isDeployed = data.hasDeployedController;
  }

  async authorizeLenders(lenders: string[]): Promise<ContractTransaction> {
    return this.contract.authorizeLenders(lenders);
  }

  async authorizeLendersAndUpdateMarkets(
    lenders: string[],
    markets: string[] = this.markets.map((m) => m.address)
  ): Promise<ContractTransaction> {
    return this.contract.authorizeLendersAndUpdateMarkets(lenders, markets);
  }

  async deauthorizeLenders(lenders: string[]): Promise<ContractTransaction> {
    return this.contract.deauthorizeLenders(lenders);
  }

  async deauthorizeLendersAndUpdateMarkets(
    lenders: string[],
    markets: string[] = this.markets.map((m) => m.address)
  ): Promise<ContractTransaction> {
    return this.contract.deauthorizeLendersAndUpdateMarkets(lenders, markets);
  }

  async registerBorrower(): Promise<ContractTransaction> {
    assert(!this.isRegisteredBorrower, "Borrower is already registered");

    const archControllerOwner = await getMockArchControllerOwnerContract(this.chainId, this.signer);
    return archControllerOwner.registerBorrower(this.address);
  }

  async deployController(): Promise<ContractTransaction> {
    assert(!this.isDeployed, "Controller is already deployed");

    const controllerFactory = await getControllerFactoryContract(this.chainId, this.signer);
    assert(controllerFactory.address === this.controllerFactory, "Controller factory mismatch");
    return controllerFactory.deployController();
  }

  /**
   * @return array of parameters with out of bounds values
   */
  checkParameters(params: MarketParameters): string[] {
    const badParams: string[] = [];
    for (const [value, min, max] of constraintKeys) {
      if (params[value] > this.constraints[max] || params[value] < this.constraints[min]) {
        badParams.push(value);
      }
    }
    return badParams;
  }

  getExistingMarketForParameters(params: MarketParameters): Market | undefined {
    const getPrefix = (marketString: string, underlyingString: string) =>
      marketString.replace(underlyingString, "");
    return this.markets.find(
      (m) =>
        m.underlyingToken.address === params.asset.address &&
        params.namePrefix == getPrefix(m.name, m.underlyingToken.name) &&
        params.symbolPrefix == getPrefix(m.symbol, m.underlyingToken.symbol)
    );
  }

  async deployMarket(params: MarketParameters): Promise<Market> {
    if (this.checkParameters(params).length) {
      throw Error("Invalid parameters: " + this.checkParameters(params).join(", "));
    }
    let receipt: ContractReceipt;

    if (!this.isDeployed) {
      const factory = await getControllerFactoryContract(this.chainId, this.signer);
      assert(this.isRegisteredBorrower, "Borrower is not registered");
      receipt = await factory
        .deployControllerAndMarket(
          params.namePrefix,
          params.symbolPrefix,
          params.asset.address,
          params.maxTotalSupply.raw,
          params.annualInterestBips,
          params.delinquencyFeeBips,
          params.withdrawalBatchDuration,
          params.reserveRatioBips,
          params.delinquencyGracePeriod
        )
        .then((r) => r.wait());
    } else {
      receipt = await this.contract
        .deployMarket(
          params.asset.address,
          params.namePrefix,
          params.symbolPrefix,
          params.maxTotalSupply.raw,
          params.annualInterestBips,
          params.delinquencyFeeBips,
          params.withdrawalBatchDuration,
          params.reserveRatioBips,
          params.delinquencyGracePeriod
        )
        .then((r) => r.wait());
    }

    const marketDeployedTopic = this.contract.interface.getEventTopic("MarketDeployed");
    const log = receipt.logs.find((l) => l.topics[0] === marketDeployedTopic)!;
    const event: MarketDeployedEvent["args"] = this.contract.interface.decodeEventLog(
      "MarketDeployed",
      log.data,
      log.topics
    ) as any;
    const market = await Market.getMarket(this.chainId, event.market, this.provider);
    this.markets.push(market);
    this.isDeployed = true;
    this.isRegisteredBorrower = true;
    return market;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Class Builder                               */
  /* -------------------------------------------------------------------------- */

  static fromControllerData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: ControllerDataStructOutput
  ): MarketController {
    const fees = parseFeeConfiguration(provider, data.fees);
    const constraints = parseMarketParameterConstraints(data.constraints);
    const borrowerOriginationFeeBalance = fees.originationFeeToken?.getAmount(
      data.borrowerOriginationFeeBalance
    );
    const borrowerOriginationFeeApproval = fees.originationFeeToken?.getAmount(
      data.borrowerOriginationFeeApproval
    );
    const markets = data.markets.map((x) => Market.fromMarketData(chainId, x, provider));
    return new MarketController(
      chainId,
      data.controller,
      data.borrower,
      data.controllerFactory,
      data.isRegisteredBorrower,
      data.hasDeployedController,
      fees,
      constraints,
      markets,
      provider,
      borrowerOriginationFeeBalance,
      borrowerOriginationFeeApproval
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                               Static Queries                               */
  /* -------------------------------------------------------------------------- */

  static async getController(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    borrower: string
  ): Promise<MarketController> {
    const lens = getLensContract(chainId, provider);
    const data = await lens.getControllerDataForBorrower(borrower);

    return MarketController.fromControllerData(chainId, provider, data);
  }
}

const constraintKeys = [
  ["annualInterestBips", "minimumAnnualInterestBips", "maximumAnnualInterestBips"],
  ["delinquencyFeeBips", "minimumDelinquencyFeeBips", "maximumDelinquencyFeeBips"],
  ["delinquencyGracePeriod", "minimumDelinquencyGracePeriod", "maximumDelinquencyGracePeriod"],
  ["reserveRatioBips", "minimumReserveRatioBips", "maximumReserveRatioBips"],
  ["withdrawalBatchDuration", "minimumWithdrawalBatchDuration", "maximumWithdrawalBatchDuration"]
] as const;

export type MarketParameters = {
  asset: Token;
  namePrefix: string;
  symbolPrefix: string;
  maxTotalSupply: TokenAmount;
  annualInterestBips: number;
  delinquencyFeeBips: number;
  delinquencyGracePeriod: number;
  withdrawalBatchDuration: number;
  reserveRatioBips: number;
};
