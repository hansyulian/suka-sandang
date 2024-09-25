import { OrderDirections, QueryParameters } from "@app/common";

export function extractPaginationQuery(query: StringQuery): QueryParameters {
  const { offset, limit, orderBy, orderDirection } = query;
  return {
    offset: offset && !isNaN(Number(offset)) ? Number(offset) : undefined,
    limit: limit && !isNaN(Number(limit)) ? Number(limit) : undefined,
    orderBy: orderBy ? `${orderBy}` : undefined,
    orderDirection: orderBy
      ? (`${orderDirection || "asc"}` as OrderDirections)
      : undefined,
  };
}
