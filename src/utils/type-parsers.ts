import { FeeConfigurationStructOutput, MarketParameterConstraintsStructOutput } from "../typechain";
import { PartialTransaction, SignerOrProvider } from "../types";
import { BigNumber, PopulatedTransaction, constants } from "ethers";
import { Token, TokenAmount } from "../token";
import {
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
import { SupportedChainId } from "../constants";
import { assert } from "./assert";

export type MarketParameterConstraints = {
  minimumDelinquencyGracePeriod: number;
  maximumDelinquencyGracePeriod: number;
  minimumReserveRatioBips: number;
  maximumReserveRatioBips: number;
  minimumDelinquencyFeeBips: number;
  maximumDelinquencyFeeBips: number;
  minimumWithdrawalBatchDuration: number;
  maximumWithdrawalBatchDuration: number;
  minimumAnnualInterestBips: number;
  maximumAnnualInterestBips: number;
};
export const parseMarketParameterConstraints = (
  constraints: MarketParameterConstraintsStructOutput
): MarketParameterConstraints =>
  Object.fromEntries(
    Object.entries(constraints).map(([k, v]) => [k, BigNumber.from(v).toNumber()])
  ) as MarketParameterConstraints;

export type FeeConfiguration = {
  feeRecipient: string;
  protocolFeeBips: number;
  originationFeeToken: Token | undefined;
  originationFeeAmount: TokenAmount | undefined;
};
export const parseFeeConfiguration = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  feeConfiguration: FeeConfigurationStructOutput
): FeeConfiguration => {
  const originationFeeToken =
    feeConfiguration.originationFeeToken.token === constants.AddressZero
      ? undefined
      : Token.fromTokenMetadata(chainId, feeConfiguration.originationFeeToken, provider);
  const originationFeeAmount =
    originationFeeToken && originationFeeToken.getAmount(feeConfiguration.originationFeeAmount);
  return {
    feeRecipient: feeConfiguration.feeRecipient,
    protocolFeeBips: feeConfiguration.protocolFeeBips,
    originationFeeToken,
    originationFeeAmount
  };
};

