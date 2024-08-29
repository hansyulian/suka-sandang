import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getUserInfoContract = apiContractSchema({
  method: "get",
  path: "/session/me",
  params: {},
  query: {},
  responseType: "object",
  model: {
    name: { type: "string" },
    email: { type: "string" },
    status: { type: "string" },
  },
});

export type GetUserInfoContract = InferApiContract<typeof getUserInfoContract>;
