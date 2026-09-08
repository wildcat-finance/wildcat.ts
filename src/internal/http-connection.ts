export const getConnectionHeaders = (bearerToken?: string): Record<string, string> => {
  if (bearerToken === undefined) return {};
  if (typeof bearerToken !== "string" || !bearerToken || /\s/.test(bearerToken)) {
    throw new Error("bearerToken must be a non-empty token without whitespace");
  }
  return { Authorization: `Bearer ${bearerToken}` };
};

export const resolveHttpTimeout = (timeoutMs: number | undefined, fallback: number): number => {
  const timeout = timeoutMs ?? fallback;
  if (!Number.isSafeInteger(timeout) || timeout <= 0 || timeout > 2_147_483_647) {
    throw new Error("HTTP timeout must be a positive integer no greater than 2147483647ms");
  }
  return timeout;
};

/** Custom endpoint paths, queries and userinfo may contain provider credentials. */
export const getEndpointLabel = (endpoint: string): string => {
  try {
    const url = new URL(endpoint);
    return url.origin === "null" ? "custom endpoint" : url.origin;
  } catch {
    return "relative or custom endpoint";
  }
};

export const redactConnectionMessage = (
  message: string,
  endpoint: string,
  bearerToken?: string
): string => {
  const withoutEndpoint = endpoint
    ? message.split(endpoint).join(getEndpointLabel(endpoint))
    : message;
  // Transports may normalize a URL before including it in an error message.
  const withoutUrls = withoutEndpoint.replace(/https?:\/\/[^\s<>"']+/gi, getEndpointLabel);
  return bearerToken ? withoutUrls.split(bearerToken).join("[redacted]") : withoutUrls;
};
