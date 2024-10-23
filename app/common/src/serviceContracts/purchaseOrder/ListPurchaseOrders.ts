import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { purchaseOrderFields, supplierFields } from "~/types";

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
    supplier: {
      type: "object",
      spec: {
        ...modelBase,
        ...supplierFields,
      },
    },
  },
} as const);

export type ListPurchaseOrdersContract = InferApiContract<
  typeof listPurchaseOrdersContract
>;
