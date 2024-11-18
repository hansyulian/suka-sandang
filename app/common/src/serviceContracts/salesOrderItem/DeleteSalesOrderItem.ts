import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteSalesOrderItemContract = apiContractSchema({
  method: "delete",
  path: "/sales-order-item/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteSalesOrderItemContract = InferApiContract<
  typeof deleteSalesOrderItemContract
>;
