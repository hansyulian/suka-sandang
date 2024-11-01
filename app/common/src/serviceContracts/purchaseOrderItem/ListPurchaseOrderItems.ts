import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderItemFields } from "~/types";

export const listPurchaseOrderItemsContract = apiContractSchema({
  method: "get",
  path: "/purchase-order-item",
  params: {},
  query: {
    purchaseOrderId: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...purchaseOrderItemFields,
  },
} as const);

export type ListPurchaseOrderItemsContract = InferApiContract<
  typeof listPurchaseOrderItemsContract
>;
