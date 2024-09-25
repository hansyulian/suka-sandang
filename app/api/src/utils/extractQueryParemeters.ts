import { QueryParameters } from "@app/common";

export function extractQueryParameters(query: Partial<QueryParameters>) {
  const { limit, offset, orderBy, orderDirection } = query;
  const order: [[string, string]] | undefined = !orderBy
    ? undefined
    : [[orderBy, orderDirection || "asc"]];
  return {
    limit,
    offset,
    order,
  };
}
