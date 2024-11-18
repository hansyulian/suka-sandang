import { lazy } from "react";
import { lockRoutes } from "~/config/routes/baseRoute";

export const sessionRoutes = lockRoutes({
  login: {
    path: "/login",
    element: lazy(() => import("~/pages/Session/LoginPage")),
    validateQuery: (query) => {
      return {
        redirect: query.redirect as string,
      };
    },
  },
} as const);
