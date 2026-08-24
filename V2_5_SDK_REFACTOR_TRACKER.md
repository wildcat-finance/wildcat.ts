# V2.5 SDK Refactor Tracker

This is the execution ledger for `V2_5_SDK_REFACTOR_PLAN.md`. Update it in the
same commit as the work whose status changes.

Status values:

- `[ ]` not started
- `[~]` in progress
- `[x]` complete and verified
- `[!]` blocked or requires an external input

## Current state

- [x] Branch is `feat/sdk-v3.2.4-integration` at integration baseline `1b8c720`.
- [x] SDK package version is `3.2.4-beta`.
- [x] Existing V2 consumers remain on the `3.1.17` release lineage.
- [x] Final V2.5 Sepolia protocol targets are deployed and loaded into SDK
      configuration.
- [x] The V2.5.9 subgraph is deployed to Goldsky and Hinterlight from the same
      source and configuration.
- [x] A full hosted V2.5 Graph API schema was captured from Goldsky; every SDK
      operation also validates against Hinterlight's compatible schema.
- [x] Factory/template registration identity and live hook reads use explicit
      factory scope.
- [x] Indexed market, lender-account, and collateral state carries explicit
      freshness and remains distinguishable from live lens/RPC overlays.
- [x] Borrower, lender, market, protocol, and price analytics use SDK-owned
      indexed read models with query-block freshness.
- [x] Final V2.5 Sepolia addresses, start blocks, and the hosted endpoint are
      available.

## Phase 0 - Baseline and plan

- [x] Inspect repository instructions and source-of-truth documentation.
- [x] Confirm clean SDK branch and baseline commit.
- [x] Trace current subgraph, factory, lens, and app integration boundaries.
- [x] Record refactor objective, constraints, non-goals, risks, and done criteria.
- [x] Record phased implementation and rollback boundaries.
- [x] Commit Phase 0 documentation.

## Phase 1 - Domain and configuration foundation

- [x] Define SDK-owned market-kind and unknown-kind behavior.
- [x] Define indexed factory identity and provenance types.
- [x] Define transaction deployment-target configuration separately.
- [x] Define hook-template identity and registration types separately.
- [x] Define indexed snapshot freshness metadata.
- [x] Define indexer endpoint metadata and compatibility error types.
- [x] Split overloaded deployment, subgraph, and factory-routing configuration.
- [x] Remove WIP `MarketType = "legacy" | "revolving"` routing assumptions.
- [x] Remove historical factory discovery from checked-in deployment constants.
- [x] Replace address-derived kind logic where authoritative data is available.
- [x] Add unit tests for mappings, unknown values, and missing targets.
- [x] Run Phase 1 checks.
- [x] Commit Phase 1.

## Phase 2 - Clean GraphQL contract and codegen

- [x] Obtain a V2.5 Graph API endpoint or introspection schema.
- [x] Make the codegen schema source explicit/configurable.
- [x] Remove the ineffective partial-introspection checksum cache.
- [x] Remove the post-generation AST rewrite and its otherwise-unused dependency.
- [x] Add codegen configuration regression tests.
- [x] Add and validate `IndexerDeployment` query.
- [x] Replace `FactoryHooksTemplate` documents with registration documents.
- [x] Follow `HooksInstance.templateRegistration`.
- [x] Select factory `marketKind`, generation, ABI family, lifecycle, indexing,
      target, and observed registration fields.
- [x] Select market origin, kind, generation, ABI family, and creation coordinates.
- [x] Select market/account/collateral snapshot freshness.
- [x] Select collateral depositor `address`.
- [x] Regenerate GraphQL transport types.
- [x] Stop root-level re-export of generated schema types.
- [x] Remove legacy documents and schema selectors.
- [x] Remove chain-level schema compatibility flags.
- [x] Validate every operation against V2.5 introspection.
- [x] Add GraphQL contract regression tests.
- [x] Run Phase 2 checks.
- [x] Commit Phase 2.

## Phase 3 - Factory, registration, and hooks behavior

