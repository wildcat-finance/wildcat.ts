import { defaultAbiCoder } from "ethers/lib/utils";
import { MarketHooksInstanceInputs, RoleProvider } from "../types";
import { assert } from "../utils";
import { constants } from "ethers";

const NameAndProviderInputsSignature = `tuple(string name, address roleProviderFactory, tuple(uint32 timeToLive, bytes providerFactoryCalldata)[] newProviderInputs, tuple(address providerAddress, uint32 timeToLive)[] existingProviders)`;
const NullProviderIndex = 2 ** 24 - 1;

type LensRoleProvider = Pick<
  RoleProvider,
  "providerAddress" | "timeToLive" | "pullProviderIndex" | "pushProviderIndex"
>;

export function roleProvidersFromLens(
  pullProviders: LensRoleProvider[],
  pushProviders: LensRoleProvider[]
): RoleProvider[] {
  const providersByAddress = new Map<string, RoleProvider>();
  [...pullProviders, ...pushProviders].forEach((provider) => {
    const key = provider.providerAddress.toLowerCase();
    const existing = providersByAddress.get(key);
    const isPullProvider = provider.pullProviderIndex !== NullProviderIndex;
    const isPushProvider = provider.pushProviderIndex !== NullProviderIndex;
    providersByAddress.set(key, {
      providerAddress: provider.providerAddress,
      timeToLive: provider.timeToLive,
      isApproved: true,
      isPullProvider: existing?.isPullProvider || isPullProvider,
      pullProviderIndex: isPullProvider
        ? provider.pullProviderIndex
        : existing?.pullProviderIndex ?? NullProviderIndex,
      isPushProvider: existing?.isPushProvider || isPushProvider,
      pushProviderIndex: isPushProvider
        ? provider.pushProviderIndex
        : existing?.pushProviderIndex ?? NullProviderIndex
    });
  });
  return [...providersByAddress.values()];
}

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
