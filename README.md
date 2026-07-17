<h1 align="center">wildcat sdk</h1>

> TypeScript SDK for interacting with Wildcat markets, controllers, and managing our onchain state 

## Table of Contents

1. [Overview](#overview)
2. [Development Workflow](#development-workflow)
3. [App Integration Testing](#app-integration-testing)
4. [Releases](#releases)
5. [Branch Strategy](#branch-strategy)

## Overview

`wildcat.ts` exposes typed helpers for working with Wildcat markets: querying controllers, inspecting market state, and managing lender or borrower activity. the sdk bundles contract typings, gql fragments, utils and constants like deployment addresses, rpc urls, sugraph urls etc. [The main app](https://github.com/wildcat-finance/wildcat-app-v2/blob/989ae639d5f1160ac0a9d8c0a90609643d716a77/package.json#L40) is the consumer.

The most likely scenario for working in this repo is while also working on app side. Theres a section below specifically on _how_ to manage this as a local dependency.


For local development inside this repo run `yarn build` (or `npm run build`) to compile TypeScript output before linking or publishing

## Development Workflow

- **Code generation**: run `yarn codegen` whenever contracts in `contracts/` or
  GraphQL fragments in `gql/` change. This invokes:
  - `yarn codegen:gql` → rebuilds typed gql from the checked-in Graph API schema
  - `yarn codegen:artifacts` → rebuilds Hardhat artifacts
  - `yarn codegen:abi` → regenerates viem ABI constants from artifacts
- **Build**: `yarn build` (or `npm run build`) outputs the package defined by `tsconfig.prod.json`.

Run `WILDCAT_SUBGRAPH_SCHEMA=<endpoint> yarn codegen:schema` to refresh the
checked-in Graph API schema from a deployed endpoint. `WILDCAT_SUBGRAPH_SCHEMA`
may also override the checked-in schema for `yarn codegen:gql`. The subgraph
repository's entity SDL is not enough: Graph Node adds the query roots, filters,
ordering fields, and pagination types used by SDK operations.

`src/gql/graphql.ts` is generated output and is excluded from ESLint. Validate
its source documents through `yarn codegen:gql`; do not hand-edit the file.

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
