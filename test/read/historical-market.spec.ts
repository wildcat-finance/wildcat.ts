import { rejects } from "assert";
import { expect } from "chai";
import { decodeFunctionData, encodeFunctionResult, zeroAddress, type Abi } from "viem";
import { Market, MarketAccount, MarketReadError, HooksKind, SupportedChainId } from "../../src";
import { marketLensV2_5Abi } from "../../src/abi";
import { ReadIdentityMismatchError } from "../../src/internal/read-identity";
import { MarketDataBaseV2_5StructOutput } from "../../src/lens-types";
import { SignerOrProvider } from "../../src/types";
import fixture from "../fixtures/historical-sepolia-periodic-market.json";

const chainId = SupportedChainId.Sepolia;
const historical = fixture.market;
const modern = "0x0000000000000000000000000000000000000045";
const lender = "0x0000000000000000000000000000000000000001";
const principal = "0x0000000000000000000000000000000000000046";
const registry = "0x0000000000000000000000000000000000000047";
const pendingBorrower = "0x0000000000000000000000000000000000000048";
const pendingPrincipal = "0x0000000000000000000000000000000000000049";
const abi = marketLensV2_5Abi as Abi;

const modernData = {
  market: { ...fixture.base, marketToken: { ...fixture.base.marketToken, token: modern } },
  borrowerPrincipal: principal,
  pendingBorrower,
  pendingBorrowerPrincipal: pendingPrincipal,
  borrowerIdentityRegistry: registry,
  commitmentFeeBips: { isPresent: true, value: 250n },
  drawnAmount: { isPresent: true, value: 900n }
};

const lenderData = {
  lender,
  scaledBalance: 25n,
  normalizedBalance: 50n,
  underlyingBalance: 75n,
  underlyingApproval: 100n,
  isBlockedFromDeposits: false,
  lastProvider: fixture.base.hooks.pullProviders[0],
  canRefresh: true,
  lastApprovalTimestamp: 1_700_000_000,
  isKnownLender: true
};

type RpcCall = { functionName: string; args: readonly unknown[] };

// The base/live values and revert come from Sepolia block 11699651. Other addresses
// and lender balances are synthetic, to exercise mixed batches without a network.
class FixtureProvider {
  readonly calls: RpcCall[] = [];
  readonly unifiedError = Object.assign(new Error(fixture.unifiedError.message), {
    code: fixture.unifiedError.code
  });

  private readonly override?: (call: RpcCall) => unknown;

  constructor(override?: (call: RpcCall) => unknown) {
    this.override = override;
  }

  async send(method: string, params: unknown[]): Promise<unknown> {
    if (method === "eth_chainId") return "0xaa36a7";
    expect(method).to.equal("eth_call");
    const tx = params[0] as { to: string; data: `0x${string}` };
    if (tx.to.toLowerCase() !== fixture.lens.toLowerCase()) {
      throw new Error("Legacy lens must not hydrate historical V2.5 hooks");
    }
    const decoded = decodeFunctionData({ abi, data: tx.data });
    const call = { functionName: decoded.functionName, args: decoded.args ?? [] };
    this.calls.push(call);
    const overridden = this.override?.(call);
    const result = overridden === undefined ? this.result(call) : overridden;
    const resultAbi =
      call.functionName === "getLenderAccountData"
        ? abi.filter(
            (entry) =>
              entry.type === "function" &&
              entry.name === call.functionName &&
              entry.inputs[1].type === (Array.isArray(call.args[1]) ? "address[]" : "address")
          )
        : abi;
    return encodeFunctionResult({ abi: resultAbi, functionName: call.functionName, result });
  }

  private result({ functionName, args }: RpcCall): unknown {
    if (functionName === "getMarketDataV2") {
      if ((args[0] as string).toLowerCase() === historical) throw this.unifiedError;
      return modernData;
    }
    if (functionName === "getMarketsDataV2") {
      const markets = args[0] as string[];
      if (markets.some((market) => market.toLowerCase() === historical)) throw this.unifiedError;
      return markets.map(() => modernData);
    }
    if (functionName === "getMarketData") return fixture.base;
    if (functionName === "getMarketsLiveDataV2") {
      return (args[0] as string[]).map((market) =>
        market.toLowerCase() === historical
          ? fixture.live
          : {
              ...fixture.live,
              market: modern,
              commitmentFeeBips: modernData.commitmentFeeBips,
              drawnAmount: modernData.drawnAmount
            }
      );
    }
    if (functionName === "getLenderAccountData") {
      return Array.isArray(args[1]) ? args[1].map(() => lenderData) : lenderData;
    }
    throw new Error(`Unexpected lens read: ${functionName}`);
  }

