import { PaginationQuery } from "@app/common";

export function extractPaginationQuery(query: PaginationQuery) {
  const { limit, offset, orderBy, orderDirection } = query;
  return {
    limit,
    offset,
    orderBy,
    orderDirection,
  };
}
