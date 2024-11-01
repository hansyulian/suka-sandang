import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const customerStatus = [
  "draft",
  "active",
  "blocked",
  "deleted",
] as const;
export const customerFields = apiContractModelSchema({
  name: { type: "string" },
  email: { type: "string", optional: true },
  address: { type: "string", optional: true },
  phone: { type: "string", optional: true },
  remarks: { type: "string", optional: true },
  identity: { type: "string", optional: true },
  status: {
    type: "enum",
    values: customerStatus,
  },
});
export type CustomerFields = SchemaType<typeof customerFields>;
export type CustomerStatus = (typeof customerStatus)[number];
export type CustomerAttributes = BaseAttributes & CustomerFields;
export type CustomerCreationAttributes = CreateOmit<
  Optional<CustomerAttributes, "status">
>;
export type CustomerUpdateAttributes = UpdateOmit<CustomerAttributes>;
