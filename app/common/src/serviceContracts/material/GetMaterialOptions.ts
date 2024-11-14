import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getMaterialOptionsContract = apiContractSchema({
  method: "get",
  path: "/material/options",
  params: {},
  query: {},
  responseType: "array",
  model: {
    id: { type: "string" },
    name: { type: "string" },
    code: { type: "string" },
    color: { type: "string" },
  },
} as const);

export type GetMaterialOptionsContract = InferApiContract<
  typeof getMaterialOptionsContract
>;
