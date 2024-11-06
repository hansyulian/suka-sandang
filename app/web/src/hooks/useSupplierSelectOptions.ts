import { useMemo } from "react";
import { getSupplierOptionsApi } from "~/config/api/supplierApi";

export function useSupplierSelectOptions() {
  const { data } = getSupplierOptionsApi.useRequest({}, {});

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
