import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderFields } from "~/types";

export const listPurchaseOrdersContract = apiContractSchema({
  method: "get",
  path: "/purchase-order",
  params: {},
  query: {
    name: {
      type: "string",
      optional: true,
    },
    code: {
      type: "string",
      optional: true,
    },
    search: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...purchaseOrderFields,
  },
} as const);

export type ListPurchaseOrdersContract = InferApiContract<
  typeof listPurchaseOrdersContract
>;
