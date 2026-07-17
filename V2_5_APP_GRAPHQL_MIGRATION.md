# V2.5 app GraphQL migration map

Status: Phase 5 SDK inventory

App snapshot: `wildcat-app-v2@45cd680e` (`release/v2.5`)

SDK branch: `feat/sdk-refactor`

## Boundary

The V2.5 app should use the SDK's configured, metadata-validated subgraph client.
The temporary `src/lib/hinterlight.ts` split is no longer part of the target
architecture once the V2.5 endpoint is deployed.

- Indexed identity, history, daily aggregates, and USD analytics come from the
  first-class SDK read models.
- Current balances, market state, action eligibility, and transaction inputs
  come from named lens/RPC hydration paths.
- The app owns chart assembly, date formatting, USD-number conversion for
  display, and React query policy.
- `getSubgraphClient` remains the intentional low-level escape hatch for
  notification or server-only projections that do not justify a stable SDK
  model. Escape-hatch code must own its query and result type; it must not import
  `dist/gql/graphql`.

Every page API below uses an exclusive entity-ID cursor pinned to the first
page's Graph block. App code should use `collectIndexedPages` when it truly
needs the complete history rather than reintroducing `skip` pagination.

## Profile and market analytics

| App source / raw operation                                                                 | SDK replacement                                                                                                             | Migration note                                                                                         |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `hooks/useTokenUsdPrices.ts` / `getTokenUsdPrices`                                         | `getLatestTokenUsdPrices`; `getTokenPriceObservationPage` for history                                                       | Preserve the priced/unpriced union. Do not turn missing or disabled pricing into numeric zero.         |
| `useMarketDailyFlows.ts` / `getMarketDailyStats`                                           | `getMarketDailyStatsPage({ markets })`                                                                                      | UI keeps the daily-flow transform and token decimal formatting.                                        |
| `useMarketDelinquencyHistory.ts` / `getMarketDelinquencyEvents`                            | `getDelinquencyStatusChangePage({ markets })`                                                                               | UI may pair open/close events into display episodes using a current timestamp.                         |
| `useLenderMarketAnalytics.ts` / `getActiveLenders`                                         | `getLenderPositionPage({ markets, activeOnly: true })` plus `collectIndexedPages`                                           | Count the returned indexed positions. This is approximate indexed data, not a transaction input.       |
| `useBorrowerAggregateStats.ts` / `getBorrowerProfileAnalytics`                             | `getBorrowerAnalyticsProfile`; `getIndexedMarketList({ filter: { borrower } })`                                             | Aggregate stats and market discovery remain separate authorities.                                      |
| `useBorrowerDailyStats.ts` and the borrower-daily part of `useBorrowerCapitalCostDrift.ts` | `getBorrowerDailyStatsPage`                                                                                                 | USD decimals remain strings until the UI deliberately converts them for charting.                      |
| Market-daily parts of `useBorrowerAggregateDebt.ts` and `useBorrowerCapitalCostDrift.ts`   | `getMarketDailyStatsPage({ borrower })`                                                                                     | Carries scale factor, scaled supply, asset decimals, historical price, and APR context.                |
| APR update part of `useBorrowerCapitalCostDrift.ts`                                        | `getAnnualInterestBipsUpdatePage({ borrower })`                                                                             | Indexed immutable history.                                                                             |
| `useBorrowerDelinquencyEvents.ts`                                                          | `getDelinquencyStatusChangePage({ borrower })`                                                                              | Indexed immutable history.                                                                             |
| Delinquency, cure, and protocol comparison queries in `useBorrowerCureVelocity.ts`         | `getDelinquencyStatusChangePage`; `getMarketInterestAccrualPage`                                                            | Omit `borrower` for the protocol comparison series. The UI retains cure-velocity calculations.         |
| `useBorrowerBatches.ts` / `getBorrowerWithdrawalBatches`                                   | `getBorrowerWithdrawalReliabilityPage({ borrower })`                                                                        | UI derives paid, paid-late, unpaid, and shortfall presentation from exact batch/expiration amounts.    |
| `useLenderPositions.ts` / `getLenderProfilePositions`                                      | `getLenderAnalyticsProfile`; `getLenderPositionPage`                                                                        | Current position values that affect actions must still be refreshed through lens/RPC.                  |
| `useLenderDailyStats.ts` / `getLenderDailyStats`                                           | `getLenderDailyStatsPage`                                                                                                   | Indexed daily USD aggregates.                                                                          |
| `useLenderActivity.ts` / deposit, request, and execution queries                           | `getLenderDepositPage`; `getLenderWithdrawalRequestPage`; `getLenderWithdrawalExecutionPage`                                | Merge and sort the independent immutable streams in the UI.                                            |
| `useLenderBatches.ts` / `getLenderProfileBatches`                                          | `getLenderWithdrawalStatusPage`                                                                                             | Exact indexed batch/status amounts; live claimability still comes from lens/RPC.                       |
| Historical inputs in `useLenderRiskReturnsChart.ts`                                        | `getMarketDailyStatsPage`; lender deposit/request/execution/transfer pages; `getDelinquencyStatusChangePage`                | Replace `getLenderRiskReturnsMarketLiveState` with explicit `hydrateMarketsLive` or `market.update()`. |
| Historical inputs in `useLenderCapitalAtRiskTimeline.ts`                                   | `getMarketDailyStatsPage`; lender activity/transfer pages; `getDelinquencyStatusChangePage`; `getMarketInterestAccrualPage` | UI keeps the capital-at-risk simulation and chart projection.                                          |

