import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { BaseAttributes } from "~/types/models/base";

export const inventoryFlowActivity = [
  "adjustment",
  "procurement",
  "sales",
  "return",
  "transfer",
  "allocation",
  "scrap",
] as const;
export const inventoryFlowStatus = [
  "completed",
  "cancelled",
  "deleted",
] as const;

export const inventoryFlowFields = apiContractModelSchema({
  inventoryId: { type: "string" },
  purchaseOrderItemId: { type: "string", optional: true },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  subTotal: { type: "number" },
  remarks: { type: "string", optional: true },
});
export const inventoryFlowCreateFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  inventoryId: { type: "string" },
  purchaseOrderItemId: { type: "string", optional: true },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export const inventoryFlowUpdateFields = apiContractModelSchema({
  quantity: { type: "number", optional: true },
  unitPrice: { type: "number", optional: true },
  remarks: { type: "string", optional: true },
});
export const inventoryFlowSyncFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  purchaseOrderItemId: { type: "string" },
  quantity: { type: "number" },
  unitPrice: { type: "number" },
  remarks: { type: "string", optional: true },
});
export type InventoryFlowFields = SchemaType<typeof inventoryFlowFields>;
export type InventoryFlowAttributes = BaseAttributes & InventoryFlowFields;
export type InventoryFlowCreationAttributes = SchemaType<
  typeof inventoryFlowCreateFields
>;
export type InventoryFlowUpdateAttributes = SchemaType<
  typeof inventoryFlowUpdateFields
>;
export type InventoryFlowSyncAttributes = SchemaType<
  typeof inventoryFlowSyncFields
>;
export type InventoryFlowStatus = typeof inventoryFlowStatus;
export type InventoryFlowActivity = typeof inventoryFlowActivity;
