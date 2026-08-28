import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetMarketsAndLendersByHooksInstanceOrControllerDocument,
  SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQuery,
  SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables
} from "./graphql";
import { SignerOrProvider } from "../types";
import { assert } from "../utils";
import { HooksInstance, hooksInstanceFromSubgraph } from "../access";
import { Market } from "../market";
import { parsePolicyLender, PolicyLender } from "./utils";
import { SupportedChainId } from "../constants";
import { MarketController } from "../controller";
import { getSubgraphClientSchemaFamily } from "../config";
import {
  LegacyGetMarketsAndLendersByHooksInstanceOrControllerDocument,
  LegacyHooksInstanceData,
  LegacyLenderHooksAccessData,
  LegacyMarketData,
  normalizeLegacyHooksInstanceData,
  normalizeLegacyLenderHooksAccessData,
  normalizeLegacyMarketData,
  toLegacyMarketFilter,
  toLegacyMarketOrder
} from "./legacy-subgraph";
import { getPolicyAccessListMembers, PolicyAccessListMember } from "./getPolicyAccessListMembers";

export type GetPolicyMarketsAndLendersOptions =
  SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables & {
    fetchPolicy: FetchPolicy;
    chainId: SupportedChainId;
    signerOrProvider: SignerOrProvider;
  };

export type PolicyMarketsAndLenders = {
  hooksInstance?: HooksInstance;
  markets: Market[];
  /** Current members of approved pull-based AccessList providers. */
  accessListMembers: PolicyAccessListMember[];
  /** Accounts with credential history on the hooks instance or controller. */
  lenders: PolicyLender[];
  controller?: MarketController;
};

type CurrentPolicyData = SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQuery;
type CurrentPolicyHooksInstance = NonNullable<CurrentPolicyData["hooksInstance"]>;
type CurrentPolicyController = NonNullable<CurrentPolicyData["controller"]>;
type LegacyPolicyHooksLender = Omit<CurrentPolicyHooksInstance["lenders"][number], "lastProvider"> &
  LegacyLenderHooksAccessData;
type LegacyPolicyData = {
  hooksInstance?:
    | (LegacyHooksInstanceData & {
        markets: LegacyMarketData[];
        lenders: LegacyPolicyHooksLender[];
      })
    | null;
  controller?:
    | (Omit<CurrentPolicyController, "markets"> & {
        markets: LegacyMarketData[];
      })
    | null;
};

export async function getPolicyMarketsAndLenders(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  {
    contractAddress,
    fetchPolicy,
    chainId,
    signerOrProvider,
    ...otherVariables
  }: GetPolicyMarketsAndLendersOptions
): Promise<PolicyMarketsAndLenders> {
  const legacySchema = getSubgraphClientSchemaFamily(subgraphClient) === "legacy-v2";
  const result = await subgraphClient.query<
    CurrentPolicyData | LegacyPolicyData,
    SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables
  >({
    query: legacySchema
      ? LegacyGetMarketsAndLendersByHooksInstanceOrControllerDocument
      : GetMarketsAndLendersByHooksInstanceOrControllerDocument,
    variables: {
      contractAddress,
      ...otherVariables,
      ...(legacySchema && otherVariables.marketFilter
        ? { marketFilter: toLegacyMarketFilter(otherVariables.marketFilter) }
        : {}),
      ...(legacySchema && otherVariables.orderMarkets
        ? { orderMarkets: toLegacyMarketOrder(otherVariables.orderMarkets) }
        : {})
    } as unknown as SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables,
    fetchPolicy
  });

  const data: CurrentPolicyData = legacySchema
    ? {
        __typename: "Query",
        hooksInstance: (result.data as LegacyPolicyData).hooksInstance
          ? ({
              ...normalizeLegacyHooksInstanceData(
                chainId,
                (result.data as LegacyPolicyData).hooksInstance!
              ),
              markets: (result.data as LegacyPolicyData).hooksInstance!.markets.map((market) =>
                normalizeLegacyMarketData(chainId, market)
              ),
              lenders: (result.data as LegacyPolicyData).hooksInstance!.lenders.map(
                normalizeLegacyLenderHooksAccessData
              )
            } as CurrentPolicyHooksInstance)
          : null,
        controller: (result.data as LegacyPolicyData).controller
          ? ({
              ...(result.data as LegacyPolicyData).controller!,
              markets: (result.data as LegacyPolicyData).controller!.markets.map((market) =>
                normalizeLegacyMarketData(chainId, market)
              )
            } as CurrentPolicyController)
          : null
      }
    : (result.data as CurrentPolicyData);

  if (data.controller) {
    const controller = data.controller;
    assert(
      controller !== undefined && controller !== null,
      "Controller not found in subgraph query"
    );
    const lenders = controller.authorizedLenders.map(parsePolicyLender);
    const markets = controller.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    );
    return {
      accessListMembers: [],
      lenders,
      markets,
      controller: MarketController.fromSubgraphControllerData(chainId, signerOrProvider, controller)
    };
  }

  const hooksInstance = data.hooksInstance;
  assert(
    hooksInstance !== undefined && hooksInstance !== null,
    "Hooks instance not found in subgraph query"
  );

  const lenders = hooksInstance.lenders.map(parsePolicyLender);
  const markets = hooksInstance.markets.map((market) =>
    Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
  );
  const normalizedHooksInstance = hooksInstanceFromSubgraph(
    chainId,
    signerOrProvider,
    hooksInstance
  );
  const accessListMembers = legacySchema
    ? []
    : await getPolicyAccessListMembers(subgraphClient, normalizedHooksInstance, { fetchPolicy });

  return {
    accessListMembers,
    lenders,
    markets,
    hooksInstance: normalizedHooksInstance
  };
}
