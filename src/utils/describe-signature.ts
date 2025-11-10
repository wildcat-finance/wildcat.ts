import { defaultAbiCoder, hexlify, toUtf8Bytes } from "ethers/lib/utils";
import { DescribeSignature__factory } from "../typechain";
import { DescribeSignature } from "../typechain";
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

export async function describeSignature(
  provider: SignerOrProvider,
  address: string,
  message: string,
  signature: string
): Promise<SignatureData> {
  if (!message.startsWith("0x")) {
    const bytes = toUtf8Bytes(message);
    if (typeof bytes === "string") {
      message = bytes;
    } else {
      message = hexlify(bytes);
    }
  }
  const bytecode = DescribeSignature__factory.bytecode.concat(
    defaultAbiCoder.encode(["address", "bytes", "bytes"], [address, message, signature]).slice(2)
  );
  const result = await provider.call({ data: bytecode });

  const [{ kind: _kind, signer, subSignatures, account: _account }] =
    DescribeSignature__factory.createInterface().decodeFunctionResult(
      "describeSignature",
      result
    ) as [Awaited<ReturnType<DescribeSignature["describeSignature"]>>];

  const kind = _kind as SignatureKind;
  const { owners, threshold, kind: _accountKind } = _account;
  const accountKind = _accountKind as AccountKind;

  const account =
    accountKind === AccountKind.EOA || accountKind === AccountKind.UnknownContract
      ? {
          kind: accountKind
        }
      : {
          kind: accountKind,
          owners,
          threshold: threshold.toNumber()
        };
  return { kind, signer, subSignatures, account };
}
