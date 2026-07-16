import {
  FeeConfigurationStructOutput,
  FeeConfigurationV2StructOutput,
  MarketParameterConstraintsStructOutput
} from "../lens-types";
import {
  FeeConfiguration,
  FeeConfigurationV2,
  HooksCredential,
  HooksFlags,
  MarketParameterConstraints,
  PartialTransaction,
  SignerOrProvider
} from "../types";
import { zeroAddress } from "viem";
import { Token, toRawAmount } from "../token";
import { toNumber, type BigintNumberish } from "./bigint";

import {
  WithdrawalRequestRecord,
  MarketRecordKind,
  MarketDataFragmentByType,
  MarketRecordByType,
  MarketRecordParserMap,
  WithdrawalRecordParserMap,
  WithdrawalRecordKind,
  WithdrawalDataFragmentByType,
  WithdrawalRecordByType
} from "./record-types";

import { WithdrawalBatch } from "../withdrawal-batch";
import { SupportedChainId } from "../constants";
import { assert } from "./assert";
import { SubgraphLenderHooksAccessDataFragment, SubgraphLenderStatus } from "../gql/graphql";
import { LenderRole } from "../account";

export const parseMarketParameterConstraints = (
  constraints: MarketParameterConstraintsStructOutput
): MarketParameterConstraints =>
  Object.fromEntries(
    Object.entries(constraints).map(([k, v]) => [k, toNumber(v)])
  ) as MarketParameterConstraints;

export const parseFeeConfiguration = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  feeConfiguration: FeeConfigurationStructOutput
): FeeConfiguration => {
  const originationFeeToken =
    feeConfiguration.originationFeeToken.token === zeroAddress
      ? undefined
      : Token.fromTokenMetadata(chainId, feeConfiguration.originationFeeToken, provider);
  const originationFeeAmount =
    originationFeeToken && originationFeeToken.getAmount(feeConfiguration.originationFeeAmount);
  return {
    feeRecipient: feeConfiguration.feeRecipient,
    protocolFeeBips: toNumber(feeConfiguration.protocolFeeBips),
    originationFeeToken,
    originationFeeAmount
  };
};