- [x] Normalize one SDK registration object per factory/template pair.
- [x] Dispatch template behavior by `HooksKind`.
- [x] Preserve display name as data, not type identity.
- [x] Discover all indexed historical factories from subgraph data.
- [x] Query only explicit SDK targets for transaction construction.
- [x] Cross-check SDK targets with subgraph deployment-target metadata.
- [x] Implement active aggregated lens reads.
- [x] Implement explicit factory-scoped live reads where required.
- [x] Test identical template addresses on multiple factories.
- [x] Test disabled registrations.
- [x] Test deregistered but indexed factories.
- [x] Test unknown/future factories and kinds.
- [x] Run Phase 3 checks.
- [x] Commit Phase 3.

## Phase 4 - Market discovery, snapshots, and live state

- [x] Normalize immutable market identity/provenance.
- [x] Normalize indexed market snapshot with freshness.
- [x] Normalize lender-account snapshot with freshness.
- [x] Normalize collateral snapshot and depositor address.
- [x] Separate indexed list APIs from named live-hydration APIs.
- [x] Batch focused V2.5 lens overlays.
- [x] Ensure live revolving recognition does not require historical allowlists.
- [x] Preserve typed event payload APIs.
- [x] Use normalized event ordering/pagination where appropriate.
- [x] Add V1 historical market fixture.
- [x] Add historical standard V2 fixture.
- [x] Add V2.5 standard fixture.
- [x] Add V2.5 revolving fixture.
- [x] Add fixed-block parity checks.
- [x] Run Phase 4 checks.
- [x] Commit Phase 4.

## Phase 5 - Analytics read models

- [x] Define stable pagination primitives.
- [x] Add borrower identity and aggregate-stat reads.
- [x] Add borrower daily/cost/delinquency/reliability reads.
- [x] Add lender identity, position, activity, and daily-stat reads.
- [x] Add market daily flow and delinquency-history reads.
- [x] Add protocol aggregate reads.
- [x] Add price observation/source reads with unpriced semantics.
- [x] Test optional modules disabled by chain.
- [x] Inventory app direct GraphQL queries.
- [x] Map each app query to an SDK API or intentional escape hatch.
- [x] Run Phase 5 checks.
- [x] Commit Phase 5.

## Phase 6 - Transactions and deployment configuration

- [x] Obtain final Sepolia deployment artifacts.
- [x] Verify standard hooks-factory target.
- [x] Verify revolving hooks-factory target.
- [x] Verify wrapper-factory target.
- [x] Verify V2.5 lens addresses and ABIs.
- [x] Verify V2.5 subgraph endpoint metadata and config digest.
- [~] Add addresses and URLs in an isolated commit.
- [x] Test standard create-market preview and encoding.
- [x] Test revolving create-market preview and encoding.
- [x] Test template/factory mismatch rejection.
- [x] Test wrapper and transfer-policy constraints.
- [x] Test periodic-term and APR-reduction paths.
- [x] Run Phase 6 checks.
- [ ] Commit Phase 6.

## Phase 7 - App migration and release gate

- [ ] Pack the SDK locally.
- [ ] Install the local package into `wildcat-app-v2`.
- [ ] Remove app imports of SDK-generated GraphQL types where practical.
- [ ] Migrate app direct queries covered by first-class SDK APIs.
- [ ] Verify historical market discovery.
- [ ] Verify market detail live hydration.
- [ ] Verify borrower policy/template/instance views.
- [ ] Verify standard market creation.
- [ ] Verify revolving market creation.
- [ ] Verify lender positions and withdrawal views.
- [ ] Verify borrower/lender profiles and analytics.
- [ ] Run targeted app tests.
- [ ] Run app lint and production build.
- [ ] Commit app migration separately.
- [ ] Run deployed-Sepolia smoke checks.
- [ ] Prepare release handoff; do not publish without explicit approval.

## Verification ledger

