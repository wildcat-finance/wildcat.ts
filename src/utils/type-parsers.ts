import { FeeConfigurationStructOutput, MarketParameterConstraintsStructOutput } from "../typechain";
import {
  FeeConfiguration,
  MarketParameterConstraints,
  PartialTransaction,
  SignerOrProvider
} from "../types";
import { BigNumber, PopulatedTransaction, constants } from "ethers";
import { Token } from "../token";

import {
  WithdrawalRequestRecord,
  MarketRecordKind,
  MarketDataFragmentByType,
  MarketRecordByType,
  MarketRecordParserMap,
  WithdrawalRecordParserMap,
  WithdrawalRecordKind,
  WithdrawalDataFragmentByType,
  WithdrawalRecordByType,
  WithdrawalDataFragment,
  WithdrawalRecord
} from "./record-types";

import { WithdrawalBatch } from "../withdrawal-batch";
import { SupportedChainId } from "../constants";
import { assert } from "./assert";
import { SubgraphWithdrawalRequestPropertiesFragment } from "../gql/graphql";

export const parseMarketParameterConstraints = (
  constraints: MarketParameterConstraintsStructOutput
): MarketParameterConstraints =>
  Object.fromEntries(
    Object.entries(constraints).map(([k, v]) => [k, BigNumber.from(v).toNumber()])
  ) as MarketParameterConstraints;

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

const withdrawalRecordParsers: WithdrawalRecordParserMap = {
  WithdrawalBatchPayment: (batch, { normalizedAmountPaid, ...rest }) => ({
    ...rest,
    normalizedAmountPaid: batch.market.underlyingToken.getAmount(normalizedAmountPaid)
  }),
  WithdrawalExecution: (batch, { normalizedAmount, ...rest }) => ({
    ...rest,
    normalizedAmount: batch.market.underlyingToken.getAmount(normalizedAmount)
  }),
  WithdrawalRequest: WithdrawalRequestRecord.fromSubgraphWithdrawalRequest
};

export function parseWithdrawalRecord<K extends WithdrawalRecordKind>(
  batch: WithdrawalBatch,
  log: WithdrawalDataFragmentByType<K>
): WithdrawalRecordByType<K> {
  const k = log.__typename as K;
  return withdrawalRecordParsers[k](batch, log);
}

/* type ParseFn = <K extends keyof WithdrawalDataFragmentByKind>(
  log: WithdrawalDataFragmentWithType<K>
) => K;

const getTypeName: ParseFn = function <K extends WithdrawalRecordKind>(
  log: WithdrawalDataFragmentWithType<K>
): K {
  return log.__typename;
}; */

const test = (batch: WithdrawalBatch, records: SubgraphWithdrawalRequestPropertiesFragment[]) => {
  const x = records.map((r) => parseWithdrawalRecord(batch, r));
};

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

const marketRecordParsers: MarketRecordParserMap = {
  AnnualInterestBipsUpdated: (_, log) => log,
  Borrow: (token, { assetAmount, ...rest }) => ({
    amount: token.getAmount(assetAmount),
    ...rest
  }),
  DebtRepaid: (token, { assetAmount, ...rest }) => ({
    amount: token.getAmount(assetAmount),
    ...rest
  }),
  Deposit: (token, { account, assetAmount, ...rest }) => ({
    amount: token.getAmount(assetAmount),
    address: account.address,
    ...rest
  }),
  DelinquencyStatusChanged: (token, { liquidityCoverageRequired, totalAssets, ...rest }) => ({
    liquidityCoverageRequired: token.getAmount(liquidityCoverageRequired),
    totalAssets: token.getAmount(totalAssets),
    ...rest
  }),
  FeesCollected: (token, { feesCollected, ...rest }) => ({
    amount: token.getAmount(feesCollected),
    ...rest
  }),
  MarketClosed: (_, log) => log,
  MaxTotalSupplyUpdated: (token, { oldMaxTotalSupply, newMaxTotalSupply, ...rest }) => ({
    oldMaxTotalSupply: token.getAmount(oldMaxTotalSupply),
    newMaxTotalSupply: token.getAmount(newMaxTotalSupply),
    ...rest
  }),
  WithdrawalRequest: (token, { scaledAmount, normalizedAmount, account, ...rest }) => ({
    address: account.address,
    scaledAmount: BigNumber.from(scaledAmount),
    normalizedAmount: token.getAmount(normalizedAmount),
    ...rest
  })
};
export function parseMarketRecord<K extends MarketRecordKind>(
  token: Token,
  log: MarketDataFragmentByType<K>
): MarketRecordByType<K> {
  const k = log.__typename as K;
  return marketRecordParsers[k](token, log);
}
