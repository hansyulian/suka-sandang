import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getInventoryOptionsContract = apiContractSchema({
  method: "get",
  path: "/inventory/options",
  params: {},
  query: {},
  responseType: "array",
  model: {
    id: { type: "string" },
    code: { type: "string" },
    total: { type: "number" },
    material: {
      type: "object",
      spec: {
        id: { type: "string" },
        name: { type: "string" },
        code: { type: "string" },
        color: { type: "string" },
        retailPrice: { type: "number", optional: true },
        purchasePrice: { type: "number", optional: true },
      },
    },
  },
} as const);

export type GetInventoryOptionsContract = InferApiContract<
  typeof getInventoryOptionsContract
>;
