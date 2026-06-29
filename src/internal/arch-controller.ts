import type { Abi } from "viem";
import { wildcatArchControllerAbi } from "../abi";
import { getDeploymentAddress, SupportedChainId } from "../constants";
import type { SignerOrProvider } from "../types";
import { getViemPublicClientFromEthers } from "./ethers-viem";
import { readViemContract } from "./viem-read";

const getArchControllerAddress = (chainId: SupportedChainId): string => {
  return getDeploymentAddress(chainId, "WildcatArchController");
};

const readArchController = <Result>(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  functionName: string,
  args: readonly unknown[] = []
): Promise<Result> => {
  return readViemContract<Result>(
    getViemPublicClientFromEthers(provider),
    getArchControllerAddress(chainId),
    wildcatArchControllerAbi as Abi,
    functionName,
    args
  );
};

const toSafeNumber = (value: bigint): number => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Arch controller count exceeds JavaScript safe integer range");
  }
  return Number(value);
};

export const getRegisteredMarkets = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): Promise<string[]> => {
  return readArchController<string[]>(chainId, provider, "getRegisteredMarkets");
};

export const getRegisteredMarketsCount = async (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): Promise<number> => {
  const count = await readArchController<bigint>(chainId, provider, "getRegisteredMarketsCount");
  return toSafeNumber(count);
};

export const getRegisteredMarketsPage = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  start: number,
  end: number
): Promise<string[]> => {
  return readArchController<string[]>(chainId, provider, "getRegisteredMarkets", [
    BigInt(start),
    BigInt(end)
  ]);
};
