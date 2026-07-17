import { encodeFunctionData, type Abi, type Address, type Hex } from "viem";
import {
  collateralLensAbi,
  hooksFactoryAbi,
  hooksFactoryRevolvingAbi,
  marketLensAbi,
  marketLensV2Abi,
  marketLensV2_5Abi,
  mockArchControllerOwnerAbi,
  mockERC20FactoryAbi,
  wildcat4626WrapperFactoryAbi,
  wildcatArchControllerAbi,
  wildcatCollateralFactoryAbi,
  wildcatMarketControllerAbi,
  wildcatMarketControllerFactoryAbi
} from "./abi";
import type {
  CollateralContractDataStructOutput,
  LenderAccountDataStructOutput,
  LenderAccountDataV2_5StructOutput,
  HooksDataForBorrowerStructOutput,
  HooksDataForBorrowerV2_5StructOutput,
  StandardDeployMarketAndHooksArgs,
  StandardDeployMarketArgs,
  MarketDataStructOutput,
  MarketDataV2StructOutput,
  MarketDataBaseV2_5StructOutput,
  MarketDataWithLenderStatusStructOutput,
  MarketDataWithLenderStatusV2StructOutput,
  MarketDataWithLenderStatusV2_5StructOutput,
  MarketLiveDataV2_5StructOutput,
  MarketLiveDataWithLenderStatusV2_5StructOutput,
  RevolvingDeployMarketAndHooksArgs,
  RevolvingDeployMarketArgs,
  TokenMetadataStructOutput,
  WithdrawalBatchDataStructOutput,
  WithdrawalBatchDataWithLenderStatusStructOutput,
  WithdrawalBatchDataWithLenderStatusV2_5StructOutput
} from "./lens-types";
import { getViemPublicClientFromEthers } from "./internal/ethers-viem";
import { isEthersSigner } from "./internal/ethers-signer";
import { readViemContract } from "./internal/viem-read";
import { getDeploymentAddress, getLatestLensDeploymentName, SupportedChainId } from "./config";
import { DeployableMarketKind } from "./domain";
import { MarketParameterConstraints, SignerOrProvider } from "./types";
import { assert } from "./utils/assert";
import { prepareTransaction } from "./utils/viem-encoding";

export * from "./config";

type TransactionReceiptLogLike = {
  address?: string;
  data: Hex;
  topics: readonly Hex[];
};

type TransactionReceiptLike = {
  logs: readonly TransactionReceiptLogLike[];
};

type TransactionResponseLike = {
  hash: string;
  wait: () => Promise<TransactionReceiptLike>;
};

type AddressOnlyContract = {
  address: string;
};

type ArchControllerContract = AddressOnlyContract & {
  isRegisteredBorrower: (borrower: string) => Promise<boolean>;
};

type EncodingInterface = {
  encodeFunctionData: (functionName: string, args?: readonly unknown[]) => Hex;
};

type LegacyLensContract = AddressOnlyContract & {
  getMarketData: (market: string) => Promise<MarketDataStructOutput>;
  getMarketDataWithLenderStatus: (
    lender: string,
    market: string
  ) => Promise<MarketDataWithLenderStatusStructOutput>;
  getMarketsData: (markets: string[]) => Promise<MarketDataStructOutput[]>;
  getMarketsDataWithLenderStatus: (
    lender: string,
    markets: string[]
  ) => Promise<MarketDataWithLenderStatusStructOutput[]>;
};

