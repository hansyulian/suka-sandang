import { ContractResponseModel } from "@hyulian/react-api-contract";
import { useMemo } from "react";
import { getInventoryOptionsApi } from "~/config/api/inventoryApi";

export function useInventorySelectOptions(
  labelKey: "name-code" | "name" | "code"
) {
  const { data } = getInventoryOptionsApi.useRequest({}, {});

  return useMemo<
    SelectionOption<
      string,
      ContractResponseModel<typeof getInventoryOptionsApi>
    >[]
  >(() => {
    if (!data) {
      return [];
    }
    return data.records.map((record) => {
      let label = "-";
      switch (labelKey) {
        case "name-code":
          label = `${record.material.name} (${record.code})`;
          break;
        case "name":
          label = record.material.name;
          break;
        case "code":
          label = record.code;
      }
      return {
        label,
        value: record.id,
        data: record,
      };
    });
  }, [data, labelKey]);
}