| Date | Scope | Command/check | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-07-17 | SDK baseline | `yarn lint` | Pass with warning | Existing unused `LegacyBasicLenderDataFragmentDoc` warning |
| 2026-07-17 | SDK baseline | `yarn build` | Pass | TypeScript production build |
| 2026-07-17 | SDK baseline | `yarn mocha` | Pass | 102 passing |
| 2026-07-17 | New entity schema | SDK fragment field audit | Partial pass | Only documented template-registration field breaks found; Query root requires Graph API schema |
| 2026-07-17 | Live legacy endpoints | Introspection and operation validation | Fail as expected | Current generated superset has 15 invalid operations on mainnet; partial selector layer is insufficient |
| 2026-07-17 | SDK Phase 1 | `yarn lint` | Pass with warning | Existing unused `LegacyBasicLenderDataFragmentDoc` warning remains scoped to Phase 2 removal |
| 2026-07-17 | SDK Phase 1 | `yarn build` | Pass | Clean TypeScript production build after config/domain split |
| 2026-07-17 | SDK Phase 1 | `yarn mocha` | Pass | 113 passing, including domain, target, provenance, preview, and routing regressions |
| 2026-07-17 | SDK Phase 1 | `git diff --check` | Pass | No whitespace errors |
| 2026-07-17 | SDK Phase 2 prep | `env -u WILDCAT_SUBGRAPH_SCHEMA yarn codegen:gql` | Fail as expected | Stops before generation with an explicit full-schema requirement |
| 2026-07-17 | SDK Phase 2 prep | `yarn lint` | Pass with warning | Existing unused legacy GraphQL fragment warning remains |
| 2026-07-17 | SDK Phase 2 prep | `yarn build` | Pass | Generated transport file remains unchanged pending the V2.5 schema |
| 2026-07-17 | SDK Phase 2 prep | `yarn mocha` | Pass | 115 passing, including explicit codegen-input tests |
| 2026-07-17 | V2.5 Graph API schema | Local Graph Node deploy plus `yarn codegen:schema` | Pass | Captured the complete Graph-generated API schema from the frozen subgraph |
| 2026-07-17 | GraphQL contract | Standard GraphQL validation over all fragments and operations | Pass | No field, type, variable, or fragment validation errors |
| 2026-07-17 | Endpoint compatibility | Mock Graph API integration | Pass | Metadata is normalized, validated, cached on success, retried on failure, and gates client operations |
| 2026-07-17 | Local indexing smoke | `validateSubgraphEndpoint` against local Graph Node | Environment blocked | Public Sepolia RPC returned HTTP 403 for historical `eth_getLogs`; hosted endpoint smoke remains Phase 6/7 |
| 2026-07-17 | SDK Phase 2 | `yarn lint` | Pass | Generated transport is intentionally excluded; source and tests are clean |
| 2026-07-17 | SDK Phase 2 | `yarn build` | Pass | TypeScript production build against generated V2.5 transport |
| 2026-07-17 | SDK Phase 2 | `yarn mocha` | Pass | 124 passing, including endpoint-gate and collateral-identity regressions |
| 2026-07-17 | SDK Phase 2 | `env -u WILDCAT_SUBGRAPH_SCHEMA yarn codegen:gql` | Pass | Reproducible from the checked-in full schema |
| 2026-07-17 | SDK Phase 2 | `git diff --check` | Pass | No whitespace errors |
| 2026-07-17 | SDK Phase 3 targeted | Hooks routing, registration, deployment-target, and preview tests | Pass | Same-address multi-factory scope, pagination, unknown kinds, disabled templates, and deregistered factories covered |
| 2026-07-17 | SDK Phase 3 | `yarn lint` | Pass | Source and tests are clean |
| 2026-07-17 | SDK Phase 3 | `yarn build` | Pass | TypeScript production build with factory-scoped public APIs |
| 2026-07-17 | SDK Phase 3 | `yarn mocha` | Pass | 133 passing, including fail-closed deployment authority regressions |
| 2026-07-17 | SDK Phase 3 | `env -u WILDCAT_SUBGRAPH_SCHEMA yarn codegen:gql` | Pass | Paginated factory and registration queries reproduce generated transport types |
| 2026-07-17 | SDK Phase 3 | `git diff --check` | Pass | No whitespace errors |
| 2026-07-17 | SDK Phase 4 fixtures | Fixed-block V1, historical V2, V2.5 standard, and V2.5 revolving parity | Pass | Provenance, factory lifecycle, optional revolving state, and snapshot freshness remain distinct |
| 2026-07-17 | SDK Phase 4 targeted | Indexed snapshot, mixed live hydration, filter, and event-cursor tests | Pass | Market, lender, collateral, pagination, and no-allowlist behavior covered |
| 2026-07-17 | SDK Phase 4 | `yarn lint` | Pass | Source and tests are clean |
| 2026-07-17 | SDK Phase 4 | `yarn build` | Pass | TypeScript production build with indexed/live public APIs |
| 2026-07-17 | SDK Phase 4 | `yarn mocha` | Pass | 141 passing |
| 2026-07-17 | SDK Phase 4 | `env -u WILDCAT_SUBGRAPH_SCHEMA yarn codegen:gql` | Pass | Market provenance, snapshot, and event cursor operations reproduce transport types |
| 2026-07-17 | SDK Phase 4 | `git diff --check` | Pass | No whitespace errors |
| 2026-07-17 | SDK Phase 5 targeted | Analytics pagination and read-model fixtures | Pass | 12 passing; cursor/block invariants and every public analytics family covered |
| 2026-07-17 | SDK Phase 5 app inventory | Direct GraphQL callsite mapping | Pass | Every app query maps to an SDK API or documented app-owned escape hatch |
| 2026-07-17 | SDK Phase 5 | `yarn lint` | Pass | Source and tests are clean |
| 2026-07-17 | SDK Phase 5 | `yarn build` | Pass | TypeScript production build with public analytics models |
| 2026-07-17 | SDK Phase 5 | `yarn mocha` | Pass | 153 passing |
| 2026-07-17 | SDK Phase 5 | `env -u WILDCAT_SUBGRAPH_SCHEMA yarn codegen:gql` | Pass | Analytics documents reproduce against the checked-in V2.5 Graph API schema |
| 2026-07-17 | SDK Phase 5 | `git diff --check` | Pass | No whitespace errors |
| 2026-08-24 | Final Sepolia targets | Protocol inventory plus on-chain runtime and anchor reads | Pass | Final factories, lens, wrapper facade, authority helper, borrower registry, and role-provider factory have code; factory/lens/helper/registry anchors resolve to the expected ArchController |
| 2026-08-24 | Hosted endpoint parity | Goldsky and Hinterlight metadata, factory, registration, and market reads | Pass | Both report config digest `2ff16531111cc86080be714a4c9620340f8777c06c6b82eb92189fcab902109e`, 11 factories, 21 registrations, 467 markets, and no configured target issues |
| 2026-08-24 | Hosted GraphQL contract | Refresh from Goldsky and validate all operations against both providers | Pass | Provider Graph Node versions differ only outside the SDK document surface |
| 2026-08-24 | Live SDK hook read | Indexed registrations plus V2.5 lens read for the Sepolia executor | Pass | Borrower registration resolved on-chain; all 21 factory-scoped templates hydrated and the six final-target registrations are enabled with the corrected fee recipient |
| 2026-08-24 | SDK Phase 6 | `env -u WILDCAT_SUBGRAPH_SCHEMA yarn codegen:gql` | Pass | Generated transport reproduces from the refreshed checked-in schema |
| 2026-08-24 | SDK Phase 6 | `yarn lint` | Pass | Source and tests are clean |
| 2026-08-24 | SDK Phase 6 | `yarn build` | Pass | TypeScript production build |
| 2026-08-24 | SDK Phase 6 | `yarn mocha` | Pass | 240 passing |
| 2026-08-24 | SDK package | `npm pack --dry-run --json` | Pass | `3.2.4-beta` package assembled successfully without publishing |
| 2026-08-24 | SDK Phase 6 | `git diff --check` | Pass | No whitespace errors |

