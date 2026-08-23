import { expect } from "chai";
import fs from "fs";
import path from "path";
import { encodeFunctionData, getAddress } from "viem";
import * as generatedAbis from "../../src/abi";
import {
  accessListRoleProviderAbi,
  accessListRoleProviderFactoryAbi,
  baseAccessControlsErrorAbi,
  borrowerIdentityRegistryAbi,
  hooksFactoryAbi,
  hooksFactoryRevolvingAbi,
  iFixedTermHooksAbi,
  iOpenTermHooksAbi,
  iPeriodicTermHooksAbi,
  marketLensV2Abi,
  marketLensV2_5Abi,
  wildcat4626WrapperAbi,
  wildcat4626WrapperFactoryAbi,
  wildcatArchControllerAbi,
  wildcatMarketV2Abi
} from "../../src/abi";

type AbiSpec = {
  exportName?: keyof typeof generatedAbis;
  artifact: string;
  types?: string[];
  names?: string[];
};

const root = path.join(__dirname, "../..");
const specs = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/viem-abi-specs.json"), "utf8")
) as AbiSpec[];

const filterAbi = (abi: any[], spec: AbiSpec): any[] => {
  const types = new Set(spec.types ?? ["function"]);
  const names = spec.names ? new Set(spec.names) : undefined;
  return abi.filter((item) => {
    if (!types.has(item.type)) return false;
    if (names && !names.has(item.name)) return false;
    return true;
  });
};

const getArtifactAbi = (artifactPath: string): any[] => {
  return JSON.parse(fs.readFileSync(path.join(root, artifactPath), "utf8")).abi;
};

const hasNamedComponent = (value: unknown, name: string): boolean => {
  if (Array.isArray(value)) return value.some((entry) => hasNamedComponent(entry, name));
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.name === name || Object.values(record).some((entry) => hasNamedComponent(entry, name))
  );
};

const findNamedComponent = (value: unknown, name: string): Record<string, unknown> | undefined => {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const match = findNamedComponent(entry, name);
      if (match) return match;
    }
    return undefined;
  }
  if (value === null || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  if (record.name === name) return record;
  for (const entry of Object.values(record)) {
    const match = findNamedComponent(entry, name);
    if (match) return match;
  }
  return undefined;
};

const functionNames = (abi: readonly unknown[]): string[] => {
  return abi
    .filter(
      (entry): entry is { type: "function"; name: string } =>
        typeof entry === "object" &&
        entry !== null &&
        (entry as { type?: string }).type === "function"
    )
    .map((entry) => entry.name);
};

const functionInputTypes = (abi: readonly unknown[], functionName: string): string[][] => {
  return abi
    .filter(
      (entry): entry is { type: "function"; name: string; inputs: Array<{ type: string }> } =>
        typeof entry === "object" &&
        entry !== null &&
        (entry as { type?: string }).type === "function" &&
        (entry as { name?: string }).name === functionName
    )
    .map((entry) => entry.inputs.map(({ type }) => type));
};

const eventInputShapes = (abi: readonly unknown[], eventName: string): string[][] => {
  return abi
    .filter(
      (
        entry
      ): entry is {
        type: "event";
        name: string;
        inputs: Array<{ type: string; indexed: boolean }>;
      } =>
        typeof entry === "object" &&
        entry !== null &&
        (entry as { type?: string }).type === "event" &&
        (entry as { name?: string }).name === eventName
    )
    .map((entry) => entry.inputs.map(({ type, indexed }) => `${indexed ? "indexed " : ""}${type}`));
};

const errorNames = (abi: readonly unknown[]): string[] => {
  return abi
    .filter(
      (entry): entry is { type: "error"; name: string } =>
        typeof entry === "object" && entry !== null && (entry as { type?: string }).type === "error"
    )
    .map((entry) => entry.name);
};

