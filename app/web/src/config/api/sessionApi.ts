import {
  getUserInfoContract,
  emailLoginContract,
  updateUserInfoContract,
  logoutContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getUserInfoApi = apiClient.registerQueryContract(
  getUserInfoContract,
  queryKeyFn.simple(queryKeys.userInfo)
);
export const emailLoginApi = apiClient.registerMutationContract(
  emailLoginContract,
  apiMutationOptions({
    title: "Login",
    successMessage: "Logged in!",
    message: "Logging In",
  })
);
export const updateUserInfoApi = apiClient.registerMutationContract(
  updateUserInfoContract
);
export const logoutApi = apiClient.registerMutationContract(logoutContract);
