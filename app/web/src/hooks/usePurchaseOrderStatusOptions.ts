import { SegmentedControlItem } from "@mantine/core";
import { useMemo } from "react";
import { purchaseOrderStatusLabels } from "~/config/constants";

export function usePurchaseOrderStatusOptions() {
  return useMemo<SegmentedControlItem[]>(() => {
    return [
      {
        label: purchaseOrderStatusLabels.draft,
        value: "draft",
      },
      {
        label: purchaseOrderStatusLabels.processing,
        value: "processing",
      },
      {
        label: purchaseOrderStatusLabels.completed,
        value: "completed",
      },
      {
        label: purchaseOrderStatusLabels.cancelled,
        value: "cancelled",
      },
      {
        label: purchaseOrderStatusLabels.deleted,
        value: "deleted",
      },
    ];
  }, []);
}
