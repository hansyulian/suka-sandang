import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  purchaseOrderFields,
  purchaseOrderCreateFields,
  purchaseOrderItemSyncFields,
} from "~/types";

export const createPurchaseOrderContract = apiContractSchema({
  method: "post",
  path: "/purchase-order",
  responseType: "object",
  params: {},
  body: {
    ...purchaseOrderCreateFields,
    items: {
      type: "objects",
      optional: true,
      spec: {
        ...purchaseOrderItemSyncFields,
      },
    },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderFields,
  },
} as const);

export type CreatePurchaseOrderContract = InferApiContract<
  typeof createPurchaseOrderContract
>;
