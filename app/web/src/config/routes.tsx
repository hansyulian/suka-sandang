/* eslint-disable @typescript-eslint/no-unused-vars */

import { lazy, LazyExoticComponent, ReactNode } from "react";

export type CustomRouteWithValidateSearch = {
  path: string;
  element: LazyExoticComponent<() => ReactNode>;
  validateQuery: (
    search: Record<string, string>
  ) => Record<string, string | number | boolean>;
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
  TConstRoutes extends ConstRoutes<Keys>,
>(routes: TConstRoutes) {
  return routes;
}
type ExtractRouteParams<T extends string> =
  // Match each segment that starts with ':' and map it to a key-value pair with string type
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
    : T extends `${infer _Start}:${infer Param}`
      ? { [K in Param]: string }
      : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
        redirect: query.redirect,
      };
    },
  },
  materialList: {
    path: "/material",
    element: lazy(() => import("~/pages/Material/MaterialListPage")),
    validateQuery: (query) => {
      return {};
    },
  },
});
export type Routes = typeof routes;
export type RouteKeys = keyof typeof routes;

export type InferParams<RouteKey extends RouteKeys> = ExtractRouteParams<
  Routes[RouteKey]["path"]
>;

export type InferQuery<RouteKey extends RouteKeys> =
  Routes[RouteKey] extends CustomRouteWithValidateSearch
    ? Partial<ReturnType<Routes[RouteKey]["validateQuery"]>>
    : undefined;
