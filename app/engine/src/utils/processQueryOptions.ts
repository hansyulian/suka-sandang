import { SequelizePaginationOptions } from "~/types";
import { appConfig } from "~/config";

export function processQueryOptions(query: SequelizePaginationOptions) {
  const result = {
    ...query,
  };
  if (result.limit && result.limit > appConfig.app.maximumRetrieval) {
    result.limit = appConfig.app.maximumRetrieval;
  }
  return result;
}
