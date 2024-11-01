import { SupportedChainId } from "../constants";
import { SubgraphHooksTemplateDataFragment } from "../gql/graphql";
import { HooksTemplateDataStructOutput } from "../typechain";
import { SignerOrProvider } from "../types";
import { OpenTermHooksTemplate } from "./access-control";
import { FixedTermHooksTemplate } from "./fixed-term";

export * from "./access-control";
export * from "./fixed-term";
export * from "./validation";

export type HooksTemplate = OpenTermHooksTemplate | FixedTermHooksTemplate;

export function hooksTemplateFromSubgraph(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: SubgraphHooksTemplateDataFragment,
  signerAddress?: string,
  isRegisteredBorrower?: boolean
): HooksTemplate {
  if (data.name === "OpenTermHooks") {
    return OpenTermHooksTemplate.fromSubgraphData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else if (data.name === "FixedTermHooks") {
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
  if (data.name === "OpenTermHooks") {
    return OpenTermHooksTemplate.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else if (data.name === "FixedTermHooks") {
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
