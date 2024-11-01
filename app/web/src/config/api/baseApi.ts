import { ReactApiContractClient } from "@hyulian/react-api-contract";
import { appConfig } from "~/config/app";

export const apiClient = new ReactApiContractClient({
  baseUrl: appConfig.apiBaseUrl,
});
