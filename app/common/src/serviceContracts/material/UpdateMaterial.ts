import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialStatus } from "~/types";

export const updateMaterialContract = apiContractSchema({
  method: "put",
  path: "/material/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    color: { type: "string", optional: true },
    status: {
      type: "enum",
      values: materialStatus,
    },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    status: { type: "enum", values: materialStatus },
  },
} as const);

export type UpdateMaterialContract = InferApiContract<
  typeof updateMaterialContract
>;
