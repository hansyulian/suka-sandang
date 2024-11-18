import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const purchaseOrderRoutes = lockRoutes({
  purchaseOrderList: {
    path: "/purchase-order",
    element: lazy(() => import("~/pages/PurchaseOrder/PurchaseOrderListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
  purchaseOrderAdd: {
    path: "/purchase-order/add",
    element: lazy(() => import("~/pages/PurchaseOrder/PurchaseOrderPage")),
  },
  purchaseOrderEdit: {
    path: "/purchase-order/:idOrCode",
    element: lazy(() => import("~/pages/PurchaseOrder/PurchaseOrderPage")),
  },
} as const);