type LatestLensContract = AddressOnlyContract & {
  getHooksDataForBorrower: (
    borrower: string
  ) => Promise<HooksDataForBorrowerStructOutput | HooksDataForBorrowerV2_5StructOutput>;
  getMarketData: (
    market: string
  ) => Promise<MarketDataV2StructOutput | MarketDataBaseV2_5StructOutput>;
  getMarketDataWithLenderStatus: (
    lender: string,
    market: string
  ) => Promise<
    MarketDataWithLenderStatusV2StructOutput | MarketDataWithLenderStatusV2_5StructOutput
  >;
  getMarketsData: (
    markets: string[]
  ) => Promise<Array<MarketDataV2StructOutput | MarketDataBaseV2_5StructOutput>>;
  getMarketsDataWithLenderStatus: (
    lender: string,
    markets: string[]
  ) => Promise<
    Array<MarketDataWithLenderStatusV2StructOutput | MarketDataWithLenderStatusV2_5StructOutput>
  >;
  getMarketsLiveDataV2: (markets: string[]) => Promise<MarketLiveDataV2_5StructOutput[]>;
  getMarketsLiveDataWithLenderStatusV2: (
    lender: string,
    markets: string[]
  ) => Promise<MarketLiveDataWithLenderStatusV2_5StructOutput[]>;
  getLenderAccountsData: (
    market: string,
    lenders: string[]
  ) => Promise<Array<LenderAccountDataStructOutput | LenderAccountDataV2_5StructOutput>>;
  getTokenInfo: (token: string) => Promise<TokenMetadataStructOutput>;
  getWithdrawalBatchesData: (
    market: string,
    expiries: readonly number[]
  ) => Promise<WithdrawalBatchDataStructOutput[]>;
  getWithdrawalBatchesDataWithLenderStatus: (
    market: string,
    expiries: readonly number[],
    lender: string
  ) => Promise<
    | WithdrawalBatchDataWithLenderStatusStructOutput[]
    | WithdrawalBatchDataWithLenderStatusV2_5StructOutput[]
  >;
};

type StandardHooksFactoryContract = AddressOnlyContract & {
  interface: EncodingInterface;
  computeMarketAddress: (salt: string) => Promise<string>;
  deployMarket: (...args: StandardDeployMarketArgs) => Promise<TransactionResponseLike>;
  deployMarketAndHooks: (
    ...args: StandardDeployMarketAndHooksArgs
  ) => Promise<TransactionResponseLike>;
};

type RevolvingHooksFactoryContract = AddressOnlyContract & {
  interface: EncodingInterface;
  computeMarketAddress: (salt: string) => Promise<string>;
  deployMarket: (...args: RevolvingDeployMarketArgs) => Promise<TransactionResponseLike>;
  deployMarketAndHooks: (
    ...args: RevolvingDeployMarketAndHooksArgs
  ) => Promise<TransactionResponseLike>;
};

type MockArchControllerOwnerContract = AddressOnlyContract & {
  interface: EncodingInterface;
  registerBorrower: (borrower: string) => Promise<TransactionResponseLike>;
};

type CollateralLensContract = AddressOnlyContract & {
  "getCollateralContractsForMarket(address)": (
    market: string
  ) => Promise<CollateralContractDataStructOutput[]>;
};

const getViemClient = (provider: SignerOrProvider) => getViemPublicClientFromEthers(provider);

const encodeWithAbi = (abi: Abi): EncodingInterface => ({
  encodeFunctionData: (functionName, args = []) =>
    encodeFunctionData({
      abi,
      functionName,
      args
    } as Parameters<typeof encodeFunctionData>[0])
});

const sendPreparedTransaction = async (
  provider: SignerOrProvider,
  transaction: ReturnType<typeof prepareTransaction>
): Promise<TransactionResponseLike> => {
  assert(isEthersSigner(provider), "Signer is required");
  return provider.sendTransaction({
    to: transaction.to,
    data: transaction.data,
    value: transaction.value === undefined ? undefined : transaction.value.toString()
  }) as Promise<TransactionResponseLike>;
};

export const getControllerContract = (
  provider: SignerOrProvider,
  address: string
): AddressOnlyContract => {
  void provider;
  void wildcatMarketControllerAbi;
  return { address };
};

export const getControllerFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): AddressOnlyContract => {
  void provider;
  void wildcatMarketControllerFactoryAbi;
  return { address: getDeploymentAddress(chainId, "WildcatMarketControllerFactory") };
};

export const getArchControllerContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): ArchControllerContract => {
  const address = getDeploymentAddress(chainId, "WildcatArchController");
  return {
    address,
    isRegisteredBorrower: (borrower) =>
      readViemContract(
        getViemClient(provider),
        address,
        wildcatArchControllerAbi as Abi,
        "isRegisteredBorrower",
        [borrower as Address]
      )
  };
};

