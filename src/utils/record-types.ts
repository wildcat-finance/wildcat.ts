import { BigNumber } from "ethers";
import { Token, TokenAmount } from "../token";
import {
  Exact,
  SubgraphAnnualInterestBipsUpdatedDataFragment,
  SubgraphBorrowDataFragment,
  SubgraphDelinquencyStatusChangedDataFragment,
  SubgraphDepositDataFragment,
  SubgraphFeesCollectedDataFragment,
  SubgraphMarketClosedDataFragment,
  SubgraphMaxTotalSupplyUpdatedDataFragment,
  SubgraphRepaymentDataFragment,
  SubgraphWithdrawalBatchPaymentPropertiesFragment,
  SubgraphWithdrawalExecutionPropertiesFragment,
  SubgraphWithdrawalRequestPropertiesFragment
} from "../gql/graphql";
import { WithdrawalBatch } from "../withdrawal-batch";
import { LenderWithdrawalStatus } from "../withdrawal-status";

/* -------------------------------------------------------------------------- */
/*                           Withdrawal Record Types                          */
/* -------------------------------------------------------------------------- */

export type WithdrawalRecordKind = WithdrawalRecord["__typename"];

export class WithdrawalRequestRecord {
  public readonly __typename = "WithdrawalRequest";
  constructor(
    public id: string,
    public eventIndex: number,
    public requestIndex: number,
    public scaledAmount: BigNumber,
    public normalizedAmount: TokenAmount,
    public blockNumber: number,
    public blockTimestamp: number,
    public transactionHash: string,
    public address: string
  ) {}

  /**
   * Calculate the normalized amount owed for this request.
   * Note: Given a `WithdrawalBatch`, will return the amount owed by the borrower for
   * this request without taking into account the amount the lender has already withdrawn.
   * Given a `LenderWithdrawalStatus`, will return the amount owed to the lender after
   * subtracting the amount the lender has already withdrawn.
   */
  getNormalizedAmountOwed(data: WithdrawalBatch | LenderWithdrawalStatus): TokenAmount {
    return data.normalizedAmountOwed.mulDiv(
      this.scaledAmount,
      data instanceof WithdrawalBatch ? data.scaledTotalAmount : data.scaledAmount
    );
  }

  getNormalizedAmountPaid(batch: WithdrawalBatch): TokenAmount {
    return batch.normalizedAmountPaid.mulDiv(this.scaledAmount, batch.scaledTotalAmount);
  }

  getNormalizedTotalAmount(batch: WithdrawalBatch): TokenAmount {
    return batch.normalizedTotalAmount.mulDiv(this.scaledAmount, batch.scaledTotalAmount);
  }

  static fromSubgraphWithdrawalRequest(
    batch: WithdrawalBatch,
    data: SubgraphWithdrawalRequestPropertiesFragment
  ): WithdrawalRequestRecord {
    return new WithdrawalRequestRecord(
      data.id,
      data.eventIndex,
      data.requestIndex,
      BigNumber.from(data.scaledAmount),
      batch.market.underlyingToken.getAmount(data.normalizedAmount),
      data.blockNumber,
      data.blockTimestamp,
      data.transactionHash,
      data.account.address
    );
  }
}

export type WithdrawalPaymentRecord = Exact<
  {
    normalizedAmountPaid: TokenAmount;
  } & Omit<SubgraphWithdrawalBatchPaymentPropertiesFragment, "normalizedAmountPaid">
>;

export type WithdrawalExecutionRecord = Exact<
  {
    normalizedAmount: TokenAmount;
  } & Omit<SubgraphWithdrawalExecutionPropertiesFragment, "normalizedAmount">
>;

export type WithdrawalDataFragment =
  | SubgraphWithdrawalRequestPropertiesFragment
  | SubgraphWithdrawalBatchPaymentPropertiesFragment
  | SubgraphWithdrawalExecutionPropertiesFragment;

export type WithdrawalRecord =
  | WithdrawalRequestRecord
  | WithdrawalPaymentRecord
  | WithdrawalExecutionRecord;