## Decision ledger

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-07-17 | Do not preserve unpublished `3.1.8-beta` API compatibility | Existing users remain on deployed `3.1.7`; no current consumer depends on WIP types |
| 2026-07-17 | Use one clean V2.5 GraphQL schema | The frozen subgraph deliberately removed backwards query compatibility; dual-schema SDK logic is incomplete and unnecessary |
| 2026-07-17 | Subgraph discovers history; SDK config authorizes transaction targets | Prevents historical factory loss without trusting indexed data alone for value-moving targets |
| 2026-07-17 | Keep indexed and live state explicit | Prevents stale GraphQL snapshots from becoming transaction inputs while preserving efficient list hydration |
| 2026-07-17 | Generated GraphQL types are internal transport types | Decouples the SDK/app contract from future schema maintenance |
| 2026-07-17 | Promote stable analytics reads into the SDK | The subgraph now treats profiles and analytics as first-class data; most consumers should not maintain parallel raw queries |
| 2026-07-17 | Use `standard`, `revolving`, and explicit `unknown` market kinds | Removes the overloaded `legacy` factory-routing label and prevents unknown historical implementations from silently becoming standard |
| 2026-07-17 | Keep historical factory addresses out of deployment configuration | Indexed provenance discovers old factories; checked-in addresses authorize only the current transaction targets |
| 2026-07-17 | Require an explicit full Graph API schema for codegen | Prevents accidental generation against the stale Sepolia endpoint or the incomplete entity SDL |
| 2026-07-17 | Remove the GraphQL checksum cache and post-generation rewrite | The cache stored partial introspection with inconsistent digest ordering; standard codegen options replace the required-typename rewrite |
| 2026-07-17 | Key hook behavior by indexed factory/template registration kind | Template addresses are stored initcode blobs rather than callable contracts, and mutable lens display names are not type identity |
| 2026-07-17 | Treat lens template state and ArchController registration as live authority | Indexed enablement and factory registration can lag; previews fail closed unless indexed provenance and positive live registration are both present |
| 2026-07-17 | Page factory and registration metadata explicitly | Graph's default entity limit must not truncate historical factories or factory-scoped registrations |
| 2026-07-17 | Retain immutable indexed provenance after live hydration | Mutable class fields can be refreshed without losing the factory, generation, ABI family, origin, and creation facts that explain a historical market |
| 2026-07-17 | Mark mutable models as `indexed` or `live` | Callers can distinguish freshness-stamped projections from lens/RPC overlays even when both use the existing `Market` and `MarketAccount` behavior classes |
| 2026-07-17 | Preserve indexed kind when an older V2 lens cannot classify a historical factory | A missing deployment allowlist entry is not evidence that indexed standard/revolving provenance is wrong; unified V2.5 optional fields remain live authority when present |
| 2026-07-17 | Add a sequence-cursor market event API without replacing typed event APIs | The normalized subgraph chronology supplies stable cross-event ordering while existing payload-specific records retain their richer fields |
| 2026-07-17 | Keep token amounts as `bigint` and Graph `BigDecimal` USD values as strings | Prevents analytics transport from introducing precision loss; UI consumers choose display conversion explicitly |
| 2026-07-17 | Pin analytics continuation cursors to the first page's Graph block | Entity IDs are stable but not globally append-ordered; block pinning prevents inserts or mutable daily entities from changing a traversal |
| 2026-07-17 | Include `_meta` freshness on every analytics result envelope | Indexed aggregate values otherwise have no entity-level update coordinates and could be mistaken for live state |
| 2026-07-17 | Treat optional-module absence and unpriced tokens as explicit states | Disabled analytics/pricing and missing observations must not collapse into empty data or numeric zero |
| 2026-07-17 | Keep cross-market notification polling as an app-owned GraphQL escape hatch | Its UI notification projections are not stable domain read models; profile and analytics queries now belong to the SDK |
| 2026-08-24 | Keep Goldsky as the configured Sepolia endpoint and validate Hinterlight as an equivalent custom endpoint | The SDK already accepts caller-supplied endpoints; adding unrequested client-side failover would introduce routing semantics beyond deployment alignment |
| 2026-08-24 | Accept event-lazy optional-module inventory before its first event | The final wrapper, identity, and role-provider targets are present in the generated manifest and verified on-chain; their subgraph entities materialize only when the first relevant event is handled |

