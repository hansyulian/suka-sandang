/* eslint-disable @typescript-eslint/no-unused-vars */

import { LazyExoticComponent, ReactNode } from "react";

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
export function lockRoutes<
  Keys extends string,
  TConstRoutes extends ConstRoutes<Keys>
>(routes: TConstRoutes) {
  return routes;
}
export type ExtractRouteParams<T extends string> =
  // If T contains a segment with a parameter (e.g., ':id') and more segments after it
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? // Extract the parameter from the segment and recursively extract params from the rest
      { [K in Param | keyof ExtractRouteParams<Rest>]: string }
    : // If T contains only a single segment with a parameter (e.g., ':id')
    T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : // If T contains no parameters
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};
