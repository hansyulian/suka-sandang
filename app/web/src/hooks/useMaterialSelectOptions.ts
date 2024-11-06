import { useMemo } from "react";
import { getMaterialOptionsApi } from "~/config/api/materialApi";

export function useMaterialSelectOptions(labelKey: "name" | "code") {
  const { data } = getMaterialOptionsApi.useRequest({}, {});

  return useMemo(() => {
    if (!data) {
      return [];
    }
    return data.records.map((record) => ({
      label: record[labelKey],
      value: record.id,
    }));
  }, [data, labelKey]);
}
