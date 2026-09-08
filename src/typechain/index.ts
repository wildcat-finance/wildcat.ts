import { Contract, ContractFactory, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";

import { checkSafeSignatureBytecode, wildcatMarketAbi } from "../abi";

type SignerOrProvider = Signer | Provider;
type LegacyContract = Contract & Record<string, (...args: any[]) => any>;
type LegacyTransactionResponse = { hash: string; wait: () => Promise<unknown> };
type LegacySafeContract = LegacyContract & {
  getOwners: (overrides?: unknown) => Promise<string[]>;
  "isValidSignature(bytes32,bytes)": (
    messageHash: string,
    signature: string,
    overrides?: unknown
  ) => Promise<string>;
  "isValidSignature(bytes,bytes)": (
    message: string,
    signature: string,
    overrides?: unknown
  ) => Promise<string>;
};
type LegacyMarketContract = LegacyContract & {
  borrower: () => Promise<string>;
  setAnnualInterestAndReserveRatioBips: (
    annualInterestBips: unknown,
    reserveRatioBips: unknown
  ) => Promise<LegacyTransactionResponse>;
};

const checkBorrowersRegisteredAbi = [
  {
    inputs: [
      { internalType: "address", name: "archController", type: "address" },
      { internalType: "address[]", name: "borrowers", type: "address[]" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  }
];

const checkBorrowersRegisteredBytecode =
  "0x608060405234801561000f575f80fd5b506040516105a23803806105a28339818101604052810190610031919061033e565b5f8290505f825167ffffffffffffffff81111561005157610050610202565b5b60405190808252806020026020018201604052801561007f5781602001602082028036833780820191505090505b5090505f5b8351811015610157578273ffffffffffffffffffffffffffffffffffffffff16630787c1fe8583815181106100bc576100bb610398565b5b60200260200101516040518263ffffffff1660e01b81526004016100e091906103d4565b602060405180830381865afa1580156100fb573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061011f9190610422565b82828151811061013257610131610398565b5b602002602001019015159081151581525050808061014f90610483565b915050610084565b505f8160405160200161016a9190610581565b6040516020818303038152906040529050805160208201f35b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6101bd82610194565b9050919050565b6101cd816101b3565b81146101d7575f80fd5b50565b5f815190506101e8816101c4565b92915050565b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610238826101f2565b810181811067ffffffffffffffff8211171561025757610256610202565b5b80604052505050565b5f610269610183565b9050610275828261022f565b919050565b5f67ffffffffffffffff82111561029457610293610202565b5b602082029050602081019050919050565b5f80fd5b5f6102bb6102b68461027a565b610260565b905080838252602082019050602084028301858111156102de576102dd6102a5565b5b835b8181101561030757806102f388826101da565b8452602084019350506020810190506102e0565b5050509392505050565b5f82601f830112610325576103246101ee565b5b81516103358482602086016102a9565b91505092915050565b5f80604083850312156103545761035361018c565b5b5f610361858286016101da565b925050602083015167ffffffffffffffff81111561038257610381610190565b5b61038e85828601610311565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b6103ce816101b3565b82525050565b5f6020820190506103e75f8301846103c5565b92915050565b5f8115159050919050565b610401816103ed565b811461040b575f80fd5b50565b5f8151905061041c816103f8565b92915050565b5f602082840312156104375761043661018c565b5b5f6104448482850161040e565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f819050919050565b5f61048d8261047a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036104bf576104be61044d565b5b600182019050919050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6104fc816103ed565b82525050565b5f61050d83836104f3565b60208301905092915050565b5f602082019050919050565b5f61052f826104ca565b61053981856104d4565b9350610544836104e4565b805f5b8381101561057457815161055b8882610502565b975061056683610519565b925050600181019050610547565b5085935050505092915050565b5f6020820190508181035f8301526105998184610525565b90509291505056fe";

const checkSafeSignatureAbi = [
  {
    inputs: [
      { internalType: "address", name: "safeAddress", type: "address" },
      { internalType: "bytes", name: "message", type: "bytes" },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  }
];

const safeAbi = [
  {
    inputs: [],
    name: "getOwners",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_hash", type: "bytes32" },
      { internalType: "bytes", name: "_signature", type: "bytes" }
    ],
    name: "isValidSignature",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes", name: "_data", type: "bytes" },
      { internalType: "bytes", name: "_signature", type: "bytes" }
    ],
    name: "isValidSignature",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "view",
    type: "function"
  }
];

const marketAbi = wildcatMarketAbi as unknown as any[];

class LegacyDeploylessFactory {
  static abi: any[];

  static createInterface(): utils.Interface {
    return new utils.Interface(this.abi);
  }

  static connect(address: string, signerOrProvider: SignerOrProvider): LegacyContract {
    return new Contract(address, this.abi, signerOrProvider) as LegacyContract;
  }
}

export class CheckBorrowersRegistered__factory extends ContractFactory {
  static readonly abi = checkBorrowersRegisteredAbi;
  static readonly bytecode = checkBorrowersRegisteredBytecode;

  constructor(signer?: Signer) {
    super(checkBorrowersRegisteredAbi, checkBorrowersRegisteredBytecode, signer);
  }

  static createInterface(): utils.Interface {
    return new utils.Interface(checkBorrowersRegisteredAbi);
  }

  static connect(address: string, signerOrProvider: SignerOrProvider): LegacyContract {
    return new Contract(address, checkBorrowersRegisteredAbi, signerOrProvider) as LegacyContract;
  }
}

export class CheckSafeSignature__factory extends ContractFactory {
  static readonly abi = checkSafeSignatureAbi;
  static readonly bytecode = checkSafeSignatureBytecode;

  constructor(signer?: Signer) {
    super(checkSafeSignatureAbi, checkSafeSignatureBytecode, signer);
  }

  static createInterface(): utils.Interface {
    return new utils.Interface(checkSafeSignatureAbi);
  }

  static connect(address: string, signerOrProvider: SignerOrProvider): LegacyContract {
    return new Contract(address, checkSafeSignatureAbi, signerOrProvider) as LegacyContract;
  }
}

export class ISafe__factory extends LegacyDeploylessFactory {
  static readonly abi = safeAbi;

  static connect(address: string, signerOrProvider: SignerOrProvider): LegacySafeContract {
    return new Contract(address, this.abi, signerOrProvider) as LegacySafeContract;
  }
}

export class WildcatMarket__factory extends LegacyDeploylessFactory {
  static readonly abi = marketAbi;

  static connect(address: string, signerOrProvider: SignerOrProvider): LegacyMarketContract {
    return new Contract(address, this.abi, signerOrProvider) as LegacyMarketContract;
  }
}

export class WildcatMarketV2__factory extends LegacyDeploylessFactory {
  static readonly abi = marketAbi;

  static connect(address: string, signerOrProvider: SignerOrProvider): LegacyMarketContract {
    return new Contract(address, this.abi, signerOrProvider) as LegacyMarketContract;
  }
}

export type ISafe = LegacySafeContract;
export type WildcatMarket = LegacyMarketContract;
export type WildcatMarketV2 = LegacyMarketContract;
export type CheckBorrowersRegistered = LegacyContract;
export type CheckSafeSignature = LegacyContract;