  get provider(): SignerOrProvider {
    return this as unknown as SignerOrProvider;
  }
}

const assertHistoricalMarket = (market: Market): void => {
  expect(market.address.toLowerCase()).to.equal(historical);
  expect(market.hooksConfig?.kind).to.equal(HooksKind.PeriodicTerm);
  expect(market.periodicHooksConfig?.periodDuration).to.equal(360);
  expect(market.periodicHooksConfig?.withdrawalWindowDuration).to.equal(300);
  expect(market.marketKind).to.equal("revolving");
  expect(market.commitmentFeeBips).to.equal(400);
  expect(market.drawnAmount?.raw).to.equal(0n);
  expect(market.eventGeneration).to.equal("unknown");
  expect(market.borrowerPrincipal).to.equal(undefined);
  expect(market.borrowerIdentityRegistry).to.equal(undefined);
  expect(market.pendingBorrower).to.equal(undefined);
  expect(market.pendingBorrowerPrincipal).to.equal(undefined);
  expect(market.totalAssets.raw).to.equal(BigInt(fixture.live.totalAssets));
};

const containsError = (value: unknown, target: unknown): boolean => {
  if (value === target) return true;
  if (!value || typeof value !== "object") return false;
  const error = value as { cause?: unknown; fallbackError?: unknown };
  return containsError(error.cause, target) || containsError(error.fallbackError, target);
};

const marketRoutes = [
  { name: "getMarket", read: (p: SignerOrProvider) => Market.getMarket(chainId, historical, p) },
  {
    name: "getMarketV2",
    read: (p: SignerOrProvider) => Market.getMarketV2(chainId, historical, p)
  },
  {
    name: "getMarkets",
    read: async (p: SignerOrProvider) => (await Market.getMarkets(chainId, [historical], p))[0]
  },
  {
    name: "getMarketsV2",
    read: async (p: SignerOrProvider) => (await Market.getMarketsV2(chainId, [historical], p))[0]
  }
];
const accountRoutes = [
  {
    name: "getMarketAccount",
    read: (p: SignerOrProvider) => MarketAccount.getMarketAccount(chainId, p, lender, historical)
  },
  {
    name: "getMarketAccountV2",
    read: (p: SignerOrProvider) => MarketAccount.getMarketAccountV2(chainId, p, lender, historical)
  },
  {
    name: "getMarketAccountsForLender",
    read: async (p: SignerOrProvider) =>
      (await MarketAccount.getMarketAccountsForLender(chainId, p, lender, [historical]))[0]
  }
];

