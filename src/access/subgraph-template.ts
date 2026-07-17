import { HooksKind, HooksTemplateRegistrationMetadata } from "../domain";
import { SubgraphHooksTemplateRegistrationDataFragment } from "../gql/graphql";
import { normalizeSubgraphHooksTemplateRegistrationData } from "../gql/normalizers";

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
