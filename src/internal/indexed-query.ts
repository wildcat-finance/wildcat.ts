import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions
} from "@apollo/client";
import { IndexedTraversalError } from "../indexed-pagination";

export const indexedCancellationError = (signal: AbortSignal): IndexedTraversalError =>
  signal.reason instanceof IndexedTraversalError
    ? signal.reason
    : new IndexedTraversalError("CANCELLED", "Indexed read cancelled");

/** End the SDK wait even when a caller-supplied page source ignores cancellation. */
export const waitForIndexedOperation = async <T>(
  load: () => Promise<T>,
  signal: AbortSignal
): Promise<T> => {
  let onAbort: (() => void) | undefined;
  try {
    return await new Promise<T>((resolve, reject) => {
      onAbort = () => reject(indexedCancellationError(signal));
      if (signal.aborted) return onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
      load().then(resolve, reject);
    });
  } finally {
    if (onAbort) signal.removeEventListener("abort", onAbort);
  }
};

/** Own only this query's subscription and transport cancellation. */
export const queryWithIndexedSignal = async <T, V extends OperationVariables = OperationVariables>(
  client: ApolloClient<NormalizedCacheObject>,
  options: QueryOptions<V, T>,
  signal?: AbortSignal
): Promise<ApolloQueryResult<T>> => {
  if (!signal) return client.query<T, V>(options);

  const defaults = client.defaultOptions.query;
  const controller = new AbortController();
  const signals = new Set<AbortSignal>(
    [signal, defaults?.context?.fetchOptions?.signal, options.context?.fetchOptions?.signal].filter(
      (value): value is AbortSignal => value !== undefined
    )
  );
  const listeners: Array<() => void> = [];
  let subscription: { unsubscribe: () => void } | undefined;
  try {
    return await new Promise<ApolloQueryResult<T>>((resolve, reject) => {
      for (const source of signals) {
        const onAbort = () => {
          reject(indexedCancellationError(source));
          controller.abort();
        };
        if (source.aborted) return onAbort();
        source.addEventListener("abort", onAbort, { once: true });
        listeners.push(() => source.removeEventListener("abort", onAbort));
      }
      subscription = client
        .watchQuery<T, V>({
          ...defaults,
          ...options,
          fetchPolicy: options.fetchPolicy ?? defaults?.fetchPolicy ?? "cache-first",
          errorPolicy: options.errorPolicy ?? defaults?.errorPolicy ?? "none",
          pollInterval: 0,
          context: {
            ...defaults?.context,
            ...options.context,
            fetchOptions: {
              ...defaults?.context?.fetchOptions,
              ...options.context?.fetchOptions,
              signal: controller.signal
            },
            queryDeduplication: false
          }
        })
        .subscribe({
          next: (result) => {
            if (!result.loading) resolve(result);
          },
          error: reject
        });
    });
  } finally {
    for (const remove of listeners) remove();
    subscription?.unsubscribe();
  }
};
