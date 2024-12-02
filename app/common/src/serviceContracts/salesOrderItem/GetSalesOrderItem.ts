import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { salesOrderItemFields } from "~/types";

export const getSalesOrderItemContract = apiContractSchema({
  method: "get",
  path: "/sales-order-item/{id}",
  params: {
    id: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...salesOrderItemFields,
  },
} as const);

export type GetSalesOrderItemContract = InferApiContract<
  typeof getSalesOrderItemContract
>;
