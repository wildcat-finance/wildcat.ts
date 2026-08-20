import { encodeAbiParameters, type Address, type Hex } from "viem";
import {
  accessListRoleProviderAbi,
  accessListRoleProviderFactoryAbi,
  iOpenTermHooksAbi
} from "../abi";
import { PartialTransaction } from "../types";
import { prepareTransaction } from "../utils";

export type AccessListRoleProviderDeploymentInputs = {
  administrator: string;
  initialMembers: string[];
  salt: string;
};

export const encodeAccessListRoleProviderDeploymentInputs = ({
  administrator,
  initialMembers,
  salt
}: AccessListRoleProviderDeploymentInputs): string =>
  encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          { name: "administrator", type: "address" },
          { name: "initialMembers", type: "address[]" },
          { name: "salt", type: "bytes32" }
        ]
      }
    ],
    [
      {
        administrator: administrator as Address,
        initialMembers: initialMembers as Address[],
        salt: salt as Hex
      }
    ]
  );

export const prepareRequestHookAdministratorTransfer = (
  hooks: string,
  newAdministrator: string
): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "requestAdministratorTransfer",
    args: [newAdministrator]
  });

export const prepareCancelHookAdministratorTransfer = (hooks: string): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "cancelAdministratorTransfer"
  });

export const prepareAcceptHookAdministratorTransfer = (hooks: string): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "acceptAdministratorTransfer"
  });

export const prepareSetHookName = (hooks: string, name: string): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "setName",
    args: [name]
  });

export const prepareAddHookRoleProvider = (
  hooks: string,
  provider: string,
  timeToLive: number
): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "addRoleProvider",
    args: [provider, timeToLive]
  });

export const prepareRemoveHookRoleProvider = (
  hooks: string,
  provider: string
): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "removeRoleProvider",
    args: [provider]
  });

export const prepareCreateAndAddAccessListRoleProvider = (
  hooks: string,
  providerFactory: string,
  timeToLive: number,
  inputs: AccessListRoleProviderDeploymentInputs
): PartialTransaction =>
  prepareTransaction({
    to: hooks,
    abi: iOpenTermHooksAbi,
    functionName: "createRoleProvider",
    args: [providerFactory, timeToLive, encodeAccessListRoleProviderDeploymentInputs(inputs)]
  });

export const prepareCreateAccessListRoleProvider = (
  providerFactory: string,
  inputs: AccessListRoleProviderDeploymentInputs
): PartialTransaction =>
  prepareTransaction({
    to: providerFactory,
    abi: accessListRoleProviderFactoryAbi,
    functionName: "createAccessListRoleProvider",
    args: [inputs]
  });

export const prepareAddAccessListMembers = (
  provider: string,
  members: string[]
): PartialTransaction =>
  prepareTransaction({
    to: provider,
    abi: accessListRoleProviderAbi,
    functionName: members.length === 1 ? "addMember" : "addMembers",
    args: members.length === 1 ? [members[0]] : [members]
  });

export const prepareRemoveAccessListMembers = (
  provider: string,
  members: string[]
): PartialTransaction =>
  prepareTransaction({
    to: provider,
    abi: accessListRoleProviderAbi,
    functionName: members.length === 1 ? "removeMember" : "removeMembers",
    args: members.length === 1 ? [members[0]] : [members]
  });

export const prepareRequestRoleProviderAdministratorTransfer = (
  provider: string,
  newAdministrator: string
): PartialTransaction =>
  prepareTransaction({
    to: provider,
    abi: accessListRoleProviderAbi,
    functionName: "requestAdministratorTransfer",
    args: [newAdministrator]
  });

export const prepareCancelRoleProviderAdministratorTransfer = (
  provider: string
): PartialTransaction =>
  prepareTransaction({
    to: provider,
    abi: accessListRoleProviderAbi,
    functionName: "cancelAdministratorTransfer"
  });

export const prepareAcceptRoleProviderAdministratorTransfer = (
  provider: string
): PartialTransaction =>
  prepareTransaction({
    to: provider,
    abi: accessListRoleProviderAbi,
    functionName: "acceptAdministratorTransfer"
  });
