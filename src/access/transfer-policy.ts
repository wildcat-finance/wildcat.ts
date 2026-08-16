import type { Abi, Address } from "viem";
import { iOpenTermHooksAbi } from "../abi";
import { getViemPublicClientFromEthers } from "../internal/ethers-viem";
import { readViemContract } from "../internal/viem-read";
import type { SignerOrProvider } from "../types";

/**
 * Read the hook's current recipient-side transfer policy. Ordinary policy
 * denial returns false. An unavailable or incompatible hook read rejects.
 */
export const readMarketTransferRecipientAllowed = (
  provider: SignerOrProvider,
  hooksAddress: string,
  marketAddress: string,
  recipient: string
): Promise<boolean> => {
  return readViemContract<boolean>(
    getViemPublicClientFromEthers(provider),
    hooksAddress,
    iOpenTermHooksAbi as Abi,
    "isMarketTransferRecipientAllowed",
    [marketAddress as Address, recipient as Address]
  );
};
