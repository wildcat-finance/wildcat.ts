# SDK 3.1.22: market default status

Base: `release/v3.1.21` at `cd848fc`.

Two backports from the `3.2.x` line, adapted to the 3.1 types. No ABI, subgraph,
address, RPC default or chain changes.

## Market default status

Adds `getMarketDefaultStatus` from `3.2.16-beta` (`8efc853`) and the indexed
traversal it uses (`66a4ab0`). New exports: `getMarketDefaultStatus`,
`MarketDefaultStatus`, `GetMarketDefaultStatusOptions`,
`DEFAULT_DELINQUENCY_PERIOD`, `IndexedQueryMetadata`, `IndexedTraversalError`,
`IndexedTraversalErrorCode`, `IndexedTraversalLimits`, `IndexedTraversalOptions`
and `DEFAULT_INDEXED_TRAVERSAL_LIMITS`.

```ts
import {
  getMarketDefaultStatus,
  getSubgraphClient,
  SupportedChainId
} from "@wildcatfi/wildcat-sdk";

const chainId = SupportedChainId.Mainnet;
const status = await getMarketDefaultStatus(getSubgraphClient(chainId), {
  market: { address, chainId, lastInterestAccruedTimestamp },
  signal
});
// status.isDefaulted: true | false | undefined (unknown, not "healthy")
```

A market defaults when one uninterrupted delinquency run lasts 90 days past the
remaining grace period. The helper replays the market's block-pinned delinquency
history from the subgraph, so a default stays recorded after cure or closure.
Incomplete or inconsistent history returns `isDefaulted: undefined` with a
`reason`; network failures, cancellation and traversal limits reject.

Differences from `3.2.x`:

- Only the legacy history document is sent. No 3.1 subgraph exposes the V2.5
  recorded `defaultedAt` flag, so `market.defaultedAt` accepts only `undefined`;
  a supplied value would skip the history read.
- 3.1 subgraph clients carry no chain tag, so the client/market chain check is
  dropped. Pass the client for the market's own chain.
- Page sizes go through `normalizeAnalyticsPageRequest` (same 1–1,000 bounds).

## Withdrawal completion after early closure

Backports `72ebe84` ("preserve withdrawal completion on closed markets").
`LenderWithdrawalStatus.updateWith` and `fromWithdrawalBatchLenderStatus` used
`batch.status` and `expiry < now`, both purely time-based. When a V2 market closed
before a pending batch's expiry and a lender claimed in full, a lens refresh turned
`isCompleted` from `true` to `false` until that expiry. Both now use
`batch.effectiveStatus`, which accounts for closure.

Other effects of the shared helper:

- `expiry == now` counts as concluded, matching `isConcluded`.
- On the lens-only path, a fully paid batch the lens reports as `Expired` no
  longer blocks completion.
- An empty batch (`scaledTotalAmount` zero) returns `false` instead of throwing.

Not backported: `batch.status`, `isClosed` and `isPendingExpired` remain
time-based for a batch retired by closure (3.2 changes that in `5cb7379`).

## Check and package

```sh
yarn build
node --no-experimental-strip-types --require ts-node/register node_modules/mocha/bin/mocha.js --no-config --timeout 20000 test/ink-sepolia.spec.ts test/subgraph-release.spec.ts test/wrapper-discovery.spec.ts test/analytics.spec.ts test/explore-subgraph.spec.ts test/market/default.spec.ts test/analytics/indexed-query.spec.ts test/withdrawal-status-closure.spec.ts
yarn eslint src/market-default.ts src/indexed-pagination.ts src/internal src/analytics/types.ts src/index.ts src/withdrawal-status.ts test/market/default.spec.ts test/analytics/indexed-query.spec.ts test/withdrawal-status-closure.spec.ts
npm pack
```

After reviewing the package, publish it explicitly:

```sh
npm publish ./wildcatfi-wildcat-sdk-3.1.22.tgz --tag latest
```

Packaging does not publish, tag or push.

## Validation

Validated on 2026-11-03:

- Production build, touched-source lint and 103 offline tests passed. The new
  withdrawal spec fails on the `3.1.21` `withdrawal-status.ts`.
- Compared with `3.1.21`, `dist` adds the five new modules and changes only
  `index.js` (two export lines), `index.d.ts`, `analytics/types.d.ts` and
  `withdrawal-status.js`. No existing export was removed or changed.
- All 545 markets on the five 3.1 subgraphs resolved with no unknown result, and
  every outcome matched `3.2.17-beta` on the same client. Mainnet matched all
  nine markets in the `3.2.16-beta` release evidence, including default times.
- Replaying mainnet market `0x0b6c6d557109f9e793297d54ee3fbde2e315b070` (closed
  2026-02-19, batch expiry 2026-02-21): `3.1.21` moves a fully claimed withdrawal
  to the expired-pending bucket after a lens refresh; `3.1.22` keeps it complete.

Apps upgrading from `3.1.19` also inherit `SupportedChainId.InkSepolia` from
`3.1.20`; chain-keyed maps must tolerate a chain the app does not serve.
