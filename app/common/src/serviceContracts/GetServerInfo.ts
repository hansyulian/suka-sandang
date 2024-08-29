import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

export const getServerInfoContract = apiContractSchema({
  method: "get",
  path: "/",
  params: {},
  query: {},
  responseType: "object",
  model: {
    status: {
      type: "enum",
      values: ["normal"] as const,
    },
  },
});

export type GetServerInfoContract = InferApiContract<
  typeof getServerInfoContract
>;
