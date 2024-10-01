import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { QueryKeyNames } from "~/config/queryKeys";

export function useInvalidateQuery() {
  const queryClient = useQueryClient();
  return useCallback(
    (queryKey: QueryKeyNames) => {
      return queryClient.invalidateQueries({
        queryKey: [queryKey],
        type: "all",
      });
    },
    [queryClient]
  );
}
