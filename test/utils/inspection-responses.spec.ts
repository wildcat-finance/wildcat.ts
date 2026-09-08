import { readFileSync } from "fs";
import { createRequire } from "module";
import { join } from "path";
import { expect } from "chai";
import { defaultHardhatNetworkParams } from "hardhat/internal/core/config/default-config";
import { createProvider } from "hardhat/internal/core/providers/construction";
import type { EthereumProvider } from "hardhat/types";
import {
  concatHex,
  decodeAbiParameters,
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  hashMessage,
  keccak256,
  maxUint256,
  padHex,
  parseAbi,
  parseAbiParameters,
  stringToHex,
  toFunctionSelector,
  toHex,
  type Address,
  type Hex
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  accountQueryBytecode,
  checkSafeSignatureBytecode,
  describeSignatureBytecode
} from "../../src/abi";
import { CheckSafeSignature__factory } from "../../src/typechain";
import type { SignerOrProvider } from "../../src/types";
import { AccountKind, describeAccount } from "../../src/utils/describe-account";
import {
  describeSignature,
  SignatureKind,
  SubSignatureKind
} from "../../src/utils/describe-signature";

const safeAddress = "0x0000000000000000000000000000000000001000" as Address;
const contractOwner = "0x0000000000000000000000000000000000002000" as Address;
const genericAddress = "0x0000000000000000000000000000000000003000" as Address;
const validSafe = "0x0000000000000000000000000000000000004000" as Address;
const eoa = privateKeyToAccount(toHex(1n, { size: 32 }));
const message = "contract response inspection";
const messageBytes = stringToHex(message);
const signature = "0x1234" as Hex;
const word = (value: bigint): Hex => toHex(value, { size: 32 });
const bytesMagic = "0x20c13b0b" as Hex;
const hashMagic = "0x1626ba7e" as Hex;
const bytesResult = encodeAbiParameters([{ type: "bytes4" }], [bytesMagic]);
const hashResult = encodeAbiParameters([{ type: "bytes4" }], [hashMagic]);
const invalidResult = encodeAbiParameters([{ type: "bytes4" }], ["0xffffffff"]);
const selectors = {
  masterCopy: toFunctionSelector("masterCopy()"),
  owners: toFunctionSelector("getOwners()"),
  threshold: toFunctionSelector("getThreshold()"),
  domain: toFunctionSelector("domainSeparator()"),
  isOwner: toFunctionSelector("isOwner(address)"),
  approval: toFunctionSelector("approvedHashes(address,bytes32)")
};
const fixtureAbi = parseAbi([
  "function setResponse(bytes4 selector, bool shouldRevert, bytes data)",
  "function setCallResponse(bytes callData, bool shouldRevert, bytes data)"
]);
const signatureAbi = parseAbi([
  "function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4)"
]);
const entry = (v = 0): Hex =>
  concatHex([padHex(contractOwner, { size: 32 }), word(v === 0 ? 65n : 0n), toHex(v, { size: 1 })]);
const ownerSignature = concatHex([entry(), word(2n), signature]);
const addressArray = (addresses: Address[]): Hex =>
  encodeAbiParameters([{ type: "address[]" }], [addresses]);
const artifact = (name: string): { bytecode: Hex } =>
  JSON.parse(
    readFileSync(join(__dirname, `../../artifacts/contracts/${name}.sol/${name}.json`), "utf8")
  );

type ResponseCase = { name: string; data: Hex; reverts?: boolean };
const badWords: ResponseCase[] = [
  { name: "empty data", data: "0x" },
  { name: "a short word", data: toHex(1n, { size: 31 }) },
  { name: "a revert", data: "0x1234", reverts: true }
];
const badMagic: ResponseCase[] = [
  ...badWords,
  { name: "four unpadded bytes", data: bytesMagic },
  { name: "nonzero bytes4 padding", data: concatHex([bytesMagic, toHex(1n, { size: 28 })]) },
  { name: "the wrong magic value", data: invalidResult }
];

