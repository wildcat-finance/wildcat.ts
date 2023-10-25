import { BigNumber, ContractTransaction } from "ethers";
import { Market } from "./market";
import { Token, TokenAmount } from "./token";
import {
  WithdrawalBatchLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput
} from "./typechain";
import { WithdrawalExecutedEvent, WithdrawalQueuedEvent } from "./typechain/WildcatMarket";
import { DeploymentBlockNumber, getLensContract } from "./constants";
import { assert, encodeAddress, encodeUint, unique } from "./utils";
import { WithdrawalBatch, BatchStatus } from "./withdrawal-batch";

export type QueueWithdrawalTransaction = {
  expiry: number;
  lender: string;
  market: string;
  scaledAmount: BigNumber;
  originalAmount: TokenAmount;
  transactionHash: string;
  blockNumber: number;
};

export type WithdrawalExecutionTransaction = {
  expiry: number;
  lender: string;
  market: string;
  transactionHash: string;
  blockNumber: number;
  normalizedAmountWithdrawn: TokenAmount;
};

export type WithdrawalTransactions = {
  queueTransactions: QueueWithdrawalTransaction[];
  executionTransactions: WithdrawalExecutionTransaction[];
};

export class LenderWithdrawalStatus {
  constructor(
    public batch: WithdrawalBatch,
    public lender: string,
    public scaledAmount: BigNumber,
    public normalizedAmountWithdrawn: TokenAmount,
    public normalizedAmountOwed: TokenAmount,
    public availableWithdrawalAmount: TokenAmount,
    public queueTransactions: QueueWithdrawalTransaction[] = [],
    public executionTransactions: WithdrawalExecutionTransaction[] = []
  ) {}

  async execute(): Promise<ContractTransaction> {
    assert(this.availableWithdrawalAmount.gt(0), "No funds available to withdraw");
    return this.market.contract.executeWithdrawal(this.lender, this.expiry);
  }

