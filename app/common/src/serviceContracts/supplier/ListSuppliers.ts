import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { supplierFields } from "~/types";

export const listSuppliersContract = apiContractSchema({
  method: "get",
  path: "/supplier",
  params: {},
  query: {
    search: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...supplierFields,
  },
} as const);

export type ListSuppliersContract = InferApiContract<
  typeof listSuppliersContract
>;
