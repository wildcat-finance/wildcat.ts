import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { GetLendersByHooksInstanceOrControllerDocument } from "./graphql";
import { SubgraphGetLendersByHooksInstanceOrControllerQueryVariables } from "./graphql";
import { SubgraphGetLendersByHooksInstanceOrControllerQuery } from "./graphql";
import { assert } from "../utils";
import { parsePolicyLender, PolicyLender } from "./utils";

export type GetPolicyLendersOptions =
  SubgraphGetLendersByHooksInstanceOrControllerQueryVariables & {
    fetchPolicy: FetchPolicy;
  };

export async function getPolicyLenders(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { contractAddress, isController, fetchPolicy, ...otherVariables }: GetPolicyLendersOptions
): Promise<PolicyLender[]> {
  const result = await subgraphClient.query<
    SubgraphGetLendersByHooksInstanceOrControllerQuery,
    SubgraphGetLendersByHooksInstanceOrControllerQueryVariables
  >({
    query: GetLendersByHooksInstanceOrControllerDocument,
    variables: {
      contractAddress,
      isController,
      ...otherVariables
    },
    fetchPolicy
  });

  if (isController) {
    const controller = result.data.controller;
    assert(
      controller !== undefined && controller !== null,
      "Controller not found in subgraph query"
    );
    return controller.authorizedLenders.map(parsePolicyLender);
  }

  const hooksInstance = result.data.hooksInstance;
  assert(
    hooksInstance !== undefined && hooksInstance !== null,
    "Hooks instance not found in subgraph query"
  );

  return hooksInstance.lenders.map(parsePolicyLender);
}
