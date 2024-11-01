import {
  getUserInfoContract,
  emailLoginContract,
  updateUserInfoContract,
  logoutContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";

export const sessionApi = {
  getUserInfo: apiClient.registerQueryContract(
    getUserInfoContract,
    queryKeys.userInfo
  ),
  emailLogin: apiClient.registerMutationContract(
    emailLoginContract,
    apiMutationOptions({
      title: "Login",
      successMessage: "Logged in!",
      message: "Logging In",
    })
  ),
  updateUserInfo: apiClient.registerMutationContract(updateUserInfoContract),
  logout: apiClient.registerMutationContract(logoutContract),
};