export const parseFeeConfigurationV2 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  {
    originationFeeToken,
    originationFeeAmount,
    borrowerOriginationFeeBalance,
    borrowerOriginationFeeApproval,
    protocolFeeBips,
    feeRecipient
  }: FeeConfigurationV2StructOutput
): FeeConfigurationV2 => {
  const fees: FeeConfigurationV2 = {
    feeRecipient: feeRecipient,
    protocolFeeBips: toNumber(protocolFeeBips)
  };
  if (originationFeeToken.token === zeroAddress) return fees;
  const token = Token.fromTokenMetadata(chainId, originationFeeToken, provider);

  return {
    ...fees,
    originationFeeToken: token,
    originationFeeAmount: token.getAmount(originationFeeAmount),
    borrowerOriginationFeeBalance: token.getAmount(borrowerOriginationFeeBalance),
    borrowerOriginationFeeApproval: token.getAmount(borrowerOriginationFeeApproval)
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

type PopulatedTransactionLike = {
  to?: string;
  data?: string;
  value?: BigintNumberish;
};

export const removeUnusedTxFields = ({
  to,
  data,
  value = 0n
}: PopulatedTransactionLike): PartialTransaction => {
  assert(to !== undefined, "to is undefined");
  assert(data !== undefined, "data is undefined");
  return {
    to,
    data,
    value: toRawAmount(value).toString()
  };
};

const marketRecordParsers: MarketRecordParserMap = {
  AnnualInterestBipsUpdated: (_, log) => log,
  AnnualInterestBipsReductionProposed: (_, log) => log,
  Borrow: (token, { assetAmount, ...rest }) => ({
    amount: token.getAmount(assetAmount),
    ...rest
  }),
  DebtRepaid: (token, { assetAmount, ...rest }) => ({
    amount: token.getAmount(assetAmount),
    ...rest
  }),
  DelinquencyStatusChanged: (token, { liquidityCoverageRequired, totalAssets, ...rest }) => ({
    liquidityCoverageRequired: token.getAmount(liquidityCoverageRequired),
    totalAssets: token.getAmount(totalAssets),
    ...rest
  }),
  Deposit: (token, { account, assetAmount, ...rest }) => ({
    amount: token.getAmount(assetAmount),
    address: account.address,
    ...rest
  }),
  DisabledForceBuyBacks: (_, log) => ({
    ...log
  }),
  FeesCollected: (token, { feesCollected, ...rest }) => ({
    amount: token.getAmount(feesCollected),
    ...rest
  }),
  FixedTermUpdated: (_, log) => ({ ...log }),
  ForceBuyBack: (token, { scaledAmount, normalizedAmount, ...rest }) => ({
    scaledAmount: toRawAmount(scaledAmount),
    normalizedAmount: token.getAmount(normalizedAmount),
    ...rest
  }),
  MarketClosed: (_, log) => log,
  MaxTotalSupplyUpdated: (token, { oldMaxTotalSupply, newMaxTotalSupply, ...rest }) => ({
    oldMaxTotalSupply: token.getAmount(oldMaxTotalSupply),
    newMaxTotalSupply: token.getAmount(newMaxTotalSupply),
    ...rest
  }),
  MinimumDepositUpdated: (token, { oldMinimumDeposit, newMinimumDeposit, ...rest }) => ({
    oldMinimumDeposit: token.getAmount(oldMinimumDeposit ?? 0),
    newMinimumDeposit: token.getAmount(newMinimumDeposit),
    ...rest
  }),
  PeriodicTermClosed: (_, log) => log,
  PeriodicTermUpdated: (_, log) => log,
  ProtocolFeeBipsUpdated: (_, log) => ({ ...log }),
  WithdrawalRequest: (token, { scaledAmount, normalizedAmount, account, ...rest }) => ({
    address: account.address,
    scaledAmount: toRawAmount(scaledAmount),
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

const Bit_Enabled_Deposit = 95n;
const Bit_Enabled_QueueWithdrawal = 94n;
const Bit_Enabled_ExecuteWithdrawal = 93n;
const Bit_Enabled_Transfer = 92n;
const Bit_Enabled_Borrow = 91n;
const Bit_Enabled_Repay = 90n;
const Bit_Enabled_CloseMarket = 89n;
const Bit_Enabled_NukeFromOrbit = 88n;
const Bit_Enabled_SetMaxTotalSupply = 87n;
const Bit_Enabled_SetAnnualInterestAndReserveRatioBips = 86n;
const Bit_Enabled_SetProtocolFeeBips = 85n;
const Bit_Enabled_ExecutePendingAnnualInterestBipsReduction = 84n;

export function encodeHooksConfig({
  hooksAddress = zeroAddress,
  useOnDeposit = false,
  useOnQueueWithdrawal = false,
  useOnExecuteWithdrawal = false,
  useOnTransfer = false,
  useOnBorrow = false,
  useOnRepay = false,
  useOnCloseMarket = false,
  useOnNukeFromOrbit = false,
  useOnSetMaxTotalSupply = false,
  useOnSetAnnualInterestAndReserveRatioBips = false,
  useOnSetProtocolFeeBips = false,
  useOnExecutePendingAnnualInterestBipsReduction = false
}: Partial<HooksFlags & { hooksAddress: string }>): bigint {
  let hooks = BigInt(hooksAddress) << 96n;
  hooks |= BigInt(useOnDeposit) << Bit_Enabled_Deposit;
  hooks |= BigInt(useOnQueueWithdrawal) << Bit_Enabled_QueueWithdrawal;
  hooks |= BigInt(useOnExecuteWithdrawal) << Bit_Enabled_ExecuteWithdrawal;
  hooks |= BigInt(useOnTransfer) << Bit_Enabled_Transfer;
  hooks |= BigInt(useOnBorrow) << Bit_Enabled_Borrow;
  hooks |= BigInt(useOnRepay) << Bit_Enabled_Repay;
  hooks |= BigInt(useOnCloseMarket) << Bit_Enabled_CloseMarket;
  hooks |= BigInt(useOnNukeFromOrbit) << Bit_Enabled_NukeFromOrbit;
  hooks |= BigInt(useOnSetMaxTotalSupply) << Bit_Enabled_SetMaxTotalSupply;
  hooks |=
    BigInt(useOnSetAnnualInterestAndReserveRatioBips) <<
    Bit_Enabled_SetAnnualInterestAndReserveRatioBips;
  hooks |= BigInt(useOnSetProtocolFeeBips) << Bit_Enabled_SetProtocolFeeBips;
  hooks |=
    BigInt(useOnExecutePendingAnnualInterestBipsReduction) <<
    Bit_Enabled_ExecutePendingAnnualInterestBipsReduction;

  return hooks;
}

export function decodeHooksConfig(hooks: bigint): HooksFlags & { hooksAddress: string } {
  return {
    hooksAddress: `0x${(hooks >> 96n).toString(16).padStart(40, "0")}`,
    useOnDeposit: Boolean((hooks >> Bit_Enabled_Deposit) & 1n),
    useOnQueueWithdrawal: Boolean((hooks >> Bit_Enabled_QueueWithdrawal) & 1n),
    useOnExecuteWithdrawal: Boolean((hooks >> Bit_Enabled_ExecuteWithdrawal) & 1n),
    useOnTransfer: Boolean((hooks >> Bit_Enabled_Transfer) & 1n),
    useOnBorrow: Boolean((hooks >> Bit_Enabled_Borrow) & 1n),
    useOnRepay: Boolean((hooks >> Bit_Enabled_Repay) & 1n),
    useOnCloseMarket: Boolean((hooks >> Bit_Enabled_CloseMarket) & 1n),
    useOnNukeFromOrbit: Boolean((hooks >> Bit_Enabled_NukeFromOrbit) & 1n),
    useOnSetMaxTotalSupply: Boolean((hooks >> Bit_Enabled_SetMaxTotalSupply) & 1n),
    useOnSetAnnualInterestAndReserveRatioBips: Boolean(
      (hooks >> Bit_Enabled_SetAnnualInterestAndReserveRatioBips) & 1n
    ),
    useOnSetProtocolFeeBips: Boolean((hooks >> Bit_Enabled_SetProtocolFeeBips) & 1n),
    useOnExecutePendingAnnualInterestBipsReduction: Boolean(
      (hooks >> Bit_Enabled_ExecutePendingAnnualInterestBipsReduction) & 1n
    )
  };
}

export function parseSubgraphLenderStatus(role: SubgraphLenderStatus): LenderRole {
  const RolesMap = {
    Null: LenderRole.Null,
    Blocked: LenderRole.Blocked,
    WithdrawOnly: LenderRole.WithdrawOnly,
    DepositAndWithdraw: LenderRole.DepositAndWithdraw
  };
  return RolesMap[role];
}

export const parseSubgraphLenderHooksAccess = ({
  canRefresh,
  isBlockedFromDeposits,
  lastApprovalTimestamp,
  lastProvider
}: SubgraphLenderHooksAccessDataFragment): HooksCredential => {
  return {
    canRefresh,
    isBlockedFromDeposits,
    lastApprovalTimestamp,
    lastProvider: lastProvider!
  };
};
