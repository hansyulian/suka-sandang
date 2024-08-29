import { QueryOptions } from "~/@types/data";
import { appConfig } from "~/config";

export function sequelizeQueryOptions(options: QueryOptions) {
  const offset: number = options.offset || 0;
  const limit: number = Math.min(
    options.limit || appConfig.app.maximumRetrieval,
    appConfig.app.maximumRetrieval
  );
  const orderBy = options.orderBy;
  const orderDirection = options.orderDirection || "asc";
  const result = {
    offset,
    limit,
    order: [] as [string, string][],
  };
  if (orderBy) {
    result.order.push([orderBy, orderDirection]);
  }
  return result;
}
