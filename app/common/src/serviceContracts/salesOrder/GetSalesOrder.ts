import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  salesOrderFields,
  salesOrderItemFields,
  customerFields,
} from "~/types";

export const getSalesOrderContract = apiContractSchema({
  method: "get",
  path: "/sales-order/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...salesOrderFields,
    customer: {
      type: "object",
      spec: {
        ...modelBase,
        ...customerFields,
      },
    },
    salesOrderItems: {
      type: "objects",
      spec: { ...modelBase, ...salesOrderItemFields },
      defaultValue: [],
    },
  },
} as const);

export type GetSalesOrderContract = InferApiContract<
  typeof getSalesOrderContract
>;
