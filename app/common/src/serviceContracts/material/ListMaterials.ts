import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { paginationQuery } from "~/base";
import { modelBase } from "~/base/modelBase";

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
    ...modelBase,
    name: { type: "string" },
    code: { type: "string" },
    purchasePrice: { type: "number", optional: true },
    retailPrice: { type: "number", optional: true },
    status: { type: "enum", values: ["pending", "active", "inactive"] },
    color: { type: "string", optional: true },
  },
} as const);

export type ListMaterialsContract = InferApiContract<
  typeof listMaterialsContract
>;
