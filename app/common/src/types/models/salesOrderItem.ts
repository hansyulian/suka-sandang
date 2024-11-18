import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { BaseAttributes } from "~/types/models/base";

export const salesOrderItemFields = apiContractModelSchema({
  salesOrderId: { type: "string" },
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  subTotal: { type: "number" },
  remarks: { type: "string", optional: true },
});
export const salesOrderItemCreateFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  salesOrderId: { type: "string" },
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export const salesOrderItemUpdateFields = apiContractModelSchema({
  materialId: { type: "string", optional: true },
  quantity: { type: "number", optional: true },
  unitPrice: { type: "number", optional: true },
  remarks: { type: "string", optional: true },
});
export const salesOrderItemSyncFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  materialId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export type SalesOrderItemFields = SchemaType<typeof salesOrderItemFields>;
export type SalesOrderItemAttributes = BaseAttributes & SalesOrderItemFields;
export type SalesOrderItemCreationAttributes = SchemaType<
  typeof salesOrderItemCreateFields
>;
export type SalesOrderItemUpdateAttributes = SchemaType<
  typeof salesOrderItemUpdateFields
>;
export type SalesOrderItemSyncAttributes = SchemaType<
  typeof salesOrderItemSyncFields
>;
