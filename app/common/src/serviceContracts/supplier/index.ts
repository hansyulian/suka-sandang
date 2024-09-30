import { CreateSupplierContract } from "./CreateSupplier";
import { DeleteSupplierContract } from "./DeleteSupplier";
import { GetSupplierContract } from "./GetSupplier";
import { ListSuppliersContract } from "./ListSuppliers";
import { UpdateSupplierContract } from "./UpdateSupplier";

export * from "./CreateSupplier";
export * from "./DeleteSupplier";
export * from "./GetSupplier";
export * from "./ListSuppliers";
export * from "./UpdateSupplier";

export namespace SupplierContracts {
  export type CreateSupplier = CreateSupplierContract;
  export type DeleteSupplier = DeleteSupplierContract;
  export type GetSupplier = GetSupplierContract;
  export type ListSuppliers = ListSuppliersContract;
  export type UpdateSupplier = UpdateSupplierContract;
}
