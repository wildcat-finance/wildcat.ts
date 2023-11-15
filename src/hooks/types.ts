import { QueryObserverResult } from "@tanstack/react-query";

export type TwoStepQueryHookResult<T> = {
  data: T;
  isLoadingInitial: boolean;
  isErrorInitial: boolean;
  errorInitial: Error | null;
  refetchInitial: () => Promise<QueryObserverResult<T, Error>>;

  isLoadingUpdate: boolean;
  isPendingUpdate: boolean;
  isErrorUpdate: boolean;
  errorUpdate: Error | null;
  refetchUpdate: () => Promise<QueryObserverResult<T, Error>>;
};
