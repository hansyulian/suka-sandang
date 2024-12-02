import { ActionIcon, ActionIconProps } from "@mantine/core";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Icon, IconNames } from "~/components/Icon";
import { RouteNames, LinkConfig } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type AppLinkIconProps<RouteName extends RouteNames> =
  LinkConfig<RouteName> & {
    name: IconNames;
    variant?: ActionIconProps["variant"];
  } & Omit<NavLinkProps, "to">;

export function AppLinkIcon<RouteName extends RouteNames>(
  props: AppLinkIconProps<RouteName>
) {
  const { name, variant, target, params, query } = props;
  const { path } = useRoute(target);

  return (
    <ActionIcon component={NavLink} variant={variant} to={path(params, query)}>
      <Icon name={name} width="70%" />
    </ActionIcon>
  );
}
