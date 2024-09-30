import {
  createMaterialContract,
  createSupplierContract,
  deleteMaterialContract,
  deleteSupplierContract,
  emailLoginContract,
  getMaterialContract,
  getServerInfoContract,
  getSupplierContract,
  getUserInfoContract,
  listEnumsContract,
  listMaterialsContract,
  listSuppliersContract,
  logoutContract,
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
  queryOptions: {
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryOnMount: true,
  },
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
};
if (appConfig.exposeApiClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).apiClient = Api;
}
