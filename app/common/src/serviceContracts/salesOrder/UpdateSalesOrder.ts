import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  salesOrderFields,
  salesOrderItemSyncFields,
  salesOrderUpdateFields,
} from "~/types";

export const updateSalesOrderContract = apiContractSchema({
  method: "put",
  path: "/sales-order/{id}",
  responseType: "object",
  params: {
    id: { type: "string" },
  },
  body: {
    ...salesOrderUpdateFields,
    items: {
      type: "objects",
      optional: true,
      spec: {
        ...salesOrderItemSyncFields,
      },
    },
  },
  bodyType: "object",
  model: {
    ...modelBase,
    ...salesOrderFields,
  },
} as const);

export type UpdateSalesOrderContract = InferApiContract<
  typeof updateSalesOrderContract
>;
