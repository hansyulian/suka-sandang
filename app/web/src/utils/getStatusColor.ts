import { DefaultMantineColor } from "@mantine/core";

export function getStatusColor(
  status: string
): DefaultMantineColor | undefined {
  switch (status) {
    case "draft":
    case "cancelled":
      return "gray";
    case "processing":
      return "blue";
    case "active":
    case "completed":
      return "green";
    case "deleted":
    case "blocked":
      return "red";
    default:
      return undefined;
  }
}
