/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  WildcatMarketController,
  WildcatMarketControllerInterface,
} from "../WildcatMarketController";

const _abi = [
  {
    inputs: [],
    name: "AnnualInterestBipsOutOfBounds",
    type: "error",
  },
  {
    inputs: [],
    name: "AprChangeNotPending",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerNotBorrower",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerNotBorrowerOrControllerFactory",
    type: "error",
  },
  {
    inputs: [],
    name: "DelinquencyFeeBipsOutOfBounds",
    type: "error",
  },
  {
    inputs: [],
    name: "DelinquencyGracePeriodOutOfBounds",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyString",
    type: "error",
  },
  {
    inputs: [],
    name: "ExcessReserveRatioStillActive",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketAlreadyDeployed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotControlledMarket",
    type: "error",
  },
  {
    inputs: [],
    name: "NotRegisteredBorrower",
    type: "error",
  },
  {
    inputs: [],
    name: "ReserveRatioBipsOutOfBounds",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalBatchDurationOutOfBounds",
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
    name: "LenderAuthorized",
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
    name: "LenderDeauthorized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxTotalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "annualInterestBips",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delinquencyFeeBips",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawalBatchDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reserveRatioBips",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delinquencyGracePeriod",
        type: "uint256",
      },
    ],
    name: "MarketDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "originalReserveRatioBips",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "temporaryReserveRatioBips",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "temporaryReserveRatioExpiry",
        type: "uint256",
      },
    ],
    name: "TemporaryExcessReserveRatioActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "TemporaryExcessReserveRatioExpired",
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
        internalType: "address[]",
        name: "lenders",
        type: "address[]",
      },
    ],
    name: "authorizeLenders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "lenders",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "markets",
        type: "address[]",
      },
    ],
    name: "authorizeLendersAndUpdateMarkets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "borrower",
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
        name: "market",
        type: "address",
      },
    ],
    name: "closeMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
    ],
    name: "computeMarketAddress",
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
    name: "controllerFactory",
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
        internalType: "address[]",
        name: "lenders",
        type: "address[]",
      },
    ],
    name: "deauthorizeLenders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "lenders",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "markets",
        type: "address[]",
      },
    ],
    name: "deauthorizeLendersAndUpdateMarkets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
    name: "deployMarket",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuthorizedLenders",
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
    name: "getAuthorizedLenders",
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
    name: "getAuthorizedLendersCount",
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
    name: "getControlledMarkets",
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
    name: "getControlledMarkets",
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
    name: "getControlledMarketsCount",
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
    name: "getMarketParameters",
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
            internalType: "address",
            name: "feeRecipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "sentinel",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "maxTotalSupply",
            type: "uint128",
          },
          {
            internalType: "uint16",
            name: "protocolFeeBips",
            type: "uint16",
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
        internalType: "struct MarketParameters",
        name: "",
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
        name: "lender",
        type: "address",
      },
    ],
    name: "isAuthorizedLender",
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
        name: "market",
        type: "address",
      },
    ],
    name: "isControlledMarket",
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
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "resetReserveRatio",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "market",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "annualInterestBips",
        type: "uint16",
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
        name: "market",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxTotalSupply",
        type: "uint256",
      },
    ],
    name: "setMaxTotalSupply",
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
    name: "temporaryExcessReserveRatio",
    outputs: [
      {
        internalType: "uint128",
        name: "reserveRatioBips",
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
        name: "lender",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "markets",
        type: "address[]",
      },
    ],
    name: "updateLenderAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class WildcatMarketController__factory {
  static readonly abi = _abi;
  static createInterface(): WildcatMarketControllerInterface {
    return new utils.Interface(_abi) as WildcatMarketControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WildcatMarketController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WildcatMarketController;
  }
}
