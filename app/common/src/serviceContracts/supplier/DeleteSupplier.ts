import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteSupplierContract = apiContractSchema({
  method: "delete",
  path: "/supplier/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteSupplierContract = InferApiContract<
  typeof deleteSupplierContract
>;
