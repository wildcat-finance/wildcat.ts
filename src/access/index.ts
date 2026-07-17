import {
  SupportedChainId,
  getArchControllerContract,
  getHooksFactoryAddress,
  getLatestLensDeploymentName
} from "../constants";
import { SubgraphHooksInstanceDataFragment } from "../gql/graphql";
import { HooksKind, HooksTemplateRegistrationMetadata, parseHooksKind } from "../domain";
import type { HooksInstanceDataStructOutput, HooksTemplateDataStructOutput } from "../lens-types";
import {
  getV2HooksDataForBorrower,
  getV2_5AggregatedHooksTemplatesForBorrowerWithFactory,
  getV2_5FactoryScopedHooksInstancesForBorrower
} from "../internal/market-lens";
import { SignerOrProvider } from "../types";
import { getEthersSignerAddress } from "../internal/ethers-signer";
import { toNumber } from "../utils/bigint";
import { OpenTermHooks, OpenTermHooksTemplate } from "./access-control";
import { FixedTermHooks, FixedTermHooksTemplate } from "./fixed-term";
import { PeriodicTermHooks, PeriodicTermHooksTemplate } from "./periodic-term";
import { normalizeSubgraphHooksTemplateData, SubgraphHooksTemplateLike } from "./subgraph-template";
import { HooksAccountContext, HooksLensReadContext } from "./context";

export * from "./access-control";
export * from "./context";
export * from "./fixed-term";
export * from "./periodic-term";
export * from "./revolving";
export * from "./validation";

export type HooksTemplate =
  | OpenTermHooksTemplate
  | FixedTermHooksTemplate
  | PeriodicTermHooksTemplate;

export type HooksInstance = OpenTermHooks | FixedTermHooks | PeriodicTermHooks;

export type BorrowerHooksDataResult = {
  hooksTemplates: HooksTemplate[];
  hooksInstances: HooksInstance[];
  isRegisteredBorrower: boolean;
};

export type GetBorrowerHooksDataOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  hooksTemplateRegistrations: readonly HooksTemplateRegistrationMetadata[];
  borrower?: string;
};

const hooksTemplateRegistrationKey = (hooksFactory: string, hooksTemplate: string): string =>
  `${hooksFactory.toLowerCase()}:${hooksTemplate.toLowerCase()}`;

