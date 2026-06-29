import {
  SubgraphFactoryHooksTemplateDataFragment,
  SubgraphHooksTemplateDataFragment
} from "../gql/graphql";

export type SubgraphHooksTemplateLike =
  | SubgraphHooksTemplateDataFragment
  | SubgraphFactoryHooksTemplateDataFragment;

export type NormalizedSubgraphHooksTemplateData = {
  hooksTemplate: string;
  hooksFactory?: string;
  feeRecipient: string;
  protocolFeeBips: number;
  disabled: boolean;
  name: string;
  originationFeeAsset: SubgraphHooksTemplateLike["originationFeeAsset"];
  originationFeeAmount: string;
};

const isFactoryHooksTemplateData = (
  data: SubgraphHooksTemplateLike
): data is SubgraphFactoryHooksTemplateDataFragment => {
  return "templateAddress" in data;
};

export const normalizeSubgraphHooksTemplateData = (
  data: SubgraphHooksTemplateLike
): NormalizedSubgraphHooksTemplateData => {
  return {
    hooksTemplate: isFactoryHooksTemplateData(data) ? data.templateAddress : data.id,
    hooksFactory: isFactoryHooksTemplateData(data) ? data.hooksFactory.id : undefined,
    feeRecipient: data.feeRecipient,
    protocolFeeBips: data.protocolFeeBips,
    disabled: data.disabled,
    name: data.name,
    originationFeeAsset: data.originationFeeAsset,
    originationFeeAmount: data.originationFeeAmount
  };
};
