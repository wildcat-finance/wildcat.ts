import { SupportedChainId } from "../constants";
import { SubgraphHooksTemplateDataForMarketFragment } from "../gql/graphql";
import { HooksTemplateDataStructOutput } from "../typechain";
import { SignerOrProvider } from "../types";
import { AccessControlHooksTemplate } from "./access-control";
import { FixedTermHooksTemplate } from "./fixed-term";

export * from "./access-control";
export * from "./fixed-term";
export * from "./validation";

export type HooksTemplate = AccessControlHooksTemplate | FixedTermHooksTemplate;

export function hooksTemplateFromSubgraph(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: SubgraphHooksTemplateDataForMarketFragment,
  signerAddress?: string,
  isRegisteredBorrower?: boolean
): HooksTemplate {
  if (data.name === "SingleBorrowerAccessControlHooks") {
    return AccessControlHooksTemplate.fromSubgraphData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else if (data.name === "FixedTermLoanHooks") {
    return FixedTermHooksTemplate.fromSubgraphData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else {
    throw Error(`Unknown hooks template: ${name}`);
  }
}

export function hooksTemplateFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: HooksTemplateDataStructOutput,
  signerAddress?: string,
  isRegisteredBorrower?: boolean
): HooksTemplate {
  if (data.name === "SingleBorrowerAccessControlHooks") {
    return AccessControlHooksTemplate.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else if (data.name === "FixedTermLoanHooks") {
    return FixedTermHooksTemplate.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else {
    throw Error(`Unknown hooks template: ${name}`);
  }
}
