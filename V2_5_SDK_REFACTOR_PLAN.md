# V2.5 SDK Refactor Plan

Status: implementation in progress; Phase 2 complete, Phase 3 next
Branch: `feat/sdk-refactor`  
Baseline: `4c3d8cc` (`release/v2.5`)  
Package under development: `@wildcatfi/wildcat-sdk@3.1.8-beta`

## Objective

Replace the unpublished V2.5 SDK work-in-progress with a coherent SDK for the
frozen V2.5 protocol and subgraph. The result must expose historical Wildcat
data, current V2.5 deployment capabilities, and explicit live-read behavior
without carrying forward the old subgraph schema or the temporary SDK factory
inventory model.

The currently deployed `3.1.7` package remains the compatibility boundary for
existing testnet users. Nothing depends on the `3.1.8-beta` API, so this branch
may make breaking API and type changes. Historical protocol data compatibility
is still required: old markets and factories must remain discoverable through
the new V2.5 subgraph.

## Frozen inputs

- `v2-protocol` is the authority for contract behavior, ABIs, transaction
  encoding, lens capabilities, and deployment artifacts.
- `subgraph` is the authority for indexed discovery, provenance, relationships,
  immutable history, analytics, and freshness-stamped snapshots.
- `wildcat-app-v2` is a reference consumer and acceptance surface. Its current
  types are not an SDK compatibility constraint; its required user behaviors
  are.
- Final V2.5 Sepolia addresses, start blocks, and subgraph URLs remain deployment
  inputs. Address-only edits must stay isolated from structural SDK changes.

Neither frozen repository will be modified from this branch.

## Definition of done

The refactor is complete when:

1. the SDK validates and queries the clean V2.5 GraphQL schema on every supported
   chain without legacy document selection;
2. V1, historical standard V2, V2.5 standard, and V2.5 revolving markets hydrate
   with exact origin, factory, generation, ABI-family, hook-template registration,
   and market-kind provenance;
3. indexed historical factories are discovered from the subgraph, while market
   creation is restricted to explicit SDK deployment targets that agree with
   subgraph deployment metadata;
4. template registration state remains isolated for identical template addresses
   registered on different factories;
5. indexed snapshots expose freshness, and SDK APIs clearly distinguish indexed
   state from lens/RPC-backed live state;
6. collateral depositor identities use their explicit `address` field;
7. borrower, lender, market, and protocol analytics required by the app are
   available through stable SDK-owned types rather than generated GraphQL types;
8. transaction preview and encoding tests cover both standard and revolving
   factories using the frozen protocol ABIs;
9. SDK lint, build, unit tests, endpoint integration tests, and fixed-block parity
   checks pass; and
10. a locally packed SDK can replace the app dependency and the app's required
    flows pass their targeted checks.

## Authority model

### Indexed authority

The subgraph owns:

- chains, configured factories, indexing scope, and deployment metadata;
- all historical markets, including markets from deregistered factories;
- exact market/factory/template-registration provenance;
- immutable event history and stable pagination coordinates;
- cumulative analytics and daily aggregates; and
- explicitly staleable account, market, and collateral snapshots.

An SDK discovery query must not discard a subgraph entity merely because its
address is absent from a checked-in historical allowlist.

### Transaction authority

The SDK's deployment configuration owns the exact addresses that transaction
builders may target. A subgraph `deploymentTarget` is a required consistency
signal, not sole authority to send a transaction.

Before returning a create-market transaction, the SDK must establish:

- the chain has a configured target for the requested market kind;
- the selected hooks registration belongs to that exact factory;
- the registration is enabled;
- the factory is an indexed V2.5 deployment target in the endpoint metadata;
  and
- observed registration state satisfies the frozen protocol's requirements.

Historical indexing, factory lifecycle labels, and ArchController registration
must remain separate concepts.

### Live authority

Lens or direct RPC owns values used for decisions or transactions, including:

- balances and allowances;
- liquidity, supply, debt, and withdrawal availability;
- APR, reserve ratio, delinquency, and current hook state;
- lender authorization and access state; and
- transaction preview inputs.

Indexed values may seed lists and charts. They must carry block/timestamp
freshness and must not be silently represented as current transaction state.

## Architectural decisions

### One V2.5 schema

`3.1.8-beta` will target the clean V2.5 schema on every supported chain. Remove
the old `legacy-documents.ts`, periodic-schema selectors, and chain-level schema
feature flags once replacement endpoints exist.

