import { redirect } from "@tanstack/react-router";

export function routeCheckAuthenticated(context: AppRouteContext) {
  if (!context.authenticatedUser) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  }
}
