import type { Abi } from "viem";
import { hooksFactoryAbi, hooksFactoryV2_5Abi, hooksFactoryRevolvingV2_5Abi } from "../abi";
import { SupportedChainId } from "../config";
import { DeployableMarketKind } from "../domain";
import { DeployMarketStatus } from "./validation";
import { toNumber } from "../utils/bigint";
import type { Numeric } from "../lens-types";

// Sepolia template-update-v2.5.6.json. Existing instances of older templates retain
// their original behavior even when registered on the same V2.5.5 factories.
const repaymentFreezeTemplates = new Set([
  "0xbca425d384da256040779df532b6d2e8d3b3f1ad",
  "0xa3fe06137cc893e19c2e4764a4a7b001e988ba2b",
  "0x79da352868305d37d0179f460ded88886d4ee524"
]);

/** Whether the identified hook implementation freezes financial settings at repayment. */
export const supportsRepaymentParameterFreeze = (
  chainId: SupportedChainId,
  hooksTemplateAddress: string | undefined
): boolean =>
  chainId === SupportedChainId.Sepolia &&
  hooksTemplateAddress !== undefined &&
  repaymentFreezeTemplates.has(hooksTemplateAddress.toLowerCase());

/** ABI for the configured deployment target, not for arbitrary historical factories. */
export const getHooksFactoryDeploymentAbi = (
  chainId: SupportedChainId,
  marketKind: DeployableMarketKind = "standard"
): Abi => {
  if (chainId === SupportedChainId.Sepolia) {
    return marketKind === "standard" ? hooksFactoryV2_5Abi : hooksFactoryRevolvingV2_5Abi;
  }
  if (marketKind !== "standard") throw new Error("No revolving deployment target on this chain");
  return hooksFactoryAbi;
};

/** Core constructor rules; hooks can impose stricter bounds. Timestamp is in seconds. */
export const getRepaymentTermsStatus = (
  chainId: SupportedChainId,
  repaymentDate: number,
  repaymentPeriod: number,
  timestamp = Math.floor(Date.now() / 1000)
):
  | DeployMarketStatus.InvalidRepaymentTerms
  | DeployMarketStatus.RepaymentTermsUnsupported
  | undefined => {
  if (
    !Number.isSafeInteger(repaymentDate) ||
    !Number.isSafeInteger(repaymentPeriod) ||
    repaymentDate < 0 ||
    repaymentPeriod < 0 ||
    repaymentDate + repaymentPeriod > 0xffff_ffff ||
    (repaymentDate === 0 ? repaymentPeriod !== 0 : repaymentDate <= timestamp)
  )
    return DeployMarketStatus.InvalidRepaymentTerms;
  if (chainId !== SupportedChainId.Sepolia && (repaymentDate !== 0 || repaymentPeriod !== 0)) {
    return DeployMarketStatus.RepaymentTermsUnsupported;
  }
  return undefined;
};

/** Keep existing unscheduled deployment calls valid when the configured factory changes. */
export const withFactoryRepaymentTerms = (
  chainId: SupportedChainId,
  functionName: string,
  args: readonly unknown[]
): readonly unknown[] => {
  if (functionName !== "deployMarket" && functionName !== "deployMarketAndHooks") return args;
  const index = functionName === "deployMarket" ? 0 : 2;
  const parameters = args[index] as { repaymentDate?: Numeric; repaymentPeriod?: Numeric };
  const repaymentDate = toNumber(parameters.repaymentDate ?? 0);
  const repaymentPeriod = toNumber(parameters.repaymentPeriod ?? 0);
  const status = getRepaymentTermsStatus(chainId, repaymentDate, repaymentPeriod);
  if (status) throw new Error(`Cannot deploy market: ${status}`);
  return args.map((arg, i) =>
    i === index ? { ...parameters, repaymentDate, repaymentPeriod } : arg
  );
};
