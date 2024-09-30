import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { supplierStatus } from "~/types";

export const createSupplierContract = apiContractSchema({
  method: "post",
  path: "/supplier",
  responseType: "object",
  params: {},
  body: {
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

export type CreateSupplierContract = InferApiContract<
  typeof createSupplierContract
>;
