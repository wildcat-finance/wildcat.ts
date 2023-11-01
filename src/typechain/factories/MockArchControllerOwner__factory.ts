/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  MockArchControllerOwner,
  MockArchControllerOwnerInterface,
} from "../MockArchControllerOwner";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "authorizeAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "authorizedAccounts",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
    ],
    name: "registerBorrower",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "borrowers",
        type: "address[]",
      },
    ],
    name: "registerBorrowers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "returnOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "originationFeeAsset",
        type: "address",
      },
      {
        internalType: "uint80",
        name: "originationFeeAmount",
        type: "uint80",
      },
      {
        internalType: "uint16",
        name: "protocolFeeBips",
        type: "uint16",
      },
    ],
    name: "setProtocolFeeConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class MockArchControllerOwner__factory {
  static readonly abi = _abi;
  static createInterface(): MockArchControllerOwnerInterface {
    return new utils.Interface(_abi) as MockArchControllerOwnerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockArchControllerOwner {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockArchControllerOwner;
  }
}
