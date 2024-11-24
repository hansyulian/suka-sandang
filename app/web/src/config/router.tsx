import { createBrowserRouter, RouteObject } from "react-router-dom";
import { RequireAuth } from "~/components/RequireAuth";
import { routes } from "~/config/routes";
import { CustomRoute } from "~/config/routes/baseRoute";
import { MasterLayout } from "~/layouts";
import { SessionLayout } from "~/layouts/SessionLayout";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRoutes(routes: CustomRoute[]): RouteObject[] {
  return routes.map((route) => ({
    path: route.path,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element: <route.element />,
  }));
}

export const router = createBrowserRouter([
  // public
  // require authentication
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MasterLayout />,
        children: mapRoutes([
          routes.landing,
          routes.material,
          routes.supplier,
          routes.customer,
          routes.purchaseOrderList,
          routes.purchaseOrderAdd,
          routes.purchaseOrderEdit,
          routes.salesOrderList,
          routes.salesOrderAdd,
          routes.salesOrderEdit,
          routes.inventoryList,
          routes.inventoryAdd,
          routes.inventoryEdit,
        ]),
      },
    ],
  },
  // session
  {
    element: <SessionLayout />,
    children: mapRoutes([routes.login]),
  },
]);
