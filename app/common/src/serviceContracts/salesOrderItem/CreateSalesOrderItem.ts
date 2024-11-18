import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { salesOrderItemFields, salesOrderItemCreateFields } from "~/types";

export const createSalesOrderItemContract = apiContractSchema({
  method: "post",
  path: "/sales-order-item",
  responseType: "object",
  params: {},
  body: {
    ...salesOrderItemCreateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...salesOrderItemFields,
  },
} as const);

export type CreateSalesOrderItemContract = InferApiContract<
  typeof createSalesOrderItemContract
>;
