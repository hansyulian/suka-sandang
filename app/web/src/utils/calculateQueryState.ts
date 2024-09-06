import { QueryObserverBaseResult } from "@tanstack/react-query";

export function calculateQueryState(
  queryResult: Pick<
    QueryObserverBaseResult,
    "isFetched" | "isError" | "isLoading" | "isFetching"
  >
): QueryState {
  const { isError, isFetched, isFetching } = queryResult;
  if (isFetched) {
    return "loaded";
  }
  if (isError) {
    return "error";
  }
  if (isFetching) {
    return "loading";
  }
  return "pending";
}