## Open inputs and blockers

| Input | Owner/source | Blocks | Current handling |
| --- | --- | --- | --- |
| App migration feedback | `wildcat-app-v2` integration | Final SDK surface | Treat required behavior as acceptance criteria, not current generated types |

## Known cleanup candidates within scope

- [x] Remove incomplete legacy GraphQL document machinery.
- [x] Remove stale chain-level periodic schema feature flags.
- [x] Fix codegen URL/runtime URL divergence by requiring an explicit schema.
- [x] Remove the checksum cache.
- [ ] Split oversized `constants.ts` by responsibility without changing unrelated
      transaction mechanics.
- [ ] Extract subgraph hydration from the large `Market` class into focused
      adapters.
- [ ] Consolidate duplicated hooks-template subgraph hydration after adopting
      registration data.
- [x] Stop requiring mutable template names to identify indexed hook behavior.
- [x] Stop requiring mutable template names to identify lens hook behavior.

## Commit ledger

| Phase | Commit | Verification | Status |
| --- | --- | --- | --- |
| 0 - Plan | `1c6e231` | Documentation and clean worktree check | Complete |
| 1 - Domain/config | `dde64f7` | Domain/config unit tests, lint, build, 113-test suite | Complete |
| 2 - GraphQL/codegen | `6e56b3b` | Schema validation, endpoint-gate integration, lint, build, 124-test suite | Complete |
| 3 - Factories/hooks | `aff7c32` | Multi-factory fixtures, lint, build, 133-test suite | Complete |
| 4 - Markets/live | `7a930d1` | Historical fixtures, fixed-block parity, lint, build, 141-test suite | Complete |
| 5 - Analytics | This commit | Analytics fixtures, app query inventory, lint, build, 153-test suite | Complete |
| 6 - Deployment | Working tree | Artifact checks, previews, hosted schema, live endpoint/lens checks, lint, build, 240-test suite | Ready for commit |
| 7 - App/release | Pending | App tests, lint, build, Sepolia smoke | Not started |

