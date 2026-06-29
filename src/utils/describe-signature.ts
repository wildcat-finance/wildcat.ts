import {
  decodeFunctionResult,
  encodeAbiParameters,
  stringToHex,
  type Address,
  type Hex
} from "viem";
import { describeSignatureBytecode } from "../abi";
import { SignerOrProvider } from "../types";
import { AccountDescription, AccountKind } from "./describe-account";

export enum SignatureKind {
  INVALID = 0,
  ECDSA = 1,
  ECDSA_PERSONAL_SIGNATURE = 2,
  EIP1271_BYTES = 3,
  EIP1271_HASH = 4,
  EIP1271_PERSONAL_SIGNATURE = 5,
  ON_CHAIN_GNOSIS_SIGNATURE = 6
}

export enum SubSignatureKind {
  ECDSA = 0,
  ECDSA_PERSONAL_SIGNATURE = 1,
  EIP1271_BYTES = 2,
  PRE_APPROVED_HASH = 3
}

export type SignatureData = {
  kind: SignatureKind;
  signer: string;
  subSignatures: SubSignature[];
  account: AccountDescription;
};

export type SubSignature = {
  kind: SubSignatureKind;
  signer: string;
  signature: string;
};

const describeSignatureAbi = [
  {
    inputs: [
      { internalType: "address", name: "signer", type: "address" },
      { internalType: "bytes", name: "message", type: "bytes" },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "describeSignature",
    outputs: [
      {
        components: [
          { internalType: "enum SignatureKind", name: "kind", type: "uint8" },
          { internalType: "address", name: "signer", type: "address" },
          {
            components: [
              { internalType: "enum SubSignatureKind", name: "kind", type: "uint8" },
              { internalType: "address", name: "signer", type: "address" },
              { internalType: "bytes", name: "signature", type: "bytes" }
            ],
            internalType: "struct SubSignature[]",
            name: "subSignatures",
            type: "tuple[]"
          },
          {
            components: [
              { internalType: "enum AccountKind", name: "kind", type: "uint8" },
              { internalType: "bool", name: "has7702Delegation", type: "bool" },
              { internalType: "address[]", name: "owners", type: "address[]" },
              { internalType: "uint256", name: "threshold", type: "uint256" }
            ],
            internalType: "struct AccountDescription",
            name: "account",
            type: "tuple"
          }
        ],
        internalType: "struct SignatureData",
        name: "data",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export async function describeSignature(
  provider: SignerOrProvider,
  address: string,
  message: string,
  signature: string,
  blockNumber?: number
): Promise<SignatureData> {
  const messageBytes = message.startsWith("0x") ? (message as Hex) : stringToHex(message);
  const bytecode = describeSignatureBytecode.concat(
    encodeAbiParameters(
      [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
      [address as Address, messageBytes, signature as Hex]
    ).slice(2)
  );
  if (typeof provider.call !== "function") {
    throw new Error("Provider call support is required");
  }
  const result = await provider.call({ data: bytecode }, blockNumber);

  const {
    kind: _kind,
    signer,
    subSignatures,
    account: _account
  } = decodeFunctionResult({
    abi: describeSignatureAbi,
    functionName: "describeSignature",
    data: result as Hex
  });

  const kind = _kind as SignatureKind;
  const { has7702Delegation, owners, threshold, kind: _accountKind } = _account;
  const accountKind = _accountKind as AccountKind;

  let account: AccountDescription;
  switch (accountKind) {
    case AccountKind.EOA:
      account = { kind: AccountKind.EOA, has7702Delegation };
      break;
    case AccountKind.UnknownContract:
      account = { kind: AccountKind.UnknownContract };
      break;
    case AccountKind.Safe:
      account = { kind: AccountKind.Safe, owners: [...owners], threshold: Number(threshold) };
      break;
  }
  return {
    kind,
    signer,
    subSignatures: subSignatures.map((subSignature) => ({
      kind: subSignature.kind as SubSignatureKind,
      signer: subSignature.signer,
      signature: subSignature.signature
    })),
    account
  };
}
