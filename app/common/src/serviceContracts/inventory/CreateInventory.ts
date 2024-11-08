import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { inventoryFields, inventoryCreateFields } from "~/types";

export const createInventoryContract = apiContractSchema({
  method: "post",
  path: "/inventory",
  responseType: "object",
  params: {},
  body: {
    ...inventoryCreateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...inventoryFields,
  },
} as const);

export type CreateInventoryContract = InferApiContract<
  typeof createInventoryContract
>;
