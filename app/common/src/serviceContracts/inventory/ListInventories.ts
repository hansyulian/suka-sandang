import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { inventoryFields, materialFields } from "~/types";

export const listInventoriesContract = apiContractSchema({
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
    material: {
      type: "object",
      spec: {
        ...modelBase,
        ...materialFields,
      },
    },
  },
} as const);

export type ListInventoriesContract = InferApiContract<
  typeof listInventoriesContract
>;
