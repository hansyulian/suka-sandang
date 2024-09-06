import { createRoute } from "@tanstack/react-router";
import { getRootRoute } from "~/config/router";
import { LandingPage } from "~/routes/Index/LandingPage";
import { routeCheckAuthenticated } from "~/utils";

export function indexRouter() {
  const route = createRoute({
    getParentRoute: getRootRoute,
    beforeLoad: ({ context }) => {
      routeCheckAuthenticated(context);
    },
    id: "landing",
  });
  const getParentRoute = () => route;
  const routes = {
    index: createRoute({
      getParentRoute,
      path: "/",
      component: LandingPage,
    }),
  };
  return route.addChildren([routes.index]);
}
