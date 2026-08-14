import type { Address, PublicClient } from "viem";
import { iOpenTermHooksAbi } from "../abi";
import { prepareAddAccessListMembers } from "../authority/actions";
import type { PartialTransaction } from "../types";

export type StoredLenderStatus = {
  isBlockedFromDeposits: boolean;
  lastProvider: Address;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
};

export type LenderRestorationHooks = {
  address: string;
  populateUnblockLender: (lender: string) => PartialTransaction;
};

export type LenderRestorationPlan = {
  blockNumber: bigint;
  blockTimestamp: number;
  blockedLenders: string[];
  transactions: PartialTransaction[];
};

const readStoredLenderStatus = async (
  publicClient: PublicClient,
  hooksAddress: string,
  lender: string,
  blockNumber: bigint
): Promise<StoredLenderStatus> => {
  return publicClient.readContract({
    address: hooksAddress as Address,
    abi: iOpenTermHooksAbi,
    functionName: "getPreviousLenderStatus",
    args: [lender as Address],
    blockNumber
  }) as Promise<StoredLenderStatus>;
};

/**
 * Builds the ordered transactions required to restore lenders on existing hooks:
 * update the selected access list first, then clear each independent hook-local
 * deposit block. The hook resolves the pull credential when the lender next acts.
 */
export const prepareLenderRestoration = async (
  publicClient: PublicClient,
  hooks: LenderRestorationHooks,
  provider: string,
  lenders: string[]
): Promise<LenderRestorationPlan> => {
  if (lenders.length === 0) {
    throw new Error("At least one lender is required");
  }

  const block = await publicClient.getBlock();
  const statuses = await Promise.all(
    lenders.map((lender) =>
      readStoredLenderStatus(publicClient, hooks.address, lender, block.number)
    )
  );
  const blockedLenders = lenders.filter((_, index) => statuses[index].isBlockedFromDeposits);

  return {
    blockNumber: block.number,
    blockTimestamp: Number(block.timestamp),
    blockedLenders,
    transactions: [
      prepareAddAccessListMembers(provider, lenders),
      ...blockedLenders.map((lender) => hooks.populateUnblockLender(lender))
    ]
  };
};
