import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierFields } from "~/types";

export const updateSupplierContract = apiContractSchema({
  method: "put",
  path: "/supplier/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...supplierFields,
    name: { type: "string", optional: true },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...supplierFields,
  },
} as const);

export type UpdateSupplierContract = InferApiContract<
  typeof updateSupplierContract
>;
