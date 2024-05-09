# MarketController

## Deploying markets

### 1. Get controller info for borrower

```ts
import { getController, MarketController, MarketParameters } from "@wildcatfi/wildcat-sdk";

const controller: MarketController = await getController(signer, borrower);
```

### 2. Get parameter constraints for new markets

`controller.constraints: MarketParameterConstraints` contains the min/max values of

- `annualInterestBips`
- `delinquencyFeeBips`
- `withdrawalBatchDuration`
- `reserveRatioBips`
- `delinquencyGracePeriod`

If provided values are out of this range, market deployment will revert.

### 3. Deploying a mock token for new market

```ts
import { deployToken } from "@wildcatfi/wildcat-sdk";

await deployToken(signer, "name", "symbol");
```

### 4. Deploying new market

```ts
const marketParameters: MarketParameters = {...}

// 1. Ensure borrower is registered on the arch-controller.
// For the testnet deployment, anyone can register a borrower
if (!controller.isRegisteredBorrower) {
  await controller.registerBorrower()
}
// 2. Ensure the `asset, namePrefix, symbolPrefix` are unique.
if (controller.getExistingMarketForParameters(marketParameters)) {
  throw Error()
}
// 3. Deploy market
const market: Market = await controller.deployMarket(marketParameters);

```

# Market

## Get market instances

### 1. Get all `Market` instances on Wildcat

```ts
import { getAllMarkets } from "@wildcatfi/wildcat-sdk";

const markets = getAllMarkets(provider);
```

### 2. Get all `Market` instances for borrower

```ts
const controller: MarketController = await getController(signer, borrower);
// controller.markets has an array of all Market instances for the controller
```

# MarketAccount

## Get `MarketAccount`

### 1. Get `MarketAccount` for every market

```ts
import { getAllMarketAccountsForLender } from "@wildcatfi/wildcat-sdk";
const accounts = await getAllMarketAccountsForLender(signer, lenderAddress);
```

## Deposit

### 1. Get underlying assets from mock token

```ts
if (market.underlyingToken.isMock) {
  await market.underlyingToken.faucet();
}
```

# Development

Whenever anything in `./gql` or `./contracts` is changed, run `yarn codegen` to regenerate the graphql and typechain types.

The graphql scripts take a while to run, so the graphql script saves a file in [.gql-cache](./scripts/.gql-cache) with the checksums of the previous input/output files from gql codegen, so the script can skip graphql codegen if there's no reason to. Typechain only takes about a second so we don't do the same for it.

This runs:

- `yarn codegen:gql` - Generates TS types for all the graphql queries, then runs a script to simplify the type literals ([gql-type-cleanup.js](./scripts/gql-type-cleanup.js))
- `yarn codegen:typechain` - Generates types for the contracts with typechain, then runs a script ([add-typechain-exports.js](./scripts/add-typechain-exports.js)) to add exports for all the structs in the contracts to the src/typechain index file
