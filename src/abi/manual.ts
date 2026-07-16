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
  },
  {
    inputs: [{ internalType: "address", name: "market", type: "address" }],
    name: "isFloorRoundingMarket",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "v1Factory",
    outputs: [
      {
        internalType: "contract IWildcat4626WrapperFactoryV1",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "market", type: "address" }],
    name: "wrapperForMarket",
    outputs: [{ internalType: "address", name: "wrapper", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
] as const satisfies Abi;

export const wildcat4626WrapperAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "escrow", type: "address" },
      { indexed: false, internalType: "uint256", name: "shares", type: "uint256" }
    ],
    name: "SanctionedAccountSharesSentToEscrow",
    type: "event"
  },
  {
    inputs: [],
    name: "market",
    outputs: [{ internalType: "contract WildcatMarket", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    name: "convertToShares",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "maxDeposit",
    outputs: [{ internalType: "uint256", name: "maxAssets", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    name: "previewDeposit",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "maxMint",
    outputs: [{ internalType: "uint256", name: "maxShares", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "previewMint",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "maxWithdraw",
    outputs: [{ internalType: "uint256", name: "maxAssets", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    name: "previewWithdraw",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "maxRedeem",
    outputs: [{ internalType: "uint256", name: "maxShares", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "previewRedeem",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "assetsPerShareRay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "sharesPerAssetRay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
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
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "nukeFromOrbit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const satisfies Abi;
