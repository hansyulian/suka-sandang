import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";

export const listEnumsContract = apiContractSchema({
  method: "get",
  path: "/enum",
  params: {},
  query: {},
  responseType: "array",
  model: {
    value: { type: "string" },
    group: { type: "string" },
    label: { type: "string" },
  },
} as const);

export type ListEnumsContract = InferApiContract<typeof listEnumsContract>;
