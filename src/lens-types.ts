import type { Hex } from "viem";

export type Numeric = bigint | number | string | { toString(): string };
export type BytesLike = Hex | string;

export type TokenMetadataStructOutput = {
  token: string;
  name: string;
  symbol: string;
  decimals: Numeric;
  isMock: boolean;
};

export type TokenMetadataV2_5StructOutput = TokenMetadataStructOutput;

export type FeeConfigurationStructOutput = {
  feeRecipient: string;
  protocolFeeBips: Numeric;
  originationFeeToken: TokenMetadataStructOutput;
  originationFeeAmount: Numeric;
};

export type FeeConfigurationV2StructOutput = FeeConfigurationStructOutput & {
  borrowerOriginationFeeBalance: Numeric;
  borrowerOriginationFeeApproval: Numeric;
};

export type MarketParameterConstraintsStructOutput = {
  minimumDelinquencyGracePeriod: Numeric;
  maximumDelinquencyGracePeriod: Numeric;
  minimumReserveRatioBips: Numeric;
  maximumReserveRatioBips: Numeric;
  minimumDelinquencyFeeBips: Numeric;
  maximumDelinquencyFeeBips: Numeric;
  minimumWithdrawalBatchDuration: Numeric;
  maximumWithdrawalBatchDuration: Numeric;
  minimumAnnualInterestBips: Numeric;
  maximumAnnualInterestBips: Numeric;
};

export type HooksConfigDataStructOutput = {
  useOnDeposit: boolean;
  useOnQueueWithdrawal: boolean;
  useOnExecuteWithdrawal: boolean;
  useOnTransfer: boolean;
  useOnBorrow: boolean;
  useOnRepay: boolean;
  useOnCloseMarket: boolean;
  useOnNukeFromOrbit: boolean;
  useOnSetMaxTotalSupply: boolean;
  useOnSetAnnualInterestAndReserveRatioBips: boolean;
  useOnSetProtocolFeeBips: boolean;
};

export type HooksConfigDataV2_5StructOutput = HooksConfigDataStructOutput & {
  useOnExecutePendingAnnualInterestBipsReduction: boolean;
};

export type RoleProviderDataStructOutput = {
  timeToLive: Numeric;
  providerAddress: string;
  pullProviderIndex: Numeric;
  pushProviderIndex: Numeric;
};

export type RoleProviderDataV2_5StructOutput = RoleProviderDataStructOutput & {
  isManaged: boolean;
  administrator: string;
  pendingAdministrator: string;
};

export type HooksDeploymentFlagsStructOutput = {
  optional: HooksConfigDataStructOutput;
  required: HooksConfigDataStructOutput;
};

export type HooksDeploymentFlagsV2_5StructOutput = {
  optional: HooksConfigDataV2_5StructOutput;
  required: HooksConfigDataV2_5StructOutput;
};

export type HooksTemplateDataStructOutput = {
  hooksTemplate: string;
  fees: FeeConfigurationV2StructOutput;
  exists: boolean;
  enabled: boolean;
  index: Numeric;
  name: string;
  totalMarkets: Numeric;
};

export type FactoryScopedHooksTemplateDataV2_5StructOutput = {
  hooksFactory: string;
  hooksTemplateData: HooksTemplateDataStructOutput;
};

export type HooksInstanceDataStructOutput = {
  hooksAddress: string;
  borrower: string;
  name: string;
  kind: Numeric;
  hooksTemplate: HooksTemplateDataStructOutput;
  constraints: MarketParameterConstraintsStructOutput;
  deploymentFlags: HooksDeploymentFlagsStructOutput;
  pullProviders: RoleProviderDataStructOutput[];
  pushProviders: RoleProviderDataStructOutput[];
  totalMarkets: Numeric;
};

export type HooksInstanceDataV2_5StructOutput = Omit<
  HooksInstanceDataStructOutput,
  "borrower" | "deploymentFlags" | "pullProviders" | "pushProviders"
> & {
  administrator: string;
  pendingAdministrator: string;
  deploymentFlags: HooksDeploymentFlagsV2_5StructOutput;
  pullProviders: RoleProviderDataV2_5StructOutput[];
  pushProviders: RoleProviderDataV2_5StructOutput[];
};

export type AnyHooksInstanceDataStructOutput =
  | HooksInstanceDataStructOutput
  | HooksInstanceDataV2_5StructOutput;

export type MarketHooksDataStructOutput = {
  hooksAddress: string;
  flags: HooksConfigDataStructOutput;
  kind: Numeric;
  transferRequiresAccess: boolean;
  depositRequiresAccess: boolean;
  minimumDeposit: Numeric;
  transfersDisabled: boolean;
  allowForceBuyBacks?: boolean;
  withdrawalRequiresAccess: boolean;
  fixedTermEndTime: Numeric;
  allowClosureBeforeTerm: boolean;
  allowTermReduction: boolean;
  firstWithdrawalWindowStart: Numeric;
  periodDuration: Numeric;
  withdrawalWindowDuration: Numeric;
  periodicTermClosed: boolean;
};