Do not add another dual-schema adapter. If endpoint rollout cannot be uniform,
hold the SDK cutover or publish a clearly Sepolia-only prerelease instead of
making schema compatibility implicit.

### SDK-owned domain types

Generated GraphQL types are transport details. They should not define the public
SDK API or be re-exported wholesale. Public query inputs and results should use
small SDK-owned types with explicit semantics.

The exact symbol names will be finalized during implementation, but the model
must distinguish at least:

- market version from market implementation kind;
- standard, revolving, and unknown market kinds;
- configured/indexed factory identity from transaction deployment targets;
- hook-template bytecode identity from factory-scoped registration state;
- immutable market identity/provenance from mutable indexed snapshots; and
- indexed snapshots from live hydrated state.

The WIP `MarketType = "legacy" | "revolving"` routing abstraction may be removed.
New code should use standard/revolving terminology matching the protocol and
subgraph. Compatibility aliases are unnecessary unless the final app migration
demonstrates a material benefit.

### Narrow generated-code boundary

GraphQL documents and generated types belong under `src/gql`. Domain adapters
must normalize them before values leave that package boundary. Generated files
remain checked in, but callers should not import `dist/gql/graphql` as an API.

`getSubgraphClient` may remain as an escape hatch, but first-party app behavior
should use typed SDK read functions.

### Explicit endpoint compatibility

Add an endpoint metadata query using `IndexerDeployment`. Validate at least:

- chain ID;
- schema release;
- configuration digest presence;
- enabled optional modules; and
- pricing mode.

Cache successful validation per client/endpoint. Return a clear compatibility
error rather than allowing arbitrary GraphQL field errors later.

### Explicit indexed/live APIs

Do not make list methods perform hidden per-market RPC fan-out. Indexed discovery
should return freshness metadata. Live hydration should be a named SDK operation
using the focused V2.5 lens surface and should batch reads where possible.

Transaction builders and action-status methods must either perform live reads or
accept values whose freshness and source are explicit.

### App-facing analytics

Promote the stable analytics concepts required by the current and planned app
into SDK-owned read APIs:

- borrower identity, aggregate stats, daily stats, delinquency/cure history, and
  withdrawal reliability;
- lender identity, positions, activity, daily stats, and risk/return inputs;
- market daily stats, flows, withdrawal history, and delinquency history; and
- protocol aggregates and price observations.

The SDK should expose source data and pagination, not reproduce UI-specific chart
composition or formatting.

## Phases and commit boundaries

Each completed phase should end in a reviewable commit with passing checks for
the surfaces it changes. Generated output belongs in the same commit as its
source documents. Cross-repository app changes must be committed separately.

### Phase 0 - Baseline and plan

- Record the accepted constraints, phases, risks, and verification ledger.
- Confirm the branch is based on the committed `release/v2.5` SDK state.
- Preserve baseline command results for comparison.

Commit intent: `docs: plan v2.5 sdk refactor`

### Phase 1 - Domain and configuration foundation

- Split chain deployment targets, endpoint configuration, and factory discovery
  concepts currently mixed in `constants.ts`.
- Introduce SDK-owned market-kind, factory, registration, provenance, snapshot,
  and endpoint metadata types.
- Replace address-derived market-kind logic where the protocol or indexed
  provenance provides the answer.
- Keep deployment address changes isolated and leave placeholders until the
  ceremony produces final values.
- Add unit tests for kind mapping, target lookup, and invalid/unknown metadata.

Commit intent: `refactor: establish v2.5 sdk domain model`

### Phase 2 - Clean GraphQL contract and codegen

Prerequisite: a deployed V2.5 Graph API endpoint or equivalent introspection
schema. The entity SDL alone does not include Graph Node query/filter types.

The endpoint-independent build cleanup may land before that prerequisite. Query
replacement, transport generation, and operation validation must not proceed
against the entity SDL or a legacy endpoint.

- Make the schema endpoint configurable and remove the stale hard-coded codegen
  URL.
- Fix or remove the ineffective GraphQL checksum cache.
- Add endpoint metadata, hooks-factory, template-registration, market provenance,
  snapshot, collateral identity, and analytics documents.
- Generate transport types against the clean schema.
- Stop exporting generated schema types as the root SDK contract.
- Remove legacy schema documents, selectors, and schema-version feature flags.
- Add document-validation tests against the saved V2.5 introspection schema.

Commit intent: `refactor: target clean v2.5 subgraph schema`

### Phase 3 - Factory, template, and hooks reads

