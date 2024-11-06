import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { QueryKeyNames } from "~/config/queryKeys";

export function useInvalidateQuery() {
  const queryClient = useQueryClient();
  return useCallback(
    (queryKey: QueryKeyNames, singleParams?: object) => {
      const promises: Promise<void>[] = [
        queryClient.invalidateQueries({
          queryKey: [queryKey],
          type: "all",
        }),
      ];
      if (singleParams) {
        promises.push(
          queryClient.invalidateQueries({
            queryKey: [singleParams, queryKey],
            type: "active",
          })
        );
      }
      return promises;
    },
    [queryClient]
  );
}
