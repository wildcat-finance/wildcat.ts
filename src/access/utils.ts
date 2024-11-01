import { defaultAbiCoder } from "ethers/lib/utils";
import { MarketHooksInstanceInputs } from "../types";
import { assert } from "../utils";
import { constants } from "ethers";

const NameAndProviderInputsSignature = `tuple(string name, address roleProviderFactory, tuple(uint32 timeToLive, bytes providerFactoryCalldata)[] newProviderInputs, tuple(address providerAddress, uint32 timeToLive)[] existingProviders)`;

export function encodeMarketHooksInstanceInputs(args: MarketHooksInstanceInputs): string {
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
  return defaultAbiCoder.encode(
    [NameAndProviderInputsSignature],
    [
      {
        name: hooksInstanceName,
        roleProviderFactory: roleProviderFactory || constants.AddressZero,
        newProviderInputs,
        existingProviders
      }
    ]
  );
}
