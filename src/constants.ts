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
  LegacyDeployMarketAndHooksArgs,
  LegacyDeployMarketArgs,
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
import { MarketParameterConstraints, MarketType, SignerOrProvider } from "./types";
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { assert } from "./utils/assert";
import { prepareTransaction } from "./utils/viem-encoding";

export type NetworkDeployments = {
  HooksFactory: string;
  HooksFactoryRevolving?: string;
  MarketLens?: string;
  MarketLensV2: string;
  MarketLensV2_5?: string;
  MockArchControllerOwner?: string;
  MockChainalysis?: string;
  MockERC20Factory?: string;
  WildcatArchController: string;
  WildcatMarketControllerFactory?: string;
  WildcatSanctionsSentinel: string;
  Chainalysis: string;
  OpenAccessRoleProvider: string;
  WildcatCollateralFactory?: string;
  Wildcat4626WrapperFactory?: string;
  BebopSettlementContract?: string;
  CollateralLens?: string;
};

export type HooksFactoryDeploymentName = "HooksFactory" | "HooksFactoryRevolving";
export type LatestLensDeploymentName = "MarketLensV2" | "MarketLensV2_5";

export type HooksFactoryCapabilities = {
  address: string;
  marketType: MarketType;
  canonical: boolean;
  indexed: boolean;
  deploymentName?: HooksFactoryDeploymentName;
  label?: string;
};

type HooksFactoryCapabilityOverrides = Partial<Pick<HooksFactoryCapabilities, "indexed" | "label">>;

const HooksFactoryDeploymentNamesByMarketType: Record<MarketType, HooksFactoryDeploymentName> = {
  legacy: "HooksFactory",
  revolving: "HooksFactoryRevolving"
};

export enum SupportedChainId {
  Mainnet = 1,
  Sepolia = 11155111,
  PlasmaTestnet = 9746,
  PlasmaMainnet = 9745
}

export const SupportedChainIds = [
  SupportedChainId.Mainnet,
  SupportedChainId.Sepolia,
  SupportedChainId.PlasmaTestnet,
  SupportedChainId.PlasmaMainnet
];

export const isSupportedChainId = (chainId: number): chainId is SupportedChainId => {
  return SupportedChainIds.includes(chainId as SupportedChainId);
};

export const hasDeploymentAddress = (
  chainId: SupportedChainId,
  name: keyof NetworkDeployments
): boolean => {
  const deployments = Deployments[chainId];
  return deployments[name] !== undefined;
};

