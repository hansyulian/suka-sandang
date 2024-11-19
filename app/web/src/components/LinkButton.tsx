import { Button, ButtonProps } from "@mantine/core";
import { AppLink, AppLinkProps } from "~/components/AppLink";
import { Icon, IconNames } from "~/components/Icon";
import { RouteNames } from "~/config/routes";

export type LinkButtonProps<RouteName extends RouteNames> = {
  target: RouteName;
  iconName?: IconNames;
} & ButtonProps &
  AppLinkProps<RouteName>;

export function LinkButton<RouteName extends RouteNames>(
  props: LinkButtonProps<RouteName>
) {
  const { target, iconName, ...rest } = props;

  return (
    <Button
      component={AppLink}
      target={target}
      leftSection={iconName ? <Icon name={iconName} /> : null}
      {...rest}
    />
  );
}
