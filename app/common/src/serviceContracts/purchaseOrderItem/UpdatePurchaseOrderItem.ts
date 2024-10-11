import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  purchaseOrderItemFields,
  purchaseOrderItemUpdateFields,
} from "~/types";

export const updatePurchaseOrderItemContract = apiContractSchema({
  method: "put",
  path: "/purchase-order-item/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...purchaseOrderItemUpdateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderItemFields,
  },
} as const);

export type UpdatePurchaseOrderItemContract = InferApiContract<
  typeof updatePurchaseOrderItemContract
>;
