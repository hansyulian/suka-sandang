import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import { supplierStatus } from "~/types";

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
    name: { type: "string" },
    email: { type: "string", optional: true },
    address: { type: "string", optional: true },
    phone: { type: "string", optional: true },
    remarks: { type: "string", optional: true },
    status: {
      type: "enum",
      optional: true,
      values: supplierStatus,
    },
  },
} as const);

export type ListSuppliersContract = InferApiContract<
  typeof listSuppliersContract
>;