export type MarketHooksDataV2_5StructOutput = Omit<
  MarketHooksDataStructOutput,
  "flags" | "allowForceBuyBacks"
> & {
  flags: HooksConfigDataV2_5StructOutput;
};

export type MarketDataStructOutput = {
  marketToken: TokenMetadataStructOutput;
  underlyingToken: TokenMetadataStructOutput;
  borrower: string;
  controller: string;
  feeRecipient: string;
  protocolFeeBips: Numeric;
  delinquencyFeeBips: Numeric;
  delinquencyGracePeriod: Numeric;
  withdrawalBatchDuration: Numeric;
  reserveRatioBips: Numeric;
  annualInterestBips: Numeric;
  temporaryReserveRatio: boolean;
  originalAnnualInterestBips: Numeric;
  originalReserveRatioBips: Numeric;
  temporaryReserveRatioExpiry: Numeric;
  isClosed: boolean;
  scaleFactor: Numeric;
  totalSupply: Numeric;
  maxTotalSupply: Numeric;
  scaledTotalSupply: Numeric;
  totalAssets: Numeric;
  lastAccruedProtocolFees: Numeric;
  normalizedUnclaimedWithdrawals: Numeric;
  scaledPendingWithdrawals: Numeric;
  pendingWithdrawalExpiry: Numeric;
  isDelinquent: boolean;
  timeDelinquent: Numeric;
  lastInterestAccruedTimestamp: Numeric;
  unpaidWithdrawalBatchExpiries: Numeric[];
  coverageLiquidity: Numeric;
  borrowableAssets?: Numeric;
  delinquentDebt?: Numeric;
};

export type MarketDataV2StructOutput = Omit<
  MarketDataStructOutput,
  "controller" | "borrowableAssets" | "delinquentDebt"
> & {
  hooksFactory: string;
  hooksConfig: MarketHooksDataStructOutput;
  hooks: HooksInstanceDataStructOutput;
};

export type OptionalUintDataV2_5StructOutput = {
  isPresent: boolean;
  value: Numeric;
};

export type MarketDataBaseV2_5StructOutput = Omit<
  MarketDataV2StructOutput,
  "hooksConfig" | "hooks"
> & {
  hooksConfig: MarketHooksDataV2_5StructOutput;
  hooks: HooksInstanceDataV2_5StructOutput;
};

export type MarketDataV2_5StructOutput = {
  market: MarketDataBaseV2_5StructOutput;
  borrowerPrincipal: string;
  pendingBorrower: string;
  pendingBorrowerPrincipal: string;
  borrowerIdentityRegistry: string;
  commitmentFeeBips: OptionalUintDataV2_5StructOutput;
  drawnAmount: OptionalUintDataV2_5StructOutput;
};

export type ControllerDataStructOutput = {
  borrower: string;
  controller: string;
  controllerFactory: string;
  isRegisteredBorrower: boolean;
  hasDeployedController: boolean;
  fees: FeeConfigurationStructOutput;
  constraints: MarketParameterConstraintsStructOutput;
  markets: MarketDataStructOutput[];
  borrowerOriginationFeeBalance: Numeric;
  borrowerOriginationFeeApproval: Numeric;
};

export type MarketLenderStatusStructOutput = {
  lender: string;
  isAuthorizedOnController: boolean;
  role: Numeric;
  scaledBalance: Numeric;
  normalizedBalance: Numeric;
  underlyingBalance: Numeric;
  underlyingApproval: Numeric;
};

export type LenderAccountDataStructOutput = {
  lender: string;
  scaledBalance: Numeric;
  normalizedBalance: Numeric;
  underlyingBalance: Numeric;
  underlyingApproval: Numeric;
  isBlockedFromDeposits: boolean;
  lastProvider: RoleProviderDataStructOutput;
  canRefresh: boolean;
  lastApprovalTimestamp: Numeric;
  isKnownLender: boolean;
};

export type LenderAccountDataV2_5StructOutput = Omit<
  LenderAccountDataStructOutput,
  "lastProvider"
> & {
  lastProvider: RoleProviderDataV2_5StructOutput;
};

export type MarketDataWithLenderStatusStructOutput = {
  market: MarketDataStructOutput;
  lenderStatus: MarketLenderStatusStructOutput;
};

export type MarketDataWithLenderStatusV2StructOutput = {
  market: MarketDataV2StructOutput;
  lenderStatus: LenderAccountDataStructOutput;
};

export type MarketDataWithLenderStatusV2_5StructOutput = {
  market: MarketDataBaseV2_5StructOutput;
  lenderStatus: LenderAccountDataV2_5StructOutput;
};