export type WithdrawalRecordParserMap = {
  [K in WithdrawalRecordKind]: (
    batch: WithdrawalBatch,
    log: WithdrawalDataFragmentByType<K>
  ) => WithdrawalRecordByType<K>;
};

export type WithdrawalDataFragmentByType<K extends WithdrawalRecordKind> =
  WithdrawalDataFragment extends infer C ? (C extends { __typename: K } ? C : never) : never;

export type WithdrawalRecordByType<K extends WithdrawalRecordKind> =
  WithdrawalRecord extends infer C ? (C extends { __typename: K } ? C : never) : never;

/* -------------------------------------------------------------------------- */
/*                         Indexed Market Record Types                        */
/* -------------------------------------------------------------------------- */

export type MarketRecordKind = MarketRecord["__typename"];

export type MaxTotalSupplyUpdatedRecord = Exact<
  Omit<SubgraphMaxTotalSupplyUpdatedDataFragment, "oldMaxTotalSupply" | "newMaxTotalSupply"> & {
    oldMaxTotalSupply: TokenAmount;
    newMaxTotalSupply: TokenAmount;
  }
>;

export type AnnualInterestBipsUpdatedRecord = SubgraphAnnualInterestBipsUpdatedDataFragment;

export type DelinquencyStatusChangedRecord = Omit<
  SubgraphDelinquencyStatusChangedDataFragment,
  "liquidityCoverageRequired" | "totalAssets"
> & {
  liquidityCoverageRequired: TokenAmount;
  totalAssets: TokenAmount;
};

export type MarketClosedRecord = SubgraphMarketClosedDataFragment;

export type DepositRecord = Exact<
  {
    amount: TokenAmount;
    address: string;
  } & Omit<SubgraphDepositDataFragment, "assetAmount" | "account">
>;

export type RepaymentRecord = Exact<
  {
    amount: TokenAmount;
  } & Omit<SubgraphRepaymentDataFragment, "assetAmount">
>;

export type BorrowRecord = Exact<
  {
    amount: TokenAmount;
  } & Omit<SubgraphBorrowDataFragment, "assetAmount">
>;

export type FeeCollectionRecord = Exact<
  {
    amount: TokenAmount;
  } & Omit<SubgraphFeesCollectedDataFragment, "feesCollected">
>;

export type WithdrawalRequestPartialRecord = Exact<
  Omit<
    SubgraphWithdrawalRequestPropertiesFragment,
    "scaledAmount" | "normalizedAmount" | "account"
  > & {
    scaledAmount: BigNumber;
    normalizedAmount: TokenAmount;
    address: string;
  }
>;

export type MarketRecord =
  | AnnualInterestBipsUpdatedRecord
  | BorrowRecord
  | DelinquencyStatusChangedRecord
  | DepositRecord
  | FeeCollectionRecord
  | MarketClosedRecord
  | MaxTotalSupplyUpdatedRecord
  | RepaymentRecord
  | WithdrawalRequestPartialRecord;

export type MarketDataFragment =
  | SubgraphAnnualInterestBipsUpdatedDataFragment
  | SubgraphBorrowDataFragment
  | SubgraphDelinquencyStatusChangedDataFragment
  | SubgraphDepositDataFragment
  | SubgraphFeesCollectedDataFragment
  | SubgraphMarketClosedDataFragment
  | SubgraphMaxTotalSupplyUpdatedDataFragment
  | SubgraphRepaymentDataFragment
  | SubgraphWithdrawalRequestPropertiesFragment;

export type MarketRecordByType<K extends MarketRecordKind> = MarketRecord extends infer C
  ? C extends { __typename: K }
    ? C
    : never
  : never;

export type MarketDataFragmentByType<K extends MarketRecordKind> =
  MarketDataFragment extends infer C ? (C extends { __typename: K } ? C : never) : never;

export type MarketRecordParserMap = {
  [K in MarketRecordKind]: (
    token: Token,
    log: MarketDataFragmentByType<K>
  ) => MarketRecordByType<K>;
};
