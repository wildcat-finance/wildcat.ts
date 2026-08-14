import type { Abi, Address } from "viem";
import { borrowerIdentityRegistryAbi, hooksFactoryAbi } from "../abi";
import { getViemPublicClientFromEthers } from "../internal/ethers-viem";
import { readViemContract } from "../internal/viem-read";
import { SignerOrProvider } from "../types";

export const getBorrowerIdentityRegistryForHooksFactory = (
  provider: SignerOrProvider,
  hooksFactory: string
): Promise<string> =>
  readViemContract<string>(
    getViemPublicClientFromEthers(provider),
    hooksFactory,
    hooksFactoryAbi as Abi,
    "borrowerIdentityRegistry"
  );

export const resolveBorrowerPrincipal = (
  provider: SignerOrProvider,
  borrowerIdentityRegistry: string,
  borrower: string
): Promise<string> =>
  readViemContract<string>(
    getViemPublicClientFromEthers(provider),
    borrowerIdentityRegistry,
    borrowerIdentityRegistryAbi as Abi,
    "resolveBorrower",
    [borrower as Address]
  );

export const resolveBorrowerPrincipalForHooksFactory = async (
  provider: SignerOrProvider,
  hooksFactory: string,
  borrower: string
): Promise<string> => {
  const registry = await getBorrowerIdentityRegistryForHooksFactory(provider, hooksFactory);
  return resolveBorrowerPrincipal(provider, registry, borrower);
};
