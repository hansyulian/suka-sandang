import {
  apiContractModelSchema,
  DateStringConvert,
  SchemaType,
} from "@hyulian/api-contract";
import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";
import { PurchaseOrderItemAttributes } from "~/types/models/purchaseOrderItem";

export const purchaseOrderStatus = [
  "pending",
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
  Optional<PurchaseOrderAttributes, "status" | "total">
> & {
  items: Pick<
    PurchaseOrderItemAttributes,
    "materialId" | "quantity" | "remarks" | "unitPrice"
  >[];
};
export type PurchaseOrderUpdateAttributes = UpdateOmit<
  PurchaseOrderAttributes,
  "code" | "total"
> & {
  items: Pick<
    PurchaseOrderItemAttributes,
    "id" | "materialId" | "quantity" | "remarks" | "unitPrice"
  >[];
};
