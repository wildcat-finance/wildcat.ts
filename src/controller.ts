import type { ControllerDataStructOutput } from "./lens-types";
import {
  SupportedChainId,
  getControllerFactoryContract,
  getMockArchControllerOwnerContract,
  hasDeploymentAddress
} from "./constants";
import { getLegacyControllerDataForBorrower } from "./internal/market-lens";
import {
  ContractWrapper,
  PartialTransaction,
  SignerOrProvider,
  FeeConfiguration,
  MarketParameterConstraints,
  SubmittedDeployment,
  TransactionHash
} from "./types";
import { Market } from "./market";
import { Token, TokenAmount } from "./token";
import {
  assert,
  parseFeeConfiguration,
  parseMarketParameterConstraints,
  prepareTransaction
} from "./utils";
import { SubgraphMinimalControllerDataFragment } from "./gql";
import {
  mockArchControllerOwnerAbi,
  wildcatMarketControllerAbi,
  wildcatMarketControllerFactoryAbi
} from "./abi";
import { submitPreparedTransaction, submitPreparedTransactionAndWait } from "./internal/viem-write";
import { parseEventLogs } from "viem";
import { getViemPublicClientFromEthers } from "./internal/ethers-viem";
import { readViemContract } from "./internal/viem-read";

export class MarketController extends ContractWrapper {
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
    public borrowerOriginationFeeApproval?: TokenAmount,
    public numMarkets: number = 0
  ) {
    super(provider);
    this.contract = { address };
    if (markets.length > numMarkets) {
      this.numMarkets = markets.length;
    }
  }

  get hasOriginationFees(): boolean {
    return this.fees.originationFeeAmount !== undefined;
  }

  async update(): Promise<void> {
    const [lenders, data] = await Promise.all([
      readViemContract<string[]>(
        getViemPublicClientFromEthers(this.provider),
        this.address,
        wildcatMarketControllerAbi,
        "getAuthorizedLenders"
      ),
      getLegacyControllerDataForBorrower(this.chainId, this.provider, this.address)
    ]);
    this.authorizedLenders = lenders;
    this.updateWith(data);
  }

  updateWith(data: ControllerDataStructOutput): void {
    this.fees = parseFeeConfiguration(this.chainId, this.provider, data.fees);
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

  async authorizeLenders(lenders: string[]): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateAuthorizeLenders(lenders));
  }

  populateAuthorizeLenders(lenders: string[]): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcatMarketControllerAbi,
      functionName: "authorizeLenders",
      args: [lenders]
    });
  }

  async authorizeLendersAndUpdateMarkets(
    lenders: string[],
    markets: string[] = this.markets.map((m) => m.address)
  ): Promise<TransactionHash> {
    return submitPreparedTransaction(
      this.signer,
      this.populateAuthorizeLendersAndUpdateMarkets(lenders, markets)
    );
  }

  populateAuthorizeLendersAndUpdateMarkets(
    lenders: string[],
    markets: string[] = this.markets.map((m) => m.address)
  ): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcatMarketControllerAbi,
      functionName: "authorizeLendersAndUpdateMarkets",
      args: [lenders, markets]
    });
  }

  async deauthorizeLenders(lenders: string[]): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateDeauthorizeLenders(lenders));
  }

  populateDeauthorizeLenders(lenders: string[]): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcatMarketControllerAbi,
      functionName: "deauthorizeLenders",
      args: [lenders]
    });
  }

  async deauthorizeLendersAndUpdateMarkets(
    lenders: string[],
    markets: string[] = this.markets.map((m) => m.address)
  ): Promise<TransactionHash> {
    return submitPreparedTransaction(
      this.signer,
      this.populateDeauthorizeLendersAndUpdateMarkets(lenders, markets)
    );
  }

  populateDeauthorizeLendersAndUpdateMarkets(
    lenders: string[],
    markets: string[] = this.markets.map((m) => m.address)
  ): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcatMarketControllerAbi,
      functionName: "deauthorizeLendersAndUpdateMarkets",
      args: [lenders, markets]
    });
  }

  async registerBorrower(): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateRegisterBorrower());
  }

  populateRegisterBorrower(): PartialTransaction {
    assert(!this.isRegisteredBorrower, "Borrower is already registered");
    assert(
      hasDeploymentAddress(this.chainId, "MockArchControllerOwner"),
      "Can only register borrower on testnet"
    );

    const archControllerOwner = getMockArchControllerOwnerContract(this.chainId, this.signer);
    return prepareTransaction({
      to: archControllerOwner.address,
      abi: mockArchControllerOwnerAbi,
      functionName: "registerBorrower",
      args: [this.address]
    });
  }

  async deployController(): Promise<TransactionHash> {
    assert(!this.isDeployed, "Controller is already deployed");

    const controllerFactory = getControllerFactoryContract(this.chainId, this.signer);
    assert(controllerFactory.address === this.controllerFactory, "Controller factory mismatch");
    return submitPreparedTransaction(
      this.signer,
      prepareTransaction({
        to: controllerFactory.address,
        abi: wildcatMarketControllerFactoryAbi,
        functionName: "deployController"
      })
    );
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

  encodeDeployMarket(params: MarketParameters): PartialTransaction {
    if (this.checkParameters(params).length) {
      throw Error("Invalid parameters: " + this.checkParameters(params).join(", "));
    }
    if (!this.isDeployed) {
      const factory = getControllerFactoryContract(this.chainId, this.signer);
      return prepareTransaction({
        to: factory.address,
        abi: wildcatMarketControllerFactoryAbi,
        functionName: "deployControllerAndMarket",
        args: [
          params.namePrefix,
          params.symbolPrefix,
          params.asset.address,
          params.maxTotalSupply.raw,
          params.annualInterestBips,
          params.delinquencyFeeBips,
          params.withdrawalBatchDuration,
          params.reserveRatioBips,
          params.delinquencyGracePeriod
        ]
      });
    }
    return prepareTransaction({
      to: this.address,
      abi: wildcatMarketControllerAbi,
      functionName: "deployMarket",
      args: [
        params.asset.address,
        params.namePrefix,
        params.symbolPrefix,
        params.maxTotalSupply.raw,
        params.annualInterestBips,
        params.delinquencyFeeBips,
        params.withdrawalBatchDuration,
        params.reserveRatioBips,
        params.delinquencyGracePeriod
      ]
    });
  }

  async deployMarket(params: MarketParameters): Promise<SubmittedDeployment<Market>> {
    if (this.checkParameters(params).length) {
      throw Error("Invalid parameters: " + this.checkParameters(params).join(", "));
    }

    if (!this.isDeployed) {
      assert(this.isRegisteredBorrower, "Borrower is not registered");
    }
    const { hash, receipt, transaction } = await submitPreparedTransactionAndWait(
      this.provider,
      this.signer,
      this.encodeDeployMarket(params)
    );

    const event = parseEventLogs({
      abi: wildcatMarketControllerAbi,
      eventName: "MarketDeployed",
      logs: receipt.logs
    })[0];
    assert(event !== undefined, "No MarketDeployed event found");
    const market = await Market.getMarket(this.chainId, event.args.market, this.provider);
    this.markets.push(market);
    this.isDeployed = true;
    this.isRegisteredBorrower = true;
    return { hash, receipt, transaction, result: market };
  }

  /* -------------------------------------------------------------------------- */
  /*                                Class Builder                               */
  /* -------------------------------------------------------------------------- */

  static fromControllerData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: ControllerDataStructOutput
  ): MarketController {
    const fees = parseFeeConfiguration(chainId, provider, data.fees);
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
      borrowerOriginationFeeApproval,
      markets.length
    );
  }

  static fromSubgraphControllerData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    {
      id,
      numMarkets,
      borrower,
      isRegistered,
      controllerFactory: {
        id: controllerFactoryId,
        constraints,
        originationFeeAsset,
        originationFeeAmount,
        protocolFeeBips,
        feeRecipient
      }
    }: SubgraphMinimalControllerDataFragment
  ): MarketController {
    const originationFeeToken = originationFeeAsset
      ? Token.fromSubgraphToken(chainId, originationFeeAsset, provider)
      : undefined;
    return new MarketController(
      chainId,
      id,
      borrower,
      controllerFactoryId,
      isRegistered,
      true,
      {
        feeRecipient,
        protocolFeeBips,
        originationFeeToken,
        originationFeeAmount: originationFeeToken?.getAmount(originationFeeAmount)
      },
      constraints,
      [],
      provider,
      undefined,
      undefined,
      numMarkets
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
    const data = await getLegacyControllerDataForBorrower(chainId, provider, borrower);

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
