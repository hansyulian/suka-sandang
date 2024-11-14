import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialFields, materialStatus } from "~/types";

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
    status: { type: "enum", optional: true, values: materialStatus },
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
