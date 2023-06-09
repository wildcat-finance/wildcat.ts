/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export type VaultParametersStruct = {
  asset: PromiseOrValue<string>;
  namePrefix: PromiseOrValue<string>;
  symbolPrefix: PromiseOrValue<string>;
  borrower: PromiseOrValue<string>;
  controller: PromiseOrValue<string>;
  maxTotalSupply: PromiseOrValue<BigNumberish>;
  annualInterestBips: PromiseOrValue<BigNumberish>;
  penaltyFeeBips: PromiseOrValue<BigNumberish>;
  gracePeriod: PromiseOrValue<BigNumberish>;
  liquidityCoverageRatio: PromiseOrValue<BigNumberish>;
  interestFeeBips: PromiseOrValue<BigNumberish>;
  feeRecipient: PromiseOrValue<string>;
};

export type VaultParametersStructOutput = [
  string,
  string,
  string,
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  string
] & {
  asset: string;
  namePrefix: string;
  symbolPrefix: string;
  borrower: string;
  controller: string;
  maxTotalSupply: BigNumber;
  annualInterestBips: BigNumber;
  penaltyFeeBips: BigNumber;
  gracePeriod: BigNumber;
  liquidityCoverageRatio: BigNumber;
  interestFeeBips: BigNumber;
  feeRecipient: string;
};

export interface WildcatVaultFactoryInterface extends utils.Interface {
  functions: {
    "VaultInitCodeHash()": FunctionFragment;
    "computeVaultAddress(address,address,address)": FunctionFragment;
    "deployVault((address,string,string,address,address,uint256,uint256,uint256,uint256,uint256,uint256,address))": FunctionFragment;
    "getVaultParameters()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "VaultInitCodeHash"
      | "computeVaultAddress"
      | "deployVault"
      | "getVaultParameters"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "VaultInitCodeHash",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "computeVaultAddress",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deployVault",
    values: [VaultParametersStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getVaultParameters",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "VaultInitCodeHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeVaultAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVaultParameters",
    data: BytesLike
  ): Result;

  events: {
    "VaultDeployed(address,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "VaultDeployed"): EventFragment;
}

export interface VaultDeployedEventObject {
  controller: string;
  underlying: string;
  vault: string;
}
export type VaultDeployedEvent = TypedEvent<
  [string, string, string],
  VaultDeployedEventObject
>;

export type VaultDeployedEventFilter = TypedEventFilter<VaultDeployedEvent>;

export interface WildcatVaultFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: WildcatVaultFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    VaultInitCodeHash(overrides?: CallOverrides): Promise<[string]>;

    computeVaultAddress(
      controller: PromiseOrValue<string>,
      deployer: PromiseOrValue<string>,
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    deployVault(
      vaultParameters: VaultParametersStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getVaultParameters(
      overrides?: CallOverrides
    ): Promise<[VaultParametersStructOutput]>;
  };

  VaultInitCodeHash(overrides?: CallOverrides): Promise<string>;

  computeVaultAddress(
    controller: PromiseOrValue<string>,
    deployer: PromiseOrValue<string>,
    asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  deployVault(
    vaultParameters: VaultParametersStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getVaultParameters(
    overrides?: CallOverrides
  ): Promise<VaultParametersStructOutput>;

  callStatic: {
    VaultInitCodeHash(overrides?: CallOverrides): Promise<string>;

    computeVaultAddress(
      controller: PromiseOrValue<string>,
      deployer: PromiseOrValue<string>,
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    deployVault(
      vaultParameters: VaultParametersStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    getVaultParameters(
      overrides?: CallOverrides
    ): Promise<VaultParametersStructOutput>;
  };

  filters: {
    "VaultDeployed(address,address,address)"(
      controller?: PromiseOrValue<string> | null,
      underlying?: PromiseOrValue<string> | null,
      vault?: null
    ): VaultDeployedEventFilter;
    VaultDeployed(
      controller?: PromiseOrValue<string> | null,
      underlying?: PromiseOrValue<string> | null,
      vault?: null
    ): VaultDeployedEventFilter;
  };

  estimateGas: {
    VaultInitCodeHash(overrides?: CallOverrides): Promise<BigNumber>;

    computeVaultAddress(
      controller: PromiseOrValue<string>,
      deployer: PromiseOrValue<string>,
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deployVault(
      vaultParameters: VaultParametersStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getVaultParameters(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    VaultInitCodeHash(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    computeVaultAddress(
      controller: PromiseOrValue<string>,
      deployer: PromiseOrValue<string>,
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deployVault(
      vaultParameters: VaultParametersStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getVaultParameters(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
