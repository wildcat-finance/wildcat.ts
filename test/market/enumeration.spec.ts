import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import * as constantsModule from "../../src/constants";
import { Market } from "../../src/market";

const provider = new providers.JsonRpcProvider();

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

describe("Market global enumeration", () => {
  const originalGetArchControllerContract = constantsModule.getArchControllerContract;
  const originalGetMarkets = Market.getMarkets;
  const mutableConstants = constantsModule as typeof constantsModule & {
    getArchControllerContract: typeof originalGetArchControllerContract;
  };

  const setArchControllerContract = (contract: unknown): void => {
    const getArchControllerContract = (() => contract) as unknown;
    mutableConstants.getArchControllerContract =
      getArchControllerContract as typeof originalGetArchControllerContract;
  };

  afterEach(() => {
    mutableConstants.getArchControllerContract = originalGetArchControllerContract;
    Market.getMarkets = originalGetMarkets;
  });

  it("hydrates all registered markets from the arch controller", async () => {
    const addresses = [makeAddress(1), makeAddress(2)];
    const calls: string[][] = [];

    setArchControllerContract({
      "getRegisteredMarkets()": async () => addresses
    });

    Market.getMarkets = (async (_, markets) => {
      calls.push(markets);
      return markets as unknown as Market[];
    }) as typeof Market.getMarkets;

    const markets = await Market.getAllMarkets(constantsModule.SupportedChainId.Sepolia, provider);

    expect(calls).to.deep.equal([addresses]);
    expect(markets).to.deep.equal(addresses);
  });

  it("maps start/count pagination to arch controller start/end", async () => {
    const addresses = [makeAddress(10), makeAddress(11), makeAddress(12)];
    const rangeCalls: Array<[number, number]> = [];
    const marketCalls: string[][] = [];

    setArchControllerContract({
      getRegisteredMarketsCount: async () => BigNumber.from(addresses.length),
      "getRegisteredMarkets(uint256,uint256)": async (start: number, end: number) => {
        rangeCalls.push([start, end]);
        return addresses.slice(start, end);
      }
    });

    Market.getMarkets = (async (_, markets) => {
      marketCalls.push(markets);
      return markets as unknown as Market[];
    }) as typeof Market.getMarkets;

    const markets = await Market.getPaginatedMarkets(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      1,
      5
    );

    expect(rangeCalls).to.deep.equal([[1, 3]]);
    expect(marketCalls).to.deep.equal([[addresses[1], addresses[2]]]);
    expect(markets).to.deep.equal([addresses[1], addresses[2]]);
  });

  it("returns an empty page without querying market hydration when start is out of range", async () => {
    let getMarketsCalled = false;

    setArchControllerContract({
      getRegisteredMarketsCount: async () => BigNumber.from(2),
      "getRegisteredMarkets(uint256,uint256)": async () => {
        throw new Error("should not fetch addresses");
      }
    });

    Market.getMarkets = (async () => {
      getMarketsCalled = true;
      return [];
    }) as typeof Market.getMarkets;

    const markets = await Market.getPaginatedMarkets(
      constantsModule.SupportedChainId.Sepolia,
      provider,
      2,
      10
    );

    expect(markets).to.deep.equal([]);
    expect(getMarketsCalled).to.equal(false);
  });

  it("reads the market count from the arch controller", async () => {
    setArchControllerContract({
      getRegisteredMarketsCount: async () => BigNumber.from(7)
    });

    const count = await Market.getMarketsCount(constantsModule.SupportedChainId.Sepolia, provider);

    expect(count).to.equal(7);
  });
});