export type MarketLiveDataV2_5StructOutput = {
  market: string;
  isClosed: boolean;
  protocolFeeBips: Numeric;
  reserveRatioBips: Numeric;
  annualInterestBips: Numeric;
  scaleFactor: Numeric;
  totalSupply: Numeric;
  maxTotalSupply: Numeric;
  scaledTotalSupply: Numeric;
  totalAssets: Numeric;
  lastAccruedProtocolFees: Numeric;
  normalizedUnclaimedWithdrawals: Numeric;
  scaledPendingWithdrawals: Numeric;
  pendingWithdrawalExpiry: Numeric;
  isDelinquent: boolean;
  timeDelinquent: Numeric;
  lastInterestAccruedTimestamp: Numeric;
  coverageLiquidity: Numeric;
  commitmentFeeBips: OptionalUintDataV2_5StructOutput;
  drawnAmount: OptionalUintDataV2_5StructOutput;
};

export type MarketLiveDataWithLenderStatusV2_5StructOutput = {
  market: MarketLiveDataV2_5StructOutput;
  lenderStatus: LenderAccountDataV2_5StructOutput;
};

export type HooksDataForBorrowerStructOutput = {
  borrower: string;
  isRegisteredBorrower: boolean;
  hooksTemplates: HooksTemplateDataStructOutput[];
  hooksInstances: HooksInstanceDataStructOutput[];
};

export type HooksDataForBorrowerV2_5StructOutput = Omit<
  HooksDataForBorrowerStructOutput,
  "hooksInstances"
> & {
  hooksInstances: HooksInstanceDataV2_5StructOutput[];
};

export type WithdrawalBatchDataStructOutput = {
  expiry: Numeric;
  status: Numeric;
  scaledTotalAmount: Numeric;
  scaledAmountBurned: Numeric;
  normalizedAmountPaid: Numeric;
  normalizedTotalAmount: Numeric;
};

export type WithdrawalBatchDataV2_5StructOutput = WithdrawalBatchDataStructOutput;

export type WithdrawalBatchLenderStatusStructOutput = {
  lender: string;
  scaledAmount: Numeric;
  normalizedAmountWithdrawn: Numeric;
  normalizedAmountOwed: Numeric;
  availableWithdrawalAmount: Numeric;
};

export type WithdrawalBatchLenderStatusV2_5StructOutput = WithdrawalBatchLenderStatusStructOutput;

export type WithdrawalBatchDataWithLenderStatusStructOutput = {
  batch: WithdrawalBatchDataStructOutput;
  lenderStatus: WithdrawalBatchLenderStatusStructOutput;
};

export type WithdrawalBatchDataWithLenderStatusV2_5StructOutput =
  WithdrawalBatchDataWithLenderStatusStructOutput;

export type CollateralContractDataStructOutput = {
  collateralContract: string;
  market: string;
  marketBorrower: string;
  bebopSettlementContract: string;
  underlyingAsset: TokenMetadataStructOutput;
  collateralAsset: TokenMetadataStructOutput;
  liquidationCooldown: Numeric;
  maxRepaymentBips: Numeric;
  fullLiquidationIndex: Numeric;
  totalShares: Numeric;
  availableCollateral: Numeric;
  collateralBalance: Numeric;
  nextLiquidationTrigger: Numeric;
  isMarketClosed: boolean;
  isMarketInPenalty: boolean;
  delinquentDebt: Numeric;
  maxRepayment: Numeric;
};

export type DeployMarketInputsV2Struct = {
  asset: string;
  namePrefix: string;
  symbolPrefix: string;
  maxTotalSupply: Numeric;
  annualInterestBips: Numeric;
  delinquencyFeeBips: Numeric;
  withdrawalBatchDuration: Numeric;
  reserveRatioBips: Numeric;
  delinquencyGracePeriod: Numeric;
  hooks: Numeric;
};

export type StandardDeployMarketArgs = [
  parameters: DeployMarketInputsV2Struct,
  hooksData: BytesLike,
  salt: BytesLike,
  originationFeeAsset: string,
  originationFeeAmount: Numeric
];

export type StandardDeployMarketAndHooksArgs = [
  hooksTemplate: string,
  hooksConstructorArgs: BytesLike,
  parameters: DeployMarketInputsV2Struct,
  hooksData: BytesLike,
  salt: BytesLike,
  originationFeeAsset: string,
  originationFeeAmount: Numeric
];

export type RevolvingDeployMarketArgs = [
  parameters: DeployMarketInputsV2Struct,
  hooksData: BytesLike,
  marketData: BytesLike,
  salt: BytesLike,
  originationFeeAsset: string,
  originationFeeAmount: Numeric
];

export type RevolvingDeployMarketAndHooksArgs = [
  hooksTemplate: string,
  hooksConstructorArgs: BytesLike,
  parameters: DeployMarketInputsV2Struct,
  hooksData: BytesLike,
  marketData: BytesLike,
  salt: BytesLike,
  originationFeeAsset: string,
  originationFeeAmount: Numeric
];
