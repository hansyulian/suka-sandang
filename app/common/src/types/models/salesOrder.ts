import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { BaseAttributes } from "~/types/models/base";

export const salesOrderStatus = [
  "draft",
  "processing",
  "completed",
  "cancelled",
  "deleted",
] as const;
export const salesOrderCreateFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  date: { type: "date" },
  customerId: { type: "string" },
  remarks: { type: "string", optional: true },
  code: { type: "string" },
  status: {
    type: "enum",
    optional: true,
    values: salesOrderStatus,
  },
});
export const salesOrderUpdateFields = apiContractModelSchema({
  date: { type: "date", optional: true },
  remarks: { type: "string", optional: true },
  status: {
    type: "enum",
    optional: true,
    values: salesOrderStatus,
  },
});
export const salesOrderFields = apiContractModelSchema({
  date: { type: "date" },
  customerId: { type: "string" },
  remarks: { type: "string", optional: true },
  code: { type: "string" },
  total: { type: "number" },
  status: {
    type: "enum",
    values: salesOrderStatus,
  },
});
export type SalesOrderFields = SchemaType<typeof salesOrderFields>;
export type SalesOrderStatus = (typeof salesOrderStatus)[number];
export type SalesOrderAttributes = BaseAttributes & SalesOrderFields;
export type SalesOrderCreationAttributes = SchemaType<
  typeof salesOrderCreateFields
>;
export type SalesOrderUpdateAttributes = SchemaType<
  typeof salesOrderUpdateFields
>;
