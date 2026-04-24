import type { Abi } from "viem";

export const wildcat4626WrapperFactoryAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "market", type: "address" },
      { indexed: true, internalType: "address", name: "wrapper", type: "address" }
    ],
    name: "WrapperDeployed",
    type: "event"
  },
  {
    inputs: [{ internalType: "address", name: "market", type: "address" }],
    name: "createWrapper",
    outputs: [{ internalType: "address", name: "wrapper", type: "address" }],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const satisfies Abi;

export const wildcat4626WrapperAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "deposit",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "shares", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "address", name: "owner_", type: "address" }
    ],
    name: "withdraw",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "shares", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "address", name: "owner_", type: "address" }
    ],
    name: "redeem",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "to", type: "address" }
    ],
    name: "sweep",
    outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const satisfies Abi;
