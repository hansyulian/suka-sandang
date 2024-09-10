import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { materialStatus } from "~/types";

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
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    color: { type: "string", optional: true },
    status: { type: "enum", values: materialStatus },
  },
} as const);

export type GetMaterialContract = InferApiContract<typeof getMaterialContract>;
