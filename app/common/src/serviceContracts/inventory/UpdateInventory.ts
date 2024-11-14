import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  inventoryFields,
  inventoryFlowSyncFields,
  inventoryUpdateFields,
} from "~/types";

export const updateInventoryContract = apiContractSchema({
  method: "put",
  path: "/inventory/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...inventoryUpdateFields,
    items: {
      type: "objects",
      optional: true,
      spec: {
        ...inventoryFlowSyncFields,
      },
    },
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
