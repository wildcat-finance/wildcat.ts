# SDK v3.1.18: indexed wrapper discovery

This maintenance release adds subgraph discovery to the ethers-based V2.0/V2.1
SDK. Base: `v3.1.17` (`38e43ed6fb37f0f14efc87cfdc54df2264da4b5d`).
Reference discovery API: `v3.2.17-beta`
(`48ec12e6eb0cd75db93fe7cfa5121594ceee36bb`).

## Consumer API

`getWrappedMarketsPage(client, options?)` returns registered markets that have an
indexed wrapper. Each `items` entry has `id`, `name` and a non-null `tokenWrapper`:
wrapper address, parent market address, market/share token metadata, factory
address and nullable deployment event (block number, timestamp and transaction).
The helper takes no RPC provider and never falls back to an on-chain scan.

```ts
import {
  GetWrappedMarketsPageOptions,
  SupportedChainId,
  WrappedMarket,
  getSubgraphClient,
  getWrappedMarketsPage
} from "@wildcatfi/wildcat-sdk";

const client = getSubgraphClient(SupportedChainId.Mainnet);
const markets: WrappedMarket[] = [];
let after: GetWrappedMarketsPageOptions["after"];
do {
  const page = await getWrappedMarketsPage(client, { first: 100, after });
  markets.push(...page.items);
  console.log(page.indexedAt);
  after = page.pageInfo.nextCursor;
} while (after);
```

- `first` defaults to 100 and accepts integers from 1 through 1000.
- Pass `pageInfo.nextCursor` unchanged as `after`. It contains the last market
  ID and snapshot block number, following the SDK's existing analytics page
  contract. The query uses ascending IDs; every continuation requests the same
  block. A full page can require an empty terminal request.
- The initial request optionally accepts `block`, using the existing GraphQL
  `Block_height` input. A continuation's cursor chooses its block number; use the
  same endpoint for the traversal and start again to see newer state.
- `indexedAt` contains deployment ID, block number, indexing-error flag, and
  optional block hash/timestamp. It reports the snapshot, not replay completion.
- The default fetch policy is `network-only`; it can be overridden. GraphQL,
  transport, indexing, identity and snapshot inconsistencies throw rather than
  returning a misleading empty page.

`getTokenWrapperDataForMarket(client, market, fetchPolicy?)` returns the same raw
wrapper DTO or `undefined` when the market/wrapper is not indexed. It lowercases
the query ID and defaults to `cache-first`; use `network-only` to refresh after
creation. Factory and deployment provenance remain available on this DTO.

`TokenWrapper.fromSubgraphData(chainId, provider, data)` synchronously constructs
the existing wrapper class without contract reads. Its methods retain ethers
`BigNumber` and transaction/receipt behavior. The instance carries its market
and token metadata; retain the raw DTO separately if provenance is needed.

`TokenWrapper.fromMarketWithSubgraph(client, { chainId, signerOrProvider, market,
fetchPolicy?, fallbackToFactory? })` first tries indexed metadata. Factory RPC
fallback defaults to true for missing data or query failure; disable it for a
strictly indexed read. With fallback disabled, query errors propagate and absent
data returns `undefined`. Address mismatches always throw without fallback.
On chains without a configured wrapper factory, no fallback RPC is attempted.

Existing `fromMarket`, `fromAddress` and factory methods retain their previous
RPC behavior. Existing app integrations must opt into these new methods.
Ordinary `Market` objects are not automatically enriched with wrapper data.
Holder balances, transfers and wrapper accounting are outside this release.

## Endpoint and code generation changes

The default URLs remain direct Goldsky endpoints, moving mainnet and both Plasma
chains to `v2.0.31`, Sepolia to `v2.1.9`. `codegen.yml` uses the new maintenance
Sepolia schema. Periodic-term query selectors and deployment addresses are
preserved; no contract ABI, TypeChain or dependency update is required.

For GraphQL-only changes run `FORCE=1 yarn codegen:gql`. The cleanup step names
the new wrapper deployment sort enum's relation field `WrapperEntityAddress`:
the schema's `wrapperAddress` and `wrapper__address` would otherwise both become
`WrapperAddress`. Existing enum names retain their spelling.

## Verification and release gate

Build and offline tests can run before replay completes:

