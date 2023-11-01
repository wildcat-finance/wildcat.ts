import { BigNumber } from "ethers";
import { Market } from "./market";
import { TokenAmount } from "./token";
import { WithdrawalBatchDataStructOutput } from "./typechain";
import { getLensContract } from "./constants";
import { LenderWithdrawalStatus } from "./withdrawal-status";

export enum BatchStatus {
  Pending = 0,
  Expired = 1,
  Unpaid = 2,
  Complete = 3
}

export class WithdrawalBatch {
  constructor(
    public market: Market,
    public expiry: number,
    public status: BatchStatus,
    public scaledTotalAmount: BigNumber,
    public scaledAmountBurned: BigNumber,
    public normalizedAmountPaid: TokenAmount,
    public normalizedTotalAmount: TokenAmount
  ) {}

  get isClosed(): boolean {
    return this.scaledAmountBurned.eq(this.scaledTotalAmount);
  }

  get isExpired(): boolean {
    return this.status === BatchStatus.Pending && this.expiry < Math.floor(Date.now() / 1000);
  }

  get normalizedAmountOwed(): TokenAmount {
    return this.normalizedTotalAmount.sub(this.normalizedAmountPaid);
  }

  static fromWithdrawalBatchData(
    market: Market,
    data: WithdrawalBatchDataStructOutput
  ): WithdrawalBatch {
    return new WithdrawalBatch(
      market,
      data.expiry,
      data.status,
      data.scaledTotalAmount,
      data.scaledAmountBurned,
      market.underlyingToken.getAmount(data.normalizedAmountPaid),
      market.underlyingToken.getAmount(data.normalizedTotalAmount)
    );
  }

  async getAllLenderWithdrawalStatuses(): Promise<LenderWithdrawalStatus[]> {
    return LenderWithdrawalStatus.getAllWithdrawalsInBatch(this.market, this.expiry);
  }

  static async getWithdrawalBatch(market: Market, expiry: number): Promise<WithdrawalBatch> {
    const lens = getLensContract(market.provider);
    const data = await lens.getWithdrawalBatchData(market.address, expiry);
    return WithdrawalBatch.fromWithdrawalBatchData(market, data);
  }
}
