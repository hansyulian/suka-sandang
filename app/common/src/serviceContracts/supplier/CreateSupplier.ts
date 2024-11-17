import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierFields, supplierStatus } from "~/types";

export const createSupplierContract = apiContractSchema({
  method: "post",
  path: "/supplier",
  responseType: "object",
  params: {},
  body: {
    ...supplierFields,
    status: {
      type: "enum",
      values: supplierStatus,
      optional: true,
    },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...supplierFields,
  },
} as const);

export type CreateSupplierContract = InferApiContract<
  typeof createSupplierContract
>;
