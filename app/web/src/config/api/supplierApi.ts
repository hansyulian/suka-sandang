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

export const supplierApi = {
  getSupplier: apiClient.registerQueryContract(
    getSupplierContract,
    queryKeys.supplier
  ),
  listSupplier: apiClient.registerQueryContract(
    listSuppliersContract,
    queryKeys.supplier
  ),
  createSupplier: apiClient.registerMutationContract(
    createSupplierContract,
    apiMutationOptions({
      title: "Supplier",
      message: "Adding new supplier",
      successMessage: "New supplier added!",
    })
  ),
  updateSupplier: apiClient.registerMutationContract(
    updateSupplierContract,
    apiMutationOptions({
      title: "Supplier",
      message: "Updating supplier",
      successMessage: "Supplier updated!",
    })
  ),
  deleteSupplier: apiClient.registerMutationContract(
    deleteSupplierContract,
    apiMutationOptions({
      title: "Supplier",
      message: "Deleting supplier",
      successMessage: "Supplier deleted!",
    })
  ),
  getSupplierOptions: apiClient.registerQueryContract(
    getSupplierOptionsContract,
    queryKeys.supplierOptions
  ),
};
