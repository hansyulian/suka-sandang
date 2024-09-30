import { ActionIcon } from "@mantine/core";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Icon, IconNames } from "~/components/Icon";
import { RouteNames, InferParams, InferQuery } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type AppLinkIconProps<RouteName extends RouteNames> = {
  target: RouteName;
  params: InferParams<RouteName>;
  query?: InferQuery<RouteName>;
  name: IconNames;
} & Omit<NavLinkProps, "to">;

export function AppLinkIcon<RouteName extends RouteNames>(
  props: AppLinkIconProps<RouteName>
) {
  const { name, target, params, query } = props;
  const { path } = useRoute(target);

  return (
    <ActionIcon component={NavLink} to={path(params, query)}>
      <Icon name={name} width="70%" />
    </ActionIcon>
  );
}