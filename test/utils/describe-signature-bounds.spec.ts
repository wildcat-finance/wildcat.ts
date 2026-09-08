import { readFileSync } from "fs";
import { createRequire } from "module";
import { join } from "path";
import { expect } from "chai";
import { defaultHardhatNetworkParams } from "hardhat/internal/core/config/default-config";
import { createProvider } from "hardhat/internal/core/providers/construction";
import type { EthereumProvider } from "hardhat/types";
import {
  concatHex,
  encodeAbiParameters,
  encodeFunctionData,
  hashMessage,
  keccak256,
  maxUint256,
  padHex,
  parseAbi,
  size,
  sliceHex,
  stringToHex,
  toHex,
  type Address,
  type Hex
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { describeSignatureBytecode } from "../../src/abi";
import {
  describeSignature,
  SignatureKind,
  SubSignatureKind
} from "../../src/utils/describe-signature";
import { AccountKind } from "../../src/utils/describe-account";
import { SignerOrProvider } from "../../src/types";

const safeAddress = "0x0000000000000000000000000000000000001000" as Address;
const contractOwner = "0x0000000000000000000000000000000000002000" as Address;
const message = "signature inspection fixture";
const eoaOwner = privateKeyToAccount(toHex(1n, { size: 32 }));
const configureAbi = parseAbi([
  "function configure(uint256 threshold, uint256 validityMode, address[] owners)"
]);
const signatureEntry = (owner: Address, offset: bigint, v = 0): Hex =>
  concatHex([
    padHex(owner.toLowerCase() as Address, { size: 32 }),
    toHex(offset, { size: 32 }),
    toHex(v, { size: 1 })
  ]);
const dynamicSignature = (payload: Hex, offset = 65n): Hex =>
  concatHex([
    signatureEntry(contractOwner, offset),
    offset === 65n ? "0x" : toHex(0n, { size: Number(offset - 65n) }),
    toHex(size(payload), { size: 32 }),
    payload
  ]);

describe("bundled Safe signature parser bounds", () => {
  let network: EthereumProvider;
  let sdkProvider: SignerOrProvider;
  let sender: Address;
  let sdkCalls = 0;

  before(async () => {
    // Build a private in-process chain without loading the repository's fork configuration.
    network = createProvider("hardhat", {
      ...defaultHardhatNetworkParams,
      gas: "auto",
      initialDate: "2026-09-08T00:00:00.000Z",
      forking: undefined
    });
    sender = ((await network.request({ method: "eth_accounts" })) as Address[])[0];

    // Use Hardhat's own solc dependency for fixtures; the code under test is the
    // generated SDK bytecode, compiled by the project's normal artifact command.
    const solc = createRequire(require.resolve("hardhat/package.json"))("solc") as {
      compile: (input: string) => string;
    };
    const output = JSON.parse(
      solc.compile(
        JSON.stringify({
          language: "Solidity",
          sources: {
            "signature-inspection.sol": {
              content: readFileSync(join(__dirname, "../fixtures/signature-inspection.sol"), "utf8")
            }
          },
          settings: { outputSelection: { "*": { "*": ["evm.deployedBytecode.object"] } } }
        })
      )
    ) as {
      errors?: Array<{ severity: string; formattedMessage: string }>;
      contracts: Record<string, Record<string, { evm: { deployedBytecode: { object: string } } }>>;
    };
    expect(output.errors?.filter(({ severity }) => severity === "error") ?? []).to.deep.equal([]);
    const fixtures = output.contracts["signature-inspection.sol"];
    for (const [address, name] of [
      [safeAddress, "SafeInspectionFixture"],
      [contractOwner, "ContractSignerInspectionFixture"]
    ]) {
      await network.request({
        method: "hardhat_setCode",
        params: [address, `0x${fixtures[name].evm.deployedBytecode.object}`]
      });
    }
    sdkProvider = {
      call: async (transaction: { data: Hex }) => {
        sdkCalls++;
        return network.request({
          method: "eth_call",
          params: [{ ...transaction, gas: "0x989680" }, "latest"]
        });
      }
    } as unknown as SignerOrProvider;
  });

  const configure = async (
    threshold = 1n,
    validityMode = 1n,
    owners: Address[] = [contractOwner]
  ) => {
    await network.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: sender,
          to: safeAddress,
          data: encodeFunctionData({
            abi: configureAbi,
            functionName: "configure",
            args: [threshold, validityMode, owners]
          }),
          gas: "0xf4240"
        }
      ]
    });
    sdkCalls = 0;
  };

  beforeEach(async () => configure());
  after(async () => {
    if (network) {
      await network.request({ method: "hardhat_reset", params: [] });
      network.removeAllListeners();
    }
  });

  it("ships the regenerated constructor bytecode", () => {
    const artifact = JSON.parse(
      readFileSync(
        join(__dirname, "../../artifacts/contracts/DescribeSignature.sol/DescribeSignature.json"),
        "utf8"
      )
    );
    expect(describeSignatureBytecode).to.equal(artifact.bytecode);
  });

  for (const threshold of [maxUint256, maxUint256 / 65n + 1n]) {
    it(`skips a threshold outside the available static signature data (${
      threshold === maxUint256 ? "maximum" : "multiplication boundary"
    })`, async () => {
      await configure(threshold);
      const result = await describeSignature(
        sdkProvider,
        safeAddress,
        message,
        dynamicSignature("0x1234")
      );
      expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(result.subSignatures).to.deep.equal([]);
      expect(sdkCalls).to.equal(1);
    });
  }

  const malformed: Array<{ name: string; signature: Hex }> = [
    {
      name: "an offset that cannot be incremented",
      signature: signatureEntry(contractOwner, maxUint256)
    },
    { name: "an offset past the supplied bytes", signature: signatureEntry(contractOwner, 66n) },
    {
      name: "an offset inside the static signature",
      signature: signatureEntry(contractOwner, 64n)
    },
    {
      name: "a truncated length word",
      signature: concatHex([signatureEntry(contractOwner, 65n), toHex(0n, { size: 31 })])
    },
    {
      name: "a dynamic length that cannot be added to its offset",
      signature: concatHex([signatureEntry(contractOwner, 65n), toHex(maxUint256, { size: 32 })])
    },
    {
      name: "a payload shorter than its declared length",
      signature: concatHex([signatureEntry(contractOwner, 65n), toHex(2n, { size: 32 }), "0x12"])
    }
  ];
  for (const { name, signature } of malformed) {
    it(`returns an empty breakdown for ${name}`, async () => {
      const result = await describeSignature(sdkProvider, safeAddress, message, signature);
      expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(result.signer.toLowerCase()).to.equal(safeAddress);
      expect(result.account.kind).to.equal(AccountKind.Safe);
      expect(result.subSignatures).to.deep.equal([]);
      expect(sdkCalls).to.equal(1);
    });
  }

  for (const [mode, kind] of [
    [0n, SignatureKind.INVALID],
    [2n, SignatureKind.ON_CHAIN_GNOSIS_SIGNATURE]
  ] as const) {
    it(`preserves the independent signature validity result (${SignatureKind[kind]})`, async () => {
      await configure(1n, mode);
      const result = await describeSignature(
        sdkProvider,
        safeAddress,
        message,
        signatureEntry(contractOwner, maxUint256)
      );
      expect(result.kind).to.equal(kind);
      expect(result.subSignatures).to.deep.equal([]);
    });
  }

  for (const [payload, offset] of [
    ["0x1234", 65n],
    ["0x", 65n],
    ["0x1234", 72n]
  ] as const) {
    it(`retains a valid contract-owner signature with ${size(
      payload
    )} bytes at offset ${offset}`, async () => {
      const result = await describeSignature(
        sdkProvider,
        safeAddress,
        message,
        dynamicSignature(payload, offset)
      );
      expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(result.subSignatures).to.deep.equal([
        { kind: SubSignatureKind.EIP1271_BYTES, signer: contractOwner, signature: payload }
      ]);
    });
  }

  it("retains an ECDSA owner alongside a contract owner at the exact static-data boundary", async () => {
    await configure(2n, 1n, [contractOwner, eoaOwner.address]);
    const safeMessageTypeHash = keccak256(stringToHex("SafeMessage(bytes message)"));
    const safeMessageHash = keccak256(
      encodeAbiParameters(
        [{ type: "bytes32" }, { type: "bytes32" }],
        [safeMessageTypeHash, keccak256(hashMessage(message))]
      )
    );
    const digest = keccak256(concatHex(["0x1901", toHex(1n, { size: 32 }), safeMessageHash]));
    const ownerSignature = await eoaOwner.sign({ hash: digest });
    const signature = concatHex([
      signatureEntry(contractOwner, 130n),
      ownerSignature,
      toHex(2n, { size: 32 }),
      "0x1234"
    ]);
    const result = await describeSignature(sdkProvider, safeAddress, message, signature);
    expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
    expect(
      result.subSignatures.map(({ signer, kind }) => [signer.toLowerCase(), kind])
    ).to.deep.equal([
      [contractOwner, SubSignatureKind.EIP1271_BYTES],
      [eoaOwner.address.toLowerCase(), SubSignatureKind.ECDSA]
    ]);
  });

  it("retains the Safe personal-sign owner path", async () => {
    await configure(1n, 1n, [eoaOwner.address]);
    const typeHash = keccak256(stringToHex("SafeMessage(bytes message)"));
    const typedMessageHash = keccak256(
      encodeAbiParameters(
        [{ type: "bytes32" }, { type: "bytes32" }],
        [typeHash, keccak256(hashMessage(message))]
      )
    );
    const digest = keccak256(concatHex(["0x1901", toHex(1n, { size: 32 }), typedMessageHash]));
    const signed = await eoaOwner.signMessage({ message: { raw: digest } });
    const signature = concatHex([
      sliceHex(signed, 0, 64),
      toHex(Number(sliceHex(signed, 64)) + 4, { size: 1 })
    ]);
    const result = await describeSignature(sdkProvider, safeAddress, message, signature);
    expect(result.subSignatures).to.deep.equal([
      {
        kind: SubSignatureKind.ECDSA_PERSONAL_SIGNATURE,
        signer: eoaOwner.address,
        signature: signed
      }
    ]);
  });

  it("retains a pre-approved owner hash", async () => {
    await configure(1n, 1n, [eoaOwner.address]);
    const signature = signatureEntry(eoaOwner.address, 0n, 1);
    const result = await describeSignature(sdkProvider, safeAddress, message, signature);
    expect(result.subSignatures).to.deep.equal([
      { kind: SubSignatureKind.PRE_APPROVED_HASH, signer: eoaOwner.address, signature }
    ]);
  });

  it("keeps a truncated static signature from becoming a signer breakdown", async () => {
    await configure(2n);
    const result = await describeSignature(
      sdkProvider,
      safeAddress,
      message,
      dynamicSignature("0x1234")
    );
    expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
    expect(result.subSignatures).to.deep.equal([]);
  });
});
