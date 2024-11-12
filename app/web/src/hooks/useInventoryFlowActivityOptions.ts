import { useMemo } from "react";
import { inventoryFlowActivityLabels } from "~/config/constants";

export function useInventoryFlowActivityOptions() {
  return useMemo<SelectionOption[]>(() => {
    return [
      {
        label: inventoryFlowActivityLabels.adjustment,
        value: "adjustment",
      },
      {
        label: inventoryFlowActivityLabels.return,
        value: "return",
      },
    ];
  }, []);
}
