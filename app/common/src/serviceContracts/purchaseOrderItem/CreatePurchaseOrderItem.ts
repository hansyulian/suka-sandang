import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  purchaseOrderItemFields,
  purchaseOrderItemCreateFields,
} from "~/types";

export const createPurchaseOrderItemContract = apiContractSchema({
  method: "post",
  path: "/purchase-order-item",
  responseType: "object",
  params: {},
  body: {
    ...purchaseOrderItemCreateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderItemFields,
  },
} as const);

export type CreatePurchaseOrderItemContract = InferApiContract<
  typeof createPurchaseOrderItemContract
>;
