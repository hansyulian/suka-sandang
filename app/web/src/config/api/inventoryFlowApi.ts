import {
  getInventoryFlowContract,
  listInventoriesContract,
  createInventoryFlowContract,
  updateInventoryFlowContract,
  deleteInventoryFlowContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getInventoryFlowApi = apiClient.registerQueryContract(
  getInventoryFlowContract,
  queryKeyFn.single(queryKeys.inventoryFlow)
);
export const listInventoryFlowApi = apiClient.registerQueryContract(
  listInventoriesContract,
  queryKeyFn.many(queryKeys.inventoryFlow)
);
export const createInventoryFlowApi = apiClient.registerMutationContract(
  createInventoryFlowContract,
  apiMutationOptions({
    title: "Inventory Flow",
    message: "Adding new inventory flow",
    successMessage: "New inventory flow added!",
  })
);
export const updateInventoryFlowApi = apiClient.registerMutationContract(
  updateInventoryFlowContract,
  apiMutationOptions({
    title: "Inventory Flow",
    message: "Updating inventory flow",
    successMessage: "Inventory flow updated!",
  })
);
export const deleteInventoryFlowApi = apiClient.registerMutationContract(
  deleteInventoryFlowContract,
  apiMutationOptions({
    title: "Inventory Flow",
    message: "Deleting inventory flow",
    successMessage: "Inventory flow deleted!",
  })
);
