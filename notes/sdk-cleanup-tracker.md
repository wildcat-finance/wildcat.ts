# wildcat.ts cleanup tracker

## current status

phase 0 complete enough to start phase 1 tests: app, protocol, subgraph, sdk export surfaces, blockers, and initial cleanup boundaries are mapped. no structural sdk edits yet.

## phase 0 - compatibility map

- [x] app import surface in `../wildcat-app-v2`
- [x] protocol lens/view surface in `../v2-protocol`
- [x] subgraph schema/mapping/query surface in `../subgraph`
- [x] sdk public export surface in `src/index.ts`
- [x] classify runtime vs type-only app imports
- [x] classify safe internal zones vs compatibility-sensitive zones
- [x] record blockers in `notes/compatibility-surface-map.md`

## phase 1 - characterization tests

- [ ] account action preview tests
- [ ] fixed-term behavior tests
- [ ] periodic-term behavior tests
- [ ] hooks deployment preview tests
- [ ] market record parsing tests

## phase 2 - low-blast-radius extractions

- [ ] extract account action policy helpers
- [ ] extract shared hooks role-provider helpers
- [ ] extract shared hooks fee/borrower readiness helpers
- [ ] introduce hooks kind registry

## phase 3 - larger structural slices

- [ ] collapse copied hooks classes incrementally
- [ ] split `src/market.ts` around stable ownership boundaries
- [ ] convert market records to declarative registry

## phase 4 - public api tightening

- [ ] define supported public exports
- [ ] identify accidental exports
- [ ] add compatibility aliases or migration plan

## verification log

append new checks here as slices land.

| date | slice | checks | result | notes |
| --- | --- | --- | --- | --- |
| 2026-05-23 | phase 0 cleanup boundary classification | compatibility map review after app/protocol/subgraph pass | pass | phase 1 should start with characterization tests, not code motion |
| 2026-05-23 | phase 0 subgraph schema/query surface | read `../subgraph/schema.graphql`, `src/hooks-factory.ts`, `src/hooks-instance.ts`, `src/wildcat-market.ts`, sdk gql fragments/queries/parsers | pass | market, hooks, lender access, withdrawals, and market records are all cross-surface compatibility points |
| 2026-05-23 | phase 0 protocol lens/view surface | read `../v2-protocol/src/lens/*`, `HooksFactory`, periodic hooks; traced sdk typechain/parser consumers | pass | v2 lens/typechain and hooks factory/event shapes are compatibility-critical |
| 2026-05-23 | phase 0 app import surface | typescript ast scan of `../wildcat-app-v2/src`; `ls -l node_modules/@wildcatfi/wildcat-sdk` | pass | 212 app files, 237 sdk import decls, 23 files with deep `dist/*` imports; app currently symlinks sdk checkout |
| 2026-05-23 | planning scaffold | n/a | docs only | no structural edits started |

## decisions

append decisions here when we commit to a cleanup direction.

| date | decision | reason | consequences |
| --- | --- | --- | --- |
| 2026-05-23 | map dependencies before edits | app/protocol/subgraph/sdk compatibility is the main risk | cleanup starts with phase 0, not code motion |
