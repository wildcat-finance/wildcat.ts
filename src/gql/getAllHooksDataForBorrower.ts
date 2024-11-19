import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllHooksDataForBorrowerDocument,
  SubgraphGetAllHooksDataForBorrowerQuery,
  SubgraphGetAllHooksDataForBorrowerQueryVariables,
  SubgraphHooksKind
} from "./graphql";
import { SupportedChainId } from "../constants";
import { Signer, SignerOrProvider } from "../types";
import {
  HooksInstance,
  HooksTemplate,
  hooksInstanceFromSubgraph,
  hooksTemplateFromSubgraph
} from "../access";
import { MarketController } from "../controller";

export type GetAllHooksDataForBorrowerOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  fetchPolicy: FetchPolicy;
  borrower: string;
};

export type GetAllHooksDataForBorrowerResult = {
  hooksTemplates: HooksTemplate[];
  hooksInstances: HooksInstance[];
  isRegisteredBorrower: boolean;
  controller?: MarketController;
};

export async function getAllHooksDataForBorrower(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { chainId, fetchPolicy, signerOrProvider, borrower }: GetAllHooksDataForBorrowerOptions
): Promise<GetAllHooksDataForBorrowerResult> {
  if (borrower === undefined && signerOrProvider instanceof Signer) {
    borrower = await signerOrProvider.getAddress();
  }
  const result = await subgraphClient.query<
    SubgraphGetAllHooksDataForBorrowerQuery,
    SubgraphGetAllHooksDataForBorrowerQueryVariables
  >({
    query: GetAllHooksDataForBorrowerDocument,
    fetchPolicy,
    variables: {
      borrower
    }
  });
  const isRegisteredBorrower = result.data.registeredBorrowers?.[0]?.isRegistered ?? false;
  const hooksTemplates = result.data.hooksTemplates
    .filter((t) => t.name === "OpenTermHooks" || t.name === "FixedTermHooks")
    .map((template) =>
      hooksTemplateFromSubgraph(chainId, signerOrProvider, template, borrower, isRegisteredBorrower)
    );
  const hooksInstances = result.data.hooksInstances
    .filter((i) => i.kind === SubgraphHooksKind.OpenTerm || i.kind === SubgraphHooksKind.FixedTerm)
    .map((instance) =>
      hooksInstanceFromSubgraph(chainId, signerOrProvider, instance, borrower, isRegisteredBorrower)
    );
  const controller =
    result.data.controllers.length > 0
      ? MarketController.fromSubgraphControllerData(
          chainId,
          signerOrProvider,
          result.data.controllers[0]
        )
      : undefined;
  return {
    hooksTemplates,
    hooksInstances,
    isRegisteredBorrower,
    controller
  };
}
