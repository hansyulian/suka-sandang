import { SegmentedControlItem } from "@mantine/core";
import { useMemo } from "react";
import { materialStatusLabels } from "~/config/constants";

export function useMaterialStatusOptions() {
  return useMemo<SegmentedControlItem[]>(() => {
    return [
      {
        label: materialStatusLabels.draft,
        value: "draft",
      },
      {
        label: materialStatusLabels.active,
        value: "active",
      },
      {
        label: materialStatusLabels.deleted,
        value: "deleted",
      },
    ];
  }, []);
}
