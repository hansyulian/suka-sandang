import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { QueryKeyNames } from "~/config/queryKeys";
import { queryKeyFn } from "~/utils/queryKeyFn";

export function useInvalidateQuery() {
  const queryClient = useQueryClient();
  return useCallback(
    (queryKey: QueryKeyNames, singleParam?: object) => {
      const promises: Promise<void>[] = [
        queryClient.invalidateQueries({
          queryKey: [queryKeyFn, "many"],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeyFn, "option"],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeyFn, "simple"],
          type: "all",
        }),
      ];
      if (singleParam) {
        promises.push(
          queryClient.invalidateQueries({
            queryKey: queryKeyFn.single(queryKey)(singleParam),
            type: "active",
          })
        );
      }
      return promises;
    },
    [queryClient]
  );
}
