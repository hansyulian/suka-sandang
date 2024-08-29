import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const updateMaterialContract = apiContractSchema({
  method: "put",
  path: "/material/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    name: { type: "string", optional: true },
    code: { type: "string", optional: true },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
  },
  bodyType: "object",
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

export type UpdateMaterialContract = InferApiContract<
  typeof updateMaterialContract
>;
