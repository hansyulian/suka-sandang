import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getCustomerOptionsContract = apiContractSchema({
  method: "get",
  path: "/customer/options",
  params: {},
  query: {},
  responseType: "array",
  model: {
    id: { type: "string" },
    name: { type: "string" },
  },
} as const);

export type GetCustomerOptionsContract = InferApiContract<
  typeof getCustomerOptionsContract
>;
