import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierFields } from "~/types";

export const createSupplierContract = apiContractSchema({
  method: "post",
  path: "/supplier",
  responseType: "object",
  params: {},
  body: supplierFields,
  bodyType: "object",
  model: {
    ...modelBase,
    ...supplierFields,
  },
} as const);

export type CreateSupplierContract = InferApiContract<
  typeof createSupplierContract
>;
