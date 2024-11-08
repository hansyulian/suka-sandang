import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { inventoryFields, supplierFields } from "~/types";

export const listInventorysContract = apiContractSchema({
  method: "get",
  path: "/inventory",
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
    search: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...inventoryFields,
    supplier: {
      type: "object",
      spec: {
        ...modelBase,
        ...supplierFields,
      },
    },
  },
} as const);

export type ListInventorysContract = InferApiContract<
  typeof listInventorysContract
>;
