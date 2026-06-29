import type { Abi, Address, PublicClient } from "viem";

export const readViemContract = async <Result>(
  publicClient: PublicClient,
  address: string,
  abi: Abi,
  functionName: string,
  args: readonly unknown[] = []
): Promise<Result> => {
  return publicClient.readContract({
    address: address as Address,
    abi,
    functionName,
    args
  } as Parameters<PublicClient["readContract"]>[0]) as Promise<Result>;
};
