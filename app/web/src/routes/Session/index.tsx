import { createRoute } from "@tanstack/react-router";
import { getRootRoute } from "~/config/router";
import { SessionLayout } from "~/layouts/SessionLayout";
import { LoginPage } from "~/routes/Session/LoginPage";
import { routeCheckUnauthenticated } from "~/utils/routeCheckUnauthenticated";

export function sessionRouter() {
  const route = createRoute({
    getParentRoute: getRootRoute,
    id: "session",
    component: SessionLayout,
    beforeLoad: ({ context }) => {
      routeCheckUnauthenticated(context);
    },
  });
  const getParentRoute = () => route;
  const routes = {
    index: createRoute({
      getParentRoute,
      validateSearch: (search: Record<string, unknown>) => {
        return {
          redirect: (search.redirect as string) || "",
        };
      },
      path: "/login",
      component: LoginPage,
    }),
  };
  return route.addChildren([routes.index]);
}
