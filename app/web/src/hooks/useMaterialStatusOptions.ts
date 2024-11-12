import { MaterialStatus } from "@app/common";
import { useMemo } from "react";
import { materialStatusLabels } from "~/config/constants";

export function useMaterialStatusOptions() {
  return useMemo<SelectionOption<MaterialStatus>[]>(() => {
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
