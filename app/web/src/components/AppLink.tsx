import { NavLink, NavLinkProps } from "react-router-dom";
import { LinkConfig, RouteNames } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type AppLinkProps<RouteName extends RouteNames> = LinkConfig<RouteName> &
  Omit<NavLinkProps, "to">;

export function AppLink<RouteName extends RouteNames>(
  props: AppLinkProps<RouteName>
) {
  const { target, params, query, ...rest } = props;
  const { path } = useRoute(target);

  return <NavLink {...rest} to={path(params, query)} />;
}
