import { expect } from "chai";
import { BigNumber, constants, providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "../../src/abi";
import { getBorrowerHooksData } from "../../src/access";
import {
  getDeploymentAddress,
  getConfiguredHooksFactoryTargets,
  getConfiguredMarketKindForHooksFactory,
  SupportedChainId
} from "../../src/constants";
import { MarketController } from "../../src/controller";

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
  it("uses factory-scoped MarketLensV2_5 hooks reads when the unified lens is deployed", async () => {
    const borrower = makeAddress(20);
    const lensAddress = getDeploymentAddress(SupportedChainId.Sepolia, "MarketLensV2_5");
    const revolvingFactory = getDeploymentAddress(
      SupportedChainId.Sepolia,
      "HooksFactoryRevolving"
    );
    const configuredTargets = getConfiguredHooksFactoryTargets(SupportedChainId.Sepolia);
    const seenCalls: Array<[string, string]> = [];

    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2_5Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getHooksDataForBorrower");

      const [hooksFactory, argBorrower] = decoded.args as [string, string];
      seenCalls.push([hooksFactory.toLowerCase(), argBorrower.toLowerCase()]);

      const isRevolving =
        getConfiguredMarketKindForHooksFactory(SupportedChainId.Sepolia, hooksFactory) ===
        "revolving";
      const isCanonicalRevolving = hooksFactory.toLowerCase() === revolvingFactory.toLowerCase();
      const data = isRevolving
        ? makeHooksDataForBorrower(borrower, makeAddress(31), isCanonicalRevolving)
        : makeHooksDataForBorrower(borrower, makeAddress(30));

      return encodeLensResult(marketLensV2_5Abi as Abi, "getHooksDataForBorrower", data);
    });

    const result = await getBorrowerHooksData(
      SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      borrower
    );

    expect(seenCalls).to.deep.equal(
      configuredTargets.map(({ address }) => [address.toLowerCase(), borrower])
    );
    expect(result.isRegisteredBorrower).to.equal(true);
    expect(
      result.hooksTemplates.map((template) => template.hooksFactory.toLowerCase())
    ).to.deep.equal(configuredTargets.map(({ address }) => address.toLowerCase()));
    expect(result.hooksInstances).to.have.lengthOf(1);
    expect(result.hooksInstances[0].hooksFactory.toLowerCase()).to.equal(
      revolvingFactory.toLowerCase()
    );
  });

  it("uses MarketLensV2 hooks reads when the unified lens is not deployed", async () => {
    const borrower = makeAddress(21);
    const lensAddress = getDeploymentAddress(SupportedChainId.Mainnet, "MarketLensV2");
    const hooksFactory = getDeploymentAddress(SupportedChainId.Mainnet, "HooksFactoryStandard");

    const viemProvider = new FakeViemProvider((call) => {
      const decoded = decodeLensCall(marketLensV2Abi as Abi, call);
      expect(call.to).to.equal(lensAddress);
      expect(decoded.functionName).to.equal("getHooksDataForBorrower");
      expect((decoded.args as [string])[0].toLowerCase()).to.equal(borrower);

      return encodeLensResult(
        marketLensV2Abi as Abi,
        "getHooksDataForBorrower",
        makeHooksDataForBorrower(borrower, makeAddress(32), true)
      );
    });

    const result = await getBorrowerHooksData(
      SupportedChainId.Mainnet,
      viemProvider as unknown as providers.Provider,
      borrower
    );

    expect(result.hooksTemplates).to.have.lengthOf(1);
    expect(result.hooksTemplates[0].hooksFactory.toLowerCase()).to.equal(
      hooksFactory.toLowerCase()
    );
    expect(result.hooksInstances).to.have.lengthOf(1);
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
