/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "MarketLens",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MarketLens__factory>;
    getContractFactory(
      name: "MockArchControllerOwner",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockArchControllerOwner__factory>;
    getContractFactory(
      name: "MockERC20Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockERC20Factory__factory>;
    getContractFactory(
      name: "WildcatArchController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WildcatArchController__factory>;
    getContractFactory(
      name: "WildcatMarket",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WildcatMarket__factory>;
    getContractFactory(
      name: "WildcatMarketController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WildcatMarketController__factory>;
    getContractFactory(
      name: "WildcatMarketControllerFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WildcatMarketControllerFactory__factory>;

    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "MarketLens",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MarketLens>;
    getContractAt(
      name: "MockArchControllerOwner",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockArchControllerOwner>;
    getContractAt(
      name: "MockERC20Factory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockERC20Factory>;
    getContractAt(
      name: "WildcatArchController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WildcatArchController>;
    getContractAt(
      name: "WildcatMarket",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WildcatMarket>;
    getContractAt(
      name: "WildcatMarketController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WildcatMarketController>;
    getContractAt(
      name: "WildcatMarketControllerFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WildcatMarketControllerFactory>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
