import { borrowerIdentityRegistryAbi, wildcatMarketV2Abi } from "../abi";
import { PartialTransaction } from "../types";
import { prepareTransaction } from "../utils";

export const prepareRequestMarketBorrowerTransfer = (
  market: string,
  newBorrower: string
): PartialTransaction =>
  prepareTransaction({
    to: market,
    abi: wildcatMarketV2Abi,
    functionName: "requestBorrowerTransfer",
    args: [newBorrower]
  });

export const prepareCancelMarketBorrowerTransfer = (market: string): PartialTransaction =>
  prepareTransaction({
    to: market,
    abi: wildcatMarketV2Abi,
    functionName: "cancelBorrowerTransfer"
  });

export const prepareAcceptMarketBorrowerTransfer = (market: string): PartialTransaction =>
  prepareTransaction({
    to: market,
    abi: wildcatMarketV2Abi,
    functionName: "acceptBorrowerTransfer"
  });

export const prepareRequestBorrowerAccountPrincipalTransfer = (
  registry: string,
  account: string,
  newPrincipal: string
): PartialTransaction =>
  prepareTransaction({
    to: registry,
    abi: borrowerIdentityRegistryAbi,
    functionName: "requestBorrowerAccountPrincipalTransfer",
    args: [account, newPrincipal]
  });

export const prepareCancelBorrowerAccountPrincipalTransfer = (
  registry: string,
  account: string
): PartialTransaction =>
  prepareTransaction({
    to: registry,
    abi: borrowerIdentityRegistryAbi,
    functionName: "cancelBorrowerAccountPrincipalTransfer",
    args: [account]
  });

export const prepareAcceptBorrowerAccountPrincipalTransfer = (
  registry: string,
  account: string
): PartialTransaction =>
  prepareTransaction({
    to: registry,
    abi: borrowerIdentityRegistryAbi,
    functionName: "acceptBorrowerAccountPrincipalTransfer",
    args: [account]
  });
