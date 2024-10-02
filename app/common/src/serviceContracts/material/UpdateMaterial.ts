import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialFields } from "~/types";

export const updateMaterialContract = apiContractSchema({
  method: "put",
  path: "/material/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...materialFields,
    name: { type: "string", optional: true },
    code: { type: "string", optional: true },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...materialFields,
  },
} as const);

export type UpdateMaterialContract = InferApiContract<
  typeof updateMaterialContract
>;
