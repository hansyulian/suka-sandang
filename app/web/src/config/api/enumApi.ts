import { listEnumsContract } from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";

export const listEnumsApi = apiClient.registerQueryContract(
  listEnumsContract,
  queryKeys.enum
);
