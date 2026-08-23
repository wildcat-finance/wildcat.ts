import {
  HooksFactoryMetadata,
  HooksTemplateRegistrationMetadata,
  IndexedCollateralSnapshot,
  IndexedLenderAccountSnapshot,
  IndexedLenderRole,
  IndexedMarketEvent,
  IndexedMarketSnapshot,
  MarketProvenance,
  parseFactoryLifecycle,
  parseHookedMarketAbiKind,
  parseHooksKind,
  parseMarketKind,
  parseMarketOriginKind,
  parseProtocolEventGeneration,
  parseProtocolMarketVersion,
  parseSnapshotSource
} from "../domain";
import {
  SubgraphHooksFactoryDataFragment,
  SubgraphHooksTemplateRegistrationDataFragment,
  SubgraphLenderAccountSnapshotDataFragment,
  SubgraphMarketDataWithEventsFragment,
  SubgraphMarketEventDataFragment,
  SubgraphMarketListDataFragment,
  SubgraphMarketSnapshotDataFragment,
  SubgraphSimpleCollateralContractSnapshotDataFragment
} from "./graphql";

export const normalizeSubgraphHooksFactoryData = (
  data: SubgraphHooksFactoryDataFragment
): HooksFactoryMetadata => ({
  address: data.address,
  label: data.label,
  archController: data.archController.id,
  sentinel: data.sentinel,
  marketKind: parseMarketKind(data.marketKind),
  generation: data.generation,
  abiFamily: data.abiFamily,
  eventGeneration: parseProtocolEventGeneration(data.eventGeneration),
  hookedMarketAbi: parseHookedMarketAbiKind(data.hookedMarketAbi),
  configuredStartBlock: BigInt(data.configuredStartBlock),
  indexed: data.indexed,
  deploymentTarget: data.deploymentTarget,
  lifecycle: parseFactoryLifecycle(data.lifecycle),
  configured: data.configured,
  isRegistered: data.isRegistered,
  ...(data.registrationUpdatedAtBlock !== null &&
  data.registrationUpdatedAtBlock !== undefined &&
  data.registrationUpdatedAtTimestamp !== null &&
  data.registrationUpdatedAtTimestamp !== undefined
    ? {
        registrationUpdatedAt: {
          blockNumber: BigInt(data.registrationUpdatedAtBlock),
          blockTimestamp: BigInt(data.registrationUpdatedAtTimestamp)
        }
      }
    : {})
});

export const normalizeSubgraphHooksTemplateRegistrationData = (
  data: SubgraphHooksTemplateRegistrationDataFragment
): HooksTemplateRegistrationMetadata => ({
  id: data.id,
  hooksFactory: normalizeSubgraphHooksFactoryData(data.hooksFactory),
  hooksTemplate: {
    address: data.hooksTemplate.address,
    kind: parseHooksKind(data.hooksTemplate.kind),
    version: data.hooksTemplate.version,
    abiFamily: data.hooksTemplate.abiFamily
  },
  name: data.name,
  feeRecipient: data.feeRecipient,
  protocolFeeBips: data.protocolFeeBips,
  originationFeeAsset: data.originationFeeAsset?.address,
  originationFeeAmount: BigInt(data.originationFeeAmount),
  isEnabled: data.isEnabled,
  createdAt: {
    blockNumber: BigInt(data.createdAtBlock),
    blockTimestamp: BigInt(data.createdAtTimestamp),
    transactionHash: data.createdAtTransaction,
    logIndex: BigInt(data.createdAtLogIndex)
  },
  updatedAt: {
    blockNumber: BigInt(data.updatedAtBlock),
    blockTimestamp: BigInt(data.updatedAtTimestamp),
    transactionHash: data.updatedAtTransaction,
    logIndex: BigInt(data.updatedAtLogIndex)
  }
});

type SubgraphMarketProvenanceData =
  | SubgraphMarketDataWithEventsFragment
  | SubgraphMarketListDataFragment;

export const normalizeSubgraphMarketProvenance = (
  data: SubgraphMarketProvenanceData
): MarketProvenance => ({
  address: data.address,
  version: parseProtocolMarketVersion(data.version),
  marketKind: parseMarketKind(data.marketKind),
  originKind: parseMarketOriginKind(data.originKind),
  generation: data.generation,
  abiFamily: data.abiFamily,
  eventGeneration: parseProtocolEventGeneration(data.eventGeneration),
  archController: data.archController.id,
  borrower: data.borrower,
  borrowerPrincipal: data.borrowerPrincipal,
  ...(data.pendingBorrower ? { pendingBorrower: data.pendingBorrower } : {}),
  ...(data.pendingBorrowerPrincipal
    ? { pendingBorrowerPrincipal: data.pendingBorrowerPrincipal }
    : {}),
  ...(data.borrowerIdentityRegistryAddress
    ? { borrowerIdentityRegistry: data.borrowerIdentityRegistryAddress }
    : {}),
  sentinel: data.sentinel,
  controller: data.controller?.id,
  hooksFactory: data.hooksFactory
    ? normalizeSubgraphHooksFactoryData(data.hooksFactory)
    : undefined,
  createdAt: {
    blockNumber: BigInt(data.createdAtBlock),
    blockTimestamp: BigInt(data.createdAtTimestamp),
    transactionHash: data.createdAtTransaction,
    logIndex: BigInt(data.createdAtLogIndex)
  }
});

