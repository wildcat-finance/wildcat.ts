# compatibility surface map

this file is the working map for cleanup compatibility. fill this before structural edits.

## app imports from `@wildcatfi/wildcat-sdk`

source: typescript ast scan of `../wildcat-app-v2/src` on 2026-05-23. app dependency is declared as `@wildcatfi/wildcat-sdk@^3.0.65-beta`, but the current checkout resolves it through `node_modules/@wildcatfi/wildcat-sdk -> ../../../wildcat.ts`.

summary:

- 212 app source files import from the sdk.
- 237 sdk import declarations were found.
- 210 files import from the package root `@wildcatfi/wildcat-sdk`.
- 23 files import from deep `dist/*` paths.
- only 3 declarations are written as `import type`; many interface-only imports are still syntactically runtime imports, so compatibility must preserve both type names and resolvable js paths until the app is cleaned up.

highest-volume root symbols:

| symbol | app files | sdk owner guess | cleanup risk |
| --- | ---: | --- | --- |
| `Market` | 57 | `src/market.ts` | high: central app read model and page/component prop type |
| `MarketAccount` | 54 | `src/account/index.ts` | high: lender/borrower account actions and balances |
| `TokenAmount` | 48 | `src/token.ts` | high: formatting, comparisons, charts, action inputs |
| `SupportedChainId` | 35 | `src/constants.ts` / `src/types.ts` | medium: app config and api route validation |
| `MarketVersion` | 18 | `src/types.ts` / `src/market.ts` | medium: market display and branch logic |
| `HooksKind` | 17 | `src/access` | high for periodic-term cleanup |
| `MarketRecord` | 15 | `src/gql/getMarketRecords.ts` / `src/utils/record-types.ts` | high: transaction history display |
| `Token` | 14 | `src/token.ts` | medium: create-market and asset selection |
| `getLensV2Contract` | 13 | `src/constants.ts` / typechain factories | high: protocol lens address/abi dependency |
| `isSupportedChainId` | 12 | `src/constants.ts` / `src/types.ts` | medium: api and network gate |
| `SignerOrProvider` | 12 | `src/types.ts` | medium: hook signatures across app |
| `getMarketRecords` | 11 | `src/gql/getMarketRecords.ts` | high: subgraph event matrix dependency |
| `getSubgraphClient` | 10 | `src/gql/index.ts` | high: app directly executes sdk gql documents |

deep import surface:

| import path | files | imported symbols | owner | cleanup risk |
| --- | ---: | --- | --- | --- |
| `@wildcatfi/wildcat-sdk/dist/access` | 7 | `DeployMarketStatus`, `FixedTermHooks`, `FixedTermHooksTemplate`, `FixedTermMarketDeploymentArgs`, `HooksInstance`, `HooksTemplate`, `OpenTermHooks`, `OpenTermHooksTemplate`, `OpenTermMarketDeploymentArgs`, `PeriodicTermHooks`, `PeriodicTermHooksTemplate`, `PeriodicTermMarketDeploymentArgs`, `hooksInstanceFromLens`, `hooksTemplateFromLens` | `src/access/*` | very high: app reaches into hooks internals for create-market, policy editing, and lens parsing |
| `@wildcatfi/wildcat-sdk/dist/gql/graphql` | 9 | generated gql documents/fragments and query variable/result types, including `GetMarketDocument`, `GetAllAuthorizedLendersDocument`, withdrawal docs, lender docs, and `SubgraphGetMarketQueryVariables` | `src/gql/graphql.ts` generated | very high: generated document names and operation shapes are public in practice |
| `@wildcatfi/wildcat-sdk/dist/gql/utils` | 2 | `PolicyLender` | `src/gql/utils.ts` | medium: internal gql helper type is app-visible |
| `@wildcatfi/wildcat-sdk/dist/typechain` | 4 | `CheckBorrowersRegistered__factory`, `CheckSafeSignature__factory`, `ISafe`, `ISafe__factory`, `WildcatMarket__factory`, `WildcatMarketV2__factory` | `src/typechain` generated | high: app server/api code depends on generated factory paths |
| `@wildcatfi/wildcat-sdk/dist/typechain/HooksFactory` | 1 | `MarketDeployedEvent` | `src/typechain/HooksFactory.ts` generated | high: single import, but tied directly to market deployment event parsing |
| `@wildcatfi/wildcat-sdk/dist/utils/logger` | 4 | `logger` | `src/utils/logger.ts` | low/medium: easy alias, but currently a deep runtime import |

compatibility notes:

