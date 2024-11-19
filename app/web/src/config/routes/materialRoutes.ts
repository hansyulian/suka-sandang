import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const materialRoutes = lockRoutes({
  material: {
    path: "/material/:param?",
    element: lazy(() => import("~/pages/Material/MaterialListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
} as const);
