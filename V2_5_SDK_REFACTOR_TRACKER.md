# V2.5 SDK Refactor Tracker

This is the execution ledger for `V2_5_SDK_REFACTOR_PLAN.md`. Update it in the
same commit as the work whose status changes.

Status values:

- `[ ]` not started
- `[~]` in progress
- `[x]` complete and verified
- `[!]` blocked or requires an external input

## Current state

- [x] Branch is `feat/sdk-refactor` at baseline `4c3d8cc`.
- [x] SDK package version is `3.1.8-beta`.
- [x] Existing deployed/testnet consumers remain on `3.1.7`.
- [x] Protocol is frozen for this refactor.
- [x] Subgraph schema and mappings are frozen for this refactor.
- [x] Breaking changes to unpublished `3.1.8-beta` are allowed.
- [x] A full V2.5 Graph API schema was captured from a local deployment of the
      frozen subgraph.
- [!] Final V2.5 Sepolia addresses and start blocks are pending deployment.
- [!] A hosted V2.5 Graph API endpoint URL is pending subgraph deployment.

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

- [ ] Normalize one SDK registration object per factory/template pair.
- [ ] Dispatch template behavior by `HooksKind`.
- [ ] Preserve display name as data, not type identity.
- [ ] Discover all indexed historical factories from subgraph data.
- [ ] Query only explicit SDK targets for transaction construction.
- [ ] Cross-check SDK targets with subgraph deployment-target metadata.
- [ ] Implement active aggregated lens reads.
- [ ] Implement explicit factory-scoped live reads where required.
- [ ] Test identical template addresses on multiple factories.
- [ ] Test disabled registrations.
- [ ] Test deregistered but indexed factories.
- [ ] Test unknown/future factories and kinds.
- [ ] Run Phase 3 checks.
- [ ] Commit Phase 3.

## Phase 4 - Market discovery, snapshots, and live state

- [ ] Normalize immutable market identity/provenance.
- [ ] Normalize indexed market snapshot with freshness.
- [ ] Normalize lender-account snapshot with freshness.
- [ ] Normalize collateral snapshot and depositor address.
- [ ] Separate indexed list APIs from named live-hydration APIs.
- [ ] Batch focused V2.5 lens overlays.
- [ ] Ensure live revolving recognition does not require historical allowlists.
- [ ] Preserve typed event payload APIs.
- [ ] Use normalized event ordering/pagination where appropriate.
- [ ] Add V1 historical market fixture.
- [ ] Add historical standard V2 fixture.
- [ ] Add V2.5 standard fixture.
- [ ] Add V2.5 revolving fixture.
- [ ] Add fixed-block parity checks.
- [ ] Run Phase 4 checks.
- [ ] Commit Phase 4.

## Phase 5 - Analytics read models

- [ ] Define stable pagination primitives.
- [ ] Add borrower identity and aggregate-stat reads.
- [ ] Add borrower daily/cost/delinquency/reliability reads.
- [ ] Add lender identity, position, activity, and daily-stat reads.
- [ ] Add market daily flow and delinquency-history reads.
- [ ] Add protocol aggregate reads.
- [ ] Add price observation/source reads with unpriced semantics.
- [ ] Test optional modules disabled by chain.
- [ ] Inventory app direct GraphQL queries.
- [ ] Map each app query to an SDK API or intentional escape hatch.
- [ ] Run Phase 5 checks.
- [ ] Commit Phase 5.

## Phase 6 - Transactions and deployment configuration

- [!] Obtain final Sepolia deployment artifacts.
- [ ] Verify standard hooks-factory target.
- [ ] Verify revolving hooks-factory target.
- [ ] Verify wrapper-factory target.
- [ ] Verify V2.5 lens addresses and ABIs.
- [ ] Verify V2.5 subgraph endpoint metadata and config digest.
- [ ] Add addresses and URLs in an isolated commit.
- [ ] Test standard create-market preview and encoding.
- [ ] Test revolving create-market preview and encoding.
- [ ] Test template/factory mismatch rejection.
- [ ] Test wrapper and transfer-policy constraints.
- [ ] Test periodic-term and APR-reduction paths.
- [ ] Run Phase 6 checks.
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

## Open inputs and blockers

| Input | Owner/source | Blocks | Current handling |
| --- | --- | --- | --- |
| Hosted V2.5 Graph API endpoint | Subgraph deployment | Phase 6 and app smoke tests | Phase 2 uses the checked-in full local Graph API schema; refresh and validate it against the hosted endpoint after deployment |
| Sepolia V2.5 addresses/start blocks | Protocol deployment ceremony | Phase 6 | Keep address changes isolated |
| Replacement subgraph URLs | Subgraph deployment | Phase 6 and app smoke tests | Retain placeholders until endpoint metadata validates |
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
- [ ] Stop requiring mutable template names to identify lens hook behavior.

## Commit ledger

| Phase | Commit | Verification | Status |
| --- | --- | --- | --- |
| 0 - Plan | `1c6e231` | Documentation and clean worktree check | Complete |
| 1 - Domain/config | `dde64f7` | Domain/config unit tests, lint, build, 113-test suite | Complete |
| 2 - GraphQL/codegen | This commit | Schema validation, endpoint-gate integration, lint, build, 124-test suite | Complete |
| 3 - Factories/hooks | Pending | Multi-factory fixtures, lint, build, mocha | Not started |
| 4 - Markets/live | Pending | Historical fixtures, fixed-block parity, lint, build, mocha | Not started |
| 5 - Analytics | Pending | Analytics fixtures, lint, build, mocha | Not started |
| 6 - Deployment | Pending | Artifact checks, previews, deployed endpoint checks | Blocked on deployment |
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
