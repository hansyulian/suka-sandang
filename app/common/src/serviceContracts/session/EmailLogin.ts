import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const emailLoginContract = apiContractSchema({
  method: "post",
  path: "/session/login",
  responseType: "object",
  params: {},
  body: {
    email: { type: "string" },
    password: { type: "string" },
  },
  bodyType: "object",
  model: {
    sessionToken: { type: "string" },
  },
});

export type EmailLoginContract = InferApiContract<typeof emailLoginContract>;
