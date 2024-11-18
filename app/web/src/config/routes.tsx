/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { lazy, LazyExoticComponent, ReactNode } from "react";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

export type CustomRouteWithValidateSearch = {
  path: string;
  element: LazyExoticComponent<() => ReactNode>;
  validateQuery: (
    search: StringQuery // by right all search string params are optional
  ) => StringQuery;
};

export type CustomRouteWithoutValidateSearch = {
  path: string;
  element: LazyExoticComponent<() => ReactNode>;
};

export type CustomRoute =
  | CustomRouteWithValidateSearch
  | CustomRouteWithoutValidateSearch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstRoutes<Keys extends string> = Record<Keys, CustomRoute>;
function lockRoutes<
  Keys extends string,
  TConstRoutes extends ConstRoutes<Keys>
>(routes: TConstRoutes) {
  return routes;
}
type ExtractRouteParams<T extends string> =
  // If T contains a segment with a parameter and more segments after it
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? // Handle optional marker '?'
      Param extends `${infer Key}?`
      ? { [K in Key]?: string } & ExtractRouteParams<`/${Rest}`>
      : { [K in Param]: string } & ExtractRouteParams<`/${Rest}`>
    : // If T contains only a single segment with a parameter
    T extends `${infer _Start}:${infer Param}`
    ? // Handle optional marker '?'
      Param extends `${infer Key}?`
      ? { [K in Key]?: string }
      : { [K in Param]: string }
    : // If T contains no parameters
      // eslint-disable-next-line @typescript-eslint/no-empty-interface
      {};

export const routes = lockRoutes({
  landing: {
    path: "/",
    element: lazy(() => import("~/pages/Index/LandingPage")),
  },
  login: {
    path: "/login",
    element: lazy(() => import("~/pages/Session/LoginPage")),
    validateQuery: (query) => {
      return {
        redirect: query.redirect as string,
      };
    },
  },
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
export type Routes = typeof routes;
export type RouteNames = keyof typeof routes;

export type InferParams<RouteKey extends RouteNames> = ExtractRouteParams<
  Routes[RouteKey]["path"]
>;

export type InferQuery<RouteKey extends RouteNames> =
  Routes[RouteKey] extends CustomRouteWithValidateSearch
    ? Partial<ReturnType<Routes[RouteKey]["validateQuery"]>>
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};