export async function getBorrowerHooksData({
  chainId,
  signerOrProvider: provider,
  hooksTemplateRegistrations,
  borrower
}: GetBorrowerHooksDataOptions): Promise<BorrowerHooksDataResult> {
  if (borrower === undefined) {
    borrower = await getEthersSignerAddress(provider);
  }
  if (borrower === undefined) {
    throw Error("Borrower address is required");
  }
  const borrowerAddress = borrower;
  const registrationsByFactoryAndTemplate = new Map(
    hooksTemplateRegistrations.map((registration) => [
      hooksTemplateRegistrationKey(
        registration.hooksFactory.address,
        registration.hooksTemplate.address
      ),
      registration
    ])
  );
  const getRegistration = (hooksFactory: string, hooksTemplate: string) =>
    registrationsByFactoryAndTemplate.get(
      hooksTemplateRegistrationKey(hooksFactory, hooksTemplate)
    );

  if (getLatestLensDeploymentName(chainId) === "MarketLensV2_5") {
    const archController = getArchControllerContract(chainId, provider);
    const [factoryScopedTemplates, isRegisteredBorrower] = await Promise.all([
      getV2_5AggregatedHooksTemplatesForBorrowerWithFactory(chainId, provider, borrowerAddress),
      archController.isRegisteredBorrower(borrowerAddress)
    ]);
    const activeFactories = Array.from(
      new Map(
        factoryScopedTemplates.map(({ hooksFactory }) => [hooksFactory.toLowerCase(), hooksFactory])
      ).values()
    );
    const [factoryScopedInstances, factoryRegistrationEntries] = await Promise.all([
      Promise.all(
        activeFactories.map(async (hooksFactory) => ({
          hooksFactory,
          instances: await getV2_5FactoryScopedHooksInstancesForBorrower(
            chainId,
            provider,
            hooksFactory,
            borrowerAddress
          )
        }))
      ),
      Promise.all(
        activeFactories.map(
          async (hooksFactory) =>
            [
              hooksFactory.toLowerCase(),
              await archController.isRegisteredController(hooksFactory)
            ] as const
        )
      )
    ]);
    const isRegisteredHooksFactoryByAddress = new Map(factoryRegistrationEntries);
    const getLensContext = (hooksFactory: string, hooksTemplate: string): HooksLensReadContext => ({
      hooksFactory,
      signerAddress: borrowerAddress,
      isRegisteredBorrower,
      isRegisteredHooksFactory:
        isRegisteredHooksFactoryByAddress.get(hooksFactory.toLowerCase()) ?? false,
      registration: getRegistration(hooksFactory, hooksTemplate)
    });
    const hooksTemplates = factoryScopedTemplates.flatMap(({ hooksFactory, hooksTemplateData }) => {
      const registration = getRegistration(hooksFactory, hooksTemplateData.hooksTemplate);
      const kind = registration?.hooksTemplate.kind;
      return kind !== undefined && kind !== HooksKind.Unknown
        ? [
            hooksTemplateFromLens(
              chainId,
              provider,
              hooksTemplateData,
              kind,
              getLensContext(hooksFactory, hooksTemplateData.hooksTemplate)
            )
          ]
        : [];
    });
    const hooksTemplateDataByFactoryAndAddress = new Map(
      factoryScopedTemplates.map(({ hooksFactory, hooksTemplateData }) => [
        `${hooksFactory.toLowerCase()}:${hooksTemplateData.hooksTemplate.toLowerCase()}`,
        hooksTemplateData
      ])
    );

    const hooksInstancesByAddress = new Map<string, HooksInstance>();
    for (const { instances, hooksFactory } of factoryScopedInstances) {
      for (const instance of instances) {
        if (![1, 2, 3].includes(toNumber(instance.kind))) continue;
        const hooksInstance = hooksInstanceFromLens(
          chainId,
          provider,
          instance,
          getLensContext(hooksFactory, instance.hooksTemplate.hooksTemplate)
        );
        const hooksTemplateData = hooksTemplateDataByFactoryAndAddress.get(
          `${hooksFactory.toLowerCase()}:${hooksInstance.hooksTemplate.hooksTemplate.toLowerCase()}`
        );
        if (hooksTemplateData) {
          hooksInstance.hooksTemplate.updateWith(
            hooksTemplateData,
            getLensContext(hooksFactory, hooksTemplateData.hooksTemplate)
          );
        }
        hooksInstancesByAddress.set(hooksInstance.address.toLowerCase(), hooksInstance);
      }
    }

    return {
      hooksTemplates,
      hooksInstances: Array.from(hooksInstancesByAddress.values()),
      isRegisteredBorrower
    };
  }

  const hooksFactory = getHooksFactoryAddress(chainId, "standard");
  const [result, isRegisteredHooksFactory] = await Promise.all([
    getV2HooksDataForBorrower(chainId, provider, borrowerAddress),
    getArchControllerContract(chainId, provider).isRegisteredController(hooksFactory)
  ]);
  const getLensContext = (hooksTemplate: string): HooksLensReadContext => ({
    hooksFactory,
    signerAddress: borrowerAddress,
    isRegisteredBorrower: result.isRegisteredBorrower,
    isRegisteredHooksFactory,
    registration: getRegistration(hooksFactory, hooksTemplate)
  });

  const hooksTemplateDataByAddress = new Map(
    result.hooksTemplates.map((template) => [template.hooksTemplate.toLowerCase(), template])
  );
  const hooksInstances = result.hooksInstances.flatMap((instance) => {
    if (![1, 2, 3].includes(toNumber(instance.kind))) return [];
    const hooksInstance = hooksInstanceFromLens(
      chainId,
      provider,
      instance,
      getLensContext(instance.hooksTemplate.hooksTemplate)
    );
    const hooksTemplateData = hooksTemplateDataByAddress.get(
      hooksInstance.hooksTemplate.hooksTemplate.toLowerCase()
    );
    if (hooksTemplateData) {
      hooksInstance.hooksTemplate.updateWith(
        hooksTemplateData,
        getLensContext(hooksTemplateData.hooksTemplate)
      );
    }
    return [hooksInstance];
  });

  return {
    hooksTemplates: result.hooksTemplates.flatMap((template) => {
      const registration = getRegistration(hooksFactory, template.hooksTemplate);
      const kind = registration?.hooksTemplate.kind;
      return kind !== undefined && kind !== HooksKind.Unknown
        ? [
            hooksTemplateFromLens(
              chainId,
              provider,
              template,
              kind,
              getLensContext(template.hooksTemplate)
            )
          ]
        : [];
    }),
    hooksInstances,
    isRegisteredBorrower: result.isRegisteredBorrower
  };
}

