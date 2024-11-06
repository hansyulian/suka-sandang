import {
  getSupplierContract,
  listSuppliersContract,
  createSupplierContract,
  updateSupplierContract,
  deleteSupplierContract,
  getSupplierOptionsContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getSupplierApi = apiClient.registerQueryContract(
  getSupplierContract,
  queryKeyFn.single(queryKeys.supplier)
);
export const listSupplierApi = apiClient.registerQueryContract(
  listSuppliersContract,
  queryKeyFn.many(queryKeys.supplier)
);
export const createSupplierApi = apiClient.registerMutationContract(
  createSupplierContract,
  apiMutationOptions({
    title: "Supplier",
    message: "Adding new supplier",
    successMessage: "New supplier added!",
  })
);
export const updateSupplierApi = apiClient.registerMutationContract(
  updateSupplierContract,
  apiMutationOptions({
    title: "Supplier",
    message: "Updating supplier",
    successMessage: "Supplier updated!",
  })
);
export const deleteSupplierApi = apiClient.registerMutationContract(
  deleteSupplierContract,
  apiMutationOptions({
    title: "Supplier",
    message: "Deleting supplier",
    successMessage: "Supplier deleted!",
  })
);
export const getSupplierOptionsApi = apiClient.registerQueryContract(
  getSupplierOptionsContract,
  queryKeyFn.option(queryKeys.supplier)
);
