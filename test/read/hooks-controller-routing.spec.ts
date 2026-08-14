import { expect } from "chai";
import { BigNumber, constants, providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import {
  borrowerIdentityRegistryAbi,
  hooksFactoryAbi,
  marketLensAbi,
  marketLensV2Abi,
  marketLensV2_5Abi,
  wildcatArchControllerAbi
} from "../../src/abi";
import { getBorrowerHooksData } from "../../src/access";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { MarketController } from "../../src/controller";
import { HooksKind, HooksTemplateRegistrationMetadata, MarketKind } from "../../src/domain";

type FakeRpcCall = {
  to?: string;
  data?: string;
};

class FakeViemProvider {
  calls: FakeRpcCall[] = [];
  private readonly getResponse: (call: FakeRpcCall) => string;

  constructor(getResponse: (call: FakeRpcCall) => string) {
    this.getResponse = getResponse;
  }

  async send(method: string, params: unknown[] = []): Promise<unknown> {
    if (method === "eth_chainId") {
      return "0xaa36a7";
    }
    if (method !== "eth_call") {
      throw new Error(`Unexpected RPC method: ${method}`);
    }

    const call = params[0] as FakeRpcCall;
    this.calls.push(call);
    return this.getResponse(call);
  }
}

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

const toViemResult = (value: unknown): unknown => {
  if (BigNumber.isBigNumber(value)) {
    return BigInt(value.toString());
  }
  if (Array.isArray(value)) {
    return value.map(toViemResult);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toViemResult(entry)])
    );
  }
  return value;
};

const encodeLensResult = (abi: Abi, functionName: string, result: unknown): `0x${string}` => {
  return encodeFunctionResult({
    abi,
    functionName,
    result: toViemResult(result)
  });
};

const decodeLensCall = (abi: Abi, call: FakeRpcCall) => {
  return decodeFunctionData({
    abi,
    data: call.data as `0x${string}`
  });
};

const makeTokenMetadata = (token: string = constants.AddressZero) => ({
  token,
  name: token === constants.AddressZero ? "" : "Origination Token",
  symbol: token === constants.AddressZero ? "" : "ORIG",
  decimals: BigNumber.from(18),
  isMock: false
});

const makeHooksFlags = () => ({
  useOnDeposit: false,
  useOnQueueWithdrawal: false,
  useOnExecuteWithdrawal: false,
  useOnTransfer: false,
  useOnBorrow: false,
  useOnRepay: false,
  useOnCloseMarket: false,
  useOnNukeFromOrbit: false,
  useOnSetMaxTotalSupply: false,
  useOnSetAnnualInterestAndReserveRatioBips: false,
  useOnSetProtocolFeeBips: false,
  useOnExecutePendingAnnualInterestBipsReduction: false
});

const makeConstraints = () => ({
  minimumDelinquencyGracePeriod: 0,
  maximumDelinquencyGracePeriod: 90 * 86_400,
  minimumReserveRatioBips: 0,
  maximumReserveRatioBips: 10_000,
  minimumDelinquencyFeeBips: 0,
  maximumDelinquencyFeeBips: 10_000,
  minimumWithdrawalBatchDuration: 0,
  maximumWithdrawalBatchDuration: 365 * 86_400,
  minimumAnnualInterestBips: 0,
  maximumAnnualInterestBips: 10_000
});

const makeHooksTemplate = (template: string, name = "OpenTermHooks") => ({
  hooksTemplate: template,
  fees: {
    feeRecipient: makeAddress(11),
    protocolFeeBips: 25,
    originationFeeToken: makeTokenMetadata(),
    originationFeeAmount: BigNumber.from(0),
    borrowerOriginationFeeBalance: BigNumber.from(0),
    borrowerOriginationFeeApproval: BigNumber.from(0)
  },
  exists: true,
  enabled: true,
  index: 0,
  name,
  totalMarkets: BigNumber.from(1)
});

const makeHooksInstance = (borrower: string, template: ReturnType<typeof makeHooksTemplate>) => ({
  hooksAddress: makeAddress(12),
  borrower,
  name: "OpenTermHooksInstance",
  kind: 1,
  hooksTemplate: template,
  constraints: makeConstraints(),
  deploymentFlags: {
    optional: makeHooksFlags(),
    required: makeHooksFlags()
  },
  pullProviders: [],
  pushProviders: [],
  totalMarkets: BigNumber.from(1)
});