## Working log

### 2026-07-17

- Confirmed clean `feat/sdk-refactor` branch at `4c3d8cc`.
- Reclassified `3.1.8-beta` as disposable WIP rather than a compatibility base.
- Recorded the clean-schema, SDK-owned-type, explicit-authority refactor plan.
- Committed the plan and tracker as the Phase 0 rollback point.
- Split chain deployments, subgraph endpoints, and SDK domain types out of
  `constants.ts` without changing the checked-in addresses or URLs.
- Replaced the unpublished `marketType: "legacy" | "revolving"` API with
  `marketKind: "standard" | "revolving" | "unknown"`.
- Removed the checked-in historical factory inventory. Subgraph reads now retain
  factories returned by the endpoint; live borrower hooks reads use configured
  transaction targets until the Phase 3 normalized read layer lands.
- Made old-schema hydration use indexed factory provenance and V2.5 lens
  hydration use the revolving optional fields, with inconsistent/unknown input
  remaining explicitly unknown.
- Added regression coverage for historical factory provenance, missing targets,
  unknown enum values, public exports, and both factory deployment previews.
- Replaced the hard-coded legacy GraphQL endpoint with an explicit
  `WILDCAT_SUBGRAPH_SCHEMA` input accepting a deployed Graph API or full
  introspection schema.
- Removed the stale partial-introspection cache, schema snapshot, timing/logging
  files, post-generation AST rewrite, and its otherwise-unused `ts-morph`
  dependency.
- Deployed the frozen subgraph to a local Graph Node and captured its full API
  schema. Historical indexing could not advance because the public Sepolia RPC
  returned HTTP 403 for `eth_getLogs`; schema introspection was unaffected.
