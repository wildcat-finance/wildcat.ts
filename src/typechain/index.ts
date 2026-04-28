import { Contract, ContractFactory, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";

import { wildcatMarketAbi } from "../abi";

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

const checkSafeSignatureBytecode =
  "0x608060405234801561000f575f80fd5b5060405161074938038061074983398181016040528101906100319190610523565b5f8390505f6320c13b0b60e01b84846040516024016100519291906105fd565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090505f808373ffffffffffffffffffffffffffffffffffffffff16836040516100d7919061066c565b5f60405180830381855afa9150503d805f811461010f576040519150601f19603f3d011682016040523d82523d5f602084013e610114565b606091505b50915091505f82801561017e57506320c13b0b60e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168280602001905181019061015d91906106d7565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050806102e1575f631626ba7e60e01b61019d896102e960201b60201c565b886040516024016101af92919061071a565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090505f808773ffffffffffffffffffffffffffffffffffffffff1683604051610235919061066c565b5f60405180830381855afa9150503d805f811461026d576040519150601f19603f3d011682016040523d82523d5f602084013e610272565b606091505b50915091508180156102db5750631626ba7e60e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916818060200190518101906102ba91906106d7565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b93505050505b805f5260205ff35b5f815160207f19457468657265756d205369676e6564204d6573736167653a0a00000000000081525f8052815b60011561033857600182039150600a81066030018253600a8104905080610316575b5080603a03602081113d3d3e80515f51178552828101816020038601209350828552505050919050565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61039c82610373565b9050919050565b6103ac81610392565b81146103b6575f80fd5b50565b5f815190506103c7816103a3565b92915050565b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61041b826103d5565b810181811067ffffffffffffffff8211171561043a576104396103e5565b5b80604052505050565b5f61044c610362565b90506104588282610412565b919050565b5f67ffffffffffffffff821115610477576104766103e5565b5b610480826103d5565b9050602081019050919050565b5f5b838110156104aa57808201518184015260208101905061048f565b5f8484015250505050565b5f6104c76104c28461045d565b610443565b9050828152602081018484840111156104e3576104e26103d1565b5b6104ee84828561048d565b509392505050565b5f82601f83011261050a576105096103cd565b5b815161051a8482602086016104b5565b91505092915050565b5f805f6060848603121561053a5761053961036b565b5b5f610547868287016103b9565b935050602084015167ffffffffffffffff8111156105685761056761036f565b5b610574868287016104f6565b925050604084015167ffffffffffffffff8111156105955761059461036f565b5b6105a1868287016104f6565b9150509250925092565b5f81519050919050565b5f82825260208201905092915050565b5f6105cf826105ab565b6105d981856105b5565b93506105e981856020860161048d565b6105f2816103d5565b840191505092915050565b5f6040820190508181035f83015261061581856105c5565b9050818103602083015261062981846105c5565b90509392505050565b5f81905092915050565b5f610646826105ab565b6106508185610632565b935061066081856020860161048d565b80840191505092915050565b5f610677828461063c565b915081905092915050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6106b681610682565b81146106c0575f80fd5b50565b5f815190506106d1816106ad565b92915050565b5f602082840312156106ec576106eb61036b565b5b5f6106f9848285016106c3565b91505092915050565b5f819050919050565b61071481610702565b82525050565b5f60408201905061072d5f83018561070b565b818103602083015261073f81846105c5565b9050939250505056fe";

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

  static createInterface() {
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

  static createInterface() {
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

  static createInterface() {
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
