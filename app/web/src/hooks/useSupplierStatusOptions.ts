import { SegmentedControlItem } from "@mantine/core";
import { useMemo } from "react";
import { supplierStatusLabels } from "~/config/constants";

export function useSupplierStatusOptions() {
  return useMemo<SegmentedControlItem[]>(() => {
    return [
      {
        label: supplierStatusLabels.draft,
        value: "draft",
      },
      {
        label: supplierStatusLabels.active,
        value: "active",
      },
      {
        label: supplierStatusLabels.blocked,
        value: "blocked",
      },
      {
        label: supplierStatusLabels.deleted,
        value: "deleted",
      },
    ];
  }, []);
}
