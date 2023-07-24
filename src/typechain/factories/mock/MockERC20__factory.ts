/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { MockERC20, MockERC20Interface } from "../../mock/MockERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    ],
    name: "nonces",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e06040523480156200001157600080fd5b5060405162001e6438038062001e648339818101604052810190620000379190620002ba565b8181601282600090816200004c91906200058a565b5081600190816200005e91906200058a565b508060ff1660808160ff16815250504660a08181525050620000856200009760201b60201c565b60c08181525050505050505062000807565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6000604051620000cb919062000720565b60405180910390207fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc646306040516020016200010c959493929190620007aa565b60405160208183030381529060405280519060200120905090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001908262000145565b810181811067ffffffffffffffff82111715620001b257620001b162000156565b5b80604052505050565b6000620001c762000127565b9050620001d5828262000185565b919050565b600067ffffffffffffffff821115620001f857620001f762000156565b5b620002038262000145565b9050602081019050919050565b60005b838110156200023057808201518184015260208101905062000213565b60008484015250505050565b6000620002536200024d84620001da565b620001bb565b90508281526020810184848401111562000272576200027162000140565b5b6200027f84828562000210565b509392505050565b600082601f8301126200029f576200029e6200013b565b5b8151620002b18482602086016200023c565b91505092915050565b60008060408385031215620002d457620002d362000131565b5b600083015167ffffffffffffffff811115620002f557620002f462000136565b5b620003038582860162000287565b925050602083015167ffffffffffffffff81111562000327576200032662000136565b5b620003358582860162000287565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200039257607f821691505b602082108103620003a857620003a76200034a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004127fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620003d3565b6200041e8683620003d3565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200046b620004656200045f8462000436565b62000440565b62000436565b9050919050565b6000819050919050565b62000487836200044a565b6200049f620004968262000472565b848454620003e0565b825550505050565b600090565b620004b6620004a7565b620004c38184846200047c565b505050565b5b81811015620004eb57620004df600082620004ac565b600181019050620004c9565b5050565b601f8211156200053a576200050481620003ae565b6200050f84620003c3565b810160208510156200051f578190505b620005376200052e85620003c3565b830182620004c8565b50505b505050565b600082821c905092915050565b60006200055f600019846008026200053f565b1980831691505092915050565b60006200057a83836200054c565b9150826002028217905092915050565b62000595826200033f565b67ffffffffffffffff811115620005b157620005b062000156565b5b620005bd825462000379565b620005ca828285620004ef565b600060209050601f831160018114620006025760008415620005ed578287015190505b620005f985826200056c565b86555062000669565b601f1984166200061286620003ae565b60005b828110156200063c5784890151825560018201915060208501945060208101905062000615565b868310156200065c578489015162000658601f8916826200054c565b8355505b6001600288020188555050505b505050505050565b600081905092915050565b60008190508160005260206000209050919050565b60008154620006a08162000379565b620006ac818662000671565b94506001821660008114620006ca5760018114620006e05762000717565b60ff198316865281151582028601935062000717565b620006eb856200067c565b60005b838110156200070f57815481890152600182019150602081019050620006ee565b838801955050505b50505092915050565b60006200072e828462000691565b915081905092915050565b6000819050919050565b6200074e8162000739565b82525050565b6200075f8162000436565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620007928262000765565b9050919050565b620007a48162000785565b82525050565b600060a082019050620007c1600083018862000743565b620007d0602083018762000743565b620007df604083018662000743565b620007ee606083018562000754565b620007fd608083018462000799565b9695505050505050565b60805160a05160c05161162d620008376000396000610713015260006106df015260006106b9015261162d6000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063a9059cbb11610066578063a9059cbb14610261578063d505accf14610291578063dd62ed3e146102ad578063de5f72fd146102dd576100ea565b806370a08231146101e35780637ecebe001461021357806395d89b4114610243576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b5780633644e515146101a957806340c10f19146101c7576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102e7565b6040516101049190610e37565b60405180910390f35b61012760048036038101906101229190610ef2565b610375565b6040516101349190610f4d565b60405180910390f35b610145610467565b6040516101529190610f77565b60405180910390f35b61017560048036038101906101709190610f92565b61046d565b6040516101829190610f4d565b60405180910390f35b6101936106b7565b6040516101a09190611001565b60405180910390f35b6101b16106db565b6040516101be9190611035565b60405180910390f35b6101e160048036038101906101dc9190610ef2565b610738565b005b6101fd60048036038101906101f89190611050565b610746565b60405161020a9190610f77565b60405180910390f35b61022d60048036038101906102289190611050565b61075e565b60405161023a9190610f77565b60405180910390f35b61024b610776565b6040516102589190610e37565b60405180910390f35b61027b60048036038101906102769190610ef2565b610804565b6040516102889190610f4d565b60405180910390f35b6102ab60048036038101906102a691906110d5565b610918565b005b6102c760048036038101906102c29190611177565b610c11565b6040516102d49190610f77565b60405180910390f35b6102e5610c36565b005b600080546102f4906111e6565b80601f0160208091040260200160405190810160405280929190818152602001828054610320906111e6565b801561036d5780601f106103425761010080835404028352916020019161036d565b820191906000526020600020905b81548152906001019060200180831161035057829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516104559190610f77565b60405180910390a36001905092915050565b60025481565b600080600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146105a35782816105229190611246565b600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b82600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105f29190611246565b9250508190555082600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516106a39190610f77565b60405180910390a360019150509392505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f000000000000000000000000000000000000000000000000000000000000000046146107115761070c610c4b565b610733565b7f00000000000000000000000000000000000000000000000000000000000000005b905090565b6107428282610cd7565b5050565b60036020528060005260406000206000915090505481565b60056020528060005260406000206000915090505481565b60018054610783906111e6565b80601f01602080910402602001604051908101604052809291908181526020018280546107af906111e6565b80156107fc5780601f106107d1576101008083540402835291602001916107fc565b820191906000526020600020905b8154815290600101906020018083116107df57829003601f168201915b505050505081565b600081600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108559190611246565b9250508190555081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516109069190610f77565b60405180910390a36001905092915050565b4284101561095b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610952906112c6565b60405180910390fd5b600060016109676106db565b7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98a8a8a600560008f73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000815480929190600101919050558b6040516020016109ef969594939291906112f5565b60405160208183030381529060405280519060200120604051602001610a169291906113ce565b6040516020818303038152906040528051906020012085858560405160008152602001604052604051610a4c9493929190611405565b6020604051602081039080840390855afa158015610a6e573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614158015610ae257508773ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b610b21576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b1890611496565b60405180910390fd5b85600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92587604051610c009190610f77565b60405180910390a350505050505050565b6004602052816000526040600020602052806000526040600020600091509150505481565b610c493368056bc75e2d63100000610738565b565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6000604051610c7d9190611559565b60405180910390207fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc64630604051602001610cbc959493929190611570565b60405160208183030381529060405280519060200120905090565b8060026000828254610ce991906115c3565b9250508190555080600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d9b9190610f77565b60405180910390a35050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610de1578082015181840152602081019050610dc6565b60008484015250505050565b6000601f19601f8301169050919050565b6000610e0982610da7565b610e138185610db2565b9350610e23818560208601610dc3565b610e2c81610ded565b840191505092915050565b60006020820190508181036000830152610e518184610dfe565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610e8982610e5e565b9050919050565b610e9981610e7e565b8114610ea457600080fd5b50565b600081359050610eb681610e90565b92915050565b6000819050919050565b610ecf81610ebc565b8114610eda57600080fd5b50565b600081359050610eec81610ec6565b92915050565b60008060408385031215610f0957610f08610e59565b5b6000610f1785828601610ea7565b9250506020610f2885828601610edd565b9150509250929050565b60008115159050919050565b610f4781610f32565b82525050565b6000602082019050610f626000830184610f3e565b92915050565b610f7181610ebc565b82525050565b6000602082019050610f8c6000830184610f68565b92915050565b600080600060608486031215610fab57610faa610e59565b5b6000610fb986828701610ea7565b9350506020610fca86828701610ea7565b9250506040610fdb86828701610edd565b9150509250925092565b600060ff82169050919050565b610ffb81610fe5565b82525050565b60006020820190506110166000830184610ff2565b92915050565b6000819050919050565b61102f8161101c565b82525050565b600060208201905061104a6000830184611026565b92915050565b60006020828403121561106657611065610e59565b5b600061107484828501610ea7565b91505092915050565b61108681610fe5565b811461109157600080fd5b50565b6000813590506110a38161107d565b92915050565b6110b28161101c565b81146110bd57600080fd5b50565b6000813590506110cf816110a9565b92915050565b600080600080600080600060e0888a0312156110f4576110f3610e59565b5b60006111028a828b01610ea7565b97505060206111138a828b01610ea7565b96505060406111248a828b01610edd565b95505060606111358a828b01610edd565b94505060806111468a828b01611094565b93505060a06111578a828b016110c0565b92505060c06111688a828b016110c0565b91505092959891949750929550565b6000806040838503121561118e5761118d610e59565b5b600061119c85828601610ea7565b92505060206111ad85828601610ea7565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806111fe57607f821691505b602082108103611211576112106111b7565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061125182610ebc565b915061125c83610ebc565b925082820390508181111561127457611273611217565b5b92915050565b7f5045524d49545f444541444c494e455f45585049524544000000000000000000600082015250565b60006112b0601783610db2565b91506112bb8261127a565b602082019050919050565b600060208201905081810360008301526112df816112a3565b9050919050565b6112ef81610e7e565b82525050565b600060c08201905061130a6000830189611026565b61131760208301886112e6565b61132460408301876112e6565b6113316060830186610f68565b61133e6080830185610f68565b61134b60a0830184610f68565b979650505050505050565b600081905092915050565b7f1901000000000000000000000000000000000000000000000000000000000000600082015250565b6000611397600283611356565b91506113a282611361565b600282019050919050565b6000819050919050565b6113c86113c38261101c565b6113ad565b82525050565b60006113d98261138a565b91506113e582856113b7565b6020820191506113f582846113b7565b6020820191508190509392505050565b600060808201905061141a6000830187611026565b6114276020830186610ff2565b6114346040830185611026565b6114416060830184611026565b95945050505050565b7f494e56414c49445f5349474e4552000000000000000000000000000000000000600082015250565b6000611480600e83610db2565b915061148b8261144a565b602082019050919050565b600060208201905081810360008301526114af81611473565b9050919050565b600081905092915050565b60008190508160005260206000209050919050565b600081546114e3816111e6565b6114ed81866114b6565b94506001821660008114611508576001811461151d57611550565b60ff1983168652811515820286019350611550565b611526856114c1565b60005b8381101561154857815481890152600182019150602081019050611529565b838801955050505b50505092915050565b600061156582846114d6565b915081905092915050565b600060a0820190506115856000830188611026565b6115926020830187611026565b61159f6040830186611026565b6115ac6060830185610f68565b6115b960808301846112e6565b9695505050505050565b60006115ce82610ebc565b91506115d983610ebc565b92508282019050808211156115f1576115f0611217565b5b9291505056fea264697066735822122094c955865ab3b140cea7d3db6d0aa2bc622475867b4c1ef32573194e8bc2142c64736f6c63430008110033";

type MockERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC20__factory extends ContractFactory {
  constructor(...args: MockERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC20> {
    return super.deploy(_name, _symbol, overrides || {}) as Promise<MockERC20>;
  }
  override getDeployTransaction(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_name, _symbol, overrides || {});
  }
  override attach(address: string): MockERC20 {
    return super.attach(address) as MockERC20;
  }
  override connect(signer: Signer): MockERC20__factory {
    return super.connect(signer) as MockERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC20Interface {
    return new utils.Interface(_abi) as MockERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC20 {
    return new Contract(address, _abi, signerOrProvider) as MockERC20;
  }
}
