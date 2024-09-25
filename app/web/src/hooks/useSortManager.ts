import { OrderDirections, QueryParameters } from "@app/common";
import { useEffect, useState } from "react";

export type SortManagerValue = Partial<
  Pick<QueryParameters, "orderBy" | "orderDirection">
>;
export type SortManagerOptions = {
  onChange?: (value: SortManagerValue) => void;
};

export function useSortManager(
  initialState: SortManagerValue = {},
  options: SortManagerOptions = {}
) {
  const { onChange } = options;
  const [orderBy, setOrderBy] = useState(initialState.orderBy);
  const [orderDirection, setOrderDirection] = useState<
    QueryParameters["orderDirection"]
  >(initialState.orderDirection || "asc");

  useEffect(() => {
    setOrderBy(initialState.orderBy);
  }, [initialState.orderBy]);
  useEffect(() => {
    setOrderDirection(initialState.orderDirection);
  }, [initialState.orderDirection]);

  return {
    value: {
      orderBy,
      orderDirection: orderBy !== undefined ? orderDirection : undefined,
    },
    set: {
      orderBy: (value: string) => {
        setOrderBy(value);
        onChange?.({ orderBy: value, orderDirection });
      },
      orderDirection: (value: OrderDirections) => {
        setOrderDirection(value);
        onChange?.({ orderBy, orderDirection: value });
      },
    },
  };
}
