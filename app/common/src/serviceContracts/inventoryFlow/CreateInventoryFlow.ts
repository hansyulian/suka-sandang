import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { inventoryFlowFields, inventoryFlowCreateFields } from "~/types";

export const createInventoryFlowContract = apiContractSchema({
  method: "post",
  path: "/inventory-flow",
  responseType: "object",
  params: {},
  body: {
    ...inventoryFlowCreateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...inventoryFlowFields,
  },
} as const);

export type CreateInventoryFlowContract = InferApiContract<
  typeof createInventoryFlowContract
>;
