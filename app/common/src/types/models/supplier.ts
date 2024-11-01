import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const supplierStatus = [
  "draft",
  "active",
  "blocked",
  "deleted",
] as const;
export const supplierFields = apiContractModelSchema({
  name: { type: "string" },
  email: { type: "string", optional: true },
  address: { type: "string", optional: true },
  phone: { type: "string", optional: true },
  remarks: { type: "string", optional: true },
  identity: { type: "string", optional: true },
  status: {
    type: "enum",
    values: supplierStatus,
  },
});
export type SupplierFields = SchemaType<typeof supplierFields>;
export type SupplierStatus = (typeof supplierStatus)[number];
export type SupplierAttributes = BaseAttributes & SupplierFields;
export type SupplierCreationAttributes = CreateOmit<
  Optional<SupplierAttributes, "status">
>;
export type SupplierUpdateAttributes = UpdateOmit<SupplierAttributes>;
