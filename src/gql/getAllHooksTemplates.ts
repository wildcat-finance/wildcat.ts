import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetAllHooksTemplatesDocument,
  SubgraphGetAllHooksTemplatesQuery,
  SubgraphGetAllHooksTemplatesQueryVariables
} from "./graphql";
import { SupportedChainId } from "../constants";
import { SignerOrProvider } from "../types";
import { HooksTemplate, hooksTemplateFromSubgraph } from "../access";
import { getEthersSignerAddress } from "../internal/ethers-signer";
import { HooksKind, parseHooksKind } from "../domain";
import { getSubgraphClientSchemaFamily } from "../config";
import {
  LegacyGetAllHooksTemplatesDocument,
  LegacyHooksTemplateData,
  normalizeLegacyHooksTemplateRegistrationData
} from "./legacy-subgraph";
import { hasRegisteredBorrowerAccountPrincipal } from "./borrower-eligibility";

export type GetAllHooksTemplatesOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  fetchPolicy: FetchPolicy;
  borrower?: string;
  isRegisteredBorrower?: boolean;
};

type LegacyGetAllHooksTemplatesData = {
  hooksTemplates: LegacyHooksTemplateData[];
  registeredBorrowers?: Array<{ isRegistered: boolean }>;
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
  const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
  const result = await subgraphClient.query<
    SubgraphGetAllHooksTemplatesQuery | LegacyGetAllHooksTemplatesData,
    SubgraphGetAllHooksTemplatesQueryVariables
  >({
    query: legacySchema ? LegacyGetAllHooksTemplatesDocument : GetAllHooksTemplatesDocument,
    fetchPolicy,
    variables: {
      borrower,
      includeBorrower: !!borrower
    }
  });
  const hooksTemplateRegistrations = legacySchema
    ? (result.data as LegacyGetAllHooksTemplatesData).hooksTemplates.map((template) =>
        normalizeLegacyHooksTemplateRegistrationData(chainId, template)
      )
    : (result.data as SubgraphGetAllHooksTemplatesQuery).hooksTemplateRegistrations;
  const indexedBorrowerEligibility =
    (result.data.registeredBorrowers?.[0]?.isRegistered ?? false) ||
    (!legacySchema &&
      hasRegisteredBorrowerAccountPrincipal(
        (result.data as SubgraphGetAllHooksTemplatesQuery).borrowerAccounts ?? []
      ));
  return hooksTemplateRegistrations
    .filter((registration) => parseHooksKind(registration.hooksTemplate.kind) !== HooksKind.Unknown)
    .map((template) =>
      hooksTemplateFromSubgraph(chainId, signerOrProvider, template, {
        signerAddress: borrower,
        isRegisteredBorrower: indexedBorrowerEligibility || isRegisteredBorrower
      })
    );
}
