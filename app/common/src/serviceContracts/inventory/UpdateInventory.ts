import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { inventoryFields, inventoryUpdateFields } from "~/types";

export const updateInventoryContract = apiContractSchema({
  method: "put",
  path: "/inventory/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...inventoryUpdateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...inventoryFields,
  },
} as const);

export type UpdateInventoryContract = InferApiContract<
  typeof updateInventoryContract
>;
