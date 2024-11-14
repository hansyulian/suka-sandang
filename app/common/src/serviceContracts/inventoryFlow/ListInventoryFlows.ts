import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { queryParameters } from "~/base";
import { modelBase } from "~/base/modelBase";
import {
  inventoryFlowFields,
  purchaseOrderFields,
  purchaseOrderItemFields,
} from "~/types";

export const listInventoryFlowsContract = apiContractSchema({
  method: "get",
  path: "/inventory-flow",
  params: {},
  query: {
    inventoryId: {
      type: "string",
      optional: true,
    },
    ...queryParameters,
  },
  responseType: "paginatedArray",
  model: {
    ...modelBase,
    ...inventoryFlowFields,
    purchaseOrderItem: {
      type: "object",
      spec: {
        ...modelBase,
        ...purchaseOrderItemFields,
        purchaseOrder: {
          type: "object",
          spec: {
            ...modelBase,
            ...purchaseOrderFields,
          },
        },
      },
      optional: true,
    },
  },
} as const);

export type ListInventoryFlowsContract = InferApiContract<
  typeof listInventoryFlowsContract
>;
