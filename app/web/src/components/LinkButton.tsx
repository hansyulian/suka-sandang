import { Button, ButtonProps } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { InferParams, InferQuery, RouteNames } from "~/config/routes";
import { useRoute } from "~/hooks/useRoute";

export type LinkButtonProps<RouteName extends RouteNames> = {
  target: RouteName;
  params: InferParams<RouteName>;
  query?: InferQuery<RouteName>;
} & ButtonProps;

export function LinkButton<RouteName extends RouteNames>(
  props: LinkButtonProps<RouteName>
) {
  const { target, params, query, ...rest } = props;
  const { path } = useRoute(target);

  return (
    <Button component={NavLink} to={path(params, query)} {...rest}></Button>
  );
}
