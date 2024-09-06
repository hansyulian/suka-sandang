import { redirect } from "@tanstack/react-router";

export function routeCheckUnauthenticated(context: AppRouteContext) {
  if (context.authenticatedUser) {
    throw redirect({
      to: "/",
    });
  }
}
