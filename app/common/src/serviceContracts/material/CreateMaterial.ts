import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialFields } from "~/types";

export const createMaterialContract = apiContractSchema({
  method: "post",
  path: "/material",
  responseType: "object",
  params: {},
  body: materialFields,
  bodyType: "object",
  model: {
    ...modelBase,
    ...materialFields,
  },
} as const);

export type CreateMaterialContract = InferApiContract<
  typeof createMaterialContract
>;
