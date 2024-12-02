import {
  getInventoryContract,
  listInventoriesContract,
  createInventoryContract,
  updateInventoryContract,
  deleteInventoryContract,
  getInventoryOptionsContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getInventoryApi = apiClient.registerQueryContract(
  getInventoryContract,
  queryKeyFn.single(queryKeys.inventory)
);
export const listInventoryApi = apiClient.registerQueryContract(
  listInventoriesContract,
  queryKeyFn.many(queryKeys.inventory)
);
export const createInventoryApi = apiClient.registerMutationContract(
  createInventoryContract,
  apiMutationOptions({
    title: "Inventory",
    message: "Adding new inventory",
    successMessage: "New inventory added!",
  })
);
export const updateInventoryApi = apiClient.registerMutationContract(
  updateInventoryContract,
  apiMutationOptions({
    title: "Inventory",
    message: "Updating inventory",
    successMessage: "Inventory updated!",
  })
);
export const deleteInventoryApi = apiClient.registerMutationContract(
  deleteInventoryContract,
  apiMutationOptions({
    title: "Inventory",
    message: "Deleting inventory",
    successMessage: "Inventory deleted!",
  })
);
export const getInventoryOptionsApi = apiClient.registerQueryContract(
  getInventoryOptionsContract,
  queryKeyFn.option(queryKeys.inventory)
);
