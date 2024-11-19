import { useMemo } from "react";
import { getCustomerOptionsApi } from "~/config/api/customerApi";

export function useCustomerSelectOptions() {
  const { data } = getCustomerOptionsApi.useRequest({}, {});

  return useMemo(() => {
    if (!data) {
      return [];
    }
    return data.records.map((record) => ({
      label: record.name,
      value: record.id,
    }));
  }, [data]);
}
