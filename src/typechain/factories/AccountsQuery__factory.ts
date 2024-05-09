/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { AccountsQuery, AccountsQueryInterface } from "../AccountsQuery";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "account",
        type: "address[]",
      },
    ],
    name: "describeAccounts",
    outputs: [
      {
        components: [
          {
            internalType: "enum AccountKind",
            name: "kind",
            type: "uint8",
          },
          {
            internalType: "address[]",
            name: "owners",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
        ],
        internalType: "struct AccountDescription[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801562000010575f80fd5b5060405162000c4138038062000c41833981810160405281019062000036919062000851565b5f815167ffffffffffffffff81111562000055576200005462000698565b5b6040519080825280602002602001820160405280156200009257816020015b6200007e6200063f565b815260200190600190039081620000745790505b5090505f5b82518110156200010657620000cf838281518110620000bb57620000ba620008a0565b5b60200260200101516200013460201b60201c565b828281518110620000e557620000e4620008a0565b5b60200260200101819052508080620000fd9062000903565b91505062000097565b505f816040516020016200011b919062000bbf565b6040516020818303038152906040529050805160208201f35b6200013e6200063f565b5f8273ffffffffffffffffffffffffffffffffffffffff163b0362000198575f815f0190600281111562000177576200017662000978565b5b908160028111156200018e576200018d62000978565b5b8152505062000397565b5f63a619486e5f525f806004601c865afa15620001d95760203d03620001d85760205f803e73ffffffffffffffffffffffffffffffffffffffff5f511690505b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415801562000223575062000222816200039c60201b60201c565b5b156200035e576001825f0190600281111562000244576200024362000978565b5b908160028111156200025b576200025a62000978565b5b815250505f8390508073ffffffffffffffffffffffffffffffffffffffff1663a0e67e2b6040518163ffffffff1660e01b81526004015f60405180830381865afa158015620002ac573d5f803e3d5ffd5b505050506040513d5f823e3d601f19601f82011682018060405250810190620002d6919062000851565b83602001819052508073ffffffffffffffffffffffffffffffffffffffff1663e75235b86040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000328573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906200034e919062000c10565b8360400181815250505062000395565b6002825f0190600281111562000379576200037862000978565b5b9081600281111562000390576200038f62000978565b5b815250505b505b919050565b5f73b6029ea3b2c51d09a50b53ca8012feeb05bda35a73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614806200042b57507334cfac646f301356faa8b21e94227e3583fe3f5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80620004765750736851d6fdfafd08c0295c392436245e5bc78b018573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80620004c1575073d9db270c1b5e3bd161e8c8503c55ceabee70955273ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b806200050c57507369f4d1788e39c87893c980c06edf4b7f686e293873ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80620005575750733e5c63644e683549055b9be8653de26e0b4cd36e73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80620005a2575073fb1bffc9d739b8d520daf37df666da4c687191ea73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80620005ed57507341675c099f32341bf84bfc5382af534df5c7461a73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b806200063857507329fcb43b46531bca003ddc8fcb67ffe91900c76273ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b9050919050565b60405180606001604052805f600281111562000660576200065f62000978565b5b8152602001606081526020015f81525090565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620006d08262000688565b810181811067ffffffffffffffff82111715620006f257620006f162000698565b5b80604052505050565b5f6200070662000673565b9050620007148282620006c5565b919050565b5f67ffffffffffffffff82111562000736576200073562000698565b5b602082029050602081019050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f62000776826200074b565b9050919050565b62000788816200076a565b811462000793575f80fd5b50565b5f81519050620007a6816200077d565b92915050565b5f620007c2620007bc8462000719565b620006fb565b90508083825260208201905060208402830185811115620007e857620007e762000747565b5b835b8181101562000815578062000800888262000796565b845260208401935050602081019050620007ea565b5050509392505050565b5f82601f83011262000836576200083562000684565b5b815162000848848260208601620007ac565b91505092915050565b5f602082840312156200086957620008686200067c565b5b5f82015167ffffffffffffffff81111562000889576200088862000680565b5b62000897848285016200081f565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f819050919050565b5f6200090f82620008fa565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203620009445762000943620008cd565b5b600182019050919050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b60038110620009b957620009b862000978565b5b50565b5f819050620009cb82620009a5565b919050565b5f620009dc82620009bc565b9050919050565b620009ee81620009d0565b82525050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b62000a28816200076a565b82525050565b5f62000a3b838362000a1d565b60208301905092915050565b5f602082019050919050565b5f62000a5f82620009f4565b62000a6b8185620009fe565b935062000a788362000a0e565b805f5b8381101562000aae57815162000a92888262000a2e565b975062000a9f8362000a47565b92505060018101905062000a7b565b5085935050505092915050565b62000ac681620008fa565b82525050565b5f606083015f83015162000ae35f860182620009e3565b506020830151848203602086015262000afd828262000a53565b915050604083015162000b14604086018262000abb565b508091505092915050565b5f62000b2c838362000acc565b905092915050565b5f602082019050919050565b5f62000b4c826200094f565b62000b58818562000959565b93508360208202850162000b6c8562000969565b805f5b8581101562000bad578484038952815162000b8b858262000b1f565b945062000b988362000b34565b925060208a0199505060018101905062000b6f565b50829750879550505050505092915050565b5f6020820190508181035f83015262000bd9818462000b40565b905092915050565b62000bec81620008fa565b811462000bf7575f80fd5b50565b5f8151905062000c0a8162000be1565b92915050565b5f6020828403121562000c285762000c276200067c565b5b5f62000c378482850162000bfa565b9150509291505056fe";

type AccountsQueryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AccountsQueryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AccountsQuery__factory extends ContractFactory {
  constructor(...args: AccountsQueryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "AccountsQuery";
  }

  override deploy(
    accounts: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AccountsQuery> {
    return super.deploy(accounts, overrides || {}) as Promise<AccountsQuery>;
  }
  override getDeployTransaction(
    accounts: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(accounts, overrides || {});
  }
  override attach(address: string): AccountsQuery {
    return super.attach(address) as AccountsQuery;
  }
  override connect(signer: Signer): AccountsQuery__factory {
    return super.connect(signer) as AccountsQuery__factory;
  }
  static readonly contractName: "AccountsQuery";

  public readonly contractName: "AccountsQuery";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AccountsQueryInterface {
    return new utils.Interface(_abi) as AccountsQueryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AccountsQuery {
    return new Contract(address, _abi, signerOrProvider) as AccountsQuery;
  }
}