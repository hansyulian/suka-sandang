import { useMemo } from "react";
import { Api } from "~/config/api";

export function useSupplierSelectOptions() {
  const { data } = Api.supplier.getSupplierOptions.useRequest({}, {});

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
