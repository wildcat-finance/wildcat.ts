import { encodeAbiParameters, zeroAddress, type Address, type Hex } from "viem";
import { MarketHooksInstanceInputs } from "../types";
import { assert } from "../utils";

export function encodeMarketHooksInstanceInputs(args: MarketHooksInstanceInputs): Hex {
  assert(
    args.hooksAddress === undefined,
    `Can not encode hooks instance constructor parameters when hooks address already provided`
  );
  const {
    newProviderInputs = [],
    existingProviders = [],
    roleProviderFactory,
    hooksInstanceName = ""
  } = args;
  if (newProviderInputs.length) {
    assert(roleProviderFactory !== undefined, `Can not create new providers without a factory`);
  }
  const encodedNewProviderInputs = newProviderInputs.map(({ data, timeToLive }) => ({
    timeToLive,
    providerFactoryCalldata: data as Hex
  }));
  const encodedExistingProviders = existingProviders.map(({ providerAddress, timeToLive }) => ({
    providerAddress: providerAddress as Address,
    timeToLive
  }));
  return encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "roleProviderFactory", type: "address" },
          {
            name: "newProviderInputs",
            type: "tuple[]",
            components: [
              { name: "timeToLive", type: "uint32" },
              { name: "providerFactoryCalldata", type: "bytes" }
            ]
          },
          {
            name: "existingProviders",
            type: "tuple[]",
            components: [
              { name: "providerAddress", type: "address" },
              { name: "timeToLive", type: "uint32" }
            ]
          }
        ]
      }
    ],
    [
      {
        name: hooksInstanceName,
        roleProviderFactory: (roleProviderFactory || zeroAddress) as Address,
        newProviderInputs: encodedNewProviderInputs,
        existingProviders: encodedExistingProviders
      }
    ]
  );
}
