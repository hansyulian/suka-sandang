import { PaginationQuery } from "@app/common";
import { useEffect, useState } from "react";

const defaultLimit = 20;
const defaultOffset = 0;

export function usePaginationManager(
  initialState: Partial<Pick<PaginationQuery, "limit" | "offset">> = {}
) {
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
      limit: setLimit,
      offset: setOffset,
    },
  };
}
