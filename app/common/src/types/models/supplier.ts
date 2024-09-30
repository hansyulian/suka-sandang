import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const supplierStatus = [
  "pending",
  "active",
  "blocked",
  "deleted",
] as const;
export type SupplierStatus = (typeof supplierStatus)[number];
export type SupplierAttributes = BaseAttributes & {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status: SupplierStatus;
  remarks?: string;
};
export type SupplierCreationAttributes = CreateOmit<
  Optional<SupplierAttributes, "status">
>;
export type SupplierUpdateAttributes = UpdateOmit<SupplierAttributes>;
