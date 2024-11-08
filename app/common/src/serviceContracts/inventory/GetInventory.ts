import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  inventoryFields,
  inventoryFlowFields,
  materialFields,
  purchaseOrderFields,
  purchaseOrderItemFields,
} from "~/types";

export const getInventoryContract = apiContractSchema({
  method: "get",
  path: "/inventory/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...inventoryFields,
    material: {
      type: "object",
      spec: {
        ...modelBase,
        ...materialFields,
      },
    },
    inventoryFlows: {
      type: "objects",
      spec: {
        ...modelBase,
        ...inventoryFlowFields,
        purchaseOrderItem: {
          type: "object",
          optional: true,
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
        },
      },
      defaultValue: [],
    },
  },
} as const);

export type GetInventoryContract = InferApiContract<
  typeof getInventoryContract
>;
