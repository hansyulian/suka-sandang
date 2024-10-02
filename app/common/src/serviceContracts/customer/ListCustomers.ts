import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { customerFields } from "~/types";

export const listCustomersContract = apiContractSchema({
  method: "get",
  path: "/customer",
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
    ...customerFields,
  },
} as const);

export type ListCustomersContract = InferApiContract<
  typeof listCustomersContract
>;