export const Deployments: Record<SupportedChainId, NetworkDeployments> = {
  [SupportedChainId.Mainnet]: {
    HooksFactory: "0xdd7dd3b5076cf89440d05585ff56d246386207be",
    MarketLens: "0xf1D516954f96c1363f8b0aE48D79c8ddE6237847",
    MarketLensV2: "0xfDA5C5B96bb198D2fca1A01d759620B64Ae5afE7",
    WildcatArchController: "0xfEB516d9D946dD487A9346F6fee11f40C6945eE4",
    WildcatMarketControllerFactory: "0xFd31007613C9F671df6A8D4234901324986Bfd13",
    WildcatSanctionsSentinel: "0x437e0551892C2C9b06d3fFd248fe60572e08CD1A",
    Chainalysis: "0x40C57923924B5c5c5455c48D93317139ADDaC8fb",
    OpenAccessRoleProvider: "0x5620553d8881335F74AD19259daaCD1d9B373101",
    BebopSettlementContract: "0xbbbbbBB520d69a9775E85b458C58c648259FAD5F",
    WildcatCollateralFactory: "0xBdf64bd7Ea91A534445d06736a0f0E2a33FfA47c",
    CollateralLens: "0x422489bA6bDdD5954C379C41B6C97Ab0E4494f90",
    Wildcat4626WrapperFactory: "0xEA6DE11f8F3F83c79bD9d8Db5517fCFDf2Bb148a"
  },
  [SupportedChainId.Sepolia]: {
    HooksFactory: "0xE3e4B7C9E0Ab4ccbC70e0583Dca7B4Db9B4CFD88",
    HooksFactoryRevolving: "0xb899ba2a5F5b609898A2bABe445Aa31dDf0277e5",
    MarketLens: "0xb3925B31A8AeDCE8CFc885e0D5DAa057A1EA8A72",
    MarketLensV2: "0x5D8cEacEe19c06C3b4108b8Ae5B881eb0240B9c7",
    MarketLensV2_5: "0x96EFd2A3fC5fa5a21AdB38722d1F5F1908FddE0a",
    MockArchControllerOwner: "0xa476920af80B587f696734430227869795E2Ea78",
    MockChainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    MockERC20Factory: "0x54A3103904977DCb3C2fB782059F5431db90C96e",
    WildcatArchController: "0xC003f20F2642c76B81e5e1620c6D8cdEE826408f",
    WildcatMarketControllerFactory: "0xEb97C8E52d7Fdf978a64a538F28271Fd8499b864",
    WildcatSanctionsSentinel: "0xFBCE262eC835be5e6A458cE1722EeCe0E453316B",
    Chainalysis: "0x9d1060f8DEE8CBCf5eC772C51Ec671f70Cc7f8d9",
    OpenAccessRoleProvider: "0x9aCdE253F7A51456c48604185C0ceA4Fc9e58E3a",
    WildcatCollateralFactory: "0x58Ab4755221869cfcAe2A4F3EE31d591bA6AE1D0",
    BebopSettlementContract: "0x513826b6bb38fc159f152a4bf6e1ec3650a7ee46",
    CollateralLens: "0x5A49828b3E9Acbc614CDd703601406B1854aA578",
    Wildcat4626WrapperFactory: "0x0566Fe57682164af689f1440cb3BCEedEe3bf843"
  },
  [SupportedChainId.PlasmaTestnet]: {
    HooksFactory: "0x5Ad00b665eA71E27628D75102B1497CC75E531FB",
    MarketLensV2: "0xBA370992D7041b5C3B9AEBc61E0CC52C57138918",
    MockArchControllerOwner: "0x2BF8b4eA29259C01eB2Cc6BF6bd21A6F4D23fD8f",
    MockChainalysis: "0x0ac22d06121fc336B2F3DBeb284df65C97BcA547",
    MockERC20Factory: "0xF3fE96705d85A1592B31592B628667eA21fdd7C7",
    WildcatArchController: "0x1EeBC079aE1e7dCDe31C74A7EF48fA8737673A6a",
    WildcatSanctionsSentinel: "0x7cc91e3c64A0b5844650d586B87B291AC3A3aaD4",
    Chainalysis: "0x0ac22d06121fc336B2F3DBeb284df65C97BcA547",
    OpenAccessRoleProvider: "0xC9490f78A131c51829cda5C4455E88CAAc6246f0"
  },
  [SupportedChainId.PlasmaMainnet]: {
    HooksFactory: "0xB46bae25AC6D23148531ed1853a8881FD842E517",
    MarketLensV2: "0x7e5d6d9f9a2091dD781118514F5397A8107c81c5",
    WildcatArchController: "0xdb2e0DE97d6d96aa56754635704a4273E0F348ae",
    Chainalysis: "0x38056F7fE6396417b191BF7Dc6a3aA04235f3f46",
    OpenAccessRoleProvider: "0x792F1368f8B8f450c14875eb6FF0028dFc2629b4",
    WildcatSanctionsSentinel: "0x37064895ba2C1e269EAF7FF32564818d08903f5B"
  }
};

const CanonicalHooksFactoryCapabilityOverridesByChainId: Partial<
  Record<
    SupportedChainId,
    Partial<Record<HooksFactoryDeploymentName, HooksFactoryCapabilityOverrides>>
  >
