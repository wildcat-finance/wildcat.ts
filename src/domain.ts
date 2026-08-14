export const MarketKinds = ["standard", "revolving", "unknown"] as const;
export type MarketKind = (typeof MarketKinds)[number];

export const ProtocolMarketVersions = ["v1", "v2", "unknown"] as const;
export type ProtocolMarketVersion = (typeof ProtocolMarketVersions)[number];

export const DeployableMarketKinds = ["standard", "revolving"] as const;
export type DeployableMarketKind = (typeof DeployableMarketKinds)[number];

export const DefaultMarketKind: DeployableMarketKind = "standard";

const normalizeEnumValue = (value: string | null | undefined): string =>
  value?.replaceAll(/[_-]/g, "").toLowerCase() ?? "";

export const isMarketKind = (value: string): value is MarketKind =>
  MarketKinds.includes(value as MarketKind);

export const isDeployableMarketKind = (value: string): value is DeployableMarketKind =>
  DeployableMarketKinds.includes(value as DeployableMarketKind);

/** Normalize protocol/subgraph enum spellings without treating unknown values as standard. */
export const parseMarketKind = (value: string | null | undefined): MarketKind => {
  switch (normalizeEnumValue(value)) {
    case "legacy":
    case "standard":
      return "standard";
    case "revolving":
      return "revolving";
    default:
      return "unknown";
  }
};

export const parseProtocolMarketVersion = (
  value: string | null | undefined
): ProtocolMarketVersion => {
  switch (normalizeEnumValue(value)) {
    case "v1":
      return "v1";
    case "v2":
      return "v2";
    default:
      return "unknown";
  }
};

export enum HooksKind {
  Unknown = "Unknown",
  OpenTerm = "OpenTerm",
  FixedTerm = "FixedTerm",
  PeriodicTerm = "PeriodicTerm"
}

/**
 * How an otherwise eligible lender obtains deposit access to a market.
 *
 * This describes market policy, not whether a particular lender can deposit
 * right now. Use `MarketAccount.depositAvailability` for the latter.
 */
export enum MarketOnboardingMode {
  SelfOnboard = "self-onboard",
  BorrowerApproval = "borrower-approval"
}

export type FactoryLifecycle = "active" | "historical" | "retired" | "unknown";
export type HookedMarketAbiKind = "base" | "force-buyback" | "unknown";
export type PricingMode = "chainlink" | "synthetic-testnet" | "none" | "unknown";
export type SnapshotSource = "event-projection" | "event-and-contract-call" | "unknown";
export type ReadStateSource = "indexed" | "live";
export type RoleProviderKind = "access-list" | "unknown";

export const parseHooksKind = (value: string | null | undefined): HooksKind => {
  switch (normalizeEnumValue(value)) {
    case "openterm":
    case "opentermhooks":
      return HooksKind.OpenTerm;
    case "fixedterm":
    case "fixedtermhooks":
      return HooksKind.FixedTerm;
    case "periodicterm":
    case "periodictermhooks":
      return HooksKind.PeriodicTerm;
    default:
      return HooksKind.Unknown;
  }
};

export const parseFactoryLifecycle = (value: string | null | undefined): FactoryLifecycle => {
  switch (normalizeEnumValue(value)) {
    case "active":
      return "active";
    case "historical":
      return "historical";
    case "retired":
      return "retired";
    default:
      return "unknown";
  }
};

export const parseHookedMarketAbiKind = (value: string | null | undefined): HookedMarketAbiKind => {
  switch (normalizeEnumValue(value)) {
    case "base":
      return "base";
    case "forcebuyback":
      return "force-buyback";
    default:
      return "unknown";
  }
};

export const parsePricingMode = (value: string | null | undefined): PricingMode => {
  switch (normalizeEnumValue(value)) {
    case "chainlink":
      return "chainlink";
    case "synthetictestnet":
      return "synthetic-testnet";
    case "none":
      return "none";
    default:
      return "unknown";
  }
};

export const parseSnapshotSource = (value: string | null | undefined): SnapshotSource => {
  switch (normalizeEnumValue(value)) {
    case "eventprojection":
      return "event-projection";
    case "eventandcontractcall":
      return "event-and-contract-call";
    default:
      return "unknown";
  }
};

export const parseRoleProviderKind = (value: string | null | undefined): RoleProviderKind =>
  normalizeEnumValue(value) === "accesslist" ? "access-list" : "unknown";

export const parseMarketOriginKind = (
  value: string | null | undefined
): MarketOriginKind | "unknown" => {
  switch (normalizeEnumValue(value)) {
    case "controller":
      return "controller";
    case "hooks":
      return "hooks";
    default:
      return "unknown";
  }
};

