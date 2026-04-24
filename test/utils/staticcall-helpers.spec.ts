import { expect } from "chai";
import {
  decodeAbiParameters,
  encodeAbiParameters,
  encodeFunctionResult,
  stringToHex,
  type Address,
  type Hex
} from "viem";
import { AccountKind, checkRegisteredBorrowers, describeAccount } from "../../src";
import { Deployments, SupportedChainId } from "../../src/constants";
import {
  describeSignature,
  SignatureKind,
  SubSignatureKind
} from "../../src/utils/describe-signature";

type CallRequest = {
  data?: string;
};

class FakeCallProvider {
  calls: CallRequest[] = [];

  constructor(private readonly getResponse: (call: CallRequest, blockTag?: number) => Hex) {}

  async call(call: CallRequest, blockTag?: number): Promise<Hex> {
    this.calls.push(call);
    return this.getResponse(call, blockTag);
  }
}

const makeAddress = (suffix: number): Address => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
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

const expectBytecodeSuffix = (data: string | undefined, encodedArgs: Hex) => {
  if (!data) throw new Error("missing call data");
  expect(data.endsWith(encodedArgs.slice(2))).to.equal(true);
};

describe("staticcall helper encoding and decoding", () => {
  it("checks borrower registration with viem ABI encoding", async () => {
    const borrowers = [makeAddress(1), makeAddress(2)];
    const provider = new FakeCallProvider(() =>
      encodeAbiParameters([{ type: "bool[]" }], [[true, false]])
    );

    const result = await checkRegisteredBorrowers(
      provider as never,
      SupportedChainId.Sepolia,
      borrowers
    );

    expect(result).to.deep.equal([true, false]);
    const encodedArgs = encodeAbiParameters(
      [{ type: "address" }, { type: "address[]" }],
      [Deployments[SupportedChainId.Sepolia].WildcatArchController as Address, borrowers]
    );
    expectBytecodeSuffix(provider.calls[0].data, encodedArgs);
    const [archController, decodedBorrowers] = decodeAbiParameters(
      [{ type: "address" }, { type: "address[]" }],
      encodedArgs
    );
    expect(archController).to.equal(Deployments[SupportedChainId.Sepolia].WildcatArchController);
    expect(decodedBorrowers).to.deep.equal(borrowers);
  });

  it("describes a Safe account with viem ABI decoding", async () => {
    const account = makeAddress(3);
    const owners = [makeAddress(4), makeAddress(5)];
    const provider = new FakeCallProvider((_call, blockTag) => {
      expect(blockTag).to.equal(123);
      return encodeFunctionResult({
        abi: accountQueryAbi,
        functionName: "describeAccount",
        result: {
          kind: AccountKind.Safe,
          has7702Delegation: false,
          owners,
          threshold: 2n
        }
      });
    });

    const result = await describeAccount(provider as never, account, 123);

    expect(result).to.deep.equal({
      kind: AccountKind.Safe,
      owners,
      threshold: 2
    });
    const encodedArgs = encodeAbiParameters([{ type: "address" }], [account]);
    expectBytecodeSuffix(provider.calls[0].data, encodedArgs);
    const [decodedAccount] = decodeAbiParameters([{ type: "address" }], encodedArgs);
    expect(decodedAccount).to.equal(account);
  });

  it("describes a signature with UTF-8 message conversion and viem decoding", async () => {
    const account = makeAddress(6);
    const signer = makeAddress(7);
    const owner = makeAddress(8);
    const owners = [owner];
    const signature = "0xabcdef";
    const message = "hello";
    const messageHex = stringToHex(message);
    const provider = new FakeCallProvider(() =>
      encodeFunctionResult({
        abi: describeSignatureAbi,
        functionName: "describeSignature",
        result: {
          kind: SignatureKind.EIP1271_PERSONAL_SIGNATURE,
          signer,
          subSignatures: [
            {
              kind: SubSignatureKind.ECDSA_PERSONAL_SIGNATURE,
              signer: owner,
              signature
            }
          ],
          account: {
            kind: AccountKind.Safe,
            has7702Delegation: false,
            owners,
            threshold: 1n
          }
        }
      })
    );

    const result = await describeSignature(provider as never, account, message, signature);

    expect(result).to.deep.equal({
      kind: SignatureKind.EIP1271_PERSONAL_SIGNATURE,
      signer,
      subSignatures: [
        {
          kind: SubSignatureKind.ECDSA_PERSONAL_SIGNATURE,
          signer: owner,
          signature
        }
      ],
      account: {
        kind: AccountKind.Safe,
        owners,
        threshold: 1
      }
    });
    const encodedArgs = encodeAbiParameters(
      [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
      [account, messageHex, signature]
    );
    expectBytecodeSuffix(provider.calls[0].data, encodedArgs);
    const [decodedAccount, decodedMessage, decodedSignature] = decodeAbiParameters(
      [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
      encodedArgs
    );
    expect(decodedAccount).to.equal(account);
    expect(decodedMessage).to.equal(messageHex);
    expect(decodedSignature).to.equal(signature);
  });
});
