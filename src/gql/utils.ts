import { LenderRole } from "../account";
import { HooksCredential } from "../types";
import { parseSubgraphLenderHooksAccess, parseSubgraphLenderStatus } from "../utils/type-parsers";
import {
  SubgraphV1LenderWithActiveMarketsFragment,
  SubgraphV2LenderWithActiveMarketsFragment
} from "./graphql";

export type PolicyLender = {
  address: string;
  addedTimestamp: number;
  /** For V2 markets - credentials on market hooks instance */
  credential?: HooksCredential;

  /** For V1 markets - whether lender has been manually approved on controller  */
  isAuthorizedOnController?: boolean;

  activeMarkets: Array<{
    address: string;
    name: string;
    role?: LenderRole;
    /** For V2 markets - whether lender has permanent withdrawal permissions */
    isKnownLender?: boolean;
  }>;
};

export function parsePolicyLender(
  data: SubgraphV1LenderWithActiveMarketsFragment | SubgraphV2LenderWithActiveMarketsFragment
): PolicyLender {
  if (data.__typename === "LenderAuthorization") {
    const { authorized, lender, marketAccounts } = data;
    return {
      address: lender,
      addedTimestamp: data.addedTimestamp,
      isAuthorizedOnController: authorized,
      activeMarkets: marketAccounts.map(({ market, role }) => ({
        address: market.id,
        name: market.name,
        role: parseSubgraphLenderStatus(role)
      }))
    };
  }

  const { marketAccounts, ...hooksAccess } = data;
  return {
    address: hooksAccess.lender,
    addedTimestamp: hooksAccess.addedTimestamp,
    credential: parseSubgraphLenderHooksAccess(hooksAccess),
    activeMarkets: marketAccounts.map(({ market, knownLenderStatus }) => ({
      address: market.id,
      name: market.name,
      isKnownLender: !!knownLenderStatus?.id
    }))
  };
}
