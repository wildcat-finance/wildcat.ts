# SDK 3.1.20: Ink Sepolia

Base: `fix/sepolia-mock-owner` at `03422e39dbb6a7b5d1ce8757a50ec9ccc53f786a`
(published SDK `3.1.19`; no Git tag). Branch: `release/v3.1.20`.

- Adds `SupportedChainId.InkSepolia` (`763373`). Ink mainnet is not enabled.
- Adds the confirmed protocol addresses, including MockOwner and wrapper factory.
  `Chainalysis` points to the sanctions adapter, not the mirrored list.
- Uses direct Goldsky `ink-sepolia/v2.1.9`. Existing chain URLs are unchanged.
  Callers still supply ethers RPC providers; no RPC URLs or credentials are bundled.
- Selects the exact legacy lens ABI on Ink. Its response omits the later
  `allowForceBuyBacks` field; the existing market parser defaults it to false.
  Existing chain bindings are unchanged.
- Uses legacy open/fixed-term deployment encoding and query selectors. No
  periodic-term, V1, collateral, or mock-token-factory deployment is configured.

## Verify and release

- [ ] Install, build, and run the maintained offline suites:

```sh
yarn install --frozen-lockfile --ignore-scripts
yarn build
node --no-experimental-strip-types --require ts-node/register node_modules/mocha/bin/mocha.js --no-config --timeout 20000 test/ink-sepolia.spec.ts test/subgraph-release.spec.ts test/wrapper-discovery.spec.ts test/analytics.spec.ts test/explore-subgraph.spec.ts
```

- [ ] Inspect the package, commit and push `release/v3.1.20`:

```sh
npm pack --dry-run
npm pack
```

- [ ] Tag the reviewed commit and publish the inspected package:

```sh
git tag -a v3.1.20 -m 'SDK v3.1.20: Ink Sepolia support'
git push origin v3.1.20
npm publish ./wildcatfi-wildcat-sdk-3.1.20.tgz --tag latest
```

Publishing and tagging are operator steps, not performed by this preparation.
The old vault tests in `test/t.spec.ts` are not part of the maintained suites.

## Acceptance

Validated on 2026-10-14:

- The base build matches all 480 published `3.1.19` build files.
- All 26 legacy lens function inputs/outputs match the deployed protocol build.
- Production build, touched-source lint and 58 offline tests pass. A nonempty
  lens-response regression test rejects the old decoder and verifies the fixed-term fields.
- Live lens calls at block `62997001` return the two enabled 500-bps templates.
  Goldsky returns those same templates; indexed wrapper discovery returns an
  empty page at block `62997000`, with no indexing errors.

SDK addresses come from protocol run `sepolia-continuation-20261014T072841Z`.
No market lifecycle was exercised on the live chain. App network selection,
RPC configuration, token setup and dependency update are separate work.
USD prices and sanctions seeding/keeper work remain separate too.
