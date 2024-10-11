import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderItemFields } from "~/types";

export const getPurchaseOrderItemContract = apiContractSchema({
  method: "get",
  path: "/purchase-order-item/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderItemFields,
  },
} as const);

export type GetPurchaseOrderItemContract = InferApiContract<
  typeof getPurchaseOrderItemContract
>;
