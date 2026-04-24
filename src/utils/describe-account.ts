import { decodeFunctionResult, encodeAbiParameters, type Address, type Hex } from "viem";
import { accountQueryBytecode } from "../abi";
import { SignerOrProvider } from "../types";

export enum AccountKind {
  EOA = 0,
  Safe = 1,
  UnknownContract = 2
}

export type AccountDescription =
  | {
      kind: AccountKind.EOA;
      has7702Delegation: boolean;
    }
  | {
      kind: AccountKind.UnknownContract;
    }
  | {
      kind: AccountKind.Safe;
      owners: string[];
      threshold: number;
    };

const accountQueryAbi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "describeAccount",
    outputs: [
      {
        components: [
          { internalType: "enum AccountKind", name: "kind", type: "uint8" },
          { internalType: "bool", name: "has7702Delegation", type: "bool" },
          { internalType: "address[]", name: "owners", type: "address[]" },
          { internalType: "uint256", name: "threshold", type: "uint256" }
        ],
        internalType: "struct AccountDescription",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export async function describeAccount(
  provider: SignerOrProvider,
  address: string,
  blockNumber?: number
): Promise<AccountDescription> {
  const bytecode = accountQueryBytecode.concat(
    encodeAbiParameters([{ type: "address" }], [address as Address]).slice(2)
  );
  if (typeof provider.call !== "function") {
    throw new Error("Provider call support is required");
  }
  const result = await provider.call({ data: bytecode }, blockNumber);

  const {
    has7702Delegation,
    owners,
    threshold,
    kind: _kind
  } = decodeFunctionResult({
    abi: accountQueryAbi,
    functionName: "describeAccount",
    data: result as Hex
  });
  const kind = _kind as AccountKind;
  if (kind === AccountKind.EOA) return { kind, has7702Delegation };
  if (kind === AccountKind.UnknownContract) return { kind };
  return { kind, owners: [...owners], threshold: Number(threshold) };
}
