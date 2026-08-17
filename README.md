<h1 align="center">wildcat sdk</h1>

> TypeScript SDK for interacting with Wildcat markets, controllers, and managing our onchain state

## Table of Contents

1. [Overview](#overview)
2. [3.1 Compatibility](#31-compatibility)
3. [Analytics Reads](#analytics-reads)
4. [Development Workflow](#development-workflow)
5. [App Integration Testing](#app-integration-testing)
6. [Releases](#releases)
7. [Branch Strategy](#branch-strategy)

## Overview

`wildcat.ts` exposes typed helpers for working with Wildcat markets: querying controllers, inspecting market state, and managing lender or borrower activity. the sdk bundles contract typings, gql fragments, utils and constants like deployment addresses, rpc urls, sugraph urls etc. [The main app](https://github.com/wildcat-finance/wildcat-app-v2/blob/989ae639d5f1160ac0a9d8c0a90609643d716a77/package.json#L40) is the consumer.

The most likely scenario for working in this repo is while also working on app side. Theres a section below specifically on _how_ to manage this as a local dependency.

For local development inside this repo run `yarn build` (or `npm run build`) to compile TypeScript output before linking or publishing

## 3.1 Compatibility

SDK `3.1.17` preserves the `3.1.4-beta.4` consumer surface and targets the
maintained V2.0/V2.1 subgraph family:

| Chain            | Subgraph                 |
| ---------------- | ------------------------ |
| Ethereum mainnet | `mainnet/v2.0.30`        |
| Ethereum Sepolia | `sepolia/v2.1.8`         |
| Plasma mainnet   | `plasma-mainnet/v2.0.30` |
| Plasma testnet   | `plasma-testnet/v2.0.30` |

Sepolia's V2.1 schema includes periodic-term fields. The other chains use the
V2.0 schema, so SDK helpers select legacy-compatible GraphQL documents for
operations that include periodic-term data. Consumers constructing raw queries
should use the exported `*DocumentForChain` selectors for those operations.

This release family does not target the clean V2.5 subgraph schema. V2.5
consumers belong on SDK `3.2.x`.

`SetAprStatus.AprChangeExpired` is the one additive status that requires a
consumer update when upgrading from `3.1.4-beta.4`: exhaustive status maps must
add an expired-proposal message. That is the only source change found by
compiling the current `wildcat-app-v2` checkout against this package.

## Analytics Reads

The `3.1.17` analytics API exposes the additive V2.0.30/V2.1.8 protocol,
borrower, lender, market, price, and withdrawal-reliability entities:

```ts
import {
  SupportedChainId,
  getProtocolAnalyticsStats,
  getSubgraphClient
} from "@wildcatfi/wildcat-sdk";

const client = getSubgraphClient(SupportedChainId.Mainnet);
const { indexedAt, value } = await getProtocolAnalyticsStats(client);
```

Paginated reads return a cursor pinned to the first indexed block so later
pages cannot drift as the subgraph advances. USD `BigDecimal` values remain
strings to preserve precision. Check the accompanying completeness flags, and
treat `Market.totalDebtUSD === null` as unavailable pricing rather than zero
debt.

## Development Workflow

- **Code generation**: run `yarn codegen` (or `npm run codegen`) whenever contracts in `contracts/` or GraphQL fragments in `gql/` change. This invokes:
  - `yarn codegen:gql` → rebuilds typed gql
  - `yarn codegen:typechain` → regenerates typeChain bindings and exports
- **Build**: `yarn build` (or `npm run build`) outputs the package defined by `tsconfig.prod.json`.

## App Integration Testing

To validate SDK changes against `wildcat-app-v2`:

1. Run `npm pack` (or `yarn npm pack`) in this repository to produce a local tarball in the project root.
2. in the [app](https://github.com/wildcat-finance/wildcat-app-v2) repo, update `package.json` to point to the new `.tgz` file (e.g. `"@wildcatfi/wildcat-sdk": "file:../wildcat.ts/wildcatfi-wildcat-sdk-3.0.54-beta.tgz"`).
3. Reinstall dependencies in the app (`npm install` or use the provided reinstall script with the appropriate environment variables configured).

## Releases

Once happy with changes publish to npm (if you have permissions):

- `npm publish --tag beta `

## Branch Strategy

- `main`: latest supported release branch. Publish production npm releases (`npm publish` or `yarn npm publish`).
- `develop`: integration branch. Publish beta releases with `npm publish --tag beta` (or the yarn equivalent).
- Feature branches should merge into `develop` via pull request, then graduate to `main` for release once validated.
