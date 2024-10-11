import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderFields } from "~/types";

export const getPurchaseOrderContract = apiContractSchema({
  method: "get",
  path: "/purchase-order/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderFields,
  },
} as const);

export type GetPurchaseOrderContract = InferApiContract<
  typeof getPurchaseOrderContract
>;
