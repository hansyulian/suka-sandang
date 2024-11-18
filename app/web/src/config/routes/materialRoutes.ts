import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const materialRoutes = lockRoutes({
  materialList: {
    path: "/material",
    element: lazy(() => import("~/pages/Material/MaterialListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
  materialAdd: {
    path: "/material/add",
    element: lazy(() => import("~/pages/Material/MaterialPage")),
  },
  materialEdit: {
    path: "/material/:idOrCode",
    element: lazy(() => import("~/pages/Material/MaterialPage")),
  },
} as const);
