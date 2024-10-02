import {
  createCustomerContract,
  createMaterialContract,
  createSupplierContract,
  deleteCustomerContract,
  deleteMaterialContract,
  deleteSupplierContract,
  emailLoginContract,
  getCustomerContract,
  getMaterialContract,
  getServerInfoContract,
  getSupplierContract,
  getUserInfoContract,
  listCustomersContract,
  listEnumsContract,
  listMaterialsContract,
  listSuppliersContract,
  logoutContract,
  updateCustomerContract,
  updateMaterialContract,
  updateSupplierContract,
  updateUserInfoContract,
} from "@app/common";
import { ReactApiContractClient } from "@hyulian/react-api-contract-client";

import { appConfig } from "~/config/app";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";

const apiClient = new ReactApiContractClient({
  baseUrl: appConfig.apiBaseUrl,
});
export const Api = {
  getServerInfo: apiClient.registerQueryContract(
    getServerInfoContract,
    queryKeys.serverInfo
  ),
  enum: {
    listEnums: apiClient.registerQueryContract(
      listEnumsContract,
      queryKeys.enum
    ),
  },
  session: {
    getUserInfo: apiClient.registerQueryContract(
      getUserInfoContract,
      queryKeys.userInfo
    ),
    emailLogin: apiClient.registerMutationContract(emailLoginContract),
    updateUserInfo: apiClient.registerMutationContract(updateUserInfoContract),
    logout: apiClient.registerMutationContract(logoutContract),
  },
  material: {
    getMaterial: apiClient.registerQueryContract(
      getMaterialContract,
      queryKeys.material
    ),
    listMaterial: apiClient.registerQueryContract(
      listMaterialsContract,
      queryKeys.material
    ),
    createMaterial: apiClient.registerMutationContract(
      createMaterialContract,
      apiMutationOptions({
        title: "Material",
        message: "Adding new material",
        successMessage: "New material added!",
      })
    ),
    updateMaterial: apiClient.registerMutationContract(
      updateMaterialContract,
      apiMutationOptions({
        title: "Material",
        message: "Updating material",
        successMessage: "Material updated!",
      })
    ),
    deleteMaterial: apiClient.registerMutationContract(
      deleteMaterialContract,
      apiMutationOptions({
        title: "Material",
        message: "Deleting material",
        successMessage: "Material deleted!",
      })
    ),
  },
  supplier: {
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
  },

  customer: {
    getCustomer: apiClient.registerQueryContract(
      getCustomerContract,
      queryKeys.customer
    ),
    listCustomer: apiClient.registerQueryContract(
      listCustomersContract,
      queryKeys.customer
    ),
    createCustomer: apiClient.registerMutationContract(
      createCustomerContract,
      apiMutationOptions({
        title: "Customer",
        message: "Adding new customer",
        successMessage: "New customer added!",
      })
    ),
    updateCustomer: apiClient.registerMutationContract(
      updateCustomerContract,
      apiMutationOptions({
        title: "Customer",
        message: "Updating customer",
        successMessage: "Customer updated!",
      })
    ),
    deleteCustomer: apiClient.registerMutationContract(
      deleteCustomerContract,
      apiMutationOptions({
        title: "Customer",
        message: "Deleting customer",
        successMessage: "Customer deleted!",
      })
    ),
  },
};
if (appConfig.exposeApiClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).apiClient = Api;
}