- the package root is not just a public api; it is the app's domain model namespace.
- `src/access` is already public because the root barrel exports it and the app also deep-imports it.
- generated `dist/gql/graphql` and `dist/typechain` are public in practice even though package `exports` does not formalize them.
- moving symbols between sdk files is fine only if `dist` import paths, declaration names, and root barrel exports survive the slice.

## protocol lens/view shapes consumed by sdk

| protocol file | contract/function/struct | sdk consumer | fields used | cleanup risk |
| --- | --- | --- | --- | --- |
| `../v2-protocol/src/lens/MarketLens.sol` | `getMarketData(address) -> MarketData` | `Market.getMarketV2`, `Market.fromMarketDataV2` in `src/market.ts` | market/underlying token metadata, `hooksFactory`, `borrower`, `hooksConfig`, `withdrawalBatchDuration`, fees, delinquency config, `hooks`, temporary reserve ratio fields, market state fields, unpaid expiries, `coverageLiquidity` | very high: this is the v2 market read model |
| `../v2-protocol/src/lens/MarketData.sol` | `MarketData` / sdk `MarketDataV2StructOutput` | `Market.fromMarketDataV2` | `hooksConfig.kind` numeric enum `1/2/3`, `hooks.hooksAddress`, all token amount fields converted through `TokenAmount` | very high: field names and enum values are parsed directly |
| `../v2-protocol/src/lens/HooksConfigData.sol` | `MarketHooksData` | `Market.fromMarketDataV2`; hooks config types in `src/types.ts` | shared access flags, fixed-term fields, periodic-term fields: `firstWithdrawalWindowStart`, `periodDuration`, `withdrawalWindowDuration`, `periodicTermClosed` | very high: periodic-term cleanup depends on this exact shape |
| `../v2-protocol/src/lens/HooksInstanceData.sol` | `HooksInstanceData` | `OpenTermHooks.fromHooksInstanceData`, `FixedTermHooks.fromHooksInstanceData`, `PeriodicTermHooks.fromHooksInstanceData` | `hooksAddress`, `borrower`, `name`, `kind`, template, constraints, deployment flags, role providers, total markets | high: hooks class consolidation must keep parser behavior stable |
| `../v2-protocol/src/lens/HooksTemplateData.sol` | `HooksTemplateData` / `FeeConfiguration` | hooks template constructors in `src/access/*` | template address, enabled/exists/index/name/total markets, fee recipient/protocol fee/origination fee token/balance/approval | high: create-market form and deployment preview use this |
| `../v2-protocol/src/lens/LenderAccountData.sol` | `LenderAccountData` | `MarketAccount.fromLenderAccountData` | balances, approval, hook credential: blocked, last provider, refresh, approval timestamp, known lender | high: lender actions and deposit eligibility |
| `../v2-protocol/src/lens/WithdrawalBatchData.sol` | `getWithdrawalBatchData`, `getWithdrawalBatchDataWithLenderStatus`; `WithdrawalBatchData`, `WithdrawalBatchLenderStatus` | `WithdrawalBatch.getWithdrawalBatch`, `LenderWithdrawalStatus.getWithdrawalForLender` | batch status enum, scaled/normalized totals, lender owed/withdrawn/available amounts | high: withdrawal modal and account status |
| `../v2-protocol/src/lens/TokenData.sol` | `getTokenInfo`, `getTokensInfo`; `TokenMetadata` | `Token.getTokenData`, `Token.getTokensData` | token address/name/symbol/decimals/isMock | medium: asset selection and display |
| `../v2-protocol/src/HooksFactory.sol` / `src/IHooksFactory.sol` | `deployMarket`, `deployMarketAndHooks`, `computeMarketAddress`, `MarketDeployed` | `src/access/*` deploy helpers; app deep import `dist/typechain/HooksFactory` for `MarketDeployedEvent` | deployment args, event fields, hooks template/instance registry lookups | very high: create-market flow and app event parsing |
| `../v2-protocol/src/access/PeriodicTermHooks.sol` | `getHookedMarket`, `isWithdrawalWindowOpen`, `proposeAnnualInterestBips` | `src/account/index.ts`, `src/access/periodic-term.ts`; app periodic-term action surfaces | periodic market schedule, closure status, apr proposal flow | high: periodic-term behavior cannot be inferred from app-only tests |

notes:

- sdk names this generated typechain surface `MarketLensV2`, while the protocol contract source is still `MarketLens`; treat deployed address + abi shape as the compatibility key.
- v2 lens values are parsed mostly by field name, but `hooksConfig.kind` is parsed as numeric `1 = open`, `2 = fixed`, `3 = periodic`; changing that enum is a hard break.
- `MarketData.fill` currently reverts on non-v2 markets, so sdk fallback logic still matters where `MarketLens` v1 is available.

