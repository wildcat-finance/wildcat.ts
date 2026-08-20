import type { Abi, Address, Hex } from "viem";
import {
  accessListRoleProviderAbi,
  accessListRoleProviderFactoryAbi,
  iOpenTermHooksAbi
} from "../abi";
import { getViemPublicClientFromEthers } from "../internal/ethers-viem";
import { readViemContract } from "../internal/viem-read";
import { SignerOrProvider } from "../types";
import { AccessListRoleProviderDeploymentInputs } from "./actions";

export type LiveAdministratorState = {
  administrator: string;
  pendingAdministrator?: string;
};

const getAdministratorState = async (
  provider: SignerOrProvider,
  contract: string,
  abi: Abi
): Promise<LiveAdministratorState> => {
  const publicClient = getViemPublicClientFromEthers(provider);
  const [administrator, pendingAdministrator] = await Promise.all([
    readViemContract<string>(publicClient, contract, abi, "administrator"),
    readViemContract<string>(publicClient, contract, abi, "pendingAdministrator")
  ]);
  return {
    administrator,
    ...(BigInt(pendingAdministrator) !== 0n ? { pendingAdministrator } : {})
  };
};

export const getLiveHookAdministrator = (
  provider: SignerOrProvider,
  hooks: string
): Promise<LiveAdministratorState> =>
  getAdministratorState(provider, hooks, iOpenTermHooksAbi as Abi);

export const getLiveRoleProviderAdministrator = (
  provider: SignerOrProvider,
  roleProvider: string
): Promise<LiveAdministratorState> =>
  getAdministratorState(provider, roleProvider, accessListRoleProviderAbi as Abi);

export const isAccessListRoleProviderMember = (
  provider: SignerOrProvider,
  roleProvider: string,
  account: string
): Promise<boolean> =>
  readViemContract<boolean>(
    getViemPublicClientFromEthers(provider),
    roleProvider,
    accessListRoleProviderAbi as Abi,
    "isMember",
    [account as Address]
  );

export const getAccessListRoleProviderMembers = (
  provider: SignerOrProvider,
  roleProvider: string,
  start?: number,
  end?: number
): Promise<string[]> => {
  if ((start === undefined) !== (end === undefined)) {
    throw new Error("Both start and end are required for paginated member reads");
  }
  return readViemContract<string[]>(
    getViemPublicClientFromEthers(provider),
    roleProvider,
    accessListRoleProviderAbi as Abi,
    "getMembers",
    start === undefined ? [] : [start, end]
  );
};

export const getExpectedAccessListRoleProviderAddress = (
  provider: SignerOrProvider,
  providerFactory: string,
  deployer: string,
  inputs: AccessListRoleProviderDeploymentInputs
): Promise<string> =>
  readViemContract<string>(
    getViemPublicClientFromEthers(provider),
    providerFactory,
    accessListRoleProviderFactoryAbi as Abi,
    "computeRoleProviderAddress",
    [
      deployer as Address,
      {
        administrator: inputs.administrator as Address,
        initialMembers: inputs.initialMembers as Address[],
        salt: inputs.salt as Hex
      }
    ]
  );
