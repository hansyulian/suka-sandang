import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  salesOrderFields,
  salesOrderCreateFields,
  salesOrderItemSyncFields,
} from "~/types";

export const createSalesOrderContract = apiContractSchema({
  method: "post",
  path: "/sales-order",
  responseType: "object",
  params: {},
  body: {
    ...salesOrderCreateFields,
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

export type CreateSalesOrderContract = InferApiContract<
  typeof createSalesOrderContract
>;