## subgraph entities/fragments/queries consumed by sdk

| subgraph file | entity/event/schema field | sdk gql fragment/query | sdk parser/model | cleanup risk |
| --- | --- | --- | --- | --- |
| `../subgraph/schema.graphql` | `Market` | `MarketData`, `MarketDataWithEvents`; `getMarket`, `getMarketsWithEvents`, `getAllMarkets` | `Market.fromSubgraphMarketData` | very high: app uses `Market` as its dominant sdk domain model |
| `../subgraph/schema.graphql` | `HooksConfig` | `HooksConfigDataForMarket` | `Market.fromSubgraphMarketData`, `Market.updateWith` | very high: periodic-term state lives here for app read paths |
| `../subgraph/schema.graphql` | `HooksInstance`, `HooksTemplate`, `RoleProvider` | `HooksInstanceData`, `HooksTemplateData`, `RoleProviderData`; `getAllHooksTemplates`, `getHooksInstancesForBorrower`, `getAllHooksDataForBorrower` | `hooksInstanceFromSubgraph`, `hooksTemplateFromSubgraph`, `getAllHooksDataForBorrower` | high: create-market and policy-edit flows depend on names/kinds/providers |
| `../subgraph/schema.graphql` | `LenderHooksAccess`, `KnownLenderStatus`, `LenderAccount` | `LenderHooksAccessData`, `AccountDataForLenderView`, `BasicLenderData` | `MarketAccount.fromSubgraphAccountData`, `parseSubgraphLenderHooksAccess` | high: deposit eligibility and lender list behavior |
| `../subgraph/schema.graphql` | withdrawal entities: `WithdrawalBatch`, `LenderWithdrawalStatus`, `WithdrawalRequest`, `WithdrawalExecution`, `WithdrawalBatchPayment` | withdrawal fragments and queries: `getLenderWithdrawalsForMarket`, `getIncompleteWithdrawalsForMarket`, `getAllPendingWithdrawalBatchesForMarket` | `WithdrawalBatch`, `LenderWithdrawalStatus`, `parseWithdrawalRecord` | high: lender withdrawal modal and market-account status |
| `../subgraph/schema.graphql` | market record event entities: `AnnualInterestBipsUpdated`, `Borrow`, `DebtRepaid`, `DelinquencyStatusChanged`, `Deposit`, `FeesCollected`, `ForceBuyBack`, `MarketClosed`, `MaxTotalSupplyUpdated`, `MinimumDepositUpdated`, `ProtocolFeeBipsUpdated`, `WithdrawalRequest`, `FixedTermUpdated`, `PeriodicTermClosed`, `AnnualInterestBipsReductionProposed` | `MarketRecords`, `getMarketEvents`, `getMarketRecords` | `src/gql/getMarketRecords.ts`, `parseMarketRecord`, `MarketRecord` union | very high: brittle event matrix; each new event requires schema + fragment + query + parser + union updates |
| `../subgraph/src/hooks-factory.ts` | `HooksFactory`, `HooksTemplate`, `HooksInstance`, `MarketDeployed` indexing | `HooksTemplateData`, `HooksInstanceData`, `MarketData.deployedEvent` | hooks constructors, market metadata | high: factory event/index shape backs deployment and hooks inventory |
| `../subgraph/src/hooks-instance.ts` | periodic handlers update `HooksConfig` and emit records | `HooksConfigDataForMarket`, `PeriodicTermClosedData`, `AnnualInterestBipsReductionProposedData` | periodic-term market config and records | high: app periodic-term ui expects pending apr proposal/window fields |
| `../subgraph/src/wildcat-market.ts` | `AnnualInterestBipsUpdated` clears pending periodic apr proposal fields on periodic markets | `MarketData`, `getMarketEvents` | `Market.fromSubgraphMarketData`, `getMarketRecords` | high: protocol event semantics leak into sdk/app state |

subgraph compatibility notes:

- the app directly imports generated gql documents/types from `dist/gql/graphql`, so operation and fragment names are compatibility-sensitive, not just sdk internals.
- `getMarketRecords` is the worst glue point: adding/removing a record means touching subgraph schema, mapping handler, sdk fragment/query variables, generated types, `record-types.ts`, `type-parsers.ts`, app display logic, and tests.
- periodic-term currently spans both live config (`HooksConfigDataForMarket`) and historical records (`PeriodicTermClosed`, `AnnualInterestBipsReductionProposed`); cleanup slices need tests for both.
- there is a schema comment saying hooks template binding is brittle. believe it. that is a cleanup target, but not a first edit.

## sdk public exports

