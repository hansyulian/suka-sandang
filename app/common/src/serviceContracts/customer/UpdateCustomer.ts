import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { customerFields } from "~/types";

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
