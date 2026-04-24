import type { Abi, Address } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "../abi";
import { getDeploymentAddress, getLatestLensDeploymentName, SupportedChainId } from "../constants";
import type {
  LenderAccountDataStructOutput,
  LenderAccountDataV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataV2_5StructOutput,
  MarketDataV2StructOutput,
  MarketDataWithLenderStatusStructOutput,
  MarketDataWithLenderStatusV2_5StructOutput,
  MarketDataWithLenderStatusV2StructOutput,
  MarketLenderStatusStructOutput,
  WithdrawalBatchDataStructOutput,
  WithdrawalBatchDataV2_5StructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusV2_5StructOutput
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

const getLatestLensTarget = (
  chainId: SupportedChainId
): { deploymentName: "MarketLensV2" | "MarketLensV2_5"; abi: Abi } => {
  const deploymentName = getLatestLensDeploymentName(chainId);
  return {
    deploymentName,
    abi: deploymentName === "MarketLensV2_5" ? (marketLensV2_5Abi as Abi) : (marketLensV2Abi as Abi)
  };
};

const readLatestMarketLens = <Result>(
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  functionName: string,
  args: readonly unknown[]
): Promise<Result> => {
  const { deploymentName, abi } = getLatestLensTarget(chainId);
  return readMarketLens<Result>(chainId, provider, deploymentName, abi, functionName, args);
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

export const getLegacyMarketLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  market: string
): Promise<MarketLenderStatusStructOutput> => {
  return readMarketLens<MarketLenderStatusStructOutput>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getMarketLenderStatus",
    [account as Address, market as Address]
  );
};

export const getLegacyMarketsLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  markets: string[]
): Promise<MarketLenderStatusStructOutput[]> => {
  return readMarketLens<MarketLenderStatusStructOutput[]>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getMarketsLenderStatus",
    [account as Address, markets as Address[]]
  );
};

export const getLatestLenderAccountData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  market: string
): Promise<LenderAccountDataStructOutput | LenderAccountDataV2_5StructOutput> => {
  return readLatestMarketLens<LenderAccountDataStructOutput | LenderAccountDataV2_5StructOutput>(
    chainId,
    provider,
    "getLenderAccountData",
    [account as Address, market as Address]
  );
};

export const getLatestLenderAccountsData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  markets: string[]
): Promise<Array<LenderAccountDataStructOutput | LenderAccountDataV2_5StructOutput>> => {
  return readLatestMarketLens<
    Array<LenderAccountDataStructOutput | LenderAccountDataV2_5StructOutput>
  >(chainId, provider, "getLenderAccountData", [account as Address, markets as Address[]]);
};

export const getLatestMarketDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  market: string
): Promise<
  MarketDataWithLenderStatusV2StructOutput | MarketDataWithLenderStatusV2_5StructOutput
> => {
  return readLatestMarketLens<
    MarketDataWithLenderStatusV2StructOutput | MarketDataWithLenderStatusV2_5StructOutput
  >(chainId, provider, "getMarketDataWithLenderStatus", [account as Address, market as Address]);
};

export const getLatestMarketsDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  markets: string[]
): Promise<
  Array<MarketDataWithLenderStatusV2StructOutput | MarketDataWithLenderStatusV2_5StructOutput>
> => {
  return readLatestMarketLens<
    Array<MarketDataWithLenderStatusV2StructOutput | MarketDataWithLenderStatusV2_5StructOutput>
  >(chainId, provider, "getMarketsDataWithLenderStatus", [
    account as Address,
    markets as Address[]
  ]);
};

export const getLegacyMarketDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  market: string
): Promise<MarketDataWithLenderStatusStructOutput> => {
  return readMarketLens<MarketDataWithLenderStatusStructOutput>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getMarketDataWithLenderStatus",
    [account as Address, market as Address]
  );
};

export const getLegacyMarketsDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  markets: string[]
): Promise<MarketDataWithLenderStatusStructOutput[]> => {
  return readMarketLens<MarketDataWithLenderStatusStructOutput[]>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getMarketsDataWithLenderStatus",
    [account as Address, markets as Address[]]
  );
};

export const getLegacyAllMarketsDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string
): Promise<MarketDataWithLenderStatusStructOutput[]> => {
  return readMarketLens<MarketDataWithLenderStatusStructOutput[]>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getAllMarketsDataWithLenderStatus",
    [account as Address]
  );
};

export const getLegacyPaginatedMarketsDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  start: number,
  count: number
): Promise<MarketDataWithLenderStatusStructOutput[]> => {
  return readMarketLens<MarketDataWithLenderStatusStructOutput[]>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getPaginatedMarketsDataWithLenderStatus",
    [account as Address, BigInt(start), BigInt(count)]
  );
};

export const getLatestWithdrawalBatchData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string,
  expiry: number
): Promise<WithdrawalBatchDataStructOutput | WithdrawalBatchDataV2_5StructOutput> => {
  return readLatestMarketLens<
    WithdrawalBatchDataStructOutput | WithdrawalBatchDataV2_5StructOutput
  >(chainId, provider, "getWithdrawalBatchData", [market as Address, expiry]);
};

export const getLegacyWithdrawalBatchData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string,
  expiry: number
): Promise<WithdrawalBatchDataStructOutput> => {
  return readMarketLens<WithdrawalBatchDataStructOutput>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getWithdrawalBatchData",
    [market as Address, expiry]
  );
};

export const getLatestWithdrawalBatchDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string,
  expiry: number,
  lender: string
): Promise<
  | WithdrawalBatchDataWithLenderStatusStructOutput
  | WithdrawalBatchDataWithLenderStatusV2_5StructOutput
> => {
  return readLatestMarketLens<
    | WithdrawalBatchDataWithLenderStatusStructOutput
    | WithdrawalBatchDataWithLenderStatusV2_5StructOutput
  >(chainId, provider, "getWithdrawalBatchDataWithLenderStatus", [
    market as Address,
    expiry,
    lender as Address
  ]);
};

export const getLegacyWithdrawalBatchDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string,
  expiry: number,
  lender: string
): Promise<WithdrawalBatchDataWithLenderStatusStructOutput> => {
  return readMarketLens<WithdrawalBatchDataWithLenderStatusStructOutput>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getWithdrawalBatchDataWithLenderStatus",
    [market as Address, expiry, lender as Address]
  );
};
