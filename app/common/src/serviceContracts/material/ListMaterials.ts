import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { paginationQuery } from "~/common";

export const listMaterialsContract = apiContractSchema({
  method: "get",
  path: "/material",
  params: {},
  query: {
    name: {
      type: "string",
      optional: true,
    },
    code: {
      type: "string",
      optional: true,
    },
    ...paginationQuery,
  },
  responseType: "paginatedArray",
  model: {
    id: { type: "string" },
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    status: { type: "enum", values: ["pending", "active", "inactive"] },
    createdAt: { type: "dateString" },
    updatedAt: { type: "dateString" },
    deletedAt: { type: "dateString" },
  },
});

export type ListMaterialsContract = InferApiContract<
  typeof listMaterialsContract
>;
