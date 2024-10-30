import { DefaultMantineColor } from "@mantine/core";

export function getStatusColor(
  status: string
): DefaultMantineColor | undefined {
  switch (status) {
    case "draft":
      return "gray";
    case "active":
      return "green";
    case "deleted":
      return "red";
    case "blocked":
      return "red";
    default:
      return undefined;
  }
}