export function hooksTemplateFromSubgraph(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: SubgraphHooksTemplateLike,
  context: HooksAccountContext = {}
): HooksTemplate {
  const kind = normalizeSubgraphHooksTemplateData(data).kind;
  if (kind === HooksKind.OpenTerm) {
    return OpenTermHooksTemplate.fromSubgraphData(chainId, provider, data, context);
  } else if (kind === HooksKind.FixedTerm) {
    return FixedTermHooksTemplate.fromSubgraphData(chainId, provider, data, context);
  } else if (kind === HooksKind.PeriodicTerm) {
    return PeriodicTermHooksTemplate.fromSubgraphData(chainId, provider, data, context);
  } else {
    throw Error(`Unknown hooks template kind: ${data.hooksTemplate.kind}`);
  }
}

export function hooksTemplateFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: HooksTemplateDataStructOutput,
  kind: Exclude<HooksKind, HooksKind.Unknown>,
  context: HooksLensReadContext
): HooksTemplate {
  if (kind === HooksKind.OpenTerm) {
    return OpenTermHooksTemplate.fromLensData(chainId, provider, data, context);
  } else if (kind === HooksKind.FixedTerm) {
    return FixedTermHooksTemplate.fromLensData(chainId, provider, data, context);
  } else {
    return PeriodicTermHooksTemplate.fromLensData(chainId, provider, data, context);
  }
}

export function hooksInstanceFromSubgraph(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: SubgraphHooksInstanceDataFragment,
  context: HooksAccountContext = {}
): HooksInstance {
  const kind = parseHooksKind(data.kind);
  if (kind === HooksKind.OpenTerm) {
    return OpenTermHooks.fromSubgraphData(chainId, provider, data, context);
  } else if (kind === HooksKind.FixedTerm) {
    return FixedTermHooks.fromSubgraphData(chainId, provider, data, context);
  } else if (kind === HooksKind.PeriodicTerm) {
    return PeriodicTermHooks.fromSubgraphData(chainId, provider, data, context);
  } else {
    throw Error(`Unknown hooks template: ${data.kind}`);
  }
}

export function hooksInstanceFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: HooksInstanceDataStructOutput,
  context: HooksLensReadContext
): HooksInstance {
  const kind = toNumber(data.kind);
  if (kind === 1) {
    return OpenTermHooks.fromLensData(chainId, provider, data, context);
  } else if (kind === 2) {
    return FixedTermHooks.fromLensData(chainId, provider, data, context);
  } else if (kind === 3) {
    return PeriodicTermHooks.fromLensData(chainId, provider, data, context);
  } else {
    throw Error(`Unknown hooks template: ${data.kind}`);
  }
}
