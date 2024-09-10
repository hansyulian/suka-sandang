import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const deleteMaterialContract = apiContractSchema({
  method: "delete",
  path: "/material/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type DeleteMaterialContract = InferApiContract<
  typeof deleteMaterialContract
>;
