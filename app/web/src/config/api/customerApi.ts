import {
  getCustomerContract,
  listCustomersContract,
  createCustomerContract,
  updateCustomerContract,
  deleteCustomerContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";

export const getCustomerApi = apiClient.registerQueryContract(
  getCustomerContract,
  queryKeys.customer
);
export const listCustomerApi = apiClient.registerQueryContract(
  listCustomersContract,
  queryKeys.customer
);
export const createCustomerApi = apiClient.registerMutationContract(
  createCustomerContract,
  apiMutationOptions({
    title: "Customer",
    message: "Adding new customer",
    successMessage: "New customer added!",
  })
);
export const updateCustomerApi = apiClient.registerMutationContract(
  updateCustomerContract,
  apiMutationOptions({
    title: "Customer",
    message: "Updating customer",
    successMessage: "Customer updated!",
  })
);
export const deleteCustomerApi = apiClient.registerMutationContract(
  deleteCustomerContract,
  apiMutationOptions({
    title: "Customer",
    message: "Deleting customer",
    successMessage: "Customer deleted!",
  })
);
