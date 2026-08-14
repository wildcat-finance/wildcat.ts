import {
  decodeEventLog,
  encodeAbiParameters,
  toEventSelector,
  zeroAddress,
  type AbiEvent,
  type Address,
  type Hex
} from "viem";
import {
  AnyHooksInstanceDataStructOutput,
  RoleProviderDataStructOutput,
  RoleProviderDataV2_5StructOutput
} from "../lens-types";
import { MarketHooksInstanceInputs, RoleProvider } from "../types";
import { assert, toNumber } from "../utils";

const NullProviderIndex = 2 ** 24 - 1;

export const getHooksAdministrator = (data: AnyHooksInstanceDataStructOutput): string =>
  "administrator" in data ? data.administrator : data.borrower;

export const getHooksPendingAdministrator = (
  data: AnyHooksInstanceDataStructOutput
): string | undefined =>
  "pendingAdministrator" in data && data.pendingAdministrator.toLowerCase() !== zeroAddress
    ? data.pendingAdministrator
    : undefined;

export const roleProviderFromLensData = (
  provider: RoleProviderDataStructOutput | RoleProviderDataV2_5StructOutput
): RoleProvider => {
  const pullProviderIndex = toNumber(provider.pullProviderIndex);
  const pushProviderIndex = toNumber(provider.pushProviderIndex);
  if ("isManaged" in provider && provider.isManaged) {
    return {
      kind: "unknown",
      providerAddress: provider.providerAddress,
      timeToLive: toNumber(provider.timeToLive),
      isPullProvider: pullProviderIndex !== NullProviderIndex,
      pullProviderIndex,
      isPushProvider: pushProviderIndex !== NullProviderIndex,
      pushProviderIndex,
      isApproved: true,
      isManaged: true,
      administrator: provider.administrator,
      ...(provider.pendingAdministrator.toLowerCase() !== zeroAddress
        ? { pendingAdministrator: provider.pendingAdministrator }
        : {})
    };
  }
  return {
    kind: "unknown",
    providerAddress: provider.providerAddress,
    timeToLive: toNumber(provider.timeToLive),
    isPullProvider: pullProviderIndex !== NullProviderIndex,
    pullProviderIndex,
    isPushProvider: pushProviderIndex !== NullProviderIndex,
    pushProviderIndex,
    isApproved: true,
    ...("isManaged" in provider ? { isManaged: false } : {})
  };
};

const marketDeployedEventAbi = {
  anonymous: false,
  inputs: [
    { indexed: true, internalType: "address", name: "hooksTemplate", type: "address" },
    { indexed: true, internalType: "address", name: "hooksInstance", type: "address" },
    { indexed: true, internalType: "address", name: "market", type: "address" },
    { indexed: false, internalType: "address", name: "borrower", type: "address" },
    {
      indexed: false,
      internalType: "address",
      name: "borrowerPrincipal",
      type: "address"
    },
    {
      indexed: false,
      internalType: "address",
      name: "borrowerIdentityRegistry",
      type: "address"
    },
    { indexed: false, internalType: "string", name: "name", type: "string" },
    { indexed: false, internalType: "string", name: "symbol", type: "string" },
    { indexed: false, internalType: "address", name: "asset", type: "address" },
    { indexed: false, internalType: "HooksConfig", name: "requestedHooks", type: "uint256" },
    { indexed: false, internalType: "uint256", name: "hooks", type: "uint256" }
  ],
  name: "MarketDeployed",
  type: "event"
} as const satisfies AbiEvent;

const hooksFactoryEventAbiByName = {
  MarketDeployed: marketDeployedEventAbi
} as const;

type HooksFactoryEventName = keyof typeof hooksFactoryEventAbiByName;

function getHooksFactoryEventAbi(eventName: string): AbiEvent {
  if (eventName in hooksFactoryEventAbiByName) {
    return hooksFactoryEventAbiByName[eventName as HooksFactoryEventName];
  }
  throw new Error(`Unsupported hooks factory event: ${eventName}`);
}

export type HooksFactoryEventResult = Record<string, unknown>;

export type HooksFactoryContractFacade = {
  address: string;
  interface: {
    getEventTopic: (eventName: string) => string;
    decodeEventLog: (
      eventName: string,
      data: string,
      topics?: readonly string[]
    ) => HooksFactoryEventResult;
  };
};

export function createHooksFactoryContractFacade(address: string): HooksFactoryContractFacade {
  return {
    address,
    interface: {
      getEventTopic: (eventName) => toEventSelector(getHooksFactoryEventAbi(eventName)),
      decodeEventLog: (eventName, data, topics) => {
        const eventTopics = topics as [Hex, ...Hex[]] | undefined;
        const decoded = decodeEventLog({
          abi: [getHooksFactoryEventAbi(eventName)],
          data: data as Hex,
          topics: eventTopics ?? []
        });
        return decoded.args as HooksFactoryEventResult;
      }
    }
  };
}

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
