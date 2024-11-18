import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const customerRoutes = lockRoutes({
  customerList: {
    path: "/customer",
    element: lazy(() => import("~/pages/Customer/CustomerListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
  customerAdd: {
    path: "/customer/add",
    element: lazy(() => import("~/pages/Customer/CustomerPage")),
  },
  customerEdit: {
    path: "/customer/:id",
    element: lazy(() => import("~/pages/Customer/CustomerPage")),
  },
} as const);
