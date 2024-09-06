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
import {
  QueryKeyFn,
  ReactApiContractClient,
} from "@hyulian/react-api-contract-client";

import { appConfig } from "~/config/app";

const apiClient = new ReactApiContractClient({ baseUrl: appConfig.apiBaseUrl });

type ConstQueryKeys<Keys extends string> = Record<Keys, QueryKeyFn>;
function lockQueryKeys<
  TKeys extends string,
  TConstQueryKeys extends ConstQueryKeys<TKeys>
>(queryKeys: TConstQueryKeys): TConstQueryKeys {
  return queryKeys;
}

export const queryKeys = lockQueryKeys({
  getServerInfo: () => ["serverInfo"],
  getUserInfo: () => ["userInfo"],
  getMaterial: ({ params }) => ["material", params.id],
  listMaterial: ({ query }) => ["material", query],
});

export const Api = {
  getServerInfo: apiClient.registerQueryContract(
    getServerInfoContract,
    queryKeys.getServerInfo
  ),
  session: {
    getUserInfo: apiClient.registerQueryContract(
      getUserInfoContract,
      queryKeys.getUserInfo
    ),
    emailLogin: apiClient.registerMutationContract(emailLoginContract),
    updateUserInfo: apiClient.registerMutationContract(updateUserInfoContract),
  },
  material: {
    getMaterial: apiClient.registerQueryContract(
      getMaterialContract,
      queryKeys.getMaterial
    ),
    listMaterial: apiClient.registerQueryContract(
      listMaterialsContract,
      queryKeys.listMaterial
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
