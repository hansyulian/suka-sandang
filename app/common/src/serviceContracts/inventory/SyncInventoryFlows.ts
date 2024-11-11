import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { simpleStatusResponse } from "~/base";
import { inventoryFlowSyncFields } from "~/types";

export const syncInventoryFlowsContract = apiContractSchema({
  method: "post",
  path: "/inventory/{id}/sync-flows",
  params: {
    id: { type: "string" },
  },
  body: {
    items: {
      type: "objects",
      spec: {
        ...inventoryFlowSyncFields,
      },
    },
  },
  bodyType: "object",
  ...simpleStatusResponse,
} as const);

export type SyncInventoryFlowContract = InferApiContract<
  typeof syncInventoryFlowsContract
>;
