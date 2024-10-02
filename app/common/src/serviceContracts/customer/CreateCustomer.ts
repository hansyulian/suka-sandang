import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import { customerFields } from "~/types";

export const createCustomerContract = apiContractSchema({
  method: "post",
  path: "/customer",
  responseType: "object",
  params: {},
  body: customerFields,
  bodyType: "object",
  model: {
    ...modelBase,
    ...customerFields,
  },
} as const);

export type CreateCustomerContract = InferApiContract<
  typeof createCustomerContract
>;