describe("Historical periodic market compatibility", () => {
  for (const route of marketRoutes) {
    it(`hydrates the captured historical market through ${route.name}`, async () => {
      assertHistoricalMarket(await route.read(new FixtureProvider().provider));
    });
  }

  for (const route of accountRoutes) {
    it(`retains revolving fields through ${route.name}`, async () => {
      const account = await route.read(new FixtureProvider().provider);
      assertHistoricalMarket(account.market);
      expect(account.account.toLowerCase()).to.equal(lender);
      expect(account.marketBalance.raw).to.equal(50n);
    });
  }

  for (const route of ["getMarkets", "getMarketsV2", "getMarketAccountsForLender"] as const) {
    it(`preserves modern identity metadata and input order in mixed ${route} batches`, async () => {
      const rpc = new FixtureProvider();
      const addresses = [modern, historical, modern];
      const markets =
        route === "getMarketAccountsForLender"
          ? (
              await MarketAccount.getMarketAccountsForLender(
                chainId,
                rpc.provider,
                lender,
                addresses
              )
            ).map((a) => a.market)
          : await Market[route](chainId, addresses, rpc.provider);
      expect(markets.map((market) => market.address.toLowerCase())).to.deep.equal(addresses);
      assertHistoricalMarket(markets[1]);
      for (const market of [markets[0], markets[2]]) {
        expect(market.borrowerPrincipal).to.equal(principal);
        expect(market.borrowerIdentityRegistry).to.equal(registry);
        expect(market.pendingBorrower).to.equal(pendingBorrower);
        expect(market.pendingBorrowerPrincipal).to.equal(pendingPrincipal);
        expect(market.eventGeneration).to.equal("v2.5");
        expect(market.commitmentFeeBips).to.equal(250);
        expect(market.drawnAmount?.raw).to.equal(900n);
      }
      expect(rpc.calls.filter((call) => call.functionName === "getMarketData")).to.have.lengthOf(1);
    });
  }

  it("keeps the unified batch fast path for modern markets", async () => {
    const rpc = new FixtureProvider();
    await Market.getMarketsV2(chainId, [modern, modern], rpc.provider);
    expect(rpc.calls.map((call) => call.functionName)).to.deep.equal(["getMarketsDataV2"]);
  });

  for (const fields of [
    { fee: false, drawn: false, kind: "standard" },
    { fee: true, drawn: false, kind: "unknown" },
    { fee: false, drawn: true, kind: "unknown" },
    { fee: true, drawn: true, kind: "revolving" }
  ]) {
    it(`distinguishes absent getters from zero values (${fields.fee}, ${fields.drawn})`, async () => {
      const rpc = new FixtureProvider(({ functionName }) =>
        functionName === "getMarketsLiveDataV2"
          ? [
              {
                ...fixture.live,
                commitmentFeeBips: { isPresent: fields.fee, value: 0n },
                drawnAmount: { isPresent: fields.drawn, value: 0n }
              }
            ]
          : undefined
      );
      const market = await Market.getMarketV2(chainId, historical, rpc.provider);
      expect(market.marketKind).to.equal(fields.kind);
      expect(market.commitmentFeeBips).to.equal(fields.fee ? 0 : undefined);
      expect(market.drawnAmount?.raw).to.equal(fields.drawn ? 0n : undefined);
    });
  }

  it("retains indexed context while refreshing a compatibility market", async () => {
    const rpc = new FixtureProvider();
    const market = await Market.getMarketV2(chainId, historical, rpc.provider);
    const hooks = market.hooksConfig;
    const records = market.depositRecords;
    market.stateSource = "indexed";
    market.eventGeneration = "v2.5";
    market.borrowerPrincipal = principal;
    market.borrowerIdentityRegistry = registry;
    market.pendingBorrower = pendingBorrower;
    market.pendingBorrowerPrincipal = pendingPrincipal;
    await market.update();
    expect(market.hooksConfig).to.equal(hooks);
    expect(market.depositRecords).to.equal(records);
    expect(market.stateSource).to.equal("live");
    expect(market.eventGeneration).to.equal("v2.5");
    expect(market.borrowerPrincipal).to.equal(principal);
    expect(market.borrowerIdentityRegistry).to.equal(registry);
    expect(market.pendingBorrower).to.equal(pendingBorrower);
    expect(market.pendingBorrowerPrincipal).to.equal(pendingPrincipal);
    expect(market.commitmentFeeBips).to.equal(400);
    expect(market.drawnAmount?.raw).to.equal(0n);
  });

  it("recovers market and account refreshes when bulk live reads fail", async () => {
    const rpc = new FixtureProvider(({ functionName, args }) => {
      if (
        functionName === "getMarketsLiveDataWithLenderStatusV2" ||
        (functionName === "getMarketsLiveDataV2" && (args[0] as string[]).length > 1)
      ) {
        throw new Error("Bulk live read failed");
      }
      return undefined;
    });
    const accounts = await MarketAccount.getMarketAccountsForLender(chainId, rpc.provider, lender, [
      modern,
      historical
    ]);
    const markets = accounts.map((a) => a.market);
    expect(await Market.refreshMarketsV2LiveData(chainId, markets, rpc.provider)).to.equal(markets);
    expect(
      await MarketAccount.refreshMarketAccountsV2LiveData(chainId, rpc.provider, lender, accounts)
    ).to.equal(accounts);
    assertHistoricalMarket(markets[1]);
    expect(markets[0].borrowerIdentityRegistry).to.equal(registry);
    expect(accounts[1].marketBalance.raw).to.equal(50n);
  });

  for (const route of [...marketRoutes, ...accountRoutes]) {
    it(`preserves both read failures through ${route.name}`, async () => {
      const fallbackError = Object.assign(new Error("Compatibility base unavailable"), { code: 3 });
      const rpc = new FixtureProvider(({ functionName }) => {
        if (functionName === "getMarketData") throw fallbackError;
        return undefined;
      });
      await rejects(route.read(rpc.provider), (error: unknown) => {
        expect(error).to.be.instanceOf(MarketReadError);
        expect(containsError(error, rpc.unifiedError)).to.equal(true);
        expect(containsError(error, fallbackError)).to.equal(true);
        return true;
      });
    });
  }

  it("preserves the original revert when the compatibility hooks kind is unsupported", async () => {
    const rpc = new FixtureProvider(({ functionName }) =>
      functionName === "getMarketData"
        ? {
            ...fixture.base,
            hooksConfig: { ...fixture.base.hooksConfig, kind: 0 }
          }
        : undefined
    );
    await rejects(Market.getMarketV2(chainId, historical, rpc.provider), (error: unknown) => {
      expect(error).to.be.instanceOf(MarketReadError);
      expect(containsError(error, rpc.unifiedError)).to.equal(true);
      expect((error as MarketReadError).fallbackError).to.have.property(
        "message",
        "Unknown hooks kind: PeriodicTermHooks, version #0"
      );
      return true;
    });
  });

  it("does not publish partial updates when the compatibility live read fails", async () => {
    const liveError = new Error("Live read unavailable");
    const rpc = new FixtureProvider(({ functionName }) => {
      if (functionName === "getMarketsLiveDataV2") throw liveError;
      return undefined;
    });
    const market = await Market.fromUnifiedMarketData(
      chainId,
      rpc.provider,
      fixture.base as unknown as MarketDataBaseV2_5StructOutput
    );
    market.totalAssets = market.underlyingToken.getAmount(123n);
    market.stateSource = "indexed";
    await rejects(
      market.update(),
      (error: unknown) => containsError(error, liveError) && containsError(error, rpc.unifiedError)
    );
    expect(market.totalAssets.raw).to.equal(123n);
    expect(market.stateSource).to.equal("indexed");
  });

  for (const surface of ["base", "live"] as const) {
    it(`rejects substituted ${surface} market identity without another fallback`, async () => {
      const rpc = new FixtureProvider(({ functionName }) => {
        if (surface === "base" && functionName === "getMarketData") {
          return { ...fixture.base, marketToken: { ...fixture.base.marketToken, token: modern } };
        }
        if (surface === "live" && functionName === "getMarketsLiveDataV2") {
          return [{ ...fixture.live, market: modern }];
        }
        return undefined;
      });
      await rejects(
        Market.getMarkets(chainId, [historical], rpc.provider),
        ReadIdentityMismatchError
      );
      expect(rpc.calls.filter((call) => call.functionName === "getMarketData")).to.have.lengthOf(1);
    });
  }

  it("rejects a missing compatibility live result", async () => {
    const rpc = new FixtureProvider(({ functionName }) =>
      functionName === "getMarketsLiveDataV2" ? [] : undefined
    );
    await rejects(
      Market.getMarketV2(chainId, historical, rpc.provider),
      /Live market result count mismatch/
    );
  });

  it("does not turn a failed empty batch read into success", async () => {
    const rpc = new FixtureProvider(() => {
      throw new Error("RPC unavailable");
    });
    await rejects(Market.getMarketsV2(chainId, [], rpc.provider));
    await rejects(Market.getMarkets(chainId, [], rpc.provider));
  });

  const liveIt = process.env.PTH_RPC_URL ? it : it.skip;
  liveIt("hydrates the historical market against the pinned Sepolia block", async () => {
    const rpc = {
      send: async (method: string, params: unknown[]): Promise<unknown> => {
        const response = await fetch(process.env.PTH_RPC_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method,
            params:
              method === "eth_call" ? [params[0], `0x${fixture.blockNumber.toString(16)}`] : params
          }),
          signal: AbortSignal.timeout(25_000)
        });
        if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
        const result = (await response.json()) as {
          result?: unknown;
          error?: { code: number; message: string };
        };
        if (result.error)
          throw Object.assign(new Error(result.error.message), { code: result.error.code });
        return result.result;
      }
    };
    expect(await rpc.send("eth_chainId", [])).to.equal("0xaa36a7");
    const block = (await rpc.send("eth_getBlockByNumber", [
      `0x${fixture.blockNumber.toString(16)}`,
      false
    ])) as { hash: string };
    expect(block.hash).to.equal(fixture.blockHash);
    const provider = rpc as unknown as SignerOrProvider;
    assertHistoricalMarket(await Market.getMarketV2(chainId, historical, provider));
    assertHistoricalMarket((await Market.getMarketsV2(chainId, [historical], provider))[0]);
    assertHistoricalMarket(
      (await MarketAccount.getMarketAccountV2(chainId, provider, zeroAddress, historical)).market
    );
  });
});
