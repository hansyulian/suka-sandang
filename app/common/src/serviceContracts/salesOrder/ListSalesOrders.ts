import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { salesOrderFields, customerFields } from "~/types";

export const listSalesOrdersContract = apiContractSchema({
  method: "get",
  path: "/sales-order",
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
    ...salesOrderFields,
    customer: {
      type: "object",
      spec: {
        ...modelBase,
        ...customerFields,
      },
    },
  },
} as const);

export type ListSalesOrdersContract = InferApiContract<
  typeof listSalesOrdersContract
>;
