<h1 align="center">wildcat sdk</h1>

> TypeScript SDK for interacting with Wildcat markets, controllers, and managing our onchain state 

## Table of Contents

1. [Overview](#overview)
2. [Gateway Connections](#gateway-connections)
3. [Numeric Inputs and Ethers Compatibility](#numeric-inputs-and-ethers-compatibility)
4. [Account and Signature Inspection](#account-and-signature-inspection)
5. [Subgraph Metadata Timeouts](#subgraph-metadata-timeouts)
6. [Complete Indexed Reads](#complete-indexed-reads)
7. [v2.5 Market Deployment Salts](#v25-market-deployment-salts)
8. [Development Workflow](#development-workflow)
9. [App Integration Testing](#app-integration-testing)
10. [Releases](#releases)
11. [Branch Strategy](#branch-strategy)

## Overview

`wildcat.ts` exposes typed helpers for working with Wildcat markets: querying controllers, inspecting market state, and managing lender or borrower activity. the sdk bundles contract typings, gql fragments, utils and constants like deployment addresses, rpc urls, sugraph urls etc. [The main app](https://github.com/wildcat-finance/wildcat-app-v2/blob/989ae639d5f1160ac0a9d8c0a90609643d716a77/package.json#L40) is the consumer.

The most likely scenario for working in this repo is while also working on app side. Theres a section below specifically on _how_ to manage this as a local dependency.

See the [3.2.10-beta release notes](docs/releases/3.2.10-beta.md) for Sepolia
V2.5.4 deployment targets, indexed liquidity, transfer rounding, and historical
wrapper compatibility with subgraph V2.5.12.

## Gateway Connections

SDK 3.2.9 and later default to Wildcat's public data gateway. RPC connections identify
the chain; subgraph connections also pin the release understood by the SDK.
Sepolia uses subgraph v2.5.12. The gateway manages upstream provider failover.
Public access needs no credential and is subject to gateway quotas.

For viem or wagmi, use `createRpcTransport`. For subgraph reads, use
`getSubgraphClient` for a cached client or `createSubgraphClient` for a new one:

```ts
import { createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import {
  createRpcTransport,
  getSubgraphClient,
  SupportedChainId
} from "@wildcatfi/wildcat-sdk";

const chainId = SupportedChainId.Sepolia;
const publicClient = createPublicClient({
  chain: sepolia,
  transport: createRpcTransport(chainId)
});
const subgraphClient = getSubgraphClient(chainId);
```

Pass an `endpoint` to replace either default. Existing
`createSubgraphClient(chainId, endpointString)` and
`validateSubgraphEndpoint(chainId, endpointString)` calls remain supported;
both also accept the options object. Existing caller-created viem clients and
ethers providers remain accepted by SDK market and account APIs.

For trusted server access, supply `bearerToken`. The SDK reads no environment
variables itself. Check required credentials in the server application:

```ts
const bearerToken = process.env.WILDCAT_GATEWAY_TOKEN;
if (!bearerToken) throw new Error("WILDCAT_GATEWAY_TOKEN is required");

const serverTransport = createRpcTransport(chainId, { bearerToken });
const serverSubgraph = getSubgraphClient(chainId, { bearerToken });
```

Authorization is applied to subgraph metadata validation and ordinary
queries. A rejected bearer fails the request. Empty tokens are configuration
errors; omitting `bearerToken` selects public access. The SDK's authenticated
viem and Graph transports reject HTTP redirects.

For a browser app using a server proxy, configure the proxy URLs in the
browser. Implement these routes in the consuming app and attach the gateway
bearer on the server-to-gateway request:

```ts
const appTransport = createRpcTransport(chainId, {
  endpoint: `/api/gateway/rpc/${chainId}`
});
const appSubgraph = getSubgraphClient(chainId, {
  endpoint: "/api/gateway/graph/sepolia/v2.5.12"
});
```

Relative URLs require a browser origin. Server callers must use absolute URLs.
Private bearers must stay out of browser bundles, `NEXT_PUBLIC_*` variables,
and proxy responses. The browser receives the proxy URL, not the gateway key.

For ethers v5, `getRpcConnection` returns compatible connection settings:

```ts
import { providers } from "ethers";
import { getRpcConnection } from "@wildcatfi/wildcat-sdk";

const provider = new providers.StaticJsonRpcProvider(
  getRpcConnection(chainId, { endpoint: "https://my-rpc.example" }),
  chainId
);
```

`getRpcConnection` also accepts `bearerToken`. Its result includes credential
headers when supplied; keep connection objects out of logs. RPC helpers use a
30-second per-request timeout, configurable with `timeoutMs`. The viem helper
retains viem's ordinary retry behavior and does not enable JSON-RPC batching.

`getSubgraphClient` caches by chain, endpoint, credential, and metadata timeout.
Equivalent settings share a client; changing a token creates a separate client.
Clients snapshot their settings at construction, so changing an options object
does not retarget an existing client. `createSubgraphClient` creates a separate
Apollo cache while matching connection settings can still share metadata
validation. Subgraph compatibility errors identify the endpoint origin and
omit its path, query, and userinfo to avoid exposing embedded credentials.

## Numeric Inputs and Ethers Compatibility

Raw token amounts use `bigint`. APIs accepting integer amounts also support
safe JavaScript integer numbers, integer strings, and ethers v5 `BigNumber`
objects. Ethers callers can continue passing those objects directly.

Starting with 3.2.9, numeric inputs to integer conversion and arithmetic helpers
must satisfy `Number.isSafeInteger`. The legacy `.toNumber()` method on raw
bigint amounts also throws outside the safe integer range, matching the SDK's
checked `toNumber()` helper. Consumers relying on the earlier compatibility
helpers accepting unsafe numbers must use an exact representation instead.

For large raw amounts, pass a bigint, an integer string, or a `BigNumber`
constructed from an exact string. Converting an already-rounded number to a
string cannot recover lost digits. For amounts expressed in token units, use
`token.parseAmount("1.25")`; use `amount.format()` or `amount.raw.toString()`
for display instead of converting a large raw amount to a JavaScript number.

Starting with 3.2.9, token decimals must also be an integer from 0 through 255,
the ERC-20 `uint8` range. Token construction and the `parseFixedBigint`,
`formatFixedBigint`, and legacy `formatBnFixed` helpers reject invalid decimal
counts before parsing or formatting. `Token.parseAmount()` and `TokenAmount`
formatting use these same checks, including when token metadata has changed
since construction.

Starting with 3.2.9, `TokenAmount` operands must match the expected token's chain,
address (ignoring case), and decimals. This applies to amount construction,
`token.getAmount(existingAmount)`, arithmetic, comparisons, and transaction
amounts. A mismatch throws before encoding; the SDK does not rescale the value.
Equivalent token objects are accepted even if their display labels differ.

Existing raw bigint, integer string, safe-number, and ethers `BigNumber` inputs
remain supported by APIs that already accept them. `toRawAmount(amount, token)`
checks a tagged amount against that token; the one-argument form still extracts
raw units. Passing `amount.raw` explicitly discards its token identity, so callers
performing a conversion must establish the units themselves.

Withdrawal queueing, force buybacks, and updates to an existing market's maximum
supply accept either that market's normalized receipt tokens or its underlying
asset, whose nominal units are 1:1. Generic amount arithmetic still requires
matching identities. Wrapper deposit/withdraw inputs use the market receipt
token; mint/redeem inputs use the wrapper share token. Use the wrapper's conversion
or preview methods to calculate quantities at its exchange rate.

## Account and Signature Inspection

Starting with 3.2.9, malformed or reverting contract responses fail the affected
inspection probe. `describeAccount` returns `UnknownContract` when it cannot
read a Safe's owners or threshold. The signature inspector still attempts
contract-signature validation for an unknown contract. Failed optional Safe
domain or owner-detail reads leave the signer breakdown empty while preserving
any independently verified signature result. An empty breakdown alone does not
establish signature validity; use the returned signature kind.

The bundled helpers, including the legacy ethers Safe checker, validate response
lengths and ABI encoding within their existing RPC call. RPC/network failures
and overall EVM resource failures still reject the query. Safe classification
remains an interface heuristic and does not certify a wallet's implementation.

## Subgraph Metadata Timeouts

SDK-managed V2.5 clients validate endpoint metadata before forwarding network
queries. Starting with 3.2.9, metadata requests default to a 15-second timeout,
allowing time for gateway failover. This default also applies to feature-metadata
reads through custom Apollo clients. Set `metadataTimeoutMs` in SDK subgraph
client options to change it, or pass it as the second argument's options to
`fetchIndexerDeploymentMetadata(endpoint, options)`. The value must be a positive
integer no greater than 2,147,483,647 ms.

On timeout, metadata helpers reject with `SubgraphCompatibilityError` and issue
code `METADATA_QUERY_TIMEOUT`; gated Apollo queries receive it as a network
error. The SDK aborts the request and unsubscribes its metadata observer.
Failed attempts are removed from the metadata caches, so a later call can
retry. Compatibility validation must succeed before queued queries proceed.
Successful validations remain shared and cached.

Cancelling one waiting query leaves shared validation available to other
callers, subject to the same deadline. This timeout applies to metadata reads;
complete traversals have the separate limits below. Other queries retain
their transport's timeout policy. Custom transports
receive the abort signal and subscription teardown and must honor either to
stop their underlying work; the SDK wait ends even if they ignore cancellation.

## Complete Indexed Reads

Starting with 3.2.9, `collectIndexedPages` and the exhaustive hooks metadata,
authority, identity, policy-member, and withdrawal-history readers enforce
aggregate limits. Defaults are **100,000 collection entries, 1,000 page
requests, and 120,000 ms for the whole traversal**. These are separate from
the existing per-page sizes; a 1,000-transaction history remains supported.

Pass `limits` and an optional `signal` in the reader's options. Individual
limits can be raised for intentional large exports or lowered for interactive
reads. Values must be positive safe integers; `timeoutMs` must also fit a
JavaScript timer (at most 2,147,483,647 ms).

```ts
const controller = new AbortController();
const deposits = await collectIndexedPages(
  (request) => getLenderDepositPage(client, { lender, ...request }),
  {
    first: 1_000,
    signal: controller.signal,
    limits: { maxItems: 250_000, maxPages: 2_000, timeoutMs: 300_000 }
  }
);
```

The collector passes its signal to the page callback. Forward the request to
SDK page readers as above; custom page sources must honor that signal to stop
their underlying work. The SDK stops waiting even if a callback ignores it.
Apollo reads abort their transport signal and release their own subscription
without stopping other queries on the client. Custom links must honor the
signal or subscription teardown to stop their work.

One allowance covers a policy query and its membership traversal, or a
withdrawal query and every nested history it completes. Each paginated
collection entry counts, including repeated representations in separate
nested collections. Page requests include the final empty request sometimes
needed to establish completeness. `getAllPendingWithdrawalBatchesForMarket`
accepts these options as a fourth argument after its existing cache-policy
argument; the other affected readers accept them in their options object.

Limits and cancellation reject with `IndexedTraversalError`, whose `code` is
`PAGE_LIMIT`, `ITEM_LIMIT`, `TIMEOUT`, or `CANCELLED`. Oversized pages, duplicate
entities within a collection, and invalid cursor progress reject with
`INVALID_PAGE`. Cursor and withdrawal history reads retain snapshot checks;
withdrawal pages also check record order within each page. **No truncated
collection is returned as a successful complete read.**

Limits bound traversal work and retained entry counts. Individual response
byte limits remain a transport concern. Single-page analytics readers retain
their existing size limits and accept a cancellation signal without starting
a whole-history traversal.

## v2.5 Market Deployment Salts

v2.5 market factories require a 32-byte CREATE2 salt made from the immediate factory caller followed by a 12-byte nonce. Use `encodeMarketSalt(factoryCaller, nonce)` to build one and `isMarketSaltForFactoryCaller(salt, factoryCaller)` when the caller is known.

The factory caller is not always the wallet signing the outer transaction. A borrower account must use the account contract address, not its principal or signer.

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

For the 3.2 beta series, branch from and target `release/v3.2`. The subgraph
V2.5 release track is `release/v2.5` in its own repository.

- `main`: latest supported release branch. Publish production npm releases (`npm publish` or `yarn npm publish`).
- `develop`: integration branch. Publish beta releases with `npm publish --tag beta` (or the yarn equivalent).
- Feature branches should merge into `develop` via pull request, then graduate to `main` for release once validated.
