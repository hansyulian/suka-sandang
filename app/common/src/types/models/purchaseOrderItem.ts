import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const purchaseOrderItemFields = apiContractModelSchema({
  purchaseOrderId: { type: "string" },
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  subTotal: { type: "number" },
  remarks: { type: "string", optional: true },
});
export type PurchaseOrderItemFields = SchemaType<
  typeof purchaseOrderItemFields
>;
export type PurchaseOrderItemAttributes = BaseAttributes &
  PurchaseOrderItemFields;
export type PurchaseOrderItemCreationAttributes = CreateOmit<
  Optional<PurchaseOrderItemAttributes>
>;
export type PurchaseOrderItemUpdateAttributes =
  UpdateOmit<PurchaseOrderItemAttributes>;
