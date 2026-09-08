import { http, type HttpTransport } from "viem";
import { getConnectionHeaders, resolveHttpTimeout } from "../internal/http-connection";
import { isSupportedChainId, SupportedChainId } from "./chains";

export const GatewayRpcBaseUrl = "https://rpc.wildcat.finance";
export const GatewaySubgraphBaseUrl = "https://graph.wildcat.finance";

export type GatewayConnectionOptions = {
  /** Replaces the default endpoint. Relative proxy URLs are supported in browsers. */
  endpoint?: string;
  /** Server-side credentials; never pass a private bearer to a browser client. */
  bearerToken?: string;
};

export type RpcConnectionOptions = GatewayConnectionOptions & {
  /** Per-request timeout. Raise this for intentionally slow server workloads. */
  timeoutMs?: number;
};

/** Structurally compatible with ethers v5's ConnectionInfo. Contains credentials when supplied. */
export type RpcConnection = {
  url: string;
  headers: Record<string, string>;
  timeout: number;
};

export const DefaultRpcTimeoutMs = 30_000;

/** Resolve a public gateway connection or a caller's replacement endpoint. */
export const getRpcConnection = (
  chainId: SupportedChainId,
  options: RpcConnectionOptions = {}
): RpcConnection => {
  if (!isSupportedChainId(chainId)) throw new Error(`Unsupported chain ID: ${chainId}`);
  const url = options.endpoint ?? `${GatewayRpcBaseUrl}/${chainId}`;
  if (!url.trim()) throw new Error("RPC endpoint must not be empty");
  return {
    url,
    headers: getConnectionHeaders(options.bearerToken),
    timeout: resolveHttpTimeout(options.timeoutMs, DefaultRpcTimeoutMs)
  };
};

/** Create a viem/wagmi HTTP transport; client and wallet selection remain with the caller. */
export const createRpcTransport = (
  chainId: SupportedChainId,
  options: RpcConnectionOptions = {}
): HttpTransport => {
  const { url, headers, timeout } = getRpcConnection(chainId, options);
  return http(url, {
    fetchOptions: {
      headers,
      // An authenticated connection must not follow a redirect to another endpoint.
      ...(options.bearerToken === undefined ? {} : { redirect: "error" })
    },
    timeout
  });
};
