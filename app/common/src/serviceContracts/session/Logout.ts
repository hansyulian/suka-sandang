import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/common";

export const logoutContract = apiContractSchema({
  method: "post",
  path: "/session/logout",
  params: {},
  body: {},
  bodyType: "object",
  ...simpleStatusResponse,
});

export type LogoutContract = InferApiContract<typeof logoutContract>;
