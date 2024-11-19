import {
  getCustomerContract,
  listCustomersContract,
  createCustomerContract,
  updateCustomerContract,
  deleteCustomerContract,
  getCustomerOptionsContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getCustomerApi = apiClient.registerQueryContract(
  getCustomerContract,
  queryKeyFn.single(queryKeys.customer)
);
export const listCustomerApi = apiClient.registerQueryContract(
  listCustomersContract,
  queryKeyFn.many(queryKeys.customer)
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

export const getCustomerOptionsApi = apiClient.registerQueryContract(
  getCustomerOptionsContract,
  queryKeyFn.option(queryKeys.customer)
);
