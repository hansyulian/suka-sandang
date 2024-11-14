import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { inventoryFlowFields, inventoryFlowUpdateFields } from "~/types";

export const updateInventoryFlowContract = apiContractSchema({
  method: "put",
  path: "/inventory-flow/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...inventoryFlowUpdateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...inventoryFlowFields,
  },
} as const);

export type UpdateInventoryFlowContract = InferApiContract<
  typeof updateInventoryFlowContract
>;
