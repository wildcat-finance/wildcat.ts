import type { Address, PublicClient } from "viem";
import { iOpenTermHooksAbi } from "../abi";
import type { AddLenderInput, PartialTransaction, TimestampedAddLenderInput } from "../types";
import { toNumber } from "../utils";

export type StoredLenderStatus = {
  isBlockedFromDeposits: boolean;
  lastProvider: Address;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
};

export type LenderRestorationHooks = {
  address: string;
  populateAddLenders: (inputs: TimestampedAddLenderInput[]) => PartialTransaction;
  populateUnblockLender: (lender: string) => PartialTransaction;
};

export type LenderRestorationPlan = {
  blockNumber: bigint;
  blockTimestamp: number;
  blockedLenders: string[];
  transactions: PartialTransaction[];
};

const validateCredentialTimestamp = (credentialTimestamp: number): number => {
  if (
    !Number.isInteger(credentialTimestamp) ||
    credentialTimestamp <= 0 ||
    credentialTimestamp > 0xffffffff
  ) {
    throw new Error("credentialTimestamp must be a non-zero uint32");
  }
  return credentialTimestamp;
};

export const getCredentialTimestamps = (inputs: TimestampedAddLenderInput[]): number[] => {
  return inputs.map(({ credentialTimestamp }) => validateCredentialTimestamp(credentialTimestamp));
};

export const timestampAddLenderInputs = async (
  publicClient: PublicClient,
  inputs: AddLenderInput[]
): Promise<TimestampedAddLenderInput[]> => {
  const requiresBlockTimestamp = inputs.some(({ credentialTimestamp }) => {
    return credentialTimestamp === undefined;
  });
  const blockTimestamp = requiresBlockTimestamp
    ? toNumber((await publicClient.getBlock()).timestamp)
    : undefined;

  return inputs.map((input) => ({
    ...input,
    credentialTimestamp: validateCredentialTimestamp(
      input.credentialTimestamp ?? (blockTimestamp as number)
    )
  }));
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
 * grant credentials first, then clear the independent deposit block where set.
 */
export const prepareLenderRestoration = async (
  publicClient: PublicClient,
  hooks: LenderRestorationHooks,
  inputs: AddLenderInput[]
): Promise<LenderRestorationPlan> => {
  if (inputs.length === 0) {
    throw new Error("At least one lender is required");
  }

  const block = await publicClient.getBlock();
  const blockTimestamp = toNumber(block.timestamp);
  const timestampedInputs = inputs.map((input) => ({
    ...input,
    credentialTimestamp: validateCredentialTimestamp(input.credentialTimestamp ?? blockTimestamp)
  }));
  const statuses = await Promise.all(
    inputs.map(({ lender }) =>
      readStoredLenderStatus(publicClient, hooks.address, lender, block.number)
    )
  );
  const blockedLenders = inputs
    .filter((_, index) => statuses[index].isBlockedFromDeposits)
    .map(({ lender }) => lender);

  return {
    blockNumber: block.number,
    blockTimestamp,
    blockedLenders,
    transactions: [
      hooks.populateAddLenders(timestampedInputs),
      ...blockedLenders.map((lender) => hooks.populateUnblockLender(lender))
    ]
  };
};
