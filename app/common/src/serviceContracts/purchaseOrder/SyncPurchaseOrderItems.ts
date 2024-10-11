import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderFields, purchaseOrderItemSyncFields } from "~/types";

export const syncPurchaseOrderItemsContract = apiContractSchema({
  method: "post",
  path: "/purchase-order/{id}/sync-items",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    items: {
      type: "objects",
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

export type SyncPurchaseOrderItemContract = InferApiContract<
  typeof syncPurchaseOrderItemsContract
>;
