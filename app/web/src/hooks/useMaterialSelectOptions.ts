import { useMemo } from "react";
import { Api } from "~/config/api";

export function useMaterialSelectOptions(labelKey: "name" | "code") {
  const { data } = Api.material.getMaterialOptions.useRequest({}, {});

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
