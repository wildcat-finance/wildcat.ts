import type { Abi, Address } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "../abi";
import { getDeploymentAddress, SupportedChainId } from "../constants";
import type {
  MarketDataStructOutput,
  MarketDataV2_5StructOutput,
  MarketDataV2StructOutput
} from "../typechain";
import type { SignerOrProvider } from "../types";
import { toEthersCompatibleStruct } from "./ethers-compat";
import { getViemPublicClientFromEthers } from "./ethers-viem";
import { readViemContract } from "./viem-read";

const readMarketLens = async <Result>(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  deploymentName: "MarketLens" | "MarketLensV2" | "MarketLensV2_5",
  abi: Abi,
  functionName: string,
  args: readonly unknown[]
): Promise<Result> => {
  const result = await readViemContract<unknown>(
    getViemPublicClientFromEthers(provider),
    getDeploymentAddress(chainId, deploymentName),
    abi,
    functionName,
    args
  );
  return toEthersCompatibleStruct<Result>(result);
};

export const getLegacyMarketData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string
): Promise<MarketDataStructOutput> => {
  return readMarketLens<MarketDataStructOutput>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getMarketData",
    [market as Address]
  );
};

export const getLegacyMarketsData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  markets: string[]
): Promise<MarketDataStructOutput[]> => {
  return readMarketLens<MarketDataStructOutput[]>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getMarketsData",
    [markets as Address[]]
  );
};

export const getV2MarketData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string
): Promise<MarketDataV2StructOutput> => {
  return readMarketLens<MarketDataV2StructOutput>(
    chainId,
    provider,
    "MarketLensV2",
    marketLensV2Abi as Abi,
    "getMarketData",
    [market as Address]
  );
};

export const getUnifiedMarketDataV2 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string
): Promise<MarketDataV2_5StructOutput> => {
  return readMarketLens<MarketDataV2_5StructOutput>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getMarketDataV2",
    [market as Address]
  );
};

export const getUnifiedMarketsDataV2 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  markets: string[]
): Promise<MarketDataV2_5StructOutput[]> => {
  return readMarketLens<MarketDataV2_5StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getMarketsDataV2",
    [markets as Address[]]
  );
};
