import {
  createMaterialContract,
  deleteMaterialContract,
  emailLoginContract,
  getMaterialContract,
  getServerInfoContract,
  getUserInfoContract,
  listMaterialsContract,
  logoutContract,
  updateMaterialContract,
  updateUserInfoContract,
} from "@app/common";
import { ReactApiContractClient } from "@hyulian/react-api-contract-client";

import { appConfig } from "~/config/app";
import { queryKeys } from "~/config/queryKeys";

const apiClient = new ReactApiContractClient({
  baseUrl: appConfig.apiBaseUrl,
  retry: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retryOnMount: true,
});
export const Api = {
  getServerInfo: apiClient.registerQueryContract(
    getServerInfoContract,
    queryKeys.serverInfo
  ),
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
    createMaterial: apiClient.registerMutationContract(createMaterialContract),
    updateMaterial: apiClient.registerMutationContract(updateMaterialContract),
    deleteMaterial: apiClient.registerMutationContract(deleteMaterialContract),
  },
};
if (appConfig.exposeApiClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).apiClient = Api;
}
