import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteSalesOrderContract = apiContractSchema({
  method: "delete",
  path: "/sales-order/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteSalesOrderContract = InferApiContract<
  typeof deleteSalesOrderContract
>;
