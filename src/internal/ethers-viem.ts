import { Signer } from "@ethersproject/abstract-signer";
import { createPublicClient, custom, type PublicClient } from "viem";
import type { SignerOrProvider } from "../types";

type RpcRequestArgs = {
  method: string;
  params?: unknown;
};

type RpcRequest = (args: RpcRequestArgs) => Promise<unknown>;

type RequestProvider = {
  request: RpcRequest;
};

type SendProvider = {
  send: (method: string, params?: unknown[]) => Promise<unknown>;
};

type NestedProvider = {
  provider?: unknown;
};

const isRequestProvider = (provider: unknown): provider is RequestProvider => {
  return typeof (provider as RequestProvider | undefined)?.request === "function";
};

const isSendProvider = (provider: unknown): provider is SendProvider => {
  return typeof (provider as SendProvider | undefined)?.send === "function";
};

const normalizeSendParams = (params?: unknown): unknown[] => {
  if (params === undefined) {
    return [];
  }
  return Array.isArray(params) ? params : [params];
};

const getRpcRequest = (provider: unknown): RpcRequest | undefined => {
  if (isRequestProvider(provider)) {
    return provider.request.bind(provider);
  }
  if (isSendProvider(provider)) {
    return ({ method, params }) => provider.send(method, normalizeSendParams(params));
  }

  const nestedProvider = (provider as NestedProvider | undefined)?.provider;
  return nestedProvider ? getRpcRequest(nestedProvider) : undefined;
};

export const getViemPublicClientFromEthers = (providerOrSigner: SignerOrProvider): PublicClient => {
  const provider = Signer.isSigner(providerOrSigner) ? providerOrSigner.provider : providerOrSigner;

  const request = getRpcRequest(provider);
  if (!request) {
    throw new Error("Unable to create a viem public client from this ethers provider");
  }

  return createPublicClient({
    transport: custom({
      request
    })
  });
};
