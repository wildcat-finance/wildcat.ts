import { BigNumber, ContractTransaction } from "ethers";
import { Market } from "./market";
import { TokenAmount } from "./token";
import {
  WithdrawalBatchLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput
} from "./typechain";
import { SupportedChainId, getLensContract } from "./constants";
import {
  WithdrawalExecutionRecord,
  WithdrawalRequestRecord,
  assert,
  mulDiv,
  parseWithdrawalRecord
} from "./utils";
import { WithdrawalBatch, BatchStatus } from "./withdrawal-batch";
import {
  SubgraphLenderWithdrawalPropertiesFragment,
  SubgraphWithdrawalExecution,
  SubgraphWithdrawalExecutionPropertiesFragment,
  SubgraphWithdrawalRequest,
  SubgraphWithdrawalRequestPropertiesFragment
} from "./gql/graphql";

export class LenderWithdrawalStatus {
  public executions: WithdrawalExecutionRecord[] = [];
  public requests: WithdrawalRequestRecord[] = [];
  constructor(
    public batch: WithdrawalBatch,
    public lender: string,
    public scaledAmount: BigNumber,
    public normalizedAmountWithdrawn: TokenAmount,
    public normalizedAmountOwed: TokenAmount,
    public availableWithdrawalAmount: TokenAmount,
    public isCompleted: boolean,
    requests: SubgraphWithdrawalRequestPropertiesFragment[] = [],
    executions: SubgraphWithdrawalExecutionPropertiesFragment[] = []
  ) {
    this.executions = executions.map((w) => parseWithdrawalRecord(this.batch, w));
    this.requests = requests.map((w) => parseWithdrawalRecord(this.batch, w));
  }

  get chainId(): SupportedChainId {
    return this.market.chainId;
  }

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

  get normalizedTotalAmount(): TokenAmount {
    return this.normalizedAmountOwed.add(this.normalizedAmountWithdrawn);
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

  get normalizedUnpaidAmount(): TokenAmount {
    return this.batch.normalizedAmountOwed.mulDiv(this.scaledAmount, this.batch.scaledTotalAmount);
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
      status.isCompleted,
      status.requests || undefined,
      status.executions || undefined
    );
  }

  static async getWithdrawalForLender(
    market: Market,
    expiry: number,
    lender: string
  ): Promise<LenderWithdrawalStatus> {
    const lens = getLensContract(market.chainId, market.provider);
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
    const isCompleted =
      batch.status === BatchStatus.Complete &&
      batch.expiry < Math.floor(Date.now() / 1000) &&
      batch.normalizedAmountPaid
        .mulDiv(data.scaledAmount, batch.scaledTotalAmount)
        .eq(data.normalizedAmountWithdrawn);
    return new LenderWithdrawalStatus(
      batch,
      data.lender,
      data.scaledAmount,
      market.underlyingToken.getAmount(data.normalizedAmountWithdrawn),
      market.underlyingToken.getAmount(data.normalizedAmountOwed),
      market.underlyingToken.getAmount(data.availableWithdrawalAmount),
      isCompleted
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
