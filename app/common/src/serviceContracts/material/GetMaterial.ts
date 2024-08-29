import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getMaterialContract = apiContractSchema({
  method: "get",
  path: "/material/{id}",
  params: {
    id: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    id: { type: "string" },
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    createdAt: { type: "dateString" },
    updatedAt: { type: "dateString" },
    deletedAt: { type: "dateString" },
  },
});

export type GetMaterialContract = InferApiContract<typeof getMaterialContract>;