- Replaced legacy factory-template documents with exact factory/template
  registrations and selected indexed factory, market provenance, creation, and
  snapshot freshness fields.
- Regenerated the transport module from the checked-in schema and removed the
  legacy documents, per-chain selectors, schema feature flags, and root-level
  generated GraphQL exports.
- Added explicit endpoint metadata validation for chain/network identity,
  schema release, digest shape, protocol anchors, optional modules, and pricing
  mode. SDK client operations wait for validation, successful results are
  cached per chain/endpoint, and failures remain retryable.
- Made indexed hook dispatch depend on the authoritative hook kind rather than
  mutable display names, while retaining historical factories returned by the
  subgraph.
- Added collateral depositor addresses and restored liquidated-share reset
  events to the SDK query path.
- Added paginated, SDK-owned factory and factory/template registration reads so
  historical and future factories remain visible without becoming transaction
  targets.
- Replaced mutable lens-name dispatch with exact indexed `HooksKind` identity,
  retaining independent registrations when the same template initcode address
  appears on multiple factories.
- Switched V2.5 borrower hook reads to the aggregated active-template lens path,
  followed by explicit factory-scoped instance reads and live ArchController
  registration checks.
- Restricted create-market previews to the configured factory for the requested
  market kind and required matching indexed deployment metadata plus positive
  live factory registration. Stale indexed enablement cannot override live lens
  state, while missing live or indexed authority fails closed.
- Centralized Graph transport normalization for factory registrations, market
  provenance, market snapshots, lender snapshots, collateral snapshots, and
  normalized market events.
- Added immutable provenance and freshness-stamped snapshots to SDK market,
  lender-account, and collateral models. Mutable fields now explicitly report
  whether their latest source is indexed or live.
- Added SDK-owned indexed-market filters plus named mixed-generation live
  hydration for markets and lender accounts. V2.5 uses focused batch lens reads;
  historical V1 uses the legacy batch lens.
- Preserved indexed historical market kind when older V2 lens data cannot
  classify an unconfigured factory, while unified live optional fields identify
  revolving markets without address allowlists.
- Added normalized market-event sequence pagination alongside the existing typed
  event payload APIs, plus deterministic V1, historical V2, V2.5 standard, and
  V2.5 revolving fixed-block fixtures.
- Added SDK-owned borrower, lender, market, protocol, withdrawal-reliability,
  activity, and price read models without exporting generated Graph transport
  types.
- Added Graph-block-pinned entity-ID pagination. Every analytics result exposes
  query block/deployment/error metadata, while lender and market references
  retain their entity snapshot freshness where available.
- Preserved token amounts as `bigint`, USD decimals as strings, and price-source
  provenance with explicit unpriced reasons for disabled or missing data.
- Added optional-module feature discovery for SDK-managed and custom Apollo
  clients, including retryable deployment-metadata resolution.
- Inventoried all app direct GraphQL callsites and mapped profile analytics to
  first-class SDK APIs while documenting the narrow notification/subscription
  and server-discovery escape hatches for Phase 7.

### 2026-08-24

- Replaced the July Sepolia preview factories, lens, wrapper, and authority
  helper with the final ceremony addresses and added the deployed borrower
  registry and access-list role-provider factory to the public inventory.
- Moved the default Sepolia Graph API endpoint from V2.5.8 to V2.5.9.
- Refreshed the checked-in Graph API schema and generated transport from the
  live Goldsky deployment, then validated every SDK operation against both the
  Goldsky and Hinterlight deployments.
- Verified identical endpoint metadata, indexed factory targets, template
  registrations, corrected fee recipients, and market inventory across both
  providers.
- Exercised the final V2.5 lens against live Sepolia through the SDK and kept
  historical factory discovery separate from the two final transaction targets.
- Confirmed the final wrapper facade and other new optional-module contracts
  on-chain. Their subgraph inventory is intentionally empty until the first
  relevant event materializes each entity.