```sh
yarn install --frozen-lockfile --ignore-scripts
yarn build
node --no-experimental-strip-types --require ts-node/register node_modules/mocha/bin/mocha.js --no-config --timeout 20000 test/wrapper-discovery.spec.ts test/analytics.spec.ts test/explore-subgraph.spec.ts test/subgraph-release.spec.ts
yarn eslint src/wrapper/index.ts src/wrapper/discovery.ts src/internal/read-identity.ts src/constants.ts test/wrapper-discovery.spec.ts test/subgraph-release.spec.ts
npm pack --dry-run
```

The Node 24 flag above lets ts-node handle the existing TypeScript test syntax.
On Node versions without built-in TypeScript stripping, omit that flag. This
targets the maintained offline suites; `test/t.spec.ts` contains old vault tests
and is not part of this release's validation.

Validated on 2026-10-08:

- Production TypeScript build, 52 targeted offline tests and touched-source lint
  passed. GraphQL codegen completed; it reports two existing unused-variable
  warnings in unrelated GraphQL helper files.
- All 44 pre-existing generated query documents are identical to the base;
  legacy documents/selectors, existing wrapper method bodies/signatures,
  existing enum members, contract bindings and dependency lockfile are preserved.
- New discovery documents validate against both maintenance schema families.
  Of 84 broader document/schema checks, 80 passed strict validation. The other
  four select the same existing authorized/active-lender operation on each chain,
  whose five unused-variable declarations are unchanged from the base. There
  are no new schema-validation failures; this patch does not repair that query.
- The built SDK paginated Hinterlight mainnet at block 26145404 (14 wrappers,
  three pages of up to five) and Sepolia at block 11868097 (24 wrappers, five
  pages). All market/wrapper associations, deployment blocks and transaction
  hashes matched the earlier fixed-block factory archive inventories. Every
  wrapper hydrated without RPC reads, and both single-market helpers succeeded.

At the 06:18 UTC checkpoint, Ethereum mainnet and Sepolia Hinterlight endpoints
were near the chain tip. Hinterlight Plasma and all four Goldsky routes were
still replaying. No endpoint reported indexing errors. These observations do
not constitute completed Goldsky replay or full provider parity.

Final direct-provider acceptance completed on 2026-10-08, 15:58–16:03 UTC:

- All four Goldsky defaults and the corresponding Hinterlight endpoints were
  healthy and zero to two blocks behind public RPC heads, including Plasma.
- Paginated wrapper metadata and deployment provenance matched between providers
  on every chain. Mainnet and Sepolia matched the earlier archive inventories
  at their pinned blocks; both Plasma chains returned no wrappers, as expected
  with no configured factory. SDK hydration made no RPC reads.
- At common blocks, sampled market, lender catalogue and protocol analytics
  queries on the new Goldsky routes matched the previous Goldsky releases.
  Market and catalogue samples also matched Hinterlight on all four chains.

One provider discrepancy remains outside SDK wrapper acceptance: at mainnet
block 26145404, Hinterlight's `totalDepositedUSD`, `totalBaseInterestAccruedUSD`
and `totalProtocolFeesAccruedUSD` differ from Goldsky. New and old Goldsky values
match exactly; both providers report `usdTotalsComplete: false`. The cause is
not established. This is a subgraph/gateway follow-up, not a claim of complete
provider parity. Sepolia and Plasma protocol analytics samples matched.

The SDK release is ready with its direct Goldsky defaults. The new gateway
routes still returned `SUBGRAPH_RELEASE_NOT_FOUND` at the final check; the
separate gateway promotion does not change these SDK defaults. npm returned
404 for `3.1.18` at that check; publication remains operator-controlled.

From `release/v3.1.18`, the operator can push, tag and publish using their npm
security key. The prepared tarball has already passed its export and consumer
type checks; rebuilding is optional when the checked source/artifact is intact:

```sh
git status --short
git push -u origin release/v3.1.18
git tag -a v3.1.18 -m 'SDK v3.1.18: indexed wrapper discovery'
git push origin v3.1.18
npm publish ./wildcatfi-wildcat-sdk-3.1.18.tgz --tag latest
```

Inspect the package before publishing. A local version bump, branch, tarball or
successful build does not establish publication or completed subgraph replay.
