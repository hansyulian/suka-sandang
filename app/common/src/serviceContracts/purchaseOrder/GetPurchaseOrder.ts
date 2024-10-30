import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";
import { modelBase } from "~/base/modelBase";
import {
  purchaseOrderFields,
  purchaseOrderItemFields,
  supplierFields,
} from "~/types";

export const getPurchaseOrderContract = apiContractSchema({
  method: "get",
  path: "/purchase-order/{idOrCode}",
  params: {
    idOrCode: { type: "string" },
  },
  query: {},
  responseType: "object",
  model: {
    ...modelBase,
    ...purchaseOrderFields,
    supplier: {
      type: "object",
      spec: {
        ...modelBase,
        ...supplierFields,
      },
    },
    purchaseOrderItems: {
      type: "objects",
      spec: { ...modelBase, ...purchaseOrderItemFields },
      defaultValue: [],
    },
  },
} as const);

export type GetPurchaseOrderContract = InferApiContract<
  typeof getPurchaseOrderContract
>;