## Existing operational SDK reads

| App direct generated document                        | SDK replacement or disposition                                                                                                                                                                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GetAuthorizedLendersByMarketDocument`               | Use `getAuthorisedLendersByMarket` for addresses or `getPolicyLenders` when policy/access metadata is required.                                                                                                                                |
| `GetAllAuthorizedLendersDocument`                    | Compose `getPolicyMarketsAndLenders` for each borrower policy surface. Do not preserve the generated Graph result as an app type.                                                                                                              |
| `GetIncompleteWithdrawalsForMarketDocument`          | Use `getAllPendingWithdrawalBatchesForMarket`, followed by the existing named live lens update.                                                                                                                                                |
| `GetLenderWithdrawalsForMarketDocument`              | Use `getLenderAccountForMarket` for the indexed account/batch model, followed by the existing named live lens update.                                                                                                                          |
| `GetMarketDocument` in `app/api/market/get/route.ts` | Intentional server-only escape hatch for cross-chain address discovery. Replace its `dist/gql/graphql` import with a route-owned minimal query/result type. A provider-backed `Market` class is the wrong cached JSON contract for this route. |

## Polling notifications and subscriptions

`src/graphql/queries.ts` supplies notification polling rather than profile
analytics. Its market-scoped operations should preferentially move to
`getMarketEventPage` for invalidation or `getMarketRecords` when the notification
needs a typed payload. The following are intentional low-level escape hatches for
the V2.5 app migration because they are cross-market projections or non-market
registry events:

- borrower registration changes;
- controller lender-authorization changes;
- cross-market withdrawal-batch creation, expiration, and execution polling;
- cross-market borrow and repayment polling;
- market-close polling; and
- the borrower-registration websocket subscription in
  `src/utils/subscriptions.ts`.

These queries stay app-owned through `getSubgraphClient`; they should use local
SDK-independent result types. The commented-out queries in
`src/graphql/queries.ts` have no consumer and should be deleted during the app
migration.

## Phase 7 acceptance checks

- No app profile or analytics hook imports `gql` or `dist/gql/graphql`.
- `src/lib/hinterlight.ts` and its separate endpoint table are removed.
- No indexed USD value silently becomes zero because pricing is unavailable.
- No Graph snapshot is used as an action or transaction input without named
  lens/RPC hydration.
- Remaining direct GraphQL callsites match the escape-hatch list above and use
  app-owned result types.
