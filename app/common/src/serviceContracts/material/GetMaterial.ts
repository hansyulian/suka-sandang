import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialFields } from "~/types";

export const getMaterialContract = apiContractSchema({
  method: "get",
  path: "/material/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...materialFields,
  },
} as const);

export type GetMaterialContract = InferApiContract<typeof getMaterialContract>;