| sdk export | source file | app usage | public/stable/internal guess | cleanup risk |
| --- | --- | --- | --- | --- |
| root barrel `export * from "./account"` | `src/account/index.ts` | `MarketAccount`, statuses, account helpers | stable | high |
| root barrel `export * from "./access"` | `src/access/index.ts` | `HooksKind`, hooks configs, hooks classes/templates | stable by usage | high |
| root barrel `export * from "./market"` | `src/market.ts` | `Market`, market params, market version fields | stable | high |
| root barrel `export * from "./token"` | `src/token.ts` | `Token`, `TokenAmount`, wrappers, math helpers | stable | high |
| root barrel `export * from "./gql"` | `src/gql/index.ts` | subgraph clients and query helpers | stable by usage | high |
| namespace export `typechain` | `src/typechain` | less used than deep imports | stable-ish | medium |
| direct `dist/typechain/*` paths | generated `src/typechain` | factories/events in app api and deployment flow | accidental but live | high |
| direct `dist/gql/graphql` path | generated `src/gql/graphql.ts` | gql documents and generated operation types | accidental but live | high |

## suspected accidental public surfaces

| surface | why suspicious | consumers found | action |
| --- | --- | --- | --- |
| `dist/gql/graphql` | generated file path; not a curated sdk api | 9 app files | preserve during cleanup; later add explicit sdk facade or app-owned gql layer |
| `dist/typechain` and `dist/typechain/HooksFactory` | generated file paths; package only declares `main`/`types` | 5 app files | preserve during cleanup; later decide whether typechain is a supported sdk subpath |
| `dist/access` | deep import into hooks internals despite root export | 7 app files | do not move/remove hooks classes or template names without aliases |
| `dist/utils/logger` | internal util imported by app hooks | 4 app files | either preserve alias or move app to app-local logger in separate slice |
| `PolicyLender` from `dist/gql/utils` | helper type leaks gql parsing internals | 2 app files | keep alias; candidate for public type re-export or app-local type |

## blockers for edits

| blocker | affected slices | owner surface | resolution needed |
| --- | --- | --- | --- |
| app uses sdk generated gql documents directly | `getMarketRecords`, market/lender/withdrawal query cleanup | sdk + app | preserve operation names/types until app query ownership is decided |
| app uses sdk typechain factories directly | contract wrapper cleanup, codegen cleanup | sdk + app + protocol | keep generated paths stable or add compatibility re-exports |
| app uses hooks internals directly | hooks class consolidation, hooks registry | sdk access layer + app create/edit-policy flows | add characterization tests before moving hooks class/template names |
| syntactic runtime imports for types | any export/path cleanup | app build pipeline | treat import paths as runtime-resolvable unless app is first migrated to `import type` |

## initial cleanup boundaries

compatibility-sensitive zones:

- `src/index.ts` root exports.
- `src/access/index.ts` and exported hooks classes/templates/config names.
- `src/market.ts` public `Market` constructor args, fields, static builders, and static query helpers.
- `src/account/index.ts` public `MarketAccount` constructor args, fields, static builders, and transaction preview/status helpers.
- `src/gql/graphql.ts` generated operation/fragment/type names.
- `src/typechain/*` generated paths and factory/event names.
- `gql/fragments.graphql` and `gql/queries.graphql` operation/fragment names used by app deep imports.
- protocol `MarketLens`/sdk `MarketLensV2` abi field order/names.
- subgraph schema entities backing `MarketData`, `HooksConfigDataForMarket`, `HooksInstanceData`, `LenderHooksAccessData`, withdrawal fragments, and market records.

safe-ish zones after tests:

- private pure parser helpers in `src/utils/type-parsers.ts`, as long as `parseMarketRecord`, `parseWithdrawalRecord`, and exported types stay stable.
- shared access-layer helper extraction inside `src/access/*`, as long as exported class names and constructor/static method behavior stay stable.
- helper modules newly added under `src/access` or `src/gql` if they are not exported and callers keep their public paths.
- codegen/script cleanup, provided generated output and public `dist` paths stay stable.
- docs and tracker files.

first characterization targets:

- `Market.fromSubgraphMarketData` for v2 open/fixed/periodic hooks config.
- `Market.fromMarketDataV2` for protocol lens output, especially numeric hooks kind parsing.
- `hooksTemplateFromSubgraph`, `hooksInstanceFromSubgraph`, `hooksTemplateFromLens`, `hooksInstanceFromLens`.
- `MarketAccount.fromSubgraphAccountData` and `MarketAccount.fromLenderAccountData`.
- `getMarketRecords` + `parseMarketRecord` for all current market record kinds, including periodic-term records.
