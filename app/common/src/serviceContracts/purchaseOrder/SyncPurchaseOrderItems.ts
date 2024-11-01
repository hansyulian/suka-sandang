import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderFields, purchaseOrderItemSyncFields } from "~/types";

export const syncPurchaseOrderItemsContract = apiContractSchema({
  method: "post",
  path: "/purchase-order/{id}/sync-items",
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
  ...simpleStatusResponse,
} as const);

export type SyncPurchaseOrderItemContract = InferApiContract<
  typeof syncPurchaseOrderItemsContract
>;
