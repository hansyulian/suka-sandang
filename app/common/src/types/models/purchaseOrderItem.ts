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
export const purchaseOrderItemCreateFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  purchaseOrderId: { type: "string" },
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export const purchaseOrderItemUpdateFields = apiContractModelSchema({
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export const purchaseOrderItemSyncFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export type PurchaseOrderItemFields = SchemaType<
  typeof purchaseOrderItemFields
>;
export type PurchaseOrderItemAttributes = BaseAttributes &
  PurchaseOrderItemFields;
export type PurchaseOrderItemCreationAttributes = SchemaType<
  typeof purchaseOrderItemCreateFields
>;
export type PurchaseOrderItemUpdateAttributes = SchemaType<
  typeof purchaseOrderItemUpdateFields
>;
export type PurchaseOrderItemSyncAttributes = SchemaType<
  typeof purchaseOrderItemSyncFields
>;
