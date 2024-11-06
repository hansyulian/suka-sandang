import {
  getPurchaseOrderItemContract,
  listPurchaseOrderItemsContract,
  createPurchaseOrderItemContract,
  updatePurchaseOrderItemContract,
  deletePurchaseOrderItemContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getPurchaseOrderItemApi = apiClient.registerQueryContract(
  getPurchaseOrderItemContract,
  queryKeyFn.single(queryKeys.purchaseOrderItem)
);
export const listPurchaseOrderItemApi = apiClient.registerQueryContract(
  listPurchaseOrderItemsContract,
  queryKeyFn.many(queryKeys.purchaseOrderItem)
);
export const createPurchaseOrderItemApi = apiClient.registerMutationContract(
  createPurchaseOrderItemContract,
  apiMutationOptions({
    title: "Purchase Order Item",
    message: "Adding new purchase order item",
    successMessage: "New purchase order item added!",
  })
);
export const updatePurchaseOrderItemApi = apiClient.registerMutationContract(
  updatePurchaseOrderItemContract,
  apiMutationOptions({
    title: "Purchase Order Item",
    message: "Updating purchase order item",
    successMessage: "Purchase order item updated!",
  })
);
export const deletePurchaseOrderItemApi = apiClient.registerMutationContract(
  deletePurchaseOrderItemContract,
  apiMutationOptions({
    title: "Purchase Order Item",
    message: "Deleting purchase order item",
    successMessage: "Purchase order item deleted!",
  })
);