> = {
  [SupportedChainId.Sepolia]: {
    HooksFactory: {
      label: "Sepolia legacy hooks factory"
    }
  }
};

const NonCanonicalHooksFactoryCapabilitiesByChainId: Partial<
  Record<
    SupportedChainId,
    Record<string, Omit<HooksFactoryCapabilities, "address" | "canonical" | "deploymentName">>
  >
> = {
  [SupportedChainId.Sepolia]: {
    // Indexed historical legacy factory from the pre-RCF Sepolia subgraph.
    // It must remain readable, but must not be used as the deploy target.
    "0x10a64aba0159720f8a23e1a552800ca4eb21576c": {
      marketType: "legacy",
      indexed: true,
      label: "Sepolia historical legacy hooks factory"
    },
    // Indexed historical RCF factory. It must remain readable, but must not be
    // used as the deploy target for new revolving markets.
    "0xf4564015e524cf5629828e61f45ed339d998d85f": {
      marketType: "revolving",
      indexed: true,
      label: "Sepolia historical revolving hooks factory"
    }
  }
};

export const getDeploymentAddress = (
  chainId: SupportedChainId,
  name: keyof NetworkDeployments
): string => {
  const deployments = Deployments[chainId];
  const address = deployments[name];
  assert(address !== undefined, `Deployment ${name} not found for chain ${chainId}`);
  return address;
};

export const getHooksFactoryDeploymentName = (
  marketType: MarketType
): HooksFactoryDeploymentName => {
  return HooksFactoryDeploymentNamesByMarketType[marketType];
};

export const hasHooksFactoryDeployment = (
  chainId: SupportedChainId,
  marketType: MarketType
): boolean => {
  return hasDeploymentAddress(chainId, getHooksFactoryDeploymentName(marketType));
};

export const getHooksFactoryAddressForMarketType = (
  chainId: SupportedChainId,
  marketType: MarketType
): string => {
  return getDeploymentAddress(chainId, getHooksFactoryDeploymentName(marketType));
};

const getCanonicalHooksFactoryCapabilities = (
  chainId: SupportedChainId
): HooksFactoryCapabilities[] => {
  return (Object.keys(HooksFactoryDeploymentNamesByMarketType) as MarketType[]).reduce<
    HooksFactoryCapabilities[]
  >((capabilities, marketType) => {
    const deploymentName = getHooksFactoryDeploymentName(marketType);
    const address = Deployments[chainId][deploymentName];
    if (!address) {
      return capabilities;
    }
    const overrides =
      CanonicalHooksFactoryCapabilityOverridesByChainId[chainId]?.[deploymentName] ?? {};
    capabilities.push({
      address,
      marketType,
      canonical: true,
      indexed: true,
      deploymentName,
      ...overrides
    });
    return capabilities;
  }, []);
};

export const getIndexedHooksFactories = (chainId: SupportedChainId): HooksFactoryCapabilities[] => {
  const canonical = getCanonicalHooksFactoryCapabilities(chainId);
  const nonCanonical = Object.entries(
    NonCanonicalHooksFactoryCapabilitiesByChainId[chainId] ?? {}
  ).map(([address, capabilities]) => ({
    address,
    canonical: false,
    ...capabilities
  }));

  const byAddress = new Map<string, HooksFactoryCapabilities>();
  for (const capabilities of [...canonical, ...nonCanonical]) {
    if (capabilities.indexed) {
      byAddress.set(capabilities.address.toLowerCase(), capabilities);
    }
  }
  return [...byAddress.values()];
};

export const getHooksFactoryCapabilities = (
  chainId: SupportedChainId,
  hooksFactoryAddress: string
): HooksFactoryCapabilities | undefined => {
  const normalizedAddress = hooksFactoryAddress.toLowerCase();
  return getIndexedHooksFactories(chainId).find(
    (capabilities) => capabilities.address.toLowerCase() === normalizedAddress
  );
};

