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
import {
  QueryKeyFn,
  ReactApiContractClient,
} from "@hyulian/react-api-contract-client";

import { appConfig } from "~/config/app";

const apiClient = new ReactApiContractClient({ baseUrl: appConfig.apiBaseUrl });

type ConstQueryKeys<Keys extends string> = Record<Keys, QueryKeyFn>;
function lockQueryKeys<
  TKeys extends string,
  TConstQueryKeys extends ConstQueryKeys<TKeys>,
>(queryKeys: TConstQueryKeys): TConstQueryKeys {
  return queryKeys;
}

export const queryKeys = lockQueryKeys({
  serverInfo: () => ["serverInfo"],
  userInfo: () => ["userInfo"],
  material: ({ params }) => ["material", params.id],
  materials: ({ query }) => ["material", query],
});

export const Api = {
  getServerInfo: apiClient.registerQueryContract(
    getServerInfoContract,
    queryKeys.serverInfo
  ),
  session: {
    getUserInfo: apiClient.registerQueryContract(
      getUserInfoContract,
      queryKeys.userInfo,
      {
        retry: false,
      }
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
      queryKeys.materials
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