export const getLensContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): LegacyLensContract => {
  const address = getDeploymentAddress(chainId, "MarketLens");
  return {
    address,
    getMarketData: (market) =>
      readViemContract(getViemClient(provider), address, marketLensAbi as Abi, "getMarketData", [
        market as Address
      ]),
    getMarketDataWithLenderStatus: (lender, market) =>
      readViemContract(
        getViemClient(provider),
        address,
        marketLensAbi as Abi,
        "getMarketDataWithLenderStatus",
        [lender as Address, market as Address]
      ),
    getMarketsData: (markets) =>
      readViemContract(getViemClient(provider), address, marketLensAbi as Abi, "getMarketsData", [
        markets as Address[]
      ]),
    getMarketsDataWithLenderStatus: (lender, markets) =>
      readViemContract(
        getViemClient(provider),
        address,
        marketLensAbi as Abi,
        "getMarketsDataWithLenderStatus",
        [lender as Address, markets as Address[]]
      )
  };
};

export const getCollateralLensContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): CollateralLensContract => {
  const address = getDeploymentAddress(chainId, "CollateralLens");
  return {
    address,
    "getCollateralContractsForMarket(address)": (market) =>
      readViemContract(
        getViemClient(provider),
        address,
        collateralLensAbi as Abi,
        "getCollateralContractsForMarket",
        [market as Address]
      )
  };
};

export const getStandardHooksFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): StandardHooksFactoryContract => {
  const address = getDeploymentAddress(chainId, "HooksFactoryStandard");
  return {
    address,
    interface: encodeWithAbi(hooksFactoryAbi as Abi),
    computeMarketAddress: (salt) =>
      readViemContract(
        getViemClient(provider),
        address,
        hooksFactoryAbi as Abi,
        "computeMarketAddress",
        [salt as Hex]
      ),
    deployMarket: (...args) =>
      sendPreparedTransaction(
        provider,
        prepareTransaction({
          to: address,
          abi: hooksFactoryAbi,
          functionName: "deployMarket",
          args
        })
      ),
    deployMarketAndHooks: (...args) =>
      sendPreparedTransaction(
        provider,
        prepareTransaction({
          to: address,
          abi: hooksFactoryAbi,
          functionName: "deployMarketAndHooks",
          args
        })
      )
  };
};

export const getRevolvingHooksFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): RevolvingHooksFactoryContract => {
  const address = getDeploymentAddress(chainId, "HooksFactoryRevolving");
  return {
    address,
    interface: encodeWithAbi(hooksFactoryRevolvingAbi as Abi),
    computeMarketAddress: (salt) =>
      readViemContract(
        getViemClient(provider),
        address,
        hooksFactoryRevolvingAbi as Abi,
        "computeMarketAddress",
        [salt as Hex]
      ),
    deployMarket: (...args) =>
      sendPreparedTransaction(
        provider,
        prepareTransaction({
          to: address,
          abi: hooksFactoryRevolvingAbi,
          functionName: "deployMarket",
          args
        })
      ),
    deployMarketAndHooks: (...args) =>
      sendPreparedTransaction(
        provider,
        prepareTransaction({
          to: address,
          abi: hooksFactoryRevolvingAbi,
          functionName: "deployMarketAndHooks",
          args
        })
      )
  };
};

export const getHooksFactoryContractForMarketKind = (
  chainId: SupportedChainId,
  marketKind: DeployableMarketKind,
  provider: SignerOrProvider
): StandardHooksFactoryContract | RevolvingHooksFactoryContract => {
  if (marketKind === "standard") {
    return getStandardHooksFactoryContract(chainId, provider);
  }
  return getRevolvingHooksFactoryContract(chainId, provider);
};

