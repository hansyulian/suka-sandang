import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deletePurchaseOrderContract = apiContractSchema({
  method: "delete",
  path: "/purchase-order/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeletePurchaseOrderContract = InferApiContract<
  typeof deletePurchaseOrderContract
>;
