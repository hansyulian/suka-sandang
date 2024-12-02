import { Group, Text } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { AppLink } from "~/components/AppLink";
import { ReadOnly } from "~/components/ReadOnly";
import { LinkConfig, RouteNames } from "~/config/routes";

export type PlainDisabledViewProps<RouteName extends RouteNames> =
  PropsWithChildren<{
    disabled?: boolean;
    plainDisabled?: boolean;
    label?: string;
    value?: string;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    link?: LinkConfig<RouteName>;
  }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PlainDisabledView<RouteName extends RouteNames = any>(
  props: PlainDisabledViewProps<RouteName>
) {
  const {
    disabled,
    children,
    value,
    label,
    leftSection,
    rightSection,
    plainDisabled,
    link,
  } = props;

  if (plainDisabled && disabled) {
    return (
      <ReadOnly label={label}>
        <Group align="center" preventGrowOverflow={false} wrap="nowrap">
          {leftSection}
          {link ? (
            <AppLink
              params={link.params}
              target={link.target}
              query={link.query}
            >
              <Text c="gray" truncate="end">
                {value}
              </Text>
            </AppLink>
          ) : (
            <Text c="gray" truncate="end">
              {value}
            </Text>
          )}
          {rightSection}
        </Group>
      </ReadOnly>
    );
  }

  return children;
}
