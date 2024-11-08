import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { GetMarketsAndLendersByHooksInstanceOrControllerDocument } from "./graphql";
import { SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables } from "./graphql";
import { SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQuery } from "./graphql";
import { SignerOrProvider } from "../types";
import { assert } from "../utils";
import { HooksInstance, hooksInstanceFromSubgraph } from "../access";
import { Market } from "../market";
import { parsePolicyLender, PolicyLender } from "./utils";
import { SupportedChainId } from "../constants";

export type GetPolicyMarketsAndLendersOptions =
  SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables & {
    fetchPolicy: FetchPolicy;
    chainId: SupportedChainId;
    signerOrProvider: SignerOrProvider;
  };

export type PolicyMarketsAndLenders = {
  hooksInstance?: HooksInstance;
  markets: Market[];
  lenders: PolicyLender[];
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
  const result = await subgraphClient.query<
    SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQuery,
    SubgraphGetMarketsAndLendersByHooksInstanceOrControllerQueryVariables
  >({
    query: GetMarketsAndLendersByHooksInstanceOrControllerDocument,
    variables: {
      contractAddress,
      ...otherVariables
    },
    fetchPolicy
  });

  if (result.data.controller) {
    const controller = result.data.controller;
    assert(
      controller !== undefined && controller !== null,
      "Controller not found in subgraph query"
    );
    const lenders = controller.authorizedLenders.map(parsePolicyLender);
    const markets = controller.markets.map((market) =>
      Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
    );
    return {
      lenders,
      markets
    };
  }

  const hooksInstance = result.data.hooksInstance;
  assert(
    hooksInstance !== undefined && hooksInstance !== null,
    "Hooks instance not found in subgraph query"
  );

  const lenders = hooksInstance.lenders.map(parsePolicyLender);
  const markets = hooksInstance.markets.map((market) =>
    Market.fromSubgraphMarketData(chainId, signerOrProvider, market)
  );

  return {
    lenders,
    markets,
    hooksInstance: hooksInstanceFromSubgraph(chainId, signerOrProvider, hooksInstance)
  };
}
