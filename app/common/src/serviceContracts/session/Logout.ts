import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base";

export const logoutContract = apiContractSchema({
  method: "post",
  path: "/session/logout",
  params: {},
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type LogoutContract = InferApiContract<typeof logoutContract>;
