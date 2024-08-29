import { ReactApiContractClient } from "@hyulian/react-api-contract-client";

import {
  emailLoginContract,
  getServerInfoContract,
  getUserInfoContract,
} from "@app/common";

import { appConfig } from "~/config/app";

const apiClient = new ReactApiContractClient({ baseUrl: appConfig.apiBaseUrl });

export const Api = {
  getServerInfo: apiClient.registerQueryContract(getServerInfoContract, [
    "serverInfo",
  ]),
  getUserInfo: apiClient.registerQueryContract(getUserInfoContract, [
    "getUserInfo",
  ]),
  emailLogin: apiClient.registerMutationContract(emailLoginContract),
};
