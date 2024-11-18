import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export const inventoryRoutes = lockRoutes({
  inventoryList: {
    path: "/inventory",
    element: lazy(() => import("~/pages/Inventory/InventoryListPage")),
    validateQuery: (query) => {
      return {
        search: query.search as string,
        ...extractPaginationQuery(query),
      };
    },
  },
  inventoryAdd: {
    path: "/inventory/add",
    element: lazy(() => import("~/pages/Inventory/InventoryPage")),
  },
  inventoryEdit: {
    path: "/inventory/:idOrCode",
    element: lazy(() => import("~/pages/Inventory/InventoryPage")),
  },
} as const);
