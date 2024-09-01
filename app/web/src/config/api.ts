import {
  createMaterialContract,
  deleteMaterialContract,
  emailLoginContract,
  getMaterialContract,
  getServerInfoContract,
  getUserInfoContract,
  listMaterialsContract,
  updateMaterialContract,
  updateUserInfoContract,
} from "@app/common";
import { ReactApiContractClient } from "@hyulian/react-api-contract-client";

import { appConfig } from "~/config/app";

const apiClient = new ReactApiContractClient({ baseUrl: appConfig.apiBaseUrl });

export const Api = {
  getServerInfo: apiClient.registerQueryContract(getServerInfoContract, [
    "serverInfo",
  ]),
  session: {
    getUserInfo: apiClient.registerQueryContract(getUserInfoContract, [
      "getUserInfo",
    ]),
    emailLogin: apiClient.registerMutationContract(emailLoginContract),
    updateUserInfo: apiClient.registerMutationContract(updateUserInfoContract),
  },
  material: {
    getMaterial: apiClient.registerQueryContract(getMaterialContract, [
      "material",
    ]),
    listMaterial: apiClient.registerQueryContract(listMaterialsContract, [
      "material",
    ]),
    createMaterial: apiClient.registerMutationContract(createMaterialContract),
    updateMaterial: apiClient.registerMutationContract(updateMaterialContract),
    deleteMaterial: apiClient.registerMutationContract(deleteMaterialContract),
  },
};
if (appConfig.exposeApiClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).apiClient = Api;
}
