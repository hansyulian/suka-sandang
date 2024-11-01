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

export const customerApi = {
  getCustomer: apiClient.registerQueryContract(
    getCustomerContract,
    queryKeys.customer
  ),
  listCustomer: apiClient.registerQueryContract(
    listCustomersContract,
    queryKeys.customer
  ),
  createCustomer: apiClient.registerMutationContract(
    createCustomerContract,
    apiMutationOptions({
      title: "Customer",
      message: "Adding new customer",
      successMessage: "New customer added!",
    })
  ),
  updateCustomer: apiClient.registerMutationContract(
    updateCustomerContract,
    apiMutationOptions({
      title: "Customer",
      message: "Updating customer",
      successMessage: "Customer updated!",
    })
  ),
  deleteCustomer: apiClient.registerMutationContract(
    deleteCustomerContract,
    apiMutationOptions({
      title: "Customer",
      message: "Deleting customer",
      successMessage: "Customer deleted!",
    })
  ),
};
