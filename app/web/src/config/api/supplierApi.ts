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

export const getSupplierApi = apiClient.registerQueryContract(
  getSupplierContract,
  queryKeys.supplier
);
export const listSupplierApi = apiClient.registerQueryContract(
  listSuppliersContract,
  queryKeys.supplier
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
  queryKeys.supplierOptions
);
