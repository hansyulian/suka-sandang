/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { lazy } from "react";
import {
  CustomRouteWithValidateSearch,
  ExtractRouteParams,
  lockRoutes,
} from "~/config/routes/baseRoute";
import { customerRoutes } from "~/config/routes/customerRoutes";
import { inventoryRoutes } from "~/config/routes/inventoryRoutes";
import { materialRoutes } from "~/config/routes/materialRoutes";
import { purchaseOrderRoutes } from "~/config/routes/purchaseOrderRoutes";
import { salesOrderRoutes } from "~/config/routes/salesOrderRoutes";
import { sessionRoutes } from "~/config/routes/sessionRoutes";
import { supplierRoutes } from "~/config/routes/supplierRoutes";

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
  ...salesOrderRoutes,
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

export type LinkConfig<RouteName extends RouteNames> = {
  target: RouteName;
  params: InferParams<RouteName>;
  query?: InferQuery<RouteName>;
};