describe("bundled account and signature response guards", () => {
  let network: EthereumProvider;
  let sdkProvider: SignerOrProvider;
  let sender: Address;
  let snapshot: string;
  let sdkCalls = 0;

  const call = async (data: Hex): Promise<Hex> => {
    sdkCalls++;
    return (await network.request({
      method: "eth_call",
      params: [{ data, gas: "0x989680" }, "latest"]
    })) as Hex;
  };
  const configure = async (target: Address, data: Hex) => {
    await network.request({
      method: "eth_sendTransaction",
      params: [{ from: sender, to: target, data, gas: "0x989680" }]
    });
  };
  const setResponse = async (target: Address, selector: Hex, data: Hex, reverts = false) =>
    configure(
      target,
      encodeFunctionData({
        abi: fixtureAbi,
        functionName: "setResponse",
        args: [selector, reverts, data]
      })
    );
  const setCallResponse = async (target: Address, callData: Hex, data: Hex) =>
    configure(
      target,
      encodeFunctionData({
        abi: fixtureAbi,
        functionName: "setCallResponse",
        args: [callData, false, data]
      })
    );
  const setHashResponse = async (target: Address, hash: Hex, suppliedSignature: Hex) =>
    setCallResponse(
      target,
      encodeFunctionData({
        abi: signatureAbi,
        functionName: "isValidSignature",
        args: [hash, suppliedSignature]
      }),
      hashResult
    );
  const checkLegacy = async (target: Address): Promise<boolean> => {
    const { data } = new CheckSafeSignature__factory().getDeployTransaction(
      target,
      messageBytes,
      signature
    );
    return decodeAbiParameters([{ type: "bool" }], await call(data as Hex))[0];
  };
  const describeBatch = async (accounts: Address[]) => {
    const data = concatHex([
      artifact("AccountsQuery").bytecode,
      encodeAbiParameters([{ type: "address[]" }], [accounts])
    ]);
    return decodeAbiParameters(
      parseAbiParameters(
        "(uint8 kind, bool has7702Delegation, address[] owners, uint256 threshold)[]"
      ),
      await call(data)
    )[0];
  };

  before(async () => {
    network = createProvider("hardhat", {
      ...defaultHardhatNetworkParams,
      gas: "auto",
      initialDate: "2026-09-08T00:00:00.000Z",
      forking: undefined
    });
    sender = ((await network.request({ method: "eth_accounts" })) as Address[])[0];
    // Only compile the controlled responses here. Production helpers come from
    // the normal artifact/ABI generator and execute in this isolated local EVM.
    const solc = createRequire(require.resolve("hardhat/package.json"))("solc") as {
      compile: (input: string) => string;
    };
    const output = JSON.parse(
      solc.compile(
        JSON.stringify({
          language: "Solidity",
          sources: {
            "inspection-responses.sol": {
              content: readFileSync(join(__dirname, "../fixtures/inspection-responses.sol"), "utf8")
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
    const fixture = output.contracts["inspection-responses.sol"].InspectionResponseFixture;
    for (const address of [safeAddress, validSafe, genericAddress, contractOwner]) {
      await network.request({
        method: "hardhat_setCode",
        params: [address, `0x${fixture.evm.deployedBytecode.object}`]
      });
    }
    for (const address of [safeAddress, validSafe]) {
      for (const [selector, data] of [
        [selectors.masterCopy, padHex("0x41675C099F32341bf84BFc5382aF534df5C7461a", { size: 32 })],
        [selectors.owners, addressArray([contractOwner])],
        [selectors.threshold, word(1n)],
        [selectors.domain, word(1n)],
        [selectors.isOwner, word(1n)],
        [selectors.approval, word(1n)],
        [bytesMagic, bytesResult],
        [hashMagic, invalidResult]
      ] as const) {
        await setResponse(address, selector, data);
      }
    }
    await setResponse(contractOwner, bytesMagic, bytesResult);
    sdkProvider = { call: ({ data }: { data: Hex }) => call(data) } as unknown as SignerOrProvider;
    snapshot = (await network.request({ method: "evm_snapshot", params: [] })) as string;
  });

  beforeEach(async () => {
    await network.request({ method: "evm_revert", params: [snapshot] });
    snapshot = (await network.request({ method: "evm_snapshot", params: [] })) as string;
    sdkCalls = 0;
  });
  after(async () => {
    if (network) {
      await network.request({ method: "hardhat_reset", params: [] });
      network.removeAllListeners();
    }
  });

  it("ships current constructor bytecode through the viem and legacy entry points", () => {
    expect(accountQueryBytecode).to.equal(artifact("AccountQuery").bytecode);
    expect(describeSignatureBytecode).to.equal(artifact("DescribeSignature").bytecode);
    expect(checkSafeSignatureBytecode).to.equal(artifact("CheckSafeSignature").bytecode);
    expect(CheckSafeSignature__factory.bytecode).to.equal(checkSafeSignatureBytecode);
  });

  for (const { name, data, reverts } of badMagic) {
    for (const target of [genericAddress, safeAddress]) {
      it(`treats ${name} as an unsuccessful signature probe for a ${
        target === safeAddress ? "Safe" : "generic contract"
      }`, async () => {
        await setResponse(target, bytesMagic, data, reverts);
        await setResponse(target, hashMagic, data, reverts);
        const result = await describeSignature(sdkProvider, target, message, signature);
        expect(result.kind).to.equal(SignatureKind.INVALID);
        expect(result.subSignatures).to.deep.equal([]);
        expect(sdkCalls).to.equal(1);
        expect(await checkLegacy(target)).to.equal(false);
        expect(sdkCalls).to.equal(2);
      });
    }
    it(`omits a contract-owner breakdown for ${name} without changing verified validity`, async () => {
      await setResponse(contractOwner, bytesMagic, data, reverts);
      const result = await describeSignature(sdkProvider, safeAddress, message, ownerSignature);
      expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(result.subSignatures).to.deep.equal([]);
      expect(sdkCalls).to.equal(1);
    });
  }

  for (const target of [genericAddress, safeAddress]) {
    for (const [name, hash, suppliedSignature, kind] of [
      ["raw hash", keccak256(messageBytes), signature, SignatureKind.EIP1271_HASH],
      ["personal hash", hashMessage(message), signature, SignatureKind.EIP1271_PERSONAL_SIGNATURE],
      ["on-chain approval", hashMessage(message), "0x", SignatureKind.ON_CHAIN_GNOSIS_SIGNATURE]
    ] as const) {
      it(`continues to a valid ${name} after an empty bytes response (${target})`, async () => {
        await setResponse(target, bytesMagic, "0x");
        await setResponse(target, hashMagic, "0x");
        await setHashResponse(target, hash, suppliedSignature);
        const result = await describeSignature(sdkProvider, target, message, signature);
        expect(result.kind).to.equal(kind);
        expect(result.signer.toLowerCase()).to.equal(target);
        expect(sdkCalls).to.equal(1);
      });
    }
  }

  it("continues the legacy checker after a reverting bytes probe", async () => {
    await setResponse(genericAddress, bytesMagic, "0x1234", true);
    await setHashResponse(genericAddress, hashMessage(message), signature);
    expect(await checkLegacy(genericAddress)).to.equal(true);
    expect(sdkCalls).to.equal(1);
  });

  it("accepts a full magic-value word with trailing response data", async () => {
    await setResponse(genericAddress, bytesMagic, concatHex([bytesResult, "0xabcdef"]));
    expect(
      (await describeSignature(sdkProvider, genericAddress, message, signature)).kind
    ).to.equal(SignatureKind.EIP1271_BYTES);
    expect(await checkLegacy(genericAddress)).to.equal(true);
  });

  const badOwners: ResponseCase[] = [
    ...badWords,
    { name: "a missing array length", data: word(32n) },
    { name: "an offset into the head", data: concatHex([word(0n), word(0n)]) },
    { name: "an unaligned offset", data: concatHex([word(33n), "0x00", word(0n)]) },
    { name: "an overflowing offset", data: concatHex([word(maxUint256), word(0n)]) },
    { name: "an overflowing length", data: concatHex([word(32n), word(maxUint256)]) },
    {
      name: "a truncated owner array",
      data: concatHex([word(32n), word(2n), padHex(contractOwner, { size: 32 })])
    },
    {
      name: "nonzero address padding",
      data: concatHex([word(32n), word(1n), word(1n << 160n)])
    }
  ];
  for (const [selector, cases] of [
    [selectors.owners, badOwners],
    [selectors.threshold, badWords]
  ] as const) {
    for (const { name, data, reverts } of cases) {
      it(`returns UnknownContract for ${name} in ${
        selector === selectors.owners ? "owners" : "threshold"
      }, retaining generic verification and the rest of a batch`, async () => {
        await setResponse(safeAddress, selector, data, reverts);
        expect(await describeAccount(sdkProvider, safeAddress)).to.deep.equal({
          kind: AccountKind.UnknownContract
        });
        expect(sdkCalls).to.equal(1);
        const result = await describeSignature(sdkProvider, safeAddress, message, signature);
        expect(result.account).to.deep.equal({ kind: AccountKind.UnknownContract });
        expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
        expect(result.subSignatures).to.deep.equal([]);
        expect(sdkCalls).to.equal(2);
        const batch = await describeBatch([eoa.address, safeAddress, validSafe]);
        expect(batch.map(({ kind }) => kind)).to.deep.equal([
          AccountKind.EOA,
          AccountKind.UnknownContract,
          AccountKind.Safe
        ]);
        expect(batch[1].owners).to.deep.equal([]);
        expect(batch[1].threshold).to.equal(0n);
        expect(batch[2].owners).to.deep.equal([contractOwner]);
        expect(batch[2].threshold).to.equal(1n);
        expect(sdkCalls).to.equal(3);
      });
    }
  }

  for (const { name, data, reverts } of badWords) {
    it(`preserves valid and invalid signature results when the domain returns ${name}`, async () => {
      await setResponse(safeAddress, selectors.domain, data, reverts);
      const valid = await describeSignature(sdkProvider, safeAddress, message, ownerSignature);
      expect(valid.account.kind).to.equal(AccountKind.Safe);
      expect(valid.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(valid.subSignatures).to.deep.equal([]);
      await setResponse(safeAddress, bytesMagic, invalidResult);
      const invalid = await describeSignature(sdkProvider, safeAddress, message, ownerSignature);
      expect(invalid.kind).to.equal(SignatureKind.INVALID);
      expect(invalid.subSignatures).to.deep.equal([]);
      await setHashResponse(safeAddress, hashMessage(message), ownerSignature);
      const hashValid = await describeSignature(sdkProvider, safeAddress, message, ownerSignature);
      expect(hashValid.kind).to.equal(SignatureKind.EIP1271_PERSONAL_SIGNATURE);
      expect(hashValid.subSignatures).to.deep.equal([]);
      expect(sdkCalls).to.equal(3);
    });
  }

  for (const { name, data, reverts } of [
    ...badWords,
    { name: "a noncanonical boolean", data: word(2n) },
    { name: "false", data: word(0n) }
  ]) {
    it(`omits owner details when isOwner returns ${name}`, async () => {
      await setResponse(safeAddress, selectors.isOwner, data, reverts);
      const result = await describeSignature(sdkProvider, safeAddress, message, ownerSignature);
      expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(result.subSignatures).to.deep.equal([]);
      expect(sdkCalls).to.equal(1);
    });
  }

  for (const { name, data, reverts } of [...badWords, { name: "zero", data: word(0n) }]) {
    it(`omits pre-approved owner details when approvedHashes returns ${name}`, async () => {
      await setResponse(safeAddress, selectors.approval, data, reverts);
      const result = await describeSignature(sdkProvider, safeAddress, message, entry(1));
      expect(result.kind).to.equal(SignatureKind.EIP1271_BYTES);
      expect(result.subSignatures).to.deep.equal([]);
      expect(sdkCalls).to.equal(1);
    });
  }

  it("retains valid contract-owner and pre-approved details", async () => {
    const contract = await describeSignature(sdkProvider, safeAddress, message, ownerSignature);
    expect(contract.subSignatures).to.deep.equal([
      { kind: SubSignatureKind.EIP1271_BYTES, signer: contractOwner, signature }
    ]);
    await setResponse(safeAddress, selectors.approval, word(maxUint256));
    const approved = await describeSignature(sdkProvider, safeAddress, message, entry(1));
    expect(approved.subSignatures).to.deep.equal([
      { kind: SubSignatureKind.PRE_APPROVED_HASH, signer: contractOwner, signature: entry(1) }
    ]);
  });

  it("decodes complete owner arrays, including empty arrays and padded ABI offsets", async () => {
    const owners = Array.from({ length: 128 }, (_, i) =>
      getAddress(toHex(BigInt(i + 1), { size: 20 }))
    );
    for (const values of [[], [contractOwner], owners]) {
      await setResponse(safeAddress, selectors.owners, addressArray(values));
      const result = await describeAccount(sdkProvider, safeAddress);
      expect(result).to.deep.equal({ kind: AccountKind.Safe, owners: values, threshold: 1 });
    }
    await setResponse(
      safeAddress,
      selectors.owners,
      concatHex([word(64n), word(0n), word(1n), padHex(contractOwner, { size: 32 }), "0xab"])
    );
    expect(await describeAccount(sdkProvider, safeAddress)).to.deep.equal({
      kind: AccountKind.Safe,
      owners: [contractOwner],
      threshold: 1
    });
  });

  it("retains ordinary EOA classification and signature recovery", async () => {
    expect(await describeAccount(sdkProvider, eoa.address)).to.deep.equal({
      kind: AccountKind.EOA,
      has7702Delegation: false
    });
    const signed = await eoa.signMessage({ message });
    const result = await describeSignature(sdkProvider, eoa.address, message, signed);
    expect(result.kind).to.equal(SignatureKind.ECDSA_PERSONAL_SIGNATURE);
    expect(result.signer).to.equal(eoa.address);
    expect(await checkLegacy(eoa.address)).to.equal(false);
  });

  it("preserves 7702 account classification", async () => {
    await network.request({
      method: "hardhat_setCode",
      params: [genericAddress, concatHex(["0xef0100", contractOwner])]
    });
    expect(await describeAccount(sdkProvider, genericAddress)).to.deep.equal({
      kind: AccountKind.EOA,
      has7702Delegation: true
    });
  });

  it("keeps provider failures visible through both SDK inspectors", async () => {
    const error = new Error("RPC unavailable");
    const provider = {
      call: async () => {
        throw error;
      }
    } as unknown as SignerOrProvider;
    for (const inspect of [
      () => describeAccount(provider, safeAddress),
      () => describeSignature(provider, safeAddress, message, signature)
    ]) {
      let caught: unknown;
      try {
        await inspect();
      } catch (failure) {
        caught = failure;
      }
      expect(caught).to.equal(error);
    }
    expect(sdkCalls).to.equal(0);
  });
});