- Normalize `HooksTemplateRegistration` as the sole mutable template state.
- Dispatch hook behavior using `HooksKind`, never a display name.
- Discover every indexed historical factory from the subgraph.
- Expose explicit deployable-target queries and enforce target agreement before
  transaction preview.
- Use aggregated V2.5 lens reads for active state and explicit factory-scoped
  reads where source-factory identity or historical hydration requires them.
- Test same-template-address isolation, disabled registrations, deregistered
  factories, and future/unknown factories.

Commit intent: `refactor: adopt factory scoped hooks registrations`

### Phase 4 - Markets, snapshots, and live hydration

- Hydrate market identity and implementation kind from indexed provenance.
- Normalize indexed `MarketSnapshot`, lender-account snapshot, and collateral
  snapshot freshness.
- Retain efficient indexed list APIs and expose batched live overlays separately.
- Ensure live direct reads recognize standard and revolving markets without a
  historical factory allowlist.
- Use explicit collateral depositor addresses.
- Preserve typed event payload APIs initially; adopt the normalized market event
  cursor where it improves ordering/pagination without losing payload types.
- Add fixed-block historical parity fixtures.

Commit intent: `refactor: separate indexed and live market state`

### Phase 5 - First-class analytics reads

- Add SDK-owned borrower, lender, market, protocol, and price observation models.
- Add paginated queries for the analytics surfaces required by the app.
- Preserve null/unpriced semantics and price-source provenance.
- Test chains with analytics, collateral, wrappers, or pricing disabled.
- Inventory the app's direct GraphQL queries and map each to an SDK API or an
  intentional low-level escape hatch.

Commit intent: `feat: expose v2.5 analytics read models`

### Phase 6 - Transactions and deployment handoff

- Import final Sepolia deployment addresses and endpoint URLs in an isolated
  commit after validating protocol artifacts and subgraph metadata.
- Verify create-market previews for standard and revolving targets.
- Verify wrappers, collateral, periodic terms, access combinations, and APR
  change flows against frozen ABIs.
- Add mismatch tests for SDK target versus subgraph deployment metadata.

Commit intent: `chore: configure v2.5 sepolia deployments`

### Phase 7 - Consumer migration and release gate

- Pack the SDK locally and install it into `wildcat-app-v2`.
- Replace generated GraphQL type imports and direct queries covered by SDK APIs.
- Validate market discovery, market detail live hydration, borrower policy views,
  standard/revolving creation, lender positions, profiles, and analytics.
- Run SDK and app release checks.
- Perform fixed-block and deployed-Sepolia smoke tests before publishing.

SDK and app commits remain separate. Package publication and deployment require
an explicit release decision.

## Verification strategy

Run the narrowest checks during each phase, then the complete SDK suite before
committing:

```sh
yarn lint
yarn build
yarn mocha
```

GraphQL phases additionally require:

- validation of every operation against the V2.5 introspection schema;
- endpoint metadata compatibility tests;
- fixture hydration tests; and
- fixed-block comparison against representative deployed markets.

Consumer integration additionally requires the app's targeted tests, lint, and
production build using a locally packed SDK.

## Risks and controls

### No V2.5 endpoint yet

Do not hand-edit generated GraphQL types. Domain/configuration work can proceed,
but Phase 2 cannot be considered complete until codegen and operation validation
run against a Graph API schema.

### Deployment addresses are not final

Keep structural work independent of addresses. Add addresses and URLs only from
validated deployment artifacts, in a dedicated commit.

### Historical visibility versus deployment permission

Never reuse `indexed`, `lifecycle`, or `isRegistered` as a proxy for transaction
eligibility. Test these combinations independently.

### Generated types currently leak into the app

The app migration will be broad enough to require deliberate compilation and
query validation, but it must not force generated transport types back into the
SDK public API.

### Scope growth

Do not redesign transaction transport, signer/provider compatibility, token
amount arithmetic, or UI presentation unless a V2.5 integration test proves the
existing design blocks the refactor.

## Non-goals

- preserving unpublished `3.1.8-beta` API compatibility;
- querying legacy subgraph endpoint schemas from the new SDK;
- modifying frozen protocol or subgraph behavior;
- hiding stale indexed values behind names that imply live state;
- moving UI formatting or chart composition into the SDK;
- publishing a package, deploying contracts/subgraphs, or changing production
  consumers without a separate release decision; and
- unrelated dependency, toolchain, or transaction-stack upgrades.
