import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllHooksDataForBorrowerDocument,
  SubgraphGetAllHooksDataForBorrowerQuery,
  SubgraphGetAllHooksDataForBorrowerQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import {
  HooksInstance,
  HooksTemplate,
  hooksInstanceFromSubgraph,
  hooksTemplateFromSubgraph
} from "../access";
import { MarketController } from "../controller";
import { getEthersSignerAddress } from "../internal/ethers-signer";
import { HooksKind, parseHooksKind } from "../domain";

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
  if (borrower === undefined) {
    const signerAddress = await getEthersSignerAddress(signerOrProvider);
    if (signerAddress !== undefined) {
      borrower = signerAddress;
    }
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
  const hooksTemplates = result.data.hooksTemplateRegistrations
    .filter((registration) => parseHooksKind(registration.hooksTemplate.kind) !== HooksKind.Unknown)
    .map((template) =>
      hooksTemplateFromSubgraph(chainId, signerOrProvider, template, {
        signerAddress: borrower,
        isRegisteredBorrower
      })
    );
  const hooksInstances = result.data.hooksInstances
    .filter((instance) => parseHooksKind(instance.kind) !== HooksKind.Unknown)
    .map((instance) =>
      hooksInstanceFromSubgraph(chainId, signerOrProvider, instance, {
        signerAddress: borrower,
        isRegisteredBorrower
      })
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
