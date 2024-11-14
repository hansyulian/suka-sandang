import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteInventoryFlowContract = apiContractSchema({
  method: "delete",
  path: "/inventory-flow/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteInventoryFlowContract = InferApiContract<
  typeof deleteInventoryFlowContract
>;
