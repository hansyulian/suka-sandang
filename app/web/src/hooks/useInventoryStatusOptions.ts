import { InventoryStatus } from "@app/common";
import { useMemo } from "react";
import { inventoryStatusLabels } from "~/config/constants";

export function useInventoryStatusOptions() {
  return useMemo<SelectionOption<InventoryStatus>[]>(() => {
    return [
      {
        label: inventoryStatusLabels.active,
        value: "active",
      },
      {
        label: inventoryStatusLabels.finished,
        value: "finished",
      },
      {
        label: inventoryStatusLabels.deleted,
        value: "deleted",
      },
    ];
  }, []);
}
