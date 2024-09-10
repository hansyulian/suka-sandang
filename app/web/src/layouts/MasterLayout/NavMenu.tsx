import { Link } from "react-router-dom";
import { NavLink, NavLinkProps } from "@mantine/core";
import { InferParams, RouteNames } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type NavMenuProps<RouteName extends RouteNames> = {
  target: RouteName;
  params: InferParams<RouteName>;
} & NavLinkProps;

export const NavMenu = <RouteName extends RouteNames>(
  props: NavMenuProps<RouteName>
) => {
  const { target, params, ...rest } = props;
  const { path } = useRoute(target);

  return <NavLink component={Link} to={path(params)} {...rest} />;
};
