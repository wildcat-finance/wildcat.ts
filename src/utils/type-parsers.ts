import { FeeConfigurationStructOutput, MarketParameterConstraintsStructOutput } from "../typechain";
import { PartialTransaction, SignerOrProvider } from "../types";
import { BigNumber, PopulatedTransaction, constants } from "ethers";
import { Token, TokenAmount } from "../token";
import {
  SubgraphWithdrawalBatchPaymentPropertiesFragment,
  SubgraphWithdrawalExecutionPropertiesFragment,
  SubgraphWithdrawalRequestPropertiesFragment
} from "../gql/graphql";
import { WithdrawalBatch } from "../withdrawal-batch";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import { SupportedChainId } from "../constants";

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

// export type WithdrawalRequestRecord = {
//   normalizedAmount: TokenAmount;
// } & Omit<SubgraphWithdrawalRequestPropertiesFragment, "normalizedAmount">;

export class WithdrawalRequestRecord {
  constructor(
    public id: string,
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

  static fromSubgraphWithdrawalRequest(
    batch: WithdrawalBatch,
    data: SubgraphWithdrawalRequestPropertiesFragment
  ): WithdrawalRequestRecord {
    return new WithdrawalRequestRecord(
      data.id,
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
  from,
  data,
  value,
  chainId,
  accessList
}: PopulatedTransaction): PartialTransaction =>
  new PartialTransaction(to, from, data, value, chainId, accessList);
