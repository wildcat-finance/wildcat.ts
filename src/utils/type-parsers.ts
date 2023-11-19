import { FeeConfigurationStructOutput, MarketParameterConstraintsStructOutput } from "../typechain";
import { SignerOrProvider } from "../types";
import { BigNumber, constants } from "ethers";
import { Token, TokenAmount } from "../token";
import {
  SubgraphWithdrawalBatchPaymentPropertiesFragment,
  SubgraphWithdrawalExecutionPropertiesFragment,
  SubgraphWithdrawalRequestPropertiesFragment
} from "../gql/graphql";

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
  provider: SignerOrProvider,
  feeConfiguration: FeeConfigurationStructOutput
): FeeConfiguration => {
  const originationFeeToken =
    feeConfiguration.originationFeeToken.token === constants.AddressZero
      ? undefined
      : Token.fromTokenMetadata(feeConfiguration.originationFeeToken, provider);
  const originationFeeAmount =
    originationFeeToken && originationFeeToken.getAmount(feeConfiguration.originationFeeAmount);
  return {
    feeRecipient: feeConfiguration.feeRecipient,
    protocolFeeBips: feeConfiguration.protocolFeeBips,
    originationFeeToken,
    originationFeeAmount
  };
};

export type WithdrawalRequestRecord = {
  normalizedAmount: TokenAmount;
} & Omit<SubgraphWithdrawalRequestPropertiesFragment, "normalizedAmount">;

export type WithdrawalPaymentRecord = {
  normalizedAmountPaid: TokenAmount;
} & Omit<SubgraphWithdrawalBatchPaymentPropertiesFragment, "normalizedAmountPaid">;

export type WithdrawalExecutionRecord = {
  normalizedAmount: TokenAmount;
} & Omit<SubgraphWithdrawalExecutionPropertiesFragment, "normalizedAmount">;

const isPayment = (
  record:
    | SubgraphWithdrawalRequestPropertiesFragment
    | SubgraphWithdrawalBatchPaymentPropertiesFragment
    | SubgraphWithdrawalExecutionPropertiesFragment
): record is SubgraphWithdrawalBatchPaymentPropertiesFragment => {
  return (
    (record as SubgraphWithdrawalBatchPaymentPropertiesFragment).normalizedAmountPaid !== undefined
  );
};

export function parseWithdrawalRecord(
  token: Token,
  log: SubgraphWithdrawalRequestPropertiesFragment
): WithdrawalRequestRecord;
export function parseWithdrawalRecord(
  token: Token,
  log: SubgraphWithdrawalBatchPaymentPropertiesFragment
): WithdrawalPaymentRecord;
export function parseWithdrawalRecord(
  token: Token,
  log: SubgraphWithdrawalExecutionPropertiesFragment
): WithdrawalExecutionRecord;
export function parseWithdrawalRecord(
  token: Token,
  log:
    | SubgraphWithdrawalRequestPropertiesFragment
    | SubgraphWithdrawalBatchPaymentPropertiesFragment
    | SubgraphWithdrawalExecutionPropertiesFragment
): WithdrawalRequestRecord | WithdrawalPaymentRecord | WithdrawalExecutionRecord {
  if (isPayment(log)) {
    const { normalizedAmountPaid, ...rest } = log;
    return {
      ...rest,
      normalizedAmountPaid: token.getAmount(normalizedAmountPaid)
    };
  }
  const { normalizedAmount, ...rest } = log;
  return {
    ...rest,
    normalizedAmount: token.getAmount(normalizedAmount)
  };
}
