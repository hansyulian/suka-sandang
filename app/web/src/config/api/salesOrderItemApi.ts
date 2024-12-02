import {
  getSalesOrderItemContract,
  listSalesOrderItemsContract,
  createSalesOrderItemContract,
  updateSalesOrderItemContract,
  deleteSalesOrderItemContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getSalesOrderItemApi = apiClient.registerQueryContract(
  getSalesOrderItemContract,
  queryKeyFn.single(queryKeys.salesOrderItem)
);
export const listSalesOrderItemApi = apiClient.registerQueryContract(
  listSalesOrderItemsContract,
  queryKeyFn.many(queryKeys.salesOrderItem)
);
export const createSalesOrderItemApi = apiClient.registerMutationContract(
  createSalesOrderItemContract,
  apiMutationOptions({
    title: "Sales Order Item",
    message: "Adding new sales order item",
    successMessage: "New sales order item added!",
  })
);
export const updateSalesOrderItemApi = apiClient.registerMutationContract(
  updateSalesOrderItemContract,
  apiMutationOptions({
    title: "Sales Order Item",
    message: "Updating sales order item",
    successMessage: "Sales order item updated!",
  })
);
export const deleteSalesOrderItemApi = apiClient.registerMutationContract(
  deleteSalesOrderItemContract,
  apiMutationOptions({
    title: "Sales Order Item",
    message: "Deleting sales order item",
    successMessage: "Sales order item deleted!",
  })
);
