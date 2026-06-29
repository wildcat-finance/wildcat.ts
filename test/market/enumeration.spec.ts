import { expect } from "chai";
import { providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Abi } from "viem";
import { wildcatArchControllerAbi } from "../../src/abi";
import * as constantsModule from "../../src/constants";
import { Market } from "../../src/market";

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

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

const encodeArchControllerResult = (functionName: string, result: unknown): `0x${string}` => {
  return encodeFunctionResult({
    abi: wildcatArchControllerAbi as Abi,
    functionName,
    result
  });
};

const decodeArchControllerCall = (call: FakeRpcCall) => {
  return decodeFunctionData({
    abi: wildcatArchControllerAbi as Abi,
    data: call.data as `0x${string}`
  });
};

describe("Market global enumeration", () => {
  const originalGetMarkets = Market.getMarkets;

  afterEach(() => {
    Market.getMarkets = originalGetMarkets;
  });

  it("hydrates all registered markets from the arch controller", async () => {
    const addresses = [makeAddress(1), makeAddress(2)];
    const calls: string[][] = [];
    const archControllerAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "WildcatArchController"
    );
    const viemProvider = new FakeViemProvider(() =>
      encodeArchControllerResult("getRegisteredMarkets", addresses)
    );

    Market.getMarkets = (async (_, markets) => {
      calls.push(markets);
      return markets as unknown as Market[];
    }) as typeof Market.getMarkets;

    const markets = await Market.getAllMarkets(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([archControllerAddress]);
    expect(calls).to.deep.equal([addresses]);
    expect(markets).to.deep.equal(addresses);
  });

  it("maps start/count pagination to arch controller start/end", async () => {
    const addresses = [makeAddress(10), makeAddress(11), makeAddress(12)];
    const rangeCalls: Array<[number, number]> = [];
    const marketCalls: string[][] = [];
    const archControllerAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "WildcatArchController"
    );
    const viemProvider = new FakeViemProvider((call) => {
      const { functionName, args } = decodeArchControllerCall(call);
      if (functionName === "getRegisteredMarketsCount") {
        return encodeArchControllerResult(functionName, BigInt(addresses.length));
      }

      const [start, end] = (args ?? []) as [bigint, bigint];
      rangeCalls.push([Number(start), Number(end)]);
      return encodeArchControllerResult(functionName, addresses.slice(Number(start), Number(end)));
    });

    Market.getMarkets = (async (_, markets) => {
      marketCalls.push(markets);
      return markets as unknown as Market[];
    }) as typeof Market.getMarkets;

    const markets = await Market.getPaginatedMarkets(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      1,
      5
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([
      archControllerAddress,
      archControllerAddress
    ]);
    expect(rangeCalls).to.deep.equal([[1, 3]]);
    expect(
      marketCalls.map((markets) => markets.map((market) => market.toLowerCase()))
    ).to.deep.equal([[addresses[1], addresses[2]]]);
    expect((markets as unknown as string[]).map((market) => market.toLowerCase())).to.deep.equal([
      addresses[1],
      addresses[2]
    ]);
  });

  it("returns an empty page without querying market hydration when start is out of range", async () => {
    let getMarketsCalled = false;
    const archControllerAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "WildcatArchController"
    );
    const viemProvider = new FakeViemProvider((call) => {
      const { functionName } = decodeArchControllerCall(call);
      expect(functionName).to.equal("getRegisteredMarketsCount");
      return encodeArchControllerResult(functionName, 2n);
    });

    Market.getMarkets = (async () => {
      getMarketsCalled = true;
      return [];
    }) as typeof Market.getMarkets;

    const markets = await Market.getPaginatedMarkets(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider,
      2,
      10
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([archControllerAddress]);
    expect(markets).to.deep.equal([]);
    expect(getMarketsCalled).to.equal(false);
  });

  it("reads the market count from the arch controller", async () => {
    const archControllerAddress = constantsModule.getDeploymentAddress(
      constantsModule.SupportedChainId.Sepolia,
      "WildcatArchController"
    );
    const viemProvider = new FakeViemProvider((call) => {
      const { functionName } = decodeArchControllerCall(call);
      expect(functionName).to.equal("getRegisteredMarketsCount");
      return encodeArchControllerResult(functionName, 7n);
    });

    const count = await Market.getMarketsCount(
      constantsModule.SupportedChainId.Sepolia,
      viemProvider as unknown as providers.Provider
    );

    expect(viemProvider.calls.map((call) => call.to)).to.deep.equal([archControllerAddress]);
    expect(count).to.equal(7);
  });

  it("rejects unsafe market counts like the old BigNumber conversion path", async () => {
    const viemProvider = new FakeViemProvider((call) => {
      const { functionName } = decodeArchControllerCall(call);
      expect(functionName).to.equal("getRegisteredMarketsCount");
      return encodeArchControllerResult(functionName, BigInt(Number.MAX_SAFE_INTEGER) + 1n);
    });

    let error: Error | undefined;
    try {
      await Market.getMarketsCount(
        constantsModule.SupportedChainId.Sepolia,
        viemProvider as unknown as providers.Provider
      );
    } catch (err) {
      error = err as Error;
    }

    expect(error?.message).to.contain("safe integer");
  });
});
