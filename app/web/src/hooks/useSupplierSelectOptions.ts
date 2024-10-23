import { useEffect, useState } from "react";
import { Api } from "~/config/api";
import { OptionData } from "~/types";

export function useSupplierSelectOptions() {
  const { data } = Api.supplier.getSupplierOptions.useRequest({}, {});
  const [options, setOptions] = useState<OptionData[]>([]);

  useEffect(() => {
    if (!data) {
      return setOptions([]);
    }
    setOptions(
      data.records.map((record) => ({
        label: record.name,
        value: record.id,
      }))
    );
  }, [data]);

  return options;
}
