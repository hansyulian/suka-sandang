import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { salesOrderItemFields, salesOrderItemUpdateFields } from "~/types";

export const updateSalesOrderItemContract = apiContractSchema({
  method: "put",
  path: "/sales-order-item/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...salesOrderItemUpdateFields,
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...salesOrderItemFields,
  },
} as const);

export type UpdateSalesOrderItemContract = InferApiContract<
  typeof updateSalesOrderItemContract
>;
