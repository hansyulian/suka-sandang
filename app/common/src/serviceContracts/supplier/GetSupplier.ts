import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierFields } from "~/types";

export const getSupplierContract = apiContractSchema({
  method: "get",
  path: "/supplier/{id}",
  params: {
    id: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...supplierFields,
  },
} as const);

export type GetSupplierContract = InferApiContract<typeof getSupplierContract>;
