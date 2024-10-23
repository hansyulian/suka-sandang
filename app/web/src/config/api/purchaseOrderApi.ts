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

export const purchaseOrderApi = {
  getPurchaseOrder: apiClient.registerQueryContract(
    getPurchaseOrderContract,
    queryKeys.purchaseOrder
  ),
  listPurchaseOrder: apiClient.registerQueryContract(
    listPurchaseOrdersContract,
    queryKeys.purchaseOrder
  ),
  createPurchaseOrder: apiClient.registerMutationContract(
    createPurchaseOrderContract,
    apiMutationOptions({
      title: "Purchase Order",
      message: "Adding new purchase order",
      successMessage: "New purchase order added!",
    })
  ),
  updatePurchaseOrder: apiClient.registerMutationContract(
    updatePurchaseOrderContract,
    apiMutationOptions({
      title: "Purchase Order",
      message: "Updating purchase order",
      successMessage: "Purchase order updated!",
    })
  ),
  deletePurchaseOrder: apiClient.registerMutationContract(
    deletePurchaseOrderContract,
    apiMutationOptions({
      title: "Purchase Order",
      message: "Deleting purchase order",
      successMessage: "Purchase order deleted!",
    })
  ),
  syncPurchaseOrderItems: apiClient.registerMutationContract(
    syncPurchaseOrderItemsContract,
    apiMutationOptions({
      title: "Purchase Order",
      message: "Synching purchase order items",
      successMessage: "Purchase order item synched!",
    })
  ),
};
