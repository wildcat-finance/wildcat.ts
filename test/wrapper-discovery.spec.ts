import { rejects } from "assert";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation
} from "@apollo/client";
import { expect } from "chai";
import { BigNumber, constants, providers, utils } from "ethers";
import { GraphQLError, print } from "graphql";
import { getDeploymentAddress, SupportedChainId } from "../src/constants";
import {
  IERC20__factory,
  Wildcat4626Wrapper__factory,
  Wildcat4626WrapperFactory__factory
} from "../src/typechain";
import {
  GetTokenWrapperForMarketDocument,
  GetWrappedMarketsPageDocument,
  getTokenWrapperDataForMarket,
  getWrappedMarketsPage,
  SubgraphTokenWrapperData,
  TokenWrapper
} from "../src/wrapper";

const market = "0x00000000000000000000000000000000000000ab";
const wrapperAddress = "0x00000000000000000000000000000000000000cd";
const otherAddress = "0x00000000000000000000000000000000000000ef";
const chainId = SupportedChainId.Sepolia;
const factoryAddress = getDeploymentAddress(chainId, "Wildcat4626WrapperFactory");

const makeWrapper = (
  marketAddress = market,
  address = wrapperAddress
): SubgraphTokenWrapperData => ({
  __typename: "Wildcat4626Wrapper",
  id: address,
  address,
  marketAddress,
  marketToken: {
    __typename: "Token",
    id: marketAddress,
    address: marketAddress,
    name: "Market Token",
    symbol: "MKT",
    decimals: 6,
    isMock: false
  },
  token: {
    __typename: "Token",
    id: address,
    address,
    name: "Wrapper Shares",
    symbol: "WMKT",
    decimals: 6,
    isMock: false
  },
  factory: { __typename: "Wildcat4626WrapperFactory", id: factoryAddress, address: factoryAddress },
  deployedEvent: {
    __typename: "Wildcat4626WrapperDeployed",
    blockNumber: 100,
    blockTimestamp: 200,
    transactionHash: `0x${"1".repeat(64)}`
  }
});

const metadata = (number = 123) => ({
  __typename: "_Meta_",
  deployment: "test-deployment",
  hasIndexingErrors: false,
  block: {
    __typename: "_Block_",
    number,
    timestamp: 456,
    hash: `0x${"a".repeat(64)}`
  }
});

const makeMarket = (id = market, address = wrapperAddress) => ({
  __typename: "Market",
  id,
  name: "Market Token",
  tokenWrapper: makeWrapper(id, address)
});

const createClient = (
  handler: (operation: Operation) => {
    data?: Record<string, unknown>;
    errors?: GraphQLError[];
  }
): { client: ApolloClient<NormalizedCacheObject>; operations: Operation[] } => {
  const operations: Operation[] = [];
  const link = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        operations.push(operation);
        try {
          observer.next(handler(operation));
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })
  );
  return {
    client: new ApolloClient({
      cache: new InMemoryCache(),
      link,
      // Discovery must reject GraphQL errors even with a permissive client default.
      defaultOptions: { query: { errorPolicy: "all" } }
    }),
    operations
  };
};

class FakeProvider extends providers.StaticJsonRpcProvider {
  calls: Array<{ to: string; functionName: string }> = [];

  constructor(private readonly registeredWrapper?: string) {
    super(undefined, { name: "sepolia", chainId });
  }

  async call(transaction: providers.TransactionRequest): Promise<string> {
    const to = String(await transaction.to).toLowerCase();
    const iface =
      to === factoryAddress.toLowerCase()
        ? Wildcat4626WrapperFactory__factory.createInterface()
        : to === wrapperAddress
        ? Wildcat4626Wrapper__factory.createInterface()
        : IERC20__factory.createInterface();
    const { name: functionName } = iface.parseTransaction({
      data: utils.hexlify((await transaction.data) ?? "0x")
    });
    this.calls.push({ to, functionName });
    if (this.registeredWrapper === undefined) throw new Error("Unexpected RPC call");
    const values: Record<string, unknown> = {
      wrapperForMarket: this.registeredWrapper,
      market,
      name: to === wrapperAddress ? "Wrapper Shares" : "Market Token",
      symbol: to === wrapperAddress ? "WMKT" : "MKT",
      decimals: 6,
      assetsPerShareRay: "1000000000000000000000000000"
    };
    if (!(functionName in values)) throw new Error(`Unhandled RPC function: ${functionName}`);
    return iface.encodeFunctionResult(functionName, [values[functionName]]);
  }
}

