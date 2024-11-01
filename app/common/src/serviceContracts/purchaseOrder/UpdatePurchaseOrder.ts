import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderFields, purchaseOrderUpdateFields } from "~/types";

export const updatePurchaseOrderContract = apiContractSchema({
  method: "put",
  path: "/purchase-order/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...purchaseOrderUpdateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderFields,
  },
} as const);

export type UpdatePurchaseOrderContract = InferApiContract<
  typeof updatePurchaseOrderContract
>;
