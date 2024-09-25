import { QueryParameters } from "@app/common";
import { useEffect, useState } from "react";

const defaultLimit = 20;
const defaultOffset = 0;

export type PaginationManagerValue = Partial<
  Pick<QueryParameters, "limit" | "offset">
>;

export type PaginationManagerOptions = {
  onChange?: (value: PaginationManagerValue) => void;
};

export function usePaginationManager(
  initialState: PaginationManagerValue = {},
  options: PaginationManagerOptions = {}
) {
  const { onChange } = options;
  const [limit, setLimit] = useState<number>(
    initialState.limit || defaultLimit
  );
  const [offset, setOffset] = useState<number>(
    initialState.offset || defaultOffset
  );

  useEffect(() => {
    setLimit(initialState.limit || defaultLimit);
  }, [initialState.limit]);

  useEffect(() => {
    setOffset(initialState.offset || defaultOffset);
  }, [initialState.offset]);

  return {
    value: {
      limit,
      offset,
    },
    set: {
      limit: (value: number) => {
        setLimit(value);
        onChange?.({ limit: value, offset });
      },
      offset: (value: number) => {
        setLimit(value);
        onChange?.({ limit, offset: value });
      },
    },
  };
}
