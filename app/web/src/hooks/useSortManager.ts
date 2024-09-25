import { QueryParameters } from "@app/common";
import { useState } from "react";

export function useSortManager(
  initialState: Partial<
    Pick<QueryParameters, "orderBy" | "orderDirection">
  > = {}
) {
  const [orderBy, setOrderBy] = useState(initialState.orderBy);
  const [orderDirection, setOrderDirection] = useState<
    QueryParameters["orderDirection"]
  >(initialState.orderDirection || "asc");

  return {
    value: {
      orderBy,
      orderDirection: orderBy !== undefined ? orderDirection : undefined,
    },
    set: {
      orderBy: setOrderBy,
      orderDirection: setOrderDirection,
    },
  };
}
