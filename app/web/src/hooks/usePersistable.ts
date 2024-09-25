import { useEffect, useState } from "react";

export function usePersistable<T>(data: T | undefined) {
  const [value, setValue] = useState<T | undefined>(data);

  useEffect(() => {
    if (data) {
      setValue(data);
    }
  }, [data]);

  return value;
}
