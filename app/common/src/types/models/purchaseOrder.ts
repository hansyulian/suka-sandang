import {
  apiContractModelSchema,
  DateStringConvert,
  SchemaType,
} from "@hyulian/api-contract";
import { BaseAttributes } from "~/types/models/base";

export const purchaseOrderStatus = [
  "draft",
  "processing",
  "completed",
  "cancelled",
  "deleted",
] as const;
export const purchaseOrderCreateFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  date: { type: "dateString" },
  supplierId: { type: "string" },
  remarks: { type: "string", optional: true },
  code: { type: "string" },
  status: {
    type: "enum",
    optional: true,
    values: purchaseOrderStatus,
  },
});
export const purchaseOrderUpdateFields = apiContractModelSchema({
  date: { type: "dateString", optional: true },
  remarks: { type: "string", optional: true },
  status: {
    type: "enum",
    optional: true,
    values: purchaseOrderStatus,
  },
});
export const purchaseOrderFields = apiContractModelSchema({
  date: { type: "dateString" },
  supplierId: { type: "string" },
  remarks: { type: "string", optional: true },
  code: { type: "string" },
  total: { type: "number" },
  status: {
    type: "enum",
    optional: true,
    values: purchaseOrderStatus,
  },
});
export type PurchaseOrderFields = SchemaType<typeof purchaseOrderFields>;
export type PurchaseOrderStatus = (typeof purchaseOrderStatus)[number];
export type PurchaseOrderAttributes = BaseAttributes &
  DateStringConvert<PurchaseOrderFields>;
export type PurchaseOrderCreationAttributes = SchemaType<
  typeof purchaseOrderCreateFields
>;
export type PurchaseOrderUpdateAttributes = SchemaType<
  typeof purchaseOrderUpdateFields
>;
