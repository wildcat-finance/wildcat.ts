import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllHooksTemplatesDocument,
  SubgraphGetAllHooksTemplatesQuery,
  SubgraphGetAllHooksTemplatesQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { HooksTemplate, hooksTemplateFromSubgraph } from "../access";

export type GetAllHooksTemplatesOptions = SubgraphGetAllHooksTemplatesQueryVariables & {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  fetchPolicy: FetchPolicy;
  signerAddress?: string;
  isRegisteredBorrower?: boolean;
};

export async function getAllHooksTemplates(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    chainId,
    fetchPolicy,
    signerOrProvider,
    signerAddress,
    isRegisteredBorrower,
    ...variables
  }: GetAllHooksTemplatesOptions
): Promise<HooksTemplate[]> {
  const result = await subgraphClient.query<
    SubgraphGetAllHooksTemplatesQuery,
    SubgraphGetAllHooksTemplatesQueryVariables
  >({
    query: GetAllHooksTemplatesDocument,
    variables: {
      ...variables
    },
    fetchPolicy
  });
  return result.data.hooksTemplates
    .filter((t) => t.name === "OpenTermHooks" || t.name === "FixedTermHooks")
    .map((template) =>
      hooksTemplateFromSubgraph(
        chainId,
        signerOrProvider,
        template,
        signerAddress,
        isRegisteredBorrower
      )
    );
}