export const isIndexedHooksFactory = (
  chainId: SupportedChainId,
  hooksFactoryAddress: string
): boolean => {
  return getHooksFactoryCapabilities(chainId, hooksFactoryAddress)?.indexed ?? false;
};

export const getMarketTypeForHooksFactory = (
  chainId: SupportedChainId,
  hooksFactoryAddress: string
): MarketType | undefined => {
  return getHooksFactoryCapabilities(chainId, hooksFactoryAddress)?.marketType;
};

export const getLatestLensDeploymentName = (
  chainId: SupportedChainId
): LatestLensDeploymentName => {
  return hasDeploymentAddress(chainId, "MarketLensV2_5") ? "MarketLensV2_5" : "MarketLensV2";
};

export const getLatestLensAddress = (chainId: SupportedChainId): string => {
  return getDeploymentAddress(chainId, getLatestLensDeploymentName(chainId));
};

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
  getHooksDataForBorrower: (borrower: string) => Promise<HooksDataForBorrowerStructOutput>;
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

type HooksFactoryContract = AddressOnlyContract & {
  interface: EncodingInterface;
  computeMarketAddress: (salt: string) => Promise<string>;
  deployMarket: (...args: LegacyDeployMarketArgs) => Promise<TransactionResponseLike>;
  deployMarketAndHooks: (
    ...args: LegacyDeployMarketAndHooksArgs
  ) => Promise<TransactionResponseLike>;
};

type HooksFactoryRevolvingContract = AddressOnlyContract & {
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

export const getHooksFactoryContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): HooksFactoryContract => {
  const address = getDeploymentAddress(chainId, "HooksFactory");
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

export const getHooksFactoryRevolvingContract = (
  chainId: SupportedChainId,
  provider: SignerOrProvider
): HooksFactoryRevolvingContract => {
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

export const getHooksFactoryContractForMarketType = (
  chainId: SupportedChainId,
  marketType: MarketType,
  provider: SignerOrProvider
): HooksFactoryContract | HooksFactoryRevolvingContract => {
  if (marketType === "legacy") {
    return getHooksFactoryContract(chainId, provider);
  }
  return getHooksFactoryRevolvingContract(chainId, provider);
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

export const SubgraphUrls = {
  [SupportedChainId.Sepolia]: `https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/sepolia/v2.1.5/gn`,
  [SupportedChainId.Mainnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/mainnet/v2.0.22/gn",
  [SupportedChainId.PlasmaTestnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-testnet/v2.0.22/gn",
  [SupportedChainId.PlasmaMainnet]:
    "https://api.goldsky.com/api/public/project_cmheai1ym00jyx7p27qn46qtm/subgraphs/plasma-mainnet/v2.0.22/gn"
};

export const SubgraphFeatures = {
  [SupportedChainId.Sepolia]: {
    periodicTermHooks: true
  },
  [SupportedChainId.Mainnet]: {
    periodicTermHooks: false
  },
  [SupportedChainId.PlasmaTestnet]: {
    periodicTermHooks: false
  },
  [SupportedChainId.PlasmaMainnet]: {
    periodicTermHooks: false
  }
};

export const supportsPeriodicTermHooks = (chainId: SupportedChainId): boolean =>
  SubgraphFeatures[chainId]?.periodicTermHooks === true;

/**
 * Current periodic APR reduction validity consensus. Execution is valid from
 * the response window end until the next withdrawal window starts.
 */
export const APR_REDUCTION_PROPOSAL_VALIDITY_PERIODS = 1;

const subgraphClients = new Map<SupportedChainId, ApolloClient<NormalizedCacheObject>>();

export const getSubgraphClient = (
  chainId: SupportedChainId
): ApolloClient<NormalizedCacheObject> => {
  const cachedClient = subgraphClients.get(chainId);
  if (cachedClient) {
    return cachedClient;
  }
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: SubgraphUrls[chainId]
  });
  subgraphClients.set(chainId, client);
  return client;
};

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