describe("maintenance wrapper discovery", () => {
  it("returns complete indexed metadata and provenance with normalized market variables", async () => {
    const data = makeWrapper();
    const { client, operations } = createClient(() => ({ data: { market: makeMarket() } }));
    const result = await getTokenWrapperDataForMarket(client, market.toUpperCase(), "no-cache");
    expect(result).to.deep.equal(data);
    expect(operations[0].variables).to.deep.equal({ market });
    expect(operations[0].operationName).to.equal("getTokenWrapperForMarket");
  });

  it("hydrates the existing ethers wrapper without contract reads", async () => {
    const provider = new FakeProvider();
    const { client } = createClient(() => ({ data: { market: makeMarket() } }));
    const wrapper = await TokenWrapper.fromMarketWithSubgraph(client, {
      chainId,
      signerOrProvider: provider,
      market
    });
    expect(wrapper).to.be.instanceOf(TokenWrapper);
    expect(wrapper?.marketAddress).to.equal(market);
    expect(wrapper?.shareToken.address).to.equal(wrapperAddress);
    expect(wrapper?.marketToken.symbol).to.equal("MKT");
    expect(wrapper?.symbol).to.equal("WMKT");
    expect(wrapper?.decimals).to.equal(6);
    expect(provider.calls).to.deep.equal([]);
  });

  for (const field of ["rootMarket", "parentMarket", "marketToken", "shareToken"] as const) {
    it(`rejects a mismatched ${field} without RPC fallback`, async () => {
      const data = makeMarket();
      if (field === "rootMarket") data.id = otherAddress;
      if (field === "parentMarket") data.tokenWrapper.marketAddress = otherAddress;
      if (field === "marketToken") data.tokenWrapper.marketToken.address = otherAddress;
      if (field === "shareToken") data.tokenWrapper.token.address = otherAddress;
      const { client } = createClient(() => ({ data: { market: data } }));
      const provider = new FakeProvider();
      await rejects(
        TokenWrapper.fromMarketWithSubgraph(client, {
          chainId,
          signerOrProvider: provider,
          market
        }),
        { name: "ReadIdentityMismatchError" }
      );
      expect(provider.calls).to.deep.equal([]);
    });
  }

  it("validates token identities when hydrating a raw DTO directly", () => {
    for (const key of ["marketToken", "token"] as const) {
      const data = makeWrapper();
      data[key].address = otherAddress;
      expect(() => TokenWrapper.fromSubgraphData(chainId, new FakeProvider(), data)).to.throw(
        "address mismatch"
      );
    }
  });

  for (const indexedMarket of [null, { __typename: "Market", id: market, tokenWrapper: null }]) {
    it(`returns undefined for ${
      indexedMarket ? "an unwrapped" : "an unindexed"
    } market with fallback disabled`, async () => {
      const { client } = createClient(() => ({ data: { market: indexedMarket } }));
      const provider = new FakeProvider();
      expect(
        await TokenWrapper.fromMarketWithSubgraph(client, {
          chainId,
          signerOrProvider: provider,
          market,
          fallbackToFactory: false
        })
      ).to.equal(undefined);
      expect(provider.calls).to.deep.equal([]);
    });
  }

  for (const response of ["missing", "error"] as const) {
    it(`uses the legacy registry and ethers metadata reads when indexed data is ${response}`, async () => {
      const { client } = createClient(() => {
        if (response === "error") throw new Error("Subgraph unavailable");
        return { data: { market: null } };
      });
      const provider = new FakeProvider(wrapperAddress);
      const wrapper = await TokenWrapper.fromMarketWithSubgraph(client, {
        chainId,
        signerOrProvider: provider,
        market
      });
      expect(wrapper?.address.toLowerCase()).to.equal(wrapperAddress);
      expect(wrapper?.symbol).to.equal("WMKT");
      expect(provider.calls).to.have.length(8);
      expect(provider.calls[0]).to.deep.equal({
        to: factoryAddress.toLowerCase(),
        functionName: "wrapperForMarket"
      });
      expect(BigNumber.isBigNumber(await wrapper!.assetsPerShareRay())).to.equal(true);
    });
  }

  it("does not hydrate a zero-address registry result", async () => {
    const { client } = createClient(() => ({ data: { market: null } }));
    const provider = new FakeProvider(constants.AddressZero);
    expect(
      await TokenWrapper.fromMarketWithSubgraph(client, {
        chainId,
        signerOrProvider: provider,
        market
      })
    ).to.equal(undefined);
    expect(provider.calls).to.have.length(1);
  });

  for (const plasma of [SupportedChainId.PlasmaMainnet, SupportedChainId.PlasmaTestnet]) {
    it(`does not try a nonexistent factory on chain ${plasma}`, async () => {
      const { client } = createClient(() => ({ data: { market: null } }));
      const provider = new FakeProvider();
      expect(
        await TokenWrapper.fromMarketWithSubgraph(client, {
          chainId: plasma,
          signerOrProvider: provider,
          market
        })
      ).to.equal(undefined);
      expect(provider.calls).to.deep.equal([]);
    });
  }

  it("propagates query errors when RPC fallback is disabled", async () => {
    const { client } = createClient(() => ({
      data: { market: null },
      errors: [new GraphQLError("Indexer failed")]
    }));
    const provider = new FakeProvider();
    await rejects(
      TokenWrapper.fromMarketWithSubgraph(client, {
        chainId,
        signerOrProvider: provider,
        market,
        fallbackToFactory: false
      }),
      /Indexer failed/
    );
    expect(provider.calls).to.deep.equal([]);
  });

  it("keeps the original fromMarket missing-wrapper error", async () => {
    await rejects(
      TokenWrapper.fromMarket(chainId, new FakeProvider(constants.AddressZero), market),
      /No wrapper deployed for market/
    );
  });
});

