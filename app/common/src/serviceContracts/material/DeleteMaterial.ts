import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/common/simpleStatusResponse";

export const deleteMaterialContract = apiContractSchema({
  method: "delete",
  path: "/material/{id}",
  params: {
    id: { type: "string" },
  },
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
});

export type DeleteMaterialContract = InferApiContract<
  typeof deleteMaterialContract
>;
