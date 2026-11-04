# SDK 3.1.21: Ink Sepolia mock tokens

Base: `release/v3.1.20` at `daced54`. Branch: `release/v3.1.21`.

Adds `MockERC20Factory` for chain `763373`:
`0x001D521c15Db09bf52731aA27B3f2ba83D7499B9`.
The existing `TokenFactory` API supports token creation, receipt decoding and
per-caller address prediction for Safe batches. These are unrestricted test tokens.

Source: protocol `release/ink` at `d1fc2f3`; confirmed and verified in
`mock-token-factory-live-20261014T183506Z`. Creation block: `62999636`.
Transaction: `0x03e10804a345c9a2c09bf1d818dbb5abdb3a151b86745273c0cc57aa75d5b6cd`.

No ABI, subgraph, RPC defaults, other-chain addresses or Ink mainnet changes.
Keep `ink-sepolia/v2.1.9`; the subgraph discovers tokens when markets use them.
The app must upgrade to `3.1.21` before using its existing mock-token wizard on Ink.

## Check and package

```sh
yarn build
node --no-experimental-strip-types --require ts-node/register node_modules/mocha/bin/mocha.js --no-config --timeout 20000 test/ink-sepolia.spec.ts test/subgraph-release.spec.ts test/wrapper-discovery.spec.ts test/analytics.spec.ts test/explore-subgraph.spec.ts
yarn eslint src/constants.ts test/ink-sepolia.spec.ts
npm pack
```

After reviewing the package, publish it explicitly:

```sh
npm publish ./wildcatfi-wildcat-sdk-3.1.21.tgz --tag latest
```

Packaging does not publish, tag or push.

## Validation

- Production build, touched-source lint and 59 offline tests passed.
- At Ink Sepolia block `62999810`, the configured factory bytecode matched the
  deployment inventory. Address prediction matched a read-only token deployment
  simulation; no live transaction was sent.
- Compared with `3.1.20`, only `dist/constants.js` and its two maps changed.
  The packed build matches local output; other chains and bindings are unchanged.
