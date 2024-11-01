import { Badge, BadgeProps } from "@mantine/core";
import { getStatusColor } from "~/utils/getStatusColor";

export type StatusBadgeProps = {
  status: string;
} & BadgeProps;

export function StatusBadge(props: StatusBadgeProps) {
  const { status, children, ...rest } = props;
  return (
    <Badge color={getStatusColor(status)} tt="uppercase" {...rest}>
      {children || status}
    </Badge>
  );
}
