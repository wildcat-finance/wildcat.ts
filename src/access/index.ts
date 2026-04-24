import {
  SupportedChainId,
  getHooksFactoryAddressForMarketType,
  getLatestLensDeploymentName,
  hasHooksFactoryDeployment
} from "../constants";
import {
  SubgraphHooksInstanceDataFragment,
  SubgraphHooksKind,
  SubgraphHooksTemplateDataFragment
} from "../gql/graphql";
import { HooksInstanceDataStructOutput, HooksTemplateDataStructOutput } from "../typechain";
import {
  getV2HooksDataForBorrower,
  getV2_5FactoryScopedHooksDataForBorrower
} from "../internal/market-lens";
import { MarketTypes, Signer, SignerOrProvider } from "../types";
import { OpenTermHooks, OpenTermHooksTemplate } from "./access-control";
import { FixedTermHooks, FixedTermHooksTemplate } from "./fixed-term";

export * from "./access-control";
export * from "./fixed-term";
export * from "./revolving";
export * from "./validation";

export type HooksTemplate = OpenTermHooksTemplate | FixedTermHooksTemplate;

export type HooksInstance = OpenTermHooks | FixedTermHooks;

export type BorrowerHooksDataResult = {
  hooksTemplates: HooksTemplate[];
  hooksInstances: HooksInstance[];
  isRegisteredBorrower: boolean;
};

export async function getBorrowerHooksData(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  borrower?: string
): Promise<BorrowerHooksDataResult> {
  if (borrower === undefined && Signer.isSigner(provider)) {
    borrower = await provider.getAddress();
  }
  if (borrower === undefined) {
    throw Error("Borrower address is required");
  }
  const borrowerAddress = borrower;

  if (getLatestLensDeploymentName(chainId) === "MarketLensV2_5") {
    const factoryScopedResults = await Promise.all(
      MarketTypes.filter((marketType) => hasHooksFactoryDeployment(chainId, marketType)).map(
        async (marketType) => {
          const hooksFactory = getHooksFactoryAddressForMarketType(chainId, marketType);
          const data = await getV2_5FactoryScopedHooksDataForBorrower(
            chainId,
            provider,
            hooksFactory,
            borrowerAddress
          );
          return { data, hooksFactory };
        }
      )
    );

    const hooksInstancesByAddress = new Map<string, HooksInstance>();
    for (const { data, hooksFactory } of factoryScopedResults) {
      const hooksTemplateDataByAddress = new Map(
        data.hooksTemplates.map((template) => [template.hooksTemplate.toLowerCase(), template])
      );
      for (const instance of data.hooksInstances) {
        const hooksInstance = hooksInstanceFromLens(
          chainId,
          provider,
          instance,
          borrowerAddress,
          data.isRegisteredBorrower,
          hooksFactory
        );
        const hooksTemplateData = hooksTemplateDataByAddress.get(
          hooksInstance.hooksTemplate.hooksTemplate.toLowerCase()
        );
        if (hooksTemplateData) {
          hooksInstance.hooksTemplate.updateWith(
            hooksTemplateData,
            borrowerAddress,
            data.isRegisteredBorrower,
            hooksFactory
          );
        }
        hooksInstancesByAddress.set(hooksInstance.address.toLowerCase(), hooksInstance);
      }
    }

    return {
      hooksTemplates: factoryScopedResults.flatMap(({ data, hooksFactory }) =>
        data.hooksTemplates.map((template) =>
          hooksTemplateFromLens(
            chainId,
            provider,
            template,
            borrowerAddress,
            data.isRegisteredBorrower,
            hooksFactory
          )
        )
      ),
      hooksInstances: Array.from(hooksInstancesByAddress.values()),
      isRegisteredBorrower: factoryScopedResults.some(({ data }) => data.isRegisteredBorrower)
    };
  }

  const result = await getV2HooksDataForBorrower(chainId, provider, borrowerAddress);

  const hooksTemplateDataByAddress = new Map(
    result.hooksTemplates.map((template) => [template.hooksTemplate.toLowerCase(), template])
  );
  const hooksInstances = result.hooksInstances.map((instance) => {
    const hooksInstance = hooksInstanceFromLens(
      chainId,
      provider,
      instance,
      borrowerAddress,
      result.isRegisteredBorrower
    );
    const hooksTemplateData = hooksTemplateDataByAddress.get(
      hooksInstance.hooksTemplate.hooksTemplate.toLowerCase()
    );
    if (hooksTemplateData) {
      hooksInstance.hooksTemplate.updateWith(
        hooksTemplateData,
        borrowerAddress,
        result.isRegisteredBorrower
      );
    }
    return hooksInstance;
  });

  return {
    hooksTemplates: result.hooksTemplates.map((template) =>
      hooksTemplateFromLens(
        chainId,
        provider,
        template,
        borrowerAddress,
        result.isRegisteredBorrower
      )
    ),
    hooksInstances,
    isRegisteredBorrower: result.isRegisteredBorrower
  };
}

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
  isRegisteredBorrower?: boolean,
  hooksFactory?: string
): HooksTemplate {
  if (data.name === "OpenTermHooks") {
    return OpenTermHooksTemplate.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower,
      hooksFactory
    );
  } else if (data.name === "FixedTermHooks") {
    return FixedTermHooksTemplate.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower,
      hooksFactory
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
    throw Error(`Unknown hooks template: ${data.kind}`);
  }
}

export function hooksInstanceFromLens(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  data: HooksInstanceDataStructOutput,
  signerAddress?: string,
  isRegisteredBorrower?: boolean,
  hooksFactory?: string
): HooksInstance {
  if (data.kind === 1) {
    return OpenTermHooks.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower,
      hooksFactory
    );
  } else if (data.kind === 2) {
    return FixedTermHooks.fromLensData(
      chainId,
      provider,
      data,
      signerAddress,
      isRegisteredBorrower,
      hooksFactory
    );
  } else {
    throw Error(`Unknown hooks template: ${data.kind}`);
  }
}
