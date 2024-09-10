import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialStatus } from "~/types";

export const createMaterialContract = apiContractSchema({
  method: "post",
  path: "/material",
  responseType: "object",
  params: {},
  body: {
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    color: { type: "string", optional: true },
    status: {
      type: "enum",
      optional: true,
      values: materialStatus,
    },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    name: { type: "string" },
    code: { type: "string" },
    color: { type: "string", optional: true },
    status: { type: "enum", values: materialStatus },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
  },
} as const);

export type CreateMaterialContract = InferApiContract<
  typeof createMaterialContract
>;
