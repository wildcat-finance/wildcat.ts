import { BigNumber, ContractTransaction } from "ethers";
import { Market } from "./market";
import { Token, TokenAmount } from "./token";
import {
  WithdrawalBatchLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput
} from "./typechain";
import { getLensContract } from "./constants";
import { assert, mulDiv } from "./utils";
import { WithdrawalBatch, BatchStatus } from "./withdrawal-batch";
import {
  MakeOptional,
  SubgraphLenderWithdrawalPropertiesFragment,
  SubgraphLenderWithdrawalStatus,
  SubgraphWithdrawalExecution,
  SubgraphWithdrawalRequest
} from "./gql/graphql";

export class LenderWithdrawalStatus {
  constructor(
    public batch: WithdrawalBatch,
    public lender: string,
    public scaledAmount: BigNumber,
    public normalizedAmountWithdrawn: TokenAmount,
    public normalizedAmountOwed: TokenAmount,
    public availableWithdrawalAmount: TokenAmount,
    public requests: SubgraphWithdrawalRequest[] = [],
    public executions: SubgraphWithdrawalExecution[] = []
  ) {}

  async execute(): Promise<ContractTransaction> {
    assert(this.availableWithdrawalAmount.gt(0), "No funds available to withdraw");
    return this.market.contract.executeWithdrawal(this.lender, this.expiry);
  }

  get expiry(): number {
    return this.batch.expiry;
  }

  get market(): Market {
    return this.batch.market;
  }

  get status(): BatchStatus {
    return this.batch.status;
  }

  updateWith(data: WithdrawalBatchLenderStatusStructOutput): void {
    this.scaledAmount = data.scaledAmount;
    this.normalizedAmountWithdrawn = this.market.underlyingToken.getAmount(
      data.normalizedAmountWithdrawn
    );
    this.normalizedAmountOwed = this.market.underlyingToken.getAmount(data.normalizedAmountOwed);
    this.availableWithdrawalAmount = this.market.underlyingToken.getAmount(
      data.availableWithdrawalAmount
    );
  }

  static fromSubgraphLenderWithdrawalStatus(
    market: Market,
    batch: WithdrawalBatch,
    status: SubgraphLenderWithdrawalPropertiesFragment & {
      requests?: SubgraphWithdrawalRequest[];
      executions?: SubgraphWithdrawalExecution[];
    },
    address?: string
  ): LenderWithdrawalStatus {
    const scaledAmount = BigNumber.from(status.scaledAmount);
    const normalizedAmountWithdrawn = market.underlyingToken.getAmount(
      status.normalizedAmountWithdrawn
    );
    const normalizedAmountOwed = market.underlyingToken.getAmount(
      mulDiv(batch.normalizedTotalAmount.raw, scaledAmount, batch.scaledTotalAmount).sub(
        normalizedAmountWithdrawn.raw
      )
    );
    const availableWithdrawalAmount = market.underlyingToken.getAmount(
      mulDiv(batch.normalizedAmountPaid.raw, scaledAmount, batch.scaledTotalAmount).sub(
        normalizedAmountWithdrawn.raw
      )
    );

    return new LenderWithdrawalStatus(
      batch,
      address ?? status.account!.address,
      scaledAmount,
      normalizedAmountWithdrawn,
      normalizedAmountOwed,
      availableWithdrawalAmount,
      status.requests || undefined,
      status.executions || undefined
    );
  }

  static async getWithdrawalForLender(
    market: Market,
    expiry: number,
    lender: string
  ): Promise<LenderWithdrawalStatus> {
    const lens = getLensContract(market.provider);
    const batchData = await lens.getWithdrawalBatchDataWithLenderStatus(
      market.address,
      expiry,
      lender
    );
    const batch = WithdrawalBatch.fromWithdrawalBatchData(market, batchData.batch);
    return LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      batch,
      batchData.lenderStatus
    );
  }

  static fromWithdrawalBatchLenderStatus(
    market: Market,
    batch: WithdrawalBatch,
    data: WithdrawalBatchLenderStatusStructOutput
  ): LenderWithdrawalStatus {
    return new LenderWithdrawalStatus(
      batch,
      data.lender,
      data.scaledAmount,
      market.underlyingToken.getAmount(data.normalizedAmountWithdrawn),
      market.underlyingToken.getAmount(data.normalizedAmountOwed),
      market.underlyingToken.getAmount(data.availableWithdrawalAmount)
    );
  }

  static fromWithdrawalBatchDataWithLenderStatus(
    market: Market,
    data: WithdrawalBatchDataWithLenderStatusStructOutput
  ): LenderWithdrawalStatus {
    return LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      WithdrawalBatch.fromWithdrawalBatchData(market, data.batch),
      data.lenderStatus
    );
  }
}
