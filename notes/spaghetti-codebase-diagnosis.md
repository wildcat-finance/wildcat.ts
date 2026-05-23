# wildcat.ts spaghetti codebase diagnosis

## rule before edits

do not start structural cleanup until external dependencies are mapped. this sdk sits in a four-surface compatibility chain:

1. `../v2-protocol`: solidity contracts and lens/view functions, especially `MarketLens`/`MarketLensV2`, define the raw market and account read shapes.
2. `../subgraph`: indexes contract events/state and defines the graph schema/fragments the sdk consumes most often.
3. `.` / `wildcat.ts`: wraps lens reads, subgraph reads, generated types, parsers, domain classes, and transaction helpers.
4. `../wildcat-app-v2`: the actual app consumes sdk surfaces and is the main compatibility constraint.

the sdk is consumed outside this repo, especially by the app, and the public barrel exports make internal-looking code potentially user-facing.

first inspect:

- `../v2-protocol` lens/view return structs and events used by the sdk
- `../subgraph` mappings, schema, and fragments that feed sdk generated gql types
- `../wildcat-app-v2` imports from `@wildcatfi/wildcat-sdk`
- any local app tarball/link workflow using this branch
- package exports implied by `src/index.ts`
- direct consumers of `src/gql`, `src/typechain`, and generated types
- protocol/lens/subgraph shape that constrains sdk models
- codegen and generated-file expectations

## overall diagnosis

the main mess is missing ownership boundaries. `market`, `marketaccount`, hooks, gql records, and lens/subgraph mappers all know too much about each other. each new protocol variant adds branches across the sdk instead of landing behind one owner.

## top causes

1. `src/account/index.ts` is a god object. it mixes permissions, previews, transaction population, execution, lens updates, and subgraph/lens construction.

2. `src/market.ts` is also a god object. it mixes market snapshot state, economics, withdrawal timing, lens fetching, subgraph mapping, v1/v2 parsing, and hooks config construction.

3. hook kinds are cloned instead of modeled. `src/access/access-control.ts`, `src/access/fixed-term.ts`, and `src/access/periodic-term.ts` repeat role-provider parsing, lender role operations, template parsing, deployment preview, and tx dispatch with small deltas.

4. there is no canonical hooks parser/registry. `src/access/index.ts` dispatches by names/kinds, while `src/market.ts` also rebuilds hooks config with its own branching.

5. gql event handling is an accretive matrix. `gql/fragments.graphql`, `gql/queries.graphql`, and `src/gql/getMarketRecords.ts` require hand-maintained additions for every new market event family.

6. the public api has no membrane. `src/index.ts` exports broad internal modules plus generated `gql` and `typechain` surfaces, so cleanup cannot assume internals are private.

7. type pressure leaks through casts and non-null assertions. this is not the root cause, but it is evidence that the domain model is forcing callers to prove invariants manually.

## cleanup fronts

1. map the protocol/subgraph/sdk/app dependency chain before touching structure.

2. add characterization tests around the current fixed-term and periodic-term behavior that the app depends on.

3. extract pure account action policies from `marketaccount`: deposit, withdrawal, apr, close, force buyback. keep tx population/execution thin.

4. introduce a hooks registry: kind to parser, template builder, deployment encoder, and role operations.

5. collapse one copied hooks class as a proof before attempting all three.

6. split `market` into snapshot, mappers, economics helpers, and fetchers only after the above is stable.

7. convert market records into a declarative event registry: result field, filter variable, parser, token basis, singleton behavior.

## non-goals

- do not split files merely to reduce line count. that just makes distributed spaghetti.
- do not start with generated files. `src/gql/graphql.ts` and `src/typechain` are huge, but mostly not the disease.
- do not redesign the public api until the app and likely consumers are checked.
- do not make a grand abstraction before proving one narrow extraction reduces duplicated concepts.

## likely first external-dependency pass

1. in `../v2-protocol`, identify `MarketLens`, `MarketLensV2`, hooks structs, and market/account view return shapes the sdk parses.
2. in `../subgraph`, identify schema fields, fragments, mappings, and event records consumed by sdk gql queries.
3. in `../wildcat-app-v2`, search imports from `@wildcatfi/wildcat-sdk`.
4. group app imports by sdk surface: account, market, access hooks, gql helpers, generated gql, typechain, constants, utils.
5. mark which app imports are runtime behavior vs type-only.
6. identify surfaces that are probably private but exported accidentally.
7. use that map to choose the first cleanup front with the lowest api blast radius.

## compatibility invariant

any cleanup should preserve compatibility across protocol lens output, subgraph schema/mappings, sdk generated types/parsers, and app imports/usages in the same pass. if a cleanup only makes the sdk prettier while breaking one of those surfaces, it is not cleanup; it is vandalism with types.

## planning docs

- `notes/sdk-cleanup-plan.md`: phased cleanup plan and slice order.
- `notes/sdk-cleanup-tracker.md`: working tracker for phases, slices, checks, and decisions.
- `notes/compatibility-surface-map.md`: dependency map to fill before structural edits.