export const normalizeSubgraphMarketSnapshot = (
  data: SubgraphMarketSnapshotDataFragment | null | undefined
): IndexedMarketSnapshot | undefined =>
  data
    ? {
        source: parseSnapshotSource(data.source),
        isClosed: data.isClosed,
        maxTotalSupply: BigInt(data.maxTotalSupply),
        protocolFeeBips: data.protocolFeeBips,
        pendingProtocolFees: BigInt(data.pendingProtocolFees),
        normalizedUnclaimedWithdrawals: BigInt(data.normalizedUnclaimedWithdrawals),
        scaledTotalSupply: BigInt(data.scaledTotalSupply),
        scaledPendingWithdrawals: BigInt(data.scaledPendingWithdrawals),
        pendingWithdrawalExpiry: BigInt(data.pendingWithdrawalExpiry),
        isDelinquent: data.isDelinquent,
        isIncurringPenalties: data.isIncurringPenalties,
        timeDelinquent: data.timeDelinquent,
        annualInterestBips: data.annualInterestBips,
        commitmentFeeBips:
          data.commitmentFeeBips !== null && data.commitmentFeeBips !== undefined
            ? BigInt(data.commitmentFeeBips)
            : undefined,
        reserveRatioBips: data.reserveRatioBips,
        drawnAmount:
          data.drawnAmount !== null && data.drawnAmount !== undefined
            ? BigInt(data.drawnAmount)
            : undefined,
        scaleFactor: BigInt(data.scaleFactor),
        lastInterestAccruedTimestamp: data.lastInterestAccruedTimestamp,
        lastInterestAccruedBlockNumber: data.lastInterestAccruedBlockNumber,
        originalAnnualInterestBips: data.originalAnnualInterestBips,
        originalReserveRatioBips: data.originalReserveRatioBips,
        temporaryReserveRatioExpiry: data.temporaryReserveRatioExpiry,
        temporaryReserveRatioActive: data.temporaryReserveRatioActive,
        blockNumber: BigInt(data.updatedAtBlock),
        blockTimestamp: BigInt(data.updatedAtTimestamp),
        transactionHash: data.updatedAtTransaction,
        logIndex: BigInt(data.updatedAtLogIndex)
      }
    : undefined;

const normalizeLenderRole = (role: string): IndexedLenderRole => {
  switch (role.replaceAll(/[_-]/g, "").toLowerCase()) {
    case "null":
      return "null";
    case "blocked":
      return "blocked";
    case "withdrawonly":
      return "withdraw-only";
    case "depositandwithdraw":
      return "deposit-and-withdraw";
    default:
      return "unknown";
  }
};

export const normalizeSubgraphLenderAccountSnapshot = (
  data: SubgraphLenderAccountSnapshotDataFragment | null | undefined
): IndexedLenderAccountSnapshot | undefined =>
  data
    ? {
        source: parseSnapshotSource(data.source),
        scaledBalance: BigInt(data.scaledBalance),
        principalBasis: BigInt(data.principalBasis),
        role: normalizeLenderRole(data.role),
        totalDeposited: BigInt(data.totalDeposited),
        lastScaleFactor: BigInt(data.lastScaleFactor),
        lastUpdatedTimestamp: data.lastUpdatedTimestamp,
        lastUpdatedBlockNumber: data.lastUpdatedBlockNumber,
        totalInterestEarned: BigInt(data.totalInterestEarned),
        numPendingWithdrawalBatches: data.numPendingWithdrawalBatches,
        blockNumber: BigInt(data.updatedAtBlock),
        blockTimestamp: BigInt(data.updatedAtTimestamp),
        transactionHash: data.updatedAtTransaction,
        logIndex: BigInt(data.updatedAtLogIndex)
      }
    : undefined;

export const normalizeSubgraphCollateralSnapshot = (
  data: SubgraphSimpleCollateralContractSnapshotDataFragment | null | undefined
): IndexedCollateralSnapshot | undefined =>
  data
    ? {
        source: parseSnapshotSource(data.source),
        totalDeposited: BigInt(data.totalDeposited),
        totalReclaimed: BigInt(data.totalReclaimed),
        totalLiquidated: BigInt(data.totalLiquidated),
        totalShares: BigInt(data.totalShares),
        availableCollateral: BigInt(data.availableCollateral),
        lastFullLiquidationIndex: data.lastFullLiquidationIndex,
        depositIndex: data.depositIndex,
        liquidationCooldown: data.liquidationCooldown ?? undefined,
        nextLiquidationTrigger: data.nextLiquidationTrigger,
        eventIndex: data.eventIndex,
        blockNumber: BigInt(data.updatedAtBlock),
        blockTimestamp: BigInt(data.updatedAtTimestamp),
        transactionHash: data.updatedAtTransaction,
        logIndex: BigInt(data.updatedAtLogIndex)
      }
    : undefined;

export const normalizeSubgraphMarketEvent = (
  data: SubgraphMarketEventDataFragment
): IndexedMarketEvent => ({
  id: data.id,
  market: data.market.address,
  sequence: data.sequence,
  kind: data.kind.toLowerCase().replaceAll("_", "-"),
  blockNumber: BigInt(data.blockNumber),
  blockTimestamp: BigInt(data.blockTimestamp),
  transactionHash: data.transactionHash,
  logIndex: BigInt(data.logIndex)
});
