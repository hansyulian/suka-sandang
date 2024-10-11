import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deletePurchaseOrderItemContract = apiContractSchema({
  method: "delete",
  path: "/purchase-order-item/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeletePurchaseOrderItemContract = InferApiContract<
  typeof deletePurchaseOrderItemContract
>;