export type IndexedBlock = {
  blockNumber: bigint;
  blockTimestamp: bigint;
};

export type IndexedAt = IndexedBlock & {
  transactionHash: string;
  logIndex: bigint;
};

export type IndexedSnapshotMetadata = IndexedAt & {
  source: SnapshotSource;
};

export type IndexerDeploymentMetadata = {
  chainId: number;
  network: string;
  graphNetwork: string;
  schemaRelease: string;
  configDigest: string;
  archController: string;
  sanctionsSentinel: string;
  analyticsEnabled: boolean;
  collateralEnabled: boolean;
  wrappersEnabled: boolean;
  pricingMode: PricingMode;
  firstObserved: IndexedAt;
};

/** Indexed identity and observed state for one hooks factory. */
export type HooksFactoryMetadata = {
  address: string;
  label: string;
  archController: string;
  sentinel: string;
  marketKind: MarketKind;
  generation: string;
  abiFamily: string;
  hookedMarketAbi: HookedMarketAbiKind;
  configuredStartBlock: bigint;
  indexed: boolean;
  deploymentTarget: boolean;
  lifecycle: FactoryLifecycle;
  configured: boolean;
  isRegistered: boolean;
  registrationUpdatedAt?: IndexedBlock;
};

/** Bytecode/interface identity shared by factory-scoped registrations. */
export type HooksTemplateIdentity = {
  address: string;
  kind: HooksKind;
  version: string;
  abiFamily: string;
};

/** Mutable state for exactly one hooks-factory/template pair. */
export type HooksTemplateRegistrationMetadata = {
  id: string;
  hooksFactory: HooksFactoryMetadata;
  hooksTemplate: HooksTemplateIdentity;
  name: string;
  feeRecipient: string;
  protocolFeeBips: number;
  originationFeeAsset?: string;
  originationFeeAmount: bigint;
  isEnabled: boolean;
  createdAt: IndexedAt;
  updatedAt: IndexedAt;
};

export type MarketOriginKind = "controller" | "hooks";

export type MarketProvenance = {
  address: string;
  version: ProtocolMarketVersion;
  marketKind: MarketKind;
  originKind: MarketOriginKind | "unknown";
  generation: string;
  abiFamily: string;
  archController: string;
  borrower: string;
  borrowerPrincipal: string;
  pendingBorrower?: string;
  pendingBorrowerPrincipal?: string;
  borrowerIdentityRegistry?: string;
  sentinel: string;
  controller?: string;
  hooksFactory?: HooksFactoryMetadata;
  createdAt: IndexedAt;
};

export type IndexedMarketSnapshot = IndexedSnapshotMetadata & {
  isClosed: boolean;
  maxTotalSupply: bigint;
  protocolFeeBips: number;
  pendingProtocolFees: bigint;
  normalizedUnclaimedWithdrawals: bigint;
  scaledTotalSupply: bigint;
  scaledPendingWithdrawals: bigint;
  pendingWithdrawalExpiry: bigint;
  isDelinquent: boolean;
  isIncurringPenalties: boolean;
  timeDelinquent: number;
  annualInterestBips: number;
  commitmentFeeBips?: bigint;
  reserveRatioBips: number;
  drawnAmount?: bigint;
  scaleFactor: bigint;
  lastInterestAccruedTimestamp: number;
  lastInterestAccruedBlockNumber: number;
  originalAnnualInterestBips: number;
  originalReserveRatioBips: number;
  temporaryReserveRatioExpiry: number;
  temporaryReserveRatioActive: boolean;
};

export type IndexedLenderRole =
  | "null"
  | "blocked"
  | "withdraw-only"
  | "deposit-and-withdraw"
  | "unknown";

export type IndexedLenderAccountSnapshot = IndexedSnapshotMetadata & {
  scaledBalance: bigint;
  role: IndexedLenderRole;
  totalDeposited: bigint;
  lastScaleFactor: bigint;
  lastUpdatedTimestamp: number;
  lastUpdatedBlockNumber: number;
  totalInterestEarned: bigint;
  numPendingWithdrawalBatches: number;
};

export type IndexedCollateralSnapshot = IndexedSnapshotMetadata & {
  totalDeposited: bigint;
  totalReclaimed: bigint;
  totalLiquidated: bigint;
  totalShares: bigint;
  availableCollateral: bigint;
  lastFullLiquidationIndex: number;
  depositIndex: number;
  liquidationCooldown?: number;
  nextLiquidationTrigger: number;
  eventIndex: number;
};

export type IndexedMarketEvent = IndexedAt & {
  id: string;
  market: string;
  sequence: number;
  kind: string;
};
