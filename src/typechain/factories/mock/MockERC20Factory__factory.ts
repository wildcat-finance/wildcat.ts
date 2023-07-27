/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  MockERC20Factory,
  MockERC20FactoryInterface,
} from "../../mock/MockERC20Factory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
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
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
    ],
    name: "NewTokenDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "deploy",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50612498806100206000396000f3fe60806040523480156200001157600080fd5b50600436106200002e5760003560e01c8063b54884871462000033575b600080fd5b6200005160048036038101906200004b919062000306565b62000069565b604051620000609190620003d0565b60405180910390f35b60008083836040516200007c9062000182565b6200008992919062000476565b604051809103906000f080158015620000a6573d6000803e3d6000fd5b5090508073ffffffffffffffffffffffffffffffffffffffff166340c10f193368056bc75e2d631000006040518363ffffffff1660e01b8152600401620000ef92919062000508565b600060405180830381600087803b1580156200010a57600080fd5b505af11580156200011f573d6000803e3d6000fd5b505050508073ffffffffffffffffffffffffffffffffffffffff167fc48153a538e96379d201c100ee70cfaf9e827cb32432ce4c889d7bbae9ec400b85856012604051620001709392919062000585565b60405180910390a28091505092915050565b611e9280620005d183390190565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001f982620001ae565b810181811067ffffffffffffffff821117156200021b576200021a620001bf565b5b80604052505050565b60006200023062000190565b90506200023e8282620001ee565b919050565b600067ffffffffffffffff821115620002615762000260620001bf565b5b6200026c82620001ae565b9050602081019050919050565b82818337600083830152505050565b60006200029f620002998462000243565b62000224565b905082815260208101848484011115620002be57620002bd620001a9565b5b620002cb84828562000279565b509392505050565b600082601f830112620002eb57620002ea620001a4565b5b8135620002fd84826020860162000288565b91505092915050565b6000806040838503121562000320576200031f6200019a565b5b600083013567ffffffffffffffff8111156200034157620003406200019f565b5b6200034f85828601620002d3565b925050602083013567ffffffffffffffff8111156200037357620003726200019f565b5b6200038185828601620002d3565b9150509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620003b8826200038b565b9050919050565b620003ca81620003ab565b82525050565b6000602082019050620003e76000830184620003bf565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015620004295780820151818401526020810190506200040c565b60008484015250505050565b60006200044282620003ed565b6200044e8185620003f8565b93506200046081856020860162000409565b6200046b81620001ae565b840191505092915050565b6000604082019050818103600083015262000492818562000435565b90508181036020830152620004a8818462000435565b90509392505050565b6000819050919050565b6000819050919050565b6000819050919050565b6000620004f0620004ea620004e484620004b1565b620004c5565b620004bb565b9050919050565b6200050281620004cf565b82525050565b60006040820190506200051f6000830185620003bf565b6200052e6020830184620004f7565b9392505050565b6000819050919050565b600060ff82169050919050565b60006200056d62000567620005618462000535565b620004c5565b6200053f565b9050919050565b6200057f816200054c565b82525050565b60006060820190508181036000830152620005a1818662000435565b90508181036020830152620005b7818562000435565b9050620005c8604083018462000574565b94935050505056fe60e06040523480156200001157600080fd5b5060405162001e9238038062001e928339818101604052810190620000379190620002ba565b8181601282600090816200004c91906200058a565b5081600190816200005e91906200058a565b508060ff1660808160ff16815250504660a08181525050620000856200009760201b60201c565b60c08181525050505050505062000807565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6000604051620000cb919062000720565b60405180910390207fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc646306040516020016200010c959493929190620007aa565b60405160208183030381529060405280519060200120905090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001908262000145565b810181811067ffffffffffffffff82111715620001b257620001b162000156565b5b80604052505050565b6000620001c762000127565b9050620001d5828262000185565b919050565b600067ffffffffffffffff821115620001f857620001f762000156565b5b620002038262000145565b9050602081019050919050565b60005b838110156200023057808201518184015260208101905062000213565b60008484015250505050565b6000620002536200024d84620001da565b620001bb565b90508281526020810184848401111562000272576200027162000140565b5b6200027f84828562000210565b509392505050565b600082601f8301126200029f576200029e6200013b565b5b8151620002b18482602086016200023c565b91505092915050565b60008060408385031215620002d457620002d362000131565b5b600083015167ffffffffffffffff811115620002f557620002f462000136565b5b620003038582860162000287565b925050602083015167ffffffffffffffff81111562000327576200032662000136565b5b620003358582860162000287565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200039257607f821691505b602082108103620003a857620003a76200034a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004127fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620003d3565b6200041e8683620003d3565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200046b620004656200045f8462000436565b62000440565b62000436565b9050919050565b6000819050919050565b62000487836200044a565b6200049f620004968262000472565b848454620003e0565b825550505050565b600090565b620004b6620004a7565b620004c38184846200047c565b505050565b5b81811015620004eb57620004df600082620004ac565b600181019050620004c9565b5050565b601f8211156200053a576200050481620003ae565b6200050f84620003c3565b810160208510156200051f578190505b620005376200052e85620003c3565b830182620004c8565b50505b505050565b600082821c905092915050565b60006200055f600019846008026200053f565b1980831691505092915050565b60006200057a83836200054c565b9150826002028217905092915050565b62000595826200033f565b67ffffffffffffffff811115620005b157620005b062000156565b5b620005bd825462000379565b620005ca828285620004ef565b600060209050601f831160018114620006025760008415620005ed578287015190505b620005f985826200056c565b86555062000669565b601f1984166200061286620003ae565b60005b828110156200063c5784890151825560018201915060208501945060208101905062000615565b868310156200065c578489015162000658601f8916826200054c565b8355505b6001600288020188555050505b505050505050565b600081905092915050565b60008190508160005260206000209050919050565b60008154620006a08162000379565b620006ac818662000671565b94506001821660008114620006ca5760018114620006e05762000717565b60ff198316865281151582028601935062000717565b620006eb856200067c565b60005b838110156200070f57815481890152600182019150602081019050620006ee565b838801955050505b50505092915050565b60006200072e828462000691565b915081905092915050565b6000819050919050565b6200074e8162000739565b82525050565b6200075f8162000436565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620007928262000765565b9050919050565b620007a48162000785565b82525050565b600060a082019050620007c1600083018862000743565b620007d0602083018762000743565b620007df604083018662000743565b620007ee606083018562000754565b620007fd608083018462000799565b9695505050505050565b60805160a05160c05161165b6200083760003960006107410152600061070d015260006106e7015261165b6000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806340c10f1911610097578063a9059cbb11610066578063a9059cbb1461028a578063d505accf146102ba578063dd62ed3e146102d6578063de5f72fd14610306576100f5565b806340c10f19146101f057806370a082311461020c5780637ecebe001461023c57806395d89b411461026c576100f5565b806323b872dd116100d357806323b872dd1461016657806328ccaa2914610196578063313ce567146101b45780633644e515146101d2576100f5565b806306fdde03146100fa578063095ea7b31461011857806318160ddd14610148575b600080fd5b610102610310565b60405161010f9190610e65565b60405180910390f35b610132600480360381019061012d9190610f20565b61039e565b60405161013f9190610f7b565b60405180910390f35b610150610490565b60405161015d9190610fa5565b60405180910390f35b610180600480360381019061017b9190610fc0565b610496565b60405161018d9190610f7b565b60405180910390f35b61019e6106e0565b6040516101ab9190610f7b565b60405180910390f35b6101bc6106e5565b6040516101c9919061102f565b60405180910390f35b6101da610709565b6040516101e79190611063565b60405180910390f35b61020a60048036038101906102059190610f20565b610766565b005b6102266004803603810190610221919061107e565b610774565b6040516102339190610fa5565b60405180910390f35b6102566004803603810190610251919061107e565b61078c565b6040516102639190610fa5565b60405180910390f35b6102746107a4565b6040516102819190610e65565b60405180910390f35b6102a4600480360381019061029f9190610f20565b610832565b6040516102b19190610f7b565b60405180910390f35b6102d460048036038101906102cf9190611103565b610946565b005b6102f060048036038101906102eb91906111a5565b610c3f565b6040516102fd9190610fa5565b60405180910390f35b61030e610c64565b005b6000805461031d90611214565b80601f016020809104026020016040519081016040528092919081815260200182805461034990611214565b80156103965780601f1061036b57610100808354040283529160200191610396565b820191906000526020600020905b81548152906001019060200180831161037957829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161047e9190610fa5565b60405180910390a36001905092915050565b60025481565b600080600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146105cc57828161054b9190611274565b600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b82600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461061b9190611274565b9250508190555082600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516106cc9190610fa5565b60405180910390a360019150509392505050565b600181565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f0000000000000000000000000000000000000000000000000000000000000000461461073f5761073a610c79565b610761565b7f00000000000000000000000000000000000000000000000000000000000000005b905090565b6107708282610d05565b5050565b60036020528060005260406000206000915090505481565b60056020528060005260406000206000915090505481565b600180546107b190611214565b80601f01602080910402602001604051908101604052809291908181526020018280546107dd90611214565b801561082a5780601f106107ff5761010080835404028352916020019161082a565b820191906000526020600020905b81548152906001019060200180831161080d57829003601f168201915b505050505081565b600081600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108839190611274565b9250508190555081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516109349190610fa5565b60405180910390a36001905092915050565b42841015610989576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610980906112f4565b60405180910390fd5b60006001610995610709565b7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98a8a8a600560008f73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000815480929190600101919050558b604051602001610a1d96959493929190611323565b60405160208183030381529060405280519060200120604051602001610a449291906113fc565b6040516020818303038152906040528051906020012085858560405160008152602001604052604051610a7a9493929190611433565b6020604051602081039080840390855afa158015610a9c573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614158015610b1057508773ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b610b4f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b46906114c4565b60405180910390fd5b85600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92587604051610c2e9190610fa5565b60405180910390a350505050505050565b6004602052816000526040600020602052806000526040600020600091509150505481565b610c773368056bc75e2d63100000610766565b565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6000604051610cab9190611587565b60405180910390207fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc64630604051602001610cea95949392919061159e565b60405160208183030381529060405280519060200120905090565b8060026000828254610d1791906115f1565b9250508190555080600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610dc99190610fa5565b60405180910390a35050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610e0f578082015181840152602081019050610df4565b60008484015250505050565b6000601f19601f8301169050919050565b6000610e3782610dd5565b610e418185610de0565b9350610e51818560208601610df1565b610e5a81610e1b565b840191505092915050565b60006020820190508181036000830152610e7f8184610e2c565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610eb782610e8c565b9050919050565b610ec781610eac565b8114610ed257600080fd5b50565b600081359050610ee481610ebe565b92915050565b6000819050919050565b610efd81610eea565b8114610f0857600080fd5b50565b600081359050610f1a81610ef4565b92915050565b60008060408385031215610f3757610f36610e87565b5b6000610f4585828601610ed5565b9250506020610f5685828601610f0b565b9150509250929050565b60008115159050919050565b610f7581610f60565b82525050565b6000602082019050610f906000830184610f6c565b92915050565b610f9f81610eea565b82525050565b6000602082019050610fba6000830184610f96565b92915050565b600080600060608486031215610fd957610fd8610e87565b5b6000610fe786828701610ed5565b9350506020610ff886828701610ed5565b925050604061100986828701610f0b565b9150509250925092565b600060ff82169050919050565b61102981611013565b82525050565b60006020820190506110446000830184611020565b92915050565b6000819050919050565b61105d8161104a565b82525050565b60006020820190506110786000830184611054565b92915050565b60006020828403121561109457611093610e87565b5b60006110a284828501610ed5565b91505092915050565b6110b481611013565b81146110bf57600080fd5b50565b6000813590506110d1816110ab565b92915050565b6110e08161104a565b81146110eb57600080fd5b50565b6000813590506110fd816110d7565b92915050565b600080600080600080600060e0888a03121561112257611121610e87565b5b60006111308a828b01610ed5565b97505060206111418a828b01610ed5565b96505060406111528a828b01610f0b565b95505060606111638a828b01610f0b565b94505060806111748a828b016110c2565b93505060a06111858a828b016110ee565b92505060c06111968a828b016110ee565b91505092959891949750929550565b600080604083850312156111bc576111bb610e87565b5b60006111ca85828601610ed5565b92505060206111db85828601610ed5565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061122c57607f821691505b60208210810361123f5761123e6111e5565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061127f82610eea565b915061128a83610eea565b92508282039050818111156112a2576112a1611245565b5b92915050565b7f5045524d49545f444541444c494e455f45585049524544000000000000000000600082015250565b60006112de601783610de0565b91506112e9826112a8565b602082019050919050565b6000602082019050818103600083015261130d816112d1565b9050919050565b61131d81610eac565b82525050565b600060c0820190506113386000830189611054565b6113456020830188611314565b6113526040830187611314565b61135f6060830186610f96565b61136c6080830185610f96565b61137960a0830184610f96565b979650505050505050565b600081905092915050565b7f1901000000000000000000000000000000000000000000000000000000000000600082015250565b60006113c5600283611384565b91506113d08261138f565b600282019050919050565b6000819050919050565b6113f66113f18261104a565b6113db565b82525050565b6000611407826113b8565b915061141382856113e5565b60208201915061142382846113e5565b6020820191508190509392505050565b60006080820190506114486000830187611054565b6114556020830186611020565b6114626040830185611054565b61146f6060830184611054565b95945050505050565b7f494e56414c49445f5349474e4552000000000000000000000000000000000000600082015250565b60006114ae600e83610de0565b91506114b982611478565b602082019050919050565b600060208201905081810360008301526114dd816114a1565b9050919050565b600081905092915050565b60008190508160005260206000209050919050565b6000815461151181611214565b61151b81866114e4565b94506001821660008114611536576001811461154b5761157e565b60ff198316865281151582028601935061157e565b611554856114ef565b60005b8381101561157657815481890152600182019150602081019050611557565b838801955050505b50505092915050565b60006115938284611504565b915081905092915050565b600060a0820190506115b36000830188611054565b6115c06020830187611054565b6115cd6040830186611054565b6115da6060830185610f96565b6115e76080830184611314565b9695505050505050565b60006115fc82610eea565b915061160783610eea565b925082820190508082111561161f5761161e611245565b5b9291505056fea2646970667358221220941ab1239bbe18307cf026e232b1b6d1ca306fb77e9b89b0588e467adeb65a7f64736f6c63430008110033a2646970667358221220f92963b0293644929b2b242e069e88e42c165dfd0503e82909460c1fb508c5d664736f6c63430008110033";

type MockERC20FactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC20FactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC20Factory__factory extends ContractFactory {
  constructor(...args: MockERC20FactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC20Factory> {
    return super.deploy(overrides || {}) as Promise<MockERC20Factory>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockERC20Factory {
    return super.attach(address) as MockERC20Factory;
  }
  override connect(signer: Signer): MockERC20Factory__factory {
    return super.connect(signer) as MockERC20Factory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC20FactoryInterface {
    return new utils.Interface(_abi) as MockERC20FactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC20Factory {
    return new Contract(address, _abi, signerOrProvider) as MockERC20Factory;
  }
}
