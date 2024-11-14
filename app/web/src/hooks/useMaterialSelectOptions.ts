import { ContractResponseModel } from "@hyulian/react-api-contract";
import { useMemo } from "react";
import { getMaterialOptionsApi } from "~/config/api/materialApi";

export function useMaterialSelectOptions(
  labelKey: "name" | "code" | "name-code"
) {
  const { data } = getMaterialOptionsApi.useRequest({}, {});

  return useMemo<
    SelectionOption<
      string,
      ContractResponseModel<typeof getMaterialOptionsApi>
    >[]
  >(() => {
    if (!data) {
      return [];
    }
    return data.records.map((record) => {
      const label =
        labelKey === "name-code"
          ? `${record.name} - ${record.code}`
          : record[labelKey];
      return {
        label,
        value: record.id,
        data: record,
      };
    });
  }, [data, labelKey]);
}
