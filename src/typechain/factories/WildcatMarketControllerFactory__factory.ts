/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  WildcatMarketControllerFactory,
  WildcatMarketControllerFactoryInterface,
} from "../WildcatMarketControllerFactory";

const _abi = [
  {
    inputs: [],
    name: "CallerNotArchControllerOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "ControllerAlreadyDeployed",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidConstraints",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidProtocolFeeConfiguration",
    type: "error",
  },
  {
    inputs: [],
    name: "NotRegisteredBorrower",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "controller",
        type: "address",
      },
    ],
    name: "NewController",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "feeRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "protocolFeeBips",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "address",
        name: "originationFeeAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "originationFeeAmount",
        type: "uint256",
      },
    ],
    name: "UpdateProtocolFeeConfiguration",
    type: "event",
  },
  {
    inputs: [],
    name: "archController",
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
        name: "borrower",
        type: "address",
      },
    ],
    name: "computeControllerAddress",
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
    name: "controllerInitCodeHash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "controllerInitCodeStorage",
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
    name: "deployController",
    outputs: [
      {
        internalType: "address",
        name: "controller",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "maxTotalSupply",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "annualInterestBips",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "delinquencyFeeBips",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "withdrawalBatchDuration",
        type: "uint32",
      },
      {
        internalType: "uint16",
        name: "reserveRatioBips",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "delinquencyGracePeriod",
        type: "uint32",
      },
    ],
    name: "deployControllerAndMarket",
    outputs: [
      {
        internalType: "address",
        name: "controller",
        type: "address",
      },
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "getDeployedControllers",
    outputs: [
      {
        internalType: "address[]",
        name: "arr",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeployedControllers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeployedControllersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMarketControllerParameters",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "archController",
            type: "address",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "sentinel",
            type: "address",
          },
          {
            internalType: "address",
            name: "marketInitCodeStorage",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "marketInitCodeHash",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "minimumDelinquencyGracePeriod",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maximumDelinquencyGracePeriod",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "minimumReserveRatioBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maximumReserveRatioBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "minimumDelinquencyFeeBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maximumDelinquencyFeeBips",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "minimumWithdrawalBatchDuration",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maximumWithdrawalBatchDuration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "minimumAnnualInterestBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maximumAnnualInterestBips",
            type: "uint16",
          },
        ],
        internalType: "struct MarketControllerParameters",
        name: "parameters",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getParameterConstraints",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "minimumDelinquencyGracePeriod",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maximumDelinquencyGracePeriod",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "minimumReserveRatioBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maximumReserveRatioBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "minimumDelinquencyFeeBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maximumDelinquencyFeeBips",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "minimumWithdrawalBatchDuration",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maximumWithdrawalBatchDuration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "minimumAnnualInterestBips",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maximumAnnualInterestBips",
            type: "uint16",
          },
        ],
        internalType: "struct MarketParameterConstraints",
        name: "constraints",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProtocolFeeConfiguration",
    outputs: [
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "controller",
        type: "address",
      },
    ],
    name: "isDeployedController",
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
    inputs: [],
    name: "marketInitCodeHash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketInitCodeStorage",
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
    name: "sentinel",
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

export class WildcatMarketControllerFactory__factory {
  static readonly abi = _abi;
  static createInterface(): WildcatMarketControllerFactoryInterface {
    return new utils.Interface(_abi) as WildcatMarketControllerFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WildcatMarketControllerFactory {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WildcatMarketControllerFactory;
  }
}
