import {
  getSalesOrderContract,
  listSalesOrdersContract,
  createSalesOrderContract,
  updateSalesOrderContract,
  deleteSalesOrderContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getSalesOrderApi = apiClient.registerQueryContract(
  getSalesOrderContract,
  queryKeyFn.single(queryKeys.salesOrder)
);
export const listSalesOrderApi = apiClient.registerQueryContract(
  listSalesOrdersContract,
  queryKeyFn.many(queryKeys.salesOrder)
);
export const createSalesOrderApi = apiClient.registerMutationContract(
  createSalesOrderContract,
  apiMutationOptions({
    title: "Sales Order",
    message: "Adding new sales order",
    successMessage: "New sales order added!",
  })
);
export const updateSalesOrderApi = apiClient.registerMutationContract(
  updateSalesOrderContract,
  apiMutationOptions({
    title: "Sales Order",
    message: "Updating sales order",
    successMessage: "Sales order updated!",
  })
);
export const deleteSalesOrderApi = apiClient.registerMutationContract(
  deleteSalesOrderContract,
  apiMutationOptions({
    title: "Sales Order",
    message: "Deleting sales order",
    successMessage: "Sales order deleted!",
  })
);
