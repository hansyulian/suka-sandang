import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const customerRoutes = lockRoutes({
  customer: {
    path: "/customer/:param?",
    element: lazy(() => import("~/pages/Customer/CustomerListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
} as const);
