/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  WildcatVaultController,
  WildcatVaultControllerInterface,
} from "../WildcatVaultController";

const _abi = [
  {
    inputs: [],
    name: "NewOwnerIsZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NoHandoverRequest",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OwnershipHandoverCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OwnershipHandoverRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "cancelOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "completeOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "string",
            name: "namePrefix",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbolPrefix",
            type: "string",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "controller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "maxTotalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "annualInterestBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "penaltyFeeBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gracePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityCoverageRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestFeeBips",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "feeRecipient",
            type: "address",
          },
        ],
        internalType: "struct VaultParameters",
        name: "vaultParameters",
        type: "tuple",
      },
    ],
    name: "getVaultParameters",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "string",
            name: "namePrefix",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbolPrefix",
            type: "string",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "controller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "maxTotalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "annualInterestBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "penaltyFeeBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gracePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityCoverageRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestFeeBips",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "feeRecipient",
            type: "address",
          },
        ],
        internalType: "struct VaultParameters",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "string",
            name: "namePrefix",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbolPrefix",
            type: "string",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "controller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "maxTotalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "annualInterestBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "penaltyFeeBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gracePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityCoverageRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestFeeBips",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "feeRecipient",
            type: "address",
          },
        ],
        internalType: "struct VaultParameters",
        name: "vaultParameters",
        type: "tuple",
      },
    ],
    name: "handleDeployVault",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "string",
            name: "namePrefix",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbolPrefix",
            type: "string",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "controller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "maxTotalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "annualInterestBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "penaltyFeeBips",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gracePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityCoverageRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestFeeBips",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "feeRecipient",
            type: "address",
          },
        ],
        internalType: "struct VaultParameters",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "ownershipHandoverExpiresAt",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownershipHandoverValidFor",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "requestOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
    ],
    name: "resetLiquidityCoverage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setAnnualInterestBips",
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
    name: "temporaryExcessLiquidityCoverage",
    outputs: [
      {
        internalType: "uint128",
        name: "liquidityCoverageRatio",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "expiry",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "payable",
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
    name: "vaults",
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
] as const;

export class WildcatVaultController__factory {
  static readonly abi = _abi;
  static createInterface(): WildcatVaultControllerInterface {
    return new utils.Interface(_abi) as WildcatVaultControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WildcatVaultController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WildcatVaultController;
  }
}
