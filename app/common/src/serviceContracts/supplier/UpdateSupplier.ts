import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierStatus } from "~/types";

export const updateSupplierContract = apiContractSchema({
  method: "put",
  path: "/supplier/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    name: { type: "string", optional: true },
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
  bodyType: "object",
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

export type UpdateSupplierContract = InferApiContract<
  typeof updateSupplierContract
>;
