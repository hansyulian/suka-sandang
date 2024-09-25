import { NavLink, NavLinkProps } from "react-router-dom";
import { RouteNames, InferParams, InferQuery } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type AppLinkProps<RouteName extends RouteNames> = {
  target: RouteName;
  params: InferParams<RouteName>;
  query?: InferQuery<RouteName>;
} & Omit<NavLinkProps, "to">;

export function AppLink<RouteName extends RouteNames>(
  props: AppLinkProps<RouteName>
) {
  const { target, params, query, ...rest } = props;
  const { path } = useRoute(target);

  return <NavLink {...rest} to={path(params, query)} />;
}
