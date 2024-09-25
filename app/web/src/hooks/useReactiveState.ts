import { useEffect, useState } from "react";

// only used for some lazy shortcut for value that keep getting updated
// particularly in navigating history when using query string
// to make state such as search text always get refreshed when navigating back
// to make it clearer, try to compare it in MaterialListPage, change the useReactiveState of searchText to only useState
// then make a query then enter, then trigger browser's back, you will see that in useState, the search bar will not be updated correctly
export function useReactiveState<T extends string | number | boolean>(
  initialState: T
) {
  const [value, setValue] = useState<T>(initialState);

  useEffect(() => {
    setValue(initialState);
  }, [initialState]);

  return [value, setValue] as const;
}