const getLatestLensLikeContract = (
  provider: SignerOrProvider,
  address: string,
  abi: Abi
): LatestLensContract => ({
  address,
  getHooksDataForBorrower: (borrower) =>
    readViemContract(getViemClient(provider), address, abi, "getHooksDataForBorrower", [
      borrower as Address
    ]),
  getMarketData: (market) =>
    readViemContract(getViemClient(provider), address, abi, "getMarketData", [market as Address]),
  getMarketDataWithLenderStatus: (lender, market) =>
    readViemContract(getViemClient(provider), address, abi, "getMarketDataWithLenderStatus", [
      lender as Address,
      market as Address
    ]),
  getMarketsData: (markets) =>
    readViemContract(getViemClient(provider), address, abi, "getMarketsData", [
      markets as Address[]
    ]),
  getMarketsDataWithLenderStatus: (lender, markets) =>
    readViemContract(getViemClient(provider), address, abi, "getMarketsDataWithLenderStatus", [
      lender as Address,
      markets as Address[]
    ]),
  getMarketsLiveDataV2: (markets) =>
    readViemContract(getViemClient(provider), address, abi, "getMarketsLiveDataV2", [
      markets as Address[]
    ]),
  getMarketsLiveDataWithLenderStatusV2: (lender, markets) =>
    readViemContract(
      getViemClient(provider),
      address,
      abi,
      "getMarketsLiveDataWithLenderStatusV2",
      [lender as Address, markets as Address[]]
    ),
  getLenderAccountsData: (market, lenders) =>
    readViemContract(getViemClient(provider), address, abi, "getLenderAccountsData", [
      market as Address,
      lenders as Address[]
    ]),
  getTokenInfo: (token) =>
    readViemContract(getViemClient(provider), address, abi, "getTokenInfo", [token as Address]),
  getWithdrawalBatchesData: (market, expiries) =>
    readViemContract(getViemClient(provider), address, abi, "getWithdrawalBatchesData", [
      market as Address,
      expiries
    ]),
  getWithdrawalBatchesDataWithLenderStatus: (market, expiries, lender) =>
    readViemContract(
      getViemClient(provider),
      address,
      abi,
      "getWithdrawalBatchesDataWithLenderStatus",
      [market as Address, expiries, lender as Address]
    )
});

export const getLensV2Contract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): LatestLensContract => {
  const address = getDeploymentAddress(chainId, "MarketLensV2");
  return getLatestLensLikeContract(provider, address, marketLensV2Abi as Abi);
};

export const getLensV2_5Contract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): LatestLensContract => {
  const address = getDeploymentAddress(chainId, "MarketLensV2_5");
  return getLatestLensLikeContract(provider, address, marketLensV2_5Abi as Abi);
};

export const getLatestLensContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): LatestLensContract => {
  const deploymentName = getLatestLensDeploymentName(chainId);
  const abi = deploymentName === "MarketLensV2_5" ? marketLensV2_5Abi : marketLensV2Abi;
  return getLatestLensLikeContract(
    provider,
    getDeploymentAddress(chainId, deploymentName),
    abi as Abi
  );
};

export const getMockERC20Factory = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): AddressOnlyContract => {
  void provider;
  void mockERC20FactoryAbi;
  return { address: getDeploymentAddress(chainId, "MockERC20Factory") };
};

export const getMockArchControllerOwnerContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): MockArchControllerOwnerContract => {
  const address = getDeploymentAddress(chainId, "MockArchControllerOwner");
  return {
    address,
    interface: encodeWithAbi(mockArchControllerOwnerAbi as Abi),
    registerBorrower: (borrower) =>
      sendPreparedTransaction(
        provider,
        prepareTransaction({
          to: address,
          abi: mockArchControllerOwnerAbi,
          functionName: "registerBorrower",
          args: [borrower as Address]
        })
      )
  };
};

export const getCollateralFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): AddressOnlyContract => {
  void provider;
  void wildcatCollateralFactoryAbi;
  return { address: getDeploymentAddress(chainId, "WildcatCollateralFactory") };
};

export const getWrapperFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): AddressOnlyContract => {
  void provider;
  void wildcat4626WrapperFactoryAbi;
  return { address: getDeploymentAddress(chainId, "Wildcat4626WrapperFactory") };
};

/**
 * Current periodic APR reduction validity consensus. Execution is valid from
 * the response window end until the next withdrawal window starts.
 */
export const APR_REDUCTION_PROPOSAL_VALIDITY_PERIODS = 1;

const day = 86_400;

export const DefaultV2ParameterConstraints: MarketParameterConstraints = {
  minimumDelinquencyGracePeriod: 0,
  maximumDelinquencyGracePeriod: 90 * day,
  minimumReserveRatioBips: 0,
  maximumReserveRatioBips: 10_000,
  minimumDelinquencyFeeBips: 0,
  maximumDelinquencyFeeBips: 10_000,
  minimumWithdrawalBatchDuration: 0,
  maximumWithdrawalBatchDuration: 365 * day,
  minimumAnnualInterestBips: 0,
  maximumAnnualInterestBips: 10_000
};