const makeV2_5HooksInstance = (
  administrator: string,
  template: ReturnType<typeof makeHooksTemplate>
) => {
  const hooksInstance = makeHooksInstance(administrator, template);
  return {
    ...hooksInstance,
    administrator,
    pendingAdministrator: constants.AddressZero
  };
};

const makeTemplateRegistration = (
  hooksFactory: string,
  hooksTemplate: string,
  kind: HooksKind,
  marketKind: MarketKind,
  deploymentTarget: boolean,
  chainId: SupportedChainId = SupportedChainId.Sepolia
): HooksTemplateRegistrationMetadata => ({
  id: `${hooksFactory.toLowerCase()}-${hooksTemplate.toLowerCase()}`,
  hooksFactory: {
    address: hooksFactory,
    label: "factory",
    archController: getDeploymentAddress(chainId, "WildcatArchController"),
    sentinel: getDeploymentAddress(chainId, "WildcatSanctionsSentinel"),
    marketKind,
    generation: "v2.5",
    abiFamily: "hooks-shared-current",
    hookedMarketAbi: "base",
    configuredStartBlock: 1n,
    indexed: true,
    deploymentTarget,
    lifecycle: "active",
    configured: true,
    isRegistered: true
  },
  hooksTemplate: {
    address: hooksTemplate,
    kind,
    version: "v2.5",
    abiFamily: "hooks-shared-current"
  },
  name: "Indexed display label",
  feeRecipient: makeAddress(11),
  protocolFeeBips: 25,
  originationFeeAmount: 0n,
  isEnabled: true,
  createdAt: {
    blockNumber: 1n,
    blockTimestamp: 1n,
    transactionHash: constants.HashZero,
    logIndex: 0n
  },
  updatedAt: {
    blockNumber: 1n,
    blockTimestamp: 1n,
    transactionHash: constants.HashZero,
    logIndex: 0n
  }
});

const makeHooksDataForBorrower = (borrower: string, template: string, includeInstance = false) => {
  const hooksTemplate = makeHooksTemplate(template);
  return {
    borrower,
    isRegisteredBorrower: true,
    hooksTemplates: [hooksTemplate],
    hooksInstances: includeInstance ? [makeHooksInstance(borrower, hooksTemplate)] : []
  };
};

const makeControllerData = (borrower: string) => ({
  borrower,
  controller: makeAddress(40),
  controllerFactory: makeAddress(41),
  isRegisteredBorrower: true,
  hasDeployedController: true,
  fees: {
    feeRecipient: makeAddress(42),
    protocolFeeBips: 25,
    originationFeeToken: makeTokenMetadata(),
    originationFeeAmount: BigNumber.from(0)
  },
  constraints: makeConstraints(),
  markets: [],
  borrowerOriginationFeeBalance: BigNumber.from(0),
  borrowerOriginationFeeApproval: BigNumber.from(0)
});

