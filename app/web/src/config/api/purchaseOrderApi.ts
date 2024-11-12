import {
  getPurchaseOrderContract,
  listPurchaseOrdersContract,
  createPurchaseOrderContract,
  updatePurchaseOrderContract,
  deletePurchaseOrderContract,
  syncPurchaseOrderItemsContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getPurchaseOrderApi = apiClient.registerQueryContract(
  getPurchaseOrderContract,
  queryKeyFn.single(queryKeys.purchaseOrder)
);
export const listPurchaseOrderApi = apiClient.registerQueryContract(
  listPurchaseOrdersContract,
  queryKeyFn.many(queryKeys.purchaseOrder)
);
export const createPurchaseOrderApi = apiClient.registerMutationContract(
  createPurchaseOrderContract,
  apiMutationOptions({
    title: "Purchase Order",
    message: "Adding new purchase order",
    successMessage: "New purchase order added!",
  })
);
export const updatePurchaseOrderApi = apiClient.registerMutationContract(
  updatePurchaseOrderContract,
  apiMutationOptions({
    title: "Purchase Order",
    message: "Updating purchase order",
    successMessage: "Purchase order updated!",
  })
);
export const deletePurchaseOrderApi = apiClient.registerMutationContract(
  deletePurchaseOrderContract,
  apiMutationOptions({
    title: "Purchase Order",
    message: "Deleting purchase order",
    successMessage: "Purchase order deleted!",
  })
);
export const syncPurchaseOrderItemsApi = apiClient.registerMutationContract(
  syncPurchaseOrderItemsContract,
  apiMutationOptions({
    title: "Purchase Order",
    message: "Synching purchase order items",
    successMessage: "Purchase order item synched!",
    disableNotification: true,
  })
);