export class WithdrawalRequestRecord {
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

export type WithdrawalPaymentRecord = {
  normalizedAmountPaid: TokenAmount;
} & Omit<SubgraphWithdrawalBatchPaymentPropertiesFragment, "normalizedAmountPaid">;

export type WithdrawalExecutionRecord = {
  normalizedAmount: TokenAmount;
} & Omit<SubgraphWithdrawalExecutionPropertiesFragment, "normalizedAmount">;

export function parseWithdrawalRecord(
  batch: WithdrawalBatch,
  log: SubgraphWithdrawalRequestPropertiesFragment
): WithdrawalRequestRecord;
export function parseWithdrawalRecord(
  batch: WithdrawalBatch,
  log: SubgraphWithdrawalBatchPaymentPropertiesFragment
): WithdrawalPaymentRecord;
export function parseWithdrawalRecord(
  batch: WithdrawalBatch,
  log: SubgraphWithdrawalExecutionPropertiesFragment
): WithdrawalExecutionRecord;
export function parseWithdrawalRecord(
  batch: WithdrawalBatch,
  log:
    | SubgraphWithdrawalRequestPropertiesFragment
    | SubgraphWithdrawalBatchPaymentPropertiesFragment
    | SubgraphWithdrawalExecutionPropertiesFragment
): WithdrawalRequestRecord | WithdrawalPaymentRecord | WithdrawalExecutionRecord {
  const token = batch.market.underlyingToken;
  if ("normalizedAmountPaid" in log) {
    const { normalizedAmountPaid, ...rest } = log;
    return {
      ...rest,
      normalizedAmountPaid: token.getAmount(normalizedAmountPaid)
    };
  }
  if ("scaledAmount" in log) {
    return WithdrawalRequestRecord.fromSubgraphWithdrawalRequest(batch, log);
  }
  const { normalizedAmount, ...rest } = log;
  return {
    ...rest,
    normalizedAmount: token.getAmount(normalizedAmount)
  };
}

export const removeUnusedTxFields = ({
  to,
  data,
  value = BigNumber.from(0)
}: PopulatedTransaction): PartialTransaction => {
  assert(to !== undefined, "to is undefined");
  assert(data !== undefined, "data is undefined");
  return {
    to,
    data,
    value: value.toHexString()
  };
};

export type MaxTotalSupplyUpdatedRecord = Omit<
  SubgraphMaxTotalSupplyUpdatedDataFragment,
  "oldMaxTotalSupply" | "newMaxTotalSupply" | "__typename"
> & {
  __typename: "MaxTotalSupplyUpdated";
  oldMaxTotalSupply: TokenAmount;
  newMaxTotalSupply: TokenAmount;
};

export type AnnualInterestBipsUpdatedRecord = Omit<
  SubgraphAnnualInterestBipsUpdatedDataFragment,
  "__typename"
> & {
  __typename: "AnnualInterestBipsUpdated";
};

export type DelinquencyStatusChangedRecord = Omit<
  SubgraphDelinquencyStatusChangedDataFragment,
  "liquidityCoverageRequired" | "totalAssets" | "__typename"
> & {
  __typename: "DelinquencyStatusChanged";
  liquidityCoverageRequired: TokenAmount;
  totalAssets: TokenAmount;
};

export type MarketClosedRecord = Omit<SubgraphMarketClosedDataFragment, "__typename"> & {
  __typename: "MarketClosed";
};

export type DepositRecord = {
  __typename: "Deposit";
  amount: TokenAmount;
  address: string;
} & Omit<SubgraphDepositDataFragment, "assetAmount" | "account" | "__typename">;

export type RepaymentRecord = {
  __typename: "DebtRepaid";
  amount: TokenAmount;
} & Omit<SubgraphRepaymentDataFragment, "assetAmount" | "__typename">;

export type BorrowRecord = {
  __typename: "Borrow";
  amount: TokenAmount;
} & Omit<SubgraphBorrowDataFragment, "assetAmount" | "__typename">;

export type FeeCollectionRecord = {
  __typename: "FeesCollected";
  amount: TokenAmount;
} & Omit<SubgraphFeesCollectedDataFragment, "feesCollected" | "__typename">;

export type WithdrawalRequestPartialRecord = Omit<
  SubgraphWithdrawalRequestPropertiesFragment,
  "scaledAmount" | "normalizedAmount" | "__typename"
> & {
  __typename: "WithdrawalRequest";
  scaledAmount: BigNumber;
  normalizedAmount: TokenAmount;
};

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

const isDeposit = (x: any): x is SubgraphDepositDataFragment => x.__typename === "Deposit";
const isDelinquencyStatusChanged = (x: any): x is SubgraphDelinquencyStatusChangedDataFragment =>
  x.__typename === "DelinquencyStatusChanged";
const isMarketClosed = (x: any): x is SubgraphMarketClosedDataFragment =>
  x.__typename === "MarketClosed";

const isAnnualInterestBipsUpdated = (x: any): x is SubgraphAnnualInterestBipsUpdatedDataFragment =>
  x.__typename === "AnnualInterestBipsUpdated";

const isMaxTotalSupplyUpdated = (x: any): x is SubgraphMaxTotalSupplyUpdatedDataFragment =>
  x.__typename === "MaxTotalSupplyUpdated";
const isFeesCollected = (x: any): x is SubgraphFeesCollectedDataFragment =>
  x.__typename === "FeesCollected";
const isWithdrawalRequest = (x: any): x is SubgraphWithdrawalRequestPropertiesFragment =>
  x.__typename === "WithdrawalRequest";

const hasTypeName = <T extends MarketDataFragment>(
  x: T
): x is T & { __typename: Exclude<T["__typename"], undefined> } => x.__typename !== undefined;

export function parseMarketRecord(
  token: Token,
  log: SubgraphAnnualInterestBipsUpdatedDataFragment
): AnnualInterestBipsUpdatedRecord;
export function parseMarketRecord(token: Token, log: SubgraphBorrowDataFragment): BorrowRecord;
export function parseMarketRecord(
  token: Token,
  log: SubgraphDelinquencyStatusChangedDataFragment
): DelinquencyStatusChangedRecord;
export function parseMarketRecord(token: Token, log: SubgraphDepositDataFragment): DepositRecord;
export function parseMarketRecord(
  token: Token,
  log: SubgraphFeesCollectedDataFragment
): FeeCollectionRecord;
export function parseMarketRecord(
  token: Token,
  log: SubgraphMarketClosedDataFragment
): MarketClosedRecord;
export function parseMarketRecord(
  token: Token,
  log: SubgraphMaxTotalSupplyUpdatedDataFragment
): MaxTotalSupplyUpdatedRecord;
export function parseMarketRecord(
  token: Token,
  log: SubgraphRepaymentDataFragment
): RepaymentRecord;
export function parseMarketRecord(
  token: Token,
  log: SubgraphWithdrawalRequestPropertiesFragment
): WithdrawalRequestPartialRecord;
export function parseMarketRecord(token: Token, log: MarketDataFragment): MarketRecord {
  if (!hasTypeName(log)) {
    throw Error(`Malformed market record: ${JSON.stringify(log, null, 2)}\nMissing __typename`);
  }
  if (isDeposit(log)) {
    const { account, assetAmount, ...rest } = log;
    return {
      ...rest,
      amount: token.getAmount(assetAmount),
      address: account.address
    };
  }
  if (isDelinquencyStatusChanged(log)) {
    const { liquidityCoverageRequired, totalAssets, ...rest } = log;
    return {
      ...rest,
      liquidityCoverageRequired: token.getAmount(liquidityCoverageRequired),
      totalAssets: token.getAmount(totalAssets)
    };
  }
  if (isMarketClosed(log) || isAnnualInterestBipsUpdated(log)) {
    return log;
  }
  if (isMaxTotalSupplyUpdated(log)) {
    const { oldMaxTotalSupply, newMaxTotalSupply, ...rest } = log;
    return {
      ...rest,
      oldMaxTotalSupply: token.getAmount(oldMaxTotalSupply),
      newMaxTotalSupply: token.getAmount(newMaxTotalSupply)
    };
  }
  if (isFeesCollected(log)) {
    const { feesCollected, ...rest } = log;
    return {
      ...rest,
      amount: token.getAmount(feesCollected)
    };
  }
  if (isWithdrawalRequest(log)) {
    const { scaledAmount, normalizedAmount, ...rest } = log;
    return {
      ...rest,
      scaledAmount: BigNumber.from(scaledAmount),
      normalizedAmount: token.getAmount(normalizedAmount)
    };
  }
  const { assetAmount, ...rest } = log;
  return {
    ...rest,
    amount: token.getAmount(assetAmount)
  };
}
