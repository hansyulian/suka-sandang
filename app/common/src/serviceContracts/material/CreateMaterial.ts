import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

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

export type CreateMaterialContract = InferApiContract<
  typeof createMaterialContract
>;
