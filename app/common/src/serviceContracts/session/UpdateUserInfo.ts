import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/common/simpleStatusResponse";

export const updateUserInfoContract = apiContractSchema({
  method: "post",
  path: "/session/me",
  params: {},
  body: {
    name: { type: "string" },
  },
  bodyType: "object",
  ...simpleStatusResponse,
});

export type UpdateUserInfoContract = InferApiContract<
  typeof updateUserInfoContract
>;
