import {
  HooksFactoryMetadata,
  HooksKind,
  HooksTemplateRegistrationMetadata,
  parseFactoryLifecycle,
  parseHookedMarketAbiKind,
  parseHooksKind,
  parseMarketKind
} from "../domain";
import {
  SubgraphHooksFactoryDataFragment,
  SubgraphHooksTemplateRegistrationDataFragment
} from "../gql/graphql";

export type SubgraphHooksTemplateLike = SubgraphHooksTemplateRegistrationDataFragment;

export type NormalizedSubgraphHooksTemplateData = {
  hooksTemplate: string;
  hooksFactory: string;
  kind: HooksKind;
  feeRecipient: string;
  protocolFeeBips: number;
  enabled: boolean;
  name: string;
  originationFeeAsset: SubgraphHooksTemplateLike["originationFeeAsset"];
  originationFeeAmount: string;
  registration: HooksTemplateRegistrationMetadata;
};

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
  data: SubgraphHooksTemplateLike
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

export const normalizeSubgraphHooksTemplateData = (
  data: SubgraphHooksTemplateLike
): NormalizedSubgraphHooksTemplateData => {
  const registration = normalizeSubgraphHooksTemplateRegistrationData(data);
  return {
    hooksTemplate: registration.hooksTemplate.address,
    hooksFactory: registration.hooksFactory.address,
    kind: registration.hooksTemplate.kind,
    feeRecipient: data.feeRecipient,
    protocolFeeBips: data.protocolFeeBips,
    enabled: data.isEnabled,
    name: data.name,
    originationFeeAsset: data.originationFeeAsset,
    originationFeeAmount: data.originationFeeAmount,
    registration
  };
};
