import { SupportedChainId } from "../constants";
import {
  SubgraphHooksInstanceDataFragment,
  SubgraphHooksKind,
  SubgraphHooksTemplateDataFragment
} from "../gql/graphql";
import {
  HooksInstanceDataStructOutput,
  HooksInstanceDataV21StructOutput,
  HooksTemplateDataStructOutput
} from "../typechain";
import { SignerOrProvider } from "../types";
import { OpenTermHooks, OpenTermHooksTemplate } from "./access-control";
import { FixedTermHooks, FixedTermHooksTemplate } from "./fixed-term";
import { PeriodicTermHooks, PeriodicTermHooksTemplate } from "./periodic-term";

export * from "./access-control";
export * from "./fixed-term";
export * from "./periodic-term";
export * from "./validation";

export type HooksTemplate =
  | OpenTermHooksTemplate
  | FixedTermHooksTemplate
  | PeriodicTermHooksTemplate;

export type HooksInstance = OpenTermHooks | FixedTermHooks | PeriodicTermHooks;

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
  } else if (data.name === "PeriodicTermHooks") {
    return PeriodicTermHooksTemplate.fromSubgraphData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else {
    throw Error(`Unknown hooks template: ${data.name}`);
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
  } else if (data.name === "PeriodicTermHooks") {
    return PeriodicTermHooksTemplate.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else {
    throw Error(`Unknown hooks template: ${data.name}`);
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
  } else if (data.kind === SubgraphHooksKind.PeriodicTerm) {
    return PeriodicTermHooks.fromSubgraphData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else {
    throw Error(`Unknown hooks template: ${data.kind}`);
  }
}

export function hooksInstanceFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: HooksInstanceDataStructOutput | HooksInstanceDataV21StructOutput,
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
  } else if (data.kind === 3) {
    return PeriodicTermHooks.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower
    );
  } else {
    throw Error(`Unknown hooks template: ${data.kind}`);
  }
}
