import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteInventoryContract = apiContractSchema({
  method: "delete",
  path: "/inventory/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteInventoryContract = InferApiContract<
  typeof deleteInventoryContract
>;
