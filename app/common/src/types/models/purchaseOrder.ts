import {
  apiContractModelSchema,
  DateStringConvert,
  SchemaType,
} from "@hyulian/api-contract";
import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const purchaseOrderStatus = [
  "draft",
  "processing",
  "completed",
  "cancelled",
  "deleted",
] as const;
export const purchaseOrderFields = apiContractModelSchema({
  date: { type: "dateString" },
  code: { type: "string" },
  supplierId: { type: "string" },
  remarks: { type: "string", optional: true },
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
export type PurchaseOrderCreationAttributes = CreateOmit<
  Optional<PurchaseOrderAttributes, "status">,
  "total"
>;
export type PurchaseOrderUpdateAttributes = UpdateOmit<
  PurchaseOrderAttributes,
  "code" | "total" | "supplierId"
>;
