import { ContractTransaction } from "ethers";
import { Market } from "./market";
import { TokenAmount, toRawAmount } from "./token";
import {
  WithdrawalBatchLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput,
  WithdrawalBatchLenderStatusV2_5StructOutput,
  WithdrawalBatchDataWithLenderStatusV2_5StructOutput
} from "./typechain";
import { SupportedChainId, hasDeploymentAddress } from "./constants";
import {
  getLatestWithdrawalBatchDataWithLenderStatus,
  getLegacyWithdrawalBatchDataWithLenderStatus
} from "./internal/market-lens";
import {
  WithdrawalExecutionRecord,
  WithdrawalRequestRecord,
  assert,
  parseWithdrawalRecord
} from "./utils";
import { WithdrawalBatch, BatchStatus } from "./withdrawal-batch";
import { MarketVersion } from "./types";
import {
  SubgraphLenderWithdrawalPropertiesFragment,
  SubgraphWithdrawalExecution,
  SubgraphWithdrawalExecutionPropertiesFragment,
  SubgraphWithdrawalRequest,
  SubgraphWithdrawalRequestPropertiesFragment
} from "./gql/graphql";

type WithdrawalBatchLenderStatusOutput =
  | WithdrawalBatchLenderStatusStructOutput
  | WithdrawalBatchLenderStatusV2_5StructOutput;

type WithdrawalBatchDataWithLenderStatusOutput =
  | WithdrawalBatchDataWithLenderStatusStructOutput
  | WithdrawalBatchDataWithLenderStatusV2_5StructOutput;

export class LenderWithdrawalStatus {
  public executions: WithdrawalExecutionRecord[] = [];
  public requests: WithdrawalRequestRecord[] = [];
  constructor(
    public batch: WithdrawalBatch,
    public lender: string,
    public scaledAmount: bigint,
    public normalizedAmountWithdrawn: TokenAmount,
    public normalizedAmountOwed: TokenAmount,
    public isCompleted: boolean,
    requests: SubgraphWithdrawalRequestPropertiesFragment[] = [],
    executions: SubgraphWithdrawalExecutionPropertiesFragment[] = []
  ) {
    this.executions = executions.map((w) => parseWithdrawalRecord(this.batch, w));
    this.requests = requests.map((w) => parseWithdrawalRecord(this.batch, w));
  }

  get availableWithdrawalAmount(): TokenAmount {
    return this.batch.normalizedAmountPaid
      .mulDiv(this.scaledAmount, this.batch.scaledTotalAmount)
      .sub(this.normalizedAmountWithdrawn);
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

  get isConcluded(): boolean {
    return this.batch.isConcluded;
  }

  get effectiveStatus(): BatchStatus {
    return this.batch.effectiveStatus;
  }

  get normalizedTotalAmount(): TokenAmount {
    return this.normalizedAmountOwed.add(this.normalizedAmountWithdrawn);
  }

  updateWith(data: WithdrawalBatchLenderStatusStructOutput): void {
    this.scaledAmount = toRawAmount(data.scaledAmount);
    this.normalizedAmountWithdrawn = this.market.underlyingToken.getAmount(
      data.normalizedAmountWithdrawn
    );
    this.normalizedAmountOwed = this.market.underlyingToken.getAmount(data.normalizedAmountOwed);

    // recompute isCompleted based on updated values after a wd that
    // subgraph may not have updated yet
    this.isCompleted =
      this.batch.status === BatchStatus.Complete &&
      this.batch.expiry < Math.floor(Date.now() / 1000) &&
      this.batch.normalizedAmountPaid
        .mulDiv(this.scaledAmount, this.batch.scaledTotalAmount)
        .eq(data.normalizedAmountWithdrawn);
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
    const scaledAmount = toRawAmount(status.scaledAmount);
    const normalizedAmountWithdrawn = market.underlyingToken.getAmount(
      status.normalizedAmountWithdrawn
    );
    const normalizedAmountOwed = batch.normalizedTotalAmount
      .mulDiv(scaledAmount, batch.scaledTotalAmount)
      .sub(normalizedAmountWithdrawn);

    return new LenderWithdrawalStatus(
      batch,
      address ?? status.account!.address,
      scaledAmount,
      normalizedAmountWithdrawn,
      normalizedAmountOwed,
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
    const useLatestLens =
      market.version === MarketVersion.V2 || !hasDeploymentAddress(market.chainId, "MarketLens");
    const batchData = useLatestLens
      ? await getLatestWithdrawalBatchDataWithLenderStatus(
          market.chainId,
          market.provider,
          market.address,
          expiry,
          lender
        )
      : await getLegacyWithdrawalBatchDataWithLenderStatus(
          market.chainId,
          market.provider,
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
    data: WithdrawalBatchLenderStatusOutput
  ): LenderWithdrawalStatus {
    const scaledAmount = toRawAmount(data.scaledAmount);
    const isCompleted =
      batch.status === BatchStatus.Complete &&
      batch.expiry < Math.floor(Date.now() / 1000) &&
      batch.normalizedAmountPaid
        .mulDiv(scaledAmount, batch.scaledTotalAmount)
        .eq(data.normalizedAmountWithdrawn);
    return new LenderWithdrawalStatus(
      batch,
      data.lender,
      scaledAmount,
      market.underlyingToken.getAmount(data.normalizedAmountWithdrawn),
      market.underlyingToken.getAmount(data.normalizedAmountOwed),
      isCompleted
    );
  }

  static fromWithdrawalBatchDataWithLenderStatus(
    market: Market,
    data: WithdrawalBatchDataWithLenderStatusOutput
  ): LenderWithdrawalStatus {
    return LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
      market,
      WithdrawalBatch.fromWithdrawalBatchData(market, data.batch),
      data.lenderStatus
    );
  }
}
