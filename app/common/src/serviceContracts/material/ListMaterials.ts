import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { materialFields } from "~/types";

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
    search: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...materialFields,
  },
} as const);

export type ListMaterialsContract = InferApiContract<
  typeof listMaterialsContract
>;
