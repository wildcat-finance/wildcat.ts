# wildcat.ts cleanup plan

## stance

do not start sdk structure edits until the cross-surface dependency map is done. the cleanup target is not "make the sdk pretty"; it is reduce duplicated concepts while preserving compatibility across protocol lens views, subgraph schema/mappings, sdk wrappers/parsers, and app usage.

## surfaces

- `../v2-protocol`: solidity contracts, `MarketLens`, `MarketLensV2`, hooks structs, events, and view return shapes.
- `../subgraph`: mappings, schema, fragments, generated graph shape, event history model.
- `.`: sdk models, gql fragments/queries, generated types, parsers, action previews, tx helpers.
- `../wildcat-app-v2`: app imports, runtime expectations, type expectations, and local tarball/link workflows.

## phase 0 - compatibility map

goal: know what must remain source-compatible before touching structure.

slices:

1. app import surface
   - search all `@wildcatfi/wildcat-sdk` imports in `../wildcat-app-v2`.
   - classify imports by sdk module: account, market, access hooks, gql helpers, generated gql, typechain, constants, utils.
   - mark runtime vs type-only imports.
   - identify accidental public surfaces.
   - output: `notes/compatibility-surface-map.md`.

2. protocol lens surface
   - inspect `../v2-protocol` lens contracts and structs consumed by sdk.
   - map `MarketLens` and `MarketLensV2` return shapes to sdk constructors/parsers.
   - note which fields are stable contract api vs branch-specific periodic hooks additions.

3. subgraph surface
   - inspect `../subgraph` schema/mappings/fragments corresponding to sdk gql queries.
   - map sdk gql fragments/queries to subgraph entities and event records.
   - identify generated types the app imports directly, if any.

4. sdk public surface
   - map `src/index.ts` exports and likely app usage.
   - classify safe internal refactor zones vs compatibility-sensitive public shapes.

tests/checks:

- no code behavior tests required for phase 0.
- every map entry should include file references and whether it blocks a cleanup slice.

## phase 1 - characterization tests

goal: pin current behavior before extraction.

slices:

1. account action previews
   - deposit availability
   - queue withdrawal availability
   - fixed-term closure/withdrawal behavior
   - periodic-term withdrawal window behavior
   - periodic apr proposal/decrease behavior

2. hooks deployment previews
   - open-term deploy preview
   - fixed-term deploy preview
   - periodic-term deploy preview
   - deploy existing hooks vs deploy market and hooks

3. market record parsing
   - existing event families
   - fixed/periodic event additions
   - singleton event handling

tests/checks:

- focused unit tests in sdk.
- app typecheck/build only after the app surface map says a slice touches app-used api.

## phase 2 - low-blast-radius extractions

goal: remove duplicated concepts without changing public behavior.

slices:

1. extract account action policy helpers from `src/account/index.ts`.
   - keep `MarketAccount` methods as public wrappers.
   - move pure preview logic into focused helpers.
   - tests travel with each extracted policy.

2. extract shared hooks role-provider and fee helpers.
   - shared role-provider parsing.
   - shared borrower/fee readiness checks.
   - shared add/block lender tx encoding where compatible.

3. introduce hooks kind registry.
   - central kind/name dispatch.
   - one canonical mapping for subgraph and lens hooks kinds.
   - keep old exports stable.

tests/checks:

- sdk unit tests.
- `yarn build`.
- app compile/typecheck for touched surfaces.

## phase 3 - larger structural slices

goal: collapse the architecture around stable ownership boundaries.

slices:

1. collapse copied hooks classes incrementally.
   - start with shared template base or instance base.
   - prove with one hook family before applying to all three.

2. split `src/market.ts`.
   - market snapshot/data shape.
   - market economics helpers.
   - lens/subgraph mappers.
   - fetchers/static query helpers.

3. make market records declarative.
   - one registry for event result field, filter variable, parser, token basis, singleton behavior.
   - reduce gql record addition to one table entry plus fragments.

tests/checks:

- sdk characterization tests.
- sdk build/lint.
- app build/typecheck.
- codegen no-op check when gql fragments move.

## phase 4 - public api tightening

goal: only after app compatibility is known, reduce accidental surface area.

slices:

1. define supported public exports.
2. identify deprecated or accidental exports.
3. add compatibility aliases where needed.
4. document migration if any breaking changes are unavoidable.

tests/checks:

- app migration proof.
- package build.
- optional release notes.

## default slice rule

each implementation slice should have:

- a narrow scope
- explicit compatibility notes
- focused tests
- sdk build/check
- app validation when the slice touches app-used surfaces
- tracker update before and after implementation
