import { CreateCustomerContract } from "./CreateCustomer";
import { DeleteCustomerContract } from "./DeleteCustomer";
import { GetCustomerContract } from "./GetCustomer";
import { ListCustomersContract } from "./ListCustomers";
import { UpdateCustomerContract } from "./UpdateCustomer";

export * from "./CreateCustomer";
export * from "./DeleteCustomer";
export * from "./GetCustomer";
export * from "./ListCustomers";
export * from "./UpdateCustomer";

export namespace CustomerContracts {
  export type CreateCustomer = CreateCustomerContract;
  export type DeleteCustomer = DeleteCustomerContract;
  export type GetCustomer = GetCustomerContract;
  export type ListCustomers = ListCustomersContract;
  export type UpdateCustomer = UpdateCustomerContract;
}
