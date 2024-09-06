import {
  createRootRouteWithContext,
  createRouter,
} from "@tanstack/react-router";
import { indexRouter } from "~/routes/Index";
import { sessionRouter } from "~/routes/Session";

export const rootRoute = createRootRouteWithContext<AppRouteContext>()({});

export const getRootRoute = () => rootRoute;
const routeTree = rootRoute.addChildren([indexRouter(), sessionRouter()]);

export const router = createRouter({
  routeTree,
  context: {},
  defaultNotFoundComponent: () => <p>404 Not Found</p>,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
