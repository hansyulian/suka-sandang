import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { customerFields, customerStatus } from "~/types";

export const createCustomerContract = apiContractSchema({
  method: "post",
  path: "/customer",
  responseType: "object",
  params: {},
  body: {
    ...customerFields,
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

export type CreateCustomerContract = InferApiContract<
  typeof createCustomerContract
>;
