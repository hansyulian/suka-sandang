/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { lazy, LazyExoticComponent, ReactNode } from "react";
import { customerRoutes } from "~/config/routes/customerRoutes";
import { inventoryRoutes } from "~/config/routes/inventoryRoutes";
import { materialRoutes } from "~/config/routes/materialRoutes";
import { purchaseOrderRoutes } from "~/config/routes/purchaseOrderRoutes";
import { sessionRoutes } from "~/config/routes/sessionRoutes";
import { supplierRoutes } from "~/config/routes/supplierRoutes";

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
  ...sessionRoutes,
  ...materialRoutes,
  ...supplierRoutes,
  ...customerRoutes,
  ...purchaseOrderRoutes,
  ...inventoryRoutes,
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