describe("paginated wrapped-market discovery", () => {
  it("traverses a stable snapshot and retains deployment provenance", async () => {
    const allMarkets = [
      makeMarket(),
      makeMarket(otherAddress, "0x00000000000000000000000000000000000000ff")
    ];
    const { client, operations } = createClient(({ variables }) => ({
      data: {
        _meta: metadata(variables.block?.number ?? 123),
        markets: allMarkets.filter(({ id }) => id > variables.afterId).slice(0, variables.first)
      }
    }));
    const first = await getWrappedMarketsPage(client, { first: 1 });
    const second = await getWrappedMarketsPage(client, {
      first: 1,
      after: first.pageInfo.nextCursor
    });
    const terminal = await getWrappedMarketsPage(client, {
      first: 1,
      after: second.pageInfo.nextCursor
    });
    expect([first.items[0].id, second.items[0].id]).to.deep.equal([market, otherAddress]);
    expect(first.items[0].tokenWrapper.factory.address).to.equal(factoryAddress);
    expect(first.items[0].tokenWrapper.deployedEvent?.blockNumber).to.equal(100);
    expect(first.indexedAt.blockNumber).to.equal(123);
    expect(first.indexedAt.blockHash).to.equal(metadata().block.hash);
    expect(second.indexedAt).to.deep.equal(first.indexedAt);
    expect(terminal.items).to.deep.equal([]);
    expect(terminal.pageInfo).to.deep.equal({ hasNextPage: false });
    expect(operations.map(({ variables }) => variables)).to.deep.equal([
      { first: 1, afterId: "" },
      { first: 1, afterId: market, block: { number: 123 } },
      { first: 1, afterId: otherAddress, block: { number: 123 } }
    ]);
  });

  it("returns an empty snapshot without implying completed replay", async () => {
    const { client } = createClient(() => ({ data: { markets: [], _meta: metadata(50) } }));
    const result = await getWrappedMarketsPage(client);
    expect(result.items).to.deep.equal([]);
    expect(result.indexedAt.blockNumber).to.equal(50);
    expect(result.pageInfo).to.deep.equal({ hasNextPage: false });
  });

  it("accepts an explicit historical first-page block", async () => {
    const { client, operations } = createClient(() => ({
      data: { markets: [], _meta: metadata(100) }
    }));
    await getWrappedMarketsPage(client, { block: { number: 100 } });
    expect(operations[0].variables.block).to.deep.equal({ number: 100 });
  });

  it("rejects invalid page sizes and conflicting cursor blocks before querying", async () => {
    const { client, operations } = createClient(() => {
      throw new Error("Unexpected query");
    });
    for (const first of [0, -1, 1.5, 1001]) {
      await rejects(getWrappedMarketsPage(client, { first }), /Invalid analytics page size/);
    }
    await rejects(
      getWrappedMarketsPage(client, {
        after: { entityId: market, blockNumber: 123 },
        block: { number: 124 }
      }),
      /cursor block does not match block/
    );
    expect(operations).to.have.length(0);
  });

  for (const failure of [
    "graphql",
    "network",
    "metadata",
    "indexing",
    "block",
    "missing-wrapper",
    "identity",
    "order"
  ] as const) {
    it(`rejects ${failure} failures instead of presenting an empty or misleading page`, async () => {
      const { client } = createClient(() => {
        if (failure === "network") throw new Error("Network failed");
        const item = makeMarket();
        if (failure === "identity") item.tokenWrapper.marketAddress = otherAddress;
        return {
          errors: failure === "graphql" ? [new GraphQLError("Query failed")] : undefined,
          data: {
            _meta:
              failure === "metadata"
                ? null
                : {
                    ...metadata(failure === "block" ? 124 : 123),
                    hasIndexingErrors: failure === "indexing"
                  },
            markets:
              failure === "missing-wrapper"
                ? [{ ...item, tokenWrapper: null }]
                : failure === "order"
                ? [item, item]
                : [item]
          }
        };
      });
      await rejects(getWrappedMarketsPage(client, { block: { number: 123 } }));
    });
  }

  it("limits discovery documents to the maintenance schema and registered markets", () => {
    const page = print(GetWrappedMarketsPageDocument);
    expect(page).to.contain("isRegistered: true");
    expect(page).to.contain("tokenWrapper_not: null");
    expect(page).to.contain("block: $block");
    for (const document of [page, print(GetTokenWrapperForMarketDocument)]) {
      expect(document).not.to.contain("principalBasis");
      expect(document).not.to.contain("deposits");
    }
  });
});
