import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { customerFields } from "~/types";

export const getCustomerContract = apiContractSchema({
  method: "get",
  path: "/customer/{id}",
  params: {
    id: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...customerFields,
  },
} as const);

export type GetCustomerContract = InferApiContract<typeof getCustomerContract>;
