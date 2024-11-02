import { SupportedChainId } from "../constants";
import {
  SubgraphHooksInstanceDataFragment,
  SubgraphHooksKind,
  SubgraphHooksTemplateDataFragment
} from "../gql/graphql";
import { HooksInstanceDataStructOutput, HooksTemplateDataStructOutput } from "../typechain";
import { HooksKind, SignerOrProvider } from "../types";
import { OpenTermHooks, OpenTermHooksTemplate } from "./access-control";
import { FixedTermHooks, FixedTermHooksTemplate } from "./fixed-term";

export * from "./access-control";
export * from "./fixed-term";
export * from "./validation";

export type HooksTemplate = OpenTermHooksTemplate | FixedTermHooksTemplate;

export type HooksInstance = OpenTermHooks | FixedTermHooks;

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

export function hooksInstanceFromSubgraph(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: SubgraphHooksInstanceDataFragment,
  signerAddress?: string,
  isRegisteredBorrower?: boolean
): HooksInstance {
  if (data.kind === SubgraphHooksKind.OpenTerm) {
    return OpenTermHooks.fromSubgraphData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else if (data.kind === SubgraphHooksKind.FixedTerm) {
    return FixedTermHooks.fromSubgraphData(
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

export function hooksInstanceFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: HooksInstanceDataStructOutput,
  signerAddress?: string,
  isRegisteredBorrower?: boolean
): HooksInstance {
  if (data.kind === 1) {
    return OpenTermHooks.fromLensData(chainId, provider, data, signerAddress, isRegisteredBorrower);
  } else if (data.kind === 2) {
    return FixedTermHooks.fromLensData(
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
