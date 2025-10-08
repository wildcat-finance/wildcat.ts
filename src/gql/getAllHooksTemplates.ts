import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllHooksTemplatesDocument,
  SubgraphGetAllHooksTemplatesQuery,
  SubgraphGetAllHooksTemplatesQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { Signer, SignerOrProvider } from "../types";
import { HooksTemplate, hooksTemplateFromSubgraph } from "../access";

export type GetAllHooksTemplatesOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  fetchPolicy: FetchPolicy;
  borrower?: string;
  isRegisteredBorrower?: boolean;
};

export async function getAllHooksTemplates(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    chainId,
    fetchPolicy,
    signerOrProvider,
    borrower,
    isRegisteredBorrower
  }: GetAllHooksTemplatesOptions
): Promise<HooksTemplate[]> {
  if (borrower === undefined && Signer.isSigner(signerOrProvider)) {
    borrower = await signerOrProvider.getAddress();
  }
  const result = await subgraphClient.query<
    SubgraphGetAllHooksTemplatesQuery,
    SubgraphGetAllHooksTemplatesQueryVariables
  >({
    query: GetAllHooksTemplatesDocument,
    fetchPolicy,
    variables: {
      borrower,
      includeBorrower: !!borrower
    }
  });
  return result.data.hooksTemplates
    .filter((t) => t.name === "OpenTermHooks" || t.name === "FixedTermHooks")
    .map((template) =>
      hooksTemplateFromSubgraph(
        chainId,
        signerOrProvider,
        template,
        borrower,
        result.data.registeredBorrowers?.[0]?.isRegistered ?? isRegisteredBorrower
      )
    );
}