describe("Hooks and controller read routing", () => {
  it("discovers active templates and preserves factory scope in V2.5 live reads", async () => {
    const borrower = makeAddress(20);
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const archController = getDeploymentAddress(SupportedChainId.Sepolia, "WildcatArchController");
    const standardFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
    const revolvingFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const futureFactory = makeAddress(99);
    const unindexedLegacyFactory = makeAddress(98);
    const sharedTemplate = makeAddress(30);
    const periodicTemplate = makeAddress(33);
    const unknownTemplate = makeAddress(34);
    const unindexedLegacyTemplate = makeAddress(35);
    const activeTemplates = [
      {
        hooksFactory: unindexedLegacyFactory,
        hooksTemplateData: makeHooksTemplate(unindexedLegacyTemplate, "Unindexed legacy template")
      },
      {
        hooksFactory: standardFactory,
        hooksTemplateData: makeHooksTemplate(sharedTemplate, "Standard display label")
      },
      {
        hooksFactory: revolvingFactory,
        hooksTemplateData: makeHooksTemplate(sharedTemplate, "Revolving display label")
      },
      {
        hooksFactory: futureFactory,
        hooksTemplateData: makeHooksTemplate(periodicTemplate, "Renamed periodic template")
      },
      {
        hooksFactory: futureFactory,
        hooksTemplateData: makeHooksTemplate(unknownTemplate, "Unknown display label")
      }
    ];
    const registrations = [
      makeTemplateRegistration(
        standardFactory,
        sharedTemplate,
        HooksKind.OpenTerm,
        "standard",
        true
      ),
      makeTemplateRegistration(
        revolvingFactory,
        sharedTemplate,
        HooksKind.OpenTerm,
        "revolving",
        true
      ),
      makeTemplateRegistration(
        futureFactory,
        periodicTemplate,
        HooksKind.PeriodicTerm,
        "unknown",
        false
      ),
      makeTemplateRegistration(futureFactory, unknownTemplate, HooksKind.Unknown, "unknown", false)
    ];
    const seenCalls: Array<[string, string]> = [];

    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === archController) {
        const decoded = decodeLensCall(wildcatArchControllerAbi as Abi, call);
        const address = (decoded.args as [string])[0].toLowerCase();
        expect(address).not.to.equal(unindexedLegacyFactory);
        if (decoded.functionName === "isRegisteredBorrower") {
          expect(address).to.equal(borrower);
          return encodeLensResult(wildcatArchControllerAbi as Abi, "isRegisteredBorrower", true);
        }
        expect(decoded.functionName).to.equal("isRegisteredController");
        return encodeLensResult(
          wildcatArchControllerAbi as Abi,
          "isRegisteredController",
          address !== futureFactory
        );
      }

      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      if (decoded.functionName === "getAggregatedHooksTemplatesForBorrowerWithFactory") {
        expect((decoded.args as [string])[0].toLowerCase()).to.equal(borrower);
        return encodeLensResult(
          marketLensV2_5Abi as Abi,
          "getAggregatedHooksTemplatesForBorrowerWithFactory",
          activeTemplates
        );
      }

      expect(decoded.functionName).to.equal("getHooksInstancesForBorrower");

      const [hooksFactory, argBorrower] = decoded.args as [string, string];
      expect(hooksFactory.toLowerCase()).not.to.equal(unindexedLegacyFactory);
      seenCalls.push([hooksFactory.toLowerCase(), argBorrower.toLowerCase()]);

      const isCanonicalRevolving = hooksFactory.toLowerCase() === revolvingFactory.toLowerCase();
      const instances = isCanonicalRevolving
        ? [makeV2_5HooksInstance(borrower, makeHooksTemplate(sharedTemplate))]
        : [];

      return encodeLensResult(marketLensV2_5Abi as Abi, "getHooksInstancesForBorrower", instances);
    });

    const result = await getBorrowerHooksData({
      chainId: SupportedChainId.Sepolia,
      signerOrProvider: viemProvider as unknown as providers.Provider,
      hooksTemplateRegistrations: registrations,
      borrower
    });

    expect(seenCalls).to.deep.equal(
      [standardFactory, revolvingFactory, futureFactory].map((hooksFactory) => [
        hooksFactory.toLowerCase(),
        borrower
      ])
    );
    expect(result.isRegisteredBorrower).to.equal(true);
    expect(
      result.hooksTemplates.map((template) => template.hooksFactory.toLowerCase())
    ).to.deep.equal(
      [standardFactory, revolvingFactory, futureFactory].map((factory) => factory.toLowerCase())
    );
    expect(result.hooksTemplates.map(({ kind }) => kind)).to.deep.equal([
      HooksKind.OpenTerm,
      HooksKind.OpenTerm,
      HooksKind.PeriodicTerm
    ]);
    expect(result.hooksTemplates.map(({ name }) => name)).to.deep.equal([
      "Standard display label",
      "Revolving display label",
      "Renamed periodic template"
    ]);
    expect(
      result.hooksTemplates.map(({ isRegisteredHooksFactory }) => isRegisteredHooksFactory)
    ).to.deep.equal([true, true, false]);
    expect(result.hooksTemplates[2].previewDeployMarket).to.be.a("function");
    expect(result.hooksInstances).to.have.lengthOf(1);
    expect(result.hooksInstances[0].hooksFactory.toLowerCase()).to.equal(
      revolvingFactory.toLowerCase()
    );
  });

  it("uses MarketLensV2 hooks reads when the unified lens is not deployed", async () => {
    const borrower = makeAddress(21);
    const lensAddress = getDeploymentAddress(SupportedChainId.Mainnet, "MarketLensV2");
    const hooksFactory = getDeploymentAddress(SupportedChainId.Mainnet, "HooksFactoryStandard");
    const archController = getDeploymentAddress(SupportedChainId.Mainnet, "WildcatArchController");
    const hooksTemplate = makeAddress(32);
    const registrations = [
      makeTemplateRegistration(
        hooksFactory,
        hooksTemplate,
        HooksKind.OpenTerm,
        "standard",
        true,
        SupportedChainId.Mainnet
      )
    ];

    const viemProvider = new FakeViemProvider((call) => {
      if (call.to === archController) {
        const decoded = decodeLensCall(wildcatArchControllerAbi as Abi, call);
        expect(decoded.functionName).to.equal("isRegisteredController");
        expect((decoded.args as [string])[0].toLowerCase()).to.equal(hooksFactory.toLowerCase());
        return encodeLensResult(wildcatArchControllerAbi as Abi, "isRegisteredController", true);
      }
      const decoded = decodeLensCall(marketLensV2Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getHooksDataForBorrower");
      expect((decoded.args as [string])[0].toLowerCase()).to.equal(borrower);

      return encodeLensResult(
        marketLensV2Abi as Abi,
        "getHooksDataForBorrower",
        makeHooksDataForBorrower(borrower, hooksTemplate, true)
      );
    });

    const result = await getBorrowerHooksData({
      chainId: SupportedChainId.Mainnet,
      signerOrProvider: viemProvider as unknown as providers.Provider,
      hooksTemplateRegistrations: registrations,
      borrower
    });

    expect(result.hooksTemplates).to.have.lengthOf(1);
    expect(result.hooksTemplates[0].hooksFactory.toLowerCase()).to.equal(
      hooksFactory.toLowerCase()
    );
    expect(result.hooksInstances).to.have.lengthOf(1);
  });

  it("resolves a borrower account through the factory identity registry", async () => {
    const account = makeAddress(23);
    const principal = makeAddress(24);
    const registry = makeAddress(25);
    const hooksTemplate = makeAddress(26);
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard");
    const archController = getDeploymentAddress(SupportedChainId.Sepolia, "WildcatArchController");
    const templates = [
      {
        hooksFactory,
        hooksTemplateData: makeHooksTemplate(hooksTemplate, "Open term")
      }
    ];
    const registrations = [
      makeTemplateRegistration(hooksFactory, hooksTemplate, HooksKind.OpenTerm, "standard", true)
    ];

    const viemProvider = new FakeViemProvider((call) => {
      const target = call.to?.toLowerCase();
      if (target === archController.toLowerCase()) {
        const decoded = decodeLensCall(wildcatArchControllerAbi as Abi, call);
        return encodeLensResult(
          wildcatArchControllerAbi as Abi,
          decoded.functionName,
          decoded.functionName === "isRegisteredController"
        );
      }
      if (target === hooksFactory.toLowerCase()) {
        const decoded = decodeLensCall(hooksFactoryAbi as Abi, call);
        expect(decoded.functionName).to.equal("borrowerIdentityRegistry");
        return encodeLensResult(hooksFactoryAbi as Abi, decoded.functionName, registry);
      }
      if (target === registry.toLowerCase()) {
        const decoded = decodeLensCall(borrowerIdentityRegistryAbi as Abi, call);
        expect(decoded.functionName).to.equal("resolveBorrower");
        expect((decoded.args as [string])[0].toLowerCase()).to.equal(account);
        return encodeLensResult(
          borrowerIdentityRegistryAbi as Abi,
          decoded.functionName,
          principal
        );
      }

      expect(target).to.equal(lensAddress.toLowerCase());
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      if (decoded.functionName === "getAggregatedHooksTemplatesForBorrowerWithFactory") {
        return encodeLensResult(marketLensV2_5Abi as Abi, decoded.functionName, templates);
      }
      expect(decoded.functionName).to.equal("getHooksInstancesForBorrower");
      return encodeLensResult(marketLensV2_5Abi as Abi, decoded.functionName, []);
    });

    const result = await getBorrowerHooksData({
      chainId: SupportedChainId.Sepolia,
      signerOrProvider: viemProvider as unknown as providers.Provider,
      hooksTemplateRegistrations: registrations,
      borrower: account
    });

    expect(result.isRegisteredBorrower).to.equal(true);
    expect(result.hooksTemplates).to.have.length(1);
    expect(result.hooksTemplates[0].isRegisteredBorrower).to.equal(true);
  });

  it("uses the legacy lens for borrower controller data", async () => {
    const borrower = makeAddress(22);
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLens");

    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensAbi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getControllerDataForBorrower");
      expect((decoded.args as [string])[0].toLowerCase()).to.equal(borrower);

      return encodeLensResult(
        marketLensAbi as Abi,
        "getControllerDataForBorrower",
        makeControllerData(borrower)
      );
    });

    const controller = await MarketController.getController(
      SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      borrower
    );

    expect(controller.borrower.toLowerCase()).to.equal(borrower);
    expect(controller.address.toLowerCase()).to.equal(makeAddress(40));
    expect(controller.isRegisteredBorrower).to.equal(true);
  });
});
