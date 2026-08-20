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
import { getSubgraphClientSchemaFamily } from "../config";
import {
  LegacyGetAllHooksDataForBorrowerDocument,
  LegacyHooksInstanceData,
  LegacyHooksTemplateData,
  normalizeLegacyHooksInstanceData,
  normalizeLegacyHooksTemplateRegistrationData
} from "./legacy-subgraph";
import { hasRegisteredBorrowerAccountPrincipal } from "./borrower-eligibility";

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

type LegacyGetAllHooksDataForBorrowerData = {
  hooksTemplates: LegacyHooksTemplateData[];
  hooksInstances: LegacyHooksInstanceData[];
  registeredBorrowers?: Array<{ isRegistered: boolean }>;
  controllers: SubgraphGetAllHooksDataForBorrowerQuery["controllers"];
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
  const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
  const result = await subgraphClient.query<
    SubgraphGetAllHooksDataForBorrowerQuery | LegacyGetAllHooksDataForBorrowerData,
    SubgraphGetAllHooksDataForBorrowerQueryVariables
  >({
    query: legacySchema
      ? LegacyGetAllHooksDataForBorrowerDocument
      : GetAllHooksDataForBorrowerDocument,
    fetchPolicy,
    variables: {
      borrower
    }
  });
  const isRegisteredBorrower =
    (result.data.registeredBorrowers?.[0]?.isRegistered ?? false) ||
    (!legacySchema &&
      hasRegisteredBorrowerAccountPrincipal(
        (result.data as SubgraphGetAllHooksDataForBorrowerQuery).borrowerAccounts ?? []
      ));
  const hooksTemplateRegistrations = legacySchema
    ? (result.data as LegacyGetAllHooksDataForBorrowerData).hooksTemplates.map((template) =>
        normalizeLegacyHooksTemplateRegistrationData(chainId, template)
      )
    : (result.data as SubgraphGetAllHooksDataForBorrowerQuery).hooksTemplateRegistrations;
  const subgraphHooksInstances = legacySchema
    ? (result.data as LegacyGetAllHooksDataForBorrowerData).hooksInstances.map((instance) =>
        normalizeLegacyHooksInstanceData(chainId, instance)
      )
    : (result.data as SubgraphGetAllHooksDataForBorrowerQuery).hooksInstances;
  const hooksTemplates = hooksTemplateRegistrations
    .filter((registration) => parseHooksKind(registration.hooksTemplate.kind) !== HooksKind.Unknown)
    .map((template) =>
      hooksTemplateFromSubgraph(chainId, signerOrProvider, template, {
        signerAddress: borrower,
        isRegisteredBorrower
      })
    );
  const hooksInstances = subgraphHooksInstances
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
