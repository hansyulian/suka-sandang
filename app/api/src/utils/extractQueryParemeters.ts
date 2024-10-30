import { QueryParameters } from "@app/common";
import { appConfig } from "~/config";

export function extractQueryParameters(query: Partial<QueryParameters>) {
  const { offset, orderBy, orderDirection } = query;
  const order: any | undefined = !orderBy
    ? undefined
    : [[orderBy, orderDirection || "asc"]];
  let limit = query.limit;
  if (limit && limit > appConfig.app.maximumRetrieval) {
    limit = appConfig.app.maximumRetrieval;
  }
  return {
    limit,
    offset,
    order,
  };
}
