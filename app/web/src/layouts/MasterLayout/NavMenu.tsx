import { Link } from "react-router-dom";
import { NavLink, NavLinkProps } from "@mantine/core";
import { InferParams, RouteKeys } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type NavMenuProps<RouteKey extends RouteKeys> = {
  target: RouteKey;
  params: InferParams<RouteKey>;
} & NavLinkProps;

export const NavMenu = <RouteKey extends RouteKeys>(
  props: NavMenuProps<RouteKey>
) => {
  const { target, params, ...rest } = props;
  const { path } = useRoute(target);

  return <NavLink component={Link} to={path(params)} {...rest} />;
};
