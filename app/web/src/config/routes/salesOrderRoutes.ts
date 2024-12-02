import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const salesOrderRoutes = lockRoutes({
  salesOrderList: {
    path: "/sales-order",
    element: lazy(() => import("~/pages/SalesOrder/SalesOrderListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
  salesOrderAdd: {
    path: "/sales-order/add",
    element: lazy(() => import("~/pages/SalesOrder/SalesOrderPage")),
  },
  salesOrderEdit: {
    path: "/sales-order/:idOrCode",
    element: lazy(() => import("~/pages/SalesOrder/SalesOrderPage")),
  },
} as const);