describe("generated viem ABIs", () => {
  it("match the configured Hardhat artifact ABI slices", () => {
    for (const spec of specs) {
      if (!spec.exportName) continue;
      expect(generatedAbis[spec.exportName]).to.deep.equal(
        filterAbi(getArtifactAbi(spec.artifact), spec)
      );
    }
  });

  it("can encode key upcoming read calls with viem", () => {
    const account = getAddress("0x0000000000000000000000000000000000000001");
    const market = getAddress("0x0000000000000000000000000000000000000002");

    expect(
      encodeFunctionData({
        abi: marketLensV2_5Abi,
        functionName: "getMarketDataV2",
        args: [market]
      })
    ).to.match(/^0x[0-9a-f]+$/);

    expect(
      encodeFunctionData({
        abi: wildcatArchControllerAbi,
        functionName: "isRegisteredBorrower",
        args: [account]
      })
    ).to.match(/^0x[0-9a-f]+$/);
  });

  it("keeps the V2.5 hook flag isolated from the legacy V2 lens tuple", () => {
    expect(
      hasNamedComponent(marketLensV2_5Abi, "useOnExecutePendingAnnualInterestBipsReduction")
    ).to.equal(true);
    expect(
      hasNamedComponent(marketLensV2Abi, "useOnExecutePendingAnnualInterestBipsReduction")
    ).to.equal(false);
  });

  it("exposes the V2.5 market and wrapper compatibility surface", () => {
    expect(functionNames(wildcatMarketV2Abi)).to.include.members([
      "acceptBorrowerTransfer",
      "allowance",
      "asset",
      "borrowerIdentityRegistry",
      "borrowerPrincipal",
      "cancelBorrowerTransfer",
      "decimals",
      "delinquencyFeeBips",
      "delinquencyGracePeriod",
      "factory",
      "feeRecipient",
      "hooks",
      "pendingBorrower",
      "pendingBorrowerPrincipal",
      "queueWithdrawalScaled",
      "registerWrapper",
      "requestBorrowerTransfer",
      "registeredWrapper",
      "scaledTransferRounding",
      "sentinel",
      "withdrawalBatchDuration",
      "wrapperFactory"
    ]);
    expect(
      encodeFunctionData({
        abi: wildcatMarketV2Abi,
        functionName: "queueWithdrawalScaled",
        args: [123n]
      }).slice(0, 10)
    ).to.equal("0x5ee883f8");
    expect(functionNames(wildcat4626WrapperFactoryAbi)).to.include.members([
      "isFloorRoundingMarket",
      "v1Factory",
      "wrapperForMarket"
    ]);
    expect(functionNames(wildcat4626WrapperAbi)).to.include("nukeFromOrbit");
  });

  it("retains legacy market events while exposing the V2.5 event signatures", () => {
    expect(eventInputShapes(wildcatMarketV2Abi, "Borrow")).to.deep.equal([
      ["uint256"],
      ["indexed address", "uint256"]
    ]);
    expect(eventInputShapes(wildcatMarketV2Abi, "FeesCollected")).to.deep.equal([
      ["uint256"],
      ["indexed address", "indexed address", "uint256"]
    ]);
    expect(eventInputShapes(wildcatMarketV2Abi, "MarketClosed")).to.deep.equal([
      ["uint256"],
      ["indexed address", "uint256"]
    ]);
    expect(
      eventInputShapes(wildcatMarketV2Abi, "AnnualInterestAndReserveRatioBipsUpdated")
    ).to.deep.equal([["indexed address", "uint256", "uint256", "uint256", "uint256"]]);
    expect(eventInputShapes(wildcatMarketV2Abi, "MaxTotalSupplyUpdated")).to.deep.equal([
      ["uint256"],
      ["indexed address", "uint256", "uint256"]
    ]);
    expect(eventInputShapes(wildcatMarketV2Abi, "ProtocolFeeBipsUpdated")).to.deep.equal([
      ["uint256"],
      ["indexed address", "uint256", "uint256"]
    ]);
  });

  it("models the complete V2.5 factory market-parameter tuple", () => {
    const expectedComponents = [
      "asset",
      "decimals",
      "packedNameWord0",
      "packedNameWord1",
      "packedSymbolWord0",
      "packedSymbolWord1",
      "borrower",
      "feeRecipient",
      "sentinel",
      "wrapperFactory",
      "maxTotalSupply",
      "protocolFeeBips",
      "annualInterestBips",
      "delinquencyFeeBips",
      "withdrawalBatchDuration",
      "reserveRatioBips",
      "delinquencyGracePeriod",
      "archController",
      "sphereXEngine",
      "hooks",
      "borrowerPrincipal",
      "borrowerIdentityRegistry"
    ];
    for (const abi of [hooksFactoryAbi, hooksFactoryRevolvingAbi]) {
      const getter = (abi as readonly any[]).find(
        (entry) => entry.type === "function" && entry.name === "getMarketParameters"
      );
      expect(getter.outputs[0].components.map(({ name }: { name: string }) => name)).to.deep.equal(
        expectedComponents
      );
      expect(functionNames(abi as readonly unknown[])).to.include.members([
        "changeSphereXEngine",
        "sphereXEngine",
        "sphereXOperator"
      ]);
    }
  });

  it("models the V2.5 periodic minimum-deposit storage width", () => {
    const getter = iPeriodicTermHooksAbi.find(
      (entry) => entry.type === "function" && entry.name === "getHookedMarket"
    );
    expect(findNamedComponent(getter, "minimumDeposit")?.type).to.equal("uint96");
    expect(functionNames(iPeriodicTermHooksAbi)).to.include.members([
      "AprReductionProposalValidityPeriods",
      "MaximumInitialWithdrawalWindowDelay",
      "MaximumPeriodDuration",
      "MinimumPeriodDuration",
      "MinimumWithdrawalWindowDuration",
      "onCreateMarket",
      "onExecuteWithdrawal",
      "temporaryExcessReserveRatio"
    ]);
    expect(functionInputTypes(iPeriodicTermHooksAbi, "onExecuteWithdrawal")).to.deep.equal([
      ["address", "uint32", "uint128", "tuple", "bytes"]
    ]);
  });

  it("models the V2.5 OpenTerm and FixedTerm hooked-market tuples", () => {
    for (const abi of [iOpenTermHooksAbi, iFixedTermHooksAbi]) {
      for (const functionName of ["getHookedMarket", "getHookedMarkets"]) {
        const getter = (abi as readonly unknown[]).find(
          (entry) =>
            typeof entry === "object" &&
            entry !== null &&
            (entry as { type?: string; name?: string }).type === "function" &&
            (entry as { type?: string; name?: string }).name === functionName
        );
        expect(hasNamedComponent(getter, "allowForceBuyBacks")).to.equal(false);
      }
      expect(functionNames(abi as readonly unknown[])).to.include("revokeRoles");
      expect(functionInputTypes(abi as readonly unknown[], "onExecuteWithdrawal")).to.deep.equal([
        ["address", "uint128", "tuple", "bytes"],
        ["address", "uint32", "uint128", "tuple", "bytes"]
      ]);
    }
  });

  it("exports the v2.5 identity and independent authority surfaces", () => {
    expect(functionNames(borrowerIdentityRegistryAbi)).to.include.members([
      "acceptBorrowerAccountPrincipalTransfer",
      "principalOf",
      "requestBorrowerAccountPrincipalTransfer",
      "resolveBorrower"
    ]);
    expect(functionNames(accessListRoleProviderAbi)).to.include.members([
      "acceptAdministratorTransfer",
      "addMembers",
      "isPullProvider",
      "removeMembers",
      "requestAdministratorTransfer"
    ]);
    expect(functionNames(accessListRoleProviderFactoryAbi)).to.include.members([
      "computeRoleProviderAddress",
      "createAccessListRoleProvider"
    ]);
    for (const abi of [iOpenTermHooksAbi, iFixedTermHooksAbi, iPeriodicTermHooksAbi]) {
      expect(functionNames(abi as readonly unknown[])).to.include.members([
        "acceptAdministratorTransfer",
        "addRoleProvider",
        "createRoleProvider",
        "isMarketTransferRecipientAllowed",
        "removeRoleProvider",
        "requestAdministratorTransfer"
      ]);
    }
    for (const abi of [hooksFactoryAbi, hooksFactoryRevolvingAbi]) {
      expect(functionNames(abi as readonly unknown[])).to.include.members([
        "borrowerIdentityRegistry",
        "getHooksAdministrator",
        "getHooksInstancesForAdministrator",
        "onHooksAdministratorTransferred"
      ]);
    }
  });

  it("exports access-control errors needed for viem revert decoding", () => {
    expect(errorNames(baseAccessControlsErrorAbi as readonly unknown[])).to.have.members([
      "AdministratorNotRegistered",
      "CallerNotAdministrator",
      "CallerNotBorrower",
      "CreateRoleProviderFailed",
      "GrantedCredentialExpired",
      "InvalidAdministratorTransferTarget",
      "InvalidArrayLength",
      "InvalidCredentialReturned",
      "InvalidCredentialTimestamp",
      "NoPendingAdministratorTransfer",
      "NotApprovedLender",
      "NotPendingAdministrator",
      "ProviderCanNotReplaceCredential",
      "ProviderCanNotRevokeCredential",
      "ProviderNotFound",
      "RoleProviderFactoryRequired"
    ]);
  });
});
