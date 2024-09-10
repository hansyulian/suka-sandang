import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base/simpleStatusResponse";

export const updateUserInfoContract = apiContractSchema({
  method: "put",
  path: "/session/me",
  params: {},
  body: {
    name: { type: "string" },
  },
  bodyType: "object",
  responseType: "object",
  model: {
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    status: {
      type: "string",
    },
  },
} as const);

export type UpdateUserInfoContract = InferApiContract<
  typeof updateUserInfoContract
>;
