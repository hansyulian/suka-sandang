import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const supplierRoutes = lockRoutes({
  supplierList: {
    path: "/supplier",
    element: lazy(() => import("~/pages/Supplier/SupplierListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
  supplierAdd: {
    path: "/supplier/add",
    element: lazy(() => import("~/pages/Supplier/SupplierPage")),
  },
  supplierEdit: {
    path: "/supplier/:id",
    element: lazy(() => import("~/pages/Supplier/SupplierPage")),
  },
} as const);
