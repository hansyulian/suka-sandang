import { listEnumsContract } from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const listEnumsApi = apiClient.registerQueryContract(
  listEnumsContract,
  queryKeyFn.option(queryKeys.enum)
);
