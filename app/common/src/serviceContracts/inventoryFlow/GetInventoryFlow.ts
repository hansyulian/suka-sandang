import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { inventoryFlowFields } from "~/types";

export const getInventoryFlowContract = apiContractSchema({
  method: "get",
  path: "/inventory-flow/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...inventoryFlowFields,
  },
} as const);

export type GetInventoryFlowContract = InferApiContract<
  typeof getInventoryFlowContract
>;
