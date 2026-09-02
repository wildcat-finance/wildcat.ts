import type { Abi, Address } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "../abi";
import { getDeploymentAddress, getLatestLensDeploymentName, SupportedChainId } from "../constants";
import type {
  ControllerDataStructOutput,
  FactoryScopedHooksTemplateDataV2_5StructOutput,
  HooksDataForBorrowerStructOutput,
  HooksDataForBorrowerV2_5StructOutput,
  HooksInstanceDataV2_5StructOutput,
  FullMarketDataWithLenderStatusV2_5StructOutput,
  LenderAccountDataStructOutput,
  LenderAccountDataV2_5StructOutput,
  MarketDataStructOutput,
  MarketDataBaseV2_5StructOutput,
  MarketDataV2_5StructOutput,
  MarketDataV2StructOutput,
  MarketDataWithLenderStatusStructOutput,
  MarketDataWithLenderStatusV2_5StructOutput,
  MarketDataWithLenderStatusV2StructOutput,
  MarketLiveDataV2_5StructOutput,
  MarketLiveDataWithLenderStatusV2_5StructOutput,
  MarketLenderStatusStructOutput,
  WithdrawalBatchDataStructOutput,
  WithdrawalBatchDataV2_5StructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusV2_5StructOutput
} from "../lens-types";
import type { SignerOrProvider } from "../types";
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
  return readViemContract<Result>(
    getViemPublicClientFromEthers(provider),
    getDeploymentAddress(chainId, deploymentName),
    abi,
    functionName,
    args
  );
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

const getCompatibleMarketDataV2_5 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  market: string
): Promise<MarketDataBaseV2_5StructOutput> => {
  return readMarketLens<MarketDataBaseV2_5StructOutput>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getMarketData",
    [market as Address]
  );
};

const getCompatibleMarketsDataV2_5 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  markets: string[]
): Promise<MarketDataBaseV2_5StructOutput[]> => {
  return readMarketLens<MarketDataBaseV2_5StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getMarketsData",
    [markets as Address[]]
  );
};

const withLenderStatusV2_5 = (
  market: MarketDataBaseV2_5StructOutput | MarketDataV2_5StructOutput,
  lenderStatus: LenderAccountDataV2_5StructOutput
): MarketDataWithLenderStatusV2_5StructOutput | FullMarketDataWithLenderStatusV2_5StructOutput => {
  if ("market" in market) {
    return { market, lenderStatus };
  }
  return { market, lenderStatus };
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

export const getLegacyControllerDataForBorrower = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  borrower: string
): Promise<ControllerDataStructOutput> => {
  return readMarketLens<ControllerDataStructOutput>(
    chainId,
    provider,
    "MarketLens",
    marketLensAbi as Abi,
    "getControllerDataForBorrower",
    [borrower as Address]
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

export const getV2MarketsData = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  markets: string[]
): Promise<MarketDataV2StructOutput[]> => {
  return readMarketLens<MarketDataV2StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2",
    marketLensV2Abi as Abi,
    "getMarketsData",
    [markets as Address[]]
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

export const getUnifiedMarketsLiveDataV2 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  markets: string[]
): Promise<MarketLiveDataV2_5StructOutput[]> => {
  return readMarketLens<MarketLiveDataV2_5StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getMarketsLiveDataV2",
    [markets as Address[]]
  );
};

export const getUnifiedMarketsLiveDataWithLenderStatusV2 = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  markets: string[]
): Promise<MarketLiveDataWithLenderStatusV2_5StructOutput[]> => {
  return readMarketLens<MarketLiveDataWithLenderStatusV2_5StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getMarketsLiveDataWithLenderStatusV2",
    [account as Address, markets as Address[]]
  );
};

export const getV2HooksDataForBorrower = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  borrower: string
): Promise<HooksDataForBorrowerStructOutput> => {
  return readMarketLens<HooksDataForBorrowerStructOutput>(
    chainId,
    provider,
    "MarketLensV2",
    marketLensV2Abi as Abi,
    "getHooksDataForBorrower",
    [borrower as Address]
  );
};

export const getV2_5FactoryScopedHooksDataForBorrower = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  hooksFactory: string,
  borrower: string
): Promise<HooksDataForBorrowerV2_5StructOutput> => {
  return readMarketLens<HooksDataForBorrowerV2_5StructOutput>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getHooksDataForBorrower",
    [hooksFactory as Address, borrower as Address]
  );
};

export const getV2_5AggregatedHooksTemplatesForBorrowerWithFactory = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  borrower: string
): Promise<FactoryScopedHooksTemplateDataV2_5StructOutput[]> => {
  return readMarketLens<FactoryScopedHooksTemplateDataV2_5StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getAggregatedHooksTemplatesForBorrowerWithFactory",
    [borrower as Address]
  );
};

export const getV2_5FactoryScopedHooksInstancesForBorrower = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  hooksFactory: string,
  borrower: string
): Promise<HooksInstanceDataV2_5StructOutput[]> => {
  return readMarketLens<HooksInstanceDataV2_5StructOutput[]>(
    chainId,
    provider,
    "MarketLensV2_5",
    marketLensV2_5Abi as Abi,
    "getHooksInstancesForBorrower",
    [hooksFactory as Address, borrower as Address]
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
  const { deploymentName, abi } = getLatestLensTarget(chainId);
  const batchLenderAccountAbi = abi.filter(
    (item) =>
      item.type === "function" &&
      item.name === "getLenderAccountData" &&
      item.inputs[1]?.type === "address[]"
  ) as Abi;
  return readMarketLens<Array<LenderAccountDataStructOutput | LenderAccountDataV2_5StructOutput>>(
    chainId,
    provider,
    deploymentName,
    batchLenderAccountAbi,
    "getLenderAccountData",
    [account as Address, markets as Address[]]
  );
};

export const getLatestMarketDataWithLenderStatus = (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  account: string,
  market: string
): Promise<
  | MarketDataWithLenderStatusV2StructOutput
  | MarketDataWithLenderStatusV2_5StructOutput
  | FullMarketDataWithLenderStatusV2_5StructOutput
> => {
  if (getLatestLensDeploymentName(chainId) === "MarketLensV2_5") {
    return Promise.all([
      getUnifiedMarketDataV2(chainId, provider, market).catch(() =>
        getCompatibleMarketDataV2_5(chainId, provider, market)
      ),
      getLatestLenderAccountData(chainId, provider, account, market)
    ]).then(([marketData, lenderStatus]) =>
      withLenderStatusV2_5(marketData, lenderStatus as LenderAccountDataV2_5StructOutput)
    );
  }
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
  Array<
    | MarketDataWithLenderStatusV2StructOutput
    | MarketDataWithLenderStatusV2_5StructOutput
    | FullMarketDataWithLenderStatusV2_5StructOutput
  >
> => {
  if (getLatestLensDeploymentName(chainId) === "MarketLensV2_5") {
    return Promise.all([
      getUnifiedMarketsDataV2(chainId, provider, markets).catch(() =>
        getCompatibleMarketsDataV2_5(chainId, provider, markets)
      ),
      getLatestLenderAccountsData(chainId, provider, account, markets)
    ]).then(([marketData, lenderStatuses]) => {
      if (marketData.length !== lenderStatuses.length) {
        throw new Error("V2.5 market and lender-account result lengths do not match");
      }
      return marketData.map((market, index) =>
        withLenderStatusV2_5(market, lenderStatuses[index] as LenderAccountDataV2_5StructOutput)
      );
    });
  }
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
