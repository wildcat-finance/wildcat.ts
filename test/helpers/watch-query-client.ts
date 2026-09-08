import { ApolloClient, NormalizedCacheObject, Observable } from "@apollo/client";

/** Keep fixture handlers while supporting the SDK's cancellable query subscriptions. */
export const withWatchQuery = (
  client: ApolloClient<NormalizedCacheObject>
): ApolloClient<NormalizedCacheObject> =>
  Object.assign(client, {
    defaultOptions: client.defaultOptions ?? {},
    watchQuery: (options: Parameters<typeof client.query>[0]) =>
      new Observable((observer) => {
        void client.query(options).then(
          (result) => {
            observer.next({ ...result, loading: false });
            observer.complete();
          },
          (error) => observer.error(error)
        );
      })
  });
