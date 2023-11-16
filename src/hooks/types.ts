import { QueryObserverResult } from "@tanstack/react-query";

export type TwoStepQueryHookResult<T> = {
  data: T;
  isLoadingInitial: boolean;
  isErrorInitial: boolean;
  errorInitial: Error | null;
  refetchInitial: () => any;

  isLoadingUpdate: boolean;
  isPendingUpdate: boolean;
  isErrorUpdate: boolean;
  errorUpdate: Error | null;
  refetchUpdate: () => any;
};
