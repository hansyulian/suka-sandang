import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const supplierRoutes = lockRoutes({
  supplier: {
    path: "/supplier/:param?",
    element: lazy(() => import("~/pages/Supplier/SupplierListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
} as const);
