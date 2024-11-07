import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { BaseAttributes } from "~/types/models/base";

export const inventoryStatus = ["active", "finished", "deleted"] as const;
export const inventoryCreateFields = apiContractModelSchema({
  id: { type: "string", optional: true },
  materialId: { type: "string" },
  remarks: { type: "string", optional: true },
  code: { type: "string" },
  status: {
    type: "enum",
    optional: true,
    values: inventoryStatus,
  },
});
export const inventoryUpdateFields = apiContractModelSchema({
  remarks: { type: "string", optional: true },
  status: {
    type: "enum",
    optional: true,
    values: inventoryStatus,
  },
});
export const inventoryFields = apiContractModelSchema({
  materialId: { type: "string" },
  remarks: { type: "string", optional: true },
  code: { type: "string" },
  status: {
    type: "enum",
    optional: true,
    values: inventoryStatus,
  },
});
export type InventoryFields = SchemaType<typeof inventoryFields>;
export type InventoryStatus = (typeof inventoryStatus)[number];
export type InventoryAttributes = BaseAttributes & InventoryFields;
export type InventoryCreationAttributes = SchemaType<
  typeof inventoryCreateFields
>;
export type InventoryUpdateAttributes = SchemaType<
  typeof inventoryUpdateFields
>;
