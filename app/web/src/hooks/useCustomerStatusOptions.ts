import { SegmentedControlItem } from "@mantine/core";
import { useMemo } from "react";
import { customerStatusLabels } from "~/config/constants";

export function useCustomerStatusOptions() {
  return useMemo<SegmentedControlItem[]>(() => {
    return [
      {
        label: customerStatusLabels.draft,
        value: "draft",
      },
      {
        label: customerStatusLabels.active,
        value: "active",
      },
      {
        label: customerStatusLabels.blocked,
        value: "blocked",
      },
      {
        label: customerStatusLabels.deleted,
        value: "deleted",
      },
    ];
  }, []);
}