  get originalAmount(): TokenAmount {
    return this.queueTransactions.reduce(
      (prev, next) => prev.add(next.originalAmount),
      this.batch.market.underlyingToken.getAmount(0)
    );
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

  static async addTransactionsToWithdrawals(withdrawals: LenderWithdrawalStatus[]): Promise<void> {
    if (withdrawals.length === 0) return;
    const market = withdrawals[0].market;
    if (!withdrawals.every((w) => w.market.address === market.address)) {
      throw new Error("All withdrawals must be from the same market");
    }
    const { queueTransactions, executionTransactions } = await getAllWithdrawalTransactions(
      market,
      unique(withdrawals.map((w) => w.expiry)),
      unique(withdrawals.map((w) => w.lender))
    );

    for (const withdrawal of withdrawals) {
      withdrawal.queueTransactions = queueTransactions.filter(
        (l) => l.expiry == withdrawal.expiry && l.lender === withdrawal.lender
      );
      withdrawal.executionTransactions = executionTransactions.filter(
        (l) => l.expiry == withdrawal.expiry && l.lender === withdrawal.lender
      );
    }
  }

  static async getAllWithdrawalsInBatch(
    market: Market,
    expiry: number
  ): Promise<LenderWithdrawalStatus[]> {
    const { queueTransactions, executionTransactions } = await getAllWithdrawalTransactions(
      market,
      expiry,
      null
    );
    const uniqueLenderWithdrawalStatuses = {} as Record<string, WithdrawalTransactions>;
    queueTransactions.forEach((l) => {
      if (!uniqueLenderWithdrawalStatuses[l.lender]) {
        uniqueLenderWithdrawalStatuses[l.lender] = {
          queueTransactions: [],
          executionTransactions: []
        };
      }
      uniqueLenderWithdrawalStatuses[l.lender].queueTransactions.push(l);
    });
    executionTransactions.forEach((l) => {
      if (!uniqueLenderWithdrawalStatuses[l.lender]) {
        uniqueLenderWithdrawalStatuses[l.lender] = {
          queueTransactions: [],
          executionTransactions: []
        };
      }
      uniqueLenderWithdrawalStatuses[l.lender].executionTransactions.push(l);
    });

    const lenders = Object.keys(uniqueLenderWithdrawalStatuses);
    const lens = getLensContract(market.provider);
    const batchData = await lens.getWithdrawalBatchDataWithLendersStatus(
      market.address,
      expiry,
      lenders
    );
    const batch = WithdrawalBatch.fromWithdrawalBatchData(market, batchData.batch);
    return batchData.statuses.map((status) => {
      const { queueTransactions, executionTransactions } =
        uniqueLenderWithdrawalStatuses[status.lender];
      const withdrawalStatus = LenderWithdrawalStatus.fromWithdrawalBatchLenderStatus(
        market,
        batch,
        status
      );
      withdrawalStatus.queueTransactions = queueTransactions;
      withdrawalStatus.executionTransactions = executionTransactions;
      return withdrawalStatus;
    });
  }

  static async getAllWithdrawalsForLender(
    market: Market,
    lender: string
  ): Promise<LenderWithdrawalStatus[]> {
    const { queueTransactions, executionTransactions } = await getAllWithdrawalTransactions(
      market,
      null,
      lender
    );

    const logsByExpiry = {} as { [expiry: number]: WithdrawalTransactions };
    for (const log of queueTransactions) {
      if (!logsByExpiry[log.expiry]) {
        logsByExpiry[log.expiry] = {
          queueTransactions: [],
          executionTransactions: []
        };
      }
      logsByExpiry[log.expiry].queueTransactions.push(log);
    }
    for (const log of executionTransactions) {
      if (!logsByExpiry[log.expiry]) {
        logsByExpiry[log.expiry] = {
          queueTransactions: [],
          executionTransactions: []
        };
      }
      logsByExpiry[log.expiry].executionTransactions.push(log);
    }

    const expiries = unique([
      ...queueTransactions.map((l) => l.expiry),
      ...executionTransactions.map((l) => l.expiry)
    ]);

    const lens = getLensContract(market.provider);
    const batchData = await lens.getWithdrawalBatchesDataWithLenderStatus(
      market.address,
      expiries,
      lender
    );
    return batchData.map((d) => {
      const batch = LenderWithdrawalStatus.fromWithdrawalBatchDataWithLenderStatus(market, d);
      const { queueTransactions, executionTransactions } = logsByExpiry[d.batch.expiry];
      if (!queueTransactions) {
        throw new Error(`Could not find queueTransactions for batch ${batch.expiry}`);
      }
      batch.queueTransactions = queueTransactions;
      batch.executionTransactions = executionTransactions;
      return batch;
    });
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

export async function getAllWithdrawalTransactions(
  market: Market,
  _expiries: number | null | number[],
  lenders: string | null | string[]
): Promise<WithdrawalTransactions> {
  const queuedTopic = market.contract.interface.getEventTopic("WithdrawalQueued");
  const executedTopic = market.contract.interface.getEventTopic("WithdrawalExecuted");
  const topic0 = [queuedTopic, executedTopic];
  const expiries = Array.isArray(_expiries) ? _expiries.map(encodeUint) : _expiries;
  lenders = Array.isArray(lenders) ? lenders.map(encodeAddress) : lenders;
  const topics = [topic0, expiries, lenders];
  const logs = await market.contract.queryFilter<WithdrawalQueuedEvent | WithdrawalExecutedEvent>(
    {
      address: market.address,
      topics: topics as any
    },
    DeploymentBlockNumber
  );
  return logs.reduce(
    (prev, log) => {
      const tx = {
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        expiry: log.args.expiry.toNumber(),
        lender: log.args.account,
        market: log.address
      };
      if (log.topics[0] === queuedTopic) {
        prev.queueTransactions.push({
          ...tx,
          scaledAmount: (log as WithdrawalQueuedEvent).args.scaledAmount,
          originalAmount: market.underlyingToken.getAmount(log.args.normalizedAmount)
        });
      } else {
        prev.executionTransactions.push({
          ...tx,
          normalizedAmountWithdrawn: market.underlyingToken.getAmount(log.args.normalizedAmount)
        });
      }
      return prev;
    },
    {
      queueTransactions: [],
      executionTransactions: []
    } as WithdrawalTransactions
  );
}

export const toQueueWithdrawalTransaction = (
  underlyingToken: Token,
  log: WithdrawalQueuedEvent
): QueueWithdrawalTransaction => ({
  transactionHash: log.transactionHash,
  blockNumber: log.blockNumber,
  expiry: log.args.expiry.toNumber(),
  lender: log.args.account,
  market: log.address,
  scaledAmount: log.args.scaledAmount,
  originalAmount: underlyingToken.getAmount(log.args.normalizedAmount)
});
