import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteCustomerContract = apiContractSchema({
  method: "delete",
  path: "/customer/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteCustomerContract = InferApiContract<
  typeof deleteCustomerContract
>;
