import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getSupplierOptionsContract = apiContractSchema({
  method: "get",
  path: "/supplier/options",
  params: {},
  query: {},
  responseType: "array",
  model: {
    id: { type: "string" },
    name: { type: "string" },
  },
} as const);

export type GetSupplierOptionsContract = InferApiContract<
  typeof getSupplierOptionsContract
>;
