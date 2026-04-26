import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllHooksTemplatesDocument,
  SubgraphGetAllHooksTemplatesQuery,
  SubgraphGetAllHooksTemplatesQueryVariables
} from "./graphql";
import { isIndexedHooksFactory, SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { HooksTemplate, hooksTemplateFromSubgraph } from "../access";
import { getEthersSignerAddress } from "../internal/ethers-signer";

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
  if (borrower === undefined) {
    borrower = await getEthersSignerAddress(signerOrProvider);
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
  return result.data.factoryHooksTemplates
    .filter((t) => isIndexedHooksFactory(chainId, t.hooksFactory.id))
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
