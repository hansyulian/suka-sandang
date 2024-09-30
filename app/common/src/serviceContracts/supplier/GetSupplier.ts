import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierStatus } from "~/types";

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

export type GetSupplierContract = InferApiContract<typeof getSupplierContract>;
