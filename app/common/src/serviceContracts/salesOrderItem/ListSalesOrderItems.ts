import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { salesOrderItemFields } from "~/types";

export const listSalesOrderItemsContract = apiContractSchema({
  method: "get",
  path: "/sales-order-item",
  params: {},
  query: {
    salesOrderId: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...salesOrderItemFields,
  },
} as const);

export type ListSalesOrderItemsContract = InferApiContract<
  typeof listSalesOrderItemsContract
>;
