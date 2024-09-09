import { PaginationQuery } from "@app/common";
import { useState } from "react";

export function useSortManager(
  initialState: Partial<Pick<PaginationQuery, "orderBy" | "orderDirection">>
) {
  const [orderBy, setOrderBy] = useState(initialState.orderBy);
  const [orderDirection, setOrderDirection] = useState<
    PaginationQuery["orderDirection"]
  >(initialState.orderDirection || "asc");

  return {
    value: {
      orderBy,
      orderDirection,
    },
    set: {
      orderBy: setOrderBy,
      orderDirection: setOrderDirection,
    },
  };
}
