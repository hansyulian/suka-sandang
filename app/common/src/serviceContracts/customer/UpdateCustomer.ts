import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { customerFields, customerStatus } from "~/types";

export const updateCustomerContract = apiContractSchema({
  method: "put",
  path: "/customer/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...customerFields,
    name: { type: "string", optional: true },
    status: {
      type: "enum",
      values: customerStatus,
      optional: true,
    },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...customerFields,
  },
} as const);

export type UpdateCustomerContract = InferApiContract<
  typeof updateCustomerContract
>;
