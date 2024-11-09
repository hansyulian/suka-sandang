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
export const inventoryFlowStatus = ["valid", "cancelled", "deleted"] as const;

export const inventoryFlowFields = apiContractModelSchema({
  inventoryId: { type: "string" },
  purchaseOrderItemId: { type: "string", optional: true },
  quantity: { type: "number" },
  remarks: { type: "string", optional: true },
  activity: { type: "enum", values: inventoryFlowActivity },
  status: { type: "enum", values: inventoryFlowStatus },
});
export const inventoryFlowCreateFields = apiContractModelSchema({
  inventoryId: { type: "string" },
  purchaseOrderItemId: { type: "string", optional: true },
  quantity: { type: "number" },
  remarks: { type: "string", optional: true },
  activity: { type: "enum", values: inventoryFlowActivity, optional: true },
});
export const inventoryFlowUpdateFields = apiContractModelSchema({
  quantity: { type: "number", optional: true },
  remarks: { type: "string", optional: true },
  activity: { type: "enum", values: inventoryFlowActivity, optional: true },
});
export type InventoryFlowFields = SchemaType<typeof inventoryFlowFields>;
export type InventoryFlowAttributes = BaseAttributes & InventoryFlowFields;
export type InventoryFlowCreationAttributes = SchemaType<
  typeof inventoryFlowCreateFields
>;
export type InventoryFlowUpdateAttributes = SchemaType<
  typeof inventoryFlowUpdateFields
>;
export type InventoryFlowStatus = (typeof inventoryFlowStatus)[number];
export type InventoryFlowActivity = (typeof inventoryFlowActivity)[number];
