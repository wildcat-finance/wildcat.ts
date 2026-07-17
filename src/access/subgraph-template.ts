import { HooksKind, parseHooksKind } from "../domain";
import { SubgraphHooksTemplateRegistrationDataFragment } from "../gql/graphql";

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
};

export const normalizeSubgraphHooksTemplateData = (
  data: SubgraphHooksTemplateLike
): NormalizedSubgraphHooksTemplateData => {
  return {
    hooksTemplate: data.hooksTemplate.address,
    hooksFactory: data.hooksFactory.address,
    kind: parseHooksKind(data.hooksTemplate.kind),
    feeRecipient: data.feeRecipient,
    protocolFeeBips: data.protocolFeeBips,
    enabled: data.isEnabled,
    name: data.name,
    originationFeeAsset: data.originationFeeAsset,
    originationFeeAmount: data.originationFeeAmount
  };
};
